import { Component, OnInit, Input, SimpleChange, SimpleChanges, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { Registrations } from '../registrations';

import { deals } from '../../../deals/deal'
import { DealRegistrations } from '../../..//deals/dealRegistrations';
import { DealsService } from '../../../deals/deals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../registration.service'
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { DealClient } from '../../../deals/new-deal/deal-clients/dealClient';
import { Partner } from '../../../shared/interfaces/partner';
import { Subject } from 'rxjs';
import { PartnerType } from '../../../shared/enums/partner-type.enum';
import { CommonMethods } from '../../../shared/common/common-methods';
import { WorkType } from '../../../registrations/new-registration/workType';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { Priority } from '../../../shared/interfaces/priority';
import { TrackerStatus } from '../../../shared/enums/trackerStatus.enum';

@Component({
  selector: 'app-add-registrations-to-deal-popup',
  templateUrl: './add-registrations-to-deal-popup.component.html',
  styleUrls: ['./add-registrations-to-deal-popup.component.scss']
})
export class AddRegistrationsToDealPopupComponent implements OnInit {
  dealTypeAhead = new Subject<string>();
  dealList: any[] = [];
  dealload = false;
  selectedDeal: number;
  saveInProgress: boolean = false;
  transacted = TrackerStatus.Transacted;
  @Output()
  public updatedRegistrations: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public resetSelection: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  selectedRegistrations: Registrations[];


  constructor(private dealService: DealsService, private route: Router, private registrationService: RegistrationService, private toastr: PegTostrService) {
    this.dealTypeAhead.pipe(
      tap(() => { this.dealload = true; this.dealList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getDealsByName(term)),
      tap(() => this.dealload = false)
    ).subscribe(items => {
      this.dealList = items;
      this.dealList = this.dealList.map(obj => ({ ...obj, disabled: (obj.appSessionId || obj.dealStatusId == this.transacted) ? true : false }))
    });

  }

  @ViewChild('dismissButton', { static: true })
  private dismissButton: ElementRef<HTMLElement>;

  @ViewChild('bulkUpdateForm', { static: true })
  private bulkUpdateForm: NgForm;


  ngOnInit() {

  }
  clearItems() {
    // this.selectedDeal = null;
    this.dealList = [];
    // this.bulkUpdateForm.reset();
  }


  closeModal() {
    this.saveInProgress = false;
    this.bulkUpdateForm.resetForm();
    this.dismissButton.nativeElement.click();
  }
  saveToTracker(goToTracker:boolean) {
    if (!this.saveInProgress) {
      this.saveInProgress = true;
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
          this.save(goToTracker);
        }
      })
    }
  }

 
  GoToMBTracker() {
    this.dealService.setDealId(this.selectedDeal);
    let dealId = this.selectedDeal;
    this.dismissButton.nativeElement.click();
    let dr: DealRegistrations[] = [];
    let deal: deals = new deals();
    let dealRegion = [];
    deal.dealRegistrations = [];
    deal.clients = [];
    deal.dealId = dealId;
    this.selectedRegistrations.forEach((res: any) => {
      let reg: DealRegistrations = new DealRegistrations();
      reg.registration = res.data;
      dr.push(reg);
      deal.dealRegistrations.push(reg);

      let dealClient: DealClient = new DealClient();
      dealClient.client = res.data.cl

      dealClient.clientHeads = [];
      let clientHead: Partner[] = res.data.chwec != null ? res.data.chwec.split(';') : res.data.ch != null ? res.data.ch : [];
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
      let clientSectorLead: Partner[] = res.data.cslwec != null ? res.data.cslwec.split(';') : res.data.csl != null ? res.data.csl : [];
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
      let othersInvolved: Partner[] = res.data.oiwec != null ? res.data.oiwec.split(';') : res.data.oi != null ? res.data.oi : [];
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

      dealClient.registrationSubmittedBy = res.data.sb;
      if (res.data.sb) {
        dealClient.registrationSubmitterEcode = res.data.sb.employeeCode;
      }
      dealClient.registrationSubmitterLocation = res.data.son;
      dealClient.registrationId = res.data.id;
      dealClient.registrationStatus = { registrationStatusId: res.data.stn.registrationStatusId, statusTypeName: res.data.stn.statusTypeName, sortOrder: res.data.stn.sortOrder };
      dealClient.stage = { registrationStageId: res.data.sgTI, stageTypeName: res.data.sgTN };
      dealClient.notes = '';
      dealClient.priority = { priorityId: res.data.cl.clientPriorityId, priorityName: res.data.cl.clientPriorityName, sortOrder: (res.data.cl.clientPrioritySortOrder) ? res.data.cl.clientPrioritySortOrder : 100 };
      dealClient.priorityId = res.data.cl.clientPriorityId;
      dealClient.priorityName = res.data.cl.clientPriorityName;
      dealClient.dealClientId = 0;
      dealClient.registrationSubmissionDate = res.data.lsd;
      dealClient.callDates = [];
      dealClient.caseId = res.data.case ? res.data.case.caseId : '';
      dealClient.caseCode = res.data.case ? res.data.case.caseCode : '';
      dealClient.caseName = res.data.case ? res.data.case.caseName : '';
      dealClient.caseStartDate = res.data.case ? res.data.case.caseStartDate : '';
      dealClient.caseEndDate = res.data.case ? res.data.case.caseEndDate : '';
      dealClient.statusUpdateDate = res.data.sd ? res.data.sd : '';
      dealClient.expectedStart = res.data.expectedStart;
      dealClient.caseOffice = {
        officeCode: res.data.case ? res.data.case.caseOffice : '',
        officeAbbr: '',
        officeName: res.data.case ? res.data.case.caseOfficeName : '',
        officeCluster: res.data.case ? res.data.case.officeCluster : '',
        officeClusterCode:0,
      }
      dealClient.commitmentDate = res.data.cd,
      dealClient.terminatedDate = res.data.td,

      dealClient.workType = {
        workTypeId: res.data.wti,
        workTypeName: res.data.wtn
      }

      dealClient.clientOrder = this.getClientOrder(res.data.sgTI);
      deal.clients.push(dealClient);

      if (dealRegion.indexOf(res.data.lodr) == -1) {
        dealRegion.push(res.data.lodr);
      }

    })

    deal.dealRegions = dealRegion;
    deal.clients = deal.clients.sort((a, b) => { return a.clientOrder - b.clientOrder });
    let clients = deal.clients.sort((a, b) => {
      return CommonMethods.sortCllients((a.stage) ? a.stage.registrationStageId : 0, a, b);
    })
    deal.clients = clients.sort((a, b) => { return a.clientOrder - b.clientOrder });

    // To get the client priority from basis
    let clientNames: any = deal.clients.map(client => client.client.clientName);
    clientNames = clientNames.join(',');
    let basisClientId: any = deal.clients.map(client => client.client.basisClientId);
    basisClientId = basisClientId.join(',');
    this.registrationService.getClientPriority(clientNames, basisClientId).subscribe(clientPriority => {
      // Update the client priority with basis
      if (clientPriority) {
        deal.clients.forEach(element => {
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
      this.dealService.AddRegistrationToDeal.next(deal);
      let encodedDealId = CommonMethods.encodeData(dealId.toString());
      const url = this.route.serializeUrl(
        this.route.createUrlTree([`/deals/deal/${encodedDealId}`])
      );
      localStorage.setItem("registrationdata-" + parseInt(encodedDealId).toString(), CommonMethods.encryptData(JSON.stringify(deal)));
      this.resetSelection.emit();
      window.open(url, '_blank');
    })


  }

  

  save(goToTracker:boolean) {
    this.saveInProgress = true;
    let registrations = [];
    this.selectedRegistrations.forEach(res => {
      let currRegistration: any = {};
      currRegistration.registrationId = res['data'].id;
      currRegistration.clientId = Number.parseInt(res['data'].cl.clientId);
      currRegistration.stageId = res['data'].sgTI;
      currRegistration.registrationStatusId = res['data'].sti;
      currRegistration.priorityId = Number.parseInt(res['data'].cl != "" ? res['data'].cl.clientPriorityId : 0);
      currRegistration.workTypeId = res['data'].wti;
      currRegistration.pointOfContact = res['data'].sb.employeeCode;
      currRegistration.clientHeads = this.getEmployeeCodes('ch', res['data'].ch).join(',')
      currRegistration.othersInvolved = this.getEmployeeCodes('oi', res['data'].oi).join(',')
      currRegistration.clientSectorLead = this.getEmployeeCodes('csl', res['data'].csl).join(',')
      registrations.push(currRegistration)
    })

    this.dealService.addRegistrationsToTracker(registrations, this.selectedDeal).subscribe(res => {
      if (res) {
        let dealId = this.selectedDeal;
        this.updatedRegistrations.emit({ registrations: this.selectedRegistrations, dealId: dealId })
        if(goToTracker){
          this.GoToMBTracker();
        }
        this.closeModal();
      }
    })
  }

  @HostListener('document:keydown.escape', ['$event'])
  public beforeClose(element) {
    this.closeModal()
  }

  getClientOrder(registrationStageId) {
    if (registrationStageId) {
      switch (registrationStageId) {
        case 1:
          return 4;
          break;
        case 2:
          return 3;
          break;
        case 3:
          return 5;
          break;
        case 4:
          return 1;
          break;
        case 5:
          return 2;
          break;
        default:
          return 100
          break;
      }
    }
  }

  getEmployeeCodes(label, value) {
    let heads = [];
    if (value?.length > 0) {
      value.forEach(element => {
        if (element != '') {
          heads.push(element.employeeCode);
        }
      });
    }
    return heads;
  }
}
