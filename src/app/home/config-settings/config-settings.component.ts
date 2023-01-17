import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService, Config} from "../../api.service";
import {MatDialog} from "@angular/material/dialog";
import {UpdateAdminPasswordDialog} from "./dialog/admin-dialog";
import {SnackBarService} from "../../snack-bar.service";

@Component({
  selector: 'app-config-settings',
  templateUrl: './config-settings.component.html',
  styleUrls: ['./config-settings.component.scss']
})
export class ConfigSettingsComponent {
  loading = false;
  //@ts-ignore
  config: Config;

  form = this.fb.group({
    loanerPath: ['', [Validators.required]],
  })
  constructor(private fb: FormBuilder, private api: ApiService, public dialog: MatDialog, private snack: SnackBarService) {
  }


  ngOnInit() {
    this.api.GetConfig().subscribe((config) => {
      this.config = config.config
      // @ts-ignore
      this.form.get('loanerPath')?.setValue(this.config.loanerPath);

    })
  }

  validatePasswordChange() {
    this.dialog.open(UpdateAdminPasswordDialog, {data: this.config});
  }
  isValid = false;

  OnSubmit() {
    this.api.UpdateConfig(this.config).subscribe(() => {this.snack.error("Config Updated")})
  }
}
