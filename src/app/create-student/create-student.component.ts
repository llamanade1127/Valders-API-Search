import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../api.service";
import {combineLatest, first, of, pipe} from "rxjs";
import {SnackBarService} from "../snack-bar.service";

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss']
})
export class CreateStudentComponent implements OnInit {

  //@ts-ignore
  form: FormGroup;
  loading = true;
  canOverwrite = false;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: SnackBarService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      cst: ['', [Validators.required]],
      gust: ['', [Validators.required]],
      chromebookCode: ['', [Validators.required]],
      studentCode: ['', [Validators.required]]
    })
    this.loading = false;
  }


  get chromebookCode(){
    return this.form.get("chromebookCode")
  }

  get studentCode(){
    return this.form.get("studentCode")
  }
  get gust(){
    return this.form.get("gust")
  }
  get cst(){
    return this.form.get("cst")
  }

  async OnSubmit(){
    let student = this.api.QueryUser( this.studentCode?.value,this.gust?.value);
    let chromebook = this.api.QueryChromebook(this.cst?.value, this.chromebookCode?.value);

    combineLatest(student, chromebook).pipe(first()).subscribe(([studentVal, chromebookVal]) => {
      this.api.QueryStudent(chromebookVal.chromebook.serialNumber).subscribe({
        next: value => {
          console.log(value)
          //Update the student
          if(value.student.PrimaryEmail !== "NONE" && !this.canOverwrite)
            return this.snack.error("Chromebook already has a user assigned to them")

          value.student.GInfo.id = studentVal.data.id;
          value.student.PrimaryEmail = studentVal.data.primaryEmail;
          value.student.Name = studentVal.data.name.givenName;

          this.api.UpdateReturnParameters(value.student).subscribe({
            next: vl => {
              this.snack.error("User updated!")
            },
            error: err => {
              this.snack.error("Error uploading student")
            }
          });
        },
        error: err => {
          this.api.QueryStudent(studentVal.data.id).subscribe({
            next: val => {
              if(!this.canOverwrite)
                return this.snack.error("You don have permissions to overwrite")

              val.student.Chromebook.serialNumber = chromebookVal.chromebook.serialNumber;
              this.api.UpdateReturnParameters(val.student).subscribe({
                next: vl => {
                  this.snack.error("User updated!")
                },
                error: err => {
                  this.snack.error("Error uploading student")
                }
              });
            }
          })
        }
      })
    })
  }


}
