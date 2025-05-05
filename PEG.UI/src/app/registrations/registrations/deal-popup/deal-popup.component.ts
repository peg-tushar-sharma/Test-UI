import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { Registrations } from '../registrations';
import { Common } from '../../../shared/interfaces/common'
import { deals } from '../../../deals/deal'
import { DealRegistrations } from '../../..//deals/dealRegistrations';
import { DealsService } from '../../../deals/deals.service';
import { Router } from '@angular/router';
import { RegistrationService } from '../registration.service'
import { NgForm } from '@angular/forms';
import { DealClient } from '../../../deals/new-deal/deal-clients/dealClient';
import { Partner } from '../../../shared/interfaces/partner';
import { RoleType } from '../../../shared/enums/role-type.enum';
import { Employee } from '../../../shared/interfaces/models';
import { CoreService } from '../../../core/core.service';
import { CommonMethods } from '../../../shared/common/common-methods';
import { CategoryType } from '../../../shared/enums/ga-category.enum';
import { dateTrack } from '../../../deals/new-deal/deal-context/deal-process/dateTracker';
import { GlobalService } from '../../../global/global.service';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { dealMBStatus } from '../../../shared/enums/deal-mbStatus.enum';
import { Priority } from '../../../shared/interfaces/priority';
import { industrSectorSubSector } from '../../../shared/interfaces/industrSectorSubsector';
import { AppInsightWrapper } from '../../../applicationInsight/appInsightWrapper';

@Component({
  selector: 'app-deal-popup',
  templateUrl: './deal-popup.component.html',
  styleUrls: ['./deal-popup.component.scss']
})
export class DealPopupComponent implements OnInit {

  @Input()
  selectedRegistrations: Registrations[];

  @Input()
  type: string;

