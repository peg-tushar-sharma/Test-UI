import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-save-filter-modal',
  templateUrl: './save-filter-modal.component.html',
  styleUrls: ['./save-filter-modal.component.scss']
})
export class SaveFilterModalComponent implements OnInit, AfterViewInit {

  id: number;
  data: string;
  filterName: string;
  formSubmitted: boolean = false;
  isDefault: boolean;

  @ViewChild('form', { static: true })
  private form: NgForm;

  @Input()
  customMessage: string;

  @Output()
  confirmation: EventEmitter<any> = new EventEmitter<any>();

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.filterName = this.data;
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

  cancelFilterSave() {
    this.event.emit('cancel');
    this.bsModalRef.hide();
  }

  saveFilter() {
    this.event.emit({
      event: 'save',
      filterName: this.filterName,
      filterId: this.id ? this.id : 0,
      isDefault: this.isDefault
    });
    this.bsModalRef.hide();
  }

}
