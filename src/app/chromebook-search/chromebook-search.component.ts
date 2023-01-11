import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService, Chromebook, Student, Ticket, User} from '../api.service';
import {SnackBarService} from "../snack-bar.service";
import {Router} from "@angular/router";
import {tick} from "@angular/core/testing";

@Component({
  selector: 'app-chromebook-search',
  templateUrl: './chromebook-search.component.html',
  styleUrls: ['./chromebook-search.component.scss']
})
export class ChromebookSearchComponent implements OnInit {

  //@ts-ignore
  form: FormGroup;

  //@ts-ignore
  chromebook: Chromebook;
  //@ts-ignore
  student: Student;
  //@ts-ignore
  user: User;

  tickets: Ticket[] = []
  commonIssues = ["Damaged Screen", "Wont Charge", "Damaged Keyboard", "Damaged Trackpad", "Missing Keys", "Other"]

  ticketSearchOptions= [
    ["all", "Get All Tickets"],
    ["_id", "Ticket ID"],
    ["studentID", "Student ID"],
    ["ticketIssue", "Ticket Issue (Day loaner or Damaged Device)"],
    ["damagedDeviceID", "Damaged Device ID"],
    ["issuedLoanerID", "Issued Loaner ID"],
    ["owner", "Ticket Owner"],
    ["deviceIssue", "Damaged Device Issue"]
    //["isCurrentlyActive", "Is Currently Active (True or False)"],

  ]


  loading = false;
  constructor(private api: ApiService, private fb: FormBuilder, private snackBar: SnackBarService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required]],
      type: ['', [Validators.required]],
      searchForActive: ['', []],
      ticketSelectOptions: ['', []],
      search: ['', [Validators.required]]
    })
  }
  get type() {
    //@ts-ignore
    return this.form.get('type');
  }

  get code() {
    //@ts-ignore
    return this.form.get('code');
  }
  get searchForActive() {
    return this.form.get('searchForActive');
  }
  get ticketSelectOptions() {
    return this.form.get('ticketSelectOptions');
  }
  get search() {
    //@ts-ignore
    return this.form.get('search');
  }

  sortTickets(oldToNew = true) {
    this.tickets?.sort((a,b) => {
      if(a.created != null && b.created != null) {
        let aDate = new Date(`${a.created}`);
        let bDate = new Date(`${b.created}`);
        console.log(aDate.getTime() - bDate.getTime() > 0)
        if(oldToNew)
          return -(aDate.getTime() - bDate.getTime());
        else return aDate.getTime() - bDate.getTime()
      }
      else
        return 0;
    })
  }

  OnSubmit(){
    this.loading = true;
    this.tickets = [];
    //@ts-ignore
    this.chromebook = null;
    //@ts-ignore
    this.student = null;
    //@ts-ignore
    this.user= null;

    switch (this.search?.value){
      case 'chromebook':
        //@ts-ignore
        this.api.QueryChromebook(this.type?.value, this.code?.value).subscribe( {
          next: query => {
            //this.chromebook = query.chromebook;
            this.router.navigateByUrl(`/chromebook/${query.chromebook.serialNumber}`)
            this.loading = false;
          },
          error: error => {
            console.error("Error getting chromebook")
            this.snackBar.error("Error getting chromebook.")
            this.loading = false;
          }

        })
        break;
      case 'student':
        this.api.QueryStudent(this.code?.value).subscribe({
          next: query => {

            this.router.navigateByUrl(`/student/${query.student.GInfo.id}`)

            this.loading = false;
          },
          error: error => {
            console.error("Error getting student")

            this.snackBar.error(error.message)
            this.loading = false;
          }
        })
        break;
      case 'user':
        this.api.QueryUser(this.code?.value, this.type?.value).subscribe({
          next: query => {
            console.log(query)
            this.router.navigateByUrl(`/user/${query.data.id}`)

            this.loading = false;
          },
          error: error => {
            console.error("Error getting User")
            this.snackBar.error("Error getting user.")
            this.loading = false;
          }
        })
        break;
      case 'ticket':
        //console.log((JSON.parse(`{${this.type?.value}:${this.code?.value}}`)));
        //@ts-ignore
        this.api.QueryTicket(this.getTicketCodeFromForm()).subscribe({
          next: tickets => {
            this.loading = false;
            if(tickets.tickets.length > 1) {
              //Display all tickets matching
              this.tickets = tickets.tickets;
              this.sortTickets();
              this.snackBar.error("Multiple tickets found")
            } else if (tickets.tickets.length == 1){
              //Go to ticket
              this.router.navigateByUrl(`/chromebook/${tickets.tickets[0].damagedDeviceID}/tickets/${tickets.tickets[0].isCurrentlyActive ? 'active' : 'completed'}/${tickets.tickets[0]._id}`)
            } else {
              this.snackBar.error("Could not find any tickets")
            }
          }, error: any => {
            this.snackBar.error("Error getting ticket")
            this.loading = false;
          }
        })
        break;
    }


  }

  getTicketCodeFromForm() {
    if(this.type?.value == "deviceIssue") {
      return `{"${this.type.value}": { "$regex": ".*${this.ticketSelectOptions?.value}*."}}`
    }
    if(this.type?.value == "all") {
      return {isCurrentlyActive: this.searchForActive?.value}
    } else {
      return `{"${this.type?.value}":"${this.code?.value}", "isCurrentlyActive": ${this.searchForActive?.value}}`
    }
  }

}
