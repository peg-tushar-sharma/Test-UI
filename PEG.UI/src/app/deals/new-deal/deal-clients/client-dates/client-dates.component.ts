import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { deals } from '../../../deal';
import { dateTrack } from '../../deal-context/deal-process/dateTracker';
import { callDates } from '../dealClient';
import { CommonMethods } from '../../../../shared/common/common-methods';

@Component({
  selector: 'app-client-dates',
  templateUrl: './client-dates.component.html',
  styleUrls: ['./client-dates.component.scss']
})
export class ClientDatesComponent implements OnInit, OnChanges {

  @Input()
  public deal: deals = null;

  @Input()
  dealClientId: any;

  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;
  
  callDates: dateTrack[];
  defaultRow: dateTrack = { dateLabel: '', dateValue: null, comment: '', dealDateTrackId: 0, lastUpdated: undefined, lastUpdatedBy: '', isdirty: false,isModified:false, oldDateValue:null}



  constructor() { }

  ngOnInit() {
    if (this.deal.clients != undefined && this.deal.clients != null && this.deal.clients.length > 0) {
      let currentClientDates = this.deal.clients.filter(a => a.client.clientId == this.dealClientId);
      if (currentClientDates && currentClientDates.length>0) {
        currentClientDates[0].callDates.forEach(element => {
          let tempImportantDate: dateTrack = new dateTrack();
          tempImportantDate.dateValue = element.callDate != undefined && element.callDate != null ? { jsdate: new Date(element.callDate) } : null;
          this.callDates.push(tempImportantDate);
        })
      }
    }
    if (this.callDates == undefined) {
      this.callDates = [];
      this.callDates.push(this.defaultRow);
    }
  }

  /*public datePickerOptions: IMyDpOptions = {
    dateFormat: "dd-mmm-yyyy",
    firstDayOfWeek: 'su',
    sunHighlight: true,
    markCurrentDay: true,
    disableUntil: { day: 1, month: 1, year: 1753 }
  };*/

  ngOnChanges(changes: SimpleChanges) {
    this.callDates = [];
    if (changes.dealClientId) {      
      let dealClientId = changes.dealClientId.currentValue;
      if (dealClientId != undefined) {
        let currentClientDates = this.deal.clients.filter(a => a.dealClientId == dealClientId);
        if (currentClientDates && currentClientDates.length > 0 && currentClientDates[0].callDates) {
          currentClientDates[0].callDates.forEach(element => {
            let tempImportantDate: dateTrack = new dateTrack();
            tempImportantDate.dateValue = element.callDate != undefined && element.callDate != null ? { jsdate: new Date(element.callDate) } : null;
            this.callDates.push(tempImportantDate);
          })
        }
      }
    }
  }

  deleteClientDate(index) {
    this.callDates.splice(index, 1);
  }

  addClientDate() {
    let dateObj = new dateTrack();
    this.callDates.push(dateObj);
  }

  saveCallDates() {
    if (this.deal.clients != undefined && this.deal.clients != null && this.deal.clients.length > 0) {
      let currentClientDates = this.deal.clients.filter(a => a.dealClientId == this.dealClientId);
      currentClientDates[0].callDates = [];
      this.callDates.forEach(data => {
        let objCallDate = new callDates();
        objCallDate.dealClientId = this.dealClientId;
        if (data.dateValue) {
          let callDate = CommonMethods.convertDatetoUTC(data.dateValue.jsdate);
          objCallDate.callDate = new Date(callDate.utc);
          currentClientDates[0].callDates.push(objCallDate);
        }
      })

    }
    document.getElementById('btnClientDateClose').click();
  }

}