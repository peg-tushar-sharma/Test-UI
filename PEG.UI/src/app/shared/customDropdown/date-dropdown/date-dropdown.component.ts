import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import * as moment from 'moment';
import { GlobalService } from '../../../global/global.service';
import { PipelineQuantifier } from '../../enums/pipelineQuantifier'

const KEY_TAB = 9;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;

@Component({
  selector: 'app-date-dropdown',
  templateUrl: './date-dropdown.component.html',
  styleUrls: ['./date-dropdown.component.scss']
})
export class DateDropdownComponent implements ICellEditorAngularComp, AfterViewInit {

  public params;
  public expectedStartDate;
  public mDescription;
  public quantifier= [];
  public expectedEndDate;
  public dateType;
  

  public errorDate = {
    expectedStartDate: false,
    expectedEndDate: false
  };

  validDate: any;

  @ViewChild('inputExpectedStartDate', {read: ViewContainerRef}) public inputExpectedStartDate;
  
  constructor(public globalService: GlobalService) { }


  getValue() {

    this.params.data.expectedStartDateQuantifier = this.mDescription;

    if (this.StartDateGreatedThanEndDate()) {
      this.params.data['expectedEndDate'] = undefined;
      if(this.dateType=='expectedEndDate'){
        this.validDate=undefined;
      }
    }
    if (this.isStartDateValid()) {
      this.params.data['expectedEndDate'] = undefined;
    }

    if (!this.expectedStartDate || this.expectedStartDate == '') {
      this.errorDate.expectedStartDate = true;
      //throw new Error("Start date is required");
    }

    if (this.validDate != undefined && this.validDate != null) {
      this.params.data[this.dateType] = this.validDate['_d'];

      return this.params.data[this.dateType] + ' ' + this.mDescription;
    }

  }

  isPopup() {
    return true
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.inputExpectedStartDate.element.nativeElement.focus();
    });
}

onKeyDown(event, i) {
  const keyCode = event.keyCode;

   const isNavigationKey = keyCode === KEY_TAB ||KEY_DOWN || KEY_UP;
   const isStopEditing = keyCode === KEY_ENTER;

      if (isNavigationKey && (this.quantifier.length-1)!=i) {
          // this stops the grid from receiving the event and executing keyboard navigation
         event.stopPropagation();
      }

      if(isStopEditing)
      {
        this.getValue();
        this.params.api.stopEditing();
      }
  
}

  selectOption(event) {
    if (event.target) {
      this.mDescription = event.target.innerHTML;
    }
  }


  validation(event, type) {
    this.dateType = type;
    if (event.target.value == '' && type == 'expectedStartDate') {
      this.errorDate[type] = false;
      if(this.params)
      this.params.data[type] = undefined;
    } else if (event.target.value == '' && type == 'expectedEndDate') {
      this.params.data[type] = '';
    }
    var inputDate = event.target.value;
    let dateFormatList = [
      'DD-MMM', 'DD-MMM-YYYY',
    ];

    var outDate = moment(inputDate, dateFormatList);

    if (outDate['_isValid'] && moment(outDate['_d']).year() > 1901) {
      this.validDate = moment(outDate['_d']);
      this.errorDate[type] = false
      this.errorDate[type] = this.checkYear(this.validDate, dateFormatList);
      this.params.data[this.dateType] = this.validDate['_d'];
    } else {
      this.errorDate[type] = true
      this.validDate = undefined;
    }
    if (this.StartDateGreatedThanEndDate()) {
      this.errorDate.expectedEndDate = true;
    }

  }

  StartDateGreatedThanEndDate(): boolean {
    let isValid = false;
    if (this.params && this.params.data.expectedEndDate && moment(this.params.data.expectedStartDate).diff(this.params.data.expectedEndDate) > 0) {
      isValid = true;
    }


    return isValid;

  }

  checkYear(v, dateFormatList) {
    var outDate = moment(v, dateFormatList);
    v = moment(outDate['_d']).year();
    if (v == 0) {
      return true;
    }
  }

  
  agInit(params): void {
    this.globalService.getPipelineQuantifier(PipelineQuantifier.ExpStartDate).subscribe(res => {
      this.quantifier = res;
    })
    this.params = params;
    if (params.data && (params.data["expectedEndDate"] || params.data["expectedStartDate"])) {
      this.expectedEndDate = this.params.data["expectedEndDate"] ? moment(this.params.data["expectedEndDate"]).format('DD-MMM-YYYY') : '';
      this.expectedStartDate = this.params.data["expectedStartDate"] ? moment(this.params.data["expectedStartDate"]).format('DD-MMM-YYYY') : '';
    }
    this.mDescription = this.params ? this.params.data.expectedStartDateQuantifier : '';

  }

  //Returns true only when start date is valid and has some value
  isStartDateValid(): boolean {
    var isDisabled = true
    if (this.expectedStartDate != undefined && this.expectedStartDate.trim() != '' && !this.errorDate.expectedStartDate) {
      isDisabled = false;

    }

    return isDisabled

  }

}