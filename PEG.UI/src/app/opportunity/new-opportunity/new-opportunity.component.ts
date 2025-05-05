import { Region } from './../../shared/enums/region';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EMPLOYEE_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE } from '../../shared/common/constants'
import { FormArray, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, forkJoin, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AdditionalServices } from '../../shared/interfaces/additionalServices';
import { CaseComplexity } from '../../shared/interfaces/caseComplexity';
import { CategoryType } from '../../shared/enums/ga-category.enum';
import { Client } from '../../shared/interfaces/client';
import { CommonMethods } from '../../shared/common/common-methods';
import { CoreService } from '../../core/core.service';
import { Employee } from '../../shared/interfaces/Employee';
import { FormControl } from "@angular/forms";
import { GlobalService } from '../../global/global.service';
import { InfoText } from '../../shared/info-icon/infoText';
import { InfoTextService } from '../../shared/info-icon/infoText.service';
import { LEVEL_STATUS_CODE } from '../../shared/common/constants'
import { LocationOfDeal } from '../../shared/interfaces/LocationOfDeal';
import { NewOpportunityService } from './new-opportunity.service';
import { Office } from '../../shared/interfaces/office';
import { OppFormSection } from './oppFormSection';
import { OpportunityFormBuilder } from './newopportunityform';
import { PegTostrService } from '../../core/peg-tostr.service';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { RoleType } from '../../shared/enums/role-type.enum';
import { User } from '../../security/app-user-auth';
import { WorkType } from '../../registrations/new-registration/workType';
import { WorkTypeEnum } from '../../shared/enums/work-type.enum';
import { industry } from '../../shared/interfaces/industry';
import { TeamSize } from '../../shared/interfaces/teamSize';
import { AppInsightWrapper } from '../../applicationInsight/appInsightWrapper';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Currency } from '../../shared/interfaces/currency';
import { industrSectorSubSector } from '../../shared/interfaces/industrSectorSubsector';

@Component({
  selector: 'app-new-opportunity',
  templateUrl: './new-opportunity.component.html',
  styleUrls: ['./new-opportunity.component.scss']
})
export class NewOpportunityComponent implements OnInit, OnChanges {
  formSections: OppFormSection[] = [
    new OppFormSection("registration-info", "Registration Info"),
    new OppFormSection("risk-assessment", "Risk Assessment"),
    new OppFormSection("experts", "Experts", false),
    new OppFormSection("pipeline", "Pipeline", false)
  ];
  @ViewChild('form', { static: true })
  private form: NgForm;
  isSubmitDisabled: boolean = false;
  infoText: InfoText;
  currentSection: string;
  isNewOpFormDataLoading:boolean = false;

  workTypEditMode: boolean = true;
  selectedWorkType: WorkType;

  backupNewOpportunity: any = undefined;
  dateFormatStr: string = 'DD-MMM-YYYY';
  minDate: Date = new Date();
  isPlaceholderOpportunity = false;
  bsConfig: Partial<BsDatepickerConfig>;
  clients: Client[] = [];
  clientTypeAhead = new Subject<string>();
  clientHeads: Employee[];
  clientSectorLeads: Employee[];
  employeeLoad: boolean = false;
  employeeTypeAhead = new Subject<string>();
  employeeTypeAheadWIthBAN = new Subject<string>();
  employeeList: Employee[];
  clientLoad: boolean = false;
  isClearOnClient: boolean = false;
  isClearOnTarget: boolean = false;
  isClearOnIndustry: boolean = false;
  isClearOnSector: boolean = false;

  locationOfDeal: LocationOfDeal[] = [];

