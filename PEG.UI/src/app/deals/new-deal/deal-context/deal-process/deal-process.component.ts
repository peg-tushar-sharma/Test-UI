import { Component, OnInit, Input, SimpleChanges, OnChanges, } from '@angular/core';
import { dateTrack } from './dateTracker'
import { ControlContainer, NgForm } from '@angular/forms';
import { deals } from './../../../../deals/deal';

import * as moment from 'moment';
@Component({
  selector: 'app-deal-process',
  templateUrl: './deal-process.component.html',
  styleUrls: ['./deal-process.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]

})
export class DealProcessComponent implements OnInit,OnChanges {
  importantDates: any[];
  defaultRow:dateTrack = {dateLabel:null,dateValue:null,comment:null,dealDateTrackId:0,lastUpdated:undefined,lastUpdatedBy:'',isdirty:false,isModified:false,oldDateValue:null }

  @Input()
  deal: deals;

  
  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;

  
  testDate: any;
  constructor() { }

  public datePickerOptions: any = {
    // other options...
    dateFormat: "dd-mmm-yyyy",
    firstDayOfWeek: 'su',
    sunHighlight: true,
    markCurrentDay: true,
    disableUntil: { day: 1, month: 1, year: 1753 }
  };


  ngOnInit() {
    this.renderDateTrack();
  }

  renderDateTrack() {
    if (this.deal.importantDates != undefined && this.deal.importantDates.length > 0) {
      
      this.importantDates = this.deal.importantDates
    }else{
      this.deal.importantDates.push(this.defaultRow);

    }
  }

  addImportantDates() {
    let dateObj = { dateLabel: null, dateValue: null, oldDateValue: null, comment: null} as dateTrack;
    this.importantDates.push(dateObj)
  }
  deleteImportantDates(index, item) {
    this.importantDates.splice(index, 1)
  }

  modelChange(event,i) {
     this.importantDates[i].isModified=true;
    this.deal.importantDates = this.importantDates;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deal && changes.deal.currentValue) {
      this.renderDateTrack();
    }
  }
  
}
