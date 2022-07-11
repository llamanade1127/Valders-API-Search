import { Component, Input, OnInit } from '@angular/core';
import {Chromebook} from "../api.service";

@Component({
  selector: 'app-chromebook-data',
  templateUrl: './chromebook-data.component.html',
  styleUrls: ['./chromebook-data.component.scss']
})
export class ChromebookDataComponent implements OnInit {


  //@ts-ignore
  @Input() chromebook: Chromebook;
  constructor() { }

  ngOnInit(): void {
  }

  LoadStudent() {

  }


}
