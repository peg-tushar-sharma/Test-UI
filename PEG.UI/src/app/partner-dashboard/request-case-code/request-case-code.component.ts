import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subject, forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';

// interfaces
import { PartnerDashboard } from '../partner-dashboard/partner-dashboard';
import { industry } from '../../shared/interfaces/industry';
import { TeamSize } from '../../shared/interfaces/teamSize';
import { Employee } from '../../shared/interfaces/Employee';
import { Registrations } from '../../registrations/registrations/registrations';
import { Office } from '../../shared/interfaces/office';
import { Capability } from '../../shared/interfaces/capability';
import { FundType } from "../../shared/interfaces/fundType";
import { CaseCodeRequestForm } from '../../shared/interfaces/caseCodeRequestForm';
import { EMPLOYEE_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../../shared/common/constants';
import { InfoText } from '../../shared/info-icon/infoText';

// services
import { GlobalService } from '../../global/global.service';
import { PartnerDashboardService } from '../partner-dashboard/partner-dashboard.service';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { CommonMethods } from '../../shared/common/common-methods';
import { RequestCaseCodeService } from './request-case-code.service';
import { NewOpportunityService } from '../../opportunity/new-opportunity/new-opportunity.service';
import { InfoTextService } from '../../shared/info-icon/infoText.service';

// form
import { RequestCaseCodeFormBuilder } from './request-case-code-form-builder';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { industrSectorSubSector } from '../../shared/interfaces/industrSectorSubsector';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { request } from 'http';
import { Currency } from '../../shared/interfaces/currency';
import { OpportunityTypeDetails } from '../../shared/opportunity-type-details/opportunity-type-details';
import { CoreService } from '../../core/core.service';
import { PegTostrService } from '../../core/peg-tostr.service';


@Component({
  selector: 'app-request-case-code',
  templateUrl: './request-case-code.component.html',
  styleUrls: ['./request-case-code.component.scss']
})
export class RequestCaseCodeComponent implements OnInit, OnDestroy {

  @Output() requestCaseCodeEmitter = new EventEmitter();

  caseData: PartnerDashboard | any;
  requestDataToSend: CaseCodeRequestForm;
  bsConfig: Partial<BsDatepickerConfig>;
  bsEndDateConfig: Partial<BsDatepickerConfig>;
  employeesTypeAhead = new Subject<string>();
  registration: Registrations = new Registrations();
  opportunity: any;
  ngUnsubscribe$ = new Subject();

  invalidFormMessage: string = '';

  infoText: InfoText;
  isSubmissionInProgress: boolean = false;
  // booleans
  isEmployeeLoading: boolean = false;
  isDiscounted: boolean;
  isFormSubmitted: boolean;
  isFormValid: boolean = false;

  // files
  discountFiles: File[] = [];
  scopeOfWorkFiles: File[] = [];

  // dropdown options
  industryList: industry[] = [];
  industrySectors: industrSectorSubSector = { industries: [], sectors: [], subSectors: [] };
  sectorList: any[] = [];
  employeeList: Employee[] = [];
  officeList: Office[] = [];
  capabilityList: Capability[] = [];
  fundTypeList: FundType[] = [];
  teams: TeamSize[] = [];
  teamSizeList: any[] = [];
  weeklyRackRate: any[] = [];
  opportunityTypeDetails: OpportunityTypeDetails;
  currencyList: Currency[] = [];
  opportunityTypeDetailsLabel: any;
  ratePriced:any;
  backupNewOpportunity: any = undefined;
  isDiscountedOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ];




  partnerNotesMentionEmployees: Employee[] = [];
 
  fileContentTypes = [
    { fileExtention: ".pdf", contentType: "application/pdf" }
    , { fileExtention: ".docx", contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    , { fileExtention: ".xlsx", contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    , { fileExtention: ".csv", contentType: "text/csv" }
    , { fileExtention: ".txt", contentType: "text/plain" }
    , { fileExtention: ".jpeg", contentType: "image/jpeg" }
    , { fileExtention: ".png", contentType: "image/png" }
    , { fileExtention: ".jpg", contentType: "image/jpeg" }
    , { fileExtention: ".pptx", contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }
    , { fileExtention: ".ppt", contentType: "application/vnd.ms-powerpoint" }

  ]
  contentTypeLabel: string = '';
  // service roles list
  roleFocused: string = '';
  serviceRolesList = [
    { servingRole: "SVP", formControlName: "svp", allocationName: "svpAllocation" },
    { servingRole: "OVP", formControlName: "ovp", allocationName: "ovpAllocation" },
    { servingRole: "Case Manager", formControlName: "manager", allocationName: "managerAllocation" },
    { servingRole: "Core Advisor", formControlName: "coreAdvisor", allocationName: "coreAdvisorAllocation" },
    { servingRole: "Light Advisor", formControlName: "lightAdvisor", allocationName: "lightAdvisorAllocation" },
    { servingRole: "Advisor", formControlName: "advisor", allocationName: "advisorAllocation" },
    { servingRole: "Billing Partner", formControlName: "billingPartner", allocationName: "billingPartnerAllocation" },
    { servingRole: "QTR Back Partner", formControlName: "qtr", allocationName: "qtrAllocation", tooltipName: "CaseCodeSellingRoles" },
    { servingRole: "Additional Selling Partner", formControlName: "sellingPartners", allocationName: "sellingPartnerAllocation", tooltipName: "CaseCodeSellingPartner" },
    { servingRole: "Bain Expert (High)", formControlName: "highBainExpert", allocationName: "highBainExpertAllocation" },
    { servingRole: "Bain Expert (Light)", formControlName: "lightBainExpert", allocationName: "lightBainExpertAllocation" }
  ];

  // forms
  requestForm: FormGroup = this.formBuilder.buildRequestForm();
  caseDetailsForm: FormGroup = this.requestForm.controls['caseDetailsForm'] as FormGroup;
  resourceDetailsForm: FormGroup = this.requestForm.controls['resourceDetailsForm'] as FormGroup;
  emailDetailsForm: FormGroup = this.requestForm.controls['emailDetailsForm'] as FormGroup;

  constructor(
    private modalef: BsModalRef,
    private globalService: GlobalService,
    private pdService: PartnerDashboardService,
    private formBuilder: RequestCaseCodeFormBuilder,
    private registrationService: RegistrationService,
    private requestCaseCodeService: RequestCaseCodeService,
    private newOppService: NewOpportunityService,
    private currencyPipe: CurrencyPipe,
    private infoTextService: InfoTextService,
    private coreService: CoreService,
     private toastr: PegTostrService,
  ) {
    this.contentTypeLabel = this.fileContentTypes.map((x) => x.contentType).join(',');
    // employees
    this.employeesTypeAhead.pipe(
      tap(() => { this.employeeList = []; this.isEmployeeLoading = true; }),
      debounceTime(200),
      switchMap((term) => this.pdService.getEmployeeNames(term, EMPLOYEE_STATUS_CODE, LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE)),
      tap(() => this.isEmployeeLoading = false)
    ).subscribe((items) => {
      items.forEach(element => {
        element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
      });

      this.employeeList = items;
    });
  }

  ngOnInit(): void {
    this.caseDetailsForm.get('weeklyRackRate').disable();
    if (this.isFormSubmitted) {
      this.caseDetailsForm.disable();
      this.resourceDetailsForm.disable();
      this.emailDetailsForm.disable();
    }

    this.bsConfig = {
      containerClass: 'theme-dark-blue request-cc-datepicker',
      dateInputFormat: 'MMM-DD-YYYY',
      isAnimated: true,
      showWeekNumbers: false,
      selectFromOtherMonth: true,
      adaptivePosition: true,
   
      minDate: new Date()
    };

    this.bsEndDateConfig = {
      containerClass: 'theme-dark-blue request-cc-datepicker',
      dateInputFormat: 'MMM-DD-YYYY',
      isAnimated: true,
      showWeekNumbers: false,
      selectFromOtherMonth: true,
      adaptivePosition: true,
      daysDisabled: [0, 6],
      minDate: new Date()
    };
    this.backupNewOpportunity = undefined;
    forkJoin([
      this.globalService.getIndustrySectors(),
      this.globalService.getAllIndustrySectorsSubSectors(),
      this.globalService.getTeamSize(),
      this.requestCaseCodeService.getOffice(),

      this.globalService.getFundTypes(),
      this.globalService.getRatePriced(),
      this.globalService.getCapabilities(),
      this.globalService.getWeeklyRackRate(),
      this.requestCaseCodeService.getNewOpportunityById(this.caseData.registrationId),
      this.infoTextService.getInfoTooltipText(),
      this.globalService.getCurrency(),
    ]).subscribe(([industries, industrySectors, teamSizeList, offices, fundTypes, ratePriced,capabilities, weeklyRackRate, opportunity, infoText, currencyList]) => {
      this.industryList = industries.filter((e) => e.isTopIndustry === true);
      this.industrySectors = industrySectors;

      this.teamSizeList = teamSizeList.filter((x) => x.isEnabledForPartner);//The actual Team size list specific to partner new opp Form

      this.backupNewOpportunity = JSON.parse(JSON.stringify(opportunity));

      this.officeList = offices.filter((o) => o.regionId != 4);
      this.capabilityList = capabilities;
      this.weeklyRackRate = weeklyRackRate;
      this.fundTypeList = fundTypes;
      this.ratePriced=ratePriced;
      this.opportunity = opportunity;
      this.infoText = infoText;
      this.opportunityTypeDetails = this.opportunity.opportunityTypeDetails;
      this.opportunityTypeDetailsLabel = CommonMethods.generateOpportunityTypeDetailsLabel(this.opportunityTypeDetails);

      this.caseDetailsForm.get('opportunityTypeDetailsreadonly').setValue(this.opportunityTypeDetailsLabel)
      //Set values for drop downs
      this.currencyList = currencyList.filter(e => e.statusCode == true);
      this.currencyList.map(x => { return x.searchableName = x.currencyName + x.serviceCode });
      this.currencyList = this.currencyList.sort((a, b) => { // Sort to show USD and CAD on top
        // Define a priority for 'US' and 'CD'
        const priority = {
          'US': 1, // US Dollar
          "PS": 2,// GBP
          'EU': 3, // Euro 
        };
        const aPriority = priority[a.currencyCode] || 4; // Default to lower priority
        const bPriority = priority[b.currencyCode] || 4;

        return aPriority - bPriority; // Sort based on priority
      });

      this.caseDetailsForm.get('ratePricedAt').setValue(1);
      if (this.caseData && this.opportunity) {
        this.setData();
      }
    });

    this.caseDetailsForm.get('teamSize').valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {

        this.ManageNotes();
        let revenueCurrency = this.caseDetailsForm.get('revenueCurrency').value;
        this.setRackRate(revenueCurrency, data);
      });


      this.resourceDetailsForm.get('svp')?.valueChanges.subscribe((selectedValue) => {
    
        if (selectedValue) {
          // Set the same value in recipients dropdown
 
          const currentRecipients = this.emailDetailsForm.get('recipients')?.value || []; 
          const recipients = selectedValue.map((value) => value);       
          const uniqueRecipients = this.mergeUniqueRecipients(recipients,currentRecipients);
           this.emailDetailsForm.get('recipients')?.setValue(uniqueRecipients);
        }
      });
      this.resourceDetailsForm.get('ovp')?.valueChanges.subscribe((selectedValue) => {
      
        if (selectedValue) {
          // Set the same value in recipients dropdown
        
          const currentRecipients = this.emailDetailsForm.get('recipients')?.value || []; 
          const recipients = selectedValue.map((value) => value);       
          const uniqueRecipients = this.mergeUniqueRecipients(recipients, currentRecipients);
           this.emailDetailsForm.get('recipients')?.setValue(uniqueRecipients);
        }
      });
     
      


  } 
   mergeUniqueRecipients(...lists: any[][]): any[] {
   
    // Flatten the lists and create a Map to remove duplicates based on 'id'
    return Array.from(
      new Map(lists.flat().map((item) => [item.employeeCode, item])).values()
    );
  }
  closeModal() {
    this.modalef.hide();
  }

  onChangeCurrency(event) {
    let teamSize = this.caseDetailsForm.get('teamSize').value;
    this.setRackRate(event, teamSize)

  }
  downloadDocument(item) {
    this.requestCaseCodeService.getCaseRequestDocumentById(item.documentId).subscribe((response) => {
      let contentType = this.fileContentTypes.find((x) => x.fileExtention == item.fileExtention)?.contentType;
      if (contentType) {
        this.downloadBase64File(response, contentType, item.fileName);
      }
    });
  }
 
  removeRecipient(item )
  {
    
    const svpSelected = this.resourceDetailsForm.get('svp')?.value || [];
    const ovpSelected = this.resourceDetailsForm.get('ovp')?.value || [];
    
    const currentRecipients = this.emailDetailsForm.get('recipients')?.value || [];
  
    // Check if this person is still selected in svp or ovp
    const stillSelectedInSVP = svpSelected.some((val) => val?.employeeCode === item?.employeeCode);
    const stillSelectedInOVP = ovpSelected.some((val) => val?.employeeCode === item?.employeeCode);
    const stillSelectedInPartnerNotes = this.partnerNotesMentionEmployees.some((val) => val?.employeeCode === item?.employeeCode);
  
    if (!stillSelectedInSVP && !stillSelectedInOVP && !stillSelectedInPartnerNotes) {
      // If not selected in either, remove from recipients
      const updatedRecipients = currentRecipients.filter(
        (val) => val?.employeeCode !== item?.employeeCode
      );
      this.emailDetailsForm.get('recipients')?.setValue(updatedRecipients);
    }
  }
  removeSelection(item, fieldName) 
  {   
   
    const currentValue = this.resourceDetailsForm.get(fieldName).value;
       const updatedValue = currentValue.filter(val => val?.employeeCode != item?.employeeCode);
        this.resourceDetailsForm.get(fieldName).setValue(updatedValue);
        if(fieldName=='ovp' || fieldName=='svp'){
        this.removeRecipient(item);
        }
  }

  removeRecipientSelection(item)
  {
    const currentValue = this.emailDetailsForm.get('recipients').value;
    const updatedValue = currentValue.filter(val => val?.employeeCode != item?.employeeCode);
     this.emailDetailsForm.get('recipients').setValue(updatedValue);
  }
  downloadBase64File(base64Data: string, contentType: string, filename: string) {
    // Decode base64 string to binary
    const binaryString = atob(base64Data); // atob = ASCII to binary
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  setRackRate(revenueCurrency, teamSize) {
    if ((teamSize != null || teamSize != undefined) && (revenueCurrency != null || revenueCurrency != undefined)) {

      let weeklyRacketData = this.weeklyRackRate.find(x => x.teamSizeId == teamSize?.teamSizeId && x.pegCurrencyId == revenueCurrency?.pegCurrencyId);
      this.caseDetailsForm.get('weeklyRackRate').setValue(this.currencyPipe.transform(weeklyRacketData?.rackRate, revenueCurrency.serviceCode));
      this.caseDetailsForm.get('weeklyRackRateId').setValue(weeklyRacketData?.weeklyRackRateMappingId);

    }
    else {
      this.caseDetailsForm.get('weeklyRackRate').setValue(this.currencyPipe.transform(null));
      this.caseDetailsForm.get('weeklyRackRateId').setValue(null);

    }
  }
  // set initial data
  setData() {

    // caseDetailsForm
    this.caseDetailsForm.get('pipelineId').setValue(this.opportunity?.pipelineId);
    this.caseDetailsForm.get('registrationId').setValue(this.opportunity?.registrationId);
    this.caseDetailsForm.get('client').setValue(this.opportunity?.client ? this.opportunity?.client : null);
    this.caseDetailsForm.get('industry').setValue(this.opportunity?.industry ? this.opportunity?.industry : null);
    this.caseDetailsForm.get('workType').setValue(this.opportunity?.workType ? this.opportunity?.workType : null);   
    this.caseDetailsForm.get('registrationStatus').setValue(this.opportunity?.registrationStatus ? this.opportunity.registrationStatus : null);  
    this.caseDetailsForm.get('expectedProjectName').setValue(this.opportunity?.expectedProjectName ? this.opportunity.expectedProjectName : null);
    
    // industry
    if (this.opportunity?.industry && this.industrySectors.sectors.length) {
      this.caseDetailsForm.get('industry').setValue(this.opportunity?.industry ? this.opportunity?.industry : null);

      const id = this.opportunity?.industry?.industryId;
      this.sectorList = this.industrySectors.sectors.filter((e) => e.industryId == id);
    }

    // dates & duration
    this.caseDetailsForm.get('expectedStartDate').setValue(this.opportunity?.expectedStartDate ? new Date(this.opportunity?.expectedStartDate) : null);
    this.caseDetailsForm.get('duration').setValue(this.opportunity?.duration ? this.opportunity?.duration : null);

    if (this.opportunity?.expectedStartDate && this.opportunity?.duration) {
      const duration = this.opportunity?.duration;
     const endDate=moment(CommonMethods.getEndDate(this.opportunity?.expectedStartDate,duration));
      this.caseDetailsForm.get('endDate').setValue(endDate.toDate());
    } else {
      this.caseDetailsForm.get('endDate').setValue(null);
    }
    if (this.opportunity.revenueCurrency != null && this.opportunity.revenueCurrency.pegCurrencyId > 0) {
      this.opportunity.revenueCurrency.searchableName = this.opportunity.revenueCurrency.currencyName + this.opportunity.revenueCurrency.serviceCode;

      this.caseDetailsForm.get('revenueCurrency').setValue(this.opportunity?.revenueCurrency ? this.opportunity.revenueCurrency : null);

    }

    this.caseDetailsForm.get('teamComments').setValue(this.opportunity?.teamComments ? this.opportunity.teamComments : null);

    if (this.opportunity?.teamSize && this.opportunity.teamSize.length == 1) {
      this.caseDetailsForm.get('teamSize').setValue(this.opportunity?.teamSize ? this.opportunity.teamSize[0] : null);
    }
    if (this.opportunity?.ratePricedAt != null && this.opportunity?.ratePricedAt > 0) {
      this.caseDetailsForm.get('ratePricedAt').setValue(this.opportunity?.ratePricedAt);
    }


    this.caseDetailsForm.get('financeNotes').setValue(this.opportunity?.financeNotes ? this.opportunity?.financeNotes : null);
    this.caseDetailsForm.get('discountNotes').setValue(this.opportunity?.discountNotes ? this.opportunity?.discountNotes : null);
    this.caseDetailsForm.get('isDiscounted').setValue(this.opportunity?.isDiscounted);
    if (this.opportunity?.isDiscounted) {
      this.handleIsDiscounted(this.opportunity?.isDiscounted);
    }
    this.caseDetailsForm.get('fundType').setValue(this.opportunity?.fundType);
    this.caseDetailsForm.get('capability').setValue(this.opportunity?.capability);
    this.caseDetailsForm.get('opportunityTypeDetails').setValue(this.opportunity?.opportunityTypeDetails);


    // Billing Details
    this.caseDetailsForm.get('billingEmail').setValue(this.opportunity.billingEmail ? this.opportunity.billingEmail : null);
    this.caseDetailsForm.get('billingContact').setValue(this.opportunity.billingContact ? this.opportunity.billingContact : null);
    this.caseDetailsForm.get('billingOffice').setValue(this.opportunity.billingOffice ? this.opportunity.billingOffice : null);
    this.caseDetailsForm.get('billingPartner').setValue(this.opportunity.billingPartner ? this.opportunity.billingPartner : null);

    //Resource Details
    this.resourceDetailsForm.get('ovp').setValue(this.opportunity.ovp ? this.opportunity.ovp : null);
    this.resourceDetailsForm.get('svp').setValue(this.opportunity.svp ? this.opportunity.svp : null);
    if (this.opportunity?.manager != null && this.opportunity?.manager?.employeeCode!=null &&  this.opportunity?.manager?.employeeCode!="") {
      this.opportunity.manager.searchableName = CommonMethods.getEmployeeNameWithoutAbbr(this.opportunity.manager);
      this.resourceDetailsForm.get('manager').setValue(this.opportunity?.manager ? this.opportunity.manager : null);
    }
    this.resourceDetailsForm.get('coreAdvisor').setValue(this.opportunity.coreAdvisor ? this.opportunity.coreAdvisor : null);
    this.resourceDetailsForm.get('lightAdvisor').setValue(this.opportunity.lightAdvisor ? this.opportunity.lightAdvisor : null);
    this.resourceDetailsForm.get('qtr').setValue(this.opportunity.qtr ? this.opportunity.qtr : null);
    this.resourceDetailsForm.get('sellingPartners').setValue(this.opportunity?.sellingPartners ? this.opportunity.sellingPartners : null);
    this.resourceDetailsForm.get('highBainExpert').setValue(this.opportunity.highBainExpert ? this.opportunity.highBainExpert : null);
    this.resourceDetailsForm.get('lightBainExpert').setValue(this.opportunity.lightBainExpert ? this.opportunity.lightBainExpert : null);

    // emailDetailsForm

    this.emailDetailsForm.get('recipients').setValue(this.opportunity.recipients ? this.opportunity.recipients : null);
if(this.opportunity?.partnerNotes)
{
  const htmlFormatted = this.opportunity?.partnerNotes
  .split('\n')
  .map(line => `<p>${line || '<br>'}</p>`)
  .join('');
    this.emailDetailsForm.get('partnerNotes').setValue(htmlFormatted);
  
}
  
    

  }

  // handle dates
  startDateChanged(event) {
    this.bsEndDateConfig = {
      ...this.bsConfig,
      minDate: new Date(event)
    };

    const duration = this.caseDetailsForm.get('duration').value;

    if (duration) {
      const endDate=moment(CommonMethods.getEndDate(event,duration));
      setTimeout(() => {
        this.caseDetailsForm.get('endDate').setValue(endDate.toDate());
      }, 100);

    } else {
      this.caseDetailsForm.get('endDate').setValue(null);

    }
  }

  endDateChanged(event) {
    const endDateNote = document.getElementById('endDateNote');
    const expectedStartDate = this.caseDetailsForm.get('expectedStartDate').value;
    const duration = this.caseDetailsForm.get('duration').value;
    if (expectedStartDate && duration) {   
      const endDate=moment(CommonMethods.getEndDate(expectedStartDate,duration));
      if (this.getDateValue(event) == this.getDateValue(endDate.toDate())) { // Compare only the day part of the date

        endDateNote.style.display = 'none'; // Hide the note for larger teams
      }
      else {
        endDateNote.style.display = 'inline'; // Show the note if the team size is small

      }
    }
  }

  getDateValue(value) {
    if (value === undefined || value == null) return null;
    else return moment(value).format("DD-MMM-YYYY");
  }
  setEndDate() {
    const expectedStartDate = this.caseDetailsForm.get('expectedStartDate').value;
    const duration = this.caseDetailsForm.get('duration').value;

    if (expectedStartDate && duration) {


CommonMethods.ValidateKeysForAllocation

   
      const endDate=moment(CommonMethods.getEndDate(expectedStartDate,duration));
      this.caseDetailsForm.get('endDate').setValue(endDate.toDate());
    }
  }
  durationChanged() {
    this.setEndDate();
    this.ManageNotes();
  }
  ManageNotes() {
    const duration = this.caseDetailsForm.get('duration').value;
    const teamSize = this.caseDetailsForm.get('teamSize').value;

    if (teamSize != null || duration != null) {
      const notelabel = document.getElementById('noteDueToTeamSize');
      const durationLabel = document.getElementById('noteDueToDuration');
      if (teamSize?.teamSize == 'M+2') {
        notelabel.style.display = 'inline'; // Show the note if the team size is small

      }
      else {
        notelabel.style.display = 'none'; // Hide the note for larger teams

      }
      if (duration < 2) {
        durationLabel.style.display = 'inline'; // Show the note if the team size is small

      }
      else {
        durationLabel.style.display = 'none'; // Hide the note for larger teams

      }



    }
  }

  onChangeBillingPartner(event: any) {

    if (event) {
      let office = this.officeList.find(x => x.officeCode == event?.homeOfficeCode);
      this.caseDetailsForm.get('billingOffice').setValue(office ? office : null);
    }
    else {
      this.caseDetailsForm.get('billingOffice').setValue(null);
    }
  }
  // handle inputs
  validateDurationKeys(event) {
    CommonMethods.ValidateKeysForDuration(event);
  }

  validateAllocationKeys(event) {
    CommonMethods.ValidateKeysForAllocation(event);
  }

  checkAllocationValid(event) {
    let value = Number(event.target.value);
    if (value > 100) {
      event.target.classList.add('invalid');
      this.invalidFormMessage = 'Allocation cannot be more than 100';
    } else {
      event.target.classList.remove('invalid');
      this.invalidFormMessage = '';
    }
  }

  handleIsDiscounted(event: boolean) {
    this.isDiscounted = event;

    if (this.isDiscounted == true) {
          this.caseDetailsForm.get('discountNotes').setValidators([
        Validators.required,
        Validators.maxLength(800)
      ]);
      // comment below code temporary
      this.caseDetailsForm.get('discountApproval').setValidators(Validators.required);
    } else {
     
      const discountNotesControl = this.caseDetailsForm.get('discountNotes');

// Clear all validators
discountNotesControl.clearValidators();

      // comment below code temporary
      this.caseDetailsForm.get('discountApproval').removeValidators(Validators.required);
    }

    this.caseDetailsForm.get('discountNotes').updateValueAndValidity();
    // comment below code temporary
    this.caseDetailsForm.get('discountApproval').updateValueAndValidity();
  }

  handleFileInput(event, type: string) {
    const files: File[] = event.target.files;
    const maxFileSize = 15 * 1024 * 1024; // 15 MB in bytes
  
    if (type == 'discount') {
      Array.from(files).forEach((file) => {
        if (file.size <= maxFileSize) {
          this.discountFiles.push(file);
        } else {
          this.toastr.showWarning("File is too large. Please select a file smaller than 15 MB.","Document Upload")

        }
      });
  
      this.caseDetailsForm.get('discountApproval').setValue(this.discountFiles);
    } else {
      Array.from(files).forEach((file) => {
        if (file.size <= maxFileSize) {
          this.scopeOfWorkFiles.push(file);
        } else {
          this.toastr.showWarning("File is too large. Please select a file smaller than 15 MB.","Document Upload")

        }
      });
  
      this.caseDetailsForm.get('scopeOfWork').setValue(this.scopeOfWorkFiles);
    }
  }
  handleFileDelete(index, type: string) {
    if (type == 'discount') {
      this.discountFiles.splice(index, 1);

      this.caseDetailsForm.get('discountApproval').setValue(this.discountFiles);
      this.caseDetailsForm.get('discountApproval').updateValueAndValidity();
    } else {
      this.scopeOfWorkFiles.splice(index, 1);

      this.caseDetailsForm.get('scopeOfWork').setValue(this.scopeOfWorkFiles);
      this.caseDetailsForm.get('scopeOfWork').updateValueAndValidity();
    }
  }

  // submit
  submitRequest(event) {
    const form: NgForm = event;
    const requestData: CaseCodeRequestForm = {
      ...this.requestForm.value.caseDetailsForm,
      ...this.caseDetailsForm.getRawValue(),
      ...this.requestForm.value.resourceDetailsForm,
      ...this.requestForm.value.emailDetailsForm
    };


    requestData.teamSize = [requestData.teamSize];
    requestData.partnerNotes=this.emailDetailsForm.get('partnerNotesAllocation').value;
    if (form.valid) {
      if (this.backupNewOpportunity && requestData) {
        let changesLog = CommonMethods.compareCaseCodeObjectManually(this.backupNewOpportunity, requestData, this.coreService.loggedInUser.employeeRegionId);
        requestData.changeLog = changesLog;

      }
      this.isSubmissionInProgress = true;

      this.requestCaseCodeService.submitCaseCodeRequest(requestData).subscribe((response) => {

        this.requestCaseCodeEmitter.emit({ 'registrationId': requestData.registrationId, 'caseRequestId': response });
        this.backupNewOpportunity = undefined;
        this.isSubmissionInProgress = false;


        this.closeModal();
      });

    } else {
      this.invalidFormMessage = 'Fill in all required fields';
    }
  }

  getTooltipText(property: string): string {
    if (this.infoText) {
      return this.infoText[property];
    } else {
      ''
    }
  }
  onDropdownClickHandler() {
    event.preventDefault();
  }
  onOpportunityTypeDetailsChange(event) {
    this.caseDetailsForm.get('opportunityTypeDetails').setValue(event ? event : null);

  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(null);
    this.ngUnsubscribe$.complete();
  }




onRecipientsUpdate(event)
{
  const currentRecipients = this.emailDetailsForm.get('recipients')?.value || [];      
  const uniqueRecipients = this.mergeUniqueRecipients(currentRecipients,event);
  this.emailDetailsForm.get('recipients')?.setValue(uniqueRecipients);

}
 onBlurPartnerNotes(partnerData: any)
 { const plainText = partnerData?.partnerNotes.replace(/\r?\n$/, '')
   this.emailDetailsForm.get('partnerNotesAllocation').setValue(plainText);
   //this.emailDetailsForm.get('partnerNotes').setValue(partnerData?.partnerNotes);
   console.log("onBlurPartnerNotes")
   console.log(partnerData?.partnerNotes)

  this.partnerNotesMentionEmployees = partnerData?.partnerNotesMentionEmployees || [];

   let removedEmployees: any[] = partnerData.removedPartnerList;

   const svpSelected = this.resourceDetailsForm.get('svp')?.value || [];
   const ovpSelected = this.resourceDetailsForm.get('ovp')?.value || [];
   
  
   removedEmployees.forEach(item => {
     const currentRecipients = this.emailDetailsForm.get('recipients')?.value || [];
     // Check if this person is still selected in svp or ovp
     const stillSelectedInSVP = svpSelected.some((val) => val?.employeeCode === item?.employeeCode);
     const stillSelectedInOVP = ovpSelected.some((val) => val?.employeeCode === item?.employeeCode);


     if (!stillSelectedInSVP && !stillSelectedInOVP) {
       // If not selected in either, remove from recipients
       const updatedRecipients = currentRecipients.filter(
         (val) => val?.employeeCode !== item?.employeeCode
       );

       
       this.emailDetailsForm.get('recipients')?.setValue(updatedRecipients);
     }
   })
   
 }
}
