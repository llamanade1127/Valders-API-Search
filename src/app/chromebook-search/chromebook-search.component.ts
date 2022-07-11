import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService, Chromebook, Student, User} from '../api.service';
import {SnackBarService} from "../snack-bar.service";
import {Router} from "@angular/router";

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
  constructor(private api: ApiService, private fb: FormBuilder, private snackBar: SnackBarService, private router: Router) { }

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
            //this.chromebook = query.chromebook;
            this.router.navigateByUrl(`./chromebook/${query.chromebook.serialNumber}`)
            this.loading = false;
          },
          error: error => {
            console.error("Error getting chromebook")
            this.snackBar.error("Error getting chromebook.")
            this.loading = false;
          }

        })
        break;
      case 'student':
        this.api.QueryStudent(this.code?.value).subscribe({
          next: query => {

            this.router.navigateByUrl(`/student/${query.student.GInfo.id}`)

            this.loading = false;
          },
          error: error => {
            console.error("Error getting student")

            this.snackBar.error(error.message)
            this.loading = false;
          }
        })
        break;
      case 'user':
        this.api.QueryUser(this.code?.value).subscribe({
          next: query => {
            this.router.navigateByUrl(`./user/${query.data.id}`)

            this.loading = false;
          },
          error: error => {
            console.error("Error getting User")
            this.snackBar.error("Error getting user.")
            this.loading = false;
          }
        })
        break;
    }


  }

}
