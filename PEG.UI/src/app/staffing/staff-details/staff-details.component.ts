import * as moment from 'moment';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMethods } from '../../shared/common/common-methods';
import { CoreService } from '../../core/core.service';
import { Office } from '../../shared/interfaces/office';
import { PegDetails } from '../peg-details';
import { PipelineAuditLog } from '../../pipeline/pipelineAuditLog';
import { StaffingService } from '../staffing.service';
import { GlobalService } from '../../global/global.service';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { RegistrationStageEnum } from '../../shared/enums/registration-stage.enum';
import { dealMBStatus } from '../../shared/enums/deal-mbStatus.enum';
import { Location } from "@angular/common";
import { PegTostrService } from '../../core/peg-tostr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { StaffingOpportunityTypeDetails } from '../staffing-opportunity-type-details/staffing-opportunity-type-details';


@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss']
})

export class StaffDetailsComponent implements OnInit {
  requirements: any
  inputParams: any;
  sm: any
  ovp: any
  likelihood: any
  duration: any
  caseComplexity: string
  officesToBeStaffed: Office[] = [];
  leadershipHelp: any = [];
  staffingSupportOptions: any = [];
  languages: any = [];
  opportunityTypeDetails: StaffingOpportunityTypeDetails = new StaffingOpportunityTypeDetails();
  opportunityDetails: PegDetails = new PegDetails();
  formGroup: FormGroup;
  controls;
  teamSizeItems: any;
  statusItems: any;
  isInvalidDuration: boolean = false;
  isOpportunityStaffed: boolean = true;
  // ag grid
  rowData = [];
  columnDefs: ColDef[];
  gridApi: GridApi;
  gridColumnApi;
  gridOptions: GridOptions;
  defaultColDef: ColDef;
  defaultCellStyle = {
    "align-items": "center",
    color: "#121212",
    display: "flex",
    "font-family": "Graphik",
    "font-size": "12px"
  };
  conflictsData: any = [];
  bsModalRef: BsModalRef;

  constructor(private coreService: CoreService, private route: ActivatedRoute, private router: Router,
    private location: Location, private staffingService: StaffingService, private builder: FormBuilder, private globalService: GlobalService,
    private toastr: PegTostrService, private modalService: BsModalService, private registrationService: RegistrationService) {
    // Initialize reactive form
    this.formGroup = this.builder.group({
      projectName: "",
      officeToBeStaffed: "",
      teamSize: "",
      teamComments: "",
      expectedStart: "",
      duration: "",
      likelihood: "",
      latestStartDate: "",
      pipelineNotes: "",
      sellingPartner: [],
      svp: [],
      additionalInfo: "",
      ovp: [],
      isSVPHelp: "",
      isOVPHelp: "",
      languageRequired: [],
      manager: [],
      needOpsStaffingSupport: "",
      registrationStage: {},
      opportunityTypeDetails: new StaffingOpportunityTypeDetails()
    });

    this.controls = this.formGroup.controls;

    // To load token in case of third party
    // This wil generate a different token apart from current one
    this.coreService.loadUserThirdParty().then(user => {
      setTimeout(() => {
        if (this.route != undefined && this.route.params != undefined) {
          this.route.params.subscribe(data => {
            if (data != undefined && data.hasOwnProperty('params')) {
              let decodedDealId = decodeURIComponent(data.params)
              this.inputParams = decodedDealId;

              // Load the data after the updated token has been set for staffing
              this.getOpportunityDetails(decodedDealId);
              this.getConflictsData(decodedDealId);
            }
          });
        }

      }, 1000);
    });
  }

