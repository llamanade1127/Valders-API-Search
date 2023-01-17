import {Component, Inject, Input, OnInit} from '@angular/core';
import {ApiService, Chromebook, Ticket} from "../../api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
  //@ts-ignore
  loaner: Chromebook;
  //@ts-ignore
  @Input() data: IPDFDialog;
  //@ts-ignore
  damagedDevice: Chromebook;
  constructor( private api: ApiService) { }

  ngOnInit(): void {
  }

  GetDate(t: Ticket) {
    var d = new Date(`${t.created}`);
    //return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()}`
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }


}

@Component({
  selector: 'pdf-dialog',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfDialog {
  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<PdfDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IPDFDialog,
  ) {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  GetDate(t: Ticket) {
    console.log(t)
    var d = new Date(`${this.data.ticket.created}`);
    //return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()}`
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }



}

export interface IPDFDialog {
  ticket: Ticket,
  loanerChromebook: Chromebook,
  damagedDevice: Chromebook
}
