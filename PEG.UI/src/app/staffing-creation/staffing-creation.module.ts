import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffingCreationComponent } from './staff-creation-form/staffing-creation.component';
import { StaffingCreationRoutingModule } from './staffing-creation-routing.module';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

// forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPegOppFormBuilder } from './addPegOppFormBuilder';

// services
import { ToastrService } from 'ngx-toastr';
import { StaffingCreationService } from './staffing-creation.service';
import { StaffingService } from '../staffing/staffing.service';
import { TreeViewModule } from "../external/tree-view.module";
import { StaffingCommonModule } from '../staffing-common/staffing-common.module';


@NgModule({
  declarations: [
    StaffingCreationComponent,
  ],
  imports: [
    BsDatepickerModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    StaffingCreationRoutingModule,
    TreeViewModule,
    StaffingCommonModule
  ],
  providers: [
    AddPegOppFormBuilder,
    StaffingCreationService,
    ToastrService,
    StaffingService
  ],
})
export class StaffingCreationModule { }
