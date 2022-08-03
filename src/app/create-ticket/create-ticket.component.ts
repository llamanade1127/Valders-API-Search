import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService, Student } from '../api.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {


  studentInfoForm = this.fb.group({
    studentID: ['', [Validators.required]],
    gradYear: ['', [Validators.required]],
    ticketIssue: ['', [Validators.required]],
  })

  damagedDeviceForm = this.fb.group({
    deviceID: ['', [Validators.required]],
    cause: ['', [Validators.required]],
    deviceIssue: ['', [Validators.required]], 
    beenAvoided: ['', [Validators.required]], 
    doneDifferently: ['', [Validators.required]],
    isLoaner: ['', Validators.required], 
    givenLoaner: ['', [Validators.required]], 
  })

  loanerForm = this.fb.group({
    loanerID: ['',[Validators.required]], 
    loanerNumber: ['',[Validators.required]],
    givenCharger: ['',[Validators.required]],
  })

  finalForm = this.fb.group({
    notes: ['', [Validators.required]], 
    createdBy: ['',[Validators.required]] 
  })


  currentStudentID = ""
  //@ts-ignore
  //form: FormGroup;
  needsLoaner= false;
  isDayLoaner= true;
  loading = false;
  constructor(private fb: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.checkStudent();
    // this.form = this.fb.group({
    //   studentID: ['', [Validators.required]],
    //   deviceID: ['', [Validators.required]],
    //   gradYear: ['', [Validators.required]],
    //   cause: ['', [Validators.required]],
    //   ticketIssue: ['', [Validators.required]],
    //   isLoaner: ['', [Validators.required]],
    //   deviceIssue: ['', [Validators.required]], //Chromebook serial Index
    //   doneDifferently: ['', [Validators.required]], //Chromebook return Index
    //   notes: ['', [Validators.required]], //Case return Index
    //   givenLoaner: ['', [Validators.required]], //Charger return Index
    //   loanerID: ['',[Validators.required]], //Return Notes Index,
    //   givenCharger: ['',[Validators.required]],
    //   createdBy: ['',[Validators.required]] //Return Notes Index
    // })
  
  }

  get ticketIssue(){
    return this.studentInfoForm.get('ticketIssue')
  }

  get givenLoaner() {
    return this.damagedDeviceForm.get('givenLoaner')
  }

  previousStudent = ""
  foundStudent = false;
  //@ts-ignore
  Student: Student;
  checkStudent(){
  
    setTimeout(() => {
      let student = this.studentInfoForm.get('studentID')?.value;
      if(student != this.previousStudent && student){
        this.previousStudent = student;
        this.api.ForceQueryUser(student).subscribe({
          next: user => {
            this.api.QueryStudent(user.data.id).subscribe({
              next: student => {
                this.Student = student.student;
                this.foundStudent = true;
              },
              error: err => {
                this.foundStudent = false;
              }
            })
          }, error: err => {
            this.foundStudent = false;
          }
        })
      }
      console.log(this.studentInfoForm.get('studentID')?.value)
      this.checkStudent()
    }, 1000)

  }
  
  submitTicket(){

  }
  // get givenLoaner(){
  //   return this.form.get('givenLoaner')?.value;
  // }
  // get ticketIssue() {
  //   return this.form.get('ticketIssue')?.value;
  // }
}
