import {Component, Input, OnInit} from '@angular/core';
import {User} from "../api.service";

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {

  //@ts-ignore
  @Input() user: User
  constructor() { }

  ngOnInit(): void {
  }

}