  industries: industry[] = [];
  teamSizeList: TeamSize[] = [];
  likelihoodList: any[] = [];
  industrySectors: industrSectorSubSector = { industries: [], sectors: [], subSectors: [] };
  industryLoad: boolean = false;
  sectorsList: any[];
  workTypes: WorkType[] = [];
  deviceInfo: any;
  officesToBeStaffed: Office[] = [];
  clientCommitments: any;
  answers: any = [];
  caseComplexity: CaseComplexity[] = [];
  additionalServices: AdditionalServices[] = [];
  currencyList: Currency[] = [];
  currentUserData: User = new User();
  isAMER: boolean = false;
  isShowSection = false;
  showWebsite: boolean = true;
  opportunitynew: FormGroup = this.opportunityFormBuilder.buildOpportunityForm();
  languages: any = []
  canEditPipeline: boolean = true;
  canEditExperts: boolean = true;
  editExpertCallDate: boolean = true
  source: any;
  backupTeamSizeList: TeamSize[] = [];
  teamSizeMasterList:TeamSize[] = [];
  viewMode: Boolean = false;
  hideSalesforceWarning: boolean = false;
  isExpertiseTypeRequired: boolean = false;
  // Opportunity form shortcuts for template references
  opportunityDetails: FormGroup = this.opportunitynew.controls.opportunityDetails as FormGroup;
  risk: FormGroup = this.opportunitynew.controls.risk as FormGroup;
  experts: FormGroup = this.opportunitynew.controls.experts as FormGroup;
  pipeline: FormGroup = this.opportunitynew.controls.pipeline as FormGroup;
  requiredRevenueCurrency: boolean = false;
  requiredTotalRevenue: boolean = false;
  selectedCurrencySymbol: string = '-';
  //app Source to identify system the opportunity is created
  externalQueryParams: any = { source: "peg", accountId: "", accountName: "" };
  constructor(private newOpportunityService: NewOpportunityService, private toastr: PegTostrService, private globalService: GlobalService,
    private coreService: CoreService, private infoTextService: InfoTextService, public registrationService: RegistrationService, private route: ActivatedRoute,
    private router: Router, private opportunityFormBuilder: OpportunityFormBuilder, private _appInsight: AppInsightWrapper) {

    this.canEditExperts = true;
    this.canEditPipeline = true;
    this.editExpertCallDate = true;

    if (this.route != undefined && this.route.params != undefined) {

      this.route.params.subscribe(data => {
        this.disableNavBarOptions(data);
        forkJoin([
          this.globalService.getCaseComplexity(),
          this.globalService.getAdditionalServices(),
          this.globalService.getClientCommitment(),
          this.globalService.getPipelineStatus(),
          this.globalService.getIndustrySectors(),
          this.globalService.getTeamSize(),
          this.globalService.getLocationofDeals(),
          this.infoTextService.getInfoTooltipText(),
          this.globalService.getWorkTypeData(),
          this.globalService.getAllIndustrySectorsSubSectors(),
          this.globalService.getOfficeHierarchy(),
          this.globalService.getLanguages(),
          this.globalService.getCurrency(),
          this.globalService.getAllOffice()
        ]).subscribe(([caseComplexity, additionalServices, clientCommitments, likelihoodList, industries, teamSizeList, locationOfDeal, infoText, workTypes, industrySectors, bainOfficeHierarchy, languages, currencyList, allOffices]) => {

          //Set values for drop downs
          this.currencyList = currencyList.filter(e => e.statusCode == true);
          this.currencyList.map(x => { return x.searchableName = x.currencyName + x.serviceCode });
          this.currencyList = this.currencyList.sort((a, b) => { // Sort to show USD and CAD on top
            // Define a priority for 'US' and 'CD'
            const priority = {
              'US': 1, // US Dollar
              'CD': 2, // Canadian Dollar
            };
            const aPriority = priority[a.currencyCode] || 3; // Default to lower priority
            const bPriority = priority[b.currencyCode] || 3;

            return aPriority - bPriority; // Sort based on priority
          });
          this.additionalServices = additionalServices;
          this.caseComplexity = caseComplexity;
          this.clientCommitments = clientCommitments;
          this.likelihoodList = likelihoodList;
          this.industries = industries.filter(e => e.isTopIndustry == true);
          this.teamSizeMasterList = teamSizeList;//This is for master team Size list
          this.backupTeamSizeList = this.generateTeamSizeSelectLists(teamSizeList); //This is used for reference of Non Partner Enabled Option
          this.teamSizeList = this.backupTeamSizeList.filter((x)=>x.isEnabledForPartner);//The actual Team size list specific to partner new opp Form
          this.locationOfDeal = locationOfDeal;
          this.getLocationOfDealByEmployee(locationOfDeal);
          this.infoText = infoText;
          this.workTypes = workTypes;
          this.industrySectors = industrySectors;
          this.languages = languages;
          //Set Controls for casecomplexity & additional services checkboxes
          this.pipeline.setControl('caseComplexity', new FormArray(this.caseComplexity.map(x => new FormControl(false))));
          this.pipeline.setControl('additionalServices', new FormArray(this.additionalServices.map(x => new FormControl(false))));

          if (data != undefined && data.hasOwnProperty('registrationId') && data.registrationId > 0) {
            let decodedDealId = CommonMethods.decodeData(data.registrationId);
            let registrationId = parseInt(decodedDealId);
            if (data.hasOwnProperty('source')) {
              this.source = data.source;
            }
            this.viewMode = true;
            this.getNewOpportunityById(registrationId);
          }

          // Filter out work types
          // Temp change for those office locations where we are not releasing new opp
          if (!CommonMethods.isAuthorizedOffice(this.coreService)) {
            this.filterTypeOfWork();
          }

        });
      });
      this.route.queryParams.subscribe(params => {
        if (params != undefined && params != null && params.hasOwnProperty('source')) {
          this.externalQueryParams = params
          if (this.externalQueryParams?.accountid != undefined) {
            this.getClientsByAccountID(this.externalQueryParams.accountid);

          }

        }
      }
      );
    }
    this.minDate.setHours(0, 0, 0, 0);
    this.clientTypeAhead.pipe(
      tap(() => { this.clientLoad = true; this.clients = []; }),
      debounceTime(200),
      switchMap((term) => this.newOpportunityService.getClientsByName(term == undefined || term == null ? '' : term.toString().trim())),
      tap(() => this.clientLoad = false)
    ).subscribe(items => {
      this.clients = items;
      this.clients.forEach(element => {
        element.customGroup = element.accountType == 'Client Account' ? 'Active' : 'Basic';
      });

      // Sorting function
      this.clients?.sort((a, b) => {
        // First priority: Sort clients where clientGroup equals accountName
        if (a.clientGroup === a.clientName && b.clientGroup !== b.clientName) {
          return -1;  // a comes first if its clientGroup equals accountName
        } else if (a.clientGroup !== a.clientName && b.clientGroup === b.clientName) {
          return 1;   // b comes first if its clientGroup equals accountName
        }

        // If both or neither have clientGroup equal to accountName, sort alphabetically by name
        return a.clientName.localeCompare(b.clientName); // Sorting alphabetically by client name
      });

      let Active = this.clients.filter(group => group.customGroup == 'Active');
      let Basic = this.clients.filter(group => group.customGroup == 'Basic');
      items = [];

      let ActiveSorted = [];
      let BasicSorted = [];
      ActiveSorted = Active;
      BasicSorted = Basic;
      ActiveSorted.push(...BasicSorted);
      this.clients = ActiveSorted;
    });
    this.coreService.isNewRegistration = true;

    this.employeeTypeAhead.pipe(
      tap(() => { this.employeeLoad = true; this.employeeList = []; }),
      debounceTime(200),
      switchMap((term) => {
        if (term) {
          return this.newOpportunityService.getEmployeeNames(term.toString().trim(), EMPLOYEE_STATUS_CODE, LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE)
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

    this.employeeTypeAheadWIthBAN.pipe(
      tap(() => { this.employeeLoad = true; this.employeeList = []; }),
      debounceTime(200),
      switchMap((term) => {
        if (term) {
          return this.newOpportunityService.getEmployeeByName(term.toString().trim()
            , LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, true, true)
        } else {
          return of([]);
        }
      }),
      tap(() => this.employeeLoad = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });
      this.employeeList = items
    });

    document.addEventListener('scroll', () => {
      this.scrollHandler();
    });

    // Is the current user from EMEA? Show EMEA specific fields

    Object.assign(this.currentUserData, this.coreService.loggedInUser);
    this.isAMER = (this.currentUserData.employeeRegion == "Americas");
  }

  addClient = (term) => ({ clientId: 0, clientName: term });

  getClientsByAccountID(accountId: string) {

    this.newOpportunityService.getClientsByAccountID(accountId).subscribe(res => {
      if (res && res.length > 0) {
        this.opportunityDetails.get('client').setValue(res[0]);
        this.onClientChange(res[0]);
      }
    });

  }
  onEstimatedRevenueChange(event) {
    this.validateRevenueCurrencyField();
  }

  validateRevenueCurrencyField() {
    const estimatedRevenue: number = this.pipeline.get('totalRevenue').value
    let revenueCurrency = this.pipeline.get('revenueCurrency').value;

    if ((typeof estimatedRevenue === 'number') || (revenueCurrency && revenueCurrency?.pegCurrencyId > 0)) {
      this.requiredRevenueCurrency = true;
      this.requiredTotalRevenue = true;
      this.pipeline.get('revenueCurrency').setValidators(Validators.required);
      this.pipeline.get('revenueCurrency').updateValueAndValidity();

      this.pipeline.get('totalRevenue').setValidators([Validators.required, OpportunityFormBuilder.decimalValidator]);
      this.pipeline.get('totalRevenue').updateValueAndValidity();
    } else {
      this.requiredRevenueCurrency = false;
      this.requiredTotalRevenue = false;
      this.pipeline.get('revenueCurrency').clearValidators();
      this.pipeline.get('revenueCurrency').updateValueAndValidity();
      this.pipeline.get('totalRevenue').clearValidators();
      this.pipeline.get('totalRevenue').updateValueAndValidity();
    }
  }

  onCurrencyChange(event) {
    if (event) {
      this.selectedCurrencySymbol = event.currencySymbol;
    } else {
      this.selectedCurrencySymbol = '-';
    }
    this.validateRevenueCurrencyField();
  }
  onExpertCallChange(event) {
    this.experts.get("scheduledFields.expertCallDate").setValue(null);

    if (this.experts.get("expertCall").value == '' || this.experts.get("expertCall").value == '0') {
      this.experts.get("scheduledFields.expertCallDate").disable({ emitEvent: false });
    } else {
      this.experts.get("scheduledFields.expertCallDate").enable({ emitEvent: false });
    }
  }
  ngOnInit() {
    this.currentSection = this.formSections[0].slug;
    this.deviceInfo = CommonMethods.deviceInfo();
    this.answers = CommonMethods.getAnswerObject();
    this.showHideSection();
    this._appInsight.logEvent("Opportunity form loaded for " + this.coreService.loggedInUser.employeeCode)

    this.bsConfig = {
      dateInputFormat: this.dateFormatStr,
      containerClass: 'theme-red',
      adaptivePosition: true,
      showWeekNumbers: false
    };


  }

 
  onRemoveTeamSize(event,teamSizeSelectId) {
    let currentTeamSize = this.pipeline.get('teamSize')?.value as any[];
    if(currentTeamSize?.length > 0 ){
      this.pipeline.patchValue({teamSize:currentTeamSize.filter(x=>x != teamSizeSelectId)});
    }
    this.backupTeamSizeList = this.backupTeamSizeList.filter(x=>x.teamSizeSelectId != teamSizeSelectId);
    this.setTeamSizeDisplayList();
    event.preventDefault();
    event.stopPropagation();//To prevent opening of pop up in case clear button is called
  }
   
  onTeamSizeChange(event) {   
    this.updateBackupTeamSizeList(event)
    this.setTeamSizeDisplayList();
  }

  setTeamSizeDisplayList(){
    this.teamSizeList = this.backupTeamSizeList.filter((x)=>x.isEnabledForPartner).sort((a, b) => a.sortOrder - b.sortOrder);
  }


  showHideSection() {
    // Also check for office codes
    if (this.coreService.loggedInUser.securityRoles[0].id == RoleType.PEGAdministrator ||
      this.coreService.loggedInUser.securityRoles[0].id == RoleType.TSGSupport ||
      this.coreService.loggedInUser.securityRoles[0].id == RoleType.PEGOperations ||
      this.coreService.loggedInUser.securityRoles[0].id == RoleType.MultibidderManager ||
      this.coreService.appSettings.isPartnerAllowed && CommonMethods.isAuthorizedOffice(this.coreService)) {
      this.isShowSection = true;
    } else {
      // Disable hidden sections
      this.formSections[2].disable();
      this.formSections[3].disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  scrollHandler() {
    const viewHeight = window.innerHeight;

    // Filter enabled sections
    let enabledSections = this.getEnabledSections();

    enabledSections.forEach((section, index) => {
      const element = document.getElementById(section.slug);
      if (element != null) {
        const rect = element.getBoundingClientRect();

        if (rect.top < viewHeight / 2) {
          this.currentSection = section.slug;
        }

        // For the last element, have a wider scroll area
        if (index == enabledSections.length - 1 && rect.top < viewHeight / 1.6) {
          this.currentSection = section.slug;
        }
      }
    });
  }

  validateDurationKeys(event) {
    CommonMethods.ValidateKeysForDuration(event);
  }

  getEnabledSections() {
    return this.formSections.filter(section => section.enabled);
  }

  clickSectionNavigation(section) {
    if (section.show) {
      const el: HTMLElement = document.getElementById(section.slug);
      window.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
    } else {
      this.toggleSection(section, true, true);
    }
  }

  scrollToElement(id: string) {
    const el: HTMLElement = document.getElementById(id);
    window.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
  }

  clearDate(val) {
    if (val == "expectedStartDate") {
      this.opportunityDetails.get('expectedStartDate').setValue(null);
      this.pipeline.get('expectedStartDate').setValue(null);
    }
    else if (val === 'bidDate') {
      this.opportunityDetails.get('bidDate').setValue(null);
      this.pipeline.get('bidDate').setValue(null);
    } else {
      this.opportunityDetails.get('latestStartDate').setValue(null);
      this.pipeline.get('latestStartDate').setValue(null);
    }
  }
  onDateChange(value: any, dateType) {
    if (value && dateType) {
      if (value >= this.minDate) {
        this.opportunityDetails.get(dateType).setValue(value);
        this.pipeline.get(dateType).setValue(value);
      }
      else {
        this.opportunityDetails.get(dateType).setValue(this.minDate);
        this.pipeline.get(dateType).setValue(this.minDate);
      }
    }

  }

  onClientChange(event) {
    if (event != undefined && event != null) {
      if (event.clientName.toString().trim() == '') {
        this.opportunityDetails.controls['client'].setErrors({ 'incorrect': true });
      } else {
        this.isClearOnClient = true;
        if (event.basisClientId && event.basisClientId != 0) {
          if (this.opportunityDetails.value.workType?.workTypeId != WorkTypeEnum.SectorScan &&
            this.opportunityDetails.value.workType?.workTypeId != WorkTypeEnum.PostAcq &&
            this.opportunityDetails.value.workType?.workTypeId != WorkTypeEnum.FundStrategy) {

            this.getClientHeadByClientId(event.basisClientId);
          }
        }
      }
    } else {
      this.opportunityDetails.get('clientHead').setValue([]);
      this.opportunityDetails.get('isClientHedgeFund').setValue(false);
    }

    if (event) {
      this.getHedgeFundByClientId(event?.clientId, event.basisClientId);
    }
  }

  onDurationChange(event) {
    let value = event?.target?.value;
    if (event && !CommonMethods.validateDurationInfo(value)) {
      this.toastr.showWarning('Please Enter Correct Format for Duration', 'Warning');
      this.pipeline.get('duration').setValue('');
    }
  }

  toggleTargetCompanyValidation(checked: any) {
    if (checked) {
      this.opportunityDetails.get('corporateRelationship').setValue('');
      this.opportunityDetails.controls['corporateRelationship'].disable();
    }
    else {
      this.opportunityDetails.controls['corporateRelationship'].enable();
    }
  }

  isOpenMarketDisabled() {

    if ((this.opportunityDetails.value.isPubliclyTradedEquity || this.opportunityDetails.value.isPubliclyTradedDebt) && (this.opportunityDetails.value.workType) && (this.opportunityDetails.value.workType.workTypeId == WorkTypeEnum.BuySideEquityNonControl || this.opportunityDetails.value.workType.workTypeId == WorkTypeEnum.BuySideDebt)) {
      this.opportunityDetails.get('isOpenMarketPurchase').enable();
    } else {
      this.opportunityDetails.get('isOpenMarketPurchase').disable();
      this.opportunityDetails.get('isOpenMarketPurchase').setValue(null);
    }

    if (this.opportunityDetails.value.isPubliclyTradedEquity == false && this.opportunityDetails.value.isPubliclyTradedDebt == false) {
      this.opportunityDetails.get('isOpenMarketPurchase').setValue(null);

    }
  }

  isOMPVisible() {
    let isVisible = false;
    if ((this.opportunityDetails.value.isPubliclyTradedEquity || this.opportunityDetails.value.isPubliclyTradedDebt) && (this.opportunityDetails.value.workType) && (this.opportunityDetails.value.workType.workTypeId == WorkTypeEnum.BuySideEquityNonControl || this.opportunityDetails.value.workType.workTypeId == WorkTypeEnum.BuySideDebt)) {
      isVisible = true;
    } else {
      isVisible = false;

    }

    if (this.opportunityDetails.value.isPubliclyTradedEquity == false && this.opportunityDetails.value.isPubliclyTradedDebt == false) {
      isVisible = false;

    }

    return isVisible;
  }

  getClientHeadByClientId(clientId) {
    if (clientId) {
      this.registrationService.getClientHeadsByClientId(clientId).subscribe(res => {
        if (res && res.partners && res.partners.length > 0) {
          res.partners.forEach(element => {
            element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
          });
          this.opportunityDetails.get('clientHead').setValue(res.partners);
        }
      })
    }
  }

  getHedgeFundByClientId(clientId, basisClientId) {
    if (clientId && clientId > 0) {
      this.registrationService.getHedgeFundByClientId(clientId, basisClientId).subscribe(data => {
        this.opportunityDetails.get('isClientHedgeFund').setValue(data);
      });
    }
    else {
      this.opportunityDetails.get('isClientHedgeFund').setValue(false);
    }
  }

  // /* Location of Deal dropdown functionality */

  getLocationOfDealByEmployee(items) {
    //Get location of deal based on employee code

    this.newOpportunityService.getLocationOfDealByEmployeeCode(this.coreService.loggedInUser.employeeCode).subscribe(data => {
      let locationData: any = data;
      this.locationOfDeal.forEach(element => {
        element.customGroup = data.includes(element.locationDealId.toString()) ? 'Recently used' : 'Location';
      });
      let recentlyUsed = items.filter(group => group.customGroup == 'Recently used');
      let otherLocation = items.filter(group => group.customGroup == 'Location');
      items = [];
      let recentlyUsedSorted = [];
      locationData.forEach(element => {
        let recentData = recentlyUsed.find(a => a.locationDealId == element);
        if (recentData) {
          recentlyUsedSorted.push(recentData);
        }
      });
      items = recentlyUsedSorted.concat(otherLocation);
      this.locationOfDeal = items;
    })
  }

  // /* Work type dropdown functionality */

  workTypeChange(event: any) {
    if (event && (event.workTypeId != WorkTypeEnum.BuySideEquityNonControl && event.workTypeId != WorkTypeEnum.BuySideDebt)) {
      this.opportunityDetails.get('isPubliclyTradedDebt').setValue(false);
      this.opportunityDetails.get('isOpenMarketPurchase').setValue(null);
      this.opportunityDetails.get('isPubliclyTradedDebt').disable();
    }
    else {
      this.opportunityDetails.get('isPubliclyTradedDebt').enable();
    }

    if (event && (event.workTypeId != WorkTypeEnum.FundStrategy && event.workTypeId != WorkTypeEnum.PostAcq && event.workTypeId != WorkTypeEnum.SectorScan)) {
      this.isPlaceholderOpportunity = false;
      this.opportunityDetails.get('registrationStageId').setValue('1');
      this.opportunityDetails.get('target').setValidators([Validators.required, Validators.maxLength(1200)]);
      this.opportunityDetails.get('corporateRelationship').setValidators([Validators.required, Validators.maxLength(1200)]);
      this.opportunityDetails.get('clientHead').setValidators([Validators.required]);
      this.opportunityDetails.get('website').setValidators([Validators.required]);

      this.opportunityDetails.get('target').updateValueAndValidity();
      this.opportunityDetails.get('corporateRelationship').updateValueAndValidity();
      this.opportunityDetails.get('clientHead').updateValueAndValidity();
      this.opportunityDetails.get('website').updateValueAndValidity();

      if (this.isShowSection && !this.formSections[2].enabled) {
        this.formSections[2].enable();
        this.formSections[2].toggle(false);
      }

      this.pipeline.get('additionalServices').enable();
      this.pipeline.setControl('additionalServices', new FormArray(this.additionalServices.map(x => new FormControl(false))));


    } else {
      this.isPlaceholderOpportunity = true;
      this.opportunityDetails.get('target').clearValidators();
      this.opportunityDetails.get('corporateRelationship').clearValidators();
      this.opportunityDetails.get('clientHead').clearValidators();
      this.opportunityDetails.get('website').clearValidators();

      // SET Values to blank
      this.opportunityDetails.get('target').setValue('')
      this.opportunityDetails.get('corporateRelationship').setValue(null);
      this.opportunityDetails.get('clientHead').setValue(null);

      this.opportunityDetails.get('isSPAC').setValue(null);
      this.opportunityDetails.get('isPubliclyTradedEquity').setValue(null);
      this.opportunityDetails.get('isPubliclyTradedDebt').setValue(null);
      this.opportunityDetails.get('isCarveOut').setValue(null);
      this.opportunityDetails.get('isOpenMarketPurchase').setValue(null);
      this.opportunityDetails.get('registrationStageId').setValue('2');
      this.opportunityDetails.get('clientHead').setValue(null);
      this.opportunityDetails.get('clientSectorLead').setValue(null);
      this.opportunityDetails.get('othersInvolved').setValue(null);
      this.opportunityDetails.get('generalNote').setValue(null);


      // Set Expert to blanks
      this.opportunityDetails.get('isExpertInfoRequested').setValue(false);
      this.experts.reset();
      this.experts.disable();
      this.formSections[2].disable();
      // set pipeline to blank
      this.pipeline.setControl("additionalServices", new FormArray([]));
      this.pipeline.get('additionalServices').disable();
      this.pipeline.get('isMultibidderPartner').setValue(null);

      this.opportunityDetails.get('target').updateValueAndValidity();
      this.opportunityDetails.get('corporateRelationship').updateValueAndValidity();
      this.opportunityDetails.get('clientHead').updateValueAndValidity();
      this.experts.updateValueAndValidity();

    }

    // Show or hide the website field for Sector Scan
    if (event && (event.workTypeId == WorkTypeEnum.SectorScan)) {
      this.opportunityDetails.get('website').setValue(null);
      this.opportunityDetails.get('website').disable();
      this.opportunityDetails.get('website').clearValidators();
      this.showWebsite = false;
    } else {
      this.opportunityDetails.get('website').setValidators([Validators.required]);
      this.opportunityDetails.get('website').enable();
      this.opportunityDetails.get('website').updateValueAndValidity();
      this.showWebsite = true;
    }

    if (event && (event.workTypeId == WorkTypeEnum.Rediligence)) {
      // Open all sections
      if (this.isShowSection) {
        let expertSection = this.formSections.find(section => section.slug == 'experts');
        let pipelineSection = this.formSections.find(section => section.slug == 'pipeline');
        this.toggleSection(expertSection, true, false);
        this.toggleSection(pipelineSection, true, false);
      }
    }

    this.isOpenMarketDisabled();

    if (event) {
      this.selectedWorkType = event;
      this.workTypEditMode = !this.workTypEditMode;
    }
  }

  onPTEChange(event) {
    this.opportunityDetails.get('isPubliclyTradedEquity').setValue(event);
    this.isOpenMarketDisabled();
  }

  onPTDChange(event) {
    this.isOpenMarketDisabled();
  }

  onIndustryChange(event) {
    this.opportunityDetails.get('sector').setValue(null)
    this.sectorsList = [];
    if (event !== undefined) {
      if (event.industryName.toString().trim() == '') {
        this.opportunityDetails.get('industrySelect').setErrors({ 'incorrect': true });
      } else {
        this.isClearOnIndustry = true;
      }
      this.sectorsList = this.industrySectors.sectors.filter(e => e.industryId == event.industryId);
    } else {
      this.opportunityDetails.get('sector').setValue(null)

    }
  }
  SendDataToCortex(transaction: any) {
    // Replace with the data you want to send to the parent frame
    const messageData = {
      pegOpportunityId: transaction.registrationId,
      transactionId: transaction.transactionNumber,
      action: transaction.actionType,
      status: 200,
      message: "Success"
    };

    // Replace '*' with the specific origin (protocol, domain, and port) of the target frame for better security
    const targetOrigin = this.coreService.appSettings.cortexTargetOrigin;

    // Post the message to the parent frame
    window.parent.postMessage(messageData, targetOrigin);

  }
  // /* Form submissions */
  onSubmit() {
    if (this.opportunitynew.status == "VALID") {

      this.isSubmitDisabled = true;
      this.opportunityDetails.get('submittedBy').setValue(CommonMethods.getLoggedInEmployee(this.coreService.loggedInUser));
      this.opportunityDetails.get('bainOfficeCode').setValue(this.coreService.loggedInUser.employeeOffice);
      this.opportunityDetails.get('isMobileSubmission').setValue(this.deviceInfo.isMobile);
      this.opportunityDetails.get('isImpersonated').setValue(this.coreService.isImpersonated);

      //mapping case comp
      this.pipeline.setControl("caseComplexity", new FormArray(this.pipeline.get("caseComplexity").value.map((csComp, index) => csComp == true ? new FormControl(this.caseComplexity[index]) : null).filter(value => value != null)));
      //Set Additional Service Object 
      this.pipeline.setControl("additionalServices", new FormArray(this.pipeline.get("additionalServices").value.map((addService, index) => addService == true ? new FormControl(this.additionalServices[index]) : null).filter(value => value != null)));

      //map dates and remove timezone
      let expertCallDateRes = this.experts.get('scheduledFields').value;
      if (expertCallDateRes && expertCallDateRes.expertCallDate != undefined && expertCallDateRes.expertCallDate != null && expertCallDateRes.expertCallDate.toString().trim() != "") {
        expertCallDateRes.expertCallDate = moment(expertCallDateRes.expertCallDate).format('YYYY-MM-DD');
        this.experts.get('scheduledFields').patchValue(expertCallDateRes);
      } else {
        expertCallDateRes.expertCallDate = null;
        this.experts.get('scheduledFields').patchValue(expertCallDateRes);
      }
      let teamSizeValues = this.pipeline.get('teamSize').value;
      let teamSizeObjList = [];
      if (teamSizeValues) {


        teamSizeValues.forEach((element )=> {
          let item = this.backupTeamSizeList.find(x => x.teamSizeSelectId == element);
          const { teamSizeSelectId, ...newObj } = item; // Excludes team size select id
          teamSizeObjList.push(newObj);

        });
        this.pipeline.get('teamSize').setValue(teamSizeObjList);
      }
      this.newOpportunityService.Insert(this.opportunitynew.getRawValue(), this.externalQueryParams.source, this.backupNewOpportunity).subscribe((res) => {
        this.backupNewOpportunity = undefined;
        this.toastr.showSuccess("New Opportunity Submitted Successfully.", "Confirmation");
        this.opportunitynew.reset();
        this.goBack();
        if (this.externalQueryParams && this.externalQueryParams.source == 'cortex' && res['transaction']) {
          this.SendDataToCortex(res['transaction']);

        }
        this._appInsight.logEvent("Opportunity form loaded for " + this.coreService.loggedInUser.employeeCode)
        this._appInsight.logEvent(`${CategoryType.NewOpportunity} - submit Opportunity with id: ${res['opportunityDetails'].registrationId}`);
      })

    } else {
      if (this.canEditPipeline && this.pipeline?.controls?.officeToBeStaffed?.value && this.pipeline?.controls?.officeToBeStaffed?.value.length > 0) {
        this.officesToBeStaffed = this.pipeline?.controls?.officeToBeStaffed?.value as Office[]
      }
      const el: HTMLElement = document.body.querySelector("#newOppFormContainer .ng-invalid, button.invalid, #newOppFormContainer .invalidDropdown");
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  goBack() {
    if (this.coreService.loggedInUserRoleId == RoleType.General || this.coreService.loggedInUserRoleId == RoleType.Staffing) {
      this.router.navigate(['/partner-dashboard']);
    } else {
      this.router.navigate(['/registrations']);
    }
  }
  // Show or hide the expert section and add relevant fields to the form controls

  toggleSection(section, value, jump = true) {
    section.toggle(value);

    if (section.slug == 'pipeline') {
      if (value) {
        this.opportunityDetails.get('isPipelineInfoRequested').setValue(true);

        //Setting expected start date validation to true when pipeline is set to yes
        this.pipeline.get('expectedStartDate').setValidators([Validators.required]);
        this.opportunityDetails.get('expectedStartDate').updateValueAndValidity();

        if (this.canEditPipeline) {
          this.pipeline.enable();
        }
      } else {
        //Setting expected start date validation to false when pipeline is set to no
        this.pipeline.get('expectedStartDate').setValidators([]);
        this.opportunityDetails.get('expectedStartDate').updateValueAndValidity();

        this.opportunityDetails.get('isPipelineInfoRequested').setValue(false);
        this.pipeline.disable();
      }

      if (this.canEditPipeline && this.pipeline?.controls?.officeToBeStaffed?.value && this.pipeline?.controls?.officeToBeStaffed?.value.length > 0) {
        this.officesToBeStaffed = this.pipeline?.controls?.officeToBeStaffed?.value as Office[]
      }
      else {
        if (!this.viewMode) {
          this.officesToBeStaffed = [];
        }
      }
    } else if (section.slug == 'experts') {

      if (value) {
        if (this.canEditExperts) {
          this.experts.enable();
          this.onExpertCallChange(null);
        }

        this.opportunityDetails.get('isExpertInfoRequested').setValue(true);

      } else {
        this.opportunityDetails.get('isExpertInfoRequested').setValue(false);
        this.experts.get('scheduledFields.expertCallDate').disable({ emitEvent: false });
        this.experts.disable();
      }
    }

    // When shown, scroll to that section. Scrolling doesn't work right away so put it on a slight delay.
    if (value && jump) {
      let self = this;
      setTimeout(function () {
        self.scrollToElement(section.slug);
      }, 50);
    }

    // Update form controls

    if (section == "pipeline") {
      if (this.isAMER) {
        this.pipeline.get("isMultibidder").enable();
        this.pipeline.get("officeToBeStaffed").disable();

        this.pipeline.get("requiredLanguage").disable();
      } else {
        this.pipeline.get("isMultibidder").disable();
        this.pipeline.get("officeToBeStaffed").enable();

        this.pipeline.get("requiredLanguage").enable();
      }
    }

    // Check if any section is enabled, enable the submit button
    if (this.opportunityDetails.enabled || this.risk.enabled || this.experts.enabled || this.pipeline.enabled) {
      this.isSubmitDisabled = false;
    } else {
      this.isSubmitDisabled = true;
    }
  }

  updateOfficeSelection(offices: Office[]) {
    this.pipeline.get('officeToBeStaffed').patchValue(offices);
  }
  isPipelineFormValid() {
    let teamSize, duration, clientCommitment, likelihood = null;
    teamSize = this.pipeline.get('teamSize');
    likelihood = this.pipeline.get('likelihood');
    clientCommitment = this.pipeline.get('clientCommitment');
    duration = this.pipeline.get('duration');
    if (teamSize != null && likelihood != null && clientCommitment != null && duration != null) {
      return true;
    }
    else {
      return false;
    }
  }
  //method to get the new opportunity submitted data when editing
  getNewOpportunityById(registrationId: number) {
    // set all form group disabled by defualt
    this.opportunityDetails.disable({ emitEvent: false });
    this.risk.disable({ emitEvent: false });

    this.backupNewOpportunity = undefined;
    this.newOpportunityService.getNewOpportunityById(registrationId).subscribe((res: any) => {
      console.log(res);

      res.pipeline.isRetainer = res.pipeline.isRetainer ? res.pipeline.isRetainer.toString() : null,
        this.backupNewOpportunity = JSON.parse(JSON.stringify(res));

      if (res != undefined) {
        if (res.opportunityDetails != undefined) {
          // Form validations acc. to work type
          this.workTypeChange(res.opportunityDetails.workType);
          this.opportunityDetails.disable({ emitEvent: false });  // disabling it again so as to disable work type cascade fields.
          this.opportunityDetails.patchValue({
            client: res.opportunityDetails.client,
            isClientHedgeFund: res.opportunityDetails.isClientHedgeFund,
            target: res.opportunityDetails.target,
            corporateRelationship: res.opportunityDetails.corporateRelationship,
            targetOwnerUnknown: res?.opportunityDetails?.corporateRelationship ? false : true,
            website: res.opportunityDetails.website,
            industry: res.opportunityDetails.industry,
            sector: res.opportunityDetails.sector,
            targetDescription: res.opportunityDetails.targetDescription,
            workType: res.opportunityDetails.workType,
            isOpenMarketPurchase: res.opportunityDetails.isOpenMarketPurchase,
            isSPAC: res.opportunityDetails.isSPAC,
            isPubliclyTradedEquity: res.opportunityDetails.isPubliclyTradedEquity,
            isPubliclyTradedDebt: res.opportunityDetails.isPubliclyTradedDebt,
            isCarveOut: res.opportunityDetails.isCarveOut,
            locationOfDeal: res.opportunityDetails.locationOfDeal,
            registrationStageId: res.opportunityDetails.registrationStageId.toString(),
            workToStart: res.opportunityDetails.workToStart,

            expectedStartDate: res.opportunityDetails.expectedStartDate != null && res.opportunityDetails.expectedStartDate != undefined && res.opportunityDetails.expectedStartDate.trim() != "" ? moment(res.opportunityDetails.expectedStartDate).format("DD-MMM-YYYY") : undefined,
            latestStartDate: res.opportunityDetails.latestStartDate != null && res.opportunityDetails.latestStartDate != undefined && res.opportunityDetails.latestStartDate.trim() != "" ? moment(res.opportunityDetails.latestStartDate).format("DD-MMM-YYYY") : undefined,
            bidDate: res.opportunityDetails.bidDate != null && res.opportunityDetails.bidDate != undefined && res.opportunityDetails.bidDate.trim() != "" ? moment(res.opportunityDetails.bidDate).format("DD-MMM-YYYY") : undefined,

            clientHead: CommonMethods.assignSearchableName(res.opportunityDetails.clientHead),
            othersInvolved: CommonMethods.assignSearchableName(res.opportunityDetails.othersInvolved),
            clientSectorLead: CommonMethods.assignSearchableName(res.opportunityDetails.clientSectorLead),
            generalNote: res.opportunityDetails.generalNote,
            isRiskEngagementNeeded: res.opportunityDetails.isRiskEngagementNeeded,
            isMobileSubmission: res.opportunityDetails.isMobileSubmission,
            bainOfficeCode: res.opportunityDetails.bainOfficeCode,
            submittedBy: res.opportunityDetails.submittedBy,
            isImpersonated: res.opportunityDetails.isImpersonated,
            isExpertInfoRequested: res.opportunityDetails.isExpertInfoRequested,
            isPipelineInfoRequested: res.opportunityDetails.isPipelineInfoRequested,
            registrationId: res.opportunityDetails.registrationId,
          })

          this.selectedWorkType = this.workTypes.filter(x => res.opportunityDetails.workType.workTypeId == x.workTypeId)[0];
        }

        //setting risk object
        if (res.risk != undefined) {
          this.risk.patchValue({
            isREN: res.risk.isREN.toString()
          })
          this.risk.patchValue({
            isProductREN: res.risk.isProductREN.toString()
          })
        }


        //setting expert object
        if (res.opportunityDetails.isExpertInfoRequested && res.experts) {
          let expertSection = this.formSections.find(section => section.slug == 'experts');

          this.toggleSection(expertSection, true, false);
          this.canEditExperts = false;
          this.editExpertCallDate = false;
          if (CommonMethods.isAuthorizedToAccessPipelineAndExpert(this.coreService)) {
            this.experts.enable({ emitEvent: false });
            this.opportunityDetails.get('isExpertEdit').setValue(true);
            this.editExpertCallDate = true;
            this.onExpertCallChange(null);

          } else {
            this.experts.disable({ emitEvent: false });
            this.opportunityDetails.get('isExpertEdit').setValue(false);
            this.editExpertCallDate = false;
          }

          this.experts.patchValue({
            opportunityExpertId: res.experts.opportunityExpertId,
            expertCall: res.experts.expertCall.toString(),
            identifyExperts: res.experts.identifyExperts.toString(),
            preferredExpertsForCase: CommonMethods.assignSearchableName(res.experts.preferredExpertsForCase),
            expertTeamNotes: res.experts.expertTeamNotes,
            typesOfExpertise: res.experts.typesOfExpertise,
            scheduledFields: {
              expertCallDate: res.experts.scheduledFields.expertCallDate != null && res.experts.scheduledFields.expertCallDate != undefined && res.experts.scheduledFields.expertCallDate.trim() != "" ? moment(res.experts.scheduledFields.expertCallDate).format("DD-MMM-YYYY") : undefined,

              expertsOnCall: CommonMethods.assignSearchableName(res.experts.scheduledFields.expertsOnCall)
            }
            ,
          })

          if (CommonMethods.isAuthorizedToAccessPipelineAndExpert(this.coreService)) {
            if (this.experts.get("expertCall").value == '' || this.experts.get("expertCall").value == '0') {
              this.experts.get("scheduledFields.expertCallDate").disable({ emitEvent: false });
            } else {
              this.experts.get("scheduledFields.expertCallDate").enable({ emitEvent: false });
            }
          }
        } else {
          this.experts.disable({ emitEvent: false });
        }

        if (res.pipeline) {
          let pipeline = this.formSections.find(section => section.slug == 'pipeline');
          //setup pipeline teams dropdown starts

          function compare(fields, a, b) {
            for (let field of fields) {
              if (a[field] < b[field]) return -1;
              if (a[field] > b[field]) return 1;
            }
            return 0;
          }

          const orderBy = (data, ...fields) =>
            [...data].sort(compare.bind(null, fields));

          const partitionBy = (data, ...fields) =>
            // Will not order the data before partitioning
            data.reduce((acc, row) => {
              if (acc.length && !compare(fields, acc[acc.length - 1][0], row)) {
                acc[acc.length - 1].push(row);
              } else {
                acc.push([row]);
              }
              return acc;
            }, []);

          const rowNumber = (data, alias = "rownumber") =>
            Array.isArray(data[0]) // partitioned ? recur for each!
              ? data.map(row => rowNumber(row, alias))
              : data.map((row, i) => ({ ...row, [alias]: i + 1 })); // base case

          let result = rowNumber(partitionBy(orderBy(res.pipeline.teamSize, "teamSizeId"), // fields to order by
            "teamSizeId"// fields to partition by
          ),
            "count" // The alias for the additional row-number column
          ).flat(); // Finally flatten away the partitions



          //setup pipeline teams dropdown end


          if (res.opportunityDetails.isPipelineInfoRequested) {
            this.toggleSection(pipeline, true, false);
            this.canEditPipeline = false;
            if (CommonMethods.isAuthorizedToAccessPipelineAndExpert(this.coreService)) {
              this.pipeline.enable({ emitEvent: false });
              this.opportunityDetails.get('isPipelineEdit').setValue(true);

            }
            else {
              this.pipeline.disable({ emitEvent: false });
              this.opportunityDetails.get('isPipelineEdit').setValue(false);
            }

          } else {
            this.pipeline.disable({ emitEvent: false });
          }
          if (res.pipeline.revenueCurrency && res.pipeline.revenueCurrency.pegCurrencyId > 0) {
            res.pipeline.revenueCurrency.searchableName = res.pipeline.revenueCurrency.currencyName + res.pipeline.revenueCurrency.serviceCode;
          }
          this.pipeline.patchValue({
            pipelineId: res.pipeline.pipelineId,
            expectedProjectName: res.pipeline.expectedProjectName,
            isRetainer: res.pipeline.isRetainer ? res.pipeline.isRetainer.toString() : null,
            isMultibidderPartner: res.pipeline.isMultibidderPartner ? res.pipeline.isMultibidderPartner.toString() : null,
            likelihood: res.pipeline.likelihood,
            clientCommitment: res.pipeline.clientCommitment,
            duration: res.pipeline.duration,
            teamSize: this.getTeamSizeSelectValues(res.pipeline.teamSize),
            processInfo: res.pipeline.processInfo,
            requiredLanguage: res.pipeline.requiredLanguage,
            caseComplexity: this.caseComplexity.map(csComp => res.pipeline.caseComplexity?.some(r => r.caseComplexityId == csComp.caseComplexityId)),
            additionalServices: this.additionalServices.map(addSrvc => res.pipeline.additionalServices?.some(r => r.additionalServicesId == addSrvc.additionalServicesId)),
            SVP: CommonMethods.assignSearchableName(res.pipeline.svp),
            OVP: CommonMethods.assignSearchableName(res.pipeline.ovp),
            requestedSM: CommonMethods.assignSearchableName(res.pipeline.requestedSM),
            sellingPartners: CommonMethods.assignSearchableName(res.pipeline.sellingPartners),
            isLikelyOVP: res.pipeline.isLikelyOVP,
            isLikelySVP: res.pipeline.isLikelySVP,
            teamComments: res.pipeline.teamComments,
            icApproved: res.pipeline.icApproved,
            officeToBeStaffed: res.pipeline?.officeToBeStaffed,
            totalRevenue: res.pipeline.totalRevenue,
            revenueCurrency: res.pipeline.revenueCurrency,
            staffingSolvedLocally: res.pipeline.staffingSolvedLocally,

          })
          if (res.pipeline.revenueCurrency && res.pipeline.revenueCurrency.pegCurrencyId > 0) {
            this.selectedCurrencySymbol = res.pipeline.revenueCurrency?.currencySymbol;
          }
          this.validateRevenueCurrencyField();

          if (res?.pipeline?.officeToBeStaffed && res?.pipeline?.officeToBeStaffed.length > 0) {
            this.officesToBeStaffed = res.pipeline?.officeToBeStaffed;
          }
          this.isNewOpFormDataLoading = false;
        }       

      }

      // Disable the submit button until the user opens up an editable section
      if (CommonMethods.isAuthorizedToAccessPipelineAndExpert(this.coreService)) {
        this.isSubmitDisabled = false;
      } else {
        this.isSubmitDisabled = true;
      }

      // Disable pipeline and expert sections until a user opens them, only if these sections aren't already open
      if (!this.formSections[2].enabled) {
        this.experts.disable({ emitEvent: false });
      }

      if (!this.formSections[3].enabled) {
        this.pipeline.disable({ emitEvent: false });
      }

      if (this.source != undefined) {
        this.focusToSection();
      }

    });

  }
 
  generateTeamSizeSelectLists(teamSize,index = 0){
    let selectList = []
   
      teamSize.forEach((element) => {
        selectList.push(
          {
            ...element,
            teamSizeSelectId :index
          }
        )
        index++;
      });

    return selectList;
  }
  getTeamSizeSelectValues(selectedTeamSize){
    let teamSizeSelectValues = [];
    selectedTeamSize.forEach((element)=>{

      let latestTeamSize = this.backupTeamSizeList.sort((a, b) => a.teamSizeSelectId - b.teamSizeSelectId).reverse().find((x)=>x.teamSizeId == element.teamSizeId);
      teamSizeSelectValues.push({
        teamSizeId:element.teamSizeId,
        teamSizeSelectId:latestTeamSize.teamSizeSelectId
      })    
      this.updateBackupTeamSizeList(latestTeamSize)
      
    })
    this.setTeamSizeDisplayList()
    return teamSizeSelectValues.map((x)=>x.teamSizeSelectId);
  }
  updateBackupTeamSizeList(element){
    let mxaxSelectId = this.backupTeamSizeList.reduce((prev, current) => (prev.teamSizeSelectId > current.teamSizeSelectId ? prev : current)).teamSizeSelectId;
    let isEnabledForPartner = this.teamSizeMasterList.find((x)=>x.teamSizeId == element.teamSizeId).isEnabledForPartner;
    let currentItem = JSON.parse(JSON.stringify(element));
    currentItem.teamSizeSelectId = mxaxSelectId + 1
    currentItem.isEnabledForPartner = isEnabledForPartner
    this.backupTeamSizeList = [...this.backupTeamSizeList,currentItem] 

  }

  focusToSection() {
    let piplelineSection = this.formSections.find(section => section.slug == 'pipeline');
    let expertsSection = this.formSections.find(section => section.slug == 'experts');

    if (this.source == 'expert' && expertsSection && this.isShowSection) {
      this.toggleSection(expertsSection, true, true);
    }

    if (this.source == 'resource' && piplelineSection && this.isShowSection) {
      this.toggleSection(piplelineSection, true, true);
    }
  }

  filterTypeOfWork() {
    this.workTypes = this.workTypes.filter(wt => wt.workTypeId < 8);
  }
  onSelectEmployeeChange(event, field) {
    if (event) {
      this.employeeList = [];
    }
  }

  // set validation for expertise type field
  onIdentifyExpertsChange(value: boolean) {

    // if 'Do you need help identifying experts?'..
    if (value === true) {
      // ..is true, add 'required' validation to 'typesOfExpertise'
      this.isExpertiseTypeRequired = true;
      this.experts.controls['typesOfExpertise'].addValidators(Validators.required);
    } else {
      // ..is false, remove 'required' validation
      this.isExpertiseTypeRequired = false;
      this.experts.controls['typesOfExpertise'].removeValidators(Validators.required);
    }

    // update 'typesOfExpertise' control to reflect change
    this.experts.controls['typesOfExpertise'].updateValueAndValidity();
  }

  private disableNavBarOptions(data:any){
    if (data != undefined && data.hasOwnProperty('registrationId') && data.registrationId > 0) {
      this.isNewOpFormDataLoading = true;
    }
  }

}


