import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService, Chromebook, Student, User} from "../api.service";
import {merge} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SnackBarService} from "../snack-bar.service";

@Component({
  selector: 'app-assign-student-to-chromebook',
  templateUrl: './assign-student-to-chromebook.component.html',
  styleUrls: ['./assign-student-to-chromebook.component.scss']
})
export class AssignStudentToChromebookComponent implements OnInit {
  //@ts-ignore
  form: FormGroup;

  //@ts-ignore
  student: Student;

  //@ts-ignore
  user: User;

  //@ts-ignore
  chromebook: Chromebook

  loading = true;

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private snack:SnackBarService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.api.QueryChromebook("SERIAL", params['id']).subscribe({
        next: chromebook => {
          this.chromebook = chromebook.chromebook;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log(err);
        }
      })
    })
    this.form = this.fb.group({
      id: ['', [Validators.required]],
    })

  }

  get id() {
    return this.form.get('id')
  }

  OnSubmit() {
    //@ts-ignore
    this.student = null;

    //@ts-ignore
    this.user = null;
    this.api.QueryStudent(this.id?.value).subscribe({
      next: student => {
        this.student = student.student;
        this.loading = false;
      },
      error: err => {
        this.api.QueryUser(this.id?.value).subscribe({
          next: value => {
            this.user = value.data;
            this.loading = false;
          },
          error: err => {
            this.loading = false;
          }
        })
      }
    })
  }
  UpdateStudent(){
    this.student.Chromebook.serialNumber = this.chromebook.serialNumber;
    this.api.UpdateReturnParameters(this.student).subscribe({
      next: data => {
        this.loading = false;
        this.snack.error("Updated student")
      },
      error: data => {
        this.loading = false;
        this.snack.error("Error setting student")
      }
    })


  }
}
