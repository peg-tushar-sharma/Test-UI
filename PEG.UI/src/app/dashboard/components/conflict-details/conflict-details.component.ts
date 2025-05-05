import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../core/core.service';
import { GlobalService } from '../../../global/global.service';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { RegistrationStage } from '../../../shared/interfaces/RegistrationStage';
import { RegistrationStatus } from '../../../shared/interfaces/registrationStatus';
import { Pipeline } from '../../..//pipeline/pipeline';
import { PipelineService } from '../../../pipeline/pipeline.service';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../dashboard/dashboard';
import { ToastrService } from 'ngx-toastr';
import { CommonMethods } from '../../../shared/common/common-methods';
import { UpdateStageModalComponent } from '../../../shared/update-stage-modal/update-stage-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RegistrationClosedInfo } from '../../../registrations/registrationClosedInfo';
import { Company } from '../../../conflicts/company';
import { CompanyTypes } from '../../../shared/enums/company-type.enum';
import { Location } from '@angular/common';
import { AuditLogRepositoryService } from '../../../shared/AuditLog/audit-log-repository.service';
import { forkJoin } from 'rxjs';

export interface RelatedTrackerClient {
  registrationId: number;
  clientId: number;
  clientName: string;
  registrationStageId: number;
  statusUpdateDate: string;
  stageTypeName: string;
  sortOrder: number;
  caseCode: string;
  caseManager: string;
  caseStartDate: string;
  caseEndDate: string;
  officeCode: number;
  officeName: string;
  officeClusterCode: number;
  officeCluster: string;
  likelihoodId: number;
  label: string;
  value: number;
  isRetainer: number;
  conflictedOffice?: any;
}

@Component({
  selector: 'app-conflict-details',
  templateUrl: './conflict-details.component.html',
  styleUrls: ['./conflict-details.component.scss'],
})
export class ConflictDetailsComponent implements OnInit {
  // TODO: Remove this and usages to show all the HTML.
  public featureComplete = false;

  public isSidebarVisible = false;
  public minimized = true;
  public conflictId!: number;

  public menuButtons = [
    {
      id: 1,
      label: 'Conflict ID',
      icon: null,
      image: 'cid.png',
      action: 'click',
      link: 'https://conflictid.bain.com',
      height: '22',
    },
    {
      id: 2,
      label: 'Agiloft',
      icon: null,
      image: 'agiloft.jfif',
      action: 'click',
      link: 'https://bainandco.agiloft.com/logins/bainandco-login.htm',
      height: '25',
    },
    {
      id: 3,
      label: 'D&B',
      icon: null,
      image: 'dnb.jpg',
      action: 'click',
      link: 'https://app.dnbhoovers.com/search/results/company?q={companyName}',
      height: '25',

    },
    {
      id: 4,
      label: 'Iris',
      icon: null,
      image: 'iris.png',
      action: 'click',
      link: 'https://iris.bain.com/search?queryString={companyName}&fromSuggestion=false&searchTabs=insights',
      height: '25',
    },
  ];

  public stages: RegistrationStage[];
  public statuses: RegistrationStatus[];
  public conflictRowData: any;
  public pipelineInfo: Pipeline;
  public relatedData: any[] = [];
  public matchedCompany: Company[] = [];
  public cardData: {
    partnership: Company[];
    investments: Company[];
    prohibitions: Company[];
    confidentialClient: Company[];
    bordOfDirectors: Company[];
    maOpportunities: Company[];
  } = {
      partnership: [],
      investments: [],
      prohibitions: [],
      confidentialClient: [],
      bordOfDirectors: [],
      maOpportunities: [],
    };
  public showEditWebsite = false;
  historyType!: 'notes' | 'audit';

  constructor(
    private globalService: GlobalService,
    private registrationService: RegistrationService,
    private coreService: CoreService,
    private pipelineService: PipelineService,
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private tostr: ToastrService,
    private modalService: BsModalService,
    private _location: Location,
    private auditLogRepositoryService: AuditLogRepositoryService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('conflictId')) {
        this.conflictId = Number(params.get('conflictId'));
        this.dashboardService.getConflictsDetailsById(this.conflictId).subscribe((value) => {
          this.conflictRowData = value;
          this.menuButtons.forEach(element => {
            if (element.id == 3) {
              element.link = element.link.replace('{companyName}', this.conflictRowData.target.targetName);
            } else if (element.id == 4) {
              element.link = element.link.replace('{companyName}', this.conflictRowData.target.targetName);
            }
          });

          forkJoin([
            this.dashboardService.getLinkedRegistrationById(this.conflictRowData.registrationId),
            this.dashboardService.getRegistrationByTargetName(this.conflictRowData.target.targetName)
          ]).subscribe(([linkedRegistrations, targetRelatedRegistrations]) => {
            this.relatedData = [];
            if(targetRelatedRegistrations?.length > 0) {
              this.relatedData = [...(targetRelatedRegistrations.filter((res) => res.registrationId !== this.conflictRowData.registrationId))]; 
            }
            if(linkedRegistrations?.length > 0) {
              linkedRegistrations.forEach((element) => {
                if(!targetRelatedRegistrations.some((res) => res.registrationId === element.registrationId)) {
                  this.relatedData = [...this.relatedData, element];
                }
              });
            }
          });
          this.dashboardService.getConflictsByCompanyName(this.conflictRowData.target.targetName).subscribe((value) => {
            this.matchedCompany = value;
            this.cardData.partnership = this.matchedCompany.filter(
              (res) => res.companyType.companyTypeId == CompanyTypes.Partnerships,
            );
            this.cardData.prohibitions = this.matchedCompany.filter(
              (res) => res.companyType.companyTypeId === CompanyTypes.Prohibitions,
            );
            this.cardData.bordOfDirectors = this.matchedCompany.filter(
              (res) => res.companyType.companyTypeId === CompanyTypes.BoardOfDirectors,
            );
            this.cardData.confidentialClient = this.matchedCompany.filter(
              (res) => res.companyType.companyTypeId === CompanyTypes.ConfidentialClients,
            );
            this.cardData.investments = this.matchedCompany.filter(
              (res) => res.companyType.companyTypeId === CompanyTypes.Investments,
            );
            this.cardData.maOpportunities = [];
          });
        });
        this.pipelineService.getPipelineById(this.conflictId).subscribe((value) => {
          this.pipelineInfo = value;
        });
      }
    });
  }
  onBackClick() {
    this._location.back();
  }
  openClickedUrl(value) {
    window.open(value, '_blank');
  }
  ngOnInit(): void {
    this.dashboardService.getUsersByRole(1).subscribe((employees) => {
      employees = CommonMethods.assignSearchableName(employees);
      this.dashboardService.LegalUsers = employees;
    });
    this.globalService.getRegistrationStage().subscribe((data) => {
      this.stages = data;
    });
    this.registrationService.getRegistrationStatus().subscribe((data) => {
      this.statuses = data.filter((record) => [5, 6].indexOf(record.registrationStatusId) === -1);
    });


  }
  onRegistrationStageChange($event) { }
  onCorporateRelationshipChange($event) {
    if (this.conflictRowData.corporateRelationship != null && this.conflictRowData.corporateRelationship != '') {
      this.updateOpportunity({ rowData: this.conflictRowData, fieldName: 'corporateRelationship' });
    } else {
      this.tostr.error("Target Owner can't be empty", 'Error');
    }
  }
  onWebsiteChangeClick($event) {
    if (this.conflictRowData.website != null && this.conflictRowData.website != '') {
      this.showEditWebsite = !this.showEditWebsite;
      this.updateOpportunity({ rowData: this.conflictRowData, fieldName: 'website' });
    } else {
      this.tostr.error("Website can't be empty", 'Error');
    }
  }
  onRegistrationStatusChange(event) {
    this.conflictRowData.registrationStatus = event;
    this.updateOpportunity({ rowData: this.conflictRowData, fieldName: 'registrationStatus' });
  }
  onAssigneeChanges($event) {
    this.conflictRowData.assignedUser = $event.assignedUser;
    this.updateOpportunity({ rowData: this.conflictRowData, fieldName: 'assignedUser' });
  }
  updateOpportunity(event: { rowData: any; fieldName: string }) {
    //Convert to conflict dashboard object;
    const objUpdatedOpportunityRow: Dashboard = new Dashboard();
    objUpdatedOpportunityRow.registrationId = event.rowData.registrationId;
    objUpdatedOpportunityRow.registrationStatus = event.rowData.registrationStatus;
    objUpdatedOpportunityRow.registrationStage = event.rowData.registrationStage;
    objUpdatedOpportunityRow.assignedUser = event.rowData.assignedUser;
    objUpdatedOpportunityRow.corporateRelationship = event.rowData.corporateRelationship;
    objUpdatedOpportunityRow.website = event.rowData.website;

    this.dashboardService.updateConflictDashboard(event.fieldName, objUpdatedOpportunityRow).subscribe((res) => {
      this.dashboardService.getConflictsDetailsById(objUpdatedOpportunityRow.registrationId).subscribe((value) => {
        this.conflictRowData = value;

        this.tostr.success('Opportunity updated successfully');
      });
    });
  }
  openLink(item) {
    window.open(item.link, '_blank');
  }
  updateStage() {
    this.openStageModal(this.conflictRowData);
  }
  openStageModal(value: any) {
    let stageValue: RegistrationStage = value.registrationStage;
    const modalRef = this.modalService.show(UpdateStageModalComponent, {
      initialState: {
        modalData: stageValue,

        registrationId: value.registrationId,
        targetData: value?.target?.targetName ? value?.target?.targetName : 'No target',
        hideWorkOptions: false,
      },
      class: 'modal-dialog-centered closed-detail-popup',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.content.saveClosedEmitter.subscribe((res) => {
      value.stage = res.stage;
      this.conflictRowData.registrationStage = res.stage;
      this.updateOpportunity({ rowData: this.conflictRowData, fieldName: 'stage' });

      let closedDetailData: RegistrationClosedInfo = res.closedInfo;
      closedDetailData.registrationId = value.registrationId;

      this.dashboardService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
        this.tostr.success('Stage updated', 'Success');
      });
    });
    modalRef.content.closeEmitter.subscribe((res) => {
      if (res) {
        // this.route.navigate(['/partner-dashboard']);
      }
    });
  }

  hideSidebar() {
    this.minimized = true;
    this.historyType = null;
    setTimeout(() => {
      this.isSidebarVisible = false;
    }, 500);
  }

  showAuditLog() {
    this.isSidebarVisible = true;
    this.minimized = false;
    this.historyType = 'audit';
  }

  showNotes() {
    this.isSidebarVisible = true;
    this.minimized = false;
    this.historyType = 'notes';
  }
}
