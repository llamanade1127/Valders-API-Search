import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService, Chromebook, Student } from '../api.service';
import { ChromebookDataComponent } from '../chromebook-data/chromebook-data.component';

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
                if(!this.foundStudent && !this.setChromebook && this.Student.Chromebook){
                  this.Chromebook = student.student.Chromebook;
                  this.chromebookKey = this.Chromebook.serialNumber;
                }
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
      this.checkChromebook();
      this.checkLoanerID();
    }, 1000)



  }
  //@ts-ignore
  Chromebook: Chromebook;
  chromebookKey = ""
  previousKey = ""
  foundChromebook = false;
  setChromebook = false;
  checkChromebook(){
    let chromebook = this.damagedDeviceForm.get('deviceID')?.value;
    if(this.previousKey != chromebook && chromebook){
        this.previousKey = chromebook;
        this.api.QueryChromebook("VASD",chromebook).subscribe({
          next: data => {
            this.Chromebook = data.chromebook;
            this.foundChromebook = true;
          },error: () => {
            //@ts-ignore
            this.api.QueryChromebook("SERIAL",chromebook).subscribe({
              next: data => {
                this.Chromebook = data.chromebook;
                this.foundChromebook = true;
              },error: () => {
                this.foundChromebook = false;
              }
            })
          }
        })
      }
  }

  foundLoaner = false;
  loanerNumber = ""
  //@ts-ignore
  loaner: Chromebook;
  setLoanerNumber = false
  previousLoanerKey = ""
  checkLoanerID(){

      let chromebook = this.loanerForm.get('loanerID')?.value;
      if(this.previousLoanerKey != chromebook && chromebook){
        this.previousLoanerKey = chromebook;
        this.api.QueryChromebook("VASD",chromebook).subscribe({
          next: data => {
            this.loaner = data.chromebook;
            if(!this.setLoanerNumber)
              this.loanerNumber = data.chromebook.annotatedAssetId.slice(-2)
            this.foundLoaner = true;
          },error: () => {
            //@ts-ignore
            this.api.QueryChromebook("SERIAL",chromebook).subscribe({
              next: data => {
                this.loaner = data.chromebook;
                if(!this.setLoanerNumber)
                  this.loanerNumber = data.chromebook.annotatedAssetId.slice(-2)
                this.foundLoaner = true;
            },error: () => {
              this.foundLoaner = false;
              this.setLoanerNumber = false;
            }
          })
        }
      })
    }
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
