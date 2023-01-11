import { Component, OnInit } from '@angular/core';
import { ApiService, Ticket } from '../api.service';
import {tick} from "@angular/core/testing";
import {Observable, Subscriber, Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  ticketCount = 0;
  dayLoanerCount = 0;
  numberToday = 0;
  //@ts-ignore
  oTickets: Observable<Ticket[]>  = new Observable<Ticket[]>((sub) => {this.updateTickets(sub)})
  //@ts-ignore
  oActiveDayLoaners: Observable<DayLoaner[]> =  new Observable<DayLoaner[]>((sub) => this.updateActiveTickets(sub));

  tickets!: Subscription;
  dayLoaners!: Subscription;
  isLoading = false;

  //@ts-ignore
  data: Observable<HomeDataObservable>;
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    //this.data = new Observable((sub) => this.updateTickets(sub))
    // this.getTickets();
    // this.autoUpdate();
    this.tickets = this.oTickets.subscribe();
    this.dayLoaners = this.oActiveDayLoaners.subscribe();
  }

  // numberOfTicketsToday() {
  //   let temp = [...this.tickets]
  //   let today = new Date(Date.now())
  //   let count = 0;
  //   for (const ticketsKey of temp) {
  //     if("created" in ticketsKey) {
  //       let t = new Date(`${ticketsKey.created}`);
  //       if(today.getFullYear() == t.getFullYear() && today.getMonth() == t.getMonth() &&today.getDate() == t.getDate())
  //         ++count;
  //     } else {
  //       //@ts-ignore
  //       let t = new Date(`${ticketsKey.ticket.created}`);
  //       if(today.getFullYear() == t.getFullYear() && today.getMonth() == t.getMonth() &&today.getDate() == t.getDate())
  //         ++count;
  //     }
  //   }
  //   return count;
  // }
  // sortTickets() {
  //   this.isLoading = true;
  //   console.log(this.tickets)
  //   this.tickets?.sort((a,b) => {
  //     if(a.created != null && b.created != null) {
  //       let aDate = new Date(`${a.created}`);
  //       let bDate = new Date(`${b.created}`);
  //       console.log(aDate.getTime() - bDate.getTime() > 0)
  //       return -(aDate.getTime() - bDate.getTime());
  //     }
  //     else
  //       return 0;
  //   })
  //
  //   if(this.tickets) {
  //     this.activeDayLoaners = [];
  //     for(var i = 0; i < this.tickets?.length; i++) {
  //       if(this.tickets[i].ticketIssue == "Day Loaner") {
  //         this.activeDayLoaners?.push({fresh: false, ticket: this.tickets[i], name: this.tickets[i].studentName});
  //         this.tickets.splice(i,1);
  //       }
  //     }
  //   }
  //   this.isLoading = false;
  // }

  //
  // updateTickets(observer: Subscriber<HomeDataObservable>) {
  //   this.api.GetAllTickets().subscribe((response) => {
  //     let t = response.tickets;
  //     for (let i = 0; i < t.length; i++) {
  //       let found = false;
  //       if(t[i].ticketIssue == "Day Loaner") {
  //
  //         for(let j = 0; j < this.activeDayLoaners.length; j++) {
  //           if(this.activeDayLoaners[j].ticket == t[i]) found = true;
  //         }
  //
  //         if(found) {
  //           this.activeDayLoaners?.push({fresh: false, ticket: t[i], name: t[i].studentName});
  //         }
  //
  //       } else {
  //         for (let j = 0; j < this.tickets.length; j++) {
  //           if(this.tickets[j] == t[i]) found = true;
  //         }
  //
  //         if(found) this.tickets.push(t[i]);
  //       }
  //
  //     }
  //
  //     this.tickets?.sort((a,b) => {
  //       if(a.created != null && b.created != null) {
  //         let aDate = new Date(`${a.created}`);
  //         let bDate = new Date(`${b.created}`);
  //         console.log(aDate.getTime() - bDate.getTime() > 0)
  //         return -(aDate.getTime() - bDate.getTime());
  //       }
  //       else
  //         return 0;
  //     })
  //
  //     this.activeDayLoaners?.sort((a,b) => {
  //       if(a.ticket.created != null && b.ticket.created != null) {
  //         let aDate = new Date(`${a.ticket.created}`);
  //         let bDate = new Date(`${b.ticket.created}`);
  //         console.log(aDate.getTime() - bDate.getTime() > 0)
  //         return -(aDate.getTime() - bDate.getTime());
  //       }
  //       else
  //         return 0;
  //     })
  //
  //     observer.next();
  //   }, error => {observer.error()})
  // }


  updateTickets(sub: Subscriber<Ticket[]>) {
    setTimeout(() => {
      this.api.GetAllTickets().subscribe((response) => {
        let t = response.tickets;
        t = t.filter((t) => {return t.ticketIssue != "Day Loaner" && t.isCurrentlyActive})
        t?.sort((a,b) => {
          if (a.created != null && b.created != null) {
            let aDate = new Date(`${a.created}`);
            let bDate = new Date(`${b.created}`);
            console.log(aDate.getTime() - bDate.getTime() > 0)
            return -(aDate.getTime() - bDate.getTime());
          } else
            return 0;
        })
        this.ticketCount = t.length;

        let count = 0;
        let now = new Date(Date.now())
        for(let i = 0; i < t.length; i++) {
          let d = new Date(`${t[i].created}`)
          if(now.getFullYear() == d.getFullYear() && now.getMonth() == d.getMonth() && now.getDate() == d.getDate())
            ++count;
        }
        this.numberToday = count;

        sub.next(t);

        this.updateTickets(sub);
      })
    }, 1000)

  }

  updateActiveTickets(sub: Subscriber<DayLoaner[]>) {
    setTimeout(() => {
      this.api.GetAllTickets().subscribe((response) => {
        let t = response.tickets;
        t = t.filter((t) => {return t.ticketIssue == "Day Loaner" && t.isCurrentlyActive});
        t?.sort((a,b) => {
          if (a.created != null && b.created != null) {
            let aDate = new Date(`${a.created}`);
            let bDate = new Date(`${b.created}`);
            console.log(aDate.getTime() - bDate.getTime() > 0)
            return -(aDate.getTime() - bDate.getTime());
          } else
            return 0;
        })

        let d: DayLoaner[] = [];
        for(let i = 0; i < t.length; i++) {
          d.push({fresh: this.IsOld(t[i]), ticket: t[i], name: t[i].studentName});
        }
        console.log(d);
        this.dayLoanerCount = d.length;
        sub.next(d);

        this.updateActiveTickets(sub);
      })
    },  1000)

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
