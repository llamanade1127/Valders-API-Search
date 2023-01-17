import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApiService, Chromebook, Loaner, Ticket} from "../../../api.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PdfDialog} from "../../../Templates/pdf/pdf.component";
import {SnackBarService} from "../../../snack-bar.service";

@Component({
  selector: 'app-loaners',
  templateUrl: './loaners.component.html',
  styleUrls: ['./loaners.component.scss']
})
export class LoanersComponent implements AfterViewInit {
  displayedColumns: string[] = ['sn', 'vasd', 'Model', 'loanerNumber', 'ticket', 'actions'];
  dataSource = new MatTableDataSource<Loaner>();
  loading = false;
  constructor(private api: ApiService, private snack: SnackBarService, public dialog: MatDialog) {
  }


  ngOnInit(): void {
    //this.data = new Observable((sub) => this.updateTickets(sub))
    // this.getTickets();
    // this.autoUpdate();
    this.updateLoaners();

  }

  deleteLoaner(l: Loaner) {
    this.loading = true;
    this.api.DeleteLoaner(l).subscribe(() => {this.loading = false;});
  }

  updateLoaners() {
    this.api.QueryLoaners('{}').subscribe({
        next: (d) => {
          console.log(d);
          this.dataSource.data = d.query;
          this.loop()
        },
      error: err => {
          this.dataSource.data = [];
          this.loop()
      }
    })
  }



  loop() {
    setTimeout(this.updateLoaners, 5 * 1000)
  }



  //@ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  add() {
    const dialogRef = this.dialog.open(AddLoanerDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}


@Component({
  selector: 'add-loaner-dialog',
  styleUrls:['./add-loaner.scss'],
  templateUrl: 'add-loaner-dialog.html',
})
export class AddLoanerDialog {
  //@ts-ignore
  loaner: Loaner = {};

  //@ts-ignore
  chromebook: Chromebook;
  //@ts-ignore
  form = this.fb.group({
    code: ['', [Validators.required]],
    loanerNumber: ['', [Validators.required]],
  })
  isValid = false;

  checkLoaner() {
    if(this.form.get('code')?.value?.startsWith("V")) {
      //@ts-ignore
      this.api.QueryChromebook('VASD', this.form.get('code')?.value).subscribe({
        next: (d) => {
          this.loaner.serialNumber = d.chromebook.serialNumber;
          //@ts-ignore
          this.loaner.vasdCode = this.form.get('code')?.value;
          this.loaner.model = d.chromebook.model
          this.chromebook = d.chromebook;
          this.isValid = true;
        }, error: () => {
          this.isValid = false;
        }
      })
    }else {
      //@ts-ignore
      this.api.QueryChromebook('SERIAL', this.form.get('code')?.value).subscribe({
        next: (d) => {
          this.loaner.serialNumber = d.chromebook.serialNumber;
          //@ts-ignore
          this.loaner.vasdCode = this.form.get('code')?.value;
          this.loaner.model = d.chromebook.model
          this.chromebook = d.chromebook;
          this.isValid = true;
        }, error: () => {
          this.isValid = false;
        }
      })
    }


  }
  OnSubmit() {
    console.log(this.loaner);
    //@ts-ignore
    this.loaner.loanerNumber = this.form.get("loanerNumber")?.value
    this.loaner.assignedTicket = "NONE";
    this.loaner.pastTickets = [];


    this.api.PostLoaner(this.loaner).subscribe((d) => {  this.dialogRef.close();})
  }

  constructor(public dialogRef: MatDialogRef<AddLoanerDialog>, private fb: FormBuilder, private api: ApiService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
