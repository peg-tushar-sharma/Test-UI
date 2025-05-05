import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Dashboard } from '../../dashboard/dashboard';
import { Employee } from '../../../shared/interfaces/Employee';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { DealsService } from '../../../deals/deals.service';
import { EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../../../shared/common/constants';
import { User } from '../../../security/app-user-auth';
import { DashboardService } from '../../services/dashboard.service';
import { CommonMethods } from '../../../shared/common/common-methods';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from '../../../core/core.service';

@Component({
  selector: 'app-conflict-assignee',
  templateUrl: './conflict-assignee.component.html',
  styleUrls: ['./conflict-assignee.component.scss'],
})
export class ConflictAssigneeComponent implements OnInit, OnChanges {
  private data: Dashboard;
  employee: Employee;
  employeeList: Employee[] = [];
  employeesList: Employee[];
  rowDataItem: Dashboard;

  @Input() rowData: Dashboard;

  @Output() assigneeChanges: EventEmitter<{ assignedUser: any }> = new EventEmitter();

  constructor(private dashboardService: DashboardService, private toastrService: ToastrService, private coreService: CoreService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && changes.rowData.currentValue) {
      this.rowDataItem = changes.rowData.currentValue;
      this.assignUserToCurrentRow(this.rowDataItem.assignedUser);
    }
  }
  clearItems(event) {

    this.onAssigneeChanges(event);
  }
  onAssigneeChanges(event) {
    this.employee = event;
    this.assigneeChanges.emit({ assignedUser: this.employee })
  }
  ngOnInit(): void {
    this.employeesList = this.dashboardService.LegalUsers;
  }
  assignUserToCurrentRow(currentEmployee: any) {
    this.employee = currentEmployee;
      this.employee = CommonMethods.assignSearchableName([this.employee])[0];
  }

  assignToMe() {
    // TODO: Get current user to assign employee code
    if (this.employeesList.some(e => e.employeeCode === this.coreService.loggedInUser.employeeCode)) {
      this.assignUserToCurrentRow(this.coreService.loggedInUser);
      this.assigneeChanges.emit({ assignedUser: this.employee })

    } else {
      this.toastrService.warning('An opportunity can only be assigned to a legal user', 'You cannot assign this opportunity to yourself');
    }
    // TODO: Emit to save.
  }
}
