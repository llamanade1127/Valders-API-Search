import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApiService, Ticket} from "../../../api.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-completed-tickets',
  templateUrl: './completed-tickets.component.html',
  styleUrls: ['./completed-tickets.component.scss']
})
export class CompletedTicketsComponent implements AfterViewInit {
  displayedColumns: string[] = ['date', 'Student Name', 'problem', 'Device ID', 'Location','Actions', 'View'];
  dataSource = new MatTableDataSource<Ticket>();
  loading = false;

  constructor(private api: ApiService) {
  }



  ngOnInit(): void {
    this.updateTickets();

  }

  updateTickets() {
    this.loading = true;
    this.api.GetAllTickets().subscribe( {
      next: (d) => {
        this.dataSource.data = d.tickets.filter((t) => !t.isCurrentlyActive);
        this.loading = false;
        this.loop();
      },
      error: err => {
        this.loading = false;
        this.loop();
      }
    })
  }

  loop() {
    setTimeout(() => this.updateTickets(), 5 * 1000);
  }


  TicketDateString(t: Ticket): string {
    var d = new Date(`${t.created}`);
    //return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()}`
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
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


  //@ts-ignore
@ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
@ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
