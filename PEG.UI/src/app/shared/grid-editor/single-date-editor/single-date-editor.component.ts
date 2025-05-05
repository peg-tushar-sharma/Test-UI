import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from "ag-grid-angular";
import { FormatTimeZone } from '../../formatTimeZone.pipe';
import * as moment from "moment";

@Component({
  selector: 'single-app-date-editor',
  templateUrl: './single-date-editor.component.html',
  styleUrls: ['./single-date-editor.component.scss']
})
export class SingleDateEditorComponent implements ICellEditorAngularComp {

  constructor() { }
  @ViewChild('calendar') public calendar: ElementRef<HTMLElement>;
  @ViewChild('dateInput') public dateInput: ElementRef<HTMLElement>;
  params: any;
  selectedDate: any;
  myDateValue: any;
  currentColumn: string;
  _formatTimeZone: FormatTimeZone;
  agInit(params: any): void {
    setTimeout(() => {
      this.dateInput.nativeElement.focus();
      this.dateInput.nativeElement.click();
    }, 100);
    this.currentColumn = params.colDef.field;
    this.params = params;
    if (params.value) {
      let dateVal = params.value;
      if (typeof dateVal == 'string' && this.currentColumn == "expectedStart") {

        if (params.data.expectedStart && params.data.expectedStart.expectedStartDate) {
          dateVal = new Date(params.data.expectedStart.expectedStartDate);
        }
        else {
          dateVal = new Date(dateVal);
        }

      }
      else if (typeof dateVal == 'string' && this.currentColumn == "latestStartDate") {

        if (params.data.latestStartDate && params.data.latestStartDate) {
          dateVal = new Date(params.data.latestStartDate);
        }
        else {
          dateVal = new Date(dateVal);
        }

      }
      else {
        dateVal = new Date(dateVal);
      }
      this.selectedDate = dateVal;
      this.myDateValue = dateVal;
    }

  }

  changeCalendarPosition() {
    this.calendar.nativeElement.appendChild(document.querySelectorAll("bs-datepicker-container")[0]);
  }

  isPopup() {
    return true;
  }

  getValue(): any {
    if (this.params.colDef.field == 'expectedStart') {
      this.params.data.expectedStart.expectedStartDate = this.selectedDate;
       this._formatTimeZone = new FormatTimeZone();
            let dateparsed = this._formatTimeZone.transform( this.params.data.expectedStart.expectedStartDate, true);
            this.params.data.expectedStart.expectedStartDate = moment(dateparsed).format("DD-MMM-YYYY");


      if(this.params.data.expectedStart.expectedStartDate == 'Invalid date'){
        this.params.data.expectedStart.expectedStartDate = '';
      }
      
      return this.params.data.expectedStart;
    } else {
      return this.selectedDate;
    }
  }

  onDateChanged(event) {
    if (event != undefined && event != null && event != 'Invalid Date') {
      this.selectedDate = event;
    }
  }

  cancel() {
    this.selectedDate = '';
    this.myDateValue = '';
  }

}
