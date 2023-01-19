import {Component, OnInit, ViewChild} from '@angular/core';
import { ApiService, Ticket } from '../api.service';
import {tick} from "@angular/core/testing";
import {Observable, Subscriber, Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['date', 'Student Name', 'problem', 'Device ID', 'Location','Actions', 'View'];
  dayLoanerDisplayedColumns: string[] = ['date', 'Student Name', 'Device ID', 'Actions', 'View'];

  ticketCount = 0;
  dayLoanerCount = 0;
  numberToday = 0;
  //@ts-ignore
  oTickets: Observable<Ticket[]>  = new Observable<Ticket[]>((sub) => {this.updateTickets(sub)})
  //@ts-ignore
  oActiveDayLoaners: Observable<DayLoaner[]> =  new Observable<DayLoaner[]>((sub) => this.updateActiveTickets(sub));

  tickets!: Subscription;
  dayLoaners!: Subscription;

  dataTickets: Ticket[] = [];
  dataDayLoaner: DayLoaner[] = [];
  dataCompletedTickets: Ticket[] = [];

  dataAllTickets: Ticket[] = [];
  isLoading = false;



  //All
  //@ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allDataSource: MatTableDataSource<Ticket> = new MatTableDataSource<Ticket>();

  //Completed
  //@ts-ignore
  completedDataSource: MatTableDataSource<Ticket>;

  //@ts-ignore
  data: Observable<HomeDataObservable>;
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    //this.data = new Observable((sub) => this.updateTickets(sub))
    // this.getTickets();
    // this.autoUpdate();
    this.tickets = this.oTickets.subscribe();
    this.dayLoaners = this.oActiveDayLoaners.subscribe();

    this.updateTickets();
    this.loop();

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

  }

  loop() {
    setTimeout(() => {
      try {
        this.updateTickets()
        this.loop();
      }catch(e) {
        console.log(e);
        setTimeout(() => this.loop(), 30*1000)
      }

    }, 5*1000)
  }

  updateTickets() {
    this.api.QueryTicket({isCurrentlyActive: true}, 20).subscribe((response) => {
      let t = response.tickets;

      let dayLoaners = t.filter((t) => t.ticketIssue == "Day Loaner");
      let c = t.filter((t) => t.ticketIssue != "Day Loaner");

      const sort = (a: Ticket,b: Ticket) => {
        if (a.created != null && b.created != null) {
          let aDate = new Date(`${a.created}`);
          let bDate = new Date(`${b.created}`);
          return -(aDate.getTime() - bDate.getTime());
        } else
          return 0;
      }

      c?.sort(sort);
      dayLoaners.sort(sort);
      this.ticketCount = c.length;
      this.dayLoanerCount = dayLoaners.length;

      let count = 0;
      let now = new Date(Date.now())
      for(let i = 0; i < c.length; i++) {
        let d = new Date(`${c[i].created}`)
        if(now.getFullYear() == d.getFullYear() && now.getMonth() == d.getMonth() && now.getDate() == d.getDate())
          ++count;
      }
      this.numberToday = count;

      this.dataDayLoaner = this.convertToDayLoaner(dayLoaners);
      this.dataTickets = c;
    })

  }

  convertToDayLoaner(t: Ticket[]) {
    let dayLoaners: DayLoaner[] = [];
    const now = new Date(Date.now())
    for (let i = 0; i < t.length; i++) {
      let time = new Date(`${t[i].created}`)
      if(now.getFullYear() == time.getFullYear() && now.getMonth() == time.getMonth() && now.getDate() == time.getDate())
      {
        dayLoaners.push({
          ticket: t[i],
          name: t[i].studentName,
          fresh: true
        })
      } else {
        dayLoaners.push({
          ticket: t[i],
          name: t[i].studentName,
          fresh: false
        })
      }

    }

    return dayLoaners;
  }

  sortByIssue(tickets: Ticket[] ,isDayLoaner = false) {
    let t: Ticket[] = [];
    for(let i = 0; i < tickets.length; i++) {
      if(tickets[i].ticketIssue == "Day Loaner" && isDayLoaner){
        t.push(tickets[i]);
      } else {
        t.push(tickets[i])
      }
    }
    return t;
  }

  getLocation(t: Ticket) {

    switch(t.status) {
      case "Needs Repair":
        return "Cubby " + t.cubbyNumber;
        break;
      case 'Vandalism':
        return "Vandalism : Waiting for Update"
        break;
      case 'Needs to be Returned to Office':
        return `${this.getGrade(t)}${this.getPrefix(this.getGrade(t))} grades return cubby`
        break;
      case 'Waiting for Return':
        return 'In office'
        break;
      case 'Completed':
        return "Returned"
        break;
      default:
        return "Unknown"
        break;
    }
  }

  getGrade(t: Ticket) {
    var d = new Date(Date.now());
    if(d.getMonth() < 6) {
      return d.getFullYear() - (+t.gradYear) + 12;
    }else {
      return  d.getFullYear() - (+t.gradYear) + 13;
    }
  }

  getPrefix(n: number) {
    switch (n){
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }

  }



  autoUpdate() {
    setTimeout(() => {
      this.autoUpdate();
    }, 30 * 1000) //30 seconds

  }

  TicketDateString(t: Ticket): string {
    var d = new Date(`${t.created}`);
    //return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()}`
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }

  IsOld(t: Ticket): boolean {
    let d = new Date(`${t.created}`);
    let now = new Date(Date.now())
    return (d.getFullYear() != now.getFullYear() || d.getMonth() != now.getMonth() || d.getDate() != now.getDate())
  }
  // getTickets() {
  //   this.isLoading = true;
  //   this.api.GetAllTickets().subscribe({
  //     next: (response) => {
  //       if(response.tickets != null) {
  //         this.tickets = response.tickets;
  //         this.sortTickets();
  //       }
  //     }
  //   })
  // }


}
export interface HomeDataObservable {
  activeTickets: Ticket[]
  dayLoaners: DayLoaner[]
}

export interface DayLoaner {
  ticket: Ticket
  name: string,
  fresh: boolean
}
