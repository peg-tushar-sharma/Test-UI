import { Component, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
@Component({
    selector: 'app-date-filter',
    templateUrl: './date-filter.component.html',
    styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
  @ViewChild("DatePickerFrom", { read: ElementRef, static: true }) DatePickerFrom: ElementRef;
  @ViewChild("DatePickerTo", { read: ElementRef, static: false }) DatePickerTo: ElementRef;
    @ViewChild("dateInput", { read: ElementRef, static: true }) dateInput: ElementRef;

    public date: Date;
    public params: any;
    public isValidDate: boolean = true;
    agInit(params: any): void {
        this.params = params;     
        this.params.filterParams.valueGetter = 
        function(t){
           
            if(t.data) {
                  let data = moment(t.data[params.filterParams.column.colId]).local().format();
                 return data;
            }
              
            }

    }

       
    

    ngAfterViewInit(): void {

    }

    ngOnDestroy() {
    }

    onDateChanged(selectedDates) {
        if (selectedDates != 'Invalid Date' && selectedDates != undefined) {
            this.date = new Date(selectedDates.toDateString()) || null;
            this.params.onDateChanged();
        }
        else {
            this.isValidDate = false;
        }
    }

    getDate(): Date {
       
        return  this.date;
    }

    setDate(date: Date): void {
        this.date = date || null;
    }

    validateDate(date: string) {
        if (date.length > 2) {
            let datePattern = /^(([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])(-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(-)((19|20)\d{2}))$/i;

            if (!date.match(datePattern)) {

                this.isValidDate = false;

            }
            else {
                this.isValidDate = true;

            }
        }

    }

    clearValues() {
        if (this.dateInput.nativeElement.value == "Invalid date") {
            this.dateInput.nativeElement.value = "";

        }
        this.isValidDate = true;
    }

    addDatepickerToAgGridContext(e){
        this.params.filterParams.api.clientSideRowModel.beans.popupService.popupList.push(
           {element: document.getElementsByTagName("bs-datepicker-container")[0]}
        );
    }
}
