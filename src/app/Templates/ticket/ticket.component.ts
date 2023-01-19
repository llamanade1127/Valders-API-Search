import {Component, Inject, OnInit} from '@angular/core';
import {ApiService, Chromebook, Student, Ticket} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {SnackBarService} from "../../snack-bar.service";
import { combineLatest } from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AdminDialog} from "../../settings-page/settings-page.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PdfDialog} from "../pdf/pdf.component";
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  form = this.fb.group({
    notes: ['', [Validators.required]],
    chargerCond: ['', [Validators.required]],
    loanerCond: ['', [Validators.required]],
    deviceReturned: ['', [Validators.required]],
    status: ['', []]
  })


  TicketDateString(t: Ticket): string {
    var d = new Date(`${t.created}`);
    //return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()}`
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }
  //@ts-ignore
  Ticket: Ticket;


  //@ts-ignore
  Student: Student;
  //@ts-ignore
  Chromebook: Chromebook;

  //@ts-ignore
  loanerChromebook: Chromebook;
  loading = true;
  constructor(private fb: FormBuilder,private route: ActivatedRoute, private api: ApiService, private snack: SnackBarService, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.params.subscribe({
      next: params => {
        console.log(params)
        this.api.QueryTicket({_id:params["ticketID"]}).subscribe({
          next: ticket => {
            this.Ticket = ticket.tickets[0]
            console.log(this.Ticket)
            //Set form data

            this.form.get('deviceReturned')?.setValue(this.Ticket.isDeviceReturned ? "true" : "false");
            this.form.get('loanerCond')?.setValue(this.Ticket.loanerInGoodCond ? "true" : "false");
            this.form.get('chargerCond')?.setValue(this.Ticket.chargerInGoodCond ? "true" : "false");
            this.form.get('status')?.setValue(this.Ticket.status);

            let students = this.api.QueryStudent(ticket.tickets[0].studentID);
            let chromebook = this.api.QueryChromebook("SERIAL", ticket.tickets[0].damagedDeviceID);

            if(ticket.tickets[0].issuedLoaner) {
              this.api.QueryChromebook('SERIAL', ticket.tickets[0].issuedLoanerID).subscribe({
                next: (d) => this.loanerChromebook = d.chromebook,
                error: () => {
                  this.api.QueryChromebook('VASD', ticket.tickets[0].issuedLoanerID).subscribe((d) => this.loanerChromebook = d.chromebook)
                }
              });
            }



            let stream = combineLatest([students, chromebook]);

            stream.subscribe({
              next: data => {
                this.Student = data[0].student;
                this.Chromebook = data[1].chromebook;


                this.loading = false;
              },error: err => {
                this.loading = false;
                this.snack.error("Could not find students or chromebook using data from the ticket")
              }
            })

          }, error: err => {
            this.loading = false;
            this.snack.error("Could not find ticket");
          }
        })
      },error: paramError => {
        console.log(paramError);
        this.snack.error("Error getting params")
      }

    })


  }

  updateTicket(){
    this.loading = true;

    //@ts-ignore
    this.Ticket.status = this.form.get('status')?.value;
    console.log(this.Ticket)
    this.api.UpdateTicket(this.Ticket).subscribe({
      next: value => {
        this.loading = false;
        this.snack.error("Updated ticket")
      },
      error: err => {
        this.loading = false;
        this.snack.error("Error updating ticket")
      }
    })
  }

  setTicketToComplete() {
    this.Ticket.dateReturned = new Date().toDateString();
    this.Ticket.isCurrentlyActive = !this.Ticket.isCurrentlyActive;
    this.updateTicket();
  }

  deleteTicket() {
    this.loading = true;
    const dialogRef = this.dialog.open(AdminTicketDeleteDialog, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((password: any) => {
      //Check password first
      this.api.CheckAdminPassword(password).subscribe({
        next: (value1: any) => {
          if(value1)
          {
            this.snack.error("Correct password. Deleting ticket")
            this.api.DeleteTicket(this.Ticket).subscribe({
              next: () => {
                this.loading = false;
                this.snack.error('Ticket Deleted')
              },
              error: () => {
                this.loading = false;
                this.snack.error('Failed to delete ticket')
              }
            })
          } else {
            this.loading = false;
            this.snack.error("Incorrect password")
          }

        },
        error: () => {
          this.loading = false;
          this.snack.error("Incorrect password");
        }
      })

    })
  }


  printTicket() {
    const dialogRef = this.dialog.open(PdfDialog, {
      data: {ticket: this.Ticket, damagedDevice: this.Chromebook, loanerChromebook: this.loanerChromebook},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'admin-ticket-delete-dialog',
  templateUrl: 'admin-delete-ticket-dialog.html',
})
export class AdminTicketDeleteDialog {
  //@ts-ignore
  password: string;
  //@ts-ignore
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<AdminTicketDeleteDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


