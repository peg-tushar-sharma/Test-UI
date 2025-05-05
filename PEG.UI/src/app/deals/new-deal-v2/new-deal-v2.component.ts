import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, forkJoin, Subject } from 'rxjs';
import { CommonMethods } from '../../shared/common/common-methods';
import { deals, visibleToHighlights } from '../deal';
import { DealsService } from './../deals.service';
import { LocationOfDeal } from '../../shared/interfaces/LocationOfDeal';
import { NewRegistrationService } from '../../registrations/new-registration/new-registration.service';
import { CoreService } from '../../../app/core/core.service';
import { Router } from '@angular/router';
import { RoleType } from './../../shared/enums/role-type.enum';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { dealStatus, MBStatus, SellSideStatus } from '../../shared/interfaces/dealStatus';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { Employee } from '../../shared/interfaces/models';
import { dateTrack } from '../new-deal/deal-context/deal-process/dateTracker';
import { RegistrationService } from '../../registrations/registrations/registration.service'
import { ActivatedRoute } from '@angular/router';
import { DealSecurityService } from '../deal.security.service';
import { DealSecurity } from '../../shared/interfaces/dealSecurity';
import { DealAuth } from '../../shared/common/dealAuth';
import { ComponentCanDeactivate } from "../../security/pending-changes.guard";
import * as moment from 'moment';
import { CategoryType } from '../../shared/enums/ga-category.enum';
import { cloneDeep, uniqBy } from 'lodash'
import { GlobalService } from '../../global/global.service';
import { transform, isEqual, isObject } from "lodash/fp";
import { RegistrationStageEnum } from '../../shared/enums/registration-stage.enum';
import { PagesTypes } from '../../shared/enums/page-type.enum';
import { AppSession } from '../../shared/class/appSession';
import { EMPLOYEE_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE } from '../../shared/common/constants'
import { LEVEL_STATUS_CODE } from '../../shared/common/constants'
import { RegistrationStatus } from '../../shared/enums/registration-status.enum';
import { Title } from "@angular/platform-browser";
import { dealMBStatus } from '../../shared/enums/deal-mbStatus.enum';
import { RedbookAvailableStatus } from '../../shared/enums/rebookAvailable-status.enum';
import { TrackerStatus } from '../../shared/enums/trackerStatus.enum';
import { DealTracker } from '../dealTracker';
import { PegTostrService } from '../../core/peg-tostr.service';
import { DealClient } from '../new-deal/deal-clients/dealClient';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppInsightWrapper } from '../../applicationInsight/appInsightWrapper';
import { DealOpsEmailBox } from '../../shared/enums/dealOpsEmailBox.enum';
import { Region } from '../../shared/enums/region';
import { expertGroup } from '../new-deal/deal-experts/expertGroup';
import { EmailTemplateType } from '../../shared/enums/emailTemplateType.enum';
import { EmailService } from '../../shared/mail/email.service';
import { industrSectorSubSector } from '../../shared/interfaces/industrSectorSubsector';

@Component({
  selector: 'app-new-deal-v2',
  templateUrl: './new-deal-v2.component.html',
  styleUrls: ['./new-deal-v2.component.scss']
})

export class NewDealV2Component implements OnInit, OnDestroy, ComponentCanDeactivate, AfterViewInit {
  defaultTabState: any = { context: false, experts: false, clients: false, allocation: false, security: false }

  toggleTabs: any = { context: false, experts: false, clients: true, allocation: false, security: false, strategy: false }

