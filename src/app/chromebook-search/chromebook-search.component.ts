import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService, Chromebook, Student, User} from '../api.service';

@Component({
  selector: 'app-chromebook-search',
  templateUrl: './chromebook-search.component.html',
  styleUrls: ['./chromebook-search.component.scss']
})
export class ChromebookSearchComponent implements OnInit {

  //@ts-ignore
  form: FormGroup;

  //@ts-ignore
  chromebook: Chromebook;
  //@ts-ignore
  student: Student;
  //@ts-ignore
  user: User;



  loading = false;
  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required]],
      type: ['', [Validators.required]],
      search: ['', [Validators.required]]
    })
  }
  get type() {
    //@ts-ignore
    return this.form.get('type');
  }

  get code() {
    //@ts-ignore
    return this.form.get('code');
  }

  get search() {
    //@ts-ignore
    return this.form.get('search');
  }
  OnSubmit(){
    this.loading = true;
    //@ts-ignore
    this.chromebook = null;
    //@ts-ignore
    this.student = null;
    //@ts-ignore
    this.user= null;

    switch (this.search?.value){
      case 'chromebook':
        //@ts-ignore
        this.api.QueryChromebook(this.type?.value, this.code?.value).subscribe( {
          next: query => {
            this.chromebook = query.chromebook;
            this.loading = false;
          },
          error: error => {
            console.error("Error getting chromebook")
            this.loading = false;
          }

        })
        break;
      case 'student':
        this.api.QueryStudent(this.code?.value).subscribe({
          next: query => {
            this.student = query.student;
            this.loading = false;
          },
          error: error => {
            console.error("Error getting student")
            this.loading = false;
          }
        })
        break;
      case 'user':
        this.api.QueryUser(this.code?.value).subscribe({
          next: query => {
            this.user = query.data;
            this.loading = false;
          },
          error: error => {
            console.error("Error getting User")
            this.loading = false;
          }
        })
        break;
    }


  }

}
