import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Dashboard } from '../../dashboard/dashboard';
import { RegistrationStage } from '../../../shared/interfaces/RegistrationStage';
import { FormControl } from '@angular/forms';
import { RegistrationStatus } from '../../../shared/interfaces/registrationStatus';
import { Employee } from '../../../shared/interfaces/Employee';
import { Subject } from 'rxjs';
import { User } from '../../../security/app-user-auth';
import { UpdateStageModalComponent } from '../../../shared/update-stage-modal/update-stage-modal.component';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { RegistrationClosedInfo } from '../../../registrations/registrationClosedInfo';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-conflict-card',
  templateUrl: './conflict-card.component.html',
  styleUrls: ['./conflict-card.component.scss'],
})
export class ConflictCardComponent implements OnInit {
  public status = new FormControl();
  public rowDataItem: any;
  @Input() rowData: Dashboard;
  @Input() stages: RegistrationStage[] = [];
  @Input() statuses: RegistrationStatus[] = [];
  @Input() employees: Employee[] = [];

  @Output() update: EventEmitter<{ rowData: Dashboard; fieldName: string }> = new EventEmitter();
  constructor(public toastr: ToastrService, private modalService: BsModalService, private route: Router, public dashboardService: DashboardService) { }
  ngOnInit(): void {


    this.rowDataItem = this.rowData;
    this.status.setValue(this.rowDataItem.registrationStatus.statusTypeName);
  }
  updateStatus(status) {
    this.rowDataItem.registrationStatus = this.statuses.find((s) => s.registrationStatusId === status.registrationStatusId);
    this.update.emit({ fieldName: "registrationStatus", rowData: this.rowDataItem });
  }
  updateStage(event) {
    this.openStageModal({ stage: this.rowDataItem.registrationStage, registrationId: this.rowDataItem.registrationId, target: this.rowDataItem.target });
  }
  onAssigneeChanges(value) {
    if (value) {
      this.rowDataItem.assignedUser = value.assignedUser;
      this.update.emit({ fieldName: 'assignedUser', rowData: this.rowDataItem });
    }
  }
  openStageModal(value: any) {
    let stageValue: RegistrationStage = value.stage;
    const modalRef = this.modalService.show(UpdateStageModalComponent, {
      initialState: {
        modalData: stageValue,

        registrationId: value.registrationId,
        targetData: (value?.target?.targetName) ? value?.target?.targetName : 'No target',
        hideWorkOptions: false
      },
      class: "modal-dialog-centered closed-detail-popup",
      backdrop: "static", keyboard: false
    });

    modalRef.content.saveClosedEmitter.subscribe((res) => {
      value.stage = res.stage;
      this.rowDataItem.registrationStage = res.stage;
      this.update.emit({ fieldName: 'stage', rowData: this.rowDataItem });

      let closedDetailData: RegistrationClosedInfo = res.closedInfo;
      closedDetailData.registrationId = value.registrationId;

      this.dashboardService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
        this.toastr.success("Stage updated", "Success");
      });
    });
    modalRef.content.closeEmitter.subscribe((res) => {
      if (res) {
        // this.route.navigate(['/partner-dashboard']);
      }
    });
  }
}
