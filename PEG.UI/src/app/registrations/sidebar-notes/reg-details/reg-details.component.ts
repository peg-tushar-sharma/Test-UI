import { Component, OnInit, Input, HostListener, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RegistrationService } from '../../registrations/registration.service'
import { Registrations } from '../../registrations/registrations'
import { Office } from '../../../shared/interfaces/office';
import { RegistrationRequestService } from '../../registrations/registration-request-service';
import { PegTostrService } from '../..//../core/peg-tostr.service';
import { CoreService } from '../../../core/core.service';
import { AuditLogService } from '../../../shared/AuditLog/auditLog.service';
import { GridValues } from '../../../shared/grid-generator/grid-constants';
import { fieldAuth } from '../../../shared/common/fieldAuth';
import { CommonMethods } from '../../../shared/common/common-methods';
import { LocationOfDeal } from '../../../shared/interfaces/LocationOfDeal';
import { GlobalService } from '../../../global/global.service';
import { Employee } from '../../../shared/interfaces/models';
import { industry } from '../../../shared/interfaces/industry';
import { timeStamp } from 'console';
import { CaseInfo } from '../../../shared/interfaces/caseInfo';
import { PipelineService } from '../../../pipeline/pipeline.service';
import { Opportunity_Stage } from '../../../../app/shared/enums/opportunity-stage';
import { PipelineBucketStatus } from '../../../../app/shared/enums/BucketStatus.enum';
import { OpportunityStageStatusInfo } from '../../../../app/pipeline/opportunity-stage-status-info';
import { WorkType } from '../../new-registration/workType';
import { industrSectorSubSector } from '../../../../app/shared/interfaces/industrSectorSubsector';
import { sector } from '../../../../app/shared/interfaces/sector';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { WorkTypeEnum } from '../../../../app/shared/enums/work-type.enum';
import * as moment from 'moment';
import { OpsLikelihoodEnum } from '../../../../app/shared/enums/OpsLikelihood.enum';
import { InfoText } from '../../../../app/shared/info-icon/infoText';
import { InfoTextService } from '../../../../app/shared/info-icon/infoText.service';

@Component({
  selector: 'app-reg-details',
  templateUrl: './reg-details.component.html',
  styleUrls: ['./reg-details.component.scss']
})
export class RegDetailsComponent implements OnInit, OnChanges {
  // inputs
  @Input()
  registrationId: number;
  @Input()
  public commitDate: any;
  @Input()
  public completionDate: any;
  @Input()
  public sgTI: number;
  @Input()
  public fieldAuthConfig: fieldAuth;
  @Input()
  public isRegRefresh: any = "false";

  // outputs
  @Output()
  emitRegistrationValue = new EventEmitter();
  @Output()
  workTypeEmitter = new EventEmitter();