  @Output()
  public refreshRegistrations: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public resetSelection: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dealService: DealsService, private route: Router,
    private appInsights: AppInsightWrapper, private registrationService: RegistrationService, private coreService: CoreService,
    private globalService: GlobalService, private toastr: PegTostrService) { }

  @ViewChild('dismissButton', { static: true })
  private dismissButton: ElementRef<HTMLElement>;

  @ViewChild('bulkUpdateForm', { static: true })
  private bulkUpdateForm: NgForm;
  isClearOnIndustry: boolean = false;
  sectorsList: any = [];
  targetList: Common[] = [];
  industryList: any;
  locationOfDealList: Common[] = [];
  targetOwnerList: Common[] = [];
  regionList: Common[] = [];
  mbManagerList: Employee[] = [];
  regions: any[] = [];
  selectedDealRegionId = [];
  selectedSectors: any = [];
  selectedTarget: string = '';
  selectedIndustry: any;
  selectedLocationOfDeal: string = '';
  selectedTargetOwner: string[] = [];
  selectedRegion: string[] = [];
  selectedDealRegion: string[] = [];
  employeeCodes: string = '';
  selectedMbManager: string;
  selectedPubliclyTraded: string;
  copyDealInProgress: boolean = false;
  industrySectors:industrSectorSubSector = { industries: [], sectors: [], subSectors: [] };

  newDeal: deals = {
    dealId: 0, targetName: null, targetId: 0, submittedBy: null, clientName: null,
    dealRegistrations: [], createdOn: null, bankRunningProcess: null, bankProcessName: null, currentEBITDA: null, dealSize: null, targetDescription: null,
    isPubliclyKnown: null, nickname: null, notes: null, owner: null, targetCountry: null,
    associatedRegistrations: null, mbAdvisor: null, mbStatus: null, sellSideStatus: null, sector: null, externalProjectName: null,
    visibleTo: null, biddersList: null, dealWinner: null, dealStatus: null, bidDates: null, bidDatesType: null, priorWork: "",
    vddProvider: null, redbookAvailable: 0, industries: [], expertGroup: [{
      dealId: 0,
      expertGroupId: 0,
      expertGroupName: '',
      expertGroupNote: '',
      expertPoolColor: null,
      expertGroupCategory: null,
      experts: [],
      filterState: 0,
    }], clients: [], clientAllocations: [], importantDates: [],
    managedBy: null, dealRegions: [], dealSecurity: [], supportedWinningBidder: null, expertLineupPrepared: false, supportRequested: false,
    expertOnBoard: false, processExpectation: null, transactedTo: null, transactedDate: null, submissionDate: null, sectors: [], subSectors: [], dateOfCall: null, isExpertTrainUpCall: false,
    publiclyTraded: null, attendees: null, sentTo: null, trainers: null, isMasked: false, statusUpdateDate: null
  }

  publiclyTradedList: Common[] = [{
    fieldName: '1',
    fieldValue: 'Yes'
  },
  {
    fieldName: '0',
    fieldValue: 'No'
  }
  ];

  ngOnInit() {
    //this.targetList = [{fieldName:'Target1',fieldValue:'value1'},{fieldName:'Target2',fieldValue:'Value2'},{fieldName:'Target3',fieldValue:'Value3'}];
    this.registrationService.getUsersByRole(RoleType.MultibidderManager)
      .subscribe(res => {
        res.forEach(element => {
          if (element) {
            element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";

          }
        })
        this.mbManagerList = res;
      });

    this.globalService.getIndustrySectors().subscribe(industries => {
      this.industryList = industries.filter(e => e.isTopIndustry == true);
    })
    this.globalService.getAllIndustrySectorsSubSectors().subscribe(industrySectorSubsector => {
      this.industrySectors = industrySectorSubsector;
    });

  }

  onIndustryChange(event) {

    this.sectorsList = [];
    this.selectedSectors=[]

    if (event !== undefined) {
      event.forEach(element => {
        this.isClearOnIndustry = true;

        let list = this.industrySectors.sectors.filter(e => e.industryId == element.industryId);
        this.sectorsList.push(...list);
      });

    }
  }
  assignTopLevelIndustry(industry) {
    //Setting industry object once data is updated so as to update the tagID and other such details
    if (industry) {
      if (this.industryList.some(e => e.industryId == industry.industryId)) {
        industry = this.industryList.find(e => e.industryId == industry.industryId)
      }
    }
    return industry;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedRegistrations.currentValue && this.type == 'copy') {
      if (changes.selectedRegistrations.previousValue != changes.selectedRegistrations.currentValue) {
        this.employeeCodes = '';
        let allIndustries: any = [];
        this.selectedTarget = ''
        this.targetList = new Array();
        this.regions = [{ regionId: 1, regionName: "Asia/Pacific" }, { regionId: 2, regionName: "Americas" }, { regionId: 3, regionName: "EMEA" }];
        changes.selectedRegistrations.currentValue.forEach(entry => {
          if (this.targetList && entry.data.tdn && this.targetList.findIndex(x => x.fieldName == entry.data.tdn) < 0) {
            if (entry.data.tdn != '') {


              let target: Common = this.setValue(entry.data.isMasked ? "REG-" + entry.data.id : entry.data.tdn);
              this.targetList = [...this.targetList, target];
              if (this.selectedTarget == '') {
                this.selectedTarget = target.fieldValue;
              }
            }
          }

          //Checking industry is top level and assigning tagId and other info
          entry.data.in = this.assignTopLevelIndustry(entry.data.in);
          if (this.industryList && entry.data.in && entry.data.in.isTopIndustry) {
            let isExist = allIndustries.filter(industry => industry.industryId == entry.data.in.industryId);
            if (isExist.length == 0) {
              allIndustries.push(entry.data.in);
            }
          }
          //Filling in sectors
          this.sectorsList = [];
          allIndustries.forEach(element => {

            let list = this.industrySectors.sectors.filter(e => e.industryId == element.industryId);
            this.sectorsList = list;
          })

          this.selectedSectors = entry.data.sectors;
          if (this.locationOfDealList && entry.data.lodn && this.locationOfDealList.findIndex(x => x.fieldName == entry.data.lodn) < 0) {
            if (entry.data.lodn != '') {


              let locationOfDeal: Common = this.setValue(entry.data.lodn);
              this.locationOfDealList = [...this.locationOfDealList, locationOfDeal];
              if (this.selectedLocationOfDeal == '') {
                this.selectedLocationOfDeal = locationOfDeal.fieldValue;
              }
            }
          }

          if (this.targetOwnerList && entry.data.cr && this.targetOwnerList.findIndex(x => x.fieldName == entry.data.cr) < 0) {
            if (entry.data.cr != '') {


              let targetOwner: Common = this.setValue(entry.data.cr);
              this.targetOwnerList = [...this.targetOwnerList, targetOwner];
              this.selectedTargetOwner = [...this.selectedTargetOwner, targetOwner.fieldValue];
            }
          }

          if (entry.data.lodr && entry.data.lodr != 0) {
            let name = this.regions.find(x => x.regionId == entry.data.lodr).regionName;
            if (this.regionList && entry.data.lodr && this.regionList.findIndex(x => x.fieldName == name) < 0) {
              if (entry.data.lodr != '') {

                let region: Common = this.setValue(this.regions.find(x => x.regionId == entry.data.lodr).regionName);
                this.regionList = [...this.regionList, region];
                this.selectedDealRegion = [...this.selectedDealRegion, region.fieldValue];
              }
            }
          }

          if (entry.data.sb) {
            //this.employeeCodes = this.employeeCodes + ((this.employeeCodes != '') ? ',' : '') + entry.data.sb.substring(entry.data.sb.indexOf('(') + 1, entry.data.sb.indexOf(')'));
            this.employeeCodes = this.employeeCodes + ((this.employeeCodes != '') ? ',' : '') + entry.data.sb.employeeCode;
          }

          if (this.selectedPubliclyTraded != 'Yes') {
            if (entry.data.pte == true || entry.data.ptd == true) {
              this.selectedPubliclyTraded = 'Yes';
            }
          }


        })

        this.selectedIndustry = allIndustries

      }
      if (this.mbManagerList) {
        if (this.mbManagerList.findIndex(e => e.employeeCode == this.coreService.loggedInUser.employeeCode) > -1) {
          this.selectedMbManager = this.coreService.loggedInUser.employeeCode;
        }

      }
    }

  }

  setValue(data: string) {
    return { fieldName: data, fieldValue: data };
  }

  closeModal() {
    this.copyDealInProgress = false;
    this.bulkUpdateForm.resetForm();
    this.resetObjects();
    this.dismissButton.nativeElement.click();
  }

  @HostListener('document:keydown.escape', ['$event'])
  public beforeClose(element) {
    this.closeModal()
  }

  creatNewMBTracker(isRedirectToTracker: boolean) {
    if (!this.copyDealInProgress) {
      this.copyDealInProgress = true;
      let selectedRegistrationIds = [];
      this.selectedRegistrations.forEach(reg => {
        let nodeData: any = reg;
        selectedRegistrationIds.push(nodeData.data.id);
      })

      this.dealService.getLinkedRegistrations(selectedRegistrationIds).subscribe(res => {
        if (res && res.length > 0) {
          this.toastr.showWarning('The registration id(s)' + res.join(',') + ' already linked.', 'Warning');
          return;
        }
        else {
          this.create(isRedirectToTracker);
        }
      })
    }
  }

  create(isRedirectToTracker: boolean) {
    this.copyDealInProgress = true;
    this.newDeal.targetName = this.selectedTarget;
    this.newDeal.industries = this.selectedIndustry;
    this.newDeal.sectors = this.selectedSectors;
    this.newDeal.managedBy = this.selectedMbManager;
    this.newDeal.publiclyTraded = this.selectedPubliclyTraded == 'Yes' ? true : false;
    let dealClientId: number = 0;
    let dealRegion = [];
    this.selectedRegistrations.forEach((reg: any) => {
      let registration: DealRegistrations = new DealRegistrations();
      let dealClient: DealClient = new DealClient()
      registration.registration = reg.data;

      if (registration.registration.imb || this.selectedRegistrations.length > 1) {
        this.newDeal.mbStatus = dealMBStatus.PotentialMB;
      }

      if ((this.newDeal.mbStatus != dealMBStatus.PotentialMB && registration.registration.isb) || (registration.registration.isSeller)) {
        this.newDeal.mbStatus = dealMBStatus.SingleRegistration;
      }

      this.newDeal.dealRegistrations.push(registration);

      dealClient.client = reg.data.cl;

      dealClient.clientHeads = [];
      let clientHead: any[] = reg.data.chwec != null ? reg.data.chwec.split(';') : reg.data.ch != null ? reg.data.ch : [];
      if (clientHead.length > 0) {
        clientHead.forEach(element => {
          if (element) {
            let partner: Partner = {
              employeeCode: element.employeeCode,
              firstName: element.firstName,
              familiarName: '',
              lastName: element.lastName,
              partnerWorkTypeName: '',
              region: null,
              searchableName: element.searchableName,
              officeAbbreviation: element.officeAbbreviation
            }
            dealClient.clientHeads.push(partner);
          }
        });
      }

      dealClient.clientSectorLeads = [];
      let clientSectorLead: any[] = reg.data.cslwec != null ? reg.data.cslwec.split(';') : reg.data.csl != null ? reg.data.csl : [];
      if (clientSectorLead.length > 0) {
        clientSectorLead.forEach(element => {
          if (element) {
            let partner: Partner = {
              employeeCode: element.employeeCode,
              firstName: element.firstName,
              familiarName: '',
              lastName: element.lastName,
              partnerWorkTypeName: '',
              region: null,
              searchableName: element.searchableName,
              officeAbbreviation: element.officeAbbreviation
            }
            dealClient.clientSectorLeads.push(partner);
          }
        })

      }

      dealClient.othersInvolved = [];
      let othersInvolved: any[] = reg.data.oiwec != null ? reg.data.oiwec.split(';') : reg.data.oi != null ? reg.data.oi : [];
      if (othersInvolved.length > 0) {
        othersInvolved.forEach(element => {
          if (element) {
            let partner: Partner = {
              employeeCode: element.employeeCode,
              firstName: element.firstName,
              familiarName: '',
              lastName: element.lastName,
              partnerWorkTypeName: '',
              region: null,
              searchableName: element.searchableName,
              officeAbbreviation: element.officeAbbreviation
            }

            dealClient.othersInvolved.push(partner);
          }
        })

      }

      dealClient.registrationSubmittedBy = reg.data.sb.employeeCode;
      if (reg.data.sb) {
        dealClient.registrationSubmitterEcode = reg.data.sb.employeeCode;
      }
      dealClient.registrationSubmitterLocation = reg.data.son;
      dealClient.registrationId = reg.data.id;
      dealClient.registrationStatus =  { 
        registrationStatusId: reg.data?.stn?.registrationStatusId, 
        statusTypeName: 
        reg.data?.stn?.statusTypeName, sortOrder: reg.data?.stn?.sortOrder };
      dealClient.stage = { registrationStageId: reg.data.sgTI, stageTypeName: reg.data.sgTN ,dealSortOrder: reg?.data?.dealSortOrder ?? 0};
      dealClient.notes = '';
      dealClient.priority = { priorityId: reg.data.cl.clientPriorityId, priorityName: reg.data.cl.clientPriorityName, sortOrder: (reg.data.cl.clientPrioritySortOrder) ? reg.data.cl.clientPrioritySortOrder : 100 };
      dealClient.priorityId = reg.data.cl.clientPriorityId;
      dealClient.priorityName = reg.data.cl.clientPriorityName;
      dealClient.dealClientId = 0;
      dealClient.registrationSubmissionDate = reg.data.lsd;
      dealClient.callDates = [];
      dealClient.allocationNote = ' ';
      dealClient.isSingleBidder=reg?.data?.isb ?? false;
      dealClient.caseId = reg.data.case ? reg.data.case.caseId : '';
      dealClient.caseCode = reg.data.case ? reg.data.case.caseCode : '';
      dealClient.caseName = reg.data.case ? reg.data.case.caseName : '';
      dealClient.caseStartDate = reg.data.case ? reg.data.case.caseStartDate : '';
      dealClient.caseEndDate = reg.data.case ? reg.data.case.caseEndDate : '';
      dealClient.expectedStart = reg.data.expectedStart;
      dealClient.statusUpdateDate = reg.data.sd ? reg.data.sd : '';
      dealClient.caseOffice = {
        officeCode: reg.data.case ? reg.data.case.caseOffice : '',
        officeAbbr: '',
        officeName: reg.data.case ? reg.data.case.caseOfficeName : '',
        officeCluster: reg.data.case ? reg.data.case.officeCluster : '',
        officeClusterCode:0,
      }
      dealClient.commitmentDate = reg.data.cd,
        dealClient.terminatedDate = reg.data.td,

        dealClient.workType = {
          workTypeId: reg.data.wti,
          workTypeName: reg.data.wtn
        }
      dealClient.clientOrder = this.getClientOrder(reg.data.sgTI);
      dealClient.projectName = reg.data.pn;

      if (this.coreService.loggedInUserRoleId == RoleType.MultibidderManager || this.coreService.loggedInUserRoleId == RoleType.PEGAdministrator || this.coreService.loggedInUserRoleId == RoleType.TSGSupport) {
        if (reg.data.isMasked) {
          this.newDeal.isMasked = true;
        }
      }

      //dealClientId = dealClientId + 1;
      this.newDeal.clients.push(dealClient);
      if (dealRegion.indexOf(reg.data.lodr) == -1) {
        dealRegion.push(reg.data.lodr);
      }

    });

    this.newDeal.clients = this.newDeal.clients.sort((a, b) => { return a.clientOrder - b.clientOrder });

    let clients = this.newDeal.clients.sort((a, b) => {
      return CommonMethods.sortCllients((a.stage) ? a.stage.registrationStageId : 0, a, b);
    });

    this.newDeal.clients = clients.sort((a, b) => { return a.clientOrder - b.clientOrder });
    this.newDeal.clients = this.newDeal.clients.sort((a, b) => { return a.registrationStatus?.sortOrder - b.registrationStatus?.sortOrder });

    if (this.selectedDealRegion.length > 0) {
      this.selectedDealRegion.forEach(value => {
        this.selectedDealRegionId.push(this.regions.find(x => x.regionName == value).regionId);
      })
    }

    this.newDeal.owner = this.selectedTargetOwner.join(',');
    this.newDeal.targetCountry = this.selectedLocationOfDeal;
    this.newDeal.dealRegions = this.selectedDealRegionId;
    this.newDeal.isExpertTrainUpCall = false;

    // To get the client priority from basis
    let clientNames: any = this.newDeal.clients.map(client => client.client.clientName);
    clientNames = clientNames.join(',');
    let basisClientId: any = this.newDeal.clients.map(client => client.client.basisClientId);
    basisClientId = basisClientId.join(',');
    this.registrationService.getClientPriority(clientNames, basisClientId).subscribe(clientPriority => {
      // Update the client priority with basis
      if (clientPriority) {
        this.newDeal.clients.forEach(element => {
          let clp: Priority[] = clientPriority.filter(data => data.clientName.toLowerCase() == element.client.clientName.toLowerCase() || data.clientId == element.client.basisClientId);
          if (clp && clp.length > 0) {
            let cp = clp[0];
            element.priority = { priorityId: cp.priorityId, priorityName: cp.priorityName, sortOrder: (cp.sortOrder) ? cp.sortOrder : 100 };
            element.priorityId = cp.priorityId.toString();
            element.priorityName = cp.priorityName;
          } else {
            element.priority = { priorityId: 0, priorityName: '', sortOrder: 100 };;
            element.priorityId = '';
            element.priorityName = '';
          }
        });
      }
     
      this.createNewTrackerAndClose(isRedirectToTracker);
     

    })
  }

  getClientOrder(registrationStageId) {
    if (registrationStageId) {
      switch (registrationStageId) {
        case 1:
          return 4;
        case 2:
          return 3;
        case 3:
          return 5;
        case 4:
          return 1;
        case 5:
          return 2;
        default:
          return 100
      }
    }
  }

  resetObjects() {
    this.selectedRegistrations = [];
    this.targetList = [];
    this.locationOfDealList = [];
    this.regionList = [];
    this.targetOwnerList = [];
    this.selectedTarget = '';
    this.selectedIndustry = [];
    this.selectedSectors = [];
    this.selectedLocationOfDeal = '';
    this.selectedRegion = [];
    this.selectedTargetOwner = [];
    this.selectedDealRegionId = [];
    this.selectedDealRegion = [];
    this.newDeal = this.getDealObject();
  }

  redirectToTracker(dealId) {
    this.dismissButton.nativeElement.click();
    const url = this.route.serializeUrl(
      this.route.createUrlTree([`/deals/deal/`+dealId])
    );
    localStorage.setItem("registrationdata-0", CommonMethods.encryptData(JSON.stringify(this.newDeal)));
    this.dealService.multipleRegToDeal.next(this.newDeal);
    this.dealService.multipleRegToDeal.isStopped = false;
    this.dealService.editDeal.next(this.newDeal);
    this.bulkUpdateForm.resetForm();
    this.resetObjects();
    this.resetSelection.emit();
    this.copyDealInProgress = false;
    this.dismissButton.nativeElement.click();
    window.open(url, '_blank');
  }



  //Create new MB tracker from registration without redirectng to the tracker page 
  createNewTrackerAndClose(isRedirectToTracker:boolean) {
    let inputDeal = this.newDeal;
    inputDeal.industries = this.selectedIndustry;
    inputDeal.sectors = this.selectedSectors;
    inputDeal.clients = inputDeal.clients.filter(item => item.client.clientName != null && item.client.clientName != undefined && item.client.clientName.trim() != '');
    inputDeal.submittedBy = CommonMethods.getLoggedInEmployee(this.coreService.loggedInUser);
    if (inputDeal != null && inputDeal != undefined && inputDeal.hasOwnProperty('jsdate')) {
      inputDeal.transactedDate = CommonMethods.convertDatetoUTC(this.newDeal.transactedDate.jsdate);
      inputDeal.transactedDate = this.newDeal.transactedDate.utc;
    }
    let tempImportantDatesList: dateTrack[] = [];
    inputDeal.visibleTo = [].join(',');
    inputDeal.dealStatus = 2;
    inputDeal.importantDates = tempImportantDatesList;
    inputDeal.expertLineupPrepared = false;
    inputDeal.sellSideStatus = 1;

    this.dealService.createNewTrackerFromCopy(inputDeal).subscribe(res => {
      this.refreshRegistrations.emit(res);
      if(isRedirectToTracker){
        this.redirectToTracker(res?.dealId);
      }
      this.closeModal();
      
      this.appInsights.logEvent(`${CategoryType.ExpertiseTracker} - Save and close from copy  - Tracker Id: ${res.dealId}`);
    });
  }

  getDealObject(): deals {
    let deals: deals;
    deals = {
      dealId: 0, targetName: null, targetId: 0, submittedBy: null, clientName: null,
      dealRegistrations: [], createdOn: null, bankRunningProcess: null, bankProcessName: null, currentEBITDA: null, dealSize: null, targetDescription: null,
      isPubliclyKnown: null, nickname: null, notes: null, owner: null, targetCountry: null,
      associatedRegistrations: null, mbAdvisor: null, mbStatus: null, sellSideStatus: null, sector: null, externalProjectName: null,
      visibleTo: null, biddersList: null, dealWinner: null, dealStatus: null, bidDates: null, bidDatesType: null, priorWork: "",
      vddProvider: null, redbookAvailable: 0, industries: [], expertGroup: [{
        dealId: 0,
        expertGroupId: 0,
        expertGroupName: '',
        expertGroupNote: '',
        expertPoolColor: null,
        expertGroupCategory: null,
        experts: [],
        filterState: 0,
      }], clients: [], clientAllocations: [], importantDates: [],
      managedBy: null, dealRegions: [], dealSecurity: [], supportedWinningBidder: null, expertLineupPrepared: false, supportRequested: false,
      expertOnBoard: false, processExpectation: null, transactedTo: null, transactedDate: null, submissionDate: null, sectors: [], subSectors: [], dateOfCall: null, isExpertTrainUpCall: false,
      publiclyTraded: null, attendees: null, sentTo: null, trainers: null, isMasked: false, statusUpdateDate: null
    }
    return deals;
  }

}