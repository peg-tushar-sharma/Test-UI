import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dashboard } from '../../dashboard/dashboard';
import { RegistrationStage } from '../../../shared/interfaces/RegistrationStage';
import { RegistrationStatus } from '../../../shared/interfaces/registrationStatus';
import { User } from '../../../security/app-user-auth';
import { Observable } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { AuditLogService } from '../../../shared/AuditLog/auditLog.service';
import { CoreService } from '../../../core/core.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../global/global.service';
import { DealsService } from '../../../deals/deals.service';
import { findIndex, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-conflicts-list',
  templateUrl: './conflicts-list.component.html',
  styleUrls: ['./conflicts-list.component.scss'],
})
export class ConflictsListComponent implements OnInit {

  pendingLegal: Dashboard[] = [];
  pendingPartner: Dashboard[] = [];
  currentTab: 'LEGAL' | 'PARTNER' | 'COMPLETED' = 'LEGAL';

  filterTerm: string = '';
  filteredPendingLegal: Dashboard[] = [];
  filteredPendingPartner: Dashboard[] = [];

  public stages: RegistrationStage[];
  public statuses: RegistrationStatus[];
  public dashboardData: Dashboard[] = [];
  public isAssignedToMe: boolean = false;
  constructor(private dashboardService: DashboardService,
    private registrationService: RegistrationService,
    private coreService: CoreService,
    private globalService: GlobalService,
    private tostr: ToastrService) { }
  ngOnInit(): void {

    this.getdashboardData(this.currentTab, null, null);
    this.globalService.getRegistrationStage().subscribe((data: RegistrationStage[]) => {
      this.stages = data;
    });
    this.registrationService.getRegistrationStatus().subscribe((data: RegistrationStatus[]) => {
      this.statuses = data.filter(record => ([5, 6].indexOf(record.registrationStatusId) === -1));

    });

  }

  getdashboardData(filterName, startDate, endDate) {
    this.dashboardService.getDashboardRegistrations(filterName, startDate, endDate, 0).subscribe((res) => {
      this.dashboardData = res;
      this.separateBuckets(this.dashboardData);
    });
  }
  separateBuckets(data: Dashboard[]): void {
    this.pendingLegal = [];
    this.pendingPartner = [];
    let registrationStageActive = [1, 2, 4, 5];
    data.forEach((item) => {
      if (item.registrationStatus?.registrationStatusId == 4 && registrationStageActive.some(x => x == item.registrationStage.registrationStageId)) {
        this.pendingLegal.push(item);
      } else if (item.registrationStatus?.registrationStatusId == 2 && registrationStageActive.some(x => x == item.registrationStage.registrationStageId)) {
        this.pendingPartner.push(item);
      }
    });

    this.filteredPendingLegal = [...this.pendingLegal]
    this.filteredPendingPartner = [...this.pendingPartner]
  }

  updateOpportunity(event: { rowData: Dashboard; fieldName: string; }) {
    const objUpdatedOpportunityRow = { ...event.rowData };

    this.dashboardService.updateConflictDashboard(event.fieldName, objUpdatedOpportunityRow).subscribe((res) => {

      let index = this.dashboardData.findIndex(x => x.registrationId == res.registrationId);
      this.dashboardData[index] = res;
      this.separateBuckets(this.dashboardData);
      this.applyFilter();
      this.tostr.success('Opportunity updated successfully');

    });

  }


  changeTab(tab: 'LEGAL' | 'PARTNER' | 'COMPLETED') {
    this.filterTerm = '';
    this.isAssignedToMe = false;
    this.currentTab = tab;
    if (this.currentTab != 'COMPLETED') {
      this.getdashboardData(this.currentTab, null, null);

    }
  }
  trackBy(index: number, item: Dashboard) {
    return item.registrationId;
  }
  onAssignToMeClick() {
    this.isAssignedToMe = !this.isAssignedToMe;
    this.applyFilter();
  }
  applyFilter() {
    if (this.currentTab === 'LEGAL') {

      this.filteredPendingLegal = this.pendingLegal.filter(row => {
        // Determine if the row matches the search term criteria
        const matchesSearchTerm = this.filterTerm ?
          (row.target.targetName.toLowerCase().includes(this.filterTerm.toLowerCase()) ||
            row.client.clientName.toLowerCase().includes(this.filterTerm.toLowerCase()))
          : true; // If no filter term is set, include all rows

        // Determine if the row matches the assigned-to-me criteria
        const matchesAssignedToMe = this.isAssignedToMe ?
          row.assignedUser.employeeCode === this.coreService.loggedInUser.employeeCode
          : true; // If not checking assignment, include all rows

        // Return true if both criteria match (or if either criteria is not set, so we include all rows)
        return matchesSearchTerm && matchesAssignedToMe;
      });
    } else if (this.currentTab === 'PARTNER') {
      this.filteredPendingPartner = this.pendingPartner.filter(row => {
        // Determine if the row matches the search term criteria
        const matchesSearchTerm = this.filterTerm ?
          (row.target.targetName.toLowerCase().includes(this.filterTerm.toLowerCase()) ||
            row.client.clientName.toLowerCase().includes(this.filterTerm.toLowerCase()))
          : true; // If no filter term is set, include all rows

        // Determine if the row matches the assigned-to-me criteria
        const matchesAssignedToMe = this.isAssignedToMe ?
          row.assignedUser.employeeCode === this.coreService.loggedInUser.employeeCode
          : true; // If not checking assignment, include all rows

        // Return true if both criteria match (or if either criteria is not set, so we include all rows)
        return matchesSearchTerm && matchesAssignedToMe;
      });

    }
  }

}
