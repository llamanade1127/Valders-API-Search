import { Component, Input, OnInit } from '@angular/core';
import {ApiService, Chromebook, Student} from "../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chromebook-data',
  templateUrl: './chromebook-data.component.html',
  styleUrls: ['./chromebook-data.component.scss']
})
export class ChromebookDataComponent implements OnInit {

  loading = true;
  //@ts-ignore
  @Input() chromebook: Chromebook;
  hasStudent = false;
  studentID = ""
  //@ts-ignore
  student: Student;
  constructor(private routes: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      const sn = params['id'];
      this.api.QueryChromebook("SERIAL", sn).subscribe({
        next: chromebook => {
          this.chromebook = chromebook.chromebook;
          this.api.QueryStudent(this.chromebook.serialNumber).subscribe({
            next: student => {
              this.studentID = student.student.GInfo.id;
              this.student = student.student;
              this.hasStudent = true;
              this.loading = false;
            },
            error: any => {
              this.hasStudent = false;
              this.loading = false;
            }
          })
          this.loading = false;
        },
        error: err => {

        }
      })
    })
  }

  AssignStudent() {

  }


}
