import { CommonMethods } from '../../../../shared/common/common-methods';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DealTrackerClient } from '../../../../deals/deal-tracker-client';
import { GlobalService } from '../../../../global/global.service';
import { CaseComplexity } from '../../../../shared/interfaces/caseComplexity';
import * as moment from 'moment';

@Component({
  selector: '[app-request-info-popup]',
  templateUrl: './request-info-popup.component.html',
  styleUrls: ['./request-info-popup.component.scss']
})
export class RequestInfoPopupComponent implements OnInit {

  // input(s)
  @Input() clientData: DealTrackerClient;
  @Input() regId: number;
  @Input() isExpert: boolean;
  @Input() isPipeline: boolean;
  @Input() status: any;

  // output(s)
  @Output() closeEmitter = new EventEmitter();

  // variable(s)

  // date(s)
  expectedStartDate: Date | any;
  submittedDate: Date | any;
  lastUpdatedDate: Date | any;
  bidDate: Date | any;
  expertData: any;
  pipelineData: any;
  caseComlexity: CaseComplexity[] = [];
  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    this.setData();
    this.getCaseComplexityMaserData();
  }
  getCaseComplexityMaserData() {
    this.globalService.getCaseComplexity().subscribe((res: CaseComplexity[]) => {
      this.caseComlexity = res;
    });
  }

  getTeamName(value) {
    return value.map(x => x.teamSize).join('; ');
  }
  getExpertsString(value) {
    if (value) {
      return CommonMethods.getEmployeeNameList(value).join('; ');
    } else {
      return 'N/A';

    }
  }
  getRetainerValue(value) {

    switch (value) {
      case 1:
        return 'Yes';
      case 2:
        return 'No';
      case 3:
        return "I don't know";
      default:
        return 'N/A';


    }
  }
  getMBPartnerValue(value) {
    switch (value) {
      case 1:
        return 'Yes';
      case 2:
        return 'No';
      case 3:
        return "I don't know";
      default:
        return 'N/A';

    }
  }
  getCaseComplexityById(id, caseComplexityValue) {
    if (caseComplexityValue && caseComplexityValue.some(x => x.caseComplexityId == id)) {
      return 'Yes'
    } else {
      return 'No';
    }
  }
  getEmployeeName(value) {
    return CommonMethods.getEmployeeName(value);

  }
  getIsExpertCallValue(value) {
    switch (value) {
      case "1":
        return 'Yes';
      case "0":
        return 'No';
      case "2":
        return 'Scheduled';
      default:
        return 'N/A';

    }
  }
  seeItem() {
  
  }

  setData() {
    // date(s)
    this.expectedStartDate = this.clientData.expectedStartDate ? new Date(this.clientData.expectedStartDate) : null;
    this.submittedDate = this.clientData.registrationSubmissionDate ? new Date(this.clientData.registrationSubmissionDate) : null;
    this.lastUpdatedDate = this.clientData.lastUpdatedDate ? new Date(this.clientData.lastUpdatedDate) : null;
    this.bidDate = this.clientData.bidDate ? moment(this.clientData.bidDate).format('DD-MMM-YYYY') : null;
  }

  // close popout
  close() {
    this.closeEmitter.emit();
  }
}
