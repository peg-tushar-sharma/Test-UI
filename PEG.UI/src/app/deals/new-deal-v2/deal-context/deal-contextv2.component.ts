import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { RegistrationStageEnum } from '../../../shared/enums/registration-stage.enum';
import { RegistrationStatus } from '../../../shared/enums/registration-status.enum';
import { uniqBy } from 'lodash'
import { DealTracker } from '../../dealTracker';
import { GlobalService } from '../../../global/global.service';
import { LocationOfDeal } from '../../../shared/interfaces/LocationOfDeal';
import { dateTrack } from './dateTracker';
import { CommonMethods } from '../../../shared/common/common-methods';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { EXPERT_PARTNER_LEVELGRADE } from '../../../shared/common/constants';
import { DealsService } from '../../deals.service';
import { Employee } from '../../../shared/interfaces/Employee';
import { DealClient } from '../../new-deal/deal-clients/dealClient';
import { DealExpertTrain } from '../../../shared/interfaces/deal-expert-train';
import * as moment from 'moment';

@Component({
  selector: 'app-dealv2-context',
  templateUrl: './deal-contextv2.component.html',
  styleUrls: ['./deal-contextv2.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DealContextV2Component implements OnInit, OnChanges {
  public dealRegion: any[];
  public locationOfDeal: LocationOfDeal[] = [];
  public isClearOnLocation: boolean = false;

  myDateValue: any;
  transactedDate: any;
  importantDates: any[];
  defaultRow: dateTrack = { dateLabel: null, dateValue: null, comment: null, dealDateTrackId: 0, lastUpdated: undefined, lastUpdatedBy: '', isdirty: false, isModified: false, oldDateValue: null }

  @Input()
  dealTracker: DealTracker;

  @Input()
  dealClient: DealClient;

  @Input()
  refreshImportantDates!:boolean;

  @Output()
  public refreshDeal: EventEmitter<any> = new EventEmitter<any>();

  public datePickerOptions: any = {
    dateFormat: "dd-mmm-yyyy",
    firstDayOfWeek: 'su',
    sunHighlight: true,
    markCurrentDay: true,
    disableUntil: { day: 1, month: 1, year: 1753 }
  };

  constructor(private globalService: GlobalService, private dealService: DealsService) {

  }

  totalRegistration: number = 0;
  mbHighlights = { interest: 0, commitment: 0, workStarted: 0, workCompleted: 0, terminated: 0 };
  totalUniqueClients = 0;

  // Deal bain history
  trainersTypeAhead = new Subject<string>();
  attendeesTypeAhead = new Subject<string>();
  sentToTypeAhead = new Subject<string>();
  trainersList = [];
  attendeesList = [];
  sentToList = [];
  peopleTagload: boolean = false;
  isIncludeExternalEmployee = true;
  selectedSentTO;
  selectedAttendees;
  selectedTrainers;
  redbookContainerName: string = 'redbookAvailableContext';

  ngOnInit() {
    this.globalService.getLocationofDeals().subscribe(items => {
      this.locationOfDeal = items;
    })
    this.getRegions();
    this.bainHistoryTypeahead();
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.dealTracker && simpleChange.dealTracker.currentValue.trainers) {
      let trainers = [];
      this.dealTracker.trainers.forEach(element => {
        let tmpEmployee: any = {};
        tmpEmployee.dealExpertTrainUpEmployeeId=element.dealExpertTrainUpEmployeeId;
        tmpEmployee.employeeCode = element.employeeCode;
        tmpEmployee.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) + (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")");
        if (element.employeeCode)
          trainers.push(tmpEmployee);
      })
      this.selectedTrainers = trainers;
    }

    if (simpleChange.dealTracker && simpleChange.dealTracker.currentValue.attendees) {
      let attendees = [];
      this.dealTracker.attendees.forEach(element => {
        let tmpEmployee: any = {};
        tmpEmployee.dealExpertTrainUpEmployeeId=element.dealExpertTrainUpEmployeeId;
        tmpEmployee.employeeCode = element.employeeCode;
        tmpEmployee.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) + (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")");
        if (element.employeeCode)
          attendees.push(tmpEmployee);
      })

      this.selectedAttendees = attendees;
    }

    if (simpleChange.dealTracker && simpleChange.dealTracker.currentValue.sentTo) {
      let sentTo = [];
      this.dealTracker.sentTo.forEach(element => {
        let tmpEmployee: any = {};
        tmpEmployee.dealExpertTrainUpEmployeeId=element.dealExpertTrainUpEmployeeId;
        tmpEmployee.employeeCode = element.employeeCode;
        tmpEmployee.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) + (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")");
        if (element.employeeCode)
          sentTo.push(tmpEmployee);
      })

      this.selectedSentTO = sentTo;
    }

    if (simpleChange.dealClient && simpleChange.dealClient.currentValue && simpleChange.dealClient.currentValue.length > 0) {
      this.setMBHighlights();
    }

    if (this.dealTracker.dateOfCall) {
         this.myDateValue = (this.dealTracker.dateOfCall != undefined && this.dealTracker.dateOfCall != null) ? new Date(this.dealTracker.dateOfCall) : null;
    }

    if (this.dealTracker.transactedDate) {
      this.transactedDate = (this.dealTracker.transactedDate != undefined && this.dealTracker.transactedDate != null) ? new Date(moment.utc(this.dealTracker.transactedDate).format('DD-MMM-YYYY')) : null;
    }
    this.renderDateTrack();
  }
  // When user presses enter, start a new line
  onEnterKeyPress(event) {
    event.stopPropagation();
    
  }
  setMBHighlights() {
    if (this.dealTracker.clients) {
      let dealClients: any = this.dealTracker.clients.filter(x => x.client.clientName != undefined && x.client.clientName.trim() != '');
      dealClients.map(x => {
        x.client.clientName = x.client.clientName.trim();
        x.client.clientName = x.client.clientName.replace(/\s+/g, ' ');
      });
      this.totalUniqueClients = uniqBy(dealClients.filter(x => x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate), 'client.clientName').length;
      this.totalRegistration = dealClients.filter(x => x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.interest = dealClients.filter(x => x.registrationStage && x.registrationStage.registrationStageId == RegistrationStageEnum.Interest && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.commitment = dealClients.filter(x => x.registrationStage && x.registrationStage.registrationStageId == RegistrationStageEnum.Commitment && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.workStarted = dealClients.filter(x => x.registrationStage && x.registrationStage.registrationStageId == RegistrationStageEnum.WorkStarted && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.workCompleted = dealClients.filter(x => x.registrationStage && x.registrationStage.registrationStageId == RegistrationStageEnum.WorkCompleted && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.terminated = dealClients.filter(x => x.registrationStage && (x.registrationStage.registrationStageId == RegistrationStageEnum.Terminated 
        ||x.registrationStage.registrationStageId == RegistrationStageEnum.ClosedLost
        ||x.registrationStage.registrationStageId == RegistrationStageEnum.ClosedDropped
        ||x.registrationStage.registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown)
        && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
    }
  }

  getRegions() {
    this.globalService.getRegions().subscribe(items => {
      this.dealRegion = items;
    })
  }

  onLocationChange(event) {
    if (event != undefined) {
      if (event.locationName.toString().trim() == '') {
        this.isClearOnLocation = false;
      } else {
        this.isClearOnLocation = true;
      }
      this.onFormValueChanged('targetCountry', '')
    }
  }

  renderDateTrack() {
    this.importantDates = [];
    if (this.dealTracker.importantDates != undefined && this.dealTracker.importantDates.length > 0) {
      //Create Date Object from UTC to Current timeZone
      let tempImportantDatesList: dateTrack[] = [];
      this.dealTracker.importantDates.forEach(element => {
        let tempImportantDate: dateTrack = new dateTrack();
        tempImportantDate.comment = element.comment
        tempImportantDate.dateLabel = element.dateLabel
        tempImportantDate.dateValue = element.dateValue != undefined && element.dateValue != null ?   new Date(moment.utc(element.dateValue).format('DD-MMM-YYYY')) : null;
        tempImportantDate.oldDateValue =  element.dateValue != undefined && element.dateValue != null ?   new Date(moment.utc(element.dateValue).format('DD-MMM-YYYY')) : null;
        tempImportantDate.dealDateTrackId = element.dealDateTrackId
        tempImportantDate.lastUpdated = element.lastUpdated
        tempImportantDate.lastUpdatedBy = element.lastUpdatedBy
        tempImportantDate.isdirty = element.isdirty
        tempImportantDate.oldComment = element.comment
        tempImportantDate.oldDateLabel = element.dateLabel
        tempImportantDatesList.push(tempImportantDate);
        this.importantDates.push(tempImportantDate)
      });
    }    
  }

  addImportantDates() {
    let dateObj = { dateLabel: null, dateValue: null, oldDateValue: null, comment: null } as dateTrack;
    this.importantDates.push(dateObj)
  }

  deleteImportantDates(index, item) {
    this.importantDates.splice(index, 1)
    this.modelChange(null,null);
  }

  modelChange(event, i) {
    if (this.importantDates && this.isModelChanged() ) {        
       
          this.dealTracker.importantDates = JSON.parse(JSON.stringify(this.importantDates)) ;
          //To remove time component from date
           if(this.dealTracker?.importantDates?.length>0){
             this.dealTracker.importantDates.forEach((iDate:dateTrack)=>{
               iDate.dateValue =  iDate.dateValue ? moment(iDate.dateValue).format('YYYY-MM-DD') : null;
               iDate.dateLabel = iDate.dateLabel;
               iDate.comment = iDate.comment;
             })
           }
           this.onFormValueChanged('importantDates', '');  
    }
  }
  isModelChanged(){
    
    let isModelChanged = false;
    isModelChanged =  this.importantDates?.some((dt)=>
      moment( dt?.dateValue).format('YYYY-MM-DD') != moment( dt?.oldDateValue).format('YYYY-MM-DD'))
     || 
    this.importantDates?.some((dt)=>
      dt?.comment != dt?.oldComment)
    || 
    this.importantDates?.some((dt)=>
      dt?.dateLabel != dt?.oldDateLabel)

    ||
    this.importantDates?.length != this.dealTracker?.importantDates?.length

    return isModelChanged 
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.deal && changes.deal.currentValue) {
  //     this.renderDateTrack();
  //   }
  // }

  bainHistoryTypeahead() {
    this.trainersTypeAhead.pipe(
      tap(() => { this.peopleTagload = true; this.trainersList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), "", EXPERT_PARTNER_LEVELGRADE, true, this.isIncludeExternalEmployee)),
      tap(() => this.peopleTagload = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
      });
      this.trainersList = items

    });

    this.attendeesTypeAhead.pipe(
      tap(() => { this.peopleTagload = true; this.attendeesList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), "", EXPERT_PARTNER_LEVELGRADE, true, this.isIncludeExternalEmployee)),
      tap(() => this.peopleTagload = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
      });
      this.attendeesList = items

    });

    this.sentToTypeAhead.pipe(
      tap(() => { this.peopleTagload = true; this.sentToList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), "", EXPERT_PARTNER_LEVELGRADE, true, this.isIncludeExternalEmployee)),
      tap(() => this.peopleTagload = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
      });
      this.sentToList = items

    });
  }

  onDateChanged(event, fieldName) {

    if ( (this.myDateValue == null && this.dealTracker.dateOfCall) || (this.myDateValue && (new Date(this.myDateValue).getDate() != new Date(this.dealTracker.dateOfCall).getDate()))) {
      if(this.myDateValue !=null)
      {
        this.dealTracker.dateOfCall = new Date(CommonMethods.convertDatetoUTC(this.myDateValue).utc);
      }
      else
      {
        this.dealTracker.dateOfCall=null;
      }
     
      this.onFormValueChanged(fieldName, '');
    }
  }

  onTransactedDateChanged(event, fieldName) {
    if (this.transactedDate && (CommonMethods.converToLocal(this.transactedDate) != CommonMethods.converToLocal(this.dealTracker?.transactedDate))) {
      this.dealTracker.transactedDate = new Date(CommonMethods.convertDatetoUTC(this.transactedDate).utc);
      this.onFormValueChanged(fieldName, '');
    }
  }

  setSentTO(fieldName) {
    this.dealTracker.sentTo = [];
    this.selectedSentTO.forEach(element => {
      let selectedEmployee: DealExpertTrain;
      if (element.employeeCode == undefined) {
        selectedEmployee = {
          dealExpertTrainUpEmployeeId:element.dealExpertTrainUpEmployeeId,
          familiarName: '',
          lastName: '',
          officeAbbreviation: '',
          officeName: '',
          homeOfficeCode: 0,
          searchableName: element.searchableName,
          employeeCode: this.GuidForExternalEmloyee(),
          isExternalEmployee:1,
          firstName: element.searchableName,
          employeeStatusCode: 'Ex',
          abbreviation: '',
          isRingfenceEmployee: false,
          statusCode: ''
        }
      }
      else {
        selectedEmployee = element;
      }
      this.dealTracker.sentTo.push(selectedEmployee);
    });
    this.onFormValueChanged(fieldName, '');
    this.sentToList = [];
  }


  onFormValueChanged(fieldName: string, value) {
    switch (fieldName) {
      case 'dealRegion':
        this.dealTracker.fieldName = fieldName;
        this.refreshDeal.emit(this.dealTracker);
        break;

      default:
        this.dealTracker.fieldName = fieldName;
        this.refreshDeal.emit(this.dealTracker);
        break;
    }
  }

  compareObjects(item, selected) {
    return item.employeeCode == selected.employeeCode;
  }
  
  GuidForExternalEmloyee() {
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
      (<any>c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> <any>c / 4).toString(16)
    );
  }

  setTrainers(fieldName: string) {
    this.dealTracker.trainers = [];
    this.selectedTrainers.forEach(element => {

      let selectedEmployee: DealExpertTrain;

      if (element.employeeCode == undefined) {
        selectedEmployee = {
          dealExpertTrainUpEmployeeId:element.dealExpertTrainUpEmployeeId,
          familiarName: '',
          lastName: '',
          officeAbbreviation: '',
          officeName: '',
          homeOfficeCode: 0,
          searchableName: element.searchableName,
          employeeCode: this.GuidForExternalEmloyee(),
          isExternalEmployee:1,
          firstName: element.searchableName,
          employeeStatusCode: 'Ex',
          abbreviation: '',
          isRingfenceEmployee: false,
          statusCode: ''
        }
      }
      else {
        selectedEmployee = element;
      }

      this.dealTracker.trainers.push(selectedEmployee)

    });
    this.onFormValueChanged(fieldName, '')
    this.trainersList = [];
  }

  setAttendees(fieldName: string) {
    this.dealTracker.attendees = [];
    this.selectedAttendees.forEach(element => {
      let selectedEmployee: DealExpertTrain;
      if (element.employeeCode == undefined) {
        selectedEmployee = {
          dealExpertTrainUpEmployeeId:element.dealExpertTrainUpEmployeeId,
          familiarName: '',
          lastName: '',
          officeAbbreviation: '',
          officeName: '',
          homeOfficeCode: 0,
          searchableName: element.searchableName,
          employeeCode: this.GuidForExternalEmloyee(),
          isExternalEmployee:1,
          firstName: element.searchableName,
          employeeStatusCode: 'Ex',
          abbreviation: '',
          isRingfenceEmployee: false,
          statusCode: ''
        }
      }
      else {
        selectedEmployee = element;
      }
      this.dealTracker.attendees.push(selectedEmployee);
    });
    this.onFormValueChanged(fieldName, '');
    this.attendeesList = [];
  }

  cancel() {
    this.myDateValue = null;
  }

  expertOnBoardChange(event) {
    this.onFormValueChanged('expertOnBoard', 'fromProperty');
  }

  expertLineUpChange(event) {

  }

  supportRequestedChange(event) {

  }


}
