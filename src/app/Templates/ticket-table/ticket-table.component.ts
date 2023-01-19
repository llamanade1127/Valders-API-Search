import {Component, Input, ViewChild} from '@angular/core';
import {Ticket} from "../../api.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent {

  //@ts-ignore
  @Input() tickets: Ticket[]

  displayedColumns: string[] = ['date', 'Student Name', 'problem', 'Device ID', 'Location','Actions', 'View'];
  dataSource = new MatTableDataSource<Ticket>();
  loading = false;

  ngOnInit() {
    this.dataSource.data = this.tickets;
    console.log(this.tickets);
    console.log(this.dataSource.data);
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
      case 'Vandalism':
        return "Vandalism : Waiting for Update"
      case 'Needs to be Returned to Office':
        return `${this.getGrade(t)}${this.getPrefix(this.getGrade(t))} grades return cubby`
      case 'Waiting for Return':
        return 'In office'
      case 'Completed':
        return "Returned"
      default:
        return "Unknown"
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
