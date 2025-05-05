import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from "ag-grid-angular";
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CommonMethods } from '../../common/common-methods';

@Component({
  selector: 'app-date-editor',
  templateUrl: './date-editor.component.html',
  styleUrls: ['./date-editor.component.scss']
})
export class DateEditorComponent implements ICellEditorAngularComp {

  constructor() { }
  @ViewChild('calendar') public calendar: ElementRef<HTMLElement>;
  params: any;
  dateRange:any;
  myDateValue: any[] =[];
  agInit(params: any): void {
    this.params = params;
    if( this.params.data.possibleStartDateRangeTo)
    {
    
      this.myDateValue.push(new Date(this.params.data.possibleStartDateRangeTo)); 
    }
  
  }

  changeCalendarPosition(){
    this.calendar.nativeElement.appendChild(document.querySelectorAll("bs-daterangepicker-container")[0]);
  }

  isPopup() {
    return true;
  }

  getValue(): any {
    return this.dateRange;
  }

  onDateChanged(event)
  {
    if(event.length>0)
    {
      this.dateRange = event;
      this.params.data.possibleStartDateRange = event; 
      this.params.data.possibleStartDateRangeTo = event[1];
      //this.params.api.stopEditing();

    }
    else
    {
      this.cancel();
    }
  } 

  cancel()
  {
    this.dateRange = null;
    this.params.data.possibleStartDateRange = null;
    this.params.data.possibleStartDateRangeTo = null;
    this.myDateValue = null;
  }

}