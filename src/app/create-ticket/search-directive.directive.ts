import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSearchDirective]'
})


export class SearchDirectiveDirective {
  @Input()
  appSearchDirective!: Function;


  constructor() { }


  @HostListener('keydown.enter', ['$event'])
  onKeyUp(event: any) {
    event.preventDefault();
    this.appSearchDirective();
  }

  @HostListener('keydown.tab', ['$event'])
  onTab(event: any) {
    this.appSearchDirective();
  }
}
