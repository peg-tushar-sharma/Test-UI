import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from "ag-grid-angular";
import * as moment from 'moment';
import { PegTostrService } from '../../../core/peg-tostr.service';

@Component({
  selector: 'single-app-date-text-editor',
  templateUrl: './single-date-text-editor.component.html',
  styleUrls: ['./single-date-text-editor.component.scss']
})
export class SingleDateTextEditorComponent implements ICellEditorAngularComp {

  constructor(private toastr: PegTostrService) { }
  @ViewChild('calendar') public calendar: ElementRef<HTMLElement>;
  @ViewChild('dateInput') public dateInput: ElementRef<HTMLElement>;
  @ViewChild('textInput') public textInput: ElementRef<HTMLInputElement>;
  params: any;
  selectedDate: any;
  typedDate:string;
  myDateValue: any;
  currentColumn: string;
  selectedYear:number;
  notes:any;
  bsConfig:any = {
    dateInputFormat: 'DD-MMM-YYYY',
    containerClass : 'theme-red',
    adaptivePosition: true,
    showWeekNumbers: false
  };

  agInit(params: any): void {
    setTimeout(() => {
      this.textInput.nativeElement.focus();
      this.textInput.nativeElement.click();
    }, 100);
    this.currentColumn = params.colDef.field;
    this.params = params;
    if (params.value) {
      let dateVal = params.value;
      if (typeof dateVal == 'string' && this.currentColumn == "expectedStart") {

        if (params.data.expectedStart && params.data.expectedStart.expectedStartDate) {
          dateVal = params.data.expectedStart.expectedStartDate;
          this.notes=params.data.expectedStart.expectedStartDateNote;
        }
              } else if (typeof dateVal == 'string' && this.currentColumn == "latestStartDate") {

        if (params.data.latestStartDate && params.data.latestStartDate) {
          dateVal = params.data.latestStartDate;
        }

      }

      if(dateVal.split){
        dateVal = dateVal.split("T")[0]; // Necessary to obtain raw date string without timezone
      }

      console.log(dateVal);

      this.selectedDate = moment(dateVal);
      this.myDateValue = moment(dateVal).toDate();
      this.typedDate = moment(dateVal).format("DD/MM");
      this.selectedYear = this.myDateValue.getFullYear();

    }
    else if(this.currentColumn == "expectedStart" && params.data?.expectedStart?.expectedStartDateNote)
    {
      this.notes=params.data.expectedStart.expectedStartDateNote;
    }
   }
   onEnterKeyPress(event) {
   
    if (event.keyCode == 13 && event.shiftKey) {
      event.stopPropagation();
    
  }

  }
  changeCalendarPosition() {
    this.calendar.nativeElement.appendChild(document.querySelectorAll("bs-datepicker-container")[0]);
  }

  isPopup() {
    return true;
  }

  getValue(): any {
    // This is required here because the change event doesn't fire if the user presses the enter key
    if(this.typedDate != null && this.typedDate != ''){
      this.onTypedDateChanged(this.typedDate);
    }

    if (this.params.colDef.field == 'expectedStart') {
      this.params.data.expectedStart = {}
      this.params.data.expectedStart.expectedStartDate = this.selectedDate==undefined?null:this.selectedDate;
      this.params.data.expectedStart.expectedStartDateNote = this.notes==undefined ||this.notes=='' ?null:this.notes;
      return this.params.data.expectedStart;
    } else {
      return this.selectedDate;
    }
  }

  onDateChanged(event) {
    
    if (event != undefined && event != null && event != 'Invalid Date') {
      this.selectedDate = moment(event).format("YYYY-MM-DD")
      this.myDateValue = moment(event).toDate();
      this.typedDate = moment(event).format("DD/MM");
      this.selectedYear = this.myDateValue.getFullYear();
    }
  }

  updateTypedDate(event){

    // Check if the typed value contains the allowed characters in the correct format. If not, revert to previous value
    let regex:RegExp = new RegExp("^([0-9]{1,2})(\/[0-9]{1,2})?(\/[0-9]{0,2})?$"); // Regex pattern for date format mm/dd/yy with day and year optional
    let value:string = event.target.value;
    let intval:number = parseInt(value);
    

    // If the user has typed in the day, automatically add a slash
    if((value.length == 2 && value.indexOf("/") == -1) || (value.length == 1 && intval > 3) ){ // Values of 1, 2, or 3 cannot be assumed to be complete day numbers
      if(value.length > this.typedDate.length){ // Don't add an extra slash if deleting
        value += "/";
        this.textInput.nativeElement.value = value;
      }
    }

    if(regex.test(value) || value == ''){
      this.typedDate = value;
    } else {
      return false;
    }

  }

  onTypedDateChanged(value){
    this.typedDate = value;

    // Manually parse a typed date
    if(this.typedDate != null && this.typedDate != ''){
      // Parse date by slashes
      let arr:any[] = this.typedDate.split('/');
      
      // Manually append year if missing
      if(arr.length > 1 && arr.length < 4){

        // Parse month index into an integer and subtract by 1
        let day:number = parseInt(arr[0]);
        let month:number = parseInt(arr[1]) - 1; // 0 is January
        let year:number = new Date().getFullYear();

        if(this.selectedYear != null){
          year = this.selectedYear;
        }

        if(arr.length > 2){
          year = parseInt(arr[2]);

          // If year is two digits, add 2000
          if(year < 100){
            year += 2000;
          }
        }

        // Assign date value from array (year, month index, day)
        let newDate = moment.utc(year+"-"+(month+1)+"-"+day, "YYYY-MM-DD");

        if(newDate.isValid()){
          this.myDateValue = newDate;
          this.selectedDate = newDate.format("YYYY-MM-DD");
        } else{
          this.toastr.showError('Invalid date was entered', 'Error');
        }
      } else{
        this.toastr.showError('Invalid date was entered', 'Error');
      }
    }
  }

  clearTypeDate(){
    this.typedDate = null;
  }

  cancel() {
    this.selectedDate = null;
    this.myDateValue = null;
    this.typedDate = null;
  }

}
