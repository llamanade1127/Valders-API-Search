import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Chromebook, Student, User} from "../api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackBarService} from "../snack-bar.service";

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.scss']
})
export class StudentDataComponent implements OnInit {

  isUpdatingStudent = false;
  newStudentID = ""
  studentSearchType = ""

  //@ts-ignore
  form: FormGroup;
  studentID: string = "";
  loading = true;
  foundStudent = true;
  //@ts-ignore
  @Input() student: Student
  //@ts-ignore
  chromebook: Chromebook;
  //@ts-ignore
  user: User;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private api: ApiService, private snack: SnackBarService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loading = true;
       this.studentID =  params['id'];

       this.api.QueryStudent(this.studentID).subscribe({
         next: (student) => {
           console.log(student)
           this.student = student.student;
           this.user = student.student.GInfo;
           this.chromebook = student.student.Chromebook;
           console.log(this.student.ReturnData)


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

  UpdateData() {

    this.loading = true;
    this.api.UpdateReturnParameters(this.student).subscribe({
      next: data => {
        this.loading = false;
        this.snack.error("Successfully updated student")
        this.router.navigateByUrl(`/student/${this.student.Chromebook.serialNumber}`)
      },
      error: err => {
        this.snack.error(err);
      }
    });
  }

  get Notes(){
    return this.form.get("Notes");
  }

  UpdateStudentID(){
    this.api.QueryStudent(this.newStudentID).subscribe({
      next: value => {
        this.snack.error("This student is already assigned a chromebook. You must unassign them first")
      }
    })
    this.api.QueryUser(this.newStudentID, this.studentSearchType).subscribe({
      next: value => {
        this.student.Name = value.data.name.fullName;
        //@ts-ignore
        this.student.GInfo = value.data;
        this.api.UpdateReturnParameters(this.student, "SERIAL").subscribe({
          next: val => {
            console.log(val)
            this.snack.error("Student Updated")
            this.router.navigateByUrl(`/student/${this.student.Chromebook.serialNumber}`)
          },
          error: err => {
            this.snack.error("Error updating student")
          }
        })
      },
      error: err => {
        this.snack.error("Could not find Google User!")
      }
    })
  }

  SetTicketToComplete(id: string){
    this.api.SetTicketToComplete(id).subscribe({
      next: ticket => {
        this.snack.error("Ticket moved to completed tickets folder")
        this.student.Tickets.splice(this.student.Tickets.indexOf(id), 1)
        this.api.UpdateReturnParameters(this.student);
      },
      error: err => {
        this.snack.error("Error setting ticket to complete")
      }
    })
  }

  RemoveStudent(){
    this.loading = true;
    this.api.RemoveUserFromStudentAndSave(this.student).subscribe({
      next: val => {
        this.snack.error("Successfully removed student")
        this.loading = false;
        this.router.navigateByUrl(`/student/${this.student.Chromebook.serialNumber}`)
      },
      error: err => {
        this.snack.error("Error updating student");
        this.loading = false;
      }
    })
  }

}
