import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewEncapsulation } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { DealsService } from '../../../deals.service';
import {  deals } from '../../../../deals/deal';
import { Subject } from 'rxjs';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { CommonMethods } from '../../../../shared/common/common-methods';
import { Employee } from '../../../../shared/interfaces/models';
import { GlobalService } from '../../../../global/global.service';
import { RedbookAvailableStatus } from '../../../../shared/enums/rebookAvailable-status.enum';
import { EXPERT_PARTNER_LEVELGRADE } from '../../../../shared/common/constants';


@Component({
  selector: 'app-deal-bain-history',
  templateUrl: './deal-bain-history.component.html',
  styleUrls: ['./deal-bain-history.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]

})
export class DealBainHistoryComponent implements OnInit, OnChanges {
  @Input()
  deal: deals;
  
  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;

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
  myDateValue: any;
  redbookContainerName:string = 'redbookAvailableContext';
  

  constructor(private dealService: DealsService, private globalService: GlobalService) {

    this.trainersTypeAhead.pipe(
      tap(() => { this.peopleTagload = true; this.trainersList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), "",EXPERT_PARTNER_LEVELGRADE,true, this.isIncludeExternalEmployee)),
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
      switchMap(term => this.dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), "",EXPERT_PARTNER_LEVELGRADE,true, this.isIncludeExternalEmployee)),
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
      switchMap(term => this.dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(),"", EXPERT_PARTNER_LEVELGRADE,true, this.isIncludeExternalEmployee)),
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

  redbookAvailable: number = 0;
  redbookAvailableText: string = "";
  regions: any[];
  isExpertTrainUpCall: any;
  mbStatus: any[];

  ngOnInit() { 
    
   
    this.getRegions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.deal.dateOfCall) {
      this.myDateValue = (this.deal.dateOfCall != undefined && this.deal.dateOfCall != null) ? new Date(this.deal.dateOfCall) : null;
    }

    if (changes.deal && changes.deal.currentValue.trainers) {
      let trainers = [];
      this.deal.trainers.forEach(element => {
        let tmpEmployee: any = {};
        tmpEmployee.employeeCode = element.employeeCode;
        tmpEmployee.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) + (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")");
        if (element.employeeCode)
          trainers.push(tmpEmployee);
      })
      this.selectedTrainers = trainers;
    }

    if (changes.deal && changes.deal.currentValue.attendees) {
      let attendees = [];
      this.deal.attendees.forEach(element => {
        let tmpEmployee: any = {};
        tmpEmployee.employeeCode = element.employeeCode;
        tmpEmployee.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +(element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")");
        if (element.employeeCode)
          attendees.push(tmpEmployee);
      })

      this.selectedAttendees = attendees;
    }

    if (changes.deal && changes.deal.currentValue.sentTo) {
      let sentTo = [];
      this.deal.sentTo.forEach(element => {
        let tmpEmployee: any = {};
        tmpEmployee.employeeCode = element.employeeCode;
        tmpEmployee.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) + (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")");
        if (element.employeeCode)
          sentTo.push(tmpEmployee);
      })

      this.selectedSentTO = sentTo;
    }
  
      this.setRedbookAvailable(this.deal.redbookAvailable);
    
    
  }

  setRedbookAvailable(value)
  {
    this.redbookAvailable = (value!=null)?value:this.redbookAvailable;
    if(value===RedbookAvailableStatus.No)
    {
      this.redbookAvailableText="No";
    }
    else if(value===RedbookAvailableStatus.Yes)
    {
      this.redbookAvailableText="Yes";
    }
    else if(value===RedbookAvailableStatus.InProgress)
    {
      this.redbookAvailableText="In Progress";
    }
  }

  redbookChange(event){
    this.deal.redbookAvailable = (event != undefined && event != null) ? event : 2;
    this.setRedbookAvailable(event)

  }


  getRegions() {
    this.globalService.getRegions().subscribe(items => {
      this.regions = items;
    })
  }

  onDateChanged(event) {

    if (this.myDateValue) {
      this.deal.dateOfCall = new Date(CommonMethods.convertDatetoUTC(this.myDateValue).utc);
    }
  }

  setTrainers(event) {
    this.deal.trainers = [];

    this.selectedTrainers.forEach(element => {

      let selectedEmployee: Employee;

      if (element.employeeCode == undefined) {
        selectedEmployee = {
          familiarName: '',
          lastName: '',
          officeAbbreviation: '',
          officeName: '',
          homeOfficeCode:0,
          searchableName: element.searchableName,
          employeeCode: this.GuidForExternalEmloyee(),
          firstName: element.searchableName,
          employeeStatusCode: 'Ex',
          abbreviation: '',
          isRingfenceEmployee: false,
          statusCode: '',
          officeClusterCode:0
          
        }
      }
      else {
        selectedEmployee = element;
      }

      this.deal.trainers.push(selectedEmployee)

    });
  }

  setAttendees(event) {
    this.deal.attendees = [];
    this.selectedAttendees.forEach(element => {
      let selectedEmployee: Employee;
      if (element.employeeCode == undefined) {
        selectedEmployee = {
          familiarName: '',
          lastName: '',
          officeAbbreviation: '',
          officeName: '',
          homeOfficeCode: 0,
          searchableName: element.searchableName,
          employeeCode: this.GuidForExternalEmloyee(),
          firstName: element.searchableName,
          employeeStatusCode: 'Ex',
          abbreviation: '',
          isRingfenceEmployee: false,
          statusCode: '',
          officeClusterCode:0,
        }
      }
      else {
        selectedEmployee = element;
      }
      this.deal.attendees.push(selectedEmployee);
    });

  }

  setSentTO(event) {
    this.deal.sentTo = [];
    this.selectedSentTO.forEach(element => {
      let selectedEmployee: Employee;
      if (element.employeeCode == undefined) {
        selectedEmployee = {
          familiarName: '',
          lastName: '',
          officeAbbreviation: '',
          officeName: '',
          homeOfficeCode:0,
          searchableName: element.searchableName,
          employeeCode: this.GuidForExternalEmloyee(),
          firstName: element.searchableName,
          employeeStatusCode: 'Ex',
          abbreviation: '',
          isRingfenceEmployee: false,
          statusCode: '',
          officeClusterCode:0
        }
      }
      else {
        selectedEmployee = element;
      }
      this.deal.sentTo.push(selectedEmployee);
    });
  }

  GuidForExternalEmloyee() {
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
      (<any>c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> <any>c / 4).toString(16)
    );
  }


  cancel() {
    this.myDateValue = null;
    this.deal.dateOfCall = null;
  }

  compareObjects(item, selected) {
    return item.employeeCode == selected.employeeCode;
  }

  supportRequestedChange(event) {
    this.deal.supportRequested = event.target.checked;
  }

  expertLineUpChange(event) {
    this.deal.expertLineupPrepared = event.target.checked;
  }

  expertOnBoardChange(event) {
    this.deal.expertOnBoard = event.target.checked;
  }

}
