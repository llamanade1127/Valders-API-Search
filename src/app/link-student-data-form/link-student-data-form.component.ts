import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService, ReturnInfoQuery} from "../api.service";
import {SnackBarService} from "../snack-bar.service";

@Component({
  selector: 'app-link-student-data-form',
  templateUrl: './link-student-data-form.component.html',
  styleUrls: ['./link-student-data-form.component.scss']
})
export class LinkStudentDataFormComponent implements OnInit {
  loading = false;
  //@ts-ignore
  form: FormGroup;
  constructor( private fb: FormBuilder, private api: ApiService, private snack: SnackBarService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      page: ['', [Validators.required]],
      csi: ['', [Validators.required]], //Chromebook serial Index
      cri: ['', [Validators.required]], //Chromebook return Index
      cari: ['', [Validators.required]], //Case return Index
      chri: ['', [Validators.required]], //Charger return Index
      rni: ['',[Validators.required]] //Return Notes Index
    })
  }

  get id(){
    return this.form.get('id')
  }
  get page(){
    return this.form.get('page')
  }
  get csi(){
    return this.form.get('csi')
  }
  get cri(){
    return this.form.get('cri')
  }
  get cari(){
    return this.form.get('cari')
  }
  get chri(){
    return this.form.get('chri')
  }

  get rni(){
    return this.form.get('rni')
  }

  OnSubmit(){
    this.loading = true;
    let query: ReturnInfoQuery = {
      sheetID: this.id?.value,
      sheetPage: this.page?.value,
      chromebookSerialIndex: this.csi?.value,
      chromebookReturnedIndex: this.cri?.value,
      chargerReturnedIndex: this.chri?.value,
      caseReturnedIndex: this.cari?.value,
      notesIndex: this.rni?.value
    }
    this.api.UpdateBySheets(query).subscribe({
      next: value => {
        this.loading = false;
        this.snack.error("Updated students by sheets")
      },
      error: err => {
        this.loading = false;
        this.snack.error(err)
      }
    })
  }
}
