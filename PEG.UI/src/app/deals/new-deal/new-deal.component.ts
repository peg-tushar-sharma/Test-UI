import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep, omit, orderBy, uniqBy } from 'lodash';
import { isEqual, isObject, transform } from "lodash/fp";
import * as moment from 'moment';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Observable, Subject, Subscription, forkJoin, from, timer } from 'rxjs';
import { debounceTime, map, repeatWhen, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CoreService } from '../../../app/core/core.service';
import { PegTostrService } from '../../../app/core/peg-tostr.service';
import { GlobalService } from '../../global/global.service';
import { NewRegistrationService } from '../../registrations/new-registration/new-registration.service';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { ComponentCanDeactivate } from "../../security/pending-changes.guard";
import { AppSession } from '../../shared/class/appSession';
import { CommonMethods } from '../../shared/common/common-methods';
import { EMPLOYEE_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../../shared/common/constants';
import { DealAuth } from '../../shared/common/dealAuth';
import { fieldAuth } from '../../shared/common/fieldAuth';
import { dealMBStatus } from '../../shared/enums/deal-mbStatus.enum';
import { CategoryType } from '../../shared/enums/ga-category.enum';
import { PagesTypes } from '../../shared/enums/page-type.enum';
import { RedbookAvailableStatus } from '../../shared/enums/rebookAvailable-status.enum';
import { RegistrationStageEnum } from '../../shared/enums/registration-stage.enum';
import { RegistrationStatus } from '../../shared/enums/registration-status.enum';
import { TrackerStatus } from '../../shared/enums/trackerStatus.enum';
import { LocationOfDeal } from '../../shared/interfaces/LocationOfDeal';
import { DealSecurity } from '../../shared/interfaces/dealSecurity';
import { MBStatus, dealStatus } from '../../shared/interfaces/dealStatus';
import { Employee } from '../../shared/interfaces/models';
import { TimeoutService } from '../../shared/timeout-session/timeout.service';
import { TimeoutDialogService } from '../../shared/timeout-session/timeoutdialog.service';
import { deals, visibleToHighlights } from '../deal';
import { DealSecurityService } from '../deal.security.service';
import { RoleType } from './../../shared/enums/role-type.enum';
import { DealsService } from './../deals.service';
import { dateTrack } from './deal-context/deal-process/dateTracker';
import { industrSectorSubSector } from '../../shared/interfaces/industrSectorSubsector';
import { AppInsightWrapper } from '../../applicationInsight/appInsightWrapper';

@Component({
  selector: 'app-new-deal',
  templateUrl: './new-deal.component.html',
  styleUrls: ['./new-deal.component.scss']
})

export class NewDealComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  defaultTabState: any = { context: false, experts: false, clients: false, allocation: false, security: false }

  toggleTabs: any = { context: false, experts: false, clients: true, allocation: false, security: false, strategy: false }

  public fieldAuth: fieldAuth = new fieldAuth();

  public _hasTrackerAutoSaved = false;
  public _counter: number = 0;
  public _status: string = "Initialized.";
  private _timer: Observable<number>;
  private _timerSubscription: Subscription;
  private _idleTimerSubscription: Subscription;

  activeTab: any;
  currentTab: string;
  activeUsers: Employee[] = [];
  activeUserName: string = '';
  trackerStatus: boolean = false;
  dealFromRegistration: any;
  redbookAvailable: number = 0;
  redbookAvailableText: string = "";
  redbookContainerName: string = 'redbookAvailableHeader';
  isAdmin: boolean = false;
  canDeactivate(): Observable<boolean> | boolean {
    if (this.isTrackerModified() && !this.trackerStatus && !this.dealSecurityService.isReadOnlyMode) {
      return false;
    }
    else {
      return true;
    }
  }

  isTrackerModified() {
    return CommonMethods.compareObject(this.skipNotRequiredProperties(cloneDeep(this.deal)), this.skipNotRequiredProperties(this.dealService.dealBackup));
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('keydown', ['$event'])
  restetTimerOnEvents() {
    if (this.dealId && this.dealId > 0 && !this.dealSecurityService.isReadOnlyMode) {


      this.idleTimeoutSvc.resetTimer();
    }
  };
  skipNotRequiredProperties(object: deals) {
    object = omit(object, 'clientAllocations');

    //From Clients
    if (object.clients) {
      object.clients = object.clients.filter(x => x.client.clientName != undefined && x.client.clientName.trim() != '' && x.client.clientName != null);
      object.clients.forEach((client, index) => {
        if (client.committed) {
          client.committed.forEach((obj, index) => {
            client.committed[index] = omit(obj, 'oldEmployee', 'isMultipleClient', 'expertState', 'expertPoolColor', 'expertData', 'expertId', 'expertGroupId',
              'lastUpdatedBy', 'industry', 'client', 'isMultipleEmployee', 'employee', 'industries', 'clients', 'expertCategory', 'expertise', 'filterState',
              'categoryId', 'categoryName', 'bainOffice', 'note', 'levelName', 'gradeName', 'title', 'expertIndustries', 'expertClients',
              'isExternalEmployee', 'abbreviation', 'sortOrder', 'statusCode');
          })
        }
        if (client.heardFrom) {
          client.heardFrom.forEach((obj, index) => {
            client.heardFrom[index] = omit(obj, 'oldEmployee', 'isMultipleClient', 'expertState', 'expertPoolColor', 'expertData', 'expertId', 'expertGroupId',
              'lastUpdatedBy', 'industry', 'client', 'isMultipleEmployee', 'employee', 'industries', 'clients', 'expertCategory', 'expertise', 'filterState',
              'categoryId', 'categoryName', 'bainOffice', 'note', 'levelName', 'gradeName', 'title', 'expertIndustries', 'expertClients',
              'isExternalEmployee', 'abbreviation', 'sortOrder', 'statusCode');
          })
        }
        if (client.nextCall) {
          client.nextCall.forEach((obj, index) => {
            client.nextCall[index] = omit(obj, 'oldEmployee', 'isMultipleClient', 'expertState', 'expertPoolColor', 'expertData', 'expertId', 'expertGroupId',
              'lastUpdatedBy', 'industry', 'client', 'isMultipleEmployee', 'employee', 'industries', 'clients', 'expertCategory', 'expertise', 'filterState',
              'categoryId', 'categoryName', 'bainOffice', 'note', 'levelName', 'gradeName', 'title', 'expertIndustries', 'expertClients',
              'isExternalEmployee', 'abbreviation', 'sortOrder', 'statusCode');
          })
        }
        if (client.clientHeads) {
          client.clientHeads.forEach((obj, index) => {
            client.clientHeads[index] = omit(obj, 'searchableName', 'dealClientId', 'clientType', 'partnerWorkTypeName', 'region');
          })
        }
        if (client.clientSectorLeads) {
          client.clientSectorLeads.forEach((obj, index) => {
            client.clientSectorLeads[index] = omit(obj, 'searchableName', 'dealClientId', 'clientType', 'partnerWorkTypeName', 'region');
          })
        }
        if (client.othersInvolved) {
          client.othersInvolved.forEach((obj, index) => {
            client.othersInvolved[index] = omit(obj, 'searchableName', 'dealClientId', 'clientType', 'partnerWorkTypeName', 'region');
          })
        }
        if (client.svp) {
          client.svp.forEach((obj, index) => {
            client.svp[index] = omit(obj, 'searchableName', 'dealClientId', 'clientType', 'partnerWorkTypeName', 'region');
          })
        }
        if (client.projectLead) {
          client.projectLead = omit(client.projectLead, 'searchableName', 'dealClientId', 'clientType', 'partnerWorkTypeName', 'region');
        }
        if (client.client) {
          client.client = omit(client.client, 'clientId', 'clientHeadEmployeeCode', 'clientHeadFirstName', 'clientHeadLastName',
            'clientPriorityId', 'ClientPriorityId', 'clientPriorityName', 'ClientPriorityName', 'clientReferenceId',
            'clientPrioritySortOrder');
        }
        if (client.callDates) {
          client.callDates.forEach((obj, index) => {
            client.callDates[index] = omit(obj, 'dealClientCallId');
          })
        }

        object.clients[index] = omit(client, 'bainOffice', 'employeeCode', 'agClientHeads', 'agClientSectorLeads', 'agSVP',
          'agOthersInvolved', 'possibleStartDateRange', 'priorityId', 'tmpDealClientId', 'dealClientId', 'clientId',
          'dealClientAllocationNotes', 'field', 'submittedBy', 'agProjectLead', 'publiclyTraded', 'typeOfWork', 'allocationDescription', 'allocationNoteFormatted',
          'allocationNoteTexts', 'stageTypeName', 'statusTypeName', 'priorityName', 'clientName', 'isMultipleEmployee', 'isMultipleClient', 'caseOfficeName', 'expertCategory',
          'priorityName', 'priority');

      })
    }
    //from Experts
    if (object.expertGroup) {
      object.expertGroup.forEach((group, groupIndex) => {
        object.expertGroup[groupIndex] = omit(group, 'filterState', 'expertGroupId', 'dealId', 'submittedBy');
        if (group.expertPoolColor) {
          object.expertGroup[groupIndex].expertPoolColor = omit(group.expertPoolColor, 'lastUpdatedBy', 'lastUpdatedDate');
        }
        if (group.experts) {
          group.experts.forEach((expert, index) => {
            group.experts[index] = omit(expert, 'expertPoolColor', 'expertState', 'isAllocationActive', 'categoryId',
              'filterState', 'oldEmployee', 'expertData', 'expertId', 'expertGroupId', 'lastUpdatedBy', 'industry',
              'client', 'isMultipleEmployee', 'employee', 'industries', 'clients', 'expertCategory', 'expertise', 'gradeName',
              'sortOrder', 'statusCode', 'isMultipleClient', 'expertName');
          })

        }
      })
    }

    if (object.industries) {
      object.industries = uniqBy(object.industries, function (e) {
        return e.industryName;
      });
      object.industries = orderBy(object.industries, 'industryName', 'asc');
      object.industries.forEach((obj, index) => {
        object.industries[index] = omit(obj, 'industryId', 'hierarchyLeft', 'hierarchyRight', 'isTopIndustry', 'tagId');
      })
    }
    if (object.sectors) {
      object.sectors = orderBy(object.sectors, 'industryName', 'asc');
      object.sectors.forEach((obj, index) => {
        object.sectors[index] = omit(obj, 'industryId', 'hierarchyLeft', 'hierarchyRight', 'isTopIndustry', 'tagId');
      })
    }
    if (object.subSectors) {
      object.subSectors = orderBy(object.subSectors, 'industryName', 'asc');
      object.subSectors.forEach((obj, index) => {
        object.subSectors[index] = omit(obj, 'industryId', 'hierarchyLeft', 'hierarchyRight', 'isTopIndustry', 'tagId');
      })
    }
    if (object.importantDates && object.importantDates.length > 0) {
      object.importantDates.forEach((obj, index) => {
        object.importantDates[index] = omit(obj, 'isdirty', 'isModified', 'dealDateTrackId', 'lastUpdated', 'lastUpdatedBy');
        if (obj.dateValue)
          object.importantDates[index].dateValue = omit(obj.dateValue, 'date', 'epoc', 'formatted');
      })
    }
    else {
      object.importantDates = [];
      object.importantDates.push({ comment: '', dateLabel: '', dateValue: null, oldDateValue: null } as dateTrack);
    }
    if (object.dealSecurity) {
      object.dealSecurity.forEach((obj, index) => {
        object.dealSecurity[index] = omit(obj, 'name', 'role');
        object.dealSecurity[index].employee = omit(obj.employee, 'contentId', 'familiarName', 'title', 'officeName',
          'levelName', 'gradeName', 'employeeStatusCode', 'lastUpdated', 'lastUpdatedBy', 'lastUpdatedName', 'abbreviation', 'employeeStatusCode', 'statusCode');
        object.dealSecurity[index].tabs = omit(obj.tabs, 'accessTierId', 'accessTierName', 'tabName');
      })
    }

    if (object.transactedDate) {
      object.transactedDate = omit(object.transactedDate, 'date', 'epoc', 'formatted');
    }
    if (object.trainers) {
      object.trainers.forEach((obj, index) => {
        object.trainers[index] = omit(obj, 'contentId', 'lastName', 'firstName', 'familiarName', 'title', 'officeName', 'levelName', 'gradeName', 'officeAbbreviation',
          'employeeStatusCode', 'lastUpdated', 'lastUpdatedBy', 'lastUpdatedName', 'pegRole', 'pegRoleName', 'abbreviation', 'searchableName');
      })
    }
    if (object.attendees) {
      object.attendees.forEach((obj, index) => {
        object.attendees[index] = omit(obj, 'contentId', 'lastName', 'firstName', 'familiarName', 'title', 'officeName', 'levelName', 'gradeName', 'officeAbbreviation',
          'employeeStatusCode', 'lastUpdated', 'lastUpdatedBy', 'lastUpdatedName', 'pegRole', 'pegRoleName', 'abbreviation', 'searchableName');
      })
    }
    if (object.sentTo) {
      object.sentTo.forEach((obj, index) => {
        object.sentTo[index] = omit(obj, 'contentId', 'lastName', 'firstName', 'familiarName', 'title', 'officeName', 'levelName', 'gradeName', 'officeAbbreviation',
          'employeeStatusCode', 'lastUpdated', 'lastUpdatedBy', 'lastUpdatedName', 'pegRole', 'pegRoleName', 'abbreviation', 'searchableName');
      })
    }

    return object;
  }

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {

    if (!this.canDeactivate()) {
      $event.returnValue = "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or Leave to lose these changes.";
    }
  }
  @HostListener('window:unload', ['$event'])
  onunload($event: any) {
    var appSession: AppSession = new AppSession();
    appSession.appSessionId = 0;
    appSession.pageId = PagesTypes.Deal;
    appSession.pageReferenceId = this.dealId;

    let employee = { employeeCode: this.coreService.loggedInUser.employeeCode };
    appSession.employee = employee;

    let headers = {
      type: 'application/json'
    };
    let blob = new Blob([JSON.stringify(appSession)], headers);
    navigator.sendBeacon(this.coreService.appSettings.PEGApiBasePath + 'api/general/deleteAppSession', blob);
  }



  @ViewChild('staticTabs', { static: true }) staticTabs: TabsetComponent;

  @ViewChild('form', { static: true })
  private form: NgForm;
  toggleAllocationTab: boolean = false;
  toggleSecurityTab: boolean = false;
  dealId: number = 0;

  industries: any;
  sectorsList: any;
  subSectorsList: any;
  subSectors: any;
  isAddToDeal = false;
  tpDeal: any = null;
  visibleTo: visibleToHighlights = new visibleToHighlights();
  customClass = 'customClass';
  suggestorSubscriber: any;
  isValidated: boolean = true;
  invalidForm: boolean = null;
  deviceInfo: any;
  isClicked: boolean = false;
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  locationOfDeal: LocationOfDeal[] = [];
  startDate: Date = new Date();
  regions: any[];
  mbStatus: any[];

  industrySectors:industrSectorSubSector = { industries: [], sectors: [], subSectors: [] };

  taggedPeople: Array<any>;
  currentTaggedPeople: Array<any>;
  isInvalidForm: boolean = false;
  isInvalidDate: boolean = false;
  totalRegistration: number = 0;

  dealStatus: dealStatus[];
  selectedStatus: dealStatus;
  selectedMBStatus: MBStatus;
  deal: deals = {
    dealId: 0, targetName: '', targetId: 0, submittedBy: null, clientName: '',
    dealRegistrations: [], createdOn: null, bankRunningProcess: '', bankProcessName: '', currentEBITDA: '', dealSize: '', targetDescription: '',
    isPubliclyKnown: null, nickname: '', notes: '', owner: null, targetCountry: null,
    associatedRegistrations: null, mbAdvisor: [], mbStatus: null, sellSideStatus: null, sector: null, externalProjectName: null,
    visibleTo: null, biddersList: null, dealWinner: null, dealStatus: null, bidDates: null, bidDatesType: null, priorWork: "",
    publiclyTraded: false,
    vddProvider: '', redbookAvailable: 0, industries: [], expertGroup: [{
      dealId: 0,
      expertGroupId: 0,
      expertGroupName: '',
      expertGroupNote: '',
      expertPoolColor: null,
      expertGroupCategory: null,
      experts: [],
      filterState: 0,
    }], clients: [], clientAllocations: [], importantDates: [],
    managedBy: null, dealRegions: [], dealSecurity: [], supportRequested: false, expertLineupPrepared: false,
    expertOnBoard: false, processExpectation: null, supportedWinningBidder: '', transactedTo: '', transactedDate: null,
    submissionDate: null, sectors: [], subSectors: [], dateOfCall: null, isExpertTrainUpCall: false, attendees: null, sentTo: null, trainers: null, isMasked: false,
    statusUpdateDate: null

  }
  isHighlightPresent = false;
  isDealAvailable: boolean = false;
  mbAdvisorListTypeAhead = new Subject<string>();
  mbAdvisorList: Employee[];
  mbAdvisorLoad = false;
  selectedMBAdvisor: Employee[] = [];
  mbManagerList: Employee[] = [];

  selectedMbManager: string;

  dealAuthorization: DealSecurity[];
  dealAuth: DealAuth = new DealAuth();

  sectorsSubSector: any;
  mbHighlights = { interest: 0, commitment: 0, workStarted: 0, workCompleted: 0, terminated: 0 };
  totalUniqueClients = 0;
  dealLabel: any;

  public startCounter() {
    if (this._timerSubscription) {
      this._timerSubscription.unsubscribe();
    }

    this._counter = 0;
    this._timer = timer(1000, 1000);
    this._timerSubscription = this._timer.subscribe(n => {
      this._counter++;
      this.changeRef.markForCheck();
    });
  }

  public reset() {
    this.startCounter();
    this._status = "Initialized.";
    this.idleTimeoutSvc.resetTimer();
  }

  constructor(private dealService: DealsService, private newRegistrationService: NewRegistrationService, private changeRef: ChangeDetectorRef,
    private idleTimeoutSvc: TimeoutService,
    public dialogSvc: TimeoutDialogService,
    private appInsights: AppInsightWrapper,
    private titleService: Title,
    private coreService: CoreService, private router: Router, private toastr: PegTostrService, private route: ActivatedRoute, private globalService: GlobalService,
    private registrationService: RegistrationService, public dealSecurityService: DealSecurityService) {
      if(this.coreService.loggedInUserRoleId==RoleType.PEGAdministrator){
        this.isAdmin=false;
      }
      else{
        this.isAdmin=false;

      }
    let dealId = 0
    if (this.route != undefined && this.route.params != undefined) {
      this.route.params.subscribe(data => {

        if (data != undefined && data.hasOwnProperty('dealid') && data.dealid > 0) {
          let decodedDealId = CommonMethods.decodeData(data.dealid);
          dealId = parseInt(decodedDealId);


        }
      });
    }

    // Set the tracker based on localstorage storage (usually comes under the scenario of add to deal tracker --> Go to tracker)
    if (localStorage.getItem('registrationdata-' + dealId.toString()) != null) {
      //setting this false so that copy to tracker is opened in editable mode.
      this.dealSecurityService.isReadOnlyMode = false;
      this.dealService.isFromRegistration = true;
      let dealFromAddToTracker = JSON.parse(CommonMethods.decryptData(localStorage.getItem('registrationdata-' + dealId.toString())));
      localStorage.removeItem('registrationdata-' + dealId.toString());
      this.dealFromRegistration = dealFromAddToTracker;
      this.deal = dealFromAddToTracker;
         if (dealId == 0) {
        this.dealService.multipleRegToDeal.isStopped = true;
        if (this.selectedStatus == undefined || this.selectedStatus == null) {
          let Active: dealStatus = { dealStatusId: 2, dealStatusName: 'Active' };
          this.selectedStatus = Active;
        }

        // Get the MB status which will be used to set the mb status in case of go to tracker
        this.globalService.getMBStatus().subscribe(mbStatus => {
          this.mbStatus = mbStatus;

          
        })

      }
      this.appInsights.logEvent(`${CategoryType.ExpertiseTracker} - Add registration to tracker : ${this.deal.dealId}`);
      this.isHighlightPresent = true;
      this.setMBHighlights();
    }


    this.mbAdvisorListTypeAhead.pipe(
      tap(() => { this.mbAdvisorLoad = true; this.mbAdvisorList = []; }),
      debounceTime(200),
      switchMap(term => this.newRegistrationService.getEmployeeNames(term, EMPLOYEE_STATUS_CODE, LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE)),
      tap(() => this.mbAdvisorLoad = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
      });

      this.mbAdvisorList = items;
    });

  }
  replacePointOfContact() {
    //Replace point of contact by submittedBy name if null
    this.deal.clients.forEach(currClient => {
      if (currClient != undefined && currClient.registrationSubmitterEcode != undefined && currClient.registrationSubmitterEcode.trim() != "" && currClient.projectLead == undefined) {
        currClient.projectLead = {
          employeeCode: "",
          familiarName: "",
          firstName: "",
          lastName: "",
          partnerWorkTypeName: "",
          region: {
            regionId: 0,
            regionName: ""
          },
          searchableName: "",
          officeAbbreviation: ""
        };

        if (currClient.registrationSubmittedBy.hasOwnProperty('firstName')) {
          let pointOfContact: any = currClient.registrationSubmittedBy;
          currClient.projectLead.lastName = pointOfContact.lastName;
          currClient.projectLead.firstName = pointOfContact.firstName;
          currClient.projectLead.employeeCode = pointOfContact.employeeCode;
          currClient.projectLead.searchableName = pointOfContact.searchableName;
          currClient.projectLead.officeAbbreviation = pointOfContact.officeAbbreviation;
        } else {
          let SubAbre = currClient.registrationSubmittedBy.substring(currClient.registrationSubmittedBy.indexOf('('), currClient.registrationSubmittedBy.length).replace(")", "").replace("(", "");
          let SubName = currClient.registrationSubmittedBy.replace(currClient.registrationSubmittedBy.substring(currClient.registrationSubmittedBy.indexOf('('), currClient.registrationSubmittedBy.length), "");
          SubName = SubName.replace(" ", "");
          currClient.projectLead.lastName = SubName.split(",")[0]
          currClient.projectLead.firstName = SubName.split(",")[1]
          currClient.projectLead.employeeCode = currClient.registrationSubmitterEcode;
          currClient.projectLead.searchableName = currClient.registrationSubmittedBy;
          currClient.projectLead.officeAbbreviation = SubAbre;
        }
      }
    })
  }
  customManagedBySearch(term: string, item: Employee) {
    term = term.toLocaleLowerCase();
    return item.employeeCode.toLocaleLowerCase().indexOf(term) > -1
      || item.firstName.toLocaleLowerCase().indexOf(term) > -1
      || item.lastName.toLocaleLowerCase().indexOf(term) > -1
      || (item.officeAbbreviation && item.officeAbbreviation.toLocaleLowerCase().indexOf(term) > -1);
  }

  renderDateTrack() {
    if (this.deal.importantDates != undefined && this.deal.importantDates.length > 0) {
      //Create Date Object from UTC to Current timeZone
      let tempImportantDatesList: dateTrack[] = [];
      this.deal.importantDates.forEach(element => {
        let tempImportantDate: dateTrack = new dateTrack();
        tempImportantDate.comment = element.comment
        tempImportantDate.dateLabel = element.dateLabel
        let mdt: any = moment(element.dateValue);
        tempImportantDate.dateValue = element.dateValue != undefined && element.dateValue != null ? { jsdate: mdt._d } : null;
        tempImportantDate.oldDateValue = element.dateValue;
        tempImportantDate.dealDateTrackId = element.dealDateTrackId
        tempImportantDate.lastUpdated = element.lastUpdated
        tempImportantDate.lastUpdatedBy = element.lastUpdatedBy
        tempImportantDate.isdirty = element.isdirty
        tempImportantDatesList.push(tempImportantDate);

      });
      this.deal.importantDates = tempImportantDatesList;
    } else {

    }
  }
  updateDealRegistrations(registrationId: any) {
    if (registrationId) {
      let updatedDealRegistratrions = this.deal.dealRegistrations.filter(a => a.registration.id != registrationId);
      this.deal.dealRegistrations = updatedDealRegistratrions;
    }
    this.setMBHighlights();
    this.setMBStatus();
  }
  setMBStatus() {
    if (this.mbStatus && this.mbStatus.length > 0 && this.deal.mbStatus) {
      let mbStatus: MBStatus = this.mbStatus.filter(mbStatus => mbStatus.mbStatusId == this.deal.mbStatus)[0];
      this.selectedMBStatus = mbStatus;
    }
  }
  setMBHighlights() {
    if (this.deal.dealRegistrations) {
      let dealClients = this.deal.clients.filter(x => x.client.clientName != undefined && x.client.clientName.trim() != '');
      dealClients.map(x => {
        x.client.clientName = x.client.clientName.trim();
        x.client.clientName = x.client.clientName.replace(/\s+/g, ' ');
      });
      this.totalUniqueClients = uniqBy(dealClients.filter(x => x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate), 'client.clientName').length;
      this.totalRegistration = dealClients.filter(x => x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.interest = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.Interest && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.commitment = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.Commitment && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.workStarted = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.WorkStarted && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.workCompleted = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.WorkCompleted && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.terminated = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.Terminated && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
    }
  }

  selectTab(currentTab) {
    this.currentTab = currentTab;
    //Set cookie for current tab
    if (this.dealId) {
      CommonMethods.setCookie("trackerTab" + this.dealId, currentTab, 7);
    }


    if (currentTab == 'allocation') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.allocation = true;

      if (this.deal.expertGroup) {
        this.deal.expertGroup.sort((a, b) =>
          (a.expertGroupName.toLowerCase() > b.expertGroupName.toLowerCase()) ? 1
            : ((a.expertGroupName.toLowerCase() < b.expertGroupName.toLowerCase()) ? -1 : 0));
      }
      this.appInsights.logEvent(`${CategoryType.MBExpertTabChange} - switch tab - tabName: ${currentTab}`) ;
      this.sortDealClients();


    } else if (currentTab == 'strategy') {
      // this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      // this.toggleTabs.allocation = true;

      // if (this.deal.expertGroup) {
      //   this.deal.expertGroup.sort((a, b) =>
      //     (a.expertGroupName.toLowerCase() > b.expertGroupName.toLowerCase()) ? 1
      //       : ((a.expertGroupName.toLowerCase() < b.expertGroupName.toLowerCase()) ? -1 : 0));
      // }
      // this.sortDealClients();


    } else if (currentTab == 'clients') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.clients = true;

      this.dealService.switchTab.next('clients');
      this.sortDealClients();
      this.appInsights.logEvent(`${CategoryType.MBExpertTabChange} - switch tab - tabName: ${currentTab}`) ;
    } else if (currentTab == 'security') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.security = true;
      this.appInsights.logEvent(`${CategoryType.MBExpertTabChange} - switch tab - tabName: ${currentTab}`) ;

    } else if (currentTab == 'experts') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.experts = true;

      this.dealService.switchTab.next('experts');
      this.appInsights.logEvent(`${CategoryType.MBExpertTabChange} - switch tab - tabName: ${currentTab}`) ;
      if (this.deal.expertGroup) {
        this.deal.expertGroup.sort((a, b) =>
          (a.expertGroupName.toLowerCase() > b.expertGroupName.toLowerCase()) ? 1
            : ((a.expertGroupName.toLowerCase() < b.expertGroupName.toLowerCase()) ? -1 : 0));
      }
    }
    else if (currentTab == 'audit') {

      this.dealService.switchTab.next('audit');
    } else if (currentTab == 'context') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.context = true;
    }
    else {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))

    }
  }

  initializingSession() {
    this.startCounter();

    this._idleTimerSubscription = this.idleTimeoutSvc.timeoutExpired?.subscribe(res => {
      if (!this.dealSecurityService.isReadOnlyMode) {
        this.idleTimeoutSvc.timerAfterPopup = timer(60000)
          .pipe(
            map(() => { }),
            takeUntil(this.idleTimeoutSvc._stop),
            repeatWhen(() => this.idleTimeoutSvc._start)
          );
        this.idleTimeoutSvc.startTimerPopup();
        this.idleTimeoutSvc.timerAfterPopup.subscribe(x => {

          //this.autoSave();

        })

        this.dialogSvc.close();
        var modalPromise = this.dialogSvc.open("You have been Idle!", 'You have been inactive for a while. System will save your updates and release the tracker in approximately 1 minute. Choose “Save & Continue” to keep working or “Discard” to ignore your updates and release the tracker.', true, "Save & Continue", "Discard");
        var newObservable = from(modalPromise);
        newObservable.subscribe(
          (res) => {
            if (res === true) {
              this._status = "Session was extended.";
              this.idleTimeoutSvc.resetTimer();
              this.startCounter();
              this.changeRef.markForCheck();
              this.idleTimeoutSvc.stopTimerPopup();
              if (this.isTrackerModified()) {
                this.submitClose();
              }
            } else {
              this._status = "Session was not extended.";
              this.changeRef.markForCheck();
              this.idleTimeoutSvc.stopTimerPopup();
              this.removeCurrentSession();
              this._idleTimerSubscription.unsubscribe();
              this._timerSubscription.unsubscribe();
              this.setTrackerMode(true);
            }
          },
          (reason) => {
            this._status = "Session was not extended.";
            this.changeRef.markForCheck();
          }
        );
      }

    });
  }

  autoSave() {
    if (this.isTrackerModified()) {
      this.submitClose();
    }
    this.dialogSvc.close();
    this.removeCurrentSession();
    this._idleTimerSubscription.unsubscribe();
    this._timerSubscription.unsubscribe();
    this.setTrackerMode(true);
    this._hasTrackerAutoSaved = true;
    this.idleTimeoutSvc.stopTimerPopup();
  }

  setTrackerMode(value) {
    this.dealSecurityService.isReadOnlyMode = value;
    this.dealSecurityService.getDealAuthorization(this.dealId).subscribe(res => {
      this.dealAuthorization = res;
      this.setDealAuth();
      this.getDealById();
    });
  }

  ngOnInit() {

    if (this.route != undefined && this.route.params != undefined) {
      this.route.params.subscribe(data => {

        if (data != undefined && data.hasOwnProperty('dealid') && data.dealid > 0) {
          let decodedDealId = CommonMethods.decodeData(data.dealid);
          this.dealId = parseInt(decodedDealId);

          this.titleService.setTitle(`M&A Conflicts - TID ${this.dealId}`);



        } else {
          this.dealSecurityService.isReadOnlyMode = false;
          this.toggleTabs.context = true;
        }
      });
    }




    this.isHighlightPresent = true;
    this.setMBHighlights();

    this.dealService.editDeal.next(this.deal);
    // this.dealId = this.dealService.getDealId();


    if (this.selectedStatus == undefined || this.selectedStatus == null) {
      let ComingtoMarket: dealStatus = { dealStatusId: 1, dealStatusName: 'Coming to Market' };
      this.selectedStatus = ComingtoMarket;
      this.deal.dealStatus = 1;
    }

    this.deviceInfo = CommonMethods.deviceInfo();
    this.initDataServices()
      .subscribe((([dealSecurity, industryItem, taggedPeopleItem, dealStatusItem, locationOfDealItem, regionItem, mbManagers, mbStatus, defaultDealSecurity]) => {
        this.industrySectors = industryItem
        this.industries = industryItem.industries;
        this.dealAuthorization = dealSecurity;
        this.setDealAuth();
        this.getUserAuthorization();
        this.taggedPeople = taggedPeopleItem.value;
        this.currentTaggedPeople = this.taggedPeople;
        this.setVisibleTo();


        this.dealStatus = dealStatusItem;

        this.locationOfDeal = locationOfDealItem;

        this.regions = regionItem;

        this.mbStatus = mbStatus;
        if (this.deal.industries != undefined && this.deal.industries.length > 0) {
          let tpIndustries = [];
          this.deal.industries.forEach((res: any) => {
            let industryName = res.hasOwnProperty('industryName') ? res.industryName : res.toString().trim();
            let t = this.industries.find(e => e.industryName.toString().trim() == industryName);
            if (t != undefined) {
              tpIndustries.push(t);
            }
          })
          this.deal.industries = JSON.parse(JSON.stringify(tpIndustries));
          if (this.deal.dealId == undefined || this.deal.dealId <= 0) {
            this.renderIndustryList();
          }
        }

        this.deal.dealSecurity = defaultDealSecurity;

        //Setting region while copy to tracker
        let dealRegion: any = [];
        Object.assign(dealRegion, this.deal.dealRegions);
        if (this.regions && this.regions.length > 0) {
          this.deal.dealRegions = [];
          dealRegion.forEach(value => {
            if (this.regions.some(x => x.regionId == value)) {
              this.deal.dealRegions.push(this.regions.find(x => x.regionId == value).regionId);
            }
          })
        }

        this.updateCurrentDealObject(this.deal);


        if (this.dealService.isFromRegistration) {

          this.replacePointOfContact();
        }

        if (!this.dealId) {
          this.isDealAvailable = true;
        }

        mbManagers.forEach(element => {
          if (element) {
            element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
          }
        })
        this.mbManagerList = mbManagers;
        if (this.deal.dealId == undefined || this.deal.dealId == 0) {
          if (this.mbManagerList.findIndex(e => e.employeeCode == this.coreService.loggedInUser.employeeCode) > -1) {
            this.deal.managedBy = this.coreService.loggedInUser.employeeCode;
          }
        }

        if (this.dealId != undefined && this.dealId != null && this.dealId > 0) {
          this.getDealById();



        }
        else if (!this.dealService.isFromRegistration) {
          this.dealService.dealBackup = cloneDeep(this.deal);

        }
        else {
          this.dealService.isFromRegistration = false;
        }
      }));
  }

  initDataServices() {
    return forkJoin(
      this.dealSecurityService.getDealAuthorization(this.dealId),
      this.globalService.getAllIndustrySectorsSubSectors(),
      this.dealService.getDealTaggedPeopleById(this.dealId),
      this.globalService.getDealStatus(),
      this.globalService.getLocationofDeals(),
      this.globalService.getRegions(),
      this.registrationService.getUsersByRole(RoleType.MultibidderManager),
      this.globalService.getMBStatus(),
      this.dealSecurityService.getDealAccessInformation()
    );
  }

  renderIndustryList() {
    if (this.deal.industries != undefined && this.deal.industries.length > 0) {

      this.sectorsSubSector = [];
      this.sectorsList = [];
      this.resetModal();

    }



  }

  getDealById() {
    this.dealService.getDealById(this.dealId, this.dealSecurityService.isReadOnlyMode)
      .subscribe((deal) => {
        if (deal != null) {
          //Setting of active users starts
          this.trackerStatus = false;
          if (deal.appSession) {
            if (deal.appSession.length > 0) {
              // again disabling the active session in case a user is editing
              this.dealSecurityService.isReadOnlyMode = true;

              this.dealAuthorization.map(ele => ele['isTabReadonly'] = true); 1
              this.setDealAuth();

            }
            deal.appSession.forEach(appSession => {
              this.activeUsers.push(appSession.employee);
            })
            this.activeUserName = CommonMethods.getEmployeeNames(this.activeUsers, ';')
          }
          //Setting of active users end


          this.updateDealToObject(deal);
          this.navigateToTabs();
          //Adding Registration to existing Deal tracker
          this.dealService.AddRegistrationToDeal.subscribe((r: any) => {
            if (r != null && r != undefined && this.staticTabs.tabs != undefined && this.staticTabs.tabs.length > 0) {
              //Navigate to client tab
              this.sortDealClients();
              this.dealService.dealBackup = cloneDeep(this.deal);
              let clientTabObj = {}
              clientTabObj = this.staticTabs.tabs.find(a => a.heading == 'Clients');
              if (clientTabObj != undefined) {
                this.staticTabs.tabs.find(a => a.heading == 'Clients').active = true;
              }
              else {
                this.navigateToTabs();
              }

              r.dealRegistrations.forEach(dr => {
                this.deal.dealRegistrations.push(dr);
              })
              r.clients.forEach(c => {
                this.deal.clients.push(c);
              })

              //Replace point of contact by submittedBy name if null
              this.replacePointOfContact();

            }
          });

          if (this.dealService.isFromRegistration) {
            if (this.dealFromRegistration != null && this.dealFromRegistration != undefined && this.staticTabs.tabs != undefined && this.staticTabs.tabs.length > 0) {
              //Navigate to client tab
              this.sortDealClients();
              this.dealService.dealBackup = cloneDeep(this.deal);
              let clientTabObj = {}
              clientTabObj = this.staticTabs.tabs.find(a => a.heading == 'Clients');
              if (clientTabObj != undefined) {
                this.staticTabs.tabs.find(a => a.heading == 'Clients').active = true;
              }
              else {
                this.navigateToTabs();
              }

              this.dealFromRegistration.dealRegistrations.forEach(dr => {
                this.deal.dealRegistrations.push(dr);
              })
              this.dealFromRegistration.clients.forEach(c => {
                this.deal.clients.push(c);
              })


              if (this.deal.clients && this.deal.clients.length == 1) {
                if ( this.deal?.dealRegistrations[0]?.registration?.isb) {
                  deal.mbStatus = dealMBStatus.SingleRegistration;
                  this.setMBStatus();
                }
              }
           
             
              this.setAssetStatus();             

              //Replace point of contact by submittedBy name if null
              this.replacePointOfContact();
            }

          }

          this.setMBHighlights();
          this.dealService.AddRegistrationToDeal.next(undefined);
          this.dealService.editDeal.next(this.deal);
          if (!this.dealService.isFromRegistration) {
            this.sortDealClients();
            this.dealService.dealBackup = cloneDeep(this.deal);
          }
          else {
            this.dealService.isFromRegistration = false;
          }
          if (!this.dealSecurityService.isReadOnlyMode) {
            //this.initializingSession();
          }
          this.setRedbookAvailable(this.deal.redbookAvailable);

        }
        else {
          this.trackerStatus = true;
        }

      })
    this.dealService.multipleRegToDeal.next(null);
  }
 
  setAssetStatus()
  {
    if (this.deal && this.deal.dealStatus && this.deal.dealStatus == TrackerStatus.Cold) {
      let Active: dealStatus = { dealStatusId: TrackerStatus.Active, dealStatusName: 'Active' };
      this.selectedStatus = Active;
    } 
   
  }
  updateDealToObject(deal: deals) {
    this.deal = deal;
    this.renderDateTrack();
    this.renderIndustryList();

    //Setting transacted date in js dateformat for rendering
    this.deal.transactedDate = this.deal.transactedDate != undefined && this.deal.transactedDate != null ? { jsdate: new Date(this.deal.transactedDate) } : null;

    //Showing Deal Advisor
    let mbData = this.deal.mbAdvisor;
    mbData.forEach(element => {
      element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
    });
    this.selectedMBAdvisor = mbData;

    this.setMBHighlights();
    this.dealService.editDeal.next(this.deal);

    this.updateCurrentDealObject(this.deal);
    let dStatus = this.dealStatus.find(res => res.dealStatusId === this.deal.dealStatus)
    let mbStatus = this.mbStatus.find(res => res.mbStatusId === this.deal.mbStatus)

    if (dStatus != undefined && dStatus != null) {
      this.selectedStatus = dStatus;
    }
    else {
      this.deal.dealStatus = 1;
    }
    if (mbStatus != undefined && mbStatus != null) {
      this.selectedMBStatus = mbStatus;
    }

    if (this.deal.expertGroup)
      this.deal.expertGroup.forEach(group => {
        group.experts.forEach((element: any) => {
          element.isMultipleClient = true;

          element.expertName = element.expertName;
          element.oldEmployee = {};
          element.oldEmployee.employeeCode = element.employeeCode;
          element.oldEmployee.searchableName = element.expertName;
        })
        group.experts.sort((a, b) => {
          if (a.sortOrder == b.sortOrder) {
            return a.expertName > b.expertName ? 1 : -1;
          }

          return (a.sortOrder > b.sortOrder) ? 1
            : ((a.sortOrder < b.sortOrder) ? -1 : 0)

        });


      });
    if (this.deal.clients) {
      this.deal.clients.forEach(group => {
        if (group.committed) {
          group.committed.map(element => {
            element.expertName = element.expertName;
          })
          group.committed.sort((a, b) => { return a.sortOrder - b.sortOrder });
        }
      });
      this.deal.clients.forEach(group => {
        if (group.heardFrom) {
          group.heardFrom.map(element => {
            element.expertName = element.expertName;
          })
          group.heardFrom = group.heardFrom.sort((a, b) => { return a.sortOrder - b.sortOrder });
        }
      });

      this.deal.clients.forEach(group => {
        if (group.nextCall) {
          group.nextCall.map(element => {
            element.expertName = element.expertName;
          })
          group.nextCall = group.nextCall.sort((a, b) => { return a.sortOrder - b.sortOrder });
        }
      });
    }
    this.isDealAvailable = true;
    this.updateDealForReadOnly();
  }

  updateCurrentDealObject(deal) {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].setValue(deal[key]);
    });
  }

  updateDealForReadOnly() {
    this.dealLabel = JSON.parse(JSON.stringify(this.deal));

    this.dealLabel.industries = this.getObjectProperties(this.dealLabel.industries, 'industryName', ',');
    this.dealLabel.sectors = this.getObjectProperties(this.dealLabel.sectors, 'sectorName', ',');
    this.dealLabel.subSectors = this.getObjectProperties(this.dealLabel.subSectors, 'subSectorName', ',');
    this.dealLabel.mbAdvisor = this.getObjectProperties(this.dealLabel.mbAdvisor, 'searchableName', '; ');

    let regions = [];
    this.dealLabel.dealRegions.forEach(ele => { regions.push(this.regions.find(x => x.regionId == ele)) });
    this.dealLabel.dealRegions = this.getObjectProperties(regions, 'regionName', '; ');

    let managedBy = this.mbManagerList.find(x => x.employeeCode == this.dealLabel.managedBy);
    this.dealLabel.managedBy = CommonMethods.getEmployeeName(managedBy);

    this.dealLabel.attendees = CommonMethods.getEmployeeNames(this.dealLabel.attendees, '; ')
    this.dealLabel.trainers = CommonMethods.getEmployeeNames(this.dealLabel.trainers, '; ')
    this.dealLabel.sentTo = CommonMethods.getEmployeeNames(this.dealLabel.sentTo, '; ')


  }


  getObjectProperties(params, propertyName, splitChar) {

    if (params && params.length > 0) {
      return params.map(val => val[propertyName]).join(splitChar);
    } else {
      return '';
    }
  }


  onIndustryChange(event) {
    if (event.length > 0) {
      if (event[0].industryName.toString().trim() == '') {
        this.form.form.controls['industrySelect'].setErrors({ 'incorrect': true });
      }
    }


    this.sectorsSubSector = [];
    this.sectorsList = [];
    let tempSectors = [];
    event.forEach(currInd => {
      tempSectors = tempSectors.concat(this.industrySectors.sectors.filter(e => e.industryId == currInd.industryId))
    });
    this.sectorsList = tempSectors;
  }


  editMode() {
    this._hasTrackerAutoSaved = false;
    this.setTrackerMode(false)

  }


  resetModal() {
    // //setting hierachary while editing
    this.sectorsSubSector = [];
    this.sectorsList = [];
    let tempSectors = [];
    let tempSubSectors = [];

    this.deal?.industries?.forEach(currInd => {
      tempSectors = tempSectors.concat(this.industrySectors.sectors.filter(e => e.industryId == currInd['industryId']))
    });
    this.sectorsList = tempSectors;


    let sectorModel = [];
    this.deal?.sectors.forEach(currInd => {
      if (this.sectorsList.some(r => r.sectorId == currInd['sectorId'])) {
        sectorModel.push(currInd);
      }
    });
    this.deal.sectors = sectorModel;


    //Setting up subsector list
    this.deal?.sectors.forEach(currInd => {
      tempSubSectors = tempSubSectors.concat(this.industrySectors.subSectors.filter(e => e.sectorId == currInd['sectorId']))
    });
    this.subSectorsList = tempSubSectors;


    let subSectorModel = [];
    this.deal?.subSectors.forEach(currInd => {
      if (this.subSectorsList.some(r => r.subSectorId == currInd['subSectorId'])) {
        subSectorModel.push(currInd);
      }
    });
    this.deal.subSectors = subSectorModel;

  }
  onIndustryRemove() {
    this.resetModal();

  }
  onSectorRemove() {
    this.resetModal();

  }
  resetList(event) {
    if (this.subSectorsList != undefined) {
      let tmpList = [];

      event.forEach(currInd => {
        tmpList = tmpList.concat(this.subSectorsList.filter(is => is.hierarchyLeft > currInd.hierarchyLeft && is.hierarchyLeft < currInd.hierarchyRight))

      })
      this.subSectorsList = [];
      this.subSectorsList = tmpList;
    }
  }
  onSectorChange(event) {
    if (event != undefined) {
      this.subSectorsList = []
      event.forEach(currInd => {
        let tp = this.industrySectors.subSectors.filter(is => is.sectorId == currInd.sectorId)
        if (tp != undefined)
          this.subSectorsList = this.subSectorsList.concat(tp);

      })
    }

  }
  onIndustryClear() {
    this.resetModal();
  }
  onSectorClear() {
    this.resetModal();
  }

  onMbAdvisorChange(event) {
    if (this.selectedMBAdvisor && this.selectedMBAdvisor.length > 0) {
      this.deal.mbAdvisor = this.selectedMBAdvisor;
    } else {
      this.deal.mbAdvisor = [];
    }
  }
  differenceObject(targetObj, baseObj) {
    const _transform = transform.convert({
      cap: false
    });

    const iteratee = baseObj => (result, value, key) => {
      if (!isEqual(value, baseObj[key])) {
        const valIsObj = isObject(value) && isObject(baseObj[key]);
        result[key] = valIsObj === true ? this.differenceObject(value, baseObj[key]) : value;
      }
    };

    return _transform(iteratee(baseObj), null, targetObj);
  }
  compareObject(element) {
    if (typeof element == 'object' && element != undefined && element.length > 0) {
      element.forEach(arrayElement => {
        this.compareObject(arrayElement)
      });
    } else {

    }
  }

  createAuditLog() {
    let auditLog: any = [];
    let mainObject = this.differenceObject(this.skipNotRequiredProperties(cloneDeep(this.deal)), this.skipNotRequiredProperties(this.dealService.dealBackup))
    Object.keys(mainObject).forEach(element => {
      let oldValue = this.dealService.dealBackup[element];
      let newValue = this.deal[element]
      if (typeof newValue == 'object' && newValue != undefined && newValue.length > 0) {
        let objectValueNode = this.differenceObject(this.skipNotRequiredProperties(cloneDeep(this.deal[element])), this.skipNotRequiredProperties(this.dealService.dealBackup[element]))
        objectValueNode = Object.values(objectValueNode)
        for (let index = 0; index < objectValueNode.length; index++) {
          const objectValue = objectValueNode[index];
          Object.keys(objectValue).forEach(elementObject => {
            let test = this.dealService.dealBackup
            let oldValueObject = this.dealService.dealBackup[element][index][elementObject];
            let newValueObject = this.deal[element][index][elementObject]
            if (!CommonMethods.customizer(oldValue, newValue)) {
              auditLog.push({ fieldName: elementObject, oldValue: oldValueObject, newValue: newValueObject });
            }
          });
        }


      } else {
        if (!CommonMethods.customizer(oldValue, newValue)) {
          auditLog.push({ fieldName: element, oldValue: oldValue, newValue: newValue });
        }
      }
    });
  }

  submitClose() {
    let selectedRegistrationIds = [];
    let currentClientWithRegistrationId = this.deal.clients.filter(item => item.registrationId != null && item.registrationId != undefined && item.registrationId > 0 && typeof (item.dealClientId) != 'number');
    this.deal.importantDates.forEach(deal => {
      if ((deal.dateValue === null || deal.dateValue === "") && (deal.dateLabel === null || deal.dateLabel === "")
        && (deal.comment === null || deal.comment === "")) {
        this.deal.importantDates = this.deal.importantDates.filter(x => (x.comment != null && x.comment != "") || (x.dateLabel != null && x.dateLabel != "") || (x.dateValue != null && x.dateValue != ""))
      }
    })
    if (currentClientWithRegistrationId.length > 0) {

      currentClientWithRegistrationId.forEach(client => {


        selectedRegistrationIds.push(client.registrationId);

      })

      this.dealService.getLinkedRegistrations(selectedRegistrationIds).subscribe(res => {
        if (res && res.length > 0) {
          this.toastr.showWarning('The registration id(s)' + res.join(',') + ' already linked.', 'Warning');
          return;
        }
        else {
          this.saveTracker();
        }

      })
    }
    else {
      this.saveTracker();
    }

  }

  saveTracker() {
    if (!this.isClicked) {
      this.isClicked = true;

      this.isInvalidForm = false;
      let inputDeal: deals = this.deal;
      this.dealService.isFromRegistration = false;

      //Filter out blank rows from client 
      inputDeal.clients = inputDeal.clients.filter(item => item.client.clientName != null && item.client.clientName != undefined && item.client.clientName.trim() != '');

      this.checkForValidation(inputDeal);

      if (this.isInvalidForm) {
        return;
      }
      inputDeal.submittedBy = CommonMethods.getLoggedInEmployee(this.coreService.loggedInUser);

      //= this.coreService.loggedInUser.employeeCode;
      let inputForm = this.form.value;
      Object.keys(this.form.value).map(function (key, index) {

        if (inputForm[key] != null && inputForm[key] != undefined && inputForm[key] != '') {
          if (key != "trainers" && key != "attendees" && key != "sentTo") {
            inputDeal[key] = inputForm[key];
          }
        }
        if (key == "redbookAvailable" && inputForm[key] != null) {
          inputDeal[key] = inputForm[key];
        }

        if (key == "expertOnBoard" || key == "expertLineupPrepared" || key == "supportRequested") {
          inputDeal[key] = inputForm[key] != '' && inputForm[key] != undefined ? inputForm[key] : false;
        }
        if (key == "regions" && inputForm[key] == '') {
          inputDeal[key] = inputForm[key];
        }

        if (key == "dealRegions" && inputForm[key] == '') {
          inputDeal[key] = inputForm[key];
        }
        if (key == "transactedDate" && inputForm[key] != '') {
          let parsetDate;
          if (inputForm[key] != undefined) {
            parsetDate = CommonMethods.convertDatetoUTC(inputForm[key].jsdate)
          }
          inputDeal[key] = parsetDate ? parsetDate.utc : null;
        }
      });

      if (this.deal.transactedDate != null && this.deal.transactedDate != undefined && this.deal.transactedDate.hasOwnProperty('jsdate')) {
        this.deal.transactedDate = CommonMethods.convertDatetoUTC(this.deal.transactedDate.jsdate);
        this.deal.transactedDate = this.deal.transactedDate.utc;
      }

      inputDeal.clients.forEach(element => {

        if (element.possibleStartDateRangeTo) {
          element.possibleStartDateRangeTo = typeof (element.possibleStartDateRangeTo) == 'object' ? CommonMethods.convertDatetoUTC(element.possibleStartDateRangeTo).utc : element.possibleStartDateRangeTo;
        }

        if (element.dealClientId != undefined && typeof element.dealClientId === 'string') {
          element.dealClientId = 0;
        }

        if (element.callDates != null && element.callDates != undefined) {
          element.callDates.forEach(el => {
            if (el.dealClientId != undefined && typeof el.dealClientId === 'string') {
              el.dealClientId = 0;
            }
          })
        }
      });

      //Update external exterts
      if (this.deal.expertGroup) {
        for (let i = 0; i < this.deal.expertGroup.length; i++) {
          this.deal.expertGroup[i].experts = this.deal.expertGroup[i].experts.filter(r => r != null && r.employeeCode != null && r.employeeCode.trim() != '')

        }
      }

      //SettingVisibleTo
      let arr = []
      if (this.currentTaggedPeople)
        this.currentTaggedPeople.forEach(element => {
          if (element.dealId != 0) {
            arr.push(element.employeeCode);
          }
        });
      this.deal.visibleTo = arr.join(',')
      this.deal.dealStatus = this.selectedStatus == undefined ? 1 : this.selectedStatus.dealStatusId; // set default to 1st status
      this.deal.mbStatus = this.selectedMBStatus == undefined ? 0 : this.selectedMBStatus.mbStatusId;

      //DealDate Track Manupulation
      if (this.deal.importantDates != undefined && this.deal.importantDates.length > 0) {
        let tempImportantDatesList: dateTrack[] = [];
        this.deal.importantDates.forEach(currDates => {
          let tempImportantDate: dateTrack = new dateTrack();
          tempImportantDate.comment = currDates.comment;
          tempImportantDate.dateLabel = currDates.dateLabel;

          tempImportantDate.dealDateTrackId = currDates.dealDateTrackId;
          tempImportantDate.lastUpdated = currDates.lastUpdated;
          tempImportantDate.lastUpdatedBy = currDates.lastUpdatedBy;
          //Adding time modified dates
          if (currDates.dateValue != null && currDates.dateValue != undefined && currDates.isModified) {
            currDates.dateValue.jsdate = CommonMethods.addCurrentTimeToDate(currDates.dateValue.jsdate);
          }

          let t: any = (currDates != undefined && currDates.dateValue != undefined && currDates.dateValue != null) ? moment(currDates.dateValue.jsdate.toUTCString()) : null;
          tempImportantDate.dateValue = (t != null && currDates != undefined && currDates.dateValue != undefined && currDates.dateValue != null) ? t._i : null;
          tempImportantDatesList.push(tempImportantDate);
        })
        this.deal.importantDates = tempImportantDatesList;
      }

      //DealDate Track Manupulation Ends
      this.isClicked = true;
      this.dealService.dealBackup = new deals();
      this.dealService.convertToDeal(inputDeal).subscribe(res => {

        let action = (this.dealId != undefined && this.dealId > 0) ? 'Update' : 'Save';
        this.appInsights.logEvent(`${CategoryType.ExpertiseTracker} - action - Tracker Id: ${res.dealId}`);
        CommonMethods.setCookie("trackerTab" + res.dealId, this.currentTab, 7);

        let tostrMessage = "New Deal Submitted Successfully.";
        if (this.dealId != undefined && this.dealId > 0) {
          tostrMessage = "Deal Updated Successfully."
        }
        if (res.dealId && res.dealId > 0) {
          this.updateDealToObject(res);
          this.sortDealClients();
          this.dealService.dealBackup = cloneDeep(this.deal);
          this.toastr.showSuccess(tostrMessage, "Confirmation");
          if (!this.dealId || this.dealId == 0) {
            this.router.navigate(['/deals/deal/' + res.dealId]);
          }
        }
        this.isClicked = false;

        if (this._hasTrackerAutoSaved) {
          this.removeCurrentSession();
        } else {
          //this.initializingSession();
        }
      });
    }

  }

  sortDealClients() {
    if (this.deal && this.deal.clients) {
      this.deal.clients = this.deal.clients.sort((a, b) => { return a.clientOrder - b.clientOrder });
      let clients = this.deal.clients.sort((a, b) => {
        return CommonMethods.sortCllients((a.stage) ? a.stage.registrationStageId : 0, a, b);
      })

      this.deal.clients = clients.sort((a, b) => { return a.clientOrder - b.clientOrder });
    }
  }

  checkForValidation(inputDeal: deals) {
    if (inputDeal.clients && inputDeal.clients.length > 0) {
      for (let i = 0; i < inputDeal.clients.length; i++) {
        let tmpClientName = inputDeal.clients[i].client.clientName;
        if (tmpClientName == null || tmpClientName == undefined ||
          tmpClientName.trim() == ''
        ) {
          this.isInvalidForm = true;
        }
      }
    }
  }

  routeBack() {
    this.dealService.setDealId(undefined);
    this.router.navigate(['/deals']);
    this.idleTimeoutSvc.stopTimerPopup();
  }

  openTaggedPeople() {
    this.tpDeal = JSON.parse(JSON.stringify(this.deal));
    document.getElementById('TagPeople').click();
  }

  outTaggedPeople(event) {
    this.currentTaggedPeople = [];
    let taggedPeopleObj = [];
    for (let i = 0; i < this.deal.dealSecurity.length; i++) {
      taggedPeopleObj.push(this.deal.dealSecurity[i].employee)
    }
    this.currentTaggedPeople = taggedPeopleObj;
    this.setVisibleTo();
  }

  setVisibleTo() {
    this.currentTaggedPeople.sort(function (a, b) {
      var nameA = a.lastName.toLowerCase(), nameB = b.lastName.toLowerCase()
      if (nameA < nameB) //sort string ascending
        return -1
      if (nameA > nameB)
        return 1
      return 0 //default return value (no sorting)
    })
    this.visibleTo.general = this.currentTaggedPeople.filter((obj) => obj.pegRole === RoleType.General).length;
    this.visibleTo.leadership = this.currentTaggedPeople.filter((obj) => obj.pegRole === RoleType.PEGLeadership).length;
    this.visibleTo.operation = this.currentTaggedPeople.filter((obj) => obj.pegRole === RoleType.PEGOperations).length;
    this.visibleTo.mb = this.currentTaggedPeople.filter((obj) => obj.pegRole === RoleType.MultibidderManager).length;
    this.visibleTo.legal = this.currentTaggedPeople.filter((obj) => obj.pegRole === RoleType.Legal).length;
    this.visibleTo.admin = this.currentTaggedPeople.filter((obj) => obj.pegRole === RoleType.PEGAdministrator).length;


  }

  ngOnDestroy() {
    this.dialogSvc.close();
    this._idleTimerSubscription?.unsubscribe();
    this.idleTimeoutSvc.stopTimer();
    this._idleTimerSubscription?.unsubscribe();
    this.dealSecurityService.isReadOnlyMode = true;
    this.dealService.setDealId(undefined);
    this.deal = new deals();
    this.dealService.editDeal.next(null);
    this.dealService.multipleRegToDeal.next(null)
    this.dealService.AddRegistrationToDeal.next(null)
    this.titleService.setTitle(`M&A Conflicts`);
    this.removeCurrentSession();

    CommonMethods.deleteCookie("trackerTab" + this.dealId);
  }

  removeCurrentSession() {
    var appSession: AppSession = new AppSession();
    appSession.appSessionId = 0;
    appSession.pageId = PagesTypes.Deal;
    appSession.pageReferenceId = this.dealId;

    let employee = { employeeCode: this.coreService.loggedInUser.employeeCode };
    appSession.employee = employee;
    this.dealService.deleteAppSession(appSession).subscribe(res => {
    })
  }
  selectStatus(item) {
    this.selectedStatus = item
    this.deal.dealStatus = item == undefined ? 1 : item.dealStatusId; // set default to 1st status
  }
  selectMBStatus(item) {
    this.selectedMBStatus = item
    this.deal.mbStatus = this.selectedMBStatus == undefined ? 0 : this.selectedMBStatus.mbStatusId;
  }

  setDealAuth() {
    if (this.dealAuthorization != undefined) {
      let dealAuthorization = this.dealAuthorization;
      for (let key in this.dealAuth) {
        for (let i = 0; i < dealAuthorization.length; i++) {
          if (key == dealAuthorization[i]['tabName']) {
            this.dealAuth[key]['isTabVisible'] = dealAuthorization[i]['isTabVisible'];
            this.dealAuth[key]['isTabReadOnly'] = dealAuthorization[i]['isTabReadonly'];
            break;
          }
        }
      }
      if (this.coreService.loggedInUserRoleId === RoleType.PracticeAreaManagerRestricted) {
        this.dealAuth.AllocationTab.isTabReadOnly = true;
      }
      if (this.coreService.loggedInUser.securityRoles && this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager)
        || (role.id == RoleType.PEGOperations)
        || (role.id == RoleType.PEGLeadership)
        || (role.id == RoleType.PEGAdministrator)
        || (role.id == RoleType.TSGSupport))) {
        this.dealAuth.SecurityTab.isTabVisible = true;
      }

    }
  }
  resetDOMofTabs() {

  }
  navigateToTabs() {
    let item = this.dealAuthorization.find(a => a.isTabVisible == true);
    if (item != undefined) {

      //Getting all active tabs.
      let visibleTabs: any = this.dealAuthorization.filter(a => a.isTabVisible == true);
      if (visibleTabs != null && visibleTabs != undefined && visibleTabs != '' && visibleTabs.length > 0) {
        visibleTabs = visibleTabs.map(a => a.tabName);
        visibleTabs = Array.from(new Set(visibleTabs));
        visibleTabs = visibleTabs.toString();
        this.appInsights.logEvent(`${CategoryType.ExpertiseTracker} - SecurityTabs: ${visibleTabs}`);
      }

      let isClientActive: any = this.staticTabs.tabs.find(a => a.heading == 'Clients');
      if (isClientActive != null && isClientActive != undefined && isClientActive != '') {
        isClientActive = isClientActive.active;
      }
      this.activeTab = this.staticTabs.tabs.find(a => a.active);
      var cookieCurrTab = CommonMethods.getCookie("trackerTab" + this.dealId);
      if (this.activeTab) {
        this.toggleTabs[this.activeTab.heading.toLowerCase()] = true;
      }

    }

    if (cookieCurrTab && cookieCurrTab != '') {
      var currActiveTab = this.staticTabs.tabs.find(a => a.heading.toLowerCase() == cookieCurrTab.toLowerCase())
      if (currActiveTab) {
        currActiveTab.active = true;

        this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState));
        if (currActiveTab.heading == 'Context') {
          this.toggleTabs.context = true;
        } else if (currActiveTab.heading == 'Experts') {
          this.toggleTabs.experts = true;
        } else if (currActiveTab.heading == 'Clients') {
          this.toggleTabs.clients = true;
        } else if (currActiveTab.heading == 'Allocation') {
          this.toggleTabs.allocation = true;
        } else if (currActiveTab.heading == 'Security') {
          this.toggleTabs.security = true;
        }
        //  else if (currActiveTab.heading == 'Strategy') {
        //   this.toggleTabs.strategy = true;
        // }

      }
    }

    // }
  }

  getUserAuthorization(): any {
    this.registrationService.getUserAuthorization()
      .subscribe(userRoleField => {
        this.registrationService.roleFieldValues = userRoleField;
        this.setFieldAuthorization();
      });
  }

  setFieldAuthorization() {
    let allRoleFields = this.registrationService.roleFieldValues;
    for (let key in this.fieldAuth) {
      for (let i = 0; i < allRoleFields.length; i++) {
        if (key == allRoleFields[i]['field']['fieldName']) {
          this.fieldAuth[key]['isEditable'] = allRoleFields[i]['isEditable'];
          this.fieldAuth[key]['isVisible'] = allRoleFields[i]['isVisible'];
          break;
        }
      }
    }
  }

  redbookChange(event) {
    this.deal.redbookAvailable = (event != undefined && event != null) ? event : 2;
    this.setRedbookAvailable(event);

  }

  setRedbookAvailable(value) {
    this.redbookAvailable = (value != null) ? value : this.redbookAvailable;
    if (value === RedbookAvailableStatus.No) {
      this.redbookAvailableText = "No";
    }
    else if (value === RedbookAvailableStatus.Yes) {
      this.redbookAvailableText = "Yes";
    }
    else if (value === RedbookAvailableStatus.InProgress) {
      this.redbookAvailableText = "In Progress";
    }
  }

}
