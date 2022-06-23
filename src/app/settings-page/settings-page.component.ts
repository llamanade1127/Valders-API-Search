import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  loading = false;
  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  LinkStudents() {
    this.loading = true;
    this.api.LinkStudents().subscribe({
      next: any => {
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      }
    })
  }

}
