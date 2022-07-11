import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Student} from "../api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {SnackBarService} from "../snack-bar.service";

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.scss']
})
export class StudentDataComponent implements OnInit {
  //@ts-ignore
  form: FormGroup;
  studentID: string = "";
  loading = true;
  foundStudent = true;
  //@ts-ignore
  @Input() student: Student
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private api: ApiService, private snack: SnackBarService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loading = true;
       this.studentID =  params['id'];

       this.api.QueryStudent(this.studentID).subscribe({
         next: (student) => {
           this.student = student.student;
           this.foundStudent = true;
           this.loading = false;
         },

         error: (err) => {
           this.foundStudent = false;
           this.loading = false;
           this.snack.error("Could not find student")

         }

       })
    })

    this.form = this.fb.group({
      Notes: ['', []],
    })

  }

  updateChromebook() {

  }

  updateCharger() {

  }

  updateCase() {

  }

  get Notes(){
    return this.form.get("Notes");
  }

  updateNotes(){

  }
}
