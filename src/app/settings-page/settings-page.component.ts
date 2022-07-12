import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SnackBarService} from "../snack-bar.service";

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
  constructor(private api: ApiService, private fb: FormBuilder, private snack: SnackBarService) { }

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
    this.api.LinkStudents().subscribe({
      next: any => {
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      }
    })
  }
  LinkStudentTickets(){
    this.loading = true;
    this.api.LinkTicketsToStudents().subscribe({
      next: any => {
        this.snack.error("Updated Tickets")
        this.loading = false;
      },
      error: error => {
        this.snack.error("Error updating tickets")
        this.loading = false;
      }
    })
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


    this.api.UpdateConfig(data).subscribe({
      next: value1 => {
        this.loading = false
      },
      error: error => {
        console.error(error)
        this.loading = false;
      }
    })

  }

}

