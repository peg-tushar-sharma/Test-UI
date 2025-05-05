import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import {
    CellContextMenuEvent,
    CellKeyPressEvent,
    ColDef,
    CsvExportParams,
    ExcelExportParams,
    ExportParams,
    GridApi,
    GridOptions,
    PostProcessPopupParams,
    ProcessCellForExportParams,
    ProcessHeaderForExportParams,
    ProcessRowGroupForExportParams,
    RowDataTransaction,
    RowNodeTransaction
} from "ag-grid-community";
import * as _ from "lodash";
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CoreService } from "../../core/core.service";
import { PegTostrService } from "../../core/peg-tostr.service";
import { GlobalService } from "../../global/global.service";
import { RegistrationService } from "../../registrations/registrations/registration.service";
import { AuditLog } from "../../shared/AuditLog/AuditLog";
import { TargetTypeRendererComponent } from "../../shared/Target-Type-Renderer/target-type-renderer.component";
import { CommonMethods } from "../../shared/common/common-methods";
import { EmailHelper } from "../../shared/common/EmailHelper";
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { CustomCellPipelineComponent } from "../../shared/custom-cell/custom-cell.component";
import { ClientDropdownComponent } from "../../shared/customDropdown/client-dropdown/client-dropdown.component";
import { DateDropdownComponent } from "../../shared/customDropdown/date-dropdown/date-dropdown.component";
import { LeadershipDropdownComponent } from "../../shared/customDropdown/leadership-dropdown/leadership-dropdown.component";
import { OfficeDropdownComponent } from "../../shared/customDropdown/office-dropdown/office-dropdown.component";
import { CustomCellTeamsizeComponent } from "../../shared/customFilters/custom-cell-teamsize/custom-cell-teamsize.component";
import { CustomCellComponent } from "../../shared/customFilters/custom-cell/custom-cell.component";
import { ExpectedLeadershipComponent } from "../../shared/customFilters/expected-leadership/expected-leadership.component";
import { TextFilterComponent } from "../../shared/customFilters/text-filter/text-filter.component";
import { PipelineBucketStatus } from "../../shared/enums/BucketStatus.enum";
import { BucketRowType } from "../../shared/enums/bucket-row-type";
import { DeleteLevel } from "../../shared/enums/delete-type";
import { Opportunity_Stage } from "../../shared/enums/opportunity-stage";
import { PagesTypes } from "../../shared/enums/page-type.enum";
import { Region } from "../../shared/enums/region";
import { AdditionalServicesEditorComponent } from "../../shared/grid-editor/additionalServices-editor/additionalServices-editor.component";
import { BooleanCellEditorComponent } from "../../shared/grid-editor/boolean-cell-editor/boolean-cell-editor.component";
import { CaseComplexityEditorComponent } from "../../shared/grid-editor/case-complexity-editor/case-complexity-editor.component";
import { CaseEditorComponent } from "../../shared/grid-editor/case-editor/case-editor.component";
import { ClientCommitmentComponent } from "../../shared/grid-editor/client-commitment-component/client-commitment.component";
import { ClientEditorComponent } from "../../shared/grid-editor/client-editor/client-editor.component";
import { ClientTypeEditorComponent } from "../../shared/grid-editor/client-type-cell-editor/client-type-editor.component";
import { EmployeeEditorComponent } from "../../shared/grid-editor/employee-editor/employee-editor.component";
import { ExpectedStartEditorComponent } from "../../shared/grid-editor/expected-start-editor/expected-start-editor.component";
import { IndustryDropdownComponent } from "../../shared/grid-editor/industry-dropdown/industry-dropdown.component";
import { IndustrySectorEditorComponent } from "../../shared/grid-editor/industry-sectors-editor/industry-sector-editor.component";
import { LocationCellEditorComponent } from "../../shared/grid-editor/location-cell-editor/location-cell-editor.component";
import { OfficeCellEditorComponent } from "../../shared/grid-editor/office-cell-editor/office-cell-editor.component";
import { OpportunityStageEditorComponent } from "../../shared/grid-editor/opportunityStage-editor/opportunityStage.component";
import { PipelineClientRenderer } from "../../shared/grid-editor/pipeline-client/pipeline-client.component";
import { PipelineStatusEditorComponent } from "../../shared/grid-editor/pipelineStatus-editor/pipelineStatus-cell.component";
import { QuestionCellEditorComponent } from "../../shared/grid-editor/question-cell-editor/question-cell-editor.component";
import { SimpleTextEditorComponent } from "../../shared/grid-editor/simple-text-editor/simple-text-editor.component";
import { SingleDateTextEditorComponent } from "../../shared/grid-editor/single-date-text-editor/single-date-text-editor.component";
import { StageEditorComponent } from "../../shared/grid-editor/stage-editor/stage-editor.component";
import { TeamSizeEditorComponent } from "../../shared/grid-editor/team-size-editor/team-size-editor.component";
import { WorkPhaseCellEditorComponent } from "../../shared/grid-editor/work-phase-cell-editor/work-phase-cell-editor.component";
import { PipelineGridColumnService } from "../../shared/grid-generator/pipeline-grid-colum.service";
import { DealCountryCellRendererComponent } from "../../shared/grid-renderer/deal-country-cell-renderer/deal-country-cell-renderer.component";
import { LocationCellRendererComponent } from "../../shared/grid-renderer/location-cell-renderer/location-cell-renderer.component";
import { OpsLeadCellRendererComponent } from "../../shared/grid-renderer/ops-lead-only-editor/opslead-cell-renderer.component";
import { WorkPhaseCellRendererComponent } from "../../shared/grid-renderer/work-phase-cell-renderer/work-phase-cell-renderer.component";
import { IconsRendererComponent } from "../../shared/icons-renderer/icons-renderer.component";
import { GridColumn, RegistrationStage } from "../../shared/interfaces/models";
import { Office } from "../../shared/interfaces/office";
import { PriorityCellEditorComponent } from "../../shared/priority-cell-editor/priority-cell.component";
import { RecordCellComponent } from "../../shared/record-cell/record-cell.component";
import { SignalRService } from "../../shared/signalr/signalr.service";
import { OpportunityNameToolPanelComponent } from "../../shared/toolPanel/opportunity-name-tool-panel/opportunity-name-tool-panel.component";
import { LocationTooltipRendererComponent } from "../../shared/tooltip-renderer/location-tooltip-renderer/location-tooltip-renderer.component";
import { MultiValueTooltipComponent } from "../../shared/tooltip-renderer/multi-value-tooltip/multi-value-tooltip.component";
import { SingleValueTooltipComponent } from "../../shared/tooltip-renderer/single-value-tooltip/single-value-tooltip.component";
import { BucketGroup, PipelineBucketGroupInfo } from "../bucketGroup";
import { DateBucketsColumnComponent } from "../date-buckets-column/date-buckets-column.component";
import { OppSlideoutComponent } from "../opp-slideout/opp-slideout.component";
import { OpportunityStage, Pipeline } from "../pipeline";
import { PipelineService } from "../pipeline.service";
import { PipelineAuditLog } from "../pipelineAuditLog";
import { PipelineBucket } from "../pipelineBucket";
import { UserColumn } from "../userColumn";
import { UserFilter } from "../userFilter";
import { RequiredLanguageEditorComponent } from "../../shared/grid-editor/required-language-editor/required-language-editor.component";
import { OfficeTreeCellEditorComponent } from "../../shared/grid-editor/office-tree-cell-editor/office-tree-cell-editor.component";
import { SortType } from "../../shared/enums/sortType.enum";

import { BucketColumnPreference } from "../bucket-column-preference";

import { FilterType } from "../../shared/enums/FilterType";
import { RegistrationStageEnum } from "../../shared/enums/registration-stage.enum";
import { undo, redo, addEvent } from '../../shared/store/undoable.actions';
import { Store, select } from "@ngrx/store";
import { eventReducer } from "../../shared/store/undoable.reducer";
import { ExpectedStartDateToolTipComponent } from "../../shared/tooltip-renderer/expected-start-date-tooltip/expected-start-date-tooltip.component";
import { DurationCellEditorComponent } from "../../shared/grid-editor/duration-cell-editor/duration-cell-editor.component";
import { OpsLikelihoodComponent } from "../../shared/grid-editor/ops-likelihood/ops-likelihood.component";
import { EmployeeNoteEditorComponent } from "../../shared/grid-editor/employee-note-editor/employee-note-editor.component";
import { EmployeeNotesToolTipComponent } from "../../shared/tooltip-renderer/employee-notes-tooltip/employee-notes-tooltip.component";
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { UpdateStageModalComponent } from "../../shared/update-stage-modal/update-stage-modal.component";
import { CurtainState } from "../../shared/enums/curtain-state.enum";

import { PipelineField } from "../../shared/enums/pipelineField";
import { RegistrationField } from "../../shared/enums/registrationField";