  ngOnInit(): void {
    this.getTeamSizeItems();
    this.getPipelineStatusItems();
    this.getLeadershipHelp();
    this.getLanguages();
    this.getNeedsStaffingSupport();
    //calling all offices api to cache the data
    this.staffingService.getAllOffice().subscribe(data=>{});
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getInfo() {
    return this.caseComplexity;
  }

  getConflictsData(registrationId) {
    this.staffingService.getRelatedTrackerClientsByRegistrationId(registrationId).subscribe(res => {
      let data = [];
      res.forEach(element => {
        if (element.registrationStageId != RegistrationStageEnum.ClosedBainTurnedDown && element.registrationStageId != RegistrationStageEnum.ClosedDropped && element.registrationStageId != RegistrationStageEnum.ClosedLost && element.registrationStageId != RegistrationStageEnum.Terminated) {
          if (element.registrationStageId == RegistrationStageEnum.Interest && element.value >= 75) {
            data.push(element)
          } else if ((element.registrationStageId == RegistrationStageEnum.Commitment || element.registrationStageId == RegistrationStageEnum.WorkStarted || element.registrationStageId == RegistrationStageEnum.WorkCompleted) && element.value >= 75) {
            data.push(element)
          }
        }
      });

      this.conflictsData = data.sort((a, b) => { return CommonMethods.sortConflicts(a?.registrationStageId ?? 0, a, b) });

    })
  }

  getOpportunityDetails(oppId: string) {
    this.staffingService.getPegDetails(oppId).subscribe((res: PegDetails) => {
      this.opportunityDetails = res;
      this.caseComplexity = res?.caseComplexity?.map(t => t.caseComplexityName)?.join(", ")
      // Map details to reactive form fields
      this.controls.projectName.setValue(this.opportunityDetails.projectName);
      this.controls.officeToBeStaffed.setValue(this.opportunityDetails?.officeToBeStaffed ? this.opportunityDetails?.officeToBeStaffed?.map((of) => of.officeName)?.join(', ') : '');
      if (this.opportunityDetails?.officeToBeStaffed?.length > 0) {
        this.officesToBeStaffed = this.opportunityDetails?.officeToBeStaffed;
      }
      this.controls.opportunityTypeDetails.setValue(this.opportunityDetails.opportunityTypeDetails);
      this.opportunityTypeDetails = this.opportunityDetails.opportunityTypeDetails;
      this.controls.teamSize.setValue(this.getTeamSize(this.opportunityDetails?.teamSize));
      this.controls.expectedStart.setValue(this.opportunityDetails?.expectedStart != null ? new Date(this.opportunityDetails?.expectedStart) : '');
      this.controls.latestStartDate.setValue(this.opportunityDetails?.latestStartDate != null ? new Date(this.opportunityDetails?.latestStartDate) : '');
      this.controls.duration.setValue(this.opportunityDetails?.duration);
      this.controls.likelihood.setValue(this.opportunityDetails?.likelihood?.label ? this.opportunityDetails?.likelihood?.label + '%' : '');
      this.controls.teamComments.setValue(this.opportunityDetails?.teamComments);
      this.controls.pipelineNotes.setValue(this.opportunityDetails?.pipelineNotes);
      this.controls.sellingPartner.setValue(this.opportunityDetails?.sellingPartner);
      this.controls.svp.setValue(this.opportunityDetails?.svp);
      this.controls.additionalInfo.setValue(this.opportunityDetails?.additionalInfo);
      this.controls.ovp.setValue(this.opportunityDetails?.ovp);
      this.controls.isSVPHelp.setValue(this.opportunityDetails?.isSVPHelp == true ? 'Yes' : 'No');
      this.controls.isOVPHelp.setValue(this.opportunityDetails?.isOVPHelp == true ? 'Yes' : 'No');
      this.controls.languageRequired.setValue(this.opportunityDetails?.languageRequired);
      this.controls.manager.setValue(this.opportunityDetails?.manager);
      this.controls.needOpsStaffingSupport.setValue(this.opportunityDetails?.needOpsStaffingSupport == 0 ? 'No' :
        this.opportunityDetails?.needOpsStaffingSupport == 1 ? 'Yes' : 'Not sure');
      this.controls.registrationStage.setValue(this.opportunityDetails.stage);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getConflictIconColor() {

    if (this.opportunityDetails?.mbStatus?.mbStatusId == dealMBStatus.ActiveMB) {
      return "red-color";
    } else if (this.opportunityDetails?.mbStatus?.mbStatusId == dealMBStatus.PotentialMB) {
      return "blue-color";
    }
    else {
      return "gray-color";
    }
  }

  // Return whether a specific form control is enabled or disabled
  isControlEnabled(formControlName: string | number) {
    return this.controls[formControlName].enabled;
  }

  toggleControl(formControlName: string | number, enable: any) {

    if (enable) {
      this.controls[formControlName].enable();
    } else {
      this.controls[formControlName].disable();
    }
  }
  addNewStaffingOpportunity() {

    this.router.navigate(['/staffing-creation'], { state: { registrationId: this.inputParams } });

  }
  // Send changes to the database
  saveOppChanges = (event: { target: { name: string; }, offices: Office[], value: any }) => {
    const sendUpdatesToStaffingFieldNames = ["expectedStart","duration","officeToBeStaffed","likelihood","projectName","needOpsStaffingSupport","opportunityTypeDetails"];
  
    if (event?.target?.name == 'duration') {
      let durationRegEx = new RegExp("(^(\\d{1,2})\\.\\d$)|(^\\d{0,2}$)");
      let newValue = this.formGroup.value['duration'];
      if (!durationRegEx.test(newValue)) {

        this.isInvalidDuration = true;
        this.controls.duration.setValue(this.opportunityDetails?.duration);

        setTimeout(() => {
          this.isInvalidDuration = false;
        }, 3000);

        return
      }
      if (this.controls?.duration?.value == "") {
        this.controls.duration.setValue(null);
      }
    }

    // Set office to be staffed 
    if (event.target?.name == 'officeToBeStaffed') {
      this.opportunityDetails[event.target.name] = event?.offices;
    } else if (event.target?.name == 'teamSize') {
      let teamSize = event.value;
      this.opportunityDetails[event.target.name] = teamSize;
    } else if (event.target?.name == "isSVPHelp" || event.target?.name == "isOVPHelp") {
      this.opportunityDetails[event.target.name] = this.formGroup.value[event.target.name]?.bindValue;
    } else if (event.target?.name == "registrationStage") {
      this.opportunityDetails.stage = this.formGroup.value[event.target.name];
    } else if (event.target?.name == "opportunityTypeDetails") {
      this.opportunityDetails[event.target.name] = this.formGroup.value[event.target.name];
    }
    else if (event.target?.name == "languageRequired") {
      this.opportunityDetails[event.target.name] = this.formGroup.value[event.target.name].map(l => {
        return l.name
      });

    } else if (event.target?.name == "manager") {
      this.opportunityDetails[event.target.name] = []
      this.opportunityDetails[event.target.name].push(this.formGroup.value[event.target.name]);
    } else if (event.target?.name == "needOpsStaffingSupport") {
      this.opportunityDetails[event.target.name] = this.formGroup.value[event.target.name]?.bindValue;

    }
    else {
      this.opportunityDetails[event.target.name] = this.formGroup.value[event.target.name];
    }
    if (this?.opportunityDetails?.expectedStart) {
      this.opportunityDetails.expectedStart = moment(this.opportunityDetails.expectedStart).format("DD-MMM-YYYY");
    }
    if (this?.opportunityDetails?.latestStartDate) {
      this.opportunityDetails.latestStartDate = moment(this.opportunityDetails.latestStartDate).format("DD-MMM-YYYY");
    }
    let fieldName = event?.target?.name;

    this.staffingService.upsertPegDetails(this.opportunityDetails, fieldName).subscribe((upsertedData: any) => {
      this.opportunityDetails.isOpportunityStaffed = upsertedData.isOpportunityStaffed;
      if (upsertedData.isOpportunityStaffed) {

        this.opportunityDetails.sellSideStatus = upsertedData?.sellSideStatus;
        this.opportunityDetails.mbStatus = upsertedData?.mbStatus;
        //Send Updates to Cotex

        if (upsertedData) {
          let fieldName = event.target?.name?.charAt(0).toUpperCase() + event.target?.name?.substring(1);
          this.staffingService.SendUpdatesToCortex(upsertedData?.registrationId, fieldName).subscribe((sendData: any) => {
          })
        }


        // send updates to staffing
        if (sendUpdatesToStaffingFieldNames.includes(event?.target?.name)) {
          this.staffingService.sendUpdatesToStaffing(this.opportunityDetails).subscribe((sentData: any) => {
          })
        }

        //Update OpsLikelihood Automation
        if (event?.target?.name == 'likelihood') {
          this.staffingService.updateOpsLikelihood(this.opportunityDetails.registrationId).subscribe(() => {
          })
        }
      }

    })


  }

  duplicateStaffingCard() {

    if (this.opportunityDetails.stage.registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown ||
      this.opportunityDetails.stage.registrationStageId == RegistrationStageEnum.ClosedDropped ||
      this.opportunityDetails.stage.registrationStageId == RegistrationStageEnum.ClosedLost ||
      this.opportunityDetails.stage.registrationStageId == RegistrationStageEnum.Terminated
    ) {

      this.opportunityDetails.isOpportunityStaffed = false;
    }
    else {

      const initialState = {
        data:
          'This action will duplicate the current planning card. Would you like to continue?',
        title: "Duplicate"
      };
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState,
        backdrop: "static",
        keyboard: false
      });

      this.bsModalRef.content.closeBtnName = "Close";
      this.bsModalRef.content.event.subscribe((a) => {
        // Duplicate opportunity
        if (a == "reset") {

          this.staffingService.cloneStaffedOpportunity(this.opportunityDetails.registrationId).subscribe((newOpportunityDetails: any) => {

            if (newOpportunityDetails != null && newOpportunityDetails.registrationId != -1) {

              this.toastr.showSuccess("The planning card has been duplicated. Please refresh the application to see the duplicated planning card", "Duplication Successful")

              // Force full redirect to the new planning card with visible page load

            }
            else {
              this.opportunityDetails.isOpportunityStaffed = false;
            }
          });

        }
      });

    }
  }

  getIndustryName(industry: any[]) {
    if (industry) {
      return industry.map(x => x.industryName)?.join('; ')
    }
  }

  getClientName(client: any[]) {
    if (client) {
      return client.map(x => x.clientName)?.join('; ')
    }
  }

  getTeamSize(teamSize: any[]) {
    if (teamSize) {
      return teamSize.map((x: { teamSize: any; }) => x.teamSize)?.join(', ')
    }
  }

  getPriorityName(priority: any[]) {
    if (priority) {
      return CommonMethods.getCustomPriority(this.opportunityDetails);
    }
  }

  getEmployeeNames(employee: any) {
    return CommonMethods.getEmployeeNameList(employee)?.join('; ')
  }

  getExpectedEndDate(opportunityDetails: { expectedStart: moment.MomentInput | undefined; duration: string; }) {
    if (opportunityDetails && opportunityDetails?.expectedStart) {
      let endDateGap: number;
      if (opportunityDetails.duration && opportunityDetails.duration.trim() != "") {
        endDateGap = parseInt(opportunityDetails.duration);
      } else {
        endDateGap = 2;
      }
      return moment(opportunityDetails.expectedStart).add(endDateGap, 'weeks').format('DD-MMM-YYYY')
    } else {
      return ''
    }
  }

  getTeamSizeItems() {
    this.staffingService.getTeamSize().subscribe(teamSizeData => {
      this.teamSizeItems = teamSizeData;
    })
  }


  getPipelineStatusItems() {
    this.staffingService.getLikelihood().subscribe(res => {
      this.statusItems = res;
    })
  }

  formatDate = function (dateTime: moment.MomentInput | undefined) {
    return moment(dateTime).format(this.dateFormatStr).toString();
  }



  getLeadershipHelp() {
    this.leadershipHelp = [];
    this.leadershipHelp.push({
      label: "Yes",
      bindValue: true
    },
      {
        label: "No",
        bindValue: false
      })
  }

  getNeedsStaffingSupport() {
    this.staffingSupportOptions = [];
    this.staffingSupportOptions.push({
      label: "Yes",
      bindValue: 1
    },
      {
        label: "Not sure",
        bindValue: 2
      },
      {
        label: "No",
        bindValue: 0
      })
  }


  getLanguages() {
    this.globalService.getLanguages().subscribe(languages => {
      this.languages = languages;
    })
  }

}
