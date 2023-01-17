import { Component, Input, OnInit } from '@angular/core';
import {ApiService, Chromebook, Student, Ticket} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {SnackBarService} from "../snack-bar.service";

@Component({
  selector: 'app-chromebook-data',
  templateUrl: './chromebook-data.component.html',
  styleUrls: ['./chromebook-data.component.scss']
})
export class ChromebookDataComponent implements OnInit {
  isLoaner = false;

  assignedTickets: Ticket[] = [];
  loading = true;
  //@ts-ignore
  @Input() chromebook: Chromebook;
  hasStudent = false;
  studentID = ""
  //@ts-ignore
  student: Student;

  //@ts-ignore
  recentUserStudent: Student;
  constructor(private routes: ActivatedRoute, private api: ApiService, private snack: SnackBarService) { }

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      const sn = params['id'];
      this.api.QueryChromebook("SERIAL", sn).subscribe({
        next: chromebook => {
          this.chromebook = chromebook.chromebook;
          console.log(this.chromebook.annotatedAssetId)
          if(this.chromebook.annotatedAssetId.includes('L'))
          {
            console.log('Is loaner')
            this.isLoaner = true;
            //Get all tickets assigned to loaner
            this.api.QueryTicket(`{"issuedLoanerID": "${this.chromebook.annotatedAssetId}", "isCurrentlyActive": true}`).subscribe({
              next: Tickets => {
                this.assignedTickets = Tickets.tickets;
              }
            })
          } else {
            this.api.QueryTicket(`{"damagedDeviceID": "${this.chromebook.serialNumber}",  "isCurrentlyActive": true}`).subscribe({
              next: Tickets => {
                this.assignedTickets = Tickets.tickets;
              }
            })
          }
          this.api.QueryStudent(this.chromebook.serialNumber).subscribe({
            next: student => {
              console.log(student)

              if(student.student.GInfo == null){
                this.studentID = student.student.Name;
              } else {
                this.studentID = student.student.GInfo.id;
              }

              this.student = student.student;
              this.hasStudent = true;
              this.loading = false;
            },
            error: any => {
              this.hasStudent = false;
              this.loading = false;
            }
          })
          this.api.QueryStudent(this.chromebook.recentUsers[0].email).subscribe({
            next: data => {
              this.recentUserStudent = data.student;
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


  setTicketToComplete(ticket: Ticket) {
    this.loading = true;
    ticket.isCurrentlyActive = false;
    ticket.chargerInGoodCond = true;
    ticket.loanerInGoodCond = true;
    ticket.isDeviceReturned = true;
    ticket.dateReturned = new Date().toDateString();

    this.api.UpdateTicket(ticket).subscribe({
      next: Ticket => {
        this.loading = false;
        this.snack.error("Updated ticket")
      }, error: err => {
        this.loading = false;
        this.snack.error("Error setting ticket to complete")

      }
    })
  }

}
