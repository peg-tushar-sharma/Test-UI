import { AfterViewInit, Component, Output, EventEmitter, ConstructorProvider, ViewChild, ViewContainerRef } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';

//import { RegistrationService } from '../../registrations/registrations/registration.service';
import { threadId } from 'worker_threads';
import { GlobalService } from '../../../../app/global/global.service';
import { PipelineQuantifier } from '../../enums/pipelineQuantifier';

@Component({
  selector: 'app-expected-start-editor',
  templateUrl: './expected-start-editor.component.html',
  styleUrls: ['./expected-start-editor.component.scss']
})
export class ExpectedStartEditorComponent implements AgEditorComponent {

  @ViewChild('dpStart') dpStart: BsDaterangepickerDirective;
  @ViewChild('dpRange') dpRange: BsDaterangepickerDirective;
  startDateValue;
  endDateValue: any;
  selector: string = undefined;
  calendarOpen: boolean = false;
  rangeOpen: boolean = false;
  startDateValueChanged: string = "";
  endDateValueChanged: string = "";
  quantifier: any;
  params: any;
  constructor(private datePipe: DatePipe, private globalService: GlobalService) {
    this.globalService.getPipelineQuantifier(PipelineQuantifier.ExpStartDate).subscribe(res => {
      this.quantifier = res;
    });
  }
  agInit(params): void {

    this.params = params;
    if (params.data.expectedStart && params.data.expectedStart.expectedStartDate && !params.data.expectedStart.expectedEndDate) {
      this.startDateValue = new Date(params.data.expectedStart.expectedStartDate);
      this.startDateValueChanged = this.startDateValue;
      this.hideRange = true;
    }
    if (params.data.expectedStart && params.data.expectedStart.expectedEndDate) {

      this.endDateValue = [new Date(params.data.expectedStart.expectedStartDate), new Date(params.data.expectedStart.expectedEndDate)]
      this.endDateValueChanged = this.endDateValue;
      this.hideDate = true;
    }
    if (params.data.expectedStart && params.data.expectedStart.qualifier) {
      this.selector = params.data.expectedStart.qualifier.quantifierId;
    }

  }
  getValue(): any {


    if (this.hideRange) {
      this.params.data.expectedStart.expectedStartDate = this.startDateValue;
      this.params.data.expectedStart.expectedEndDate = null;
    }
    else {
      if (this.endDateValue && this.endDateValue.length > 0) {
        this.params.data.expectedStart.expectedStartDate = this.endDateValue[0];
        this.params.data.expectedStart.expectedEndDate = this.endDateValue[1];
      }
      else {
        this.params.data.expectedStart.expectedStartDate = null;
        this.params.data.expectedStart.expectedEndDate = null;
      }
    }
    if (this.selector) {
      this.params.data.expectedStart.qualifier = this.quantifier.filter((eachItem) => {
        return eachItem.quantifierId == this.selector;
      })[0];
    }

    return this.params.data.expectedStart;
  }
  isPopup(): boolean {
    return true;
  }
  getPopupPosition(): string {
    return "under";
  }
  hideRange: boolean = false;
  hideDate: boolean = false;
  onDateChanged(event) {
    
    if (event != (undefined || null)) {
      this.startDateValueChanged = this.datePipe.transform(this.startDateValue, 'MM/dd');
      this.hideRange = true;
      this.calendarOpen = false;
    }
    if (event == (null || undefined)) {
      this.hideRange = false;
      this.startDateValueChanged = null;
    }
  }
  onRangeChanged(event) {
    if (event != (undefined || null)) {
      this.endDateValueChanged = this.datePipe.transform(this.endDateValue[0], 'MM/dd') + '-'
        + this.datePipe.transform(this.endDateValue[1], 'MM/dd');
      this.hideDate = true;
      this.rangeOpen = false;
    }
    if (event == null) {
      this.hideDate = false;
      this.startDateValueChanged = null;
      this.endDateValueChanged = null;
    }
  }
  clearDate(type) {
    if (type == "date") {
      this.startDateValue=null;
      this.startDateValueChanged=null;
    }
    if (type == 'range' && this.endDateValueChanged && this.endDateValueChanged!="" ) {
      this.startDateValue=null;
      this.startDateValueChanged=null;
      this.endDateValue=null;
      this.endDateValueChanged=null;
    }
  }
  checkEmptyDate(event, type) {

    if (type == 'start' && event.target.value == "") {
      this.startDateValue = null;
      this.startDateValueChanged = null;

    }
    if (type == 'range' && event.target.value == "") {
      this.startDateValue = null;
      this.startDateValueChanged = null;
      this.endDateValue = null;
      this.endDateValueChanged = null

    }
  }
}
