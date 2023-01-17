import {Component, Inject} from "@angular/core";
import {ApiService, Chromebook, Loaner, Config} from "../../../api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IPDFDialog} from "../../../Templates/pdf/pdf.component";
import {SnackBarService} from "../../../snack-bar.service";

@Component({
  selector: 'update-admin-dialog',
  styleUrls:['./admin-dialog.scss'],
  templateUrl: 'admin-dialog.html',
})
export class UpdateAdminPasswordDialog {

  //@ts-ignore
  form = this.fb.group({
    current: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    newCheck: ['', [Validators.required]],
  })
  isValid = false;
  passwordsMatch = false;
  checkAdminPassword() {
    this.isValid = this.data.adminPassword == this.form.get('current')?.value
  }

  checkNewPasswords() {
    this.passwordsMatch = this.form.get('newPassword')?.value == this.form.get('newCheck')?.value
  }
  OnSubmit() {
    //@ts-ignore
    this.data.adminPassword = this.form.get('newPassword')?.value;
    this.api.UpdateConfig(this.data).subscribe(() => {
      this.snack.error("Config Updated")
      this.dialogRef.close();
    })
  }

  constructor(public dialogRef: MatDialogRef<UpdateAdminPasswordDialog>,
              private fb: FormBuilder,
              private snack: SnackBarService,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) public data: Config
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
