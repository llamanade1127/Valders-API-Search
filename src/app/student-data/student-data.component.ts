import {Component, Input, OnInit} from '@angular/core';
import {Student} from "../api.service";

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.scss']
})
export class StudentDataComponent implements OnInit {

  //@ts-ignore
  @Input() student: Student
  constructor() { }

  ngOnInit(): void {
  }

}
