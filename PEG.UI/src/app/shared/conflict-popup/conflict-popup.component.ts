import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-conflict-popup',
  templateUrl: './conflict-popup.component.html',
  styleUrls: ['./conflict-popup.component.scss']
})
export class ConflictPopupComponent implements OnInit {

  title: string;
  data: string;

  @Input()
  customMessage: string;

  @Output()
  confirmation: EventEmitter<any> = new EventEmitter<any>();

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let modalElement = document.getElementsByClassName('modal-backdrop');
      for (let i = 0; i < modalElement.length; i++) {
        const slide = modalElement[i] as HTMLElement;
        slide.setAttribute("style", "z-index : 99999 !important");        
      }

      let modalElemen = document.getElementsByClassName('modal');
      for (let i = 0; i < modalElemen.length; i++) {
        const slide = modalElemen[i] as HTMLElement;
        slide.setAttribute("style", "z-index : 99999 !important");
      }   

  }

  proceedAllocation() {
    this.event.emit('proceed');
    this.bsModalRef.hide();
  }

  discardAllocation() {
    this.event.emit('discard');
    this.bsModalRef.hide();
  }

}
