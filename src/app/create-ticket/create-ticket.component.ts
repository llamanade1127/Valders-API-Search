import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService, Chromebook, Student, Ticket } from '../api.service';
import { ChromebookDataComponent } from '../chromebook-data/chromebook-data.component';
import {SnackBarService} from "../snack-bar.service";
import {Router} from "@angular/router";
import { combineLatest } from 'rxjs';
import {query} from "@angular/animations";

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {

  dummy = true;
  searching = false;
  created = false;
  ticketPath = "";



  commonIssues = ["Damaged Screen", "Wont Charge", "Damaged Keyboard", "Damaged Trackpad", "Missing Keys", "Other"]

  FormIndex = 0;
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
    otherIssue: ['', []],
    cubbyNumber: ['', []]
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


  get deviceIssue() {
    return this.damagedDeviceForm.get('deviceIssue')
  }
  currentStudentID = ""
  //@ts-ignore
  //form: FormGroup;
  needsLoaner= false;
  isDayLoaner= true;
  loading = false;
  constructor(private fb: FormBuilder, private api: ApiService, private snack: SnackBarService, private route: Router) { }

  ngOnInit(): void {
    //this.infoGetter();
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


  //Helper methdos
  fillStudentInfo(student: Student) {
    this.Student = student;
    this.Chromebook = student.Chromebook;
    this.chromebookKey = this.Chromebook.serialNumber;
    this.previousKey = this.Chromebook.serialNumber;
    //@ts-ignore
    this.gradYear = student.GInfo.orgUnitPath.split('/').pop()
    this.isVASD = false;
    this.foundStudent = true;
    this.foundChromebook = true;

  }

  checkStudent() {
    if(this.studentInfoForm == null) return this.snack.error("Form is null!")
    var student = this.studentInfoForm.get('studentID')?.value;
    if(student && student != this.previousStudent) {
      this.searching = true;
      this.previousStudent = student;
      var found = false;
      if(student.startsWith('VASD') || student.startsWith("VHS")) {

        this.api.QueryChromebook("VASD",student).subscribe({
          next: data => {
            this.Chromebook = data.chromebook;
            this.isVASD = true;
            this.foundChromebook = true;

            this.api.QueryStudent(this.Chromebook.serialNumber).subscribe({
              next: value => {
                this.fillStudentInfo(value.student);
                found = true;
                this.searching = false;

              }
            })
          },error: () => {
            this.searching = false;
          }
        })
      }
      if(!found)
      {
        this.api.QueryStudent(student).subscribe({
          next: value => {
            this.fillStudentInfo(value.student);
            this.searching = false;
          }, error: err => {

            //Try using chromebook
            this.searching = false;
          }
        })
      }

    }
  }

  checkDamagedDeviceID() {
    this.searching = true;
    var chromebook = this.damagedDeviceForm.get("deviceID")?.value;

    if(chromebook && this.previousKey != chromebook) {
      this.previousKey = chromebook;
      this.api.QueryChromebook("VASD",chromebook).subscribe({
        next: data => {
          this.Chromebook = data.chromebook;
          this.isVASD = true;
          this.foundChromebook = true;
          this.searching = false;
        },error: () => {
          //@ts-ignore
          this.api.QueryChromebook("SERIAL",chromebook).subscribe({
            next: data => {
              this.isVASD = false;
              this.Chromebook = data.chromebook;
              this.foundChromebook = true;
              this.searching = false;
            },error: () => {
              this.foundChromebook = false;
              this.searching = false;
            }
          })
        }
      })
    }
  }

  checkLoanerID() {
     //Find Loaner
     var chromebook = this.loanerForm.get('loanerID')?.value;

     if(chromebook && this.previousLoanerKey != chromebook) {
       this.previousLoanerKey = chromebook;
       this.api.QueryChromebook("VASD",chromebook).subscribe({
         next: data => {
           this.loaner = data.chromebook;
           let setData = ""
           if(data.chromebook.annotatedAssetId.includes("L")){
             setData = data.chromebook.annotatedAssetId.slice(-2);
             if(this.FormIndex == 2)
               this.loanerNumber = setData;
           } else {
             this.api.QueryStudent(data.chromebook.serialNumber).subscribe({
               next: data => {
                 if(this.setLoanerNumber)
                   this.loanerNumber = data.student.Name;
               }
             })
           }

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


  //Student Info
  gradYear = ""
  previousStudent = ""
  setGradYear = false;
  foundStudent = false;
  //@ts-ignore
  Student: Student;

  //Chromebook Info
  //@ts-ignore
  Chromebook: Chromebook;
  chromebookKey = ""
  previousKey = ""
  foundChromebook = false;
  setChromebook = false;
  isVASD = true;

  foundLoaner = false;
  loanerNumber = ""
  //@ts-ignore
  loaner: Chromebook;
  setLoanerNumber = false
  previousLoanerKey = ""

  infoGetter() {
    setTimeout(() => {
      switch(this.FormIndex) {
        case 0:

          break;
        case 1:

          break;
        case 2:

          break;
      }

      this.infoGetter();
    }, 5 * 1000)

  }



  submitTicket(){
    console.log(this.loanerForm.get('givenCharger')?.value);
    //@ts-ignore
    let ticket: Ticket = {}
    if(this.ticketIssue?.value == "Damaged Device"){
      ticket  = {
        studentID: this.Student.GInfo.id,
        studentName: this.Student.Name,
        //@ts-ignore
        cubbyNumber: this.damagedDeviceForm.get("cubbyNumber")?.value,
        //@ts-ignore
        gradYear: this.gradYear,
        //@ts-ignore
        ticketIssue: this.ticketIssue?.value,
        damagedDeviceID: this.Chromebook.serialNumber,
        //@ts-ignore
        deviceIssue: this.GetProblemString(),
        //@ts-ignore
        cause: this.damagedDeviceForm.get('cause')?.value,
        beenAvoided: this.damagedDeviceForm.get('beenAvoided')?.value === "true",
        //@ts-ignore
        doneDifferently: this.damagedDeviceForm.get('doneDifferently')?.value,
        issuedLoaner: this.damagedDeviceForm.get('givenLoaner')?.value === "true",
        //@ts-ignore
        issuedLoanerID: this.loanerForm.get('loanerID')?.value,
        //@ts-ignore
        chargerIssued: this.loanerForm.get('givenCharger')?.value === "true",
        //@ts-ignore
        issuedLoanerNumber: this.loanerForm.get('loanerNumber')?.value,
        loanerInGoodCond: false,
        chargerInGoodCond: false,
        //@ts-ignore
        notes: this.finalForm.get('notes')?.value,
        //@ts-ignore
        loanerIssuedBy: this.finalForm.get('createdBy')?.value,
        isDeviceReturned: false,
        dateReturned: "NA",
        //@ts-ignore
        owner: this.finalForm.get('createdBy')?.value,
        isCurrentlyActive: true,
        created: Date.now()
      }
    } else {
      ticket = {
        studentID: this.Student.GInfo.id,
        studentName: this.Student.Name,
        cubbyNumber: "NA",
        //@ts-ignore
        gradYear: this.gradYear,
        //@ts-ignore
        ticketIssue: this.ticketIssue?.value,
        damagedDeviceID: this.Chromebook.serialNumber,
        //@ts-ignore
        deviceIssue: "NA",
        //@ts-ignore
        cause: "NA",
        beenAvoided: false,
        //@ts-ignore
        doneDifferently: "NA",
        issuedLoaner: true, //Day loaners are loaners, and we want them to show up here.
        //@ts-ignore
        issuedLoanerID: this.loanerForm.get('loanerID')?.value,
        //@ts-ignore
        chargerIssued: this.loanerForm.get('givenCharger')?.value === "true",
        //@ts-ignore
        issuedLoanerNumber: this.loanerForm.get('loanerNumber')?.value,
        loanerInGoodCond: false,
        chargerInGoodCond: false,
        //@ts-ignore
        notes: this.finalForm.get('notes')?.value,
        //@ts-ignore
        loanerIssuedBy: this.finalForm.get('createdBy')?.value,
        isDeviceReturned: false,
        dateReturned: "NA",
        //@ts-ignore
        owner: this.finalForm.get('createdBy')?.value,
        isCurrentlyActive: true,

        created: Date.now()
      }
    }



    console.log(ticket)
    this.loading = true;
    this.api.CreateTicket(ticket).subscribe({
      next: value => {
        console.log(value);
        this.ticketPath = `/chromebook/${value.ticket.damagedDeviceID}/tickets/active/${value.ticket._id}`;
        this.created = true;
        this.snack.error("Successfully created ticket. You can now leave this page");
        this.loading = false;

      },
      error: err => {
        this.snack.error("There was a error creating the ticket")
        this.loading = false;
      }
    })
  }
  GetProblemString() {
    if(this.deviceIssue?.value === this.commonIssues.slice(-1)[0]) return this.damagedDeviceForm.get('otherIssue')?.value

    if(this.damagedDeviceForm.get('otherIssue')?.value == "") return this.deviceIssue?.value;

    return this.deviceIssue?.value + " : " + this.damagedDeviceForm.get("otherIssue")?.value;
  }

  moveBackward() {
    switch (this.FormIndex) {
      case 3:
        if(this.needsLoaner) {
          this.FormIndex = 2;
        } else {
          this.FormIndex = 1;
        }
        this.FormIndex = 2;
        break;
      case 1:
        this.FormIndex = 0;
        break;
      case 2:
        if(!this.isDayLoaner)
        {
          this.FormIndex = 1;
        } else {
          this.FormIndex = 0;
        }
        break;
    }
  }
  moveForward() {
    switch(this.FormIndex){
      case 0:
        if(this.isDayLoaner) {
          this.FormIndex = 2;
        } else {
          this.FormIndex = 1;
        }
        break;
      case 1:
        if(this.needsLoaner){
          this.FormIndex = 2;
        } else {
          this.FormIndex = 3;
        }
        break;
      case 2:
        this.FormIndex = 3;
        break;
    }
  }
  // get givenLoaner(){
  //   return this.form.get('givenLoaner')?.value;
  // }
  // get ticketIssue() {
  //   return this.form.get('ticketIssue')?.value;
  // }
}

