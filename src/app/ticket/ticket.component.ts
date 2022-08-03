import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  //@ts-ignore  
  ticket: Ticket;

  loading = true;

  constructor(private API: ApiService, private snack: SnackBarService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.API.GetTicket(params['id']).subscribe({
        next: ticket => {
          this.ticket = ticket;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.snack.error('Error getting ticket')
        }
      })
    })
  }

}
