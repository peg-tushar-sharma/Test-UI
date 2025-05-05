import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CopyLinkIconComponent } from "../copy-link-icon/copy-link-icon.component";
import { CustomHeaderComponent } from "../customFilters/custom-header/custom-header.component";
import { CustomSetFilterComponent } from "../customFilters/custom-set-filter/custom-set-filter.component";
import { TagsFilterComponent } from "../customFilters/tags-filter/tags-filter.component";
import { TextFilterComponent } from "../customFilters/text-filter/text-filter.component";
import { GrantPermissionComponent } from "../grant-permission/grant-permission.component";
import { BooleanCellEditorComponent } from "../grid-editor/boolean-cell-editor/boolean-cell-editor.component";
import { ClientEditorComponent } from "../grid-editor/client-editor/client-editor.component";
import { EmployeeEditorComponent } from "../grid-editor/employee-editor/employee-editor.component";
import { IndustryEditorComponent } from "../grid-editor/industry-editor/industry-editor.component";
import { StageEditorComponent } from "../grid-editor/stage-editor/stage-editor.component";
import { StatusEditorComponent } from "../grid-editor/status-editor/status-editor.component";
import { OpsLeadCellRendererComponent } from "../grid-renderer/ops-lead-only-editor/opslead-cell-renderer.component";
import { IconsRendererComponent } from "../icons-renderer/icons-renderer.component";
import { TagsRendererComponent } from "../tags/tags-renderer/tags-renderer.component";
import { DealIconRendererComponent } from "../deal-icon-renderer/deal-icon-renderer.component";
import { AgGridModule } from "ag-grid-angular";
import { DateFilterComponent } from "../customFilters/date-filter/date-filter.component";
import { ClientCommitmentComponent } from "../grid-editor/client-commitment-component/client-commitment.component";
import { ExpectedStartEditorComponent } from "../grid-editor/expected-start-editor/expected-start-editor.component";
import { OpportunityStageEditorComponent } from "../grid-editor/opportunityStage-editor/opportunityStage.component";
import { PipelineStatusEditorComponent } from "../grid-editor/pipelineStatus-editor/pipelineStatus-cell.component";
import { TeamEditorComponent } from "../grid-editor/team-editor/team-editor.component";
import { OpportunityNameToolPanelComponent } from "../toolPanel/opportunity-name-tool-panel/opportunity-name-tool-panel.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { CustomTagsComponent } from "../tags/custom-tags/custom-tags.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        TextFilterComponent,
        CustomHeaderComponent,
        EmployeeEditorComponent,
        ClientEditorComponent,
        IndustryEditorComponent,
        StageEditorComponent,
        StatusEditorComponent,
        CustomSetFilterComponent,
        BooleanCellEditorComponent,
        GrantPermissionComponent,
        CopyLinkIconComponent,
        IconsRendererComponent,
        DealIconRendererComponent,
        TagsRendererComponent,
        TagsFilterComponent,
        OpsLeadCellRendererComponent,
        DateFilterComponent,
        TagsFilterComponent,
        TeamEditorComponent,
        ExpectedStartEditorComponent,
        PipelineStatusEditorComponent,
        OpportunityNameToolPanelComponent,
        OpportunityStageEditorComponent,
        ClientCommitmentComponent,
        CustomTagsComponent
    ],
    imports: [
        CommonModule,
        AgGridModule,
        BsDatepickerModule,
        NgSelectModule,
        TooltipModule,
        ButtonsModule,
        FormsModule
    ],
    exports: [
        TextFilterComponent,
        CustomHeaderComponent,
        EmployeeEditorComponent,
        ClientEditorComponent,
        IndustryEditorComponent,
        StageEditorComponent,
        StatusEditorComponent,
        CustomSetFilterComponent,
        BooleanCellEditorComponent,
        GrantPermissionComponent,
        CopyLinkIconComponent,
        IconsRendererComponent,
        DealIconRendererComponent,
        TagsRendererComponent,
        TagsFilterComponent,
        OpsLeadCellRendererComponent,
        DateFilterComponent,
        TagsFilterComponent,
        TeamEditorComponent,
        ExpectedStartEditorComponent,
        PipelineStatusEditorComponent,
        OpportunityNameToolPanelComponent,
        OpportunityStageEditorComponent,
        ClientCommitmentComponent,
        CustomTagsComponent
    ]
})
export class AgGridSharedComponentsModule {
}
