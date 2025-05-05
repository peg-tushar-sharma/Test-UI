import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CheckboxSelectStaffingComponent } from "./staff-details/checkbox-select-staffing/checkbox-select-staffing.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { StaffDetailsComponent } from "./staff-details/staff-details.component";
import { StaffEditibleComponent } from "./staff-details/staff-editible/staff-editible.component";
import { StaffingRoutingModule } from "./staffing-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UpdateStageStaffingModalComponent } from "./update-stage-staffing-modal/update-stage-staffing-modal.component";
import { TreeViewModule } from "../external/tree-view.module";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { StaffingCommonModule } from "../staffing-common/staffing-common.module";

@NgModule({
    declarations: [
        StaffDetailsComponent,
        StaffEditibleComponent,
        UpdateStageStaffingModalComponent,
        CheckboxSelectStaffingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        StaffingRoutingModule,
        AgGridModule,
        BsDatepickerModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgbModule,
        TreeViewModule,
        BsDropdownModule,
        StaffingCommonModule
    ],
    exports: [],
    providers: [FormBuilder]
})
export class StaffingModule {}
