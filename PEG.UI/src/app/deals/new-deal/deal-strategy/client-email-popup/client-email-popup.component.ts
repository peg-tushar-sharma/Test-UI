import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegistrationStageEnum } from '../../../../shared/enums/registration-stage.enum';
import { of, Subject } from 'rxjs';
import { Employee } from '../../../../shared/interfaces/Employee';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { EMPLOYEE_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../../../../shared/common/constants';
import { DealStrategyService } from '../deal-strategy.service';
import { CoreService } from '../../../../core/core.service';
import { CommonMethods } from '../../../../shared/common/common-methods';
import * as moment from 'moment';
import { DealTrackerClientForEmail } from '../../../deal-tracker-client';
import { RegistrationStatus } from '../../../../shared/enums/registration-status.enum';


@Component({
  selector: 'app-client-email-popup',
  templateUrl: './client-email-popup.component.html',
  styleUrls: ['./client-email-popup.component.scss']
})
export class ClientEmailPopUpComponent implements OnInit {
  @Input() dealClients: DealTrackerClientForEmail[];
  @Input() targetName: string;
  @Input() managedByRegion: any;
  filteredClients: any[];
  allSelected: boolean = true;
  isMultipleSendClicked: boolean = false;

  @Output()
  public onEmailSendSubmit: EventEmitter<any> = new EventEmitter();
  loggedInUserName: string;
  employeeTypeAhead = new Subject<string>();
  employeeLoad: boolean = false;
  employeeList: Employee[];
  emailSubject: string = '[Client] - [Target] info needed';
  emailBody: string = 
  "Hi [Submitted By First Name],\n\nCould you please provide an update on [Client]’s interest level in [Target]?\n\n"+
  "• Have you already had a call with them? If so, which experts joined?\n" +
    "• Do you have any information on the deal process and timeline/bid dates?\n" +
    "\n" +
    "If the interest is closed, you can now update the opportunity stage on your PEG partner dashboard.\n" +
    "\n" +
    "If you have handed this off to someone else, please let me know and I'll reach out directly.\n" +
    "\n" +
    "Thank you,\n" +
    "[Users first name]";
  emailFrom: string;
  emailTo: string = "Email will be sent to Submitter";
  emailCC: string = "";
  constructor(public bsModalRef: BsModalRef, private pipelineService: DealStrategyService, private coreService: CoreService, 
  ) {

    this.employeeTypeAhead.pipe(
      tap(() => { this.employeeLoad = true; this.employeeList = []; }),
      debounceTime(200),
      switchMap((term) => {
        if (term) {
          return this.pipelineService.getEmployeeNames(term.toString().trim(), EMPLOYEE_STATUS_CODE, LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE)
        } else {
          return of([]);
        }
      }),
      tap(() => this.employeeLoad = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
      });
      this.employeeList = items
    });
  }
  onSelectEmployeeChange(event, field) {
    if (event) {
      this.employeeList = [];
    }
  }
  ngOnInit(): void {
    this.loggedInUserName = this.coreService.loggedInUser.firstName;
    this.emailFrom = CommonMethods.getEmployeeName(this.coreService.loggedInUser);
    this.emailCC = this.managedByRegion;
    // Filter clients by registration stage
    this.filteredClients = this.dealClients.filter(client => {
      if ((client.registrationStage.registrationStageId == RegistrationStageEnum.Commitment ||
        client.registrationStage.registrationStageId == RegistrationStageEnum.Interest
        ) && client.registrationStatus.registrationStatusId != RegistrationStatus.Duplicate) {
        return true;
      }
    });

    this.filteredClients.forEach(client => {
      client.isSelected = true;
    });

  }
  toggleAllSelected() {
    this.allSelected = !this.allSelected;
    this.filteredClients.forEach(client => {
      client.isSelected = this.allSelected;
    });
  }

  close() {
    this.resetObject();
    this.onEmailSendSubmit.emit('reset');
    this.bsModalRef.hide();
  }
  showRecepients() {
    let selectedClients = this.filteredClients.filter(client => client.isSelected);
    if (selectedClients.length == 1) {
      return true;
    } else {
      return false;
    }

  }
  enableSendButton() {

      let selectedClients = this.filteredClients.filter(client => client.isSelected);
      if (selectedClients.length >0) {
        return false;
      } else {
        return true;
      }


  }
  onSend() {
    let selectedClients = this.filteredClients.filter(client => client.isSelected);
    if(selectedClients.length > 1){
      this.isMultipleSendClicked= true;
    }
    else{
      this.emitEmailSend();
    }

  }

  emitEmailSend(){
    let selectedClients = this.filteredClients.filter(client => client.isSelected);

    // convert inner text of email body to html
    let emailBodyHTML = this.emailBody.replace(/\n/g, `<br />`);

    let emailData = {
      targetName: this.targetName,
      clients: selectedClients,
      emailSubject: this.emailSubject,
      emailBody: emailBodyHTML,
      from: this.coreService.loggedInUser,
      managedBy: "",
      cc: this.managedByRegion,
      emailDate: moment(new Date()).format('DD-MMM-YYYY')
    }
    this.onEmailSendSubmit.emit(emailData);
    this.resetObject();
    this.bsModalRef.hide();
  }

  resetObject() {
    this.emailSubject = '';
    this.emailBody = "";
    this.employeeList = [];
  }
  resetModal(){
    this.isMultipleSendClicked = false;
  }
}
