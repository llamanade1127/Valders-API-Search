import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Student, User} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {SnackBarService} from "../snack-bar.service";

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {

  //@ts-ignore
  @Input() user: User
  loading = true;
  studentID: string = "";
  //@ts-ignore
  student: Student;
  hasStudent = false;
  constructor(private api: ApiService, private route: ActivatedRoute, private snack: SnackBarService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.api.QueryUser(params['id'], 'id').subscribe({
        next:(user) => {
          console.log(user)
          this.user = user.data;
          this.api.QueryStudent(this.user.id).subscribe({
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
        },
        error: err => {
          console.log(err)
          this.snack.error("Could not find user");
          this.loading = false;
        }
      })
    })
  }

}