import { Registrations } from "../../registrations/registrations/registrations";
import { RegistrationClosedInfo } from "../../registrations/registrationClosedInfo";
import { ConflictsGridTooltipComponent } from "../../shared/tooltip-renderer/conflicts-grid-tooltip/conflicts-grid-tooltip.component";
import { OpsLikelihood } from "../../shared/interfaces/opsLikelihood";
import { OpsLikelihoodEnum } from "../../shared/enums/OpsLikelihood.enum";
import { filter, map } from "rxjs/operators";
import { OppType } from "../../shared/enums/opp-type";
import { forkJoin } from "rxjs";
import { dealMBStatus } from "../../shared/enums/deal-mbStatus.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
    selector: "app-pipeline-grid",
    templateUrl: "./pipeline-grid.component.html",
    styleUrls: ["./pipeline-grid.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class PipelineGridComponent implements OnInit, AfterContentChecked, OnDestroy {
    rowDataFlagged: any = [];
    bucketData: any;
    rowDataDuplicates: any = [];
    rowFlaggedcount: number;
    hideSelectors: boolean = false;
    bsModalRef: BsModalRef;
    filterModel: any;
    currentRowGroups: any = [];
    showSelectedExportDiv: boolean = false;
    showAllExportDiv: boolean = false;
    toggleSearchableDiv: boolean = false;
    totalRows: number;
    regionFilter: any = {
        isAmericas: false,
        isEMEA: false,
        isAPAC: false
    };
    rowDataExport = [];
    manualSelectedRows = [];
    currentIndex: number = 0;
    currentIndexBelow: number = 1;
    defaultExpColDef: {
        sortable: false;
        filter: false;
        width: 70;
    };
    savedFilters: UserFilter[];
    allBucketData: any;
    oppNameFields: GridColumn[] = [];
    selectedData: Pipeline;
    groupDisplayType = "custom";
    parentField = "pipelineGrid";
    gridApi: GridApi;
    gridColumnApi;
    gridApiExp: GridApi;
    rowData = [];
    columnDefs: ColDef[];
    displayCount: number = 0;
    selectedPipelineRegion: any;
    employeeRegion: string[];
    includeNulls = false;
    regions = [];
    roleID = this._coreService.loggedInUserRoleId;
    gridLoading: boolean;
    public rowSelection = "multiple";
    public rowMultiSelect: boolean = false;
    oldCellValue: any = [];
    isExportSectionVisible: boolean = false;
    selectedExportType: string;
    opportunityStage: OpportunityStage[] = [];
    registrationStage: RegistrationStage[] = [];
    public bainOffices: Office[];
    bucketRowType = BucketRowType;
    pipelineBucketData: PipelineBucket[] = [];
    masterColumnDef: any;
    groupData: BucketGroup[] = [];
    estimatedStartDate: any;
    opsLikelihood: OpsLikelihood[];
    externalFilterSuperSet: any[] = [];
    isTemporary: boolean = false;
    gridOptions: GridOptions = {
        context: {
            componentParent: this
        },
        immutableData: true,
        sortingOrder: ["desc", "asc"],
        defaultColDef: {
            ...this.pipelineGridService.getDefaultColumnDefinition,
            floatingFilter: false
        },
        unSortIcon: false,
        suppressMenuHide: true,
        suppressColumnVirtualisation: true,
        singleClickEdit: false,
        stopEditingWhenCellsLoseFocus: true,
        suppressRowClickSelection: false,
        headerHeight: 30,
        tooltipShowDelay: 0,
        getRowNodeId: (pipeline: Pipeline) => pipeline.poId,
        rowHeight: 25,
        accentedSort: true,
        rowBuffer: 2,
        valueCache: true,
        animateRows: false,
        suppressCsvExport: false,
        suppressContextMenu: false,
        onFilterChanged: this.onFilterChanged.bind(this),
        onGridReady: this.onGridReady.bind(this),
        onRowSelected: this.getSelectedRowData.bind(this),
        onFirstDataRendered: this.onFirstDataRendered.bind(this),
        onRowDataChanged: this.onRowDataChanged.bind(this),
        onCellEditingStopped: this.onCellValueChanged.bind(this),
        onCellEditingStarted: this.onCellEditingStarted.bind(this),
        onCellClicked: this.onCellClicked.bind(this),
        onCellDoubleClicked: this.onCellDoubleClicked.bind(this),
        onColumnVisible: this.onColumnVisible.bind(this),
        onCellKeyPress: this.onCellKeyPress.bind(this),
        rowClassRules: {
            "row-opp-selected": this.setSelectedGridRows.bind(this)
        },
        sideBar: {
            toolPanels: [
                {
                    id: "columns",
                    labelDefault: "Columns",
                    labelKey: "columns",
                    iconKey: "columns",
                    toolPanel: "agColumnsToolPanel",
                    width: 300,
                    toolPanelParams: {
                        suppressRowGroups: true,
                        suppressValues: true,
                        suppressPivots: true,
                        suppressPivotMode: true
                    }
                },
                {
                    id: "filters",
                    labelKey: "filters",
                    labelDefault: "Filters",
                    iconKey: "filter",
                    toolPanel: "agFiltersToolPanel",
                    width: 300
                },
                {
                    id: "oppNameConstruct",
                    labelDefault: "Opportunity Name",
                    labelKey: "linked",
                    iconKey: "linked",
                    toolPanel: "OpportunityNameToolPanelComponent",
                    width: 300
                }
            ]
        },

        frameworkComponents: {
            iconsRendererComponent: IconsRendererComponent,
            CustomCellPipelineComponent: CustomCellPipelineComponent,
            textFilterComponent: TextFilterComponent,
            LocationCellRendererComponent: LocationCellRendererComponent,
            PriorityCellEditorComponent: PriorityCellEditorComponent,
            clientCellRenderer: PipelineClientRenderer,
            CustomCellComponent: CustomCellComponent,
            CustomCellTeamsizeComponent: CustomCellTeamsizeComponent,
            DateDropdownComponent: DateDropdownComponent,
            OfficeDropdownComponent: OfficeDropdownComponent,
            ClientDropdownComponent: ClientDropdownComponent,
            LeadershipDropdownComponent: LeadershipDropdownComponent,
            ExpectedLeadershipComponent: ExpectedLeadershipComponent,
            targetTypeCellRenderer: TargetTypeRendererComponent,
            RecordCellComponent: RecordCellComponent,
            WorkPhaseCellEditorComponent: WorkPhaseCellEditorComponent,
            WorkPhaseCellRendererComponent: WorkPhaseCellRendererComponent,
            SimpleTextEditorComponent: SimpleTextEditorComponent,
            SingleValueTooltipComponent: SingleValueTooltipComponent,
            MultiValueTooltipComponent: MultiValueTooltipComponent,
            EmployeeEditorComponent: EmployeeEditorComponent,
            ClientTypeEditorComponent: ClientTypeEditorComponent,
            ExpectedStartEditorComponent: ExpectedStartEditorComponent,
            OpsLeadCellRendererComponent: OpsLeadCellRendererComponent,
            IndustrySectorEditorComponent: IndustrySectorEditorComponent,
            PipelineStatusEditorComponent: PipelineStatusEditorComponent,
            DealCountryCellRendererComponent: DealCountryCellRendererComponent,
            LocationTooltipRendererComponent: LocationTooltipRendererComponent,
            ExpectedStartDateToolTipComponent: ExpectedStartDateToolTipComponent,
            LocationCellEditorComponent: LocationCellEditorComponent,
            agClientEditor: ClientEditorComponent,
            industryEditorComponent: IndustryDropdownComponent,
            agSingleDateEditor: SingleDateTextEditorComponent,
            agCaseEditor: CaseEditorComponent,
            TeamSizeEditorComponent: TeamSizeEditorComponent,
            CaseComplexityEditorComponent: CaseComplexityEditorComponent,
            AdditionalServicesEditorComponent: AdditionalServicesEditorComponent,
            OpportunityStageEditorComponent: OpportunityStageEditorComponent,
            OfficeCellEditorComponent: OfficeCellEditorComponent,
            OpportunityNameToolPanelComponent: OpportunityNameToolPanelComponent,
            ClientCommitmentComponent: ClientCommitmentComponent,
            QuestionCellEditorComponent: QuestionCellEditorComponent,
            BooleanCellEditorComponent: BooleanCellEditorComponent,
            OfficeTreeCellEditorComponent: OfficeTreeCellEditorComponent,
            RequiredLanguageEditor: RequiredLanguageEditorComponent,
            DurationCellEditorComponent: DurationCellEditorComponent,

            EmployeeNoteEditorComponent: EmployeeNoteEditorComponent,
            EmployeeNotesToolTipComponent: EmployeeNotesToolTipComponent,
            OpsLikelihoodComponent: OpsLikelihoodComponent,
            ConflictsGridTooltipComponent: ConflictsGridTooltipComponent,

        }
    };


    gridOptionsExpo: GridOptions = {
        rowHeight: 30,
        rowSelection: "multiple",
        onGridReady: this.onGridReadyExpo.bind(this),
        onRowSelected: this.getRowDataSelToExport.bind(this)
    };
    // Filter External Applied //
    filtersApplied: any = [];

    // To set the weekly buckets
    weeklyBucketData: PipelineBucket[] = [];
    preferenceUpdate: any = false;

    weekOffset: number = 0; // Number of weeks to offset the starting week

    // Store selected opportunity to pass onto details popup
    selectedOpportunity: any;
    // Controls whether or not each weekly bucket is expanded.
    // 0 - hidden, 1 - 1x width, 2 - 2x width
    bucketWidthController: number[] = [1, 1, 1, 1];

    // Controls opportunity stage and region filters for the pipeline grid
    public selectedOppStage: number[];
    selectedRegion = [];

    selectedFilter = undefined;
    defaultSort: any = null;
    userColumnList = [];

    draggingBucketGroup: Boolean = false; // Passed to date bucket columns to show draggable areas
    addingNewGroup: Boolean = false; // Passed to date bucket columns to enable/disable buttons while waiting for a server response

    // For Pipeline Conflict
    isPipelineConflicted: boolean;

    // For Column span
    bucketColumnPreference: BucketColumnPreference[];
    columnSpanObject = {
        bucket: null,
        span: 1
    };

    // For assigning opportunities in the grid to buckets
    oppToBeAssigned: any;
    isAssigningOpp: boolean = false; // Flag for readability in template
    isCurtainCollapsed: boolean = false; // Flag for readability in template
    assignOppDisplayName: string;
    curtainState: CurtainState = CurtainState.Expanded;

    @ViewChild(OppSlideoutComponent) oppSlideout: OppSlideoutComponent;
    @ViewChildren(DateBucketsColumnComponent) dataBucketComponent: QueryList<DateBucketsColumnComponent>;

    // split view
    @ViewChild(SplitComponent) splitEl: SplitComponent;
    @ViewChildren(SplitAreaDirective) areasEl: QueryList<SplitAreaDirective>;

    private currentUpdatingField: string = '';
    public activeUsers: any;
    public currentUser: any;

    public popupParent: any;

    @HostListener('document:keydown.control.z', ['$event'])
    onKeyDownUndo(event: KeyboardEvent): void {
        event.preventDefault();
        this.store.dispatch(undo());
    }

    @HostListener('document:keydown.control.y', ['$event'])
    onKeyDownRedo(event: KeyboardEvent): void {
        event.preventDefault();
        this.store.dispatch(redo());
    }

    @HostListener('document:keydown.escape', ['$event'])
    onKeydownHandler(event: KeyboardEvent): void {
        if (this.isAssigningOpp) {
            this.endAssignOpp();
        }
    }
    @ViewChild(DateBucketsColumnComponent) child: DateBucketsColumnComponent;
    constructor(
        private registrationService: RegistrationService,
        private pipelineService: PipelineService,
        private toastr: PegTostrService,
        private _coreService: CoreService,
        private pipelineGridService: PipelineGridColumnService,
        private globalService: GlobalService,
        private modalService: BsModalService,
        private coreSerivce: CoreService,
        private renderer: Renderer2,
        private signalRService: SignalRService,
        private router: Router,
        private store: Store<{ events: { events: any[] } }>,
        private activatedRoute: ActivatedRoute,
        private location: Location,
    ) {





        this.renderer.listen("window", "click", (e: Event) => {

            if (e.target["id"] != "oppSource" && e.target["id"] != "dropPlaceholderToggle" && e.target["id"] != "closeButton" && e.target["id"] != "opsSlideOutPopup" && document.querySelectorAll("#pipelineGrid:hover").length == 0) {
                this.resertBucketSelection();
            }
        });

        //START - Subjects for passing data from navigation bar component
        this.pipelineService.redrawPipeGrid$.subscribe(
            (data) => {
                this.gridApi.setColumnDefs(data);
                this.triggerUpdateAfterVisibilityChanges();
            },
            (err) => console.log(err)
        );



        //END - Subjects for passing data from navigation bar component

        //Setting region data
        this.pipelineService.regionFilterChange.subscribe(
            (data) => {
                this.regionFilter = data;
                this.getPipelineData(true);
            },
            () => { },
            () => {
                this.pipelineService.regionFilterChange.unsubscribe();
            }
        );

        this.pipelineService.deletePipelineBucket.subscribe((data) => {
            this.deleteWeeklyBucketData(data);
        });

        this.pipelineService.deletePipelineBucketGroup.subscribe((data) => {
            this.deleteWeeklyBucketGroupData(data);
        });

        this.pipelineService.updateOppStage.subscribe((updateData) => {
            this.updateStgeAfterSold(updateData);
        });


        // got the data from undo and redo
        // This will be triggered from ngrx actions undo and redo in undoable.actions.ts
        this.store.select('events').subscribe(events => {
            let existingStoreData: any = events;

            if (existingStoreData != null && existingStoreData.type == 'undo' && existingStoreData.redoStack != null && existingStoreData.redoStack.length > 0) {
                switch (existingStoreData.redoStack[0].eventname) {
                    case 'dragOppRow': {
                        //statements; 
                        let lastUndoBucketData = JSON.parse(JSON.stringify(existingStoreData.redoStack[0].pipelineData));
                        this.updateWeeklyBucketData(lastUndoBucketData);
                        this.toastr.showSuccess("Buckets edited!", "Undo");
                        break;
                    }
                    case 'draGroup': {
                        //statements; 
                        let lastUndoBucketGroupData = JSON.parse(JSON.stringify(existingStoreData.redoStack[0].pipelineData));

                        this.child.unduBucketGroupDrop(lastUndoBucketGroupData);
                        this.toastr.showSuccess("Buckets edited!", "Undo");

                        break;
                    }
                    case 'dragOpp': {
                        //statements; 
                        let lastUndoBucketData = JSON.parse(JSON.stringify(existingStoreData.redoStack[0].pipelineData));
                        this.updateWeeklyBucketData(lastUndoBucketData);
                        this.toastr.showSuccess("Buckets edited!", "Undo");

                        break;
                    }
                    case 'managerLocationChange': {
                        //statements; 
                        let lastUndoBucketMngrLocationData = JSON.parse(JSON.stringify(existingStoreData.redoStack[0].pipelineData));
                        this.updateWeeklyBucketData(lastUndoBucketMngrLocationData);
                        this.toastr.showSuccess("Buckets edited!", "Undo");

                        break;
                    }
                    case 'undoPlaceholder': {
                        //statements; 
                        let lastUndoBucketPlaceholderData = JSON.parse(JSON.stringify(existingStoreData.redoStack[0].pipelineData));
                        this.deleteWeeklyBucketData(lastUndoBucketPlaceholderData);
                        this.toastr.showSuccess("Buckets edited!", "Undo");

                        break;
                    }

                    case 'undoGroup': {
                        //statements; 
                        let lastUndoGroupData = JSON.parse(JSON.stringify(existingStoreData.redoStack[0].pipelineData));
                        this.deleteWeeklyBucketGroupData(lastUndoGroupData);
                        this.toastr.showSuccess("Buckets edited!", "Undo");

                        break;
                    }

                    case 'savePipeline': {
                        //statements; 
                        let lastUndoPipelineData = JSON.parse(JSON.stringify(existingStoreData.redoStack[0].pipelineData));
                        let lastUndoFieldName = existingStoreData.redoStack[0].fieldName;
                        this.savePipeline(lastUndoPipelineData, lastUndoFieldName);
                        this.toastr.showSuccess("Grid text edited!", "Undo");

                        break;
                    }
                    default: {

                        break;
                    }
                }
            }

            if (existingStoreData != null && existingStoreData?.type == 'redo' && existingStoreData.undoStack != null && existingStoreData.undoStack.length > 0) {
                switch (existingStoreData.redoStack[0].eventname) {
                    case 'dragOppRow': {
                        //statements; 
                        let lastRedoBucketData = JSON.parse(JSON.stringify(existingStoreData.undoStack[0].pipelineData));
                        this.updateWeeklyBucketData(lastRedoBucketData);
                        break;
                    }
                    case 'draGroup': {
                        //statements; 
                        let lastRedoBucketGroupData = JSON.parse(JSON.stringify(existingStoreData.undoStack[0].pipelineData));
                        this.child.unduBucketGroupDrop(lastRedoBucketGroupData);
                        break;
                    }
                    case 'dragOpp': {
                        //statements; 
                        let lastRedoBucketData = JSON.parse(JSON.stringify(existingStoreData.undoStack[0].pipelineData));
                        this.updateWeeklyBucketData(lastRedoBucketData);
                        break;
                    }
                    case 'managerLocationChange': {
                        //statements; 
                        let lastUndoBucketMngrLocationData = JSON.parse(JSON.stringify(existingStoreData.undoStack[0].pipelineData));
                        this.updateWeeklyBucketData(lastUndoBucketMngrLocationData);
                        break;
                    }
                    case 'undoPlaceholder': {
                        //statements; 
                        let lastUndoBucketPlaceholderData = JSON.parse(JSON.stringify(existingStoreData.undoStack[0].pipelineData));
                        this.deleteWeeklyBucketData(lastUndoBucketPlaceholderData);
                        break;
                    }
                    case 'undoGroup': {
                        //statements; 
                        let lastUndoGroupData = JSON.parse(JSON.stringify(existingStoreData.undoStack[0].pipelineData));
                        this.deleteWeeklyBucketGroupData(lastUndoGroupData);
                        break;
                    }
                    case 'savePipeline': {
                        //statements; 
                        let lastRedoPipelineData = JSON.parse(JSON.stringify(existingStoreData.undoStack[0].pipelineData));
                        let lastRedoFieldName = existingStoreData.undoStack[0].fieldName;
                        this.savePipeline(lastRedoPipelineData, lastRedoFieldName);
                        break;
                    }
                    default: {

                        break;
                    }
                }
            }

        });
    }


    onCellKeyPress(e: CellKeyPressEvent) {
        // this.oppSlideout.opportunity=undefined;
        if (e.event) {
            var keyPressed = (e.event as KeyboardEvent).key;
            if (keyPressed === "Enter" && e.colDef.field.toLowerCase() == "oppname") {
                this.selectedOpportunity = JSON.parse(JSON.stringify(e.node.data));
                this.oppSlideout.showPanel(true);
            }
        }
    }
    onSavedFilterChange(event) {
        this.userColumnList = [];

        if (event) {
            this.selectedFilter = event;

            this.pipelineService
                .getFilterByFilterId(event.filterTemplateId, PagesTypes.HomeDashboard)
                .subscribe((data) => {
                    if (data && data.roleColumn) {
                        if (data && data.sortTemplateValue) {
                            this.selectedFilter.sortTemplateValue = data.sortTemplateValue;
                            let existingSort = data.roleColumn.filter((x) => x.sortType != null);

                            existingSort?.forEach((existingSortElement) => {
                                existingSortElement.sortType = null;
                            });

                            const sortTemplateValue = JSON.parse(data.sortTemplateValue);

                            let sortTemplateField = sortTemplateValue.filter(x => x.sort != null)

                            sortTemplateField.sort((a, b) => {
                                if (a.sortIndex < b.sortIndex) return -1;
                                if (a.sortIndex > b.sortIndex) return 1;
                                return 0;
                            });

                            sortTemplateField.forEach((element, sortIndex) => {
                                let columnindex = data.roleColumn.findIndex((x) => x.columnId == element.colId);
                                data.roleColumn[columnindex].sortType = element.sort;
                                data.roleColumn[columnindex].sortIndex = sortIndex;
                            });
                        } else {
                            this.selectedFilter.sortTemplateValue = JSON.stringify(this.gridColumnApi.getColumnState());
                        }

                        this.columnDefs = this.pipelineGridService.getColumnDefinitions(data.roleColumn);

                        // Set column groupings from filter
                        if (data && data.groupingTemplateValue) {
                            let rowGroups: any[] = JSON.parse(data.groupingTemplateValue);

                            // Remove all column grouping
                            this.columnDefs.forEach(colDef => {
                                colDef.rowGroup = false;
                            });


                            this.columnDefs.filter(col => rowGroups.indexOf(col.colId) > -1).forEach(col => {
                                col.rowGroup = true;
                            });

                            // Expand all top level groups
                            this.setGroupExpandProperty();

                            this.selectedFilter.groupingTemplateValue = data.groupingTemplateValue;
                        }
                    }
                    if (data && data.filterTemplateValue) {
                        this.gridApi.setFilterModel(JSON.parse(data.filterTemplateValue));
                    }
                    this.selectedFilter.roleColumn = JSON.stringify(this.columnDefs);
                    this.selectedFilter.filterTemplateValue = JSON.stringify(this.gridApi.getFilterModel());
                });
        } else {
            this.pipelineService.getUserColumns(PagesTypes.HomeDashboard).subscribe((columns: GridColumn[]) => {
                this.defaultColumns = columns;
                this.oppNameFields = columns
                    .filter((e) => e.isOppName == true)
                    .sort((a, b) => (a.oppSortOrder < b.oppSortOrder ? -1 : 1));
                this.pipelineGridService.setOppNameFields(this.oppNameFields);
                this.columnDefs = this.pipelineGridService.getColumnDefinitions(columns);
            });
        }
    }


    clearSelectedFilter(event) {
        this.gridApi.setFilterModel(null);
        this.gridColumnApi.applyColumnState(JSON.parse(this.defaultSort));
        this.selectedFilter = undefined;
    }

    getOpportunityStageMasterData() {
        this.globalService.getOpportunityStage().subscribe((res) => {
            this.opportunityStage = res;
        });
    }
    getRegistrationStageMasterData() {
        this.globalService.getRegistrationStage().subscribe((res) => {
            this.registrationStage = res;
        });
    }

    onColumnMoved(event: any) {
        if (
            event.source != "gridOptionsChanged" &&
            (event.source == "uiColumnDragged" || event.type == "columnMoved")
        ) {
            this.mapColumnAttributes(
                event.columnApi.columnModel.gridColumns,
                event.columnApi.columnModel.displayedColumns
            );
        }

        this.gridApi.ensureColumnVisible(event.column);
    }

    onKeyPressPlaceholderChange(event) {
        // this will clear and rest the highlights when user remove all the value from Placeholder
        if (event.target.value.trim() == "") {
            this.setPipelineBucketData(this.pipelineBucketData);
        }
    }
    mapPlaceholderHighlights(bucketdata) {
        this.resetPlaceholderSearch();

        let inputBoxValue: string = "";
        let placeholderBox: HTMLInputElement = document.getElementById("searchManagerBox") as HTMLInputElement;

        if (placeholderBox) {
            inputBoxValue = placeholderBox.value;
        }

        if (inputBoxValue && inputBoxValue != "") {

            let searchKey = inputBoxValue.split(",");

            searchKey.forEach((term) => {
                if (term == "" || term == " ") {
                    return false;
                }

                bucketdata.forEach((bucketItem: PipelineBucket) => {
                    // let searchableName;
                    let temp = [];

                    if (bucketItem.employee && bucketItem.employee.employeeCode != "") {
                        temp.push(CommonMethods.getEmployeeName(bucketItem.employee));
                    }

                    if (bucketItem.office && bucketItem.office.officeCode > 0) {
                        temp.push(bucketItem.office.officeName);
                    }

                    if (bucketItem.pipelineBucketMapping) {
                        bucketItem.pipelineBucketMapping.forEach((mapping) => {
                            if (mapping.pipeline) {
                                temp.push(mapping.pipeline.oppName);
                            }
                        });
                    }

                    let finalSearch = temp.join(" ");

                    if (finalSearch && finalSearch?.toLowerCase().includes(term?.toLowerCase())) {
                        bucketItem.isHighlightedOnSearch = true;

                        //Expand the highlighted row
                        let lab = "[bucketvalue='" + bucketItem.bucketGroupId + "']";
                        let selectedRowDOM = document.querySelectorAll(
                            "[bucketvalue='" + bucketItem.bucketGroupId + "'].example-list"
                        );

                        if (selectedRowDOM && selectedRowDOM.length > 0) {
                            let weekNo = selectedRowDOM[0].getAttribute("weekNumber");
                            let bucketHtmlId = "week" + weekNo + "bucket" + bucketItem.bucketGroupId;

                            document.getElementById(bucketHtmlId)?.classList.add("show");

                            let expandBucket = document.querySelectorAll("[data-target='#" + bucketHtmlId + "']");
                            expandBucket.forEach((element) => {
                                element?.setAttribute("aria-expanded", "true");
                            });
                        }
                    }
                });
            });
        }
    }

    onPlaceholderSearchChange() {
        this.setPipelineBucketData(this.pipelineBucketData);
    }

    resetPlaceholderSearch() {
        let bucketdata = this.pipelineBucketData;
        bucketdata.forEach((bucketItem: PipelineBucket) => {
            bucketItem.isHighlightedOnSearch = false;
        });

        return bucketdata;
    }

    mapColumnAttributes(gridColumnList: any[], displayedColumns: any[]) {
        this.userColumnList = [];
        let userColumn: UserColumn;
        gridColumnList.forEach((element, index) => {
            userColumn = new UserColumn();
            userColumn.columnId = element.colId;
            userColumn.userColumnId = 0;
            userColumn.lastUpdated = new Date();
            userColumn.sortOrder = index;
            userColumn.columnWidth = element.actualWidth;

            let isPresent: boolean = displayedColumns.some((x) => x.colId == element.colId);
            userColumn.isHide = !isPresent;

            let OpportunityField = this.defaultColumns.find((x) => x.columnId == Number.parseInt(element.colId));
            if (OpportunityField) {
                userColumn.oppSortOrder = OpportunityField.oppSortOrder;
                userColumn.isOppName = OpportunityField.isOppName ? OpportunityField.isOppName : false;
            } else {
                userColumn.oppSortOrder = 0;
                userColumn.isOppName = false;
            }
            userColumn.employeeCode = this._coreService.loggedInUser.employeeCode;
            userColumn.pageId = PagesTypes.HomeDashboard;
            userColumn.lastUpdatedBy = this._coreService.loggedInUser.employeeCode;
            this.userColumnList.push(userColumn);
        });
        this.saveUserPrefrences(this.userColumnList);
    }

    saveUserPrefrences(userColumnList) {
        this.pipelineService.savePipelineColumnPrefrences(userColumnList, false).subscribe((res) => {
            let val: GridColumn[] = res;
            this.defaultColumns = val;
            this.pipelineService.preferenceChanges$.next(val);
            this.toastr.showSuccess("Preferences has been saved", "Success");
        });
    }

    onColumnVisible(event) {
        this.mapColumnAttributes(event.columnApi.columnModel.gridColumns, event.columnApi.columnModel.displayedColumns);

        if (event.visible) {
            this.gridApi.ensureColumnVisible(event.column);
        }

    }
    onWidthChanged(event) {
        if (event.source === "uiColumnDragged" && event.finished) {
            this.mapColumnAttributes(
                event.columnApi.columnModel.gridColumns,
                event.columnApi.columnModel.displayedColumns
            );
        }
    }
    ngOnInit() {
        forkJoin([
            this.globalService.getRegistrationStage(),
            this.globalService.getOpportunityStage(),
            this.pipelineService.getUserColumnPreference(),
            this.globalService.getOffice(),
            this.globalService.getOpsLikelihood(),
            this.pipelineService.getUserPreferenceRegion()
        ]).subscribe(([resRegistrationStage, resOpportunityStage, resUserColumnPreference, resOffice, resOpsLikelihood, resUserPreferenceRegion]) => {

            this.registrationStage = resRegistrationStage;
            this.opportunityStage = resOpportunityStage;
            this.bucketColumnPreference = JSON.parse(JSON.stringify(this.makeColumnValueDefaultSetToDay(resUserColumnPreference)))
            this.bainOffices = resOffice;

            if (resOpsLikelihood) {
                this.opsLikelihood = resOpsLikelihood.sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1));;
            }

            resUserPreferenceRegion.forEach(region => {
                switch (region.regionId) {
                    case Region.Americas:
                        if (region.isChecked) {
                            this.regionFilter.isAmericas = true;
                        }
                        break;

                    case Region.EMEA:
                        if (region.isChecked) {
                            this.regionFilter.isEMEA = true;
                        }
                        break;

                    case Region.APAC:
                        if (region.isChecked) {
                            this.regionFilter.isAPAC = true;
                        }
                        break;
                }
            });
            this.getColumnData();
            this.initializeSignalR();
            this.popupParent = document.querySelector('.split-area-pane');
        })

    }

    getUserRegionPreference() {
        this.pipelineService.getUserPreferenceRegion().subscribe(res => {
            res.forEach(region => {
                switch (region.regionId) {
                    case Region.Americas:
                        if (region.isChecked) {
                            this.regionFilter.isAmericas = true;
                        }
                        break;

                    case Region.EMEA:
                        if (region.isChecked) {
                            this.regionFilter.isEMEA = true;
                        }
                        break;

                    case Region.APAC:
                        if (region.isChecked) {
                            this.regionFilter.isAPAC = true;
                        }
                        break;
                }
            });
        })
    }
    makeColumnValueDefaultSetToDay(data) {
        let backupResults = JSON.parse(JSON.stringify(data))
        if (this.coreSerivce.appSettings?.PipelineFridayDefaultColumnValue?.some(x => x == moment().day())) {
            data.forEach(element => {
                if (element.weekNumber == 0) {
                    element.columnValue = backupResults[1].columnValue;
                } else if (element.weekNumber == 1) {
                    element.columnValue = backupResults[0].columnValue;
                }
            });

        }
        return data;
    }
    onUserColumnPreference() {
        this.pipelineService.getUserColumnPreference().subscribe(res => {
            this.bucketColumnPreference = JSON.parse(JSON.stringify(this.makeColumnValueDefaultSetToDay(res)))
        })
    }
    onDragOver(event: any) {
        var dragSupported = event.dataTransfer.types.length;

        if (dragSupported) {
            event.dataTransfer.dropEffect = "move";
        }
        event.preventDefault();
    }

    outOpportunityMove(event) {

        if (event && event?.expectedStart?.expectedStartDate == null) {
            event.expectedStart = undefined;
        }
        this.resetCurrentGroupNode();
        let index = this.rowData.findIndex((x) => x.poId == event.poId);
        this.rowData[index] = event;
        this.gridApi.setRowData(this.rowData);
        var rowNode = this.gridApi.getRowNode(event.poId.toString());
        if (rowNode) {
            rowNode.setData(event);
            var params = { force: true, suppressFlash: true, update: [rowNode] };

            this.gridApi.redrawRows({ rowNodes: [rowNode] });
            this.gridApi.refreshCells(params);
        }
        this.setGroupExpandProperty();
        this.getPipelineBucket();
    }
    outOnMergeSuccess() {
        this.getPipelineBucket();
    }
    onDrop(event: any) {
        let item = event.dataTransfer.getData("application/json");
        let pipeline: Pipeline = JSON.parse(item).data;
        if (!pipeline?.oppName) {
            this.toastr.showWarning("Blank opportunity can't be dropped to bucket", "Warning");
            return;
        }
        if (event.target.id == "oppSource" || event.target.id == "textAreaOpp") {
            let weekNumber = parseInt(event.target.getElementsByClassName("weeknumber")[0].id);
            let rowId = event.target.getElementsByClassName("contentRowId")[0].id;

            this.bucketData = { pipelineData: pipeline, rowId: rowId, weekNumber: weekNumber, newRow: false, isFromContextMenu: false };
            event.preventDefault();
        } else if (
            event.target.id == "dropPlaceholder" ||
            event.target.id == "groupRowHeader" ||
            event.target.id == "dropPlaceholderToggle"
        ) {
            let weekNumber = parseInt(event.target.getElementsByClassName("weeknumber")[0].id);
            let bucketGroupId = parseInt(event.target.getElementsByClassName("bucketGroupId")[0].id);
            let tempRowId = CommonMethods.getGUID();
            if (tempRowId != undefined && tempRowId != "") {
                this.bucketData = {
                    pipelineData: pipeline,
                    rowId: tempRowId,
                    weekNumber: weekNumber,
                    newRow: true,
                    bucketGroupId: bucketGroupId,
                    isFromContextMenu: false
                };
                event.preventDefault();
            }
        }
    }

    // Assign an opp to a new with provided data
    assignOppFromGrid(params) {
        let weekNumber = params.weekNumber;
        let bucketGroupId = params.item.bucketGroupId;
        let tempRowId = CommonMethods.getGUID();
        let newRow = true;
        let isFromContextMenu = true;

        if (params.item.tmpPipelineBucketId) {
            tempRowId = params.item.tmpPipelineBucketId;
            newRow = false;
        }

        if (tempRowId != undefined && tempRowId != "") {
            this.bucketData = {
                pipelineData: this.oppToBeAssigned,
                rowId: tempRowId,
                weekNumber: weekNumber,
                newRow: newRow,
                bucketGroupId: bucketGroupId,
                isFromContextMenu: isFromContextMenu
            };
        }

        this.endAssignOpp();

        // Keep curtain collapsed after assigning
        this.onCurtainChange(CurtainState.Collapsed);
    }

    onRegistrationSelect(registrationId) {
        let regionFilter = this.mapRegionToIds();
        this.registrationService.addRegistrationToPipeline(registrationId, regionFilter).subscribe((res) => {
            if (res.pipelineId > 0) {
                if (res && !res?.expectedStart?.expectedStartDate) {
                    res.expectedStart = undefined
                }
                this.rowData.unshift(res);
                let row: RowDataTransaction = { add: [res], addIndex: 0 };
                let rowNode: RowNodeTransaction = this.gridApi.applyTransaction(row);
                this.toastr.showSuccess("Registration added to pipeline", "Success");

                if (rowNode.add.length > 0) {
                    let node = rowNode.add[0];
                    // Ensure the row is visible after a brief delay to allow the grid to render
                    let self = this;
                    setTimeout(function () {
                        self.gridApi.ensureIndexVisible(rowNode.add[0].rowIndex, "middle");
                        self.gridApi.deselectAll();
                        node.setSelected(true);
                    }, 100);

                }
            }
        });
    }

    showRegistrationInGrid(registrationId) {
        if (registrationId && registrationId != 0) {
            // Ensure the row is visible to allow the grid to render          
            let rowNode = this.gridApi.getRowNode(registrationId.toString());
            if (rowNode) {
                this.gridApi.ensureIndexVisible(rowNode.rowIndex, "middle");
                this.gridApi.deselectAll();
                rowNode.setSelected(true);
            }
            if (!this.gridApi.getRenderedNodes().some(x => x?.data?.registrationId == registrationId)) {
                this.toastr.showWarning("Please adjust the filter to see the opportunity.", "Can't Highlight selected Opportunity");
            }
            else {
                this.toggleSearchableDiv = !this.toggleSearchableDiv;
            }

        }
    }

    onCellContextMenu(event: CellContextMenuEvent) {
        this.selectedData = undefined;
        this.selectedData = event.data;
        this.currentIndex = 0;
        this.currentIndexBelow = 0;
    }

    onFirstDataRendered() {
        if (this.gridApi && this.columnDefs && this.columnDefs.length) {
            this.getUserFilter();
            this.resetDisplayCount();

        }
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        this.resetDisplayCount();
        this.masterColumnDef = this.gridApi.getColumnDefs();
    }

    resetDisplayCount() {
        if (this.gridApi) {
            this.displayCount = this.rowData?.length;
        }
    }

    onRefreshGrid(value) {
        this.regionFilter = value.regionFilter;
        if (this.gridApi) {
            this.resetCurrentGroupNode();
        }
        this.onSavedFilterChange(this.selectedFilter);
        this.getPipelineData(true);
    }

    defaultColumns: GridColumn[] = [];
    getColumnData() {
        this.pipelineService.getUserColumns(PagesTypes.HomeDashboard).subscribe((columns: GridColumn[]) => {

            if (columns != undefined && columns.length > 0) {
                this.defaultColumns = columns;
                this.oppNameFields = columns
                    .filter((e) => e.isOppName == true)
                    .sort((a, b) => (a.oppSortOrder < b.oppSortOrder ? -1 : 1));
                this.pipelineGridService.setOppNameFields(this.oppNameFields);
                // let primaryColumnDefs: ColDef[] = [];
                this.columnDefs = this.pipelineGridService.getColumnDefinitions(columns);
                //calling grid data once column is rendered.
                this.getOffices();
            }
        });
    }

    getOffices() {
        this.globalService.getOffice().subscribe((office) => {
            this.bainOffices = office;
            this.getPipelineData();
        });
    }

    //To avoid get the filter which have been already applied
    compareExternalFilter(): any {
        const setExternalFilter = new Set(this.externalFilterSuperSet);
        if (filterTypeArray.every(filter => setExternalFilter.has(filter))) {
            return false;
        }
        else {
            let newFilters = filterTypeArray.filter(item => !setExternalFilter.has(item));
            this.externalFilterSuperSet = this.externalFilterSuperSet.concat(newFilters);
            return true;
        }
    }

    getPipelineData(resetGrid: boolean = false) {
        if ((this.compareExternalFilter() || resetGrid) && filterTypeArray?.length > 0) {
            this.gridLoading = true;
            if (this.gridApi) {
                this.defaultSort = JSON.stringify(this.gridColumnApi.getColumnState());
                this.gridApi.showLoadingOverlay();
            }

            let regionFilterText = this.mapRegionToIds();
            let filterTypes = ''
            filterTypes = filterTypeArray.join(',');

            this.pipelineService.getPipelineData(regionFilterText, "1,2", filterTypes).subscribe((res) => {
                this.rowData = res;
                this.setOfficeCluster();
                this.getPipelineBucket();
                this.getUserFilter();

                if (resetGrid && this.selectedFilter && this.curtainState != CurtainState.Collapsed) {
                    this.gridApi.setFilterModel(JSON.parse(this.selectedFilter.filterTemplateValue));
                    this.ApplieFilter(this.selectedFilter)
                }

                if (this.router != undefined && this.activatedRoute.queryParams != undefined) {
                    this.activatedRoute.queryParams.subscribe(data => {
                        if (data != undefined && data.hasOwnProperty('registrationid')) {
        
                            this.selectedOpportunity = {
                                registrationId: data.registrationid
                            }
                            this.oppSlideout.showPanel(true);
                            this.isPipelineConflicted = true;
                        }
                    });
                }

                this.toastr.showSuccess("Pipeline loaded successfully", "Success");
            });

        }

        if (this.selectedFilter?.filterTemplateValue && this.curtainState != CurtainState.Collapsed) {
            this.ApplieFilter(this.selectedFilter)
        }


    }

    defaultColumnData: GridColumn[] = [];
    ApplieFilter(event) {
        let columnData = JSON.stringify(this.defaultColumns);
        this.defaultColumnData = JSON.parse(columnData);

        if (event) {
            this.selectedFilter = event;
            if (this.defaultColumnData) {
                if (event.sortTemplateValue) {
                    this.selectedFilter.sortTemplateValue = event.sortTemplateValue;
                    let existingSort = this.defaultColumnData.filter((x) => x.sortType != null);

                    existingSort?.forEach((existingSortElement) => {
                        existingSortElement.sortType = null;
                    });
                    let sortTemplateValue = JSON.parse(event.sortTemplateValue);

                    let sortTemplateField = sortTemplateValue.filter(x => x.sort != null)

                    sortTemplateField.sort((a, b) => {
                        if (a.sortIndex < b.sortIndex) return -1;
                        if (a.sortIndex > b.sortIndex) return 1;
                        return 0;
                    });


                    sortTemplateField.forEach((element, sortIndex) => {
                        let columnindex = this.defaultColumnData.findIndex((x) => x.columnId == element.colId);
                        this.defaultColumnData[columnindex].sortType = element.sort;
                        this.defaultColumnData[columnindex].sortIndex = sortIndex;
                    });
                } else {
                    this.selectedFilter.sortTemplateValue = JSON.stringify(this.gridColumnApi.getColumnState());
                }

                this.columnDefs = this.pipelineGridService.getColumnDefinitions(this.defaultColumnData);

                // Set column groupings from filter
                if (event && event.groupingTemplateValue) {
                    let rowGroups: any[] = JSON.parse(event.groupingTemplateValue);

                    // Remove all column grouping
                    this.columnDefs.forEach(colDef => {
                        colDef.rowGroup = false;
                    });


                    this.columnDefs.filter(col => rowGroups.indexOf(col.colId) > -1).forEach(col => {
                        col.rowGroup = true;
                    });

                    // Expand all top level groups
                    this.setGroupExpandProperty();

                    this.selectedFilter.groupingTemplateValue = event.groupingTemplateValue;
                }
            }
            if (event && event.filterTemplateValue) {
                this.gridApi.setFilterModel(JSON.parse(event.filterTemplateValue));
            }
            this.selectedFilter.roleColumn = JSON.stringify(this.columnDefs);

        }

    }

    setOfficeCluster() {
        this.rowData.forEach((element) => {
            if (element.case?.caseOffice && element.case?.caseOffice > 0)
                element.case.officeCluster = element.case.caseOffice
                    ? CommonMethods.getOfficeCluster(element.case.caseOffice, this.bainOffices)
                    : null;
        });
    }
    onGridReadyExpo(params) {
        this.gridApiExp = params.api;
        params.api.sizeColumnsToFit();
    }

    getSelectedRowData(params) {
        if (this.selectedExportType == "individual") {
            this.manualSelectedRows.push(params.data);
            this.rowDataExport = this.manualSelectedRows;
            var data = params.data;

            if (params.node.selected) {
                this.gridApiExp.applyTransaction({ add: [data] });
            } else {
                this.gridApiExp.applyTransaction({ remove: [data] });
            }
        }
    }

    // This shows the export view
    exportPipelineData(selType) {
        if (selType == "individual") {
            this.showSelectedExportDiv = true;
            this.showAllExportDiv = false;
            this.rowMultiSelect = true;
            this.rowSelection = "multiple";

            if (this.rowDataExport.length > 0) {
                this.rowDataExport.splice(0, this.rowDataExport.length);
            }
        } else if (selType == "allPipelines") {
            this.showAllExportDiv = true;
            this.showSelectedExportDiv = false;
            this.totalRows = this.rowData.length;
            this.gridOptions.api.selectAll();
        }
    }

    // Function to select all rows on Check box click
    selectChildNodes: boolean = false;
    selectAllIndividualRows() {
        this.selectChildNodes = !this.selectChildNodes;
        if (this.selectChildNodes) {
            this.gridApiExp.selectAll();
        } else {
            this.gridApiExp.deselectAll();
        }
    }

    // Function to toggle check box on row selection
    getRowDataSelToExport(params) {
        if (params.node.selected) {
            this.selectChildNodes = true;
        }
    }

    // Hides the export view
    closeExportSection() {
        this.isExportSectionVisible = false;
        this.selectChildNodes = false;
        this.rowMultiSelect = false;
        this.rowSelection = "false";
        document.getElementById("agGridSection").style.height = "85vh";
        this.gridOptions.api.deselectAll();
    }

    // Export functionality goes here
    exportSelectedData() {
        var finalDataToExport = [];
        if (this.selectedExportType == "individual") {
            if (finalDataToExport.length < 0) {
                alert("Please select rows to export");
            } else {
                finalDataToExport = this.gridApiExp.getSelectedRows();
                let todaysDate = new Date().toISOString().split("T")[0];
                let name = "Selected_Active_Pipelines_" + todaysDate;
                let params: ExcelExportParams = <ExcelExportParams>{
                    allColumns: true,
                    fileName: name,
                    sheetName: "selected_pipelines",
                    onlySelected: true,
                    processCellCallback: (params: ProcessCellForExportParams): string => {
                        let value = params.value;
                        let colDef = params.column.getColDef();

                        return value;
                    }
                };
                this.gridApiExp.exportDataAsExcel(params);
            }
        } else if (this.selectedExportType == "allPipelines") {
            finalDataToExport = this.rowData;
            let todaysDate = new Date().toISOString().split("T")[0];
            let name = "All_active_pipelines_" + todaysDate;
            let params: ExcelExportParams = <ExcelExportParams>{
                allColumns: true,
                fileName: name,
                sheetName: "all_pipelines",
                processCellCallback: (params: ProcessCellForExportParams): string => {
                    let value = params.value;
                    let colDef = params.column.getColDef();

                    return value;
                }
            };
            this.gridApi.exportDataAsExcel(params);
            console.log(finalDataToExport);
        }
    }

    //------- Share data section -----------//
    shareSelectedData() {
        var finalDataToShare = [];

        if (this.selectedExportType == "individual") {
            if (finalDataToShare.length < 0) {
                alert("Please select rows to export");
            } else {
                finalDataToShare = this.gridApiExp.getSelectedRows();
            }
            console.log(finalDataToShare);
        } else if (this.selectedExportType == "allPipelines") {
            finalDataToShare = this.rowData;
            console.log(finalDataToShare);
        }
    }

    reDrawPipelineGrid(newGridCols) { }

    getContextMenuItems = (params) => {
        let isDeleteDisabled = false;
        if (params.node?.group || params.column == null) {
            isDeleteDisabled = true;
        }

        if (params.node && !params.node?.selected) {
            this.gridApi.selectNode(params.node, false, true);
        }

        let isPartnerEditFlagDisabled = this.isPartnerFlaggedOppSelected();

        var result = [
            {
                name: "Update Ops Likelihood",
                icon: '<i class="fa fa-wrench"></i>',
                subMenu: [
                    {
                        name: "Staffed",
                        action: () => {
                            var newStatus = this.opsLikelihood.filter(
                                (x) => x.opsLikelihoodId == OpsLikelihoodEnum.Staffed
                            );
                            this.updateOpsLikelihoodFromContextMenu(params, newStatus);

                        },
                        context: params.context,
                        icon: '<i class="fas fa-minus" style="color:' + this.getColorForOpsLikelihood(OpsLikelihoodEnum.Staffed) + '"></i>'
                    },
                    {
                        name: "Confirmed/Nearly Locked",
                        action: () => {
                            var newStatus = this.opsLikelihood.filter(
                                (x) => x.opsLikelihoodId == OpsLikelihoodEnum.Confirmed_NearlyLocked // To confirm 
                            );
                            this.updateOpsLikelihoodFromContextMenu(params, newStatus);
                        },
                        context: params.context,
                        icon: '<i class="fas fa-minus"  style="color:' + this.getColorForOpsLikelihood(OpsLikelihoodEnum.Confirmed_NearlyLocked) + '"></i>'
                    },
                    {
                        name: "Very High",
                        action: () => {
                            var newStatus = this.opsLikelihood.filter(
                                (x) => x.opsLikelihoodId == OpsLikelihoodEnum.VeryHigh // To confirm
                            );
                            this.updateOpsLikelihoodFromContextMenu(params, newStatus);
                        },
                        context: params.context,
                        icon: '<i class="fas fa-minus" style="color:' + this.getColorForOpsLikelihood(OpsLikelihoodEnum.VeryHigh) + '"></i>'
                    },
                    {
                        name: "High",
                        action: () => {
                            var newStatus = this.opsLikelihood.filter(
                                (x) => x.opsLikelihoodId == OpsLikelihoodEnum.High
                            );
                            this.updateOpsLikelihoodFromContextMenu(params, newStatus);
                        },
                        context: params.context,
                        icon: '<i class="fas fa-minus" style="color:' + this.getColorForOpsLikelihood(OpsLikelihoodEnum.High) + '"></i>'
                    },
                    {
                        name: "Medium",
                        action: () => {
                            var newStatus = this.opsLikelihood.filter(
                                (x) => x.opsLikelihoodId == OpsLikelihoodEnum.Medium
                            );
                            this.updateOpsLikelihoodFromContextMenu(params, newStatus);
                        },
                        context: params.context,
                        icon: '<i class="fas fa-minus" style="color:' + this.getColorForOpsLikelihood(OpsLikelihoodEnum.Medium) + '"></i>'
                    },
                    {
                        name: "Low",
                        action: () => {
                            var newStatus = this.opsLikelihood.filter(
                                (x) => x.opsLikelihoodId == OpsLikelihoodEnum.Low
                            );
                            this.updateOpsLikelihoodFromContextMenu(params, newStatus);
                        },
                        context: params.context,

                    },
                    ,
                    {
                        name: "Unknown",
                        action: () => {
                            var newStatus = this.opsLikelihood.filter(
                                (x) => x.opsLikelihoodId == OpsLikelihoodEnum.Unknown
                            );
                            this.updateOpsLikelihoodFromContextMenu(params, newStatus);
                        },
                        context: params.context,

                    }

                ]
            },
            {
                name:"Send email",
                icon: '<i class="fa fa-envelope"></i>',
                action:()=> this.outSendEmail(params, true)

            },
            {
                name: "Assign to Location/Manager",
                icon: '<i class="fa fa-map-pin"></i>',
                disabled: (isDeleteDisabled || params?.node?.data?.oppName == "" || params?.node?.data?.opportunityStage.opportunityStageId != Opportunity_Stage.Backlog),
                action: () => {
                    this.startAssignOpp(params);
                }
            },
            {
                name: "Update Opportunity stage",
                icon: '<i class="fa fa-wrench"></i>',
                action: () => {
                    let data = params.node.data;
                    let stage = params.node.data.registrationStage;

                    const modalRef = this.modalService.show(UpdateStageModalComponent, {
                        class: "modal-dialog-centered closed-detail-popup",
                        backdrop: "static", keyboard: false,
                        initialState: {
                            modalData: stage,
                            registrationId: data.registrationId,
                            targetData: data.target?.targetName ? data.target.targetName : 'No target'
                        },
                    });

                    modalRef.content.saveClosedEmitter.subscribe((res) => {
                        let newStageValue = res.stage;
                        params.node.data.registrationStage = newStageValue;
                        this.savePipeline(params.node.data, "stageStatus");

                        let newClosedValue = res.closedInfo;
                        newClosedValue.registrationId = params.node.data.registrationId;
                        if (newStageValue.stageTypeName.includes('Closed')) {
                            this.registrationService.upsertRegistrationClosedInfo(newClosedValue).subscribe((res) => {
                                this.toastr.showSuccess("Closed data updated", "Success");
                            });
                        }
                    });
                }
            },
            {
                name: "Flag/Unflag",
                icon: '<i class="fa fa-flag" aria-hidden="true"></i>',
                action: () => this.updateSelectedOpportunitesFlags(null)

            },
            {
                name: "Unflag Partner Edit",
                icon: '<i class="fa fa-flag" aria-hidden="true"></i>',
                action: () => this.updateSelectedOpportunitesPartnerFlags(null),
                disabled: isPartnerEditFlagDisabled
            },
            {
                name: "Add Row",
                icon: '<i class="fa fa-plus"></i>',
                action: () => {
                    this.addItems();
                }
            },
            {
                name: "Duplicate Row",
                icon: '<i class="fa fa-clone"></i>',
                disabled: isDeleteDisabled,
                action: () => {
                    this.duplicateRow(params?.node?.data)
                }
            },
            {
                name: "Delete Row",
                icon: '<i class="fa fa-trash"></i>',
                disabled: isDeleteDisabled,

                action: () => {
                    if (params.node.data.registrationId == undefined) {
                        var rowNode = this.gridApi.getRowNode(params.node.data.poId.toString());
                        let index = this.rowData.findIndex((i) => i.poId == rowNode.data.poId);
                        this.rowData.splice(index, 1);
                        this.gridApi.applyTransaction({ remove: [rowNode.data] });
                    } else {
                        let palceholderName = params.node.data?.oppName;
                        const initialState = {
                            data:
                                'This action will delete the placeholder "' +
                                palceholderName +
                                '", would you like to continue?',
                            title: "Confirmation"
                        };
                        this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
                            initialState,
                            backdrop: "static",
                            keyboard: false
                        });
                        this.bsModalRef.content.closeBtnName = "Close";
                        this.bsModalRef.content.event.subscribe((a) => {
                            if (a == "reset") {
                                this.deletePipelineRegistrationAndOpportunity(params.node.data);
                            }
                        });
                    }
                }
            },
            {
                name: "Copy",
                icon: '<i class="fa fa-solid fa-copy"></i>',
                action: () => this.copySelectedRows()
            },
            {
                name: "Export (CSV)",
                icon: '<i class="fa fa-file-excel"></i>',
                action: () => this.processDownload()
            },
            {
                name: "Export (Excel)",
                icon: '<i class="fa fa-file-excel"></i>',
                action: () => this.processExcelDownload()
            }
        ];
        return result;
    };

    updateOpsLikelihoodFromContextMenu(params, newStatus) {

        let pipelineData = params.node.data;
        let weeklybucket: any = this.weeklyBucketData.find((x) => x.pipelineBucketId == pipelineData?.pipelineBucketId);

        this.oldCellValue = params.node.data.opsLikelihood;
        params.node.data.opsLikelihood = newStatus[0];
        this.gridApi.refreshCells({ force: true });

        if (
            pipelineData?.expectedStart?.expectedStartDate &&
            (weeklybucket?.employee || weeklybucket?.office?.officeCode != "0")) {
            this.mapPipelineDataToBucket(this.allBucketData);
        }

        let data =
        {
            fieldName: "opsLikelihood",
            opportunity: params.node.data,
            newValue: newStatus[0]
        }
        this.updatePipeline(data, true);
    }

    getColorForOpsLikelihood(opsLikelihoodId) {
        var newStatus = this.opsLikelihood.find(
            (x) => x.opsLikelihoodId == opsLikelihoodId // To confirm 
        );
        return newStatus?.color;
    }


    public defaultGroupOrderComparator: (nodeA, nodeB) => number = function (nodeA, nodeB) {
        let a: any = {};
        let b1: any = {};
        a = nodeA.key || "";
        b1 = nodeB.key || "";
        if (a == null) {
            a = undefined;
        }
        if (b1 == null) {
            b1 = undefined;
        }

        if (nodeA.field == "oppStage") {
            return a < b1 ? -1 : a > b1 ? 1 : 0;
        } else if (nodeA.field == "expectedStart") {
            if (a == "") {
                a = moment(new Date()).add(500, "years");
            }
            if (b1 == "") {
                b1 = moment(new Date()).add(500, "years");
            }
            a = Date.parse(a);
            b1 = Date.parse(b1);
            return a < b1 ? -1 : a > b1 ? 1 : 0;
        }
        else if (nodeA.field == "weekStart") {
            if (a == "") {
                a = moment(new Date()).subtract(500, "years");
            }
            if (b1 == "") {
                b1 = moment(new Date()).subtract(500, "years");
            }
            a = Date.parse(a);
            b1 = Date.parse(b1);
            return b1 < a ? -1 : b1 > a ? 1 : 0;
        }
        else if (nodeA.field == "customPriority") {
            if (b1 == "") {
                b1 = "z";
            }
            if (a == "") {
                a = "z";
            }
            return a < b1 ? -1 : a > b1 ? 1 : 0;
        } else if (nodeA.field == "likelihood") {
            if (b1 == "<50") {
                b1 = "49";
            }
            if (a == "<50") {
                a = "49";
            }
            if (b1 == "") {
                b1 = "0";
            }
            if (a == "") {
                a = "0";
            }
            return parseInt(b1) < parseInt(a) ? -1 : parseInt(b1) > parseInt(a) ? 1 : 0;
        }
        else if (nodeA.field == "opsLikelihood") {
            if (a == "") {
                a = "99.z";
            }
            if (b1 == "") {
                b1 = "99.z";
            }
            return b1 < a ? -1 : b1 > a ? 1 : 0;
        }
    };

    addItems() {
        let newInstance = this.createNewRowData();
        this.addRowinGrid(newInstance)
        this.savePipeline(newInstance, 'targetDescription', true);
    }
    addDuplicatedRowinGrid(res) {
        this.selectedOpportunity = JSON.parse(JSON.stringify(res));
        this.addRowinGrid(res)

        this.toastr.showSuccess("The opportunity  has been duplicated.", "Duplication Successful")


    }

    addRowinGrid(newInstance) {
        newInstance.isRowSelected = true;
        let trans: RowDataTransaction = {
            add: [newInstance]
        };
        this.gridApi.applyTransaction(trans);
        this.rowData.unshift(newInstance);
        this.gridApi.redrawRows();
        this.gridApi.refreshCells({ force: true });
        // this.gridApi.refreshClientSideRowModel();
        var rowNode = this.gridApi.getRowNode(newInstance.poId.toString());

        if (rowNode.rowIndex) {
            // Ensure the row is visible after a brief delay to allow the grid to render
            let self = this;
            setTimeout(function () {
                self.gridApi.ensureIndexVisible(rowNode.rowIndex, "middle");
                self.gridApi.deselectAll();
                rowNode.setSelected(true);
            }, 100);
        }
    }

    createNewRowData() {
        let newData = new Pipeline();
        newData.pipelineId = 0;
        newData.opportunityTypeId = 2;
        newData.expectedStart = undefined;

        let qualifier = { quantifierId: 0, quantifierName: "", typeId: 0 };
        newData.poId = CommonMethods.getGUID();
        newData.teamSize = [];
        newData.additionalServices = [];
        newData.customPriority = [];
        newData.Client = [];
        newData.weekStartDate = undefined;
        newData.opportunityStage = {
            opportunityStageId: Opportunity_Stage.Backlog,
            opportunityStageName: "Backlog",
            sortOrder: 1
        };
        this.selectedData = undefined;
        return newData;
    }

    duplicateRow(opportunity) {
        if (opportunity?.registrationId) {
            this.pipelineService.clonePipelineOpportunity(opportunity?.registrationId).subscribe((res) => {

                if (res && !res.isRemoveRecordFromGrid) {
                    this.addRowinGrid(res)
                }
            });
        }
    }

    onGroupToggle(value) {
        if (value.isExpand) {
            this.gridApi.expandAll();
        } else {
            this.gridApi.collapseAll();
        }
    }


    // Begin assigning an opp from the context menu and adjust split area styling
    startAssignOpp(params: any) {
        this.pipelineService.getOpportunityPosition(params.node.data.registrationId)

        this.oppToBeAssigned = params.node.data;
        this.isAssigningOpp = true;
        this.assignOppDisplayName = this.oppToBeAssigned.oppName;
    }

    // Begin assigning an opp from the context menu and restore the split area styling
    endAssignOpp() {
        this.isAssigningOpp = false;
        this.oppToBeAssigned = null;
    }




    setFilterValue(filterInstance) {
        this.filtersApplied = [];
        let columns: string[] = [];
        columns = Object.keys(filterInstance);
        for (let index = 0; index < columns.length; index++) {
            if (filterInstance[columns[index]].hasOwnProperty("values") && filterInstance[columns[index]].values) {
                for (let i = 0; i < filterInstance[columns[index]].values.length; i++) {
                    let obj = {
                        headername: columns[index],
                        value: filterInstance[columns[index]].values[i]
                    };
                    this.filtersApplied.push(obj);
                }
            } else if (
                filterInstance[columns[index]].hasOwnProperty("filterType") &&
                filterInstance[columns[index]].filterType == "multi"
            ) {
                if (
                    filterInstance[columns[index]].filterModels.length > 1 &&
                    filterInstance[columns[index]].filterModels[1].hasOwnProperty("values") &&
                    filterInstance[columns[index]].filterModels[1].values
                ) {
                    for (let i = 0; i < filterInstance[columns[index]].filterModels[1].values.length; i++) {
                        let obj = {
                            headername: columns[index],
                            value: filterInstance[columns[index]].filterModels[1].values[i]
                        };
                        this.filtersApplied.push(obj);
                    }
                }
            }
            else {
                let obj = {
                    headername: columns[index],
                    value: filterInstance[columns[index]].value
                };
                if (obj.value) {
                    this.filtersApplied.push(obj);
                }
            }
        }

        let refArray = [];
        this.filtersApplied.forEach((element) => {
            if (element.value) {
                refArray.push(element);
            }
        });
        this.filtersApplied = refArray;
    }

    onRowDataChanged(event) {
        if (this.gridApi) {
            this.gridApi.setFilterModel(this.filterModel);
            this.gridApi?.onFilterChanged();
            this.filterModel = undefined;
        }
        this.resetDisplayCount();
        this.setGroupExpandProperty();
    }

    onFilterChanged(event) {
        const filterInstance = this.gridOptions.api.getFilterModel();
        this.setFilterValue(filterInstance);
        this.resetDisplayCount();


    }

    refreshPipeline(data) {
        var editing = this.gridApi.getEditingCells();
        if (editing.length > 0) {
            window.alert("Complete cell editing then refresh");
        } else {
            var params = {
                force: true
            };
            this.gridApi.redrawRows();
        }
    }

    setClear() {
        this.hideSelectors = true;
    }

    editItem(event) {
        this.hideSelectors = event;
    }

    ngAfterContentChecked() {
        this.resetDisplayCount();


    }

    onRegionValueChange(regionFilter) {
        this.regionFilter = regionFilter;
        this.getPipelineData();
    }

    mapRegionToIds() {
        if (this.regionFilter) {
            let regArr = [];
            if (this.regionFilter.isAmericas) {
                regArr.push(Region.Americas);
            }
            if (this.regionFilter.isEMEA) {
                regArr.push(Region.EMEA);
            }
            if (this.regionFilter.isAPAC) {
                regArr.push(Region.APAC);
            }
            return regArr.join(",");
        } else {
            return "";
        }
    }

    setOldValueByField(data, field) {
        let value: any;
        switch (field) {
            case "targetDescription":
                this.oldCellValue = data.targetDescription;
                break;
            case "opportunitytypedetails":
                this.oldCellValue = CommonMethods.generateOpportunityTypeDetailsLabel(data.opportunityTypeDetails);
                break;
            case "clientPriorityName":
                this.oldCellValue = data.customPriority.map((e) => {
                    return e.priorityName;
                });
                break;
            case "manager":
                var result = data["manager"].map((r) => {
                    return _.omit(r, ["partnerType", "searchableName"]);
                });
                this.oldCellValue = result;
                break;
            case "othersInvolved":
                var result = data["othersInvolved"].map((r) => {
                    return _.omit(r, ["partnerType", "searchableName"]);
                });
                this.oldCellValue = result;
                break;
            case "duration":
                this.oldCellValue = data.duration;
                break;
            case "caseCode":
                this.oldCellValue = data.case;
                break;

            case "teamSize":
                let filteredData = [];
                data.teamSize.forEach((r) => {
                    if (!(r.teamSizeId == 0 || r.teamSizeId == null)) {
                        filteredData.push(r);
                    }
                });

                this.oldCellValue = JSON.parse(JSON.stringify(filteredData));
                break;
            case "requiredLanguage":
                this.oldCellValue = data?.requiredLanguage;
                break;
            case "additionalServicesName":
                let filteredServices = [];
                data.additionalServices.forEach((r) => {
                    if (!(r.additionalServicesId == 0 || r.additionalServicesId == null)) {
                        filteredServices.push(r);
                    }
                });

                this.oldCellValue = JSON.parse(JSON.stringify(filteredServices));
                break;
            case "expectedStart":
                if (data) {
                    if (data["expectedStart"]?.expectedStartDate != null) {
                        data["expectedStart"].expectedStartDate = moment.utc(data["expectedStart"].expectedStartDate).format("YYYY-MM-DD");
                    }
                }
                this.oldCellValue = _.cloneDeep(data?.expectedStart);

                break;

            case "latestStartDate":
                if (data && data["latestStartDate"] != null) {
                    data["latestStartDate"] = moment.utc(data["latestStartDate"]).format("YYYY-MM-DD");
                }
                this.oldCellValue = _.cloneDeep(data?.latestStartDate);

                break;

            case "location":
                var preferred = data["location"].preferred.map((r) => {
                    return _.omit(r, ["lastUpdatedBy", "pipelineLocationId"]);
                });
                var conflicted = data["location"].conflicted.map((r) => {
                    return _.omit(r, ["lastUpdatedBy", "pipelineLocationId"]);
                });
                var allocated = data["location"].allocated.map((r) => {
                    return _.omit(r, ["lastUpdatedBy", "pipelineLocationId"]);
                });

                this.oldCellValue = JSON.parse(
                    JSON.stringify({ preferred: preferred, conflicted: conflicted, allocated: allocated })
                );
                break;
            case "allocatedOffice":
                var allocated = data["location"].allocated.map((r) => {
                    return _.omit(r, ["lastUpdatedBy", "pipelineLocationId"]);
                });

                this.oldCellValue = JSON.parse(
                    JSON.stringify({ allocated: allocated })
                );
                break;
            case "conflictedOffice":
                var conflicted = data["location"].conflicted.map((r) => {
                    return _.omit(r, ["lastUpdatedBy", "pipelineLocationId"]);
                });

                this.oldCellValue = JSON.parse(
                    JSON.stringify({ conflicted: conflicted })
                );
                break;
            case "sector":
                var sector = data.sector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                var subSector = data.subSector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                this.oldCellValue = JSON.parse(JSON.stringify({ sector: sector, subSector: subSector }));
                break;
            case "subSector":
                var sector = data.sector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                var subSector = data.subSector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                this.oldCellValue = JSON.parse(JSON.stringify({ sector: sector, subSector: subSector }));
                break;
            case "targetName":
                let targetName = undefined;
                if (data.target) {
                    targetName = data.target.targetName;
                    this.oldCellValue = JSON.parse(JSON.stringify(targetName));
                } else {
                    this.oldCellValue = undefined;
                }
                break;
            case "clientName":
                let clientName = undefined;
                if (data.client && data.client.length > 0) {
                    if (data.client[0].clientName != null) {
                        clientName = data.client[0].clientName;
                        this.oldCellValue = JSON.parse(JSON.stringify(clientName));
                    } else {
                        this.oldCellValue = "";
                    }
                } else {
                    this.oldCellValue = "";
                }
                break;
            case "expectedProjectName":
                this.oldCellValue = data.expectedProjectName;
                break;
            case "teamComments":
                this.oldCellValue = data.teamComments;
                break;
            case "processInfo":
                this.oldCellValue = data.processInfo;
                break;
            case "retainerNotes":
                this.oldCellValue = data.retainerNotes;
                break;

            case "caseComplexity":
                let caseComplexitydData = [];
                data.caseComplexity.forEach((r) => {
                    if (!(r.caseComplexityId == 0 || r.caseComplexityId == null)) {
                        caseComplexitydData.push(r);
                    }
                });
                this.oldCellValue = JSON.parse(JSON.stringify(caseComplexitydData));
                break;
            case "officeToBeStaffed":

                if (data && data.officeToBeStaffed) {
                    this.oldCellValue = data.officeToBeStaffed;

                }
                break;
            case "operatingPartner":
            case "svp":
                if (data) {
                    this.oldCellValue = _.cloneDeep(data[field]);
                }
                break;
            case "oppStage":
                this.oldCellValue = data.opportunityStage.opportunityStageName;
                break;
            case "clientCommitment":
                this.oldCellValue = data.clientCommitment;
                break;
            case "stageStatus":
                this.oldCellValue = data.registrationStage;
                break;
            case "isRetainer":
                this.oldCellValue = data.isRetainer;
                break;
            case "isMBPartner":
                this.oldCellValue = data.isMBPartner;
                break;
            case "isOVPHelp":
                this.oldCellValue = data.isOVPHelp;
                break;
            case "isSVPHelp":
                this.oldCellValue = data.isSVPHelp;
                break;
            case "opsLikelihood":
                this.oldCellValue = data.opsLikelihood;
                break;
            case "linkedPlaceholder":
                this.oldCellValue = data.dealId;
                break;
            default:
                this.oldCellValue = JSON.parse(JSON.stringify(data[field.charAt(0).toLowerCase() + field.substr(1)]));
                break;
        }
    }

    onCellEditingStarted(event) {
        this.setOldValueByField(event.data, event.colDef.field);
        this.currentUpdatingField = event.colDef.field;
        this.addNewEvent(event?.data, this.currentUpdatingField, "savePipeline");
        if (this.signalRService && this._coreService.appSettings.PEGSignalRBasePath.trim() != '') {
            this.notifyEditing(event.column.colId, event.newValue, event?.data?.poId);
        }
    }
    sendDataToPipeline(item, event, fieldName) {
        //if status is already set only emit the itema and dont send data to staffing
        let filteredBucket = this.weeklyBucketData.filter((wb) => wb.pipelineBucketId == event.data.pipelineBucketId);

        if (!item.pipeline?.isOpportunityStaffed) {
            let weeklybucket: any = this.weeklyBucketData.find((x) => x.pipelineBucketId == item.pipelineBucketId);
            // Creating payload
            let pipelineObject = item.pipeline;

            let endDateGap: number;
            if (pipelineObject.duration && pipelineObject.duration.toString().trim() != "") {
                endDateGap = parseInt(pipelineObject.duration) || 2;
            } else {
                endDateGap = 2;
            }

            let endDate = moment.utc(pipelineObject.expectedStart.expectedStartDate).add((endDateGap * 7), "days");

            if (endDate.weekday() == 6) { // If Saturday
                endDate.subtract(1, "days");
            } else if (endDate.weekday() == 0) { // If Sunday
                endDate.subtract(2, "days");
            } else if (endDate.weekday() == 1) { // If Monday
                endDate.subtract(3, "days");
            } else {
                endDate.subtract(1, "days");
            }

            var PipelineInfoSend = {
                opportunityId: pipelineObject.poId,
                officeCodes:
                    weeklybucket.employee != null && weeklybucket.employee.employeeCode.trim() != ""
                        ? weeklybucket.employee.homeOfficeCode
                        : pipelineObject?.officeToBeStaffed?.length > 0 ? weeklybucket.office?.officeCode + "," + pipelineObject?.officeToBeStaffed.map((x) => x.officeCode).join(",")
                            : weeklybucket.office?.officeCode,
                name:
                    (pipelineObject?.client?.length > 0
                        ? pipelineObject.client.map((x) => x.clientName).join(",") + " - "
                        : "") +
                    (pipelineObject?.industries?.length > 0
                        ? pipelineObject.industries.map((x) => x.industryName).join(",")
                        : "") +
                    (pipelineObject?.expectedProjectName ? " - " + pipelineObject.expectedProjectName : ""),
                timestampUTC: moment.utc().format("YYYY-MM-DD HH:mm Z"),
                startDate: moment.utc(pipelineObject.expectedStart.expectedStartDate).format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD"),
                probabilityPercent: CommonMethods.getLikelihoodValue(pipelineObject.likelihood)
            };
            if (item.pipeline.bucketOffice && item.pipeline?.bucketOffice?.officeCode && parseInt(item.pipeline?.bucketOffice?.officeCode) > 0) {

                this.pipelineService.sendPipelineOpportunityData(PipelineInfoSend).subscribe((res) => {
                    if (res) {
                        this.toastr.showSuccess("Opportunity data sent to staffing.", "Success");
                    }


                    //setting up opportunity
                    this.savePipeline(event.data, fieldName);
                    if (event.newValue.opsLikelihoodId == OpsLikelihoodEnum.Staffed) {
                        let mappedOpp = filteredBucket[0].pipelineBucketMapping.filter(
                            (pb) => pb.registrationId != event.data.registrationId
                        );

                        this.updateStgeAfterSold(mappedOpp);

                    }
                });
            } else {
                this.savePipeline(event.data, fieldName);

                if (event.newValue.opsLikelihoodId == OpsLikelihoodEnum.Staffed) {
                    let mappedOpp = filteredBucket[0].pipelineBucketMapping.filter(
                        (pb) => pb.registrationId != event.data.registrationId
                    );

                    this.updateStgeAfterSold(mappedOpp);

                }


            }
        }
        else {
            let weeklybucket: any = this.weeklyBucketData.find((x) => x.pipelineBucketId == item.pipelineBucketId);
            let pipelineObject = item.pipeline;
            if (pipelineObject?.expectedStart?.expectedStartDate &&
                (weeklybucket.employee || weeklybucket.office?.officeCode != "0")) {

                this.savePipeline(event.data, fieldName);
            }
            else {
                this.toastr.showWarning("Fields Expected start Date, Location/Manager cannot be empty", "Warning");
            }
        }
    }
    synchBucketData(event, fieldName) {

        let filteredBucket = this.weeklyBucketData.filter((wb) => wb.pipelineBucketId == event.data.pipelineBucketId);


        if (filteredBucket?.length == 0 || event.data.pipelineBucketId <= 0) // opp not available in bucket
        {
            if (event.newValue.opsLikelihoodId == OpsLikelihoodEnum.Staffed || event.newValue.opsLikelihoodId == OpsLikelihoodEnum.Confirmed_NearlyLocked) {
                this.RefreshGrid(event);
                this.toastr.showWarning("The opportunity must be placed in a bucket", "Warning");

            }
            else {
                this.savePipeline(event.data, fieldName);
            }
        }
        else {
            if (filteredBucket && filteredBucket?.length > 0 && event.data.opsLikelihood) {
                let pipelineData = filteredBucket[0].pipelineBucketMapping.find(x => x.registrationId == event.data.registrationId)


                let weeklybucket: any = this.weeklyBucketData.find((x) => x.pipelineBucketId == pipelineData?.pipelineBucketId);
                if (pipelineData?.pipeline && weeklybucket) {
                    let pipelineObject = pipelineData.pipeline;
                    if (
                        pipelineObject?.expectedStart?.expectedStartDate &&
                        (weeklybucket.employee || weeklybucket.office?.officeCode != "0")
                    ) {
                        // This will send data to Azure service bus   
                        this.sendDataToPipeline(pipelineData, event, fieldName);

                    }
                    else {
                        this.RefreshGrid(event);
                        this.toastr.showWarning("Fields Expected start Date, Location/Manager cannot be empty", "Warning");
                    }

                }
                else {
                    this.RefreshGrid(event);
                    this.toastr.showWarning("The opportunity must be placed in a bucket", "Warning");

                }
            }
            // delete opp status  from grid so no need to send data to staffing
            else if (filteredBucket?.length > 0 && !event.data.opsLikelihood) {
                this.savePipeline(event.data, fieldName);
            }
        }



    }
    RefreshGrid(event) {
        let index = this.rowData.findIndex((i) => i.poId == event.data.poId);
        event.data.opsLikelihood = this.oldCellValue;
        this.rowData[index] = event.data;
        this.setOfficeCluster();
        this.gridApi.setRowData(this.rowData);
        var rowNode = this.gridApi.getRowNode(event.data?.poId?.toString());
        if (rowNode) {
            var params = { force: true, suppressFlash: true, update: [rowNode] };
            this.gridApi.redrawRows({ rowNodes: [rowNode] });
            this.gridApi.refreshCells(params);
        }
    }

    SetMbStatus(res) {

        if (res?.length > 0) {
            res.forEach(element => {
                let index = this.rowData.findIndex((i) => i.poId == element.registrationId);
                if (this.rowData[index]) {
                    this.rowData[index].mbStatus = element.mbStatus;
                    console.log(this.rowData[index])
                    this.setOfficeCluster();
                    this.gridApi.setRowData(this.rowData);
                    var rowNode = this.gridApi.getRowNode(element?.registrationId?.toString());
                    if (rowNode) {
                        var params = { force: true, suppressFlash: true, update: [rowNode] };
                        this.gridApi.redrawRows({ rowNodes: [rowNode] });
                        this.gridApi.refreshCells(params);
                    }

                }
            });
        }

    }


    onCellValueChanged(event) {
        this.oldCellValue = this.oldCellValue == null ? undefined : this.oldCellValue;
        event.newValue = event.newValue == null ? undefined : this.getNewCellValue(event, event.colDef.field);
        if (event.colDef.field == 'duration' && event.data && !CommonMethods.validateDurationInfo(event.newValue)) {
            this.toastr.showWarning('Invalid Duration: Only Number/Decimal allowed', 'Warning');
            event.newValue = this.oldCellValue
            event.data.duration = this.oldCellValue;
            var rowNode = this.gridApi.getRowNode(event.data?.poId?.toString());
            if (rowNode) {
                rowNode.setData(event.data);
                var params = { force: true, suppressFlash: true, update: [rowNode] };
                this.gridApi.redrawRows({ rowNodes: [rowNode] });
                this.gridApi.refreshCells(params);
            }
            return;
        }
        //_isequal is not working in date object hence we have added so it will not save if value has not bee changed.

        if (event.colDef.field == "officeToBeStaffed") {
            CommonMethods.sortArrayObjectByField(this.oldCellValue, "officeCode", SortType.Asc);
            CommonMethods.sortArrayObjectByField(event?.newValue, "officeCode", SortType.Asc);
        }

        if (
            !_.isEqual(this.oldCellValue, event.newValue) &&
            (!(event.newValue instanceof Date) ||
                (event.newValue instanceof Date && event.newValue?.toString() != this.oldCellValue?.toString()))
        ) {

            if (event.colDef.field == "opsLikelihood" && event.newValue.opsLikelihoodId != OpsLikelihoodEnum.Unknown) {
                this.synchBucketData(event, "opsLikelihood");

            }
            else {
                if (event.colDef.field == "industries") {
                    event.data.sector = [];
                }
                this.savePipeline(event.data, event.column.colDef.field);
            }

        }
        //notify all the users except sender
        if (this.signalRService && this._coreService.appSettings.PEGSignalRBasePath.trim() != '') {
            this.notifyAll(event.column.colId, event.newValue, event?.data?.poId);
        }
    }

    savePipeline(pipelineData, fieldName, newOpp = false) {
        if (!pipelineData.expectedStart?.expectedStartDate && !newOpp &&
            pipelineData?.pipelineBucketId && pipelineData?.pipelineBucketId != 0) {
            this.toastr.showWarning('Please enter an expected start date to send updates to BOSS', 'Warning');
        }
        if (
            pipelineData?.locationOfDeal == null ||
            pipelineData?.locationOfDeal?.locationDealId == undefined ||
            pipelineData?.locationOfDeal == 0
        ) {
            pipelineData = pipelineData || {};
            pipelineData.locationOfDeal = { locationDealId: this.coreSerivce.loggedInUser.employeeOffice };
        }
        pipelineData.lastUpdatedBy = this._coreService.loggedInUser.employeeCode;
        if (pipelineData?.target != undefined) {
            pipelineData.target = pipelineData.target.hasOwnProperty('targetName') ? pipelineData.target : '';
        }
        if (pipelineData?.client != undefined) {
            pipelineData.client = pipelineData.client.hasOwnProperty('length') ? pipelineData.client : [pipelineData.client];
        }
        let regionFilter = this.mapRegionToIds();
        let tempPoid = pipelineData.poId;

        let bucket = this.weeklyBucketData.find(x => x.pipelineBucketId == pipelineData.pipelineBucketId);


        this.pipelineService.updatePipeline(pipelineData, fieldName, regionFilter).subscribe((res) => {
            // Sort rows to push all blanks to the bottom, prior to any sorting or grouping
            this.SetMbStatus(res)

            res = res[0];

            if (res.isRemoveRecordFromGrid) {
                if (pipelineData.pipelineId == 0) {
                    this.rowData = this.rowData.filter(x => x.pipelineId != 0)
                } else {

                    let pipelineIds: string[] = [];

                    if (bucket && bucket[0]?.pipelineBucketMapping && (bucket[0] as PipelineBucket).pipelineBucketMapping.length > 0) {
                        (bucket[0] as PipelineBucket).pipelineBucketMapping.forEach((map) => {
                            if (map?.pipeline) {
                                pipelineIds.push(map.pipeline.poId);
                            }
                        });
                    }

                    if (pipelineIds && pipelineIds.length > 0) {
                        pipelineIds.forEach((poId) => {
                            this.deletePipelineFromGrid(poId)

                        })
                    }

                    this.getPipelineBucket();
                }

                this.toastr.showSuccess("Pipeline data saved successfully", "Success");
            }
            else {
                this.rowData.sort((rowA, rowB) => {
                    if (rowA.pipelineId == 0 && rowB.pipelineId != 0) {
                        return 1;
                    } else if (rowA.pipelineId != 0 && rowB.pipelineId == 0) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

                let index = this.rowData.findIndex((i) => i.poId == tempPoid);



                this.rowData[index] = res;
                this.setOfficeCluster();




                this.gridApi.setRowData(this.rowData);
                var rowNode = this.gridApi.getRowNode(res?.poId?.toString());

                let cell = this.gridOptions?.api?.getFocusedCell();
                let editingCell = this.gridApi.getEditingCells();

                if (rowNode) {
                    var params = { force: true, suppressFlash: true, update: [rowNode] };
                    this.gridApi.redrawRows({ rowNodes: [rowNode] });
                    this.gridApi.refreshCells(params);
                    this.toastr.showSuccess("Pipeline data saved successfully", "Success");

                    // Refresh corresponding bucket in pipeline
                    let bucket;

                    bucket = this.weeklyBucketData.find(b => b.pipelineBucketMapping.findIndex(m => m.registrationId == tempPoid) > -1);
                    if (bucket) {
                        bucket.lastUpdated = moment();
                    }

                    this.mapPipelineDataToBucket(this.weeklyBucketData);

                    if (fieldName == 'oppStage' &&
                        res?.opportunityStage?.opportunityStageId == Opportunity_Stage.Backlog &&
                        this.weeklyBucketData?.length > 0) {
                        let filteredBucket = this.weeklyBucketData.filter((wb) => wb.pipelineBucketId == res.pipelineBucketId);
                        if (filteredBucket?.length > 0) {
                            let mappedOpp = filteredBucket[0].pipelineBucketMapping.find(
                                (pb) => pb.registrationId == res.registrationId
                            );

                            if (mappedOpp) {
                                mappedOpp.deleteLevel = DeleteLevel.PipelineBucketMapping;
                                this.deleteWeeklyBucketData(mappedOpp);
                            }

                        }
                    }

                    if (((fieldName == 'stageStatus') &&
                        (res?.registrationStage?.registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown
                            || res?.registrationStage?.registrationStageId == RegistrationStageEnum.ClosedDropped
                            || res?.registrationStage?.registrationStageId == RegistrationStageEnum.ClosedLost
                            || res?.registrationStage?.registrationStageId == RegistrationStageEnum.Terminated))
                        || ((fieldName == 'opsLikelihood') && (res.opsLikelihood.opsLikelihoodId == OpsLikelihoodEnum.Unknown))
                    ) {
                        if (this.weeklyBucketData?.length > 0) {

                            let filteredBucket = this.weeklyBucketData.filter((wb) => wb.pipelineBucketId == res.pipelineBucketId);
                            if (filteredBucket?.length > 0) {
                                let mappedOpp = filteredBucket[0].pipelineBucketMapping.find(
                                    (pb) => pb.registrationId == res.registrationId
                                );

                                if (filteredBucket[0].pipelineBucketMapping?.length > 1) {
                                    filteredBucket[0].deleteLevel = DeleteLevel.PipelineBucketMapping;
                                    filteredBucket[0].pipelineBucketMapping.splice(filteredBucket[0].pipelineBucketMapping.findIndex((pb) => pb.registrationId == res.registrationId), 1);
                                    filteredBucket[0].registrationId = res.registrationId;
                                    filteredBucket[0].pipelineBucketMappingId = mappedOpp.pipelineBucketMappingId;
                                    this.deleteBucketDataAutomation(filteredBucket[0], res.registrationId, fieldName)
                                }
                                else { // if alredy only one opp
                                    if (
                                        filteredBucket[0].employee == null &&
                                        Number(filteredBucket[0].office?.officeCode) == 0
                                    ) {
                                        filteredBucket[0].deleteLevel = DeleteLevel.BucketRow;

                                        this.deleteBucketDataAutomation(filteredBucket[0], res.registrationId, fieldName)
                                    }
                                    else {
                                        //delete opp only
                                        filteredBucket[0].deleteLevel = DeleteLevel.PipelineBucketMapping;
                                        this.deleteBucketDataAutomation(filteredBucket[0], res.registrationId, fieldName)

                                    }
                                }

                            }

                        }
                    }

                    if (cell && editingCell && editingCell.length > 0) {
                        this.gridApi.startEditingCell({
                            colKey: cell.column.getColId(),
                            rowIndex: editingCell[0].rowIndex
                        });
                    }
                    this.showRegistrationInGrid(res.registrationId);

                    if (newOpp === true) {
                        // open flyout here
                        this.selectedOpportunity = JSON.parse(JSON.stringify(res));
                        this.oppSlideout.showPanel(true);
                        this.isPipelineConflicted = true;

                        // if close is closed
                        this.oppSlideout.closeFlyoutEmitter.subscribe(() => {
                            this.gridOptions.api.ensureIndexVisible(rowNode.rowIndex, 'middle');
                        });
                    }
                }
                else {
                    this.mapPipelineDataToBucket(this.weeklyBucketData);
                }
            }

        });
    }

    expectedStartAuditLog(pipelineData: any, res: any, fieldName: string) {
        let dateVal = pipelineData.expectedStart?.expectedStartDate;
        if (dateVal.split) {
            dateVal = dateVal.split("T")[0]; // Necessary to obtain raw date string without timezone
            pipelineData.expectedStart.expectedStartDate = moment(dateVal).format("YYYY-MM-DD");

        }
        if (!moment(this.oldCellValue.expectedStartDate).isSame(pipelineData.expectedStart.expectedStartDate)) {
            this.createAuditLog(fieldName, pipelineData, res);
        }
        if (!_.isEqual(this.oldCellValue.expectedStartDateNote, pipelineData.expectedStart.expectedStartDateNote)) {
            this.createAuditLog('note', pipelineData, res);
        }
    }
    employeeNotesAuditLog(pipelineData, res, fieldName) {
        let oldEmployeesList = this.oldCellValue &&
            this.oldCellValue.partners?.length > 0
            ? this.oldCellValue.partners : []
        let newEmployeesList = pipelineData &&
            pipelineData[fieldName] &&
            pipelineData[fieldName].partners?.length > 0
            ? pipelineData[fieldName].partners : []


        oldEmployeesList = oldEmployeesList.map((r) => {
            return _.omit(r, ["searchableName"]);
        });
        newEmployeesList = newEmployeesList.map((r) => {
            return _.omit(r, ["searchableName"]);
        });
        if (!_.isEqual(oldEmployeesList, newEmployeesList)) {
            this.createAuditLog(fieldName, pipelineData, res);
        }
        let oldEmployeesNotes = this.oldCellValue &&
            this.oldCellValue.comments
            ? this.oldCellValue.comments : ""
        let newEmployeesNotes = pipelineData &&
            pipelineData[fieldName] &&
            pipelineData[fieldName].comments
            ? pipelineData[fieldName].comments : ""




        if (!_.isEqual(oldEmployeesNotes, newEmployeesNotes)) {
            this.createAuditLog(fieldName == "svp" ? "SVP Comments" : "OVP Comments", pipelineData, res);
        }
    }
    // Select the placeholder row of the clicked opportunity name
    onCellClicked(event) {

        if (event.colDef.field == "oppName" && event.event.shiftKey == false && event.event.ctrlKey == false) {
            let mappingFound = false;

            this.weeklyBucketData?.forEach((element) => {
                element?.pipelineBucketMapping?.forEach((mappingData) => {
                    if (mappingData?.pipeline?.poId == event.data?.poId) {
                        mappingFound = true;

                        if (mappingData?.pipeline?.isRowSelected == undefined) {
                            mappingData.pipeline.isRowSelected = true;
                        } else {
                            mappingData.pipeline.isRowSelected = !mappingData?.pipeline?.isRowSelected;
                        }

                        // Scroll to placeholder in the bucket groups
                        if (document.querySelector("#placeholderUnit" + mappingData.pipelineBucketId)) {
                            document.querySelector("#placeholderUnit" + mappingData.pipelineBucketId)?.scrollIntoView({ behavior: "smooth" });
                            this.redrawRows(mappingData.pipeline);
                        }

                    }
                });
            });

            if (!mappingFound) {
                event.node.data.isRowSelected = !event.node.data.isRowSelected;
                this.gridApi.redrawRows({ rowNodes: event.node });
            }
        }
        else if (event.colDef.field == 'stageStatus') {
            if (document.getElementsByClassName("closed-detail-modal") != null && document.getElementsByClassName("closed-detail-modal").length == 0) {
                this.openStageModal(event);
            }
        }
        else if (event.colDef.field == 'targetName') {
            if (event.data.dealId && event.data.dealId > 0) {
                const url = this.router.serializeUrl(this.router.createUrlTree([`/deals/deal/${event.data.dealId.toString()}`]));
                window.open(url, '_blank')
            }
        }
    }

    // Open the opportunity detail slideout when the name is double clicked in AG Grid
    onCellDoubleClicked(event) {
        if (event.colDef.field == "oppName" && event.event.shiftKey == false && event.event.ctrlKey == false) {
            this.selectedOpportunity = JSON.parse(JSON.stringify(event.data));
            this.oppSlideout.showPanel(true);
            this.isPipelineConflicted = true;
            event.node.highlighted = true;
        }
    }

    public createAuditLog(field: any, pipelineData: any, newData: any) {


        if (Object.values(PipelineField)?.includes(field)) {
            let pipelineAuditLog: PipelineAuditLog = new PipelineAuditLog();
            pipelineAuditLog = CommonMethods.pipelineAuditLog(field, pipelineData, newData, this.oldCellValue, this.columnDefs)
            if (pipelineAuditLog?.fieldName) {

                this.pipelineService.insertPipelineAuditLog(pipelineAuditLog).subscribe((auditLog) => {

                });
            }
        }
        if (Object.values(RegistrationField)?.includes(field)) {
            let auditLog: AuditLog = new AuditLog();

            auditLog = CommonMethods.registartionAuditLog(field, pipelineData, newData, this.oldCellValue, this.columnDefs)

            if (auditLog?.fieldName) {
                this.registrationService.saveAuditLogWithSource(auditLog).subscribe((response) => { });
            }
        }

    }

    getNameAndEcode(employees) {
        let partnerList = CommonMethods.getEmployeeNameList(employees);
        return partnerList.join(",");
    }

    getNewCellValue(event, field) {
        let newValue: any;
        switch (field) {
            case "opportunitytypedetails":
                return CommonMethods.generateOpportunityTypeDetailsLabel(event.data.opportunityTypeDetails);
                break;
            case "sector":
                var sector = event.data.sector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                var subSector = event.data.subSector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                newValue = JSON.parse(JSON.stringify({ sector: sector, subSector: subSector }));
                break;
            case "subSector":
                var sector = event.data.sector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                var subSector = event.data.subSector.map((r) => {
                    return _.omit(r, ["hierarchyLeft", "hierarchyRight", "isTopIndustry", "tagId", "abbreviation"]);
                });
                newValue = JSON.parse(JSON.stringify({ sector: sector, subSector: subSector }));
                break;
            case "svp":
            case "operatingPartner":
                newValue = event.newValue ?? event.data ? event.data[field] : null;
                break;
            default:
                newValue = event.newValue;

                break;
        }
        return newValue;
    }

    deletePipelineRegistrationAndOpportunity(pipelineinfo) {
        // Find item in buckets
        let mappingIndex = -1;
        let item = this.weeklyBucketData.find(bucket => {
            let index = bucket.pipelineBucketMapping.findIndex(mapping => mapping.registrationId == pipelineinfo.registrationId);
            if (index > -1) {
                mappingIndex = index;
                return true;
            } else {
                return false;
            }
        }
        );

        this.pipelineService.deletePipelineRegistratinAndOppruntiy(pipelineinfo).subscribe((res) => {
            if (res == true) {
                this.createAuditLog("deleteOpp", null, pipelineinfo);
                var rowNode = this.gridApi.getRowNode(pipelineinfo.poId.toString());
                if (rowNode) {
                    let index = this.rowData.findIndex((i) => i.poId == rowNode.data.poId);
                    this.rowData.splice(index, 1);
                    this.gridApi.applyTransaction({ remove: [rowNode.data] });
                    this.getPipelineBucket();
                }
                this.resetDisplayCount();

                if (item.pipelineBucketMapping.length > 1) {
                    item.pipelineBucketMapping.splice(mappingIndex, 1);
                } else {
                    item.pipelineBucketMapping[0].pipeline = null;
                    item.pipelineBucketMapping[0].registrationId = null;
                }

            }
        });
    }

    getPipelineBucket() {
        let regionFilterText = this.mapRegionToIds();
        this.pipelineService.getPipelineBucket(this.weekOffset, regionFilterText).subscribe(
            (res: PipelineBucketGroupInfo) => {
                if (res) {
                    this.groupData = res?.bucketGroups;
                    let data = res?.pipelineBuckets;
                    if (data) {
                        data = data.sort((a, b) => {
                            let aDateComp;
                            let bDateComp;
                            if (a.availableDate) {
                                aDateComp = moment(a.availableDate).valueOf();
                            } else {
                                aDateComp = 0;
                            }
                            if (b.availableDate) {
                                bDateComp = moment(b.availableDate).valueOf();
                            } else {
                                bDateComp = 0;
                            }
                            return moment(bDateComp).valueOf() - moment(aDateComp).valueOf();
                        });
                        this.mapPipelineDataToBucket(data);
                    }
                }
                this.gridLoading = false;

                if (this.gridApi) {
                    this.gridApi.forEachNode((node) => {
                        if (node.group) {
                            node.setExpanded(true);
                        }
                    });
                }
            },
            (error) => {
                console.error(error);
                this.toastr.showError("Unable to load pipeline bucket", "Error");
            }
        );
    }

    mapPipelineDataToBucket(data: PipelineBucket[]) {
        this.allBucketData = data;
        data?.forEach((element) => {
            if (element?.pipelineBucketMapping?.length > 0) {
                element.pipelineBucketMapping = CommonMethods.assignPipelineDataToBucketMapping(element.pipelineBucketMapping, this.rowData, this.oppNameFields);
            }
        });
        this.pipelineBucketData = data;
        let isNewAdded = this.weeklyBucketData.some(item => item.pipelineBucketId == 0); // true
        let unmatched = data.filter(item => !this.weeklyBucketData.some(_item => _item.pipelineBucketId === item.pipelineBucketId));
        if (isNewAdded && unmatched && unmatched.length > 0) {
            let placeholderData = JSON.parse(JSON.stringify(unmatched[0]));
            placeholderData.deleteLevel = DeleteLevel.BucketRow;
            this.emitStoreData({ bucketGroup: placeholderData, eventname: "undoPlaceholder" });
        }

        this.setPipelineBucketData(data);
    }
    setPipelineBucketData(data) {
        this.mapPlaceholderHighlights(data);
        this.mapRowDataWithWeeklyUpdate(data);
        this.weeklyBucketData = JSON.parse(JSON.stringify(data));
    }

    saveCaseCode(item: any) {
        this.updatePipeline(item, false, 'bucket');

    }

    saveNotes(item: any) {
        let code;
        let pipelineBucket;
        let pipelineBucketId;

        console.log(item)
        if (BucketRowType.Manager == item.data.rowType) {
            this.pipelineService.saveNote(item.employeeNote).subscribe((response) => {
                code = item.employeeNote.employeeCode;
                pipelineBucketId = item?.employeeNote?.pipelineBucketId;
                pipelineBucket = this.allBucketData.find(b => b.pipelineBucketId == pipelineBucketId)
                if (pipelineBucket) {
                    pipelineBucket.lastUpdated = moment();
                }

                if (code) {
                    if (item.employeeNote?.outrage && item.employeeNote?.outrage?.trim() != "" && item.employeeNote?.cdWork && item.employeeNote?.cdWork?.trim() != "") {
                        this.allBucketData
                            .filter((e) => e.employee != null && e.employee.employeeCode == code)
                            .forEach((e) => {
                                e.hasNote = true;
                                e.hasCdWorkNote = true;
                                e.colorCode = item.employeeNote.colorCode;
                            });
                    } else if (item.employeeNote?.outrage && item.employeeNote?.outrage?.trim() != "") {
                        this.allBucketData
                            .filter((e) => e.employee != null && e.employee.employeeCode == code)
                            .forEach((e) => {
                                e.hasNote = true;
                                e.hasCdWorkNote = false;
                                e.colorCode = item.employeeNote.colorCode;
                            });
                    } else if (item.employeeNote?.cdWork && item.employeeNote?.cdWork?.trim() != "") {
                        this.allBucketData
                            .filter((e) => e.employee != null && e.employee.employeeCode == code)
                            .forEach((e) => {
                                e.hasNote = false;
                                e.hasCdWorkNote = true;
                                e.colorCode = "";
                            });
                    } else {
                        this.allBucketData
                            .filter((e) => e.employee != null && e.employee.employeeCode == code)
                            .forEach((e) => {
                                e.hasNote = false;
                                e.hasCdWorkNote = false;
                                e.colorCode = "";
                            });
                    }
                    this.mapPipelineDataToBucket(this.allBucketData);

                }

                this.toastr.showSuccess("Note saved successfully", "Success");
            });
        } else {
            this.pipelineService.saveOfficeNote(item.officeNote).subscribe((response) => {
                code = item.officeNote.officeCode;
                pipelineBucketId = item?.officeNote?.pipelineBucketId;
                this.allBucketData.find(b => b.pipelineBucketId == pipelineBucketId).lastUpdated = moment();

                if (code) {
                    if (item.officeNote?.officeOutrage && item.officeNote?.officeOutrage?.trim() != "" && item.officeNote?.cdWork && item.officeNote?.cdWork?.trim() != "") {
                        this.allBucketData
                            .filter((o) => o.office != null && o.office?.officeCode == code && o.pipelineBucketId == pipelineBucketId)
                            .forEach((e) => {
                                e.hasNote = true;
                                e.hasCdWorkNote = true;
                                e.colorCode = item.officeNote.colorCode;
                            });
                    } else if (item.officeNote?.officeOutrage && item.officeNote?.officeOutrage?.trim() != "") {
                        this.allBucketData
                            .filter((o) => o.office != null && o.office?.officeCode == code && o.pipelineBucketId == pipelineBucketId)
                            .forEach((e) => {
                                e.hasNote = true;
                                e.hasCdWorkNote = false;
                                e.colorCode = item.officeNote.colorCode;
                            });
                    } else if (item.officeNote?.cdWork && item.officeNote?.cdWork?.trim() != "") {
                        this.allBucketData
                            .filter((o) => o.office != null && o.office?.officeCode == code && o.pipelineBucketId == pipelineBucketId)
                            .forEach((e) => {
                                e.hasNote = false;
                                e.hasCdWorkNote = true;
                                e.colorCode = "";

                            });
                    } else {
                        this.allBucketData
                            .filter((o) => o.office != null && o.office?.officeCode == code && o.pipelineBucketId == pipelineBucketId)
                            .forEach((e) => {
                                e.hasNote = false;
                                e.hasCdWorkNote = false;
                                e.colorCode = "";
                            });
                    }
                    this.mapPipelineDataToBucket(this.allBucketData);

                }

                this.toastr.showSuccess("Note saved successfully", "Success");
            });
        }
    }

    updateWeeklyBucketData(weeklyBucket) {
        let pipelineIds: string[] = [];
        // Push new row to UI
        if (weeklyBucket.pipelineBucketId == 0) {
            this.weeklyBucketData.push(weeklyBucket);
            this.setPipelineBucketData(this.weeklyBucketData);
        }

        if (
            weeklyBucket &&
            (weeklyBucket as PipelineBucket).pipelineBucketMapping &&
            (weeklyBucket as PipelineBucket).pipelineBucketMapping.length > 0
        ) {
            (weeklyBucket as PipelineBucket).pipelineBucketMapping.forEach((map) => {
                if (map?.pipeline) {
                    pipelineIds.push(map.pipeline.poId);
                }
            });
        }
        weeklyBucket?.pipelineBucketMapping?.forEach((elementPipeline) => {

            if (elementPipeline.pipeline && elementPipeline.pipeline.poId && elementPipeline.pipeline.poId > 0) {
                let index = this.rowData.findIndex((i) => i.poId == elementPipeline.pipeline.poId);
                elementPipeline.pipeline.pipelineBucketId = weeklyBucket.pipelineBucketId;
                this.rowData[index] = elementPipeline.pipeline;
                this.gridApi.setRowData(this.rowData);
                var rowNode = this.gridApi.getRowNode(this.rowData[index].poId.toString());
                if (rowNode) {
                    rowNode.setData(elementPipeline.pipeline);
                    var params = { force: true, suppressFlash: true, update: [rowNode] };
                    this.gridApi.redrawRows({ rowNodes: [rowNode] });
                    this.gridApi.refreshCells(params);
                }
            }
        });

        let regionFilterText = this.mapRegionToIds();
        this.pipelineService.upsertPipelineBucket(weeklyBucket, this.weekOffset, regionFilterText).subscribe(
            (res) => {
                if (res && res?.pipelineBuckets) {
                    let data = res.pipelineBuckets;
                    this.mapPipelineDataToBucket(data);
                }
                if (res && res?.bucketGroups) {
                    this.groupData = res.bucketGroups;
                }
                if (pipelineIds.length > 0) {
                    this.checkPipelineInBuckets(pipelineIds, res?.pipelineBuckets);
                }
            },
            (error) => {
                console.error(error);
                this.toastr.showError("Unable to update bucket data", "Error");
            }
        );
    }

    mapRowDataWithWeeklyUpdate(data) {
        this.rowData.map((x) => {
            let filteredPipelineBucket = data.filter((f) => f.pipeline != null && f.pipeline.poId == x.poId);
            let sorted = filteredPipelineBucket.sort(
                (a, b) => moment(a.weekStartDate).valueOf() - moment(b.weekStartDate).valueOf()
            );
            x.weekStartDate = sorted[0]?.weekStartDate;
        });
    }

    deleteWeeklyBucketGroupData(bucketGroup) {
        let bucket = this.weeklyBucketData.filter((x) => x.bucketGroupId == bucketGroup.bucketGroupId);

        let regionFilterText = this.mapRegionToIds();
        let pipelineIds: string[] = [];
        let pipelineIdList: any[] = [];
        let pipelineData: any[] = [];

        if (bucket) {
            bucket.forEach((item) => {
                if (item && item.pipelineBucketMapping && (item as PipelineBucket).pipelineBucketMapping.length > 0) {
                    (item as PipelineBucket).pipelineBucketMapping.forEach((map) => {
                        if (map?.pipeline) {
                            pipelineIds.push(map.pipeline.poId);
                            pipelineIdList.push({ pipelineId: map.pipeline.pipelineId });
                            pipelineData.push(map.pipeline);
                        }
                    });
                }
            });
        }

        this.pipelineService.upsertPipelineGroup(bucketGroup, this.weekOffset, regionFilterText).subscribe((res) => {
            let data = res?.pipelineBuckets;
            this.mapPipelineDataToBucket(data);
            if (pipelineIdList && pipelineIdList.length > 0) {
                let pipelineId = pipelineIdList.map((d) => d.pipelineId);
                this.pipelineService
                    .updateBulkOppStage(pipelineId, Opportunity_Stage.Backlog)
                    .subscribe((updatedDate) => {
                        pipelineData.forEach((pipelineElement) => {
                            let stage = this.opportunityStage.find(
                                (x) => x.opportunityStageId == Opportunity_Stage.Backlog
                            );
                            pipelineElement.opportunityStage = stage;
                            pipelineElement.manager = null;
                            this.outOpportunityMove(pipelineElement);
                        });
                        if (bucket && pipelineIds.length > 0) {
                            if (pipelineIds.length > 0) {
                                this.checkPipelineInBuckets(pipelineIds, res.pipelineBuckets);
                            }
                        }
                    });
            } else {
                this.groupData = res?.bucketGroups;
            }
        });
    }
    deleteBucketDataAutomation(item, registrationId: number, fieldName: string) {
        let regionFilterText = this.mapRegionToIds();
        let pipelineIds: string[] = [];
        if (item && item.pipelineBucketMapping && (item as PipelineBucket).pipelineBucketMapping.length > 0) {
            (item as PipelineBucket).pipelineBucketMapping.forEach((map) => {
                if (map?.pipeline) {
                    pipelineIds.push(map.pipeline.poId);
                }
            });
        }

        this.pipelineService.deleteBucketDataAutomation(registrationId, this.weekOffset, regionFilterText, fieldName).subscribe(res => {
            let data = res?.pipelineBuckets;
            this.mapPipelineDataToBucket(data);

            let stage = this.opportunityStage.find((x) => x.opportunityStageId == Opportunity_Stage.Backlog);

            item.pipelineBucketMapping[0].pipeline.opportunityStage = stage;

            this.outOpportunityMove(item.pipelineBucketMapping[0].pipeline);
            if (pipelineIds.length > 0) {
                this.checkPipelineInBuckets(pipelineIds, res.pipelineBuckets);
            }


            if (this.selectedOppStage) {
                this.updateBucketOnFiltering(this.selectedOppStage.join(","));
            }



        });

    }
    deleteWeeklyBucketData(item) {
        let regionFilterText = this.mapRegionToIds();
        let pipelineIds: string[] = [];
        if (item && item.pipelineBucketMapping && (item as PipelineBucket).pipelineBucketMapping.length > 0) {
            (item as PipelineBucket).pipelineBucketMapping.forEach((map) => {
                if (map?.pipeline) {
                    pipelineIds.push(map.pipeline.poId);
                }
            });
        }

        this.pipelineService.upsertPipelineBucket(item, this.weekOffset, regionFilterText).subscribe((res) => {
            let data = res?.pipelineBuckets;
            this.mapPipelineDataToBucket(data);
            // Update the grid in case of pipeline status - SOLD as other opp and reg will be deleted from bucket and opp stage will be updated
            if (item.opsLikelihoodId == OpsLikelihoodEnum.Staffed) {
                this.getPipelineData();
            }

            // To update grid after delete the bucket
            // If the same opportunity is in another bucket, stage will be not updated to backlog
            let updateDate;
            let availablePipelineData = [];
            updateDate = item?.pipelineBucketMapping?.filter(
                (d) => d.pipelineBucketMappingId == item.pipelineBucketMappingId
            );
            if (updateDate && updateDate.length > 0) {
                data.forEach((bucketData) => {
                    bucketData.pipelineBucketMapping.forEach((mappingData) => {
                        if (mappingData?.pipeline?.poId == updateDate[0]?.pipeline?.poId) {
                            availablePipelineData.push(bucketData);
                        }
                    });
                });
                if (availablePipelineData && availablePipelineData.length > 0) {
                    this.getPipelineData();
                }
            }

            // To update the stage in case of multiple opportunities and registration
            if (
                item &&
                item.pipelineBucketMapping &&
                item.pipelineBucketMapping.length > 0 &&
                availablePipelineData &&
                availablePipelineData.length == 0
            ) {
                let rowToBeDeleted;
                rowToBeDeleted = item.pipelineBucketMapping.filter(
                    (d) => d.pipelineBucketMappingId == item.pipelineBucketMappingId
                );
                if (rowToBeDeleted && rowToBeDeleted.length > 0) {
                    let stage = this.opportunityStage.find((x) => x.opportunityStageId == Opportunity_Stage.Backlog);
                    rowToBeDeleted[0].pipeline.opportunityStage = stage;
                    let regionFilter = this.mapRegionToIds();
                    this.pipelineService
                        .updatePipeline(rowToBeDeleted[0].pipeline, 'OppStage', regionFilter)
                        .subscribe((response) => {
                            this.outOpportunityMove(response[0]);
                            if (pipelineIds.length > 0) {
                                this.checkPipelineInBuckets(pipelineIds, res.pipelineBuckets);
                            }
                        });
                }
            }

            if (this.selectedOppStage) {
                this.updateBucketOnFiltering(this.selectedOppStage.join(","));
            }
        });
    }
    //Check and delete grid data after bucket update/Delete if pipeline is not applicable for region filter
    checkPipelineInBuckets(poIds: string[], buckets: PipelineBucket[]) {
        if (buckets) {
            poIds.forEach((poId) => {
                let pipelineExist = buckets.some((bucket) =>
                    bucket?.pipelineBucketMapping?.some((pipelineMap) => pipelineMap?.pipeline?.poId == poId)
                );
                let pipeline = this.rowData.find((i) => i.poId == poId) as Pipeline;
                var selectedRegions = this.mapRegionToIds().split(",");
                if (pipeline) {
                    var applicableRegions = this.getPipelineApplicableRegions(pipeline);
                    if (applicableRegions.length > 0 && selectedRegions) {
                        if (
                            !(selectedRegions.some((regionId) => applicableRegions.includes(regionId)) || pipelineExist)
                        ) {
                            this.deletePipelineFromGrid(pipeline.poId);
                        }
                    }
                }
            });
        }
    }
    //To be changed if there is a change in logic of region filter
    getPipelineApplicableRegions(pipeline: Pipeline) {
        var regionIds: string[] = [];
        //Bucket location
        if (pipeline?.bucketOffice && !regionIds.includes(pipeline?.bucketOffice?.regionId?.toString())) {
            regionIds.push(pipeline.bucketOffice?.regionId?.toString());
        }
        //Manager location
        if (pipeline?.manager?.regionId && !regionIds.includes(pipeline?.manager?.regionId?.toString())) {
            regionIds.push(pipeline.manager.regionId?.toString());
        }


        if (pipeline?.officeToBeStaffed?.length > 0) {
            pipeline.officeToBeStaffed.forEach((of) => {
                regionIds.push(of.regionId?.toString())
            })
        }
        else {
            if (pipeline?.locationOfDeal) {
                regionIds.push(pipeline.locationOfDeal.dealRegionId?.toString());
            }

            if (pipeline.opportunityTypeId == 2 && pipeline.submittedBy) {
                regionIds.push(pipeline.submittedBy.regionId?.toString());
            }
        }

        return regionIds;
    }
    //Delete the row node from the grid
    deletePipelineFromGrid(poId: string) {
        if (poId != undefined) {
            this.resetCurrentGroupNode();
            let index = this.rowData.findIndex((i) => i.poId == poId);
            this.rowData.splice(index, 1);
            this.gridApi.setRowData(this.rowData);
            var rowNode = this.gridApi.getRowNode(poId.toString());
            if (rowNode) {
                var params = { force: true, suppressFlash: true, delete: [rowNode] };
                this.gridApi.redrawRows({ rowNodes: [rowNode] });
                this.gridApi.refreshCells(params);
            }
            this.setGroupExpandProperty();
        }
    }

    // Update status of other opp/reg in case of sold status
    updateStgeAfterSold(data) {
        data.forEach((element) => {
            element.deleteLevel = DeleteLevel.PipelineBucketMapping;
            this.deleteWeeklyBucketData(element);
        });
        let pipelineId = data.map((d) => d.pipeline.pipelineId);
        this.pipelineService.updateBulkOppStage(pipelineId, Opportunity_Stage.Backlog).subscribe((updatedDate) => {
            // Update the grid after setting sold
            pipelineId.forEach((element) => {
                let index = this.rowData.findIndex((i) => i.pipelineId == element);
                if (index >= 0) {
                    let oppStage = this.opportunityStage.find((a) => a.opportunityStageId == Opportunity_Stage.Backlog);
                    this.rowData[index].opportunityStage = oppStage;
                    this.setOfficeCluster();
                    this.gridApi.setRowData(this.rowData);
                    var rowNode = this.gridApi.getRowNode(this.rowData[index].poId.toString());
                    if (rowNode) {
                        rowNode.setData(element);
                        var params = { force: true, suppressFlash: true, update: [rowNode] };
                        this.gridApi.redrawRows({ rowNodes: [rowNode] });
                        this.gridApi.refreshCells(params);
                        this.mapPipelineDataToBucket(this.weeklyBucketData);
                    }
                }
            });

            data.forEach((element) => {
                if (element.pipeline) {
                    element.pipeline.oppName = element.pipeline
                        ? CommonMethods.getOpportunityName(element.pipeline, this.oppNameFields)
                        : "";
                }
            });
        });
    }

    triggerUpdateAfterVisibilityChanges() {
        this.pipelineService.getUserColumns(PagesTypes.HomeDashboard).subscribe((columns: GridColumn[]) => {
            this.defaultColumns = columns;
            this.oppNameFields = columns
                .filter((e) => e.isOppName == true)
                .sort((a, b) => (a.oppSortOrder < b.oppSortOrder ? -1 : 1));
            this.pipelineGridService.setOppNameFields(this.oppNameFields);
            this.gridApi.refreshCells({ force: true });
            this.getPipelineBucket();

        });
    }

    resetCurrentGroupNode() {
        if (this.gridApi) {
            this.currentRowGroups = [];
            this.gridApi.forEachNode((node) => {
                if (node.group) {
                    if (node.expanded == false) {
                        this.currentRowGroups.push(node.key);
                    }
                }
            });
        }
    }

    setGroupExpandProperty() {
        if (this.gridApi) {
            this.gridApi.forEachNode((node) => {
                if (node.group) {
                    let previousNodeState = this.currentRowGroups.find((data) => data == node.key);
                    if (previousNodeState) {
                        node.setExpanded(false);
                    } else {
                        node.setExpanded(true);
                    }
                }
            });
        }
    }

    userPreferenceUpdate(event) {
        let updatedPreference = { preference: true };
        this.preferenceUpdate = { ...updatedPreference };
        this.getColumnData();
    }

    setOpsLikelihood(mappingData) {
        mappingData.pipeline.pipelineBucketId = mappingData.pipelineBucketId;
        this.savePipeline(mappingData.pipeline, "opsLikelihood");
    }

    updatePipeline(event, isContext = false, source = '') {

        if (!isContext) {
            let index = this.rowData.findIndex((i) => i.poId == event.opportunity.poId);
            var oldData = this.rowData[index];
            this.setOldValueByField(oldData, event.fieldName);
        }
        if (source == 'bucket' && event.fieldName == 'caseCode') {
            this.oldCellValue = event.previouscasecode;

        }
        let colDef = {
            field: event.fieldName
        };
        let column = {
            colDef: colDef
        };
        event.data = event.opportunity;
        event.colDef = colDef;
        event.column = column;
        this.onCellValueChanged(event);
    }

    resertBucketSelection() {
        let rowsDeselected = false;

        this.weeklyBucketData.forEach((bucket) => {
            if (bucket.pipelineBucketMapping) {
                bucket.pipelineBucketMapping.forEach((element) => {
                    if (
                        element.pipeline &&
                        element.pipeline.hasOwnProperty("isRowSelected") &&
                        element.pipeline["isRowSelected"] == true
                    ) {
                        element.pipeline["isRowSelected"] = false;
                        rowsDeselected = true;
                    }
                });
            }
        });

        this.rowData.forEach((element) => {
            if (
                element.hasOwnProperty("isRowSelected") &&
                element?.isRowSelected == true
            ) {
                element.isRowSelected = false;
                rowsDeselected = true;
            }
        });


        // Only run this if there are deselected rows to redraw, otherwise it will rerender the grid each click and block certain interactions
        if (rowsDeselected) {
            this.redrawRows(false);
        }
    }

    getConflictedOffices(pipeline) {
        this.pipelineService.getRelatedTrackerClientsByRegistrationId(pipeline.registrationId).subscribe(res => {
            let conflictsData = [];
            conflictsData = res;

        })
    }

    getConflictedOfficesForEmail(data, currentPipeline) {
        let conflictsData = data.sort((a, b) => { return CommonMethods.sortConflicts(a?.registrationStageId ?? 0, a, b) });
        var currentDate = moment().toDate();
        var pastDate = currentDate.getDate() - 365;
        currentDate.setDate(pastDate);
        let CurrentDate = moment(currentDate).format("MM/DD/YYYY");

        let dataWtActiveOffice = conflictsData.filter(x => x.registrationStageId == RegistrationStageEnum.WorkStarted && x.officeName != undefined
            && moment(x.caseEndDate).isAfter(CurrentDate) && x.clientId != currentPipeline?.client[0]?.clientId);

        let dataWtPriorOffice = conflictsData.filter(x => x.registrationStageId == RegistrationStageEnum.WorkCompleted && x.officeName != undefined
            && moment(x.caseEndDate).isAfter(CurrentDate) && x.clientId != currentPipeline?.client[0]?.clientId);


        // let activeOffice = Array.from(new Set(dataWtActiveOffice.map((office) => office.officeName))).join(", "); // Remove duplicates  

        // let priorOffice = Array.from(new Set(dataWtPriorOffice.map((office) => office.officeName))).join(", "); // Remove duplicates  
        let conflictedOffice = [];
        if (data && data.length > 0) {
            conflictedOffice = Array.from(new Set(data.flatMap((x) =>
                x?.conflictedOffice).filter((name) => name !== undefined && name !== null && name !== "")));
        } else {
            conflictedOffice = [];
            conflictedOffice = currentPipeline?.conflictedOffice; // Remove duplicates  
        }

        if (conflictedOffice == undefined) {
            conflictedOffice = [];
        }
        return [...dataWtActiveOffice, ...dataWtPriorOffice, ...conflictedOffice];


    }

    outSendEmail(event:any, isFromGrid=false) {
        const pipelineList = this.getPipelineRowsForEmail(isFromGrid);

        if (pipelineList && pipelineList.length > 0) {

            // let conflictedPipeline = pipelineList.filter(x => x.mbStatus = dealMBStatus.ActiveMB).map(x => x.pipeline);

            const observables = this.getConflictedOfficesObservables(pipelineList);

            // wait for api call and then execute the logic
            forkJoin(observables).subscribe((results): any => {

                let conflictOfficeByRegistrationId = [];

                results.forEach(item => {
                    let office = this.getConflictedOfficesForEmail(item.response, item.currentPipeline);
                    conflictOfficeByRegistrationId.push({ registrationId: item.registrationId, conflictedOffices: office })
                });

                pipelineList.forEach(element => {
                    element.conflictedOffice = conflictOfficeByRegistrationId.find(x => x.registrationId == element.pipeline.registrationId)?.conflictedOffices;
                });

                //get body from helper
                var body = EmailHelper.generateEmailBody(pipelineList, this.pipelineGridService.oppNameFields);
                
                const handleCopy = CommonMethods.copyToClipboard("<div>" + body + "</div>");

                this.resertBucketSelection();
                let weekStartDate = moment().weekday(1).toDate();
                let currentWeekMonday = moment(weekStartDate).format("MMM DD");
                var subject = "PEG Alignment of " + currentWeekMonday;
                EmailHelper.openEmail(subject);
            });

        } else {
            this.toastr.showWarning("Please select at least one bucket row", "Please select a bucket row");
        }
    }

    private getPipelineRowsForEmail(isFromGrid: boolean): any[] {
        const pipelineList: any[] = [];
      
        if (isFromGrid) {
          const selectedRows = this.gridApi?.getSelectedRows();
          if (selectedRows && selectedRows.length > 0) {
            return selectedRows.map(row => ({ pipeline: row }));
          }
        } else {
          this.weeklyBucketData.forEach(bucket => {
            bucket.pipelineBucketMapping.forEach(element => {
              if (element.pipeline &&
                  element.pipeline.hasOwnProperty("isRowSelected") &&
                  element.pipeline["isRowSelected"] === true) {
                pipelineList.push({ pipeline: element.pipeline, bucket: bucket });
              }
            });
          });
        }
        return pipelineList;
      }

    private getConflictedOfficesObservables(pipelineList: any[]): any[] {
        return pipelineList.map(element =>
            this.pipelineService.getRelatedTrackerClientsByRegistrationId(element.pipeline.registrationId).pipe(
            map(res => ({
                registrationId: element.pipeline.registrationId,
                response: res,
                currentPipeline: element.pipeline
            }))
            )
        );
    }

    // Set the width of a bucket group, emitted by date-buckets-column
    setBucketWidth(params) {
        // Adjust index by any weekly offset
        params.index -= this.weekOffset;
        this.bucketWidthController[params.index] = params.value;

        // Collapse any expanded columns if expanding a column, don't allow more than one expanded column
        for (let i = 0; i < this.bucketWidthController.length; i++) {
            if (this.bucketWidthController[i] == 2 && i != params.index) {
                this.bucketWidthController[i] = 1;
            }
        }

        // Adjust width of other buckets depending on the source bucket
        // Iterate through the array and hide buckets when available space is gone
        let availableSpace: number = 4;
        let usedSpace: number = this.bucketWidthController.reduce((a, b) => a + b); // Sum of the bucketWidthController array

        // Unhide to the right except for last column if space is available
        let columnIncrement = 1;
        let index = 0;

        if (params.index == this.bucketWidthController.length - 1) {
            index = this.bucketWidthController.length - 1;
            columnIncrement = -1;
        }

        while (usedSpace < availableSpace) {
            if (this.bucketWidthController[index] == 0) {
                this.bucketWidthController[index] = 1;
                usedSpace++;
            }

            index += columnIncrement;
        }

        // Contract or hide last bucket groups first if space is unavailable
        // Push to the left except for the first column
        columnIncrement = 1;
        index = 0;

        if (params.index + this.weekOffset == 0) {
            index = this.bucketWidthController.length - 1;
            columnIncrement = -1;
        }

        while (usedSpace > availableSpace) {
            // Don't change the bucket group that is being set
            if (index != params.index) {
                // Contract first to make space
                if (this.bucketWidthController[index] == 2) {
                    this.bucketWidthController[index] = 1;
                    usedSpace--;
                }

                // If space is still unavailable, hide instead
                if (usedSpace > availableSpace && this.bucketWidthController[index] == 1) {
                    this.bucketWidthController[index] = 0;
                    usedSpace--;
                }
            }

            index += columnIncrement;
        }

        // Scroll bucket week view to top
        document.body.querySelector("#capacitySplitArea").scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Update the weekly bucket data after filtering from the filters outside the grid
    updateBucketOnFiltering(oppStage) {
        let filteredOppStage = oppStage.split(",");
        let filteredData = [];
        if (filteredOppStage && filteredOppStage.length > 0) {
            filteredOppStage.forEach((oppStage) => {
                this.pipelineBucketData.forEach((element) => {
                    let stageFilteredData = element.pipelineBucketMapping.find(
                        (a) => a?.pipeline?.opportunityStage?.opportunityStageId == parseInt(oppStage)
                    );
                    if (stageFilteredData) {
                        filteredData.push(element);
                    }
                });
            });
            this.setPipelineBucketData(filteredData);
        }
    }

    // Move the week offset for the weekly buckets forward or backward
    adjustWeekOffset(event, amount) {

        //Automatically raise or lower the curtain based on week offset
        if (this.weekOffset == 0 && amount >= 4) {
            console.log("collapsing");
            this.onCurtainChange(CurtainState.Collapsed);
        } else if (this.weekOffset == 4 && amount == -4) {
            // Return to split view if navigating from later week view
            this.onCurtainChange(CurtainState.Split);
        }

        this.weekOffset += amount;
        // Reload pipeline buckets to refresh date buckets
        this.getPipelineBucket();
    }

    // - Share filter with everyone or specific users
    // - Set predefind data on filter and load filter data on load

    // Get the user defined filters based on users
    getUserFilter() {
        this.pipelineService.getUserFilter().subscribe((data) => {
            this.savedFilters = data;
            let defaultFilter = data.find((a) => a.isDefault == true);

            if (defaultFilter && !this.selectedFilter) {
                this.onSavedFilterChange(defaultFilter);
                this.selectedFilter = defaultFilter;
            } else {
                this.onSavedFilterChange(this.selectedFilter);
            }
        });
    }
    setSelectedFilter(event) {
        this.selectedFilter = event.selectedFilter;
    }

    // Get saved user filters based on employee code
    setOppStageFiltersOnLoad() {
        let oppStageFilter: any = document.getElementById("selectedOppStage");
        let appendedOppName = "";
        for (let index = 0; index < oppStageFilter.length; index++) {
            this.selectedOppStage.forEach((element) => {
                let oppStageName = this.opportunityStage.find((a) => a.opportunityStageId == element);
                if (oppStageName) {
                    if (oppStageFilter[index].innerHTML == oppStageName.opportunityStageName) {
                        appendedOppName += oppStageName.opportunityStageName + ", ";
                    }
                }
            });
        }
        document.getElementsByClassName("filter-option-inner-inner")[0].innerHTML = appendedOppName;
    }

    // Set column filters based on outside filters (opp stage)
    setUserColumnFilter(filterValue) {
        let filtered = filterValue.split(",");
        let appliedFilters = [];
        filtered.forEach((element) => {
            let oppStageName = this.opportunityStage.filter((a) => a.opportunityStageId == parseInt(element));
            if (oppStageName && oppStageName.length > 0) {
                appliedFilters.push(oppStageName);
            }
        });
        let tmpFilters = appliedFilters.map(function (item) {
            return item[0].sortOrder + ". " + item[0].opportunityStageName;
        });
        if (this.gridApi) {
            let currentColumnDef = this.gridApi?.getColumnDefs();
            let oppStageColumn: any = currentColumnDef.filter((a) => a.headerName == "Opportunity Stage");
            if (oppStageColumn && oppStageColumn.length > 0) {
                let oppStageFilter = {};
                oppStageFilter[oppStageColumn[0].colId] = {
                    filterType: "set",
                    values: tmpFilters
                };
                this.gridOptions.api.setFilterModel(oppStageFilter);
            }
        }
    }

    redrawRows(pipeline) {
        // Rerender cells
        this.gridApi.redrawRows();

        // If a new pipeline has been selected, jump to that part of the grid
        if (pipeline && pipeline.isRowSelected) {
            var rowNode = this.gridApi.getRowNode(pipeline.poId.toString());
            if (rowNode) {
                this.gridApi.ensureIndexVisible(rowNode.rowIndex, null);
                if (!this.gridApi.getRenderedNodes().some(x => x?.data?.registrationId == pipeline?.registrationId)) {
                    this.toastr.showWarning("Please adjust the filter to see the opportunity.", "Can't Highlight selected Opportunity");
                }
            } else {
                this.toastr.showWarning("Please adjust the pipeline curtain to see the opportunity.", "Can't Highlight selected Opportunity");
            }
        }
    }

    updateAddingNewGroup(value) {
        this.addingNewGroup = value;
    }

    // Returns true or false to apply CSS class for rows that contain selected pipelines
    setSelectedGridRows(event) {
        let isMatch: boolean = false;

        if (event?.data?.isRowSelected) {
            return true;
        }

        this.weeklyBucketData.forEach((bucket) => {
            if (!bucket.pipelineBucketMapping) {
                return false;
            }

            bucket.pipelineBucketMapping.forEach((element) => {
                if (element?.pipeline?.poId == event?.data?.poId) {
                    if (
                        element.pipeline &&
                        element.pipeline.hasOwnProperty("isRowSelected") &&
                        element.pipeline["isRowSelected"] == true
                    ) {
                        isMatch = true;
                    }
                }
            });
        });

        return isMatch;
    }

    bucketGroupDragUpdate(value: Boolean) {
        this.draggingBucketGroup = value;
    }

    propogateGroupData(value: BucketGroup[]) {
        this.groupData = value;
    }

    propogateBucketData(value: PipelineBucket[]) {
        this.weeklyBucketData = value;
        this.mapPipelineDataToBucket(this.weeklyBucketData);
    }

    // Commented out as this function causes performance issues

    /*dragOverBuckets(event) {
        if (!event?.path?.some((element) => element?.className?.includes("bucketGroupContainer"))) {
            Array.from(document.getElementsByClassName("placeholder")).forEach((element) => {
                element.classList.remove("placeholderHighlight");
            });
        }
        event.preventDefault();
    }*/

    externalFilterChanged() {
        if (this.gridApi) {
            this.gridApi.onFilterChanged();
            this.gridApi.refreshCells({ force: true });
        }
    }

    isExternalFilterPresent(): boolean {
        return true;
    }

    doesExternalFilterPass(node) {
        let status: Boolean = false;
        if (filterTypeArray && filterTypeArray.length > 0) {
            for (let element of filterTypeArray) {
                if (CommonMethods.PassesPipelineFilter(element, node.data)) {
                    status = true;
                }
            }
            return status;
        }
        else {
            return false;
        }


    }

    onExternalFilterChange(event) {
        filterTypeArray = [];

        if (event && event.length > 0) {
            filterTypeArray = event;
            this.coreSerivce.selectedFilter = filterTypeArray;


            this.getPipelineData();

            this.externalFilterChanged();
        }

        else {
            this.externalFilterChanged();
        }

    }

    bucketColumnPreferenceEmitter(event) {
        this.bucketColumnPreference = event;
    }

    // Initialize signal R for real time data
    initializeSignalR() {
        if (this.signalRService && this._coreService.appSettings.PEGSignalRBasePath.trim() != '') {
            this.signalRService.createConnection();
            this.signalRService.registerOnServerEvents();
            this.signalRService.registerOnActiveUsers();
            this.signalRService.startConnection();
            this.subscribeToNewUser();
            this.subscribeEditingStarted();
        }
    }

    // Real time updates with backend
    private subscribeToEvents(): void {
        this.signalRService.messageReceived.subscribe((updatedData) => {
            var rowNode = this.gridApi.getRowNode(updatedData.registrationId?.toString());
            if (rowNode) {
                if (this.currentUpdatingField == updatedData.field) {
                    this.gridApi.stopEditing()
                    this.toastr.showWarning("Updates has been done on this cell by " + updatedData?.loggedinName, "Conflict")
                } else {
                    this.toastr.showSuccess("Updating latest data done by " + updatedData?.loggedinName, "Update")
                }
                let rowdata = JSON.parse(JSON.stringify(rowNode.data));
                rowdata[updatedData.field] = updatedData.value;
                rowNode.setData(rowdata);
                var params = { force: true, rowNode: rowNode };
                this.gridApi.refreshCells(params);
                this.gridApi.flashCells({
                    rowNodes: [rowNode],
                    columns: [updatedData.field],
                    flashDelay: 6000,
                    fadeDelay: 2000
                });
            }
        });
    }


    private subscribeToNewUser(): void {
        // update active users list in case of new online users
        this.signalRService.newUserAdded.subscribe((updatedData) => {
            if ((updatedData && updatedData.length == 0) || !this.activeUsers) {
                this.activeUsers = [];
            }
            else {
                for (let i = 0; i < this.activeUsers.length; i++) {
                    let userExists = updatedData.find((el) => el == this.activeUsers[i].employeeCode);
                    if (!userExists) {
                        this.activeUsers.splice(this.activeUsers.indexOf(this.activeUsers[i]), 1);
                    }
                }
            }
            this.pipelineService.getEmployeeDetailsByCode(updatedData.join(',')).subscribe(res => {
                let employeeObj = res;
                updatedData.forEach(element => {
                    let employeeDetails = employeeObj.find(x => x.employeeCode == element)
                    if (employeeDetails) {
                        let fullName = `${employeeDetails?.firstName} ${employeeDetails?.lastName} (${employeeDetails?.employeeCode})`;
                        let initials = `${employeeDetails?.firstName?.charAt(0)}${employeeDetails?.lastName?.charAt(0)}`;
                        let userExists = this.activeUsers.some((el) => el.employeeCode === employeeDetails?.employeeCode);
                        if (!userExists) {
                            let userObj = {
                                "initials": initials,
                                "fullName": fullName,
                                "employeeCode": employeeDetails?.employeeCode,
                                "isJpeg": true,
                                "isJpg": true,
                            }


                            this.activeUsers.push(userObj);
                        }
                    }
                });
            })

        });
    }
    getOtherActiveUsers(activeUsers) {
        let otherActives = [];
        for (let i = 5; i <= activeUsers.length - 1; i++) {
            otherActives.push(activeUsers[i].fullName);
        }
        document.getElementById('otherActiveUsers').setAttribute('title', otherActives.join('\n'));
    }

    private subscribeEditingStarted(): void {
        this.signalRService.editingStarted.subscribe((editingStarted) => {
            this.currentUser = editingStarted?.loggedinName;
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        })
    }
    ngOnDestroy(): void {
        this.signalRService.DisposeAsync();
    }
    notifyAll(field: any, value: any, id: any): void {
        this.signalRService.notifyAll(this._coreService.loggedInUser.firstName, field, value, id);
    }

    notifyAllExceptSender(field: any, value: any, id: any): void {
        this.signalRService.notifyAllExceptSender(this._coreService.loggedInUser.firstName, field, value, id);
    }

    notifyEditing(field: any, value: any, id: any): void {
        this.signalRService.notifyAllCustom(this._coreService.loggedInUser.firstName, field, value, id, 'EditingStarted');
    }

    getActiveConnections() {
        this.signalRService.getActiveConnections();
    }

    processDownload() {
        let params: CsvExportParams = <CsvExportParams>{
            onlySelected: true,
            fileName: 'pipeline_data_export',
            skipColumnHeaders: false,
            processCellCallback: (params: ProcessCellForExportParams): string => {
                return this.processDataToExport(params);
            }
        };

        this.gridOptions.api.exportDataAsCsv(params);
    }

    processExcelDownload() {
        let params: ExcelExportParams = <ExcelExportParams>{
            onlySelected: true,
            fileName: 'pipeline_data_export',
            skipColumnHeaders: false,
            processCellCallback: (params: ProcessCellForExportParams): string => {
                return this.processDataToExport(params);
            }
        };

        this.gridOptions.api.exportDataAsExcel(params);
    }

    copySelectedRows() {
        this.gridApi.copySelectedRowsToClipboard({ includeHeaders: true });
    }

    processCellForClipboard(params: ProcessCellForExportParams) {
        let value = params.value;
        let colDef = params.column.getColDef();
        if (colDef?.field == 'submittedBy') {
            value = params && params.value ? CommonMethods.getEmployeeName(params.value) : '';
        } else if (colDef?.field == 'subSector' || colDef?.field == 'sector') {
            value = params?.value && params.value?.length > 0 ? params.value.map((item) => { return item.industryName }).join(',') : '';
        }
        return value;
    }

    processDataToExport(params: ProcessCellForExportParams) {
        let value = params.value;
        let colDef = params.column.getColDef();

        if (colDef?.field == 'submittedBy') {
            value = params && params.value ? CommonMethods.getEmployeeName(params.value) : '';
        } else if (colDef?.field == 'subSector' || colDef?.field == 'sector') {
            value = params?.value && params.value?.length > 0 ? params.value.map((item) => { return item.industryName }).join(',') : '';
        }
        else if (colDef?.field == 'svp' && params?.value?.hasOwnProperty('partners')) {
            value = params?.value.partners && params.value?.partners.length > 0 ? params.value.map((item) => { return item.searchableName }).join(',') : '';

        }
        else if (colDef?.field == 'operatingPartner' && params?.value?.hasOwnProperty('partners')) {
            value = params?.value.partners && params.value?.partners.length > 0 ? params.value.map((item) => { return item.searchableName }).join(',') : '';

        }

        return value;
    }

    updateSelectedOpportunitesFlags(registrationId) {

        let registrationIds: number[] = [];
        if (registrationId != null) {
            registrationIds = [registrationId];
        }
        else {
            registrationIds = this.getSelectedRegistrationIds();
        }

        if (registrationIds.length == 0) {
            this.toastr.showWarning("Please select atleast one row", "Warning");
        }

        if (registrationIds.length > 0) {
            this.pipelineService.updateOpportunitiesFlag(registrationIds).subscribe(res => {

                for (let opportunityFlag of res) {

                    let index = this.rowData.findIndex((i) => i.registrationId == opportunityFlag.registrationId);
                    let currentRowdata = this.rowData[index]
                    if (currentRowdata) {
                        currentRowdata.isFlagged = opportunityFlag.isFlagged;
                        this.rowData[index] = currentRowdata;
                        this.gridApi.setRowData(this.rowData);
                        var rowNode = this.gridApi.getRowNode(this.rowData[index].poId.toString());
                        if (rowNode) {
                            rowNode.setData(currentRowdata);
                            var params = { force: true, suppressFlash: true, update: [rowNode] };
                            this.gridApi.redrawRows({ rowNodes: [rowNode] });
                            this.gridApi.refreshCells(params);
                        }

                    }

                    this.weeklyBucketData.forEach((bucket) => {
                        bucket.pipelineBucketMapping.forEach((element) => {
                            if (
                                element.pipeline &&
                                element.pipeline.registrationId > 0 &&
                                opportunityFlag.registrationId == element.pipeline.registrationId
                            ) {
                                element.pipeline.isFlagged = opportunityFlag.isFlagged;

                            }
                        });
                    });
                }
            })
        }

    }

    updateSelectedOpportunitesPartnerFlags(registrationId) {

        let registrationIds: number[] = [];
        if (registrationId != null) {
            registrationIds = [registrationId];
        }
        else {
            registrationIds = this.getSelectedRegistrationIds();
        }

        if (registrationIds.length == 0) {
            this.toastr.showWarning("Please select atleast one row", "Warning");
        }

        if (registrationIds.length > 0) {
            this.pipelineService.updateOpportunitiesPartnerFlag(registrationIds, false).subscribe(res => {

                for (let opportunityFlag of res) {

                    let index = this.rowData.findIndex((i) => i.registrationId == opportunityFlag.registrationId);
                    let currentRowdata = this.rowData[index]
                    if (currentRowdata) {
                        currentRowdata.isPartnerEditFlagged = opportunityFlag.isFlagged;
                        currentRowdata.partnerEdit = [];
                        this.rowData[index] = currentRowdata;
                        this.gridApi.setRowData(this.rowData);
                        var rowNode = this.gridApi.getRowNode(this.rowData[index].poId.toString());
                        if (rowNode) {
                            rowNode.setData(currentRowdata);
                            var params = { force: true, suppressFlash: true, update: [rowNode] };
                            this.gridApi.redrawRows({ rowNodes: [rowNode] });
                            this.gridApi.refreshCells(params);
                        }

                    }

                    this.weeklyBucketData.forEach((bucket) => {
                        bucket.pipelineBucketMapping.forEach((element) => {
                            if (
                                element.pipeline &&
                                element.pipeline.registrationId > 0 &&
                                opportunityFlag.registrationId == element.pipeline.registrationId
                            ) {
                                element.pipeline.isPartnerEditFlagged = opportunityFlag.isFlagged;
                            }
                        });
                    });
                }
            })
        }

    }

    // Controls context menu disable, returns true (to disable) if no opps flagged by a partner edit are selected in the grid
    isPartnerFlaggedOppSelected() {
        let registrationIds: number[] = this.getSelectedRegistrationIds();
        let noPartnerFlagSelected = true;
        let self = this;
        registrationIds.forEach(function (value) {
            let row: Pipeline = self.rowData.find(r => r.registrationId == value);
            if (row && row.isPartnerEditFlagged) {
                noPartnerFlagSelected = false;
            }
        });

        return noPartnerFlagSelected;
    }


    // Return id's of opportunities selected in the grid
    getSelectedRegistrationIds() {
        let registrationIds: number[] = []
        if (this.weeklyBucketData?.some((wkb) => wkb.pipelineBucketMapping?.some(
            pbm => pbm?.pipeline?.isRowSelected))) {
            this.weeklyBucketData.forEach((bucket) => {
                bucket.pipelineBucketMapping.forEach((element) => {
                    if (
                        element.pipeline &&
                        element.pipeline.hasOwnProperty("isRowSelected") &&
                        element.pipeline["isRowSelected"] == true &&
                        element.pipeline.registrationId > 0 &&
                        !registrationIds.includes(element.pipeline.registrationId)
                    ) {
                        registrationIds.push(element?.pipeline?.registrationId);
                    }
                });
            });
        }
        if (this.gridApi.getSelectedRows().length > 0) {
            let selectedRows = this.gridApi.getSelectedRows();
            selectedRows.forEach((pipeline) => {

                if (pipeline?.registrationId > 0 &&
                    !registrationIds.includes(pipeline.registrationId))
                    registrationIds.push(pipeline?.registrationId);
            });
        }

        return registrationIds;
    }

    // Undo and redo actions for the grid
    addNewEvent(pipelineData, fieldName, eventname) {

        let newEvent: any = {};
        if (eventname == 'savePipeline') {
            newEvent.pipelineData = JSON.parse(JSON.stringify(pipelineData));
        }
        else {
            newEvent.pipelineData = pipelineData;
        }

        newEvent.fieldName = fieldName;
        newEvent.eventname = eventname;
        this.store.dispatch(addEvent({ event: newEvent }));

    }
    emitStoreData(event: any) {
        this.addNewEvent(event.bucketGroup, "", event.eventname)

    }
    onCurtainChange(event) {
        if (event == CurtainState.Expanded) {
            this.bucketData = undefined;
            this.isCurtainCollapsed = false;
            this.curtainState = CurtainState.Expanded;

            // disable split handle when grid area is full screen
            this.splitEl.disabled = true;
            this.getColumnData();

        } else if (event == CurtainState.Collapsed) {
            this.isCurtainCollapsed = true;

            let columnDefs: Array<any> = [];

            columnDefs = this.gridApi.getColumnDefs();
            let grouprowData;

            if (columnDefs && columnDefs.length > 0) {

                grouprowData = columnDefs
                    .filter(col => col.rowGroup === true)
                    .map(col => col.colId);

            }

            if (this.selectedFilter) {
                if (grouprowData) {
                    this.selectedFilter.groupingTemplateValue = JSON.stringify(grouprowData);
                }
                this.selectedFilter.filterTemplateValue = JSON.stringify(this.gridApi.getFilterModel());

                if (columnDefs) {
                    let grouprowData = columnDefs
                        .filter(col => col.rowGroup === true)
                        .map(col => col.colId);
                }

                if (this.selectedFilter) {
                    if (grouprowData) {
                        this.selectedFilter.groupingTemplateValue = JSON.stringify(grouprowData);
                    }
                    this.selectedFilter.filterTemplateValue = JSON.stringify(this.gridApi.getFilterModel());

                    this.selectedFilter.sortTemplateValue = JSON.stringify(this.gridColumnApi.getColumnState());
                }
            }

            this.curtainState = CurtainState.Collapsed;
        } else {
            this.isCurtainCollapsed = false;

            this.bucketData = undefined; // reseting the bucket data when curtain is lowered so that it won't go a drop a new row to bucket.
            // enable split handle when grid area is not full screen
            this.splitEl.disabled = false;
            this.curtainState = CurtainState.Split;

            // reset split view to 50/50
            this.resetCurtain();

            this.getColumnData();

        }
    }
    resetCurtain() {
        this.areasEl.first.setStyleFlex(0, 0, 'calc(50% - 5.5px)', false, false);
        this.areasEl.last.setStyleFlex(0, 0, 'calc(50% - 5.5px)', false, false);
        this.curtainState = CurtainState.Split;
    }
    closeFlyoutEmitter(event: any) {
        this.location.replaceState(window.location.pathname);

        if (this.isTemporary) {
            this.isTemporary = false;
            var rowNode = this.gridApi.getRowNode(event.registrationId.toString());
            if (rowNode) {
                let index = this.rowData.findIndex((i) => i.poId == rowNode.data.poId);
                this.rowData.splice(index, 1);
                this.gridApi.applyTransaction({ remove: [rowNode.data] });
            }
        }

    }
    handleOpenFlyout(event) {
        this.selectedOpportunity = JSON.parse(JSON.stringify(event));;
        this.oppSlideout.showPanel(true);
        this.isPipelineConflicted = true;
        var rowNode = this.gridApi.getRowNode(event.registrationId.toString());

        if (!this.gridApi.getRenderedNodes().some(x => x?.data?.registrationId == event.registrationId)) {
            this.AddTemporary(event);
        }
    }

    AddTemporary(event) {
        let regionFilter = this.mapRegionToIds();
        this.registrationService.addRegistrationToPipeline(event.registrationId, regionFilter).subscribe((res) => {
            if (res.pipelineId > 0) {
                if (res && !res?.expectedStart?.expectedStartDate) {
                    res.expectedStart = undefined
                }
                this.isTemporary = true;
                this.rowData.unshift(res);
                let row: RowDataTransaction = { add: [res], addIndex: 0 };
                let rowNode: RowNodeTransaction = this.gridApi.applyTransaction(row);

            }
        });


    }
    refreshCurPage() {

    }
    openStageModal(event) {
        let stageValue: RegistrationStage = event.data.registrationStage;
        const modalRefStageEdit = this.modalService.show(UpdateStageModalComponent, {
            initialState: {
                modalData: stageValue,
                registrationId: event.data.registrationId,
                targetData: (event.data?.target?.targetName) ? event.data?.target?.targetName : 'No target',
                hideWorkOptions: false
            },
            class: "modal-dialog-centered closed-detail-popup",
            backdrop: "static", keyboard: false
        });

        modalRefStageEdit.content.saveClosedEmitter.subscribe((res) => {
            event.data.registrationStage = res.stage;
            this.savePipeline(event.data, "stageStatus");

            let closedDetailData: RegistrationClosedInfo = res.closedInfo;
            closedDetailData.registrationId = event.data.registrationId;
            this.registrationService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
                this.toastr.showSuccess("Stage updated", "Success");
            });
        });
    }
}
var filterTypeArray = [];
