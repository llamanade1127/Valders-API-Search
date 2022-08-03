import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SnackBarService} from "../snack-bar.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  settingsOptions: string[] = new Array()
  loading = false;
  //@ts-ignore
  form: FormGroup;
  constructor(private api: ApiService, private fb: FormBuilder, private snack: SnackBarService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.form = this.fb.group({
      index: ['', [Validators.required]],
      value: ['', [Validators.required]],
    })
    this.loading = false;
  }
  get index() {
    //@ts-ignore
    return this.form.get('index');
  }

  get value() {
    //@ts-ignore
    return this.form.get('value');
  }


  LinkStudents() {
    this.loading = true;
    const dialogRef = this.dialog.open(AdminDialog, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((password: any) => {
      //Check password first
      this.api.CheckAdminPassword(password).subscribe({
        next: (value1: any) => {
          if(value1)
          {
            this.snack.error("Correct password. Linking students")
            this.api.LinkStudents().subscribe({
              next: () => {
                this.snack.error("Students linked")
                this.loading = false;
              },
              error: () => {
                this.snack.error("error linking students")
                this.loading = false;
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
  LinkStudentTickets(){
    this.loading = true;
    this.api.LinkTicketsToStudents().subscribe({
      next: () => {
        this.snack.error("Updated Tickets")
        this.loading = false;
      },
      error: () => {
        this.snack.error("Error updating tickets")
        this.loading = false;
      }
    })
  }

  TestDialog(){
    const dialogRef = this.dialog.open(AdminDialog, {
      width: '400px',
    });
  }

  OnSubmit(){
    this.loading = true;
    let index = this.index?.value;
    let value = this.value?.value;


    let data = {}


    for (let i = 0; i < this.settingsOptions.length; i++) {
      let sIndex = this.settingsOptions[i].split(':')[0]
      let sData = this.settingsOptions[i].split(':')[1]

      if(sIndex == index)
        sData = value;

      // @ts-ignore
      data[sIndex] = sData;

    }
  }

  WipeStudents() {
    this.loading = true;
    const dialogRef = this.dialog.open(AdminDialog, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((password: any) => {
      //Check password first
      this.api.CheckAdminPassword(password).subscribe({
        next: (value1: any) => {
          if(value1)
          {
            this.snack.error("Correct password. Wiping students")
            this.api.WipeStudents().subscribe({
              next: () => {
                this.loading = false;
                this.snack.error('Students wiped')
              },
              error: () => {
                this.loading = false;
                this.snack.error('Students failed to wipe!')
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

}

@Component({
  selector: 'admin-dialog',
  templateUrl: 'admin-dialog.html',
})
export class AdminDialog {
  //@ts-ignore
  password: string;
  constructor(public dialogRef: MatDialogRef<AdminDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
