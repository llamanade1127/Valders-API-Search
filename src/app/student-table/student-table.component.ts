import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiService, Student} from "../api.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'serialNumber', 'email', 'vasd'];
  data: Student[] = [];




  //@ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  constructor(private db: ApiService) { }

  ngOnInit(): void {
    this.db.GetAllStudents().subscribe((students) => {
      this.isLoadingResults = true;
      this.data = students.students;
      this.isLoadingResults = false;
      console.log(students)
    })
  }

}
