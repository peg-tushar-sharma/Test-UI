import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit, AfterViewInit {

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
    // The reason behind to put this code because whenever we try to apply the 
    // styling through css all the modals are impacted and we only need to add style over the confirm modal
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

  resetClientAllocation() {
    this.event.emit('reset');
    this.bsModalRef.hide();
  }

  revertClient() {
    this.event.emit('revert');
    this.bsModalRef.hide();
  }

}
