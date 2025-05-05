import { NgModule, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PipelineComponent } from "./pipeline.component";
import { PipelineRoutingModule } from "./pipeline.routing.module";
import { AgGridModule } from "ag-grid-angular";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { PipelineService } from "./pipeline.service";
import { RegistrationGridService } from "../registrations/registrations/registration-grid.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { PipelineNavigationBarComponent } from "../pipeline/pipeline-navigation-bar/pipeline-navigation-bar.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PipelineGridColumnService } from "../shared/grid-generator/pipeline-grid-colum.service";
import { Overlay } from "@angular/cdk/overlay";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PipelineGridComponent } from "./pipeline-grid/pipeline-grid.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import {  CdkMenuModule } from "@angular/cdk/menu";
import { NewRegistrationService } from "../registrations/new-registration/new-registration.service";
import { DateBucketsColumnComponent } from "./date-buckets-column/date-buckets-column.component";
import { OppSlideoutComponent } from "./opp-slideout/opp-slideout.component";
import { PipelineFilterComponent } from "./pipeline-filter/pipeline-filter.component";
import { AngularSplitModule } from "angular-split";
import { PipelineNoteComponent } from "./date-buckets-column/pipeline-note/pipeline-note.component";
import { ShareViewModalComponent } from "./pipeline-grid/share-view-modal/share-view-modal.component";
import { SaveFilterModalComponent } from "./pipeline-grid/save-filter-modal/save-filter-modal.component";
import { CaseEditorPopUpComponent } from "./date-buckets-column/case-editor-pop-up/case-editor-pop-up.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { OppAuditComponent } from "./opp-slideout/opp-audit/opp-audit.component";
import { OppEditComponent } from "./opp-slideout/opp-edit/opp-edit.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NewOpportunityService } from "../opportunity/new-opportunity/new-opportunity.service";

import { PopoverModule } from "ngx-bootstrap/popover";
import { ConflictsGridTooltipComponent } from "../shared/tooltip-renderer/conflicts-grid-tooltip/conflicts-grid-tooltip.component";
import { AddPlaceholderToDealComponent } from "./opp-slideout/opp-edit/add-placeholder-to-deal/add-placeholder-to-deal.component";
import { TreeViewModule } from "../external/tree-view.module";
import { AgGridSharedComponentsModule } from "../shared/ag-grid-custom-components/ag-grid-shared-components.module";
import { PipelineAgGridCustomComponentsModule } from "../shared/ag-grid-custom-components/pipeline-ag-grid-custom-components.module";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
    declarations: [
        PipelineComponent,
        PipelineNavigationBarComponent,
        PipelineGridComponent,
        DateBucketsColumnComponent,
        PipelineFilterComponent,
        PipelineNoteComponent,
        OppSlideoutComponent,
        ShareViewModalComponent,
        SaveFilterModalComponent,
        CaseEditorPopUpComponent,
        OppAuditComponent,
        OppEditComponent,
        AddPlaceholderToDealComponent
    ],
    imports: [
        PopoverModule.forRoot(),
        SharedModule,
        PipelineRoutingModule,
        FormsModule,
        CommonModule,
        NgSelectModule,
        BsDatepickerModule,
        ButtonsModule.forRoot(),
        BsDropdownModule.forRoot(),
        AngularSplitModule,
        DragDropModule,
        NgbModule,
        CdkMenuModule,
        TabsModule.forRoot(),
        AgGridModule,
        AgGridSharedComponentsModule,
        TreeViewModule,
        PipelineAgGridCustomComponentsModule,
        ModalModule.forRoot(),
        
    ],
    providers: [
        PipelineService,
        RegistrationGridService,
        PipelineGridColumnService,
        Overlay,
        NewRegistrationService,
        NewOpportunityService
    ],
    exports: [],
    bootstrap: [PipelineNoteComponent]
})
export class PipelineModule {}