  staffingApproverRadiooptions = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' }
  ];

  isRENRadiooptions = [
    { id: true, name: 'No concern - happy to proceed with pride' },
    { id: false, name: 'Potential concern - The regional risk team will be notified of all of the details in this registration, including the name of the target unless you have indicated the target has publicly traded equity. They will reach out to you for further discussion.' }
  ];
  isProductRENRadiooptions= [
    { id: true, name: 'No, target does not operate in one of these industries – happy to proceed with pride' },
    { id: false, name: 'Yes, target operates in one of these industries – The regional risk team will be notified of all of the details in this registration, including the name of the target unless you have indicated the target has publicly traded equity. They will reach out to you for further discussion.' }
  ];
  bsConfig: Partial<BsDatepickerConfig>;
  public datePickerOptions: any = {
    // other options...
    dateFormat: GridValues.dateFormat.toLowerCase(),
    firstDayOfWeek: 'su',
    sunHighlight: true,
    markCurrentDay: true,
    disableUntil: { day: 1, month: 1, year: 1753 }
  };

  isDisabled: boolean = false;
  registration: Registrations = null;
  updatedField: string = "";
  locationOfDeal: LocationOfDeal[] = [];
  employeeStatusCode: string = 'N,A,L';
  levelStatusCode: string = 'V,M';
  infoText: InfoText;
  topLevelIndustries: industry[] = []
  industrySectors: industrSectorSubSector = null;
  sectors: sector[] = []
  workTypes: WorkType[] = [];
  selectedSectors: any = [];
  public isClientEditing: boolean = false;
  public isEditingWorkToStart = false;
  public isEditingCommitDate = false;
  public commitedDate: any;
  public completedDate: any;
  public bainOffice: Office[];
  public enabled: boolean;
  public caseOffice: any;
  isTargetOwnerKnown: boolean = false;
  public opportunityStageStatusInfo: OpportunityStageStatusInfo = new OpportunityStageStatusInfo();

  // reg details
  estimatedStartDate;
  caseStartDate;
  caseEndDate;

  target: string;
  targetOwner: string;
  targetWebsite: string;

  constructor(private registrationService: RegistrationService, private auditLogService: AuditLogService, private pipelineService: PipelineService,
    private toastr: PegTostrService, private coreService: CoreService,
    private _regReqService: RegistrationRequestService, private globalService: GlobalService,private infoTextService: InfoTextService) {

    // Subscription to get the hedge fund updates to reflect that on side bar in real time
    if (this.registrationService && this.registrationService.updateRegistrationSidebar$) {
      this.registrationService.updateRegistrationSidebar$.subscribe(registration => {
        registration.in = this.assignTopLevelIndustry(registration.in);
        if (registration.sb) {
          registration.sb.searchableName = CommonMethods.getEmployeeName(registration.sb);
        }
        this.registration = registration;
      })
    }

  }

  ngOnInit() {
    // set datepicker config
    this.bsConfig = {
      dateInputFormat: "DD-MMM-YYYY",
      containerClass: 'theme-red',
      adaptivePosition: true,
      showWeekNumbers: false
    };

    this.globalService.getLocationofDeals().subscribe(locationOfDeal => {
      this.locationOfDeal = locationOfDeal;
    });

    this.globalService.getIndustrySectors().subscribe(industryItem => {
      this.topLevelIndustries = industryItem.filter(e => e.isTopIndustry == true);
    });

    this.globalService.getWorkTypeData().subscribe(workTypeItem => this.workTypes = workTypeItem);
    this.globalService.getOffice().subscribe(office => this.bainOffice = office);
    this.infoTextService.getInfoTooltipText().subscribe((infoText) => {

      this.infoText = infoText;

    });

    if (this.registrationId != null && this.registrationId != undefined) {
      this.getRegistrationDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.commitDate) {
      if (changes.commitDate.currentValue) {
        this.commitedDate = changes.commitDate.currentValue ? new Date(changes.commitDate.currentValue) : null;
        if (this.registration) {
          this.registration.cd = changes.commitDate.currentValue;
        }
      }
    }
    else if (changes.sgTI) {
      if (changes.sgTI.currentValue) {
        this.sgTI = changes.sgTI.currentValue ? changes.sgTI.currentValue : 0;
      }
    }

    if (changes.registrationId) {
      this.selectedSectors = [];
      if (changes.registrationId.currentValue)
        this.getRegistrationDetails();
    }

    if (changes.isRegRefresh && changes.isRegRefresh.currentValue?.refreshRegDetails) {
      this.getRegistrationDetails()
    }

  }

  getRegistrationDetails() {
    this.registrationService.getRegistrationById(this.registrationId).subscribe((reg) => {
      reg.in = this.assignTopLevelIndustry(reg.in);
      this.registration = reg;
      if (reg.in) {
        this.globalService.getAllIndustrySectorsSubSectors().subscribe((ind) => {
          this.industrySectors = ind;
        });
      }
      
      if (!reg.expectedStart) {
        reg.expectedStart = {};
      }

      reg.expectedStart.expectedStartDate = reg.expectedStart?.expectedStartDate ? moment.utc(reg.expectedStart.expectedStartDate).format('DD-MMM-YYYY') : null;
      this.estimatedStartDate = reg.expectedStart?.expectedStartDate ? new Date(reg.expectedStart.expectedStartDate) : null
      this.caseStartDate = reg.case && reg.case.caseStartDate ? new Date(reg.case.caseStartDate) : null;
      this.caseEndDate = reg.case && reg.case.caseEndDate ? new Date(reg.case.caseEndDate) : null;

      this.target = reg.tdn ? reg.tdn : null;
      this.targetOwner = reg.cr ? reg.cr : null;
      this.isTargetOwnerKnown = !this.targetOwner
      this.targetWebsite = reg.ws ? reg.ws : null;

      if (this.registration.sb) {
        this.registration.sb.searchableName = CommonMethods.getEmployeeName(this.registration.sb);
      }
      this._regReqService.registration.in = this.registration.in;
      this.sectors = this.industrySectors?.sectors?.filter((sector) =>
        sector.industryId == this.registration.in?.industryId) ?? [];
      this._regReqService.registration.ws = this.registration.ws;
      this._regReqService.registration.wts = this.registration.wts;
      this.commitedDate = reg.cd ? new Date(reg.cd) : null;
      this.completedDate = reg.ceD ? { jsdate: new Date(reg.ceD) } : null;
      this._regReqService.registration.ceD = this.registration.ceD;
      this._regReqService.registration.cd = this.registration.cd;
      this._regReqService.registration.pte = this.registration.pte;
      this._regReqService.registration.ptd = this.registration.ptd;
      this._regReqService.registration.co = this.registration.co;
      this._regReqService.registration.hfc = this.registration.hfc;
      this._regReqService.registration.ch = this.registration.ch;
      this._regReqService.registration.chdn = this.registration.chdn;
      this._regReqService.registration.csl = this.registration.csl;
      this._regReqService.registration.csldn = this.registration.csldn;
      this._regReqService.registration.oi = this.registration.oi;
      this._regReqService.registration.oidn = this.registration.oidn;
      this._regReqService.registration.sraprvcd = this.registration.sraprvcd;
      this._regReqService.registration.srAprv = this.registration.srAprv;
      this._regReqService.registration.boc = this.registration.boc;
      this._regReqService.registration.sr = this.registration.sr;
      this._regReqService.registration.pn = this.registration.pn;
      this._regReqService.registration.tln = this.registration.tln;
      this._regReqService.registration.lsd = this.registration.lsd;
      this._regReqService.registration.lud = this.registration.lud;
      this._regReqService.registration.chwec = this.registration.chwec;
      this._regReqService.registration.cslwec = this.registration.cslwec;
      this._regReqService.registration.oiwec = this.registration.oiwec;
      this._regReqService.registration.isMasked = this.registration.isMasked;
      this._regReqService.registration.sraprvwAbbr = this.registration.sraprvwAbbr;
      this._regReqService.registration.case = this.registration.case ?? {};
      this._regReqService.registration.sectors = this.registration.sectors;
      if (this.registration.sectors) {
        this.selectedSectors = this.registration.sectors.map(sector => sector.sectorId);
      }
      this._regReqService.registration.case.officeCluster = this.registration.case ? CommonMethods.getOfficeCluster(this.registration.case.caseOffice, this.bainOffice) : '';

      this.sgTI = this.registration.sgTI;
      this.caseOffice = reg.case && reg.case?.caseOffice ? reg.case.caseOffice.toString() : '';
    });
    this.isRegRefresh = false;
  }

  updateRegistrations(value: any, fieldName: string) {

    if (this.registration[fieldName] != value) {
      switch (fieldName) {

        case "ws":
          this.updatedField = "Website";
          break;
        case "tln":
          this.updatedField = "Target location";

          break;
        case "pn":
          this.updatedField = "Project Name";
          break;
        case "tdn":
          this.updatedField = "Target Name";
          break;
        case "cr":
          this.updatedField = "Target Owner";
          break;
      }
      if (value || this.registration.wti == WorkTypeEnum.SectorScan
        || (this.isTargetOwnerKnown && fieldName == "cr")) {

        this.auditLogService.addAuditLog(this.updatedField, fieldName, value);
        this.registration[fieldName] = value;
        this._regReqService.registration[fieldName] = value;
        this.updateRegistrationData();
      } else {
        switch (fieldName) {
          case "tdn":
            this.target = this.registration.tdn ? this.registration.tdn : null;
            break;
          case "cr":
            this.targetOwner = this.registration.cr && !this.isTargetOwnerKnown ? this.registration.cr : null;
            break;
          case "ws":
            this.targetWebsite = this.registration.ws ? this.registration.ws : null;
            break;
        }
      }
    }
  }
  onSectorChange(values, isIndustryChanged?: boolean) {

    this.registration.sectors = this.sectors.filter((sector) => values.includes(sector.sectorId));
    this.updatedField = "Sector";
    if (!isIndustryChanged) {
      this.auditLogService.addAuditLog(this.updatedField, null,
        this.registration.sectors?.length > 0 ? this.registration.sectors.map((sector) => sector.sectorName).join(', ') : '');
    }
    this._regReqService.registration.sectors = this.registration.sectors;
    this.updateRegistrationData();
  }

  getSectorName(sectors) {
    if (sectors?.length > 0) {
      return sectors.map((sector) => sector.sectorName).join(", ");
    }
    else {
      return "";
    }

  }

  updateCommitDate(value) {
    if (CommonMethods.converToLocal(this.commitedDate) != CommonMethods.converToLocal(this.registration.cd)) {
      let finalValue = this.commitedDate ? new Date(this.commitedDate) : null;
      let parsedDate = CommonMethods.convertDatetoUTC(finalValue);
      this.updatedField = "Commit date";
      let updatedValue = parsedDate ? parsedDate.utc : null;
      this.auditLogService.addAuditLog(this.updatedField, "Commit date", updatedValue);
      this.registration.cd = updatedValue;
      this._regReqService.registration.cd = updatedValue;
      this.updateRegistrationData();
    }
  }

  updateCompletedDate(value) {
    let parsetDate = CommonMethods.convertDatetoUTC(value.jsdate)

    this.updatedField = 'Completed date';
    const updatedValue = parsetDate ? parsetDate.utc : null;
    this.auditLogService.addAuditLog(this.updatedField, this.updatedField, updatedValue);
    this.registration.ceD = updatedValue;
    this._regReqService.registration.ceD = updatedValue;
    this.completedDate = updatedValue;
    this.updateRegistrationData();
  }

  clearDate(field) {
    switch (field) {
      case "cd":
        this.commitedDate = null;
        break;
      case "esd":
        this.estimatedStartDate = null;
        break;
      case "csd":
        this.caseStartDate = null;
        break;
      case "ced":
        this.caseEndDate = null;
        break;
    }
  }

  isPTDDisabled() {
    this.enabled = (this._regReqService.registration.wti == 2 || this._regReqService.registration.wti == 3)

    if (!this.enabled) {
      this.registration.ptd = false;
      this._regReqService.registration.ptd = false;
    }

    return this.enabled;

  }

  onIndustryChange(value) {
    this.registration.in = value;
    this.updatedField = "Industry";
    this.auditLogService.addAuditLog(this.updatedField, null, value ? value?.industryName : '');
    this._regReqService.registration.in = value;

    if (value) {
      this.globalService.getAllIndustrySectorsSubSectors().subscribe((ind) => {
        this.industrySectors = ind;
        this.sectors = this.industrySectors.sectors.filter(
          (e) => e.industryId == value?.industryId
        );
      });
    }
    this.updateRegistrationData(true);

  }

  onWorkTypeChange(value) {
    this.workTypeEmitter.emit(value.workTypeId);
  }

  pteChange(value) {
    this.isDisabled = true;
    this.registration.pte = value;
    this.updatedField = "Publicly Traded Equity";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this._regReqService.registration.pte = value;
    this.updateRegistrationData();
  }

  ptdChange(value) {
    this.isDisabled = true;
    this.registration.ptd = value;
    this.updatedField = "Publicly Traded Debt";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this._regReqService.registration.ptd = value;
    this.updateRegistrationData();
  }

  coChange(value) {
    this.isDisabled = true;
    this.registration.co = value;
    this.updatedField = "Carve Out";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this._regReqService.registration.co = value;
    this.updateRegistrationData();
  }

  spacChange(value) {
    this.isDisabled = true;
    this.registration.spac = value;
    this.updatedField = "SPAC";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this._regReqService.registration.spac = value;
    this.updateRegistrationData();
  }

  targetOwnerChange(value) {
    if (value == true) {
      this.isDisabled = true;
      this.registration.cr = "";
      this.updatedField = "Target Owner";
      this.auditLogService.addAuditLog(this.updatedField, null, "");
      this._regReqService.registration.cr = "";
      this.updateRegistrationData();
    }
  }

  updateClient(value) {
    this.isClientEditing = false;
    if (value) {
      this.isClientEditing = false;
      this.updatedField = "Client";
      this.auditLogService.addAuditLog(this.updatedField, 'cl', value.clientName);
      this.registration.cl = value;
      this._regReqService.registration.cl = value;
      if (value?.clientId && value?.clientId > 0) {
        this.registrationService.getHedgeFundByClientId(value.clientId, value.basisClientId).subscribe(data => {
          // To save the audit log for client first becasue hedge fund override that previous value
          this.auditLogService.saveAuditLog();
          this.toastr.showSuccess(this.updatedField + ' has been updated successfully', 'Success');

          // To create a new audit log in case of hedge fund is true or false
          // This is onyl ofr those client which have client id
          this.updatedField = "Client is a Hedge Fund";
          this.auditLogService.addAuditLog(this.updatedField, null, data ? data : false);
          this._regReqService.registration.hfc = data
          this.registration.hfc = data;

          this.updateRegistrationData();         
          setTimeout(() => {  
            this.sendUpdatedDataToStaffing("Client")
          }, 3000); 
        });
      }
      else {
        // To save the audit log in case of new client (which didn't have any client id)
        this.auditLogService.saveAuditLog();
        this.toastr.showSuccess(this.updatedField + ' has been updated successfully', 'Success');

        // To set the hedge fund to false becasue new client is not a hedge fund
        this.updatedField = "Client is a Hedge Fund";
        this.auditLogService.addAuditLog(this.updatedField, null, false);
        this._regReqService.registration.hfc = false
      
        this.updateRegistrationData();

        setTimeout(() => {  
          this.sendUpdatedDataToStaffing("Client")
        }, 3000); 
      }

    }
  }

  updateClientHeads(value) {
    this.isDisabled = true;
    const toUpdateData = this.getNameAndEcode(value);
    this.registration.ch = value;
    this.updatedField = 'Client Heads';
    this.auditLogService.addAuditLog(this.updatedField, 'ch', toUpdateData.eName);
    this._regReqService.registration.ch = value;
    this.updateRegistrationData();
  }

  updateClientSectorLeads(value) {
    this.isDisabled = true;
    const toUpdateData = this.getNameAndEcode(value);
    this.registration.csl = value;
    this.updatedField = "Client Sector Leads";
    this.auditLogService.addAuditLog(this.updatedField, 'csl', toUpdateData.eName);
    this._regReqService.registration.csl = value;
    this.updateRegistrationData();
  }

  updateOthersInvolved(value) {
    this.isDisabled = true;
    const toUpdateData = this.getNameAndEcode(value);
    this.registration.oi = value;
    this.updatedField = "Others Involved";
    this.auditLogService.addAuditLog(this.updatedField, 'oi', toUpdateData.eName);
    this._regReqService.registration.oi = value;
    this.updateRegistrationData();
  }

  updateStaffingApprover(value) {

    const toUpdateData = this.getNameAndEcode(value);
    this.registration.srAprv = value;
    this.updatedField = "Staffing Approver";
    this.auditLogService.addAuditLog(this.updatedField, 'srAprv', toUpdateData.eName);
    this._regReqService.registration.sraprvcd = toUpdateData.eCode;
    this.updateRegistrationData()
  }

  getNameAndEcode(employees) {
    let eCode = '';
    let eName = '';
    if (Array.isArray(employees)) {
      if (employees.length === 0) {
      } else if (employees.length === 1) {
        eCode = employees[0].employeeCode;
        eName = employees[0].searchableName;
      } else {
        eCode = employees.map(e => e.employeeCode).join(',');
        eName = employees.map(e => e.searchableName).join(';');
      }
    } else {
      eCode = employees === null ? '' : employees.employeeCode;
      eName = employees === null ? '' : employees.searchableName;
    }

    return {
      eCode,
      eName
    };
  }

  onBainOfficeChanged(selectedElement) {
    let selectedValue = selectedElement.officeCode;
    this.registration.boc = selectedValue
    this.updatedField = "Bain Office";
    this.auditLogService.addAuditLog(this.updatedField, null, selectedValue);
    this.updateRegistrationData();
  }

  onStaffingRestrictionsChanged(value) {

    this.registration.sr = value;
    this.updatedField = "Staffing Restriction";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    if (!value) {
      this.registration.srAprv = null;
      this.registration.sraprvcd = null;
    }
    this.updateRegistrationData();

  }

  onRenChanged(value) {
    this.registration.isREN = value;
    this.updatedField = "Risk Target";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this.updateRegistrationData();
  }
  onProductRenChanged(value) {
    this.registration.isProductREN = value;
    this.updatedField = "Risk Product";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this.updateRegistrationData();
  }

  hfChange(value) {
    this.isDisabled = true;
    this.registration.hfc = value;
    this.updatedField = "Client is a Hedge Fund";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this._regReqService.registration.hfc = value;
    this.updateRegistrationData();
  }

  iompChange(value) {
    this.isDisabled = true;
    this.registration.iomp = value;
    this.updatedField = "Open Market Purchase";
    this.auditLogService.addAuditLog(this.updatedField, null, value);
    this._regReqService.registration.iomp = value;
    this.updateRegistrationData();
  }

  onDealLocationChanged(selectedElement) {
    let selectedValue = selectedElement.locationName;
    this.updatedField = "Location Of Deal";
    this.registration['lodn'] = selectedValue;
    this.auditLogService.addAuditLog(this.updatedField, 'lodn', selectedValue);
    this._regReqService.registration['lodn'] = selectedValue;
    this.updateRegistrationData();
  }

  updateCaseData(value: CaseInfo, fieldName: string) {
    if (this.registration?.case?.caseCode != value?.caseCode) {
      this.updatedField = "Case Code";
      this.auditLogService.addAuditLog(this.updatedField, fieldName, value?.caseCode);
      this.registration.case = value;

      // In case of removing case code, it removes the whole value,
      // So when a new case code is entered after that, need to reset the object
      if (!this._regReqService.registration.case) {
        this._regReqService.registration.case = {};
        this._regReqService.registration.case.caseCode = value?.caseCode;
      } else {
        this._regReqService.registration.case.caseCode = value?.caseCode;
      }

      this.opportunityStageStatusInfo.oppType = "R";
      this.opportunityStageStatusInfo.OpsLikelihoodId = OpsLikelihoodEnum.Staffed;
      this.opportunityStageStatusInfo.registrationId = this.registrationId;

      if (value && value.caseCode && value.caseCode != "") {
        this.opportunityStageStatusInfo.opportunityStageId = Opportunity_Stage.ClosedWon;
        this.pipelineService.createAutomatedPlaceholder(value.caseEndDate, this.registration.id).subscribe(res => {
        });

      }
      else {

        this.opportunityStageStatusInfo.opportunityStageId = Opportunity_Stage.Backlog;
        this.caseStartDate = null;
        this.caseEndDate = null;

      }
      
      this.updateRegistrationData();
    }
  }
  updateOpsLikelihood() {
    this.pipelineService.updateOpsLikelihood(this._regReqService.registration.id).subscribe(registration => { });

  }
  updatePipelineMbActiveStatus(registrationId: number) {
    this.registrationService.updatePipelineMbActiveStatus(registrationId).subscribe(registration => {

    });

  }
  sendUpdateDataToCortex(fieldName: string) {
    this.registrationService.sendUpdatedDataToCortex(fieldName, this._regReqService.registration.id).subscribe(registration => {

    });

  }

  sendUpdatedDataToStaffing(fieldName: string) {
    this.registrationService.sendUpdatedDataToStaffing(fieldName, this._regReqService.registration.id).subscribe(registration => {

    });

  }
  updateRegistrationData(isIndustryChanged?: boolean) {
    this.registration.sb = this.getSubmittedBy();
    this.registration.lud = new Date();
    this._regReqService.registration.lud = new Date();

    // To retain the client priority so that no extra api call is required for that
    let clientPriorityName = this.registration?.cl?.clientPriorityName;

    this.registrationService.updateRegistrationDetails(this.registration)
      .subscribe((result) => {
        result.sb.searchableName = CommonMethods.getEmployeeName(result.sb);
        result.in = this.assignTopLevelIndustry(result.in);
        if (result?.cl) {
          result.cl.clientPriorityName = clientPriorityName;
        }
        this.registration.bo = result.bo;
        this.auditLogService.saveAuditLog();
        this._regReqService.registration = result;
        if (this.registration.case?.caseCode) {
          this._regReqService.registration.case = this.registration.case;
          this.caseStartDate = this.registration.case.caseStartDate ? new Date(this.registration.case.caseStartDate) : null;
          this.caseEndDate = this.registration.case.caseEndDate ? new Date(this.registration.case.caseEndDate) : null;
        }
      
        this.sendUpdateDataToCortex(this.updatedField)
        
          if(this.updatedField=="Industry")
            {
      this.sendUpdatedDataToStaffing(this.updatedField)
            }
       if(this.updatedField=="Case Code")
       {
        this.pipelineService.setOpportunityStageStatus(this.opportunityStageStatusInfo).subscribe(res => { });

        this.updateOpsLikelihood();
        this.updatePipelineMbActiveStatus(this.registration.id);
       } 
        this.emitRegistrationValue.emit(this._regReqService.registration);
        this.toastr.showSuccess(this.updatedField + ' has been updated successfully', 'Success');
        this.isDisabled = false;
        if (isIndustryChanged) {
          this.selectedSectors = [];
          this.onSectorChange(this.selectedSectors);
        }
      },
        () => {
          this.toastr.showError('Error while updating registrations. Please try again.', 'Error');
        }
      );
  }

  assignTopLevelIndustry(industry) {
    //Setting industry object once data is updated so as to update the tagID and other such details
    if (industry && this.topLevelIndustries && this.topLevelIndustries.length > 0) {
      if (this.topLevelIndustries.some(e => e?.industryId == industry?.industryId)) {
        industry = this.topLevelIndustries.find(e => e?.industryId == industry?.industryId)
      }
    }
    return industry;
  }

  getSubmittedBy() {
    let emp: Employee = {} as Employee;
    emp.searchableName = this.registration.sb.searchableName;
    emp.employeeCode = this.coreService.loggedInUser.employeeCode;
    emp.officeName = this.registration.sb.officeName;
    return emp;
  }
  onEstimatedStartDateChange(value) {
    if (
      (new Date(value).getDate() != new Date(this.registration?.expectedStart?.expectedStartDate).getDate())) {

      let finalValue = value ? new Date(value) : null;
      let parsetDate = CommonMethods.convertDatetoUTC(finalValue)

      this.updatedField = "Expected Start";
      let updatedValue = parsetDate ? parsetDate.utc : null;
      this.auditLogService.addAuditLog(this.updatedField, "Expected Start", updatedValue);

      this.registration.expectedStart = {
        expectedStartDate: finalValue
      }

      this._regReqService.registration.expectedStart = this.registration.expectedStart;
      this.estimatedStartDate = updatedValue;
      this.updateRegistrationData();
    }
  }

  toggleCRValidation(isChecked) {
    if (isChecked) {
      this.targetOwner = ""
      this.isTargetOwnerKnown = true
      this.updateRegistrations(this.targetOwner, 'cr')
    } else {
      this.isTargetOwnerKnown = false
    }
  }

}
