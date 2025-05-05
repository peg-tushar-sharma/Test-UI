import { TreeViewModule } from './../../external/tree-view.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomCellPipelineComponent } from "../custom-cell/custom-cell.component";
import { ClientDropdownComponent } from "../customDropdown/client-dropdown/client-dropdown.component";
import { DateDropdownComponent } from "../customDropdown/date-dropdown/date-dropdown.component";
import { LeadershipDropdownComponent } from "../customDropdown/leadership-dropdown/leadership-dropdown.component";
import { OfficeDropdownComponent } from "../customDropdown/office-dropdown/office-dropdown.component";
import { CustomCellTeamsizeComponent } from "../customFilters/custom-cell-teamsize/custom-cell-teamsize.component";
import { CustomCellComponent } from "../customFilters/custom-cell/custom-cell.component";
import { ExpectedLeadershipComponent } from "../customFilters/expected-leadership/expected-leadership.component";
import { IndustryDropdownComponent } from "../grid-editor/industry-dropdown/industry-dropdown.component";
import { PipelineClientRenderer } from "../grid-editor/pipeline-client/pipeline-client.component";
import { LocationCellRendererComponent } from "../grid-renderer/location-cell-renderer/location-cell-renderer.component";
import { WorkPhaseCellRendererComponent } from "../grid-renderer/work-phase-cell-renderer/work-phase-cell-renderer.component";
import { PriorityCellEditorComponent } from "../priority-cell-editor/priority-cell.component";
import { RecordCellComponent } from "../record-cell/record-cell.component";
import { TargetTypeRendererComponent } from "../Target-Type-Renderer/target-type-renderer.component";
import { SingleDateTextEditorComponent } from "../grid-editor/single-date-text-editor/single-date-text-editor.component";
import { AdditionalServicesEditorComponent } from "../grid-editor/additionalServices-editor/additionalServices-editor.component";
import { CaseComplexityEditorComponent } from "../grid-editor/case-complexity-editor/case-complexity-editor.component";
import { ClientTypeEditorComponent } from "../grid-editor/client-type-cell-editor/client-type-editor.component";
import { DurationCellEditorComponent } from "../grid-editor/duration-cell-editor/duration-cell-editor.component";
import { EmployeeNoteEditorComponent } from "../grid-editor/employee-note-editor/employee-note-editor.component";
import { IndustrySectorEditorComponent } from "../grid-editor/industry-sectors-editor/industry-sector-editor.component";
import { LocationCellEditorComponent } from "../grid-editor/location-cell-editor/location-cell-editor.component";
import { OfficeCellEditorComponent } from "../grid-editor/office-cell-editor/office-cell-editor.component";
import { OfficeTreeCellEditorComponent } from "../grid-editor/office-tree-cell-editor/office-tree-cell-editor.component";
import { OpsLikelihoodComponent } from "../grid-editor/ops-likelihood/ops-likelihood.component";
import { QuestionCellEditorComponent } from "../grid-editor/question-cell-editor/question-cell-editor.component";
import { RequiredLanguageEditorComponent } from "../grid-editor/required-language-editor/required-language-editor.component";
import { SimpleTextEditorComponent } from "../grid-editor/simple-text-editor/simple-text-editor.component";
import { TeamSizeEditorComponent } from "../grid-editor/team-size-editor/team-size-editor.component";
import { WorkPhaseCellEditorComponent } from "../grid-editor/work-phase-cell-editor/work-phase-cell-editor.component";
import { DealCountryCellRendererComponent } from "../grid-renderer/deal-country-cell-renderer/deal-country-cell-renderer.component";
import { ConflictsGridTooltipComponent } from "../tooltip-renderer/conflicts-grid-tooltip/conflicts-grid-tooltip.component";
import { EmployeeNotesToolTipComponent } from "../tooltip-renderer/employee-notes-tooltip/employee-notes-tooltip.component";
import { ExpectedStartDateToolTipComponent } from "../tooltip-renderer/expected-start-date-tooltip/expected-start-date-tooltip.component";
import { LocationTooltipRendererComponent } from "../tooltip-renderer/location-tooltip-renderer/location-tooltip-renderer.component";
import { MultiValueTooltipComponent } from "../tooltip-renderer/multi-value-tooltip/multi-value-tooltip.component";
import { SingleValueTooltipComponent } from "../tooltip-renderer/single-value-tooltip/single-value-tooltip.component";
import { AgGridModule } from "ag-grid-angular";
import { NgSelectModule } from "@ng-select/ng-select";
import { GridService } from "../grid-generator/grid-column.service";
import { FormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

@NgModule({
    declarations: [
        ExpectedLeadershipComponent,
        LeadershipDropdownComponent,
        ClientDropdownComponent,
        OfficeDropdownComponent,
        DateDropdownComponent,
        PipelineClientRenderer,
        CustomCellComponent,
        CustomCellTeamsizeComponent,
        RecordCellComponent,
        CustomCellPipelineComponent,
        TargetTypeRendererComponent,
        LocationCellRendererComponent,
        PriorityCellEditorComponent,
        IndustryDropdownComponent,
        WorkPhaseCellRendererComponent,
        SingleDateTextEditorComponent,
        WorkPhaseCellEditorComponent,
        SimpleTextEditorComponent,
        SingleValueTooltipComponent,
        MultiValueTooltipComponent,
        DurationCellEditorComponent,
        ClientTypeEditorComponent,
        IndustrySectorEditorComponent,
        LocationCellEditorComponent,
        LocationCellRendererComponent,
        DealCountryCellRendererComponent,
        LocationTooltipRendererComponent,
        TeamSizeEditorComponent,
        CaseComplexityEditorComponent,
        AdditionalServicesEditorComponent,
        OfficeCellEditorComponent,
        QuestionCellEditorComponent,
        RequiredLanguageEditorComponent,
        OfficeTreeCellEditorComponent,
        ExpectedStartDateToolTipComponent,
        EmployeeNoteEditorComponent,
        EmployeeNotesToolTipComponent,
        OpsLikelihoodComponent,
        ConflictsGridTooltipComponent
    ],
    imports: [CommonModule, AgGridModule, NgSelectModule, FormsModule, BsDatepickerModule, TreeViewModule],
    exports: [
        ExpectedLeadershipComponent,
        LeadershipDropdownComponent,
        ClientDropdownComponent,
        OfficeDropdownComponent,
        DateDropdownComponent,
        PipelineClientRenderer,
        CustomCellComponent,
        CustomCellTeamsizeComponent,
        RecordCellComponent,
        CustomCellPipelineComponent,
        TargetTypeRendererComponent,
        LocationCellRendererComponent,
        PriorityCellEditorComponent,
        IndustryDropdownComponent,
        WorkPhaseCellRendererComponent,
        SingleDateTextEditorComponent,
        WorkPhaseCellEditorComponent,
        SimpleTextEditorComponent,
        SingleValueTooltipComponent,
        MultiValueTooltipComponent,
        DurationCellEditorComponent,
        ClientTypeEditorComponent,
        IndustrySectorEditorComponent,
        LocationCellEditorComponent,
        LocationCellRendererComponent,
        DealCountryCellRendererComponent,
        LocationTooltipRendererComponent,
        TeamSizeEditorComponent,
        CaseComplexityEditorComponent,
        AdditionalServicesEditorComponent,
        OfficeCellEditorComponent,
        QuestionCellEditorComponent,
        RequiredLanguageEditorComponent,
        OfficeTreeCellEditorComponent,
        ExpectedStartDateToolTipComponent,
        EmployeeNoteEditorComponent,
        EmployeeNotesToolTipComponent,
        OpsLikelihoodComponent,
        ConflictsGridTooltipComponent
    ],
    providers: [GridService]
})
export class PipelineAgGridCustomComponentsModule {}