  activeTab: any;
  currentTab: string;
  activeUsers: Employee[] = [];
  activeUserName: string = '';
  trackerStatus: boolean = false;
  dealFromRegistration: any;
  redbookAvailable: number = 0;
  isDealNews: boolean = false;
  redbookAvailableText: string = "";
  redbookContainerName: string = 'redbookAvailableHeader';
  isAdmin: boolean = false;
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.trackerStatus && !this.dealSecurityService.isReadOnlyMode) {
      return false;
    }
    else {
      return true;
    }
  }
  modalRef?: BsModalRef;
  modalRefDelete?: BsModalRef;
  @ViewChild('staticTabs', { static: true }) staticTabs: TabsetComponent;

  @ViewChild('form', { static: true })

  private form: NgForm;
  toggleAllocationTab: boolean = false;
  toggleSecurityTab: boolean = false;
  dealId: number = 0;
  @ViewChild('targetTemplate', { read: TemplateRef }) addDealTrackerTemplate: TemplateRef<any>;

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
  sellSideStatus: any[];
  industrySectors:industrSectorSubSector = { industries: [], sectors: [], subSectors: [] };
  taggedPeople: Array<any>;
  currentTaggedPeople: Array<any>;
  isInvalidForm: boolean = false;
  isInvalidDate: boolean = false;
  totalRegistration: number = 0;
  dealStatus: dealStatus[];
  selectedStatus: dealStatus;
  selectedMBStatus: MBStatus;
  selectedSellSideStatus: SellSideStatus;
  managedByRegion: any;
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
  refreshImportantDates:boolean=false;
  // New independent object based on sections
  dealTracker: DealTracker = new DealTracker();
  dealClient: DealClient;
  isOpenMailPopup: boolean = false;

  constructor(private dealService: DealsService, private newRegistrationService: NewRegistrationService, public _appInsight: AppInsightWrapper,
    private toastr: PegTostrService,
    private titleService: Title, private emailService: EmailService,
    private coreService: CoreService, private router: Router, private route: ActivatedRoute, private globalService: GlobalService,
    private registrationService: RegistrationService, public dealSecurityService: DealSecurityService, private modalService: BsModalService) {
    if (this.coreService.loggedInUserRoleId == RoleType.PEGAdministrator) {
      this.isAdmin = false;
    }
    else {
      this.isAdmin = false;
    }
    let dealId = 0
    if (this.route != undefined && this.route.params != undefined) {
      this.route.params.subscribe(data => {
        if (data != undefined && data.hasOwnProperty('dealid') && data.dealid > 0) {
          if (data.hasOwnProperty('mailclients') && data.mailclients == 'true') {
            this.isOpenMailPopup = true;
          }
          let decodedDealId = CommonMethods.decodeData(data.dealid);
          this.dealService.getPAMAccessOnDealTracker(parseInt(decodedDealId)).subscribe(res => {
            if (res) {
              dealId = parseInt(decodedDealId);
            } else {
              this.router.navigate(['/invalidaccesscomponent']);
            }
          })

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
      this._appInsight.logEvent(`${CategoryType.ExpertiseTracker} - Add registration to tracker -  ${this.deal.dealId}`);
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

  customManagedBySearch(term: string, item: Employee) {
    term = term.toLocaleLowerCase();
    return item.employeeCode.toLocaleLowerCase().indexOf(term) > -1
      || item.firstName.toLocaleLowerCase().indexOf(term) > -1
      || item.lastName.toLocaleLowerCase().indexOf(term) > -1
      || (item.officeAbbreviation && item.officeAbbreviation.toLocaleLowerCase().indexOf(term) > -1);
  }

  updateDealRegistrations(registrationId: any) {
    if (registrationId) {
      let updatedDealRegistratrions = this.deal.dealRegistrations.filter(a => a.registration.id != registrationId);
      this.deal.dealRegistrations = updatedDealRegistratrions;
    }
    this.setMBHighlights();
    this.setMBStatus();
    this.setSellSideStatus();
  }

  setMBStatus() {
    if (this.mbStatus && this.mbStatus.length > 0 && this.dealTracker.mbStatus) {
      let mbStatus: MBStatus = this.mbStatus.filter(mbStatus => mbStatus.mbStatusId == this.dealTracker.mbStatus)[0];
      this.selectedMBStatus = mbStatus;
    }
  }

  setSellSideStatus() {
    if (this.sellSideStatus && this.sellSideStatus.length > 0 && this.dealTracker.sellSideStatus) {
      let sellSideStatus: SellSideStatus = this.sellSideStatus.filter(sellSideStatus => sellSideStatus.sellSideStatusId == this.dealTracker.sellSideStatus)[0];
      this.selectedSellSideStatus = sellSideStatus;
    }
  }
  closeCreateNewDealModal() {
    this.router.navigate(['/deals']);
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

  setTrackerMode(value) {
    this.dealSecurityService.isReadOnlyMode = value;
    this.dealSecurityService.getDealAuthorization(this.dealId).subscribe(res => {
      this.dealAuthorization = res;
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

    if (this.selectedStatus == undefined || this.selectedStatus == null) {
      let ComingtoMarket: dealStatus = { dealStatusId: 1, dealStatusName: 'Coming to Market' };
      this.selectedStatus = ComingtoMarket;
      this.deal.dealStatus = 1;
    }

    this.deviceInfo = CommonMethods.deviceInfo();
    this.initDataServices()
      .subscribe((([dealSecurity, industryItem, taggedPeopleItem, dealStatusItem, locationOfDealItem, regionItem, mbManagers, mbStatus, sellSideStatus, defaultDealSecurity]) => {
        this.industrySectors = industryItem
        this.industries = industryItem.industries;
        this.dealAuthorization = dealSecurity;
        this.getUserAuthorization();
        this.taggedPeople = taggedPeopleItem.value;
        this.currentTaggedPeople = this.taggedPeople;
        this.setVisibleTo();
        this.dealStatus = dealStatusItem;
        this.locationOfDeal = locationOfDealItem;
        this.regions = regionItem;
        this.mbStatus = mbStatus;
        this.sellSideStatus = sellSideStatus;

        if (this.dealTracker.industries != undefined && this.dealTracker.industries.length > 0) {
          let tpIndustries = [];
          this.dealTracker.industries.forEach((res: any) => {
            let industryName = res.hasOwnProperty('industryName') ? res.industryName : res.toString().trim();
            let t = this.industries.find(e => e.industryName.toString().trim() == industryName);
            if (t != undefined) {
              tpIndustries.push(t);
            }
          })
          this.dealTracker.industries = JSON.parse(JSON.stringify(tpIndustries));
          if (this.dealTracker.dealId == undefined || this.dealTracker.dealId <= 0) {
            this.renderIndustryList();
          }
        }

        //Get Deal tracker by id
        if (this.dealId > 0) {
          this.dealService.getDealTrackerById(this.dealId.toString()).subscribe(dealTracker => {
            this.dealTracker = dealTracker
            this.managedByRegion = mbManagers.find(x => x.employeeCode == this.dealTracker.managedBy)?.regionId;

            this.setMBStatus();
            this.setAssetStatus();
            this.setSellSideStatus();
            this.isDealNews = this.dealTracker.isDealNews;

            this.dealService.getMBStrategyById(this.dealTracker.dealId).subscribe((dealTracker) => {
              if (dealTracker != null) {
                this.dealTracker.clients = dealTracker.clients;
                this.dealClient = dealTracker.clients;
              }
            })

            this.dealService.getDealCapabilitiesById(this.dealId.toString()).subscribe(dealCapabilities => {
              this.dealTracker.industries = dealCapabilities.industries;
              this.dealTracker.sectors = dealCapabilities.sectors;
              this.dealTracker.subSectors = dealCapabilities.subSectors;
              this.renderIndustryList();
            })

            let dStatus = this.dealStatus.find(res => res.dealStatusId === this.dealTracker.dealStatus);
            if (dStatus != undefined && dStatus != null) {
              this.selectedStatus = dStatus;
            }

            //Showing Deal Advisor
            let mbData = this.dealTracker.mbAdvisors;
            mbData.forEach(element => {
              element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
            });
            this.selectedMBAdvisor = mbData;
            this.setRedbookAvailable(this.dealTracker.redbookAvailable);

          })
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


        // this.deal.dealSecurity = defaultDealSecurity;

        // //Setting region while copy to tracker
        // let dealRegion: any = [];
        // Object.assign(dealRegion, this.deal.dealRegions);
        // if (this.regions && this.regions.length > 0) {
        //   this.deal.dealRegions = [];
        //   dealRegion.forEach(value => {
        //     if (this.regions.some(x => x.regionId == value)) {
        //       this.deal.dealRegions.push(this.regions.find(x => x.regionId == value).regionId);
        //     }
        //   })
        // }

        // this.updateCurrentDealObject(this.deal);
        // if (this.dealService.isFromRegistration) {
        //   this.replacePointOfContact();
        // }

        // if (!this.dealId) {
        //   this.isDealAvailable = true;
        // }

        // if (this.dealId != undefined && this.dealId != null && this.dealId > 0) {
        //   this.getDealById();
        // }
        // else if (!this.dealService.isFromRegistration) {
        //   this.dealService.dealBackup = cloneDeep(this.deal);
        // }
        // else {
        //   this.dealService.isFromRegistration = false;
        // }

      }));

    this.selectTab('strategy');
    this._appInsight.logEvent("Deal Tracker loaded for " + this.coreService.loggedInUser.employeeCode + " DealID: " + this.dealId);

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
      this._appInsight.logEvent(`${CategoryType.MBExpertTabChange} -switch tab - tabName - ${currentTab}`);
      //this.sortDealClients();
    } else if (currentTab == 'clients') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.clients = true;
      this.dealService.switchTab.next('clients');
      //this.sortDealClients();
      this._appInsight.logEvent(`${CategoryType.MBExpertTabChange} -switch tab - tabName - ${currentTab}`);
    } else if (currentTab == 'experts') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.experts = true;
      this.dealService.switchTab.next('experts');
      this._appInsight.logEvent(`${CategoryType.MBExpertTabChange} -switch tab - tabName - ${currentTab}`);
      if (this.deal.expertGroup) {
        this.deal.expertGroup.sort((a, b) =>
          (a.expertGroupName.toLowerCase() > b.expertGroupName.toLowerCase()) ? 1
            : ((a.expertGroupName.toLowerCase() < b.expertGroupName.toLowerCase()) ? -1 : 0));
      }
    }
    else if (currentTab == 'context') {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
      this.toggleTabs.context = true;
    }
    else {
      this.toggleTabs = JSON.parse(JSON.stringify(this.defaultTabState))
    }
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
      this.globalService.getSellSideStatus(),
      this.dealSecurityService.getDealAccessInformation()
    );
  }

  renderIndustryList() {
    if (this.dealTracker.industries != undefined && this.dealTracker.industries.length > 0) {
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
            }
            deal.appSession.forEach(appSession => {
              this.activeUsers.push(appSession.employee);
            })
            this.activeUserName = CommonMethods.getEmployeeNames(this.activeUsers, ';')
          }

          this.updateDealToObject(deal);
          this.navigateToTabs();
          //Adding Registration to existing Deal tracker
          this.dealService.AddRegistrationToDeal.subscribe((r: any) => {
            if (r != null && r != undefined && this.staticTabs.tabs != undefined && this.staticTabs.tabs.length > 0) {
              //Navigate to client tab
              //this.sortDealClients();
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
              //this.replacePointOfContact();
            }
          });

          if (this.dealService.isFromRegistration) {
            if (this.dealFromRegistration != null && this.dealFromRegistration != undefined && this.staticTabs.tabs != undefined && this.staticTabs.tabs.length > 0) {
              //Navigate to client tab
              //this.sortDealClients();
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

              this.setAssetStatus();

              //Replace point of contact by submittedBy name if null
              //this.replacePointOfContact();
            }

          }

          this.setMBHighlights();
          this.dealService.AddRegistrationToDeal.next(undefined);
          this.dealService.editDeal.next(this.deal);
          if (!this.dealService.isFromRegistration) {
            //this.sortDealClients();
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

  setAssetStatus() {
    if (this.dealTracker && this.dealTracker.dealStatus && this.dealTracker.dealStatus == TrackerStatus.Cold) {
      let Active: dealStatus = { dealStatusId: TrackerStatus.Active, dealStatusName: 'Active' };
      this.selectedStatus = Active;
    }
  }

  updateDealToObject(deal: deals) {
    this.deal = deal;
    //this.renderDateTrack();
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
    let sellSideStatus = this.sellSideStatus.find(res => res.sellSideStatus === this.deal.sellSideStatus);

    if (dStatus != undefined && dStatus != null) {
      this.selectedStatus = dStatus;
    }
    else {
      this.deal.dealStatus = 1;
    }
    if (mbStatus != undefined && mbStatus != null) {
      this.selectedMBStatus = mbStatus;
    }
    if (this.sellSideStatus != undefined && this.sellSideStatus != null) {
      this.selectedSellSideStatus = sellSideStatus;
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
  }

  updateCurrentDealObject(deal) {
    if (this.form.controls) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.controls[key].setValue(deal[key]);
      });
    }
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
      this.onFormValueChanged('capabilities', '');
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
    this.setTrackerMode(false);
  }

  resetModal() {
    // //setting hierachary while editing
    this.sectorsSubSector = [];
    this.sectorsList = [];
    let tempSectors = [];
    let tempSubSectors = [];

    this.dealTracker.industries.forEach(currInd => {
      tempSectors = tempSectors.concat(this.industrySectors.sectors.filter(e => e.industryId == currInd['industryId']))
    });
    this.sectorsList = tempSectors;

    let sectorModel = [];
    this.dealTracker.sectors.forEach(currInd => {
      if (this.sectorsList.some(r => r.sectorId == currInd['sectorId'])) {
        sectorModel.push(currInd);
      }
    });
    this.deal.sectors = sectorModel;

    //Setting up subsector list
    this.dealTracker.sectors.forEach(currInd => {
      tempSubSectors = tempSubSectors.concat(this.industrySectors.subSectors.filter(e => e.sectorId == currInd['sectorId']))
    });
    this.subSectorsList = tempSubSectors;

    let subSectorModel = [];
    this.dealTracker.subSectors.forEach(currInd => {
      if (this.subSectorsList.some(r => r.subSectorId == currInd['subSectorId'])) {
        subSectorModel.push(currInd);
      }
    });
    this.dealTracker.subSectors = subSectorModel;

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
        if (tp != undefined) {
          this.subSectorsList = this.subSectorsList.concat(tp);
        }
      })
      this.onFormValueChanged('capabilities', '')
    }
  }

  onSubSectorChange(event) {
    if (event != undefined) {
      this.onFormValueChanged('capabilities', '')
    }
  }

  onIndustryClear() {
    this.resetModal();
  }

  onSectorClear() {
    this.resetModal();
  }

  onMbAdvisorChange() {
    if (this.selectedMBAdvisor && this.selectedMBAdvisor.length > 0) {
      this.dealTracker.mbAdvisors = this.selectedMBAdvisor;
    } else {
      this.dealTracker.mbAdvisors = [];
    }
    this.onFormValueChanged('mbAdvisor', this.selectedMBAdvisor);
  }

  onManagedByChange(event) {
    if (event != undefined && event != null && event != '') {
      this.managedByRegion = event.regionId;
    }
    else {
      this.managedByRegion = 0;
    }

    this.onFormValueChanged('managedBy', '');
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

  routeBack() {
    this.dealService.setDealId(undefined);
    this.router.navigate(['/deals']);
  }

  openTaggedPeople() {
    this.tpDeal = JSON.parse(JSON.stringify(this.deal));
    document.getElementById('TagPeople').click();
  }

  outTaggedPeople() {
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
    this.dealSecurityService.isReadOnlyMode = true;
    this.dealService.setDealId(undefined);
    this.deal = new deals();
    this.dealService.editDeal.next(null);
    this.dealService.multipleRegToDeal.next(null)
    this.dealService.AddRegistrationToDeal.next(null)
    this.titleService.setTitle(`M&A Conflicts`);
    this.removeCurrentSession();
    CommonMethods.deleteCookie("trackerTab" + this.dealId);
    if (this.modalRef) {
      this.modalRef.hide();
    }

  }
  removeCurrentSession() {
    var appSession: AppSession = new AppSession();
    appSession.appSessionId = 0;
    appSession.pageId = PagesTypes.Deal;
    appSession.pageReferenceId = this.dealId;

    let employee = { employeeCode: this.coreService.loggedInUser.employeeCode };
    appSession.employee = employee;
    this.dealService.deleteAppSession(appSession).subscribe(() => {
    })
  }

  selectStatus(item) {
    this.selectedStatus = item
    this.deal.dealStatus = item == undefined ? 1 : item.dealStatusId; // set default to 1st status
    this.dealTracker.dealStatus = item == undefined ? 1 : item.dealStatusId; // set default to 1st status
    this.onFormValueChanged('dealStatus', '');
    if (item != undefined && item.dealStatusId == TrackerStatus.Transacted) {
      this.dealService.updateClientStage.next(item);
    }
  }
  updateAssetStatus() {
    if (this.dealTracker && this.dealTracker.dealStatus && this.dealTracker.dealStatus == TrackerStatus.Cold) {
      let Active: dealStatus = { dealStatusId: TrackerStatus.Active, dealStatusName: 'Active' };
      this.selectedStatus = Active;
      this.selectStatus(this.selectedStatus);
    }

  }
  selectMBStatus(item) {
    if (item?.mbStatusId != this.selectedMBStatus?.mbStatusId) {
      this.selectedMBStatus = item
      this.deal.mbStatus = this.selectedMBStatus == undefined ? 0 : this.selectedMBStatus.mbStatusId;
      this.dealTracker.mbStatus = this.selectedMBStatus == undefined ? 0 : this.selectedMBStatus.mbStatusId;
      this.onFormValueChanged('MBStatus', '');
    }
  }

  selectSellSideStatus(item) {
    if (item?.sellSideStatusId != this.selectedSellSideStatus?.sellSideStatusId) {
      this.selectedSellSideStatus = item
      this.deal.sellSideStatus = this.selectedSellSideStatus == undefined ? 0 : this.selectedSellSideStatus.sellSideStatusId;
      this.dealTracker.sellSideStatus = this.selectedSellSideStatus == undefined ? 0 : this.selectedSellSideStatus.sellSideStatusId;
      this.onFormValueChanged('SellSideStatus', '');
    }
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
        this._appInsight.logEvent(`${CategoryType.ExpertiseTracker} - SecurityTabs - ${visibleTabs}`);
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
      }
    }
  }

  getUserAuthorization(): any {
    this.registrationService.getUserAuthorization()
      .subscribe(userRoleField => {
        this.registrationService.roleFieldValues = userRoleField;
      });
  }

  redbookChange(event) {
    this.deal.redbookAvailable = (event != undefined && event != null) ? event : 2;
    this.setRedbookAvailable(event);
    this.dealTracker.redbookAvailable = (event != undefined && event != null) ? event : 2;
    this.onFormValueChanged('redbookAvailable', '');
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

  // This will call the API on change of any data
  onFormValueChanged(fieldName: string, value) {
    this.dealTracker.dealId = this.dealId;
    switch (fieldName) {
      default:
        fieldName = fieldName.charAt(0).toUpperCase() + fieldName.substring(1);
        this.dealService.upsertDealTracker(this.dealTracker, fieldName).subscribe(trackerDetails => {
          if (trackerDetails && trackerDetails.dealId) {
            this._appInsight.logEvent("Deal Tracker saved for " + this.coreService.loggedInUser.employeeCode + " DealID: " + trackerDetails.dealId + " FieldName: " + fieldName);

            let tostrMessage = "Deal Updated Successfully.";
            this.toastr.showSuccess(tostrMessage, "Confirmation");
            this.router.navigate(['/deals/deal/' + trackerDetails.dealId]);
            this.dealTracker.dealId = trackerDetails.dealId;

            if(fieldName == 'importantDates'){
              this.dealTracker.importantDates = trackerDetails.importantDates;
              this.refreshImportantDates = ! this.refreshImportantDates;
            }
            
          }

        })
        break;
    }
  }

  createDealTracker(fieldName: string, value) {
    this.modalRef.hide();
    this.onFormValueChanged(fieldName, value);
  }

  // This will get any changed event from the tabs
  dataFromTabs(event) {
    this.dealTracker = event;
    this.onFormValueChanged(event?.fieldName, '');
  }

  updateMBStatus(mbStatusId) {
    let mbStatus = this.mbStatus.find(mbStatus => mbStatus.mbStatusId == mbStatusId)
    if (mbStatus && this.dealTracker.mbStatus != dealMBStatus.ActiveMB) {
      this.selectMBStatus(mbStatus);
    }
  }
  updateSellSideStatus(sellSideStatusId) {
    let sellSideStatus = this.sellSideStatus.find(sellSideStatus => sellSideStatus.sellSideStatusId == sellSideStatusId)
    if (sellSideStatus) {
      this.selectSellSideStatus(sellSideStatus);
    }
  }

  // When user presses enter, start a new line
  onEnterKeyPress(event) {
    event.stopPropagation();

  }

  updateDealTracker(dealTrackerClient) {
    this.dealTracker.clients = dealTrackerClient;
  }
  openModel() {

    const initialState = {
      title: "Add Deal Tracker"
    };
    this.modalRef = this.modalService.show(this.addDealTrackerTemplate, {
      initialState,
      class: "modal-dialog-centered",
      backdrop: "static",
      keyboard: false
    });
  }
  ngAfterViewInit() {
    if (this.dealId == 0) {
      this.openModel();
    }
  }
  onDealNewsChange(value) {
    this.isDealNews = value;
    this.dealTracker.isDealNews = value;
    this.onFormValueChanged('isDealNews', '');
  }
  openExpertiseRequestEmail(expertPool: expertGroup) {
    let isPublic = this.dealTracker.publiclyTraded;
    let templateType = isPublic ? EmailTemplateType.ExpertiseRequest_Public : EmailTemplateType.ExpertiseRequest_NonPublic;
    this.emailService.getEmailTemplate(templateType).subscribe((template) => {
      if (template) {

        let regionName = "";
        let recipientTo = "";
        let poolName = expertPool?.expertGroupName ?? "";
        let targetName = this.dealTracker?.targetName ?? "";
        let firstName = this.coreService?.loggedInUser?.firstName ?? "";
        let body = template.body ?? "";
        let subject = template.subject ?? "";
        let recipientBCC = expertPool?.experts?.length > 0 ?
          expertPool?.experts.filter((expert) => (expert?.internetAddress ?? "") != "")
            .map((expert) => expert.internetAddress).join(";")
          : "";

        switch (this.coreService.loggedInUser.employeeRegionId) {
          case Region.EMEA:
            regionName = "EMEA";
            recipientTo = DealOpsEmailBox.EMEAPEGDealOps;
            break;
          case Region.Americas:
            regionName = "Americas";
            recipientTo = DealOpsEmailBox.AMERPEGDealOps
            break;
        }

        body = body.replace("#RegionName#", regionName);
        body = body.replace("#PoolName#", poolName);
        body = body.replace("#TargetName#", targetName);
        body = body.replace("#FirstName#", firstName);

        //Mail open 
        const handleCopy = CommonMethods.copyToClipboard("<div>" + body + "</div>")
        let mailText = "mailto:" + recipientTo + "?subject=" + subject + (recipientBCC != "" ? "&bcc=" + recipientBCC : "")
          + "&body=" + "Note: Press Ctrl+V to paste the copied data"; // add the links to body
        window.open(mailText, "_blank");
      }
    });
  }

}
