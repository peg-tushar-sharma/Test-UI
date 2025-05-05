import { Component, OnInit, ElementRef, AfterViewInit, Inject, LOCALE_ID } from '@angular/core';
import { RegistrationService } from './registration.service';
import { AuditLogModel, Registrations } from './registrations';
import { TextFilterComponent } from '../../shared/customFilters/text-filter/text-filter.component';
import { CustomHeaderComponent } from '../../shared/customFilters/custom-header/custom-header.component';
import { TagsRendererComponent } from '../../shared/tags/tags-renderer/tags-renderer.component';
import { PegTostrService } from '../../core/peg-tostr.service';
import { WorkType } from '../new-registration/workType';
import { forkJoin, Subject } from 'rxjs';
import { RegistrationStatus } from '../../shared/interfaces/registrationStatus';
import { RegistrationStatus as StatusRegistration } from '../../shared/enums/registration-status.enum';
import { RegistrationRequestService } from './registration-request-service';
import { RegistrationStage } from '../../shared/interfaces/RegistrationStage';
import { RegistrationType } from '../../shared/enums/registration-type.enum';
import { GridApi, ColDef, GridOptions, ExcelExportParams, ProcessCellForExportParams } from 'ag-grid-community';
import { AuditLogService } from '../../shared/AuditLog/auditLog.service';
import { DateFilterComponent } from '../../shared/customFilters/date-filter/date-filter.component'
import { Investment } from './investment';
import { TagsFilterComponent } from '../../shared/customFilters/tags-filter/tags-filter.component';
import { Employee, GridColumn } from '../../shared/interfaces/models';
import { RegistrationGridService } from './registration-grid.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../core/core.service';
import { RoleType } from '../../shared/enums/role-type.enum';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { GridValues } from '../../shared/grid-generator/grid-constants';
import { formatDate } from '@angular/common';
import { CommonMethods } from '../../shared/common/common-methods';
import { IconsRendererComponent } from '../../shared/icons-renderer/icons-renderer.component';
import { fieldAuth } from '../../shared/common/fieldAuth';
import { deals } from '../../deals/deal';
import { DealRegistrations } from '../../deals/dealRegistrations'
import { DealsService } from '../../deals/deals.service'
import { from } from 'rxjs';
import { BulkRegistrations, RegistrationFields } from './BulkRegistrations';
import { CategoryType } from '../../shared/enums/ga-category.enum';
import { GlobalService } from '../../global/global.service';
import { Partnership } from './partnership';
import { NgForm } from '@angular/forms';
import { Client } from '../../shared/interfaces/client';
import { NewRegistrationService } from '../new-registration/new-registration.service';
import { ClientEditorComponent } from '../../shared/grid-editor/client-editor/client-editor.component';
import { MaskRendererComponent } from '../../shared/grid-renderer/mask-renderer/mask-renderer.component';
import { PotentialMultibidderComponent } from '../../shared/potential-multibidder/potential-multibidder.component';
import { PagesTypes } from '../../shared/enums/page-type.enum';
import { UserColumn } from '../../pipeline/userColumn';
import { PipelineService } from '../../pipeline/pipeline.service';
import { RegistrationStageEnum } from '../../shared/enums/registration-stage.enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UpdateStageModalComponent } from '../../shared/update-stage-modal/update-stage-modal.component';
import { RegistrationClosedInfo } from '../registrationClosedInfo';
import { AppInsightWrapper } from '../../applicationInsight/appInsightWrapper';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent implements OnInit {

  public fieldAuth: fieldAuth = new fieldAuth();
  private form: NgForm;
  hasQueryParam: boolean = false;
  gridApi: GridApi;
  gridColumnApi;
  columnDefs: ColDef[];
  rowData: Registrations[];
  queueSearchRecords: Registrations[] = [];
  isSidebarVisible = false;
  agParams: any;
  showMultibidder = false;
  showSinglebidder = false;
  showSeller = false;
  registrationArray: Array<Registrations>;
  registrationStatus: RegistrationStatus[];
  filteredRegistrationStatus: RegistrationStatus[];
  registrationStage: RegistrationStage[];
  defaultNotesTab = "";
  updatedField = "";
  showFullTagName: boolean = true;
  disableClrStatus: boolean = true;
  bulkRgistrations: BulkRegistrations = new BulkRegistrations()
  responseSeq = [];
  enableStageButton: boolean = false;
  isConfirmationRequired: boolean = false;
  stageConfirmationMessage: string = "Are you sure you want to update stage for the selected registrations?";
  selectedRegistration: any
  clients: Client[] = [];
  clientLoad = false;
  isClearOnClient: boolean = false;
  isRegDetailsRefresh: any;
  type: string;
  auditLogStages: AuditLogModel[] = [];
  currentAuditLogStatus: AuditLogModel = new AuditLogModel();
  previousAuditLogStatus: AuditLogModel = new AuditLogModel();
  gridOptions: GridOptions;
  filterModel: any;

  public workTypes: WorkType[] = [];
  public isEditing = false;
  public isClientEditing = false;
  public isStageEditing = false;
  public isLoading = true;
  public isLoadingColumns = true;
  public isDownloadingExcel = false;
  public minimized = false;
  public displayCount = 0;
  public quickfilterPlaceHolder = '';
  public retainOldValue: string = '';
  public allColumns: GridColumn[] = [];
  public sidebarId = null;

  public isAllSearch = false;
  public enableExcelDownload = false;
  public registration: Registrations;
  public investment: Investment;
  public registrationTypeLabel = "";
  public registrationType = RegistrationType;
  public updatedStageId: number;
  isMultipleClient: false;
  public isMultibidderUserorAdmin
  public isLegalUserorAdmin
  public isClicked: boolean = false
  public isRegistrationUpdating = false
  clientTypeAhead = new Subject<string>();
  public filterData: any = [];
  public isStageEditable: boolean = false;

  public filterValue = '';
  public registrationStatusOptions = [{
    value: RegistrationType.Registration,
    label: 'Active Registrations',
    isSelected: true,
  }, {
    value: RegistrationType.Archived_Registrations,
    label: 'Archived Registrations',
    isSelected: false
  }]
  private filterQueryChanged: Subject<string> = new Subject<string>();
  constructor(private registrationService: RegistrationService, private gridService: RegistrationGridService,
    private elRef: ElementRef, private toastr: PegTostrService, public _regReqService: RegistrationRequestService,
    private auditLogService: AuditLogService, private router: Router, private coreService: CoreService,
    @Inject(LOCALE_ID) private locale: string, private appInsights: AppInsightWrapper, private _dealService: DealsService, private globalService: GlobalService, private newRegistrationService: NewRegistrationService, private activeRoute: ActivatedRoute, private route: Router, private _pipelineService: PipelineService, private modalService: BsModalService) {

    // Assignments
    this.registration = this._regReqService.registration;

    this.isMultibidderUserorAdmin = this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport));
    this.isLegalUserorAdmin = this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport || role.id == RoleType.MultibidderManager));
    this.isAllSearch =
      (this.router.url.includes('registrations'))
      && this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport));

    this.enableExcelDownload = this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.MultibidderManager || role.id == RoleType.PEGOperations || role.id == RoleType.TSGSupport || role.id == RoleType.RiskManagement));
    // Setting grid Options
    this.gridOptions = {
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            width: 300,
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
            }
          },
          {
            id: 'filters',
            labelKey: 'filters',
            labelDefault: 'Filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            width: 300,

          }
        ]
      },
      frameworkComponents: {
        textFilterComponent: TextFilterComponent,
        tagsRendererComponent: TagsRendererComponent,
        tagsFilterComponent: TagsFilterComponent,
        iconsRendererComponent: IconsRendererComponent,
        agClientEditor: ClientEditorComponent,
        maskRendererComponent: MaskRendererComponent
      },
      // getRowNodeId: (data: Registrations) => data.id.toString(),
      sortingOrder: ['desc', 'asc'],
      defaultColDef: this.gridService.getDefaultColumnDefinition,
      unSortIcon: false,
      suppressMenuHide: true,
      suppressRowClickSelection: true,
      rowHeight: 40,
      headerHeight: 40,
      suppressColumnVirtualisation: true,
      accentedSort: true,
      context: {
        componentParent: this
      },
      suppressCsvExport: true,
      suppressContextMenu: true,
      getRowNodeId: (reg: Registrations) => reg.nid.toString(),
      onGridReady: this.onGridReady.bind(this),
      onCellClicked: this.onCellClicked.bind(this),
      onFirstDataRendered: this.onFirstDataRendered.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onRowDataChanged: this.onRowDataChanged.bind(this),
      onSortChanged: this.onSortChanged.bind(this),
      onColumnMoved: this.onColumnMoved.bind(this),
      onSelectionChanged: (event) => this.onRowSelectionChanged(event),
      onCellEditingStopped: this.onCellEditingStopped.bind(this),
      onCellEditingStarted: this.onCellEditingStarted.bind(this),
      onColumnVisible: this.onColumnVisible.bind(this),

      excelStyles: [
        {
          id: "dateFormat",
          dataType: "DateTime",
          numberFormat: { format: "dd-mmm-yyyy;@" }
        },
        {
          id: "dateTimeFormat",
          dataType: "DateTime",
          numberFormat: { format: "dd-mmm-yyyy hh:MM;" }
        }
      ]
    };
    // Setting grid Options

  }



  SetQuickFilterPlaceHolder() {
    let placeholderArray = [];

    this.allColumns.forEach(ele => {
      if (ele.isQuickFilter) {
        placeholderArray.push(ele.headerName.toLowerCase());
      }
    });
    this.quickfilterPlaceHolder = "Search " + placeholderArray.join(',');
  }
  ngOnInit() {
    this.setRegistrationTypeLabel(null);
    this.SetQuickFilterPlaceHolder();

    this.getColumnData();
    this.getRegistrationStatusData();
    this.getRegistrationStageData();
    this.getWorkTypeData();
    this.filterQueryChangedSetQuickFilter();
    this.getUserAuthorization();
    this.activeRoute.params.subscribe(data => {
      if (data && data.registrationid) {
        this.sidebarId = data.registrationid;
        this.registrationService.getRegistrationById(this.sidebarId).subscribe(resp => {
          this.rowData = [resp];
          this.hasQueryParam = true;
          this.isLoading = false;
          if (resp) {
            this.gridApi.setRowData(this.rowData);
            const node = this.gridOptions.api.getRowNode(resp.nid);

            this.onCellClicked({
              api: this.gridApi,
              colDef: this.columnDefs.find(def => def.headerName === 'Reg ID'),
              column: this.gridColumnApi.getColumn('30'),
              columnApi: this.gridColumnApi,
              data: resp,
              node: node,
              rowIndex: 0,
            });
          }
        });
      } else if (data != undefined && data.hasOwnProperty('id')) {
        let searchableRegId = data.id;
        this.registrationService.getFilteredRegistration(searchableRegId).subscribe(resp => {
          this.rowData = resp;
          this.hasQueryParam = true;
          this.isLoading = false;
        });
      } else {
        this.getAllGridData();
        this.hasQueryParam = false;

      }
    });
  }

  getWorkTypeData() {
    this.globalService.getWorkTypeData()
      .subscribe(workTypes => {
        this.workTypes = workTypes;
        this._regReqService.workTypes = this.workTypes;
      });
  }

  onRowSelectionChanged(event) {
    let nodes = this.gridApi.getSelectedNodes();

    let isMaskedCount = nodes.filter(e => { return e.data.isMasked })
    let notMaskedCount = nodes.filter(e => { return e.data.isMasked == false })
    if (isMaskedCount.length > 1) {
      this.toastr.showWarning("You cannot add multiple registrations with masked registration.", "Message")
      this.gridApi.deselectNode(event.api.selectionService?.lastSelectedNode);
      return;
    }
    if (notMaskedCount.length > 0 && isMaskedCount.length > 0) {
      this.toastr.showWarning("You cannot add multiple registrations with masked registration.", "Message")
      this.gridApi.deselectNode(event.api.selectionService?.lastSelectedNode);
      return;
    }
    if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager) || (role.id == RoleType.PEGAdministrator) || (role.id == RoleType.PEGOperations) || (role.id == RoleType.TSGSupport)) && event.api.selectionService.lastSelectedNode && event.api.selectionService.lastSelectedNode.data.hasDeal) {
      this.toastr.showWarning("This registration is already linked to an expert tracker.", "Message")
      this.gridApi.deselectNode(event.api.selectionService?.lastSelectedNode);
      return;
    }

    if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager) || (role.id == RoleType.PEGAdministrator) || (role.id == RoleType.PEGOperations) || (role.id == RoleType.TSGSupport))) {
      let selectedRegistrationIds = [];
      nodes.forEach(reg => {

        let nodeData: any = reg;

        selectedRegistrationIds.push(nodeData.data.id);

      })
      if (selectedRegistrationIds && selectedRegistrationIds.length > 0) {
        this._dealService.getLinkedRegistrations(selectedRegistrationIds).subscribe(res => {
          if (res && res.length > 0) {
            this.toastr.showWarning('The registration id(s)' + res.join(',') + ' already linked.', 'Warning');
            this.gridApi.deselectNode(event.api.selectionService?.lastSelectedNode);
            return;
          }
          else {
            if (nodes.length > 10) {
              this.toastr.showWarning("Please select an action for these 10 records, Then continue to select additional records.", "Message")
              this.gridApi.deselectNode(event.api.selectionService?.lastSelectedNode);
            }

            if (nodes.length > 0) {
              this.enableStageButton = true;
            }
            else {
              this.enableStageButton = false;
            }
          }
        })
      }
      else {
        if (nodes.length > 0) {
          this.enableStageButton = true;
        }
        else {
          this.enableStageButton = false;
        }
      }
    }
    else {
      if (nodes.length > 10) {
        this.toastr.showWarning("Please select an action for these 10 records, Then continue to select additional records.", "Message")
        this.gridApi.deselectNode(event.api.selectionService.lastSelectedNode);
      }

      if (nodes.length > 0) {
        this.enableStageButton = true;
      }
      else {
        this.enableStageButton = false;
      }
    }

  }

  disableAddToTrackerShortcut() {


    let nodes = this.gridApi.getSelectedNodes();
    let isMaskedCount = nodes.filter(e => { return e.data.isMasked })
    if (isMaskedCount.length > 0) {
      return false;
    }
    else {
      return true;

    }

  }

  setSelectedRegistrations(type) {

    this.selectedRegistration = this.gridApi.getSelectedNodes();
    this.type = type;
  }


  filterQueryChangedSetQuickFilter() {
    this.filterQueryChanged
      .pipe(
        debounceTime(200) // wait 0.2 sec after the last event before emitting last event
        , distinctUntilChanged() // only emit if value is different from previous value
      )
      .subscribe(searchQuery => {
        if (searchQuery && !searchQuery.trim()) {
          this.filterValue = searchQuery.trim();
        }
        this.gridApi.setQuickFilter(this.filterValue);
      });
  }

  minimizeSidebar() {
    this.minimized = true;
  }

  maximizeSidebar() {
    this.minimized = false;
  }

  onFilterTextBoxChanged() {
    this.filterQueryChanged.next(this.filterValue);
  }

  onClearAllFilters() {
    this.filterValue = null;
    this.onFilterTextBoxChanged();
    this.gridApi.setFilterModel(null);
    this.gridApi.onFilterChanged();
  }

  getColumnData() {
    this.isLoadingColumns = true;
    this.registrationService.getUserColumns(PagesTypes.Registration).subscribe((columns: GridColumn[]) => {
      if (columns && columns.length) {
        this.columnDefs = this.gridService.getColumnDefinitions(columns);

        this.isLoadingColumns = false;
        this.allColumns = columns;
        this.SetQuickFilterPlaceHolder();

      }
    });
  }
  onColumnVisible(event) {
    this.mapColumnAttributes(event.columnApi.columnModel.gridColumns, event.columnApi.columnModel.displayedColumns)
  }

  mapColumnAttributes(gridColumnList: any[], displayedColumns: any[]) {
    let userColumnList = [];
    let userColumn: UserColumn;
    gridColumnList.forEach((element, index) => {
      userColumn = new UserColumn();
      userColumn.columnId = element.colId;
      userColumn.userColumnId = 0;
      userColumn.lastUpdated = new Date();
      userColumn.sortOrder = index;
      userColumn.columnWidth = element.actualWidth;

      let isPresent: boolean = displayedColumns.some(x => x.colId == element.colId);
      userColumn.isHide = !isPresent;


      userColumn.employeeCode = this.coreService.loggedInUser.employeeCode;
      userColumn.pageId = PagesTypes.Registration;
      userColumn.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
      userColumnList.push(userColumn);
    });
    this.saveUserPrefrences(userColumnList);
  }

  saveUserPrefrences(userColumnList) {
    this._pipelineService.savePipelineColumnPrefrences(userColumnList, false).subscribe((res) => {
      let val: GridColumn[] = res;
      this.toastr.showSuccess('Preferences has been saved', 'Success');
    });
  }

  getRegistrationStatusData() {
    this.registrationService.getRegistrationStatus()
      .subscribe(regStatus => {
        this.registrationStatus = regStatus;
        this._regReqService.registrationStatus = this.registrationStatus;
        this.filteredRegistrationStatus = this.registrationStatus.filter(r => !(r.registrationStatusId == 5 || r.registrationStatusId == 6));
      });
  }

  getRegistrationStageData() {
    this.globalService.getRegistrationStage()
      .subscribe(regStage => {
        this.registrationStage = regStage;
        //this.registrationStage = this.registrationStage.filter(r => r.registrationStageId<5);
        this._regReqService.registrationStage = this.registrationStage;
      });
  }

  renderPendingChangesIcon(fieldName) {
    if (this.registration.conflictApprovalTracker && this.registration.conflictApprovalTracker.length > 0) {
      if (this.registration.conflictApprovalTracker.some(x => x.hasApproved == false && x.fieldName == fieldName) && this.isLegalUserorAdmin == true) {
        return true;
      }
    }
    return false;
  }

  renderPendingChangesBanner() {
    if (this.registration.conflictApprovalTracker && this.registration.conflictApprovalTracker.length > 0) {
      if (this.registration.conflictApprovalTracker.some(x => x.hasApproved == false) && this.isLegalUserorAdmin == true) {
        return true;
      }
    }
    return false;
  }

  downloadExcel(event: any) {
    this.registrationService.VersionCheck().subscribe(res => {
      this.isDownloadingExcel = true;
      setTimeout(() => this.processExcelDownload(), 1);
    })
  }

  processExcelDownload() {
    let name = `RegistrationData_${formatDate(new Date(), GridValues.dateFormat, this.locale)}`;
    let columns = []
    this.columnDefs.forEach((r) => {
      if (r.headerName != '' && r.headerName != 'Select')
        columns.push(r.field);

    })


    let params: ExcelExportParams = <ExcelExportParams>{

      allColumns: true,
      fileName: name,
      sheetName: name,
      // columnKeys: columns,

      processCellCallback: (params: ProcessCellForExportParams): string => {
        let value = params.value;
        let colDef = params.column.getColDef();

        if (colDef.field == 'lud') {
          colDef.cellClass = 'dateTimeFormat';
          value = params && params.value ? CommonMethods.converToLocal(params.value, true) : '';
        } else if (colDef.headerName.toLowerCase().endsWith('dt')) {
          value = params && params.value ? CommonMethods.converToLocal(params.value) : '';
        } else if (colDef.field == 'tags') {
          value = CommonMethods.tagsGetter(params.node).trim().replace(/[ ]+/g, ", ");
        }
        return value;
      }
    };

    this.gridOptions.api.exportDataAsExcel(params);
    this.isDownloadingExcel = false;
  }
  isRegistrationTypeExists(value) {
    return this.registrationStatusOptions.some(rl => rl.value == value && rl.isSelected==true);
  }
  getAllGridData() {
    let getsearchItems$ = [];
    this.responseSeq = [];
    // Creating fork join services
    if (this.isRegistrationTypeExists(RegistrationType.Registration)) {
      getsearchItems$.push(this.registrationService.getRegistrationData());
      this.responseSeq.push(RegistrationType.Registration);
    }
    if (this.isRegistrationTypeExists(RegistrationType.Archived_Registrations)) {
      getsearchItems$.push(this.registrationService.getArchivedRegistrations());
      this.responseSeq.push(RegistrationType.Archived_Registrations);
    }


    forkJoin(...getsearchItems$).subscribe((responses: any) => {
      if (responses && responses.length) {
        this.rowData = [];

        this.responseSeq.forEach(currentResponse => {
          let currIndex = this.responseSeq.indexOf(currentResponse)
          this.rowData.push(...responses[currIndex]);
        });

        if (this.queueSearchRecords && this.queueSearchRecords.length) {
          this.rowData.push(...this.queueSearchRecords);
          this.queueSearchRecords = [];
        }
        // this.totalRegistrations = this.rowData.length;
        this.toastr.showSuccess('Registrations loaded successfully', 'Success');
        this.isClicked = false;

        if (this.gridApi) {
          this.gridApi.hideOverlay();
        }
      }
      else {
        this.toastr.showError('Error while loading registrations. Please try again.', 'Error');
      }

      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading registrations. Please try again.', 'Error');
        this.isLoading = false;
      }
    );
    this.appInsights.logEvent(`${CategoryType.RegistrationGrid} - grid load grid data load`);
  }

  onGridReady(params) {
    this.agParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.onFirstDataRendered();
  }

  onCellClicked(object) {
    console.log({object});
    if (this.checkForEditable(object) == false) {

      if (object.column && object.column.colId && object.column.colId == 'hasDeal') {
        this.isSidebarVisible = false;
      } else {
        this.registration = Object.assign({}, object.data);
        this._regReqService.registration = object.data;
        this.isSidebarVisible = true;
        this.isClientEditing = false;

        // To get the client priority based on basis client id
        // This property will be read only
        this.getClientPriorityByBasisClientId(this._regReqService.registration.cl?.basisClientId);

        let workType = this.workTypes.find(e => e.workTypeId == this._regReqService.registration.wti);
        this._regReqService.registration.wtn = workType ? workType.workTypeName : '';

        if (this._regReqService.registration.stn && this._regReqService.registration.stn.registrationStatusId == 2) {
          //this.defaultNotesTab = "Reviewers";
          //uncomment above commented code and comment below code once reviewer tab is active
          if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.General) || (role.id == RoleType.PEGOperations) ||
            (role.id == RoleType.PEGLeadership) || (role.id == RoleType.MultibidderManager) || (role.id == RoleType.RiskManagement))) {
            this.defaultNotesTab = "RegDetails" + '#' + this._regReqService.registration.id;
          } else {
            this.defaultNotesTab = "GeneralNotes" + '#' + this._regReqService.registration.id;
          }
        }
        else {
          if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.General) || (role.id == RoleType.PEGOperations) ||
            (role.id == RoleType.PEGLeadership) || (role.id == RoleType.MultibidderManager) || (role.id == RoleType.RiskManagement))) {
            this.defaultNotesTab = "RegDetails" + '#' + this._regReqService.registration.id;
          } else {
            this.defaultNotesTab = "GeneralNotes" + '#' + this._regReqService.registration.id;
          }
        }

        this.showMultibidder = false;
        const hElement = this.elRef.nativeElement.querySelectorAll('div.clearance-status li');
        hElement.forEach(element => {
          element.classList.remove('selected');
        });
      }

      if (this.registration && this.registration.id != undefined) {
        this.appInsights.logEvent(`${CategoryType.RegistrationGrid} - sidebar open for registration id: ${this.registration.id.toString()}`);
      }
    }
    if (this.registration !== undefined) {
      if ((this.registration.stn.registrationStatusId == StatusRegistration.Conflicted || this.registration.stn.registrationStatusId == StatusRegistration.Duplicate)
        && this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager))) {
        this.isStageEditable = false;
      } else {
        this.isStageEditable = true;
      }
    }
  }

  onFirstDataRendered() {
    if (this.gridApi && this.columnDefs && this.columnDefs.length) {
      this.resetDisplayCount();

    }
  }

  onFilterChanged() {
    this.resetDisplayCount();
  }

  onRowDataChanged() {
    if (this.gridApi) {
      this.gridApi.setFilterModel(this.filterModel);
      this.gridApi.onFilterChanged();
      this.filterModel = undefined;
    }
    this.resetDisplayCount();
  }

  resetDisplayCount() {
    if (this.gridApi) {
      setTimeout(() => {
        this.displayCount = this.gridApi.getDisplayedRowCount();
      }, 1000);
     
    }

  }

  hideSidebar() {
    this.defaultNotesTab = '';
    this.isSidebarVisible = false;
    this.gridApi.refreshCells({ columns: ['tags'] });
  }

  listSelect(event) {
    event.preventDefault();
    event.stopPropagation();
    //if status is seller SB and MB can be selected and seller will be removed
    this.previousAuditLogStatus.fieldName = this.registration.imb == true ? 'MultiBidder' : this.previousAuditLogStatus.fieldName;
    this.previousAuditLogStatus.fieldName = this.registration.isb == true ? 'Singlebidder' : this.previousAuditLogStatus.fieldName;
    this.previousAuditLogStatus.fieldName = this.registration.isSeller == true ? 'Seller' : this.previousAuditLogStatus.fieldName;
    if (event.target.classList.contains('seller')) {
      if (!event.target.classList.contains('selected') && (this.registration.wti == 5 || this.registration.wti == 6)) {
        event.target.classList.add('selected');
        this.registration.isSeller = true;
        this.registration.imb = false;
        this.registration.isb = false;
      }
      return;
    }

    //if SB is selected then deselect MB
    if (event.target.classList.contains('singlebidder')) {
      if (!event.target.classList.contains('selected')) {
        this.registration.imb = false;
        this.registration.isb = true;
        this.registration.isSeller = false;
      }
    }

    //if MB is selected then deselect SB
    if (event.target.classList.contains('multibidder')) {
      if (!event.target.classList.contains('selected')) {
        this.registration.imb = true;
        this.registration.isb = false;
        this.registration.isSeller = false;
      }
    }

    if (!event.target.classList.contains('multibidder') && !event.target.classList.contains('singlebidder')) {
      const hElement = this.elRef.nativeElement.querySelectorAll('div.clearance-status li');
      hElement.forEach(element => {
        if (!element.classList.contains('multibidder') && !element.classList.contains('singlebidder') && !element.classList.contains('seller')) {
          element.classList.remove('selected');
        }
      });

      //registration status selection
      const currentlySelected = event.target.classList.contains('selected');
      if (currentlySelected) {
        event.target.classList.remove('selected');
      } else {
        event.target.classList.add('selected');
      }
    }

    this.disableClearanceStatus();
  }

  public workTypeIdentifier(workType: WorkType) {
    return workType.workTypeId;
  }

  updateRegistrations(value: any, fieldName: string, isCellEdit?: boolean) {
    let isMasked = false;

    if (this._regReqService.registration[fieldName] != value || isCellEdit) {
      let updatedValue = value;
      switch (fieldName) {
        case "tdn":
          this.updatedField = "Target";
          isMasked = this.fieldAuth.txtTarget.isMasked;
          break;
        case "cl":
          this.updatedField = "Client";
          isMasked = this.fieldAuth.txtClient.isMasked;

          updatedValue = {
            clientName: value
          }
          break;
        case "cr":
          isMasked = this.fieldAuth.txtCorpRel.isMasked;
          this.updatedField = "Target Owner";
      }
      if (isCellEdit) {
        this._regReqService.registration[fieldName] = this.retainOldValue;
      }
      this.auditLogService.addAuditLog(this.updatedField, fieldName, value);
      this._regReqService.registration[fieldName] = updatedValue;
      this.updateRegistrationData();
    }
  }

  updateRegistrationStatus() {
    this.updatedField = "Status";
    const hElement = this.elRef.nativeElement.querySelectorAll('div.clearance-status li.selected');
    let isMultibidder = false;
    let isSinglebidder = false;
    let isSeller = false;
    hElement.forEach(element => {
      if (!element.classList.contains('multibidder') && !element.classList.contains('singlebidder')
        && !element.classList.contains('seller')) {

        let newSti = element.getAttribute("statusId");
        this.auditLogService.addAuditLog(this.updatedField, null, newSti);
        this._regReqService.registration.stn.registrationStatusId = newSti;

        isSeller = element.classList.contains('selected') && element.classList.contains('seller');
        this._regReqService.registration.sd = new Date().toUTCString();
      }
      else {
        if (!(element.classList.contains('selected') && element.classList.contains(this.previousAuditLogStatus.fieldName.toLowerCase()))) {
          isMultibidder = element.classList.contains('selected') && element.classList.contains('multibidder');
          isSinglebidder = element.classList.contains('selected') && element.classList.contains('singlebidder');
          isSeller = element.classList.contains('selected') && element.classList.contains('seller');
          this.auditLogStages = [];
          this.previousAuditLogStatus.isSelectedOldValue = true;
          this.previousAuditLogStatus.isSelectedValue = false;
          this.auditLogStages.push(this.previousAuditLogStatus);
          if (this.registration.imb) {
            this.currentAuditLogStatus.isSelectedOldValue = !this.registration.imb;
            this._regReqService.registration.imb = this.registration.imb;
            this._regReqService.registration.isb = false;
            this._regReqService.registration.isSeller = false;
            this.currentAuditLogStatus.isSelectedValue = isMultibidder;
            this.currentAuditLogStatus.fieldName = 'MultiBidder';
          }
          if (this.registration.isb) {
            this.currentAuditLogStatus.isSelectedOldValue = !this.registration.isb;
            this._regReqService.registration.isb = this.registration.isb;
            this._regReqService.registration.isSeller = false;
            this._regReqService.registration.imb = false;
            this.currentAuditLogStatus.isSelectedValue = isSinglebidder;
            this.currentAuditLogStatus.fieldName = 'SingleBidder';
          }
          if (this.registration.isSeller) {
            this.currentAuditLogStatus.isSelectedOldValue = !this.registration.isSeller;
            this._regReqService.registration.isSeller = this.registration.isSeller;
            this._regReqService.registration.isb = false;
            this._regReqService.registration.imb = false;
            this.currentAuditLogStatus.isSelectedValue = isSeller;
            this.currentAuditLogStatus.fieldName = 'Seller';
          }
          this.auditLogStages.push(this.currentAuditLogStatus);

          this.auditLogStages.forEach(s => {
            this.auditLogService.addAuditLogForbidders(s.isSelectedValue, s.isSelectedOldValue, s.fieldName);
          });
        }
      }
    });
    this.updateRegistrationData();
    if ((hElement[0].getAttribute("statusId") == StatusRegistration.Conflicted || hElement[0].getAttribute("statusId") == StatusRegistration.Duplicate)
      && this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager))) {
      this.isStageEditable = false;
    } else {
      this.isStageEditable = true;
    }
  }

  updateRegistrationStage(selectedValue: number) {
    this.updatedField = 'Stage';
    this.updatedStageId = this._regReqService.registration.sgTI;
    this.auditLogService.addAuditLog(this.updatedField, null, selectedValue);
    this._regReqService.registration.sgTI = selectedValue;
    if (selectedValue == 2) {
      this._regReqService.registration.cd = new Date().toUTCString();
    } else if (selectedValue == 4) {
      this._regReqService.registration.ceD = new Date().toUTCString();
    }
    this.updateRegistrationData();

  }

  onStageClicked() {
    let stageValue: RegistrationStage = {
      stageTypeName: this.registration.sgTN,
      registrationStageId: this.registration.sgTI
    };

    let regId = this.registration.id;

    const modalRef = this.modalService.show(UpdateStageModalComponent, {
      class: "modal-dialog-centered closed-detail-popup",
      backdrop: "static", keyboard: false,
      initialState: {
        modalData: stageValue,
        registrationId: regId,
        targetData: this.registration.tdn ? this.registration.tdn : 'No target',
        hideWorkOptions: false
      }
    });

    modalRef.content.saveClosedEmitter.subscribe((res) => {
      // update stage value
      let selectedValue = res.stage.registrationStageId;
      this.updateRegistrationStage(selectedValue);

      // update closed details
      let closedDetailData: RegistrationClosedInfo = res.closedInfo;
      closedDetailData.registrationId = regId;

      this.registrationService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
        this.toastr.showSuccess("Registration updated", "Success");
      });
    });
  }

  sendUpdateDataToCortex(fieldName: string) {
    this.registrationService.sendUpdatedDataToCortex(fieldName, this._regReqService.registration.id).subscribe(registration => {

    });

  }

  sendClosedStageMail(registrationStageId: number) {
    this.registrationService.sendClosedStageMail(registrationStageId, this._regReqService.registration.id).subscribe(registration => {

    });

  }

  deleteStaffingOpportunity(registrationId: number, registrationStageId: number) {
    this.registrationService.deleteStaffingOpportunity(registrationId, registrationStageId).subscribe(registration => {

    });

  }

  updatePipelineMbActiveStatus(registrationId: number) {
    this.registrationService.updatePipelineMbActiveStatus(registrationId).subscribe(registration => {

    });

  }


  updateRegistrationData() {
    let emp: Employee = {} as Employee;
    emp.employeeCode = this.coreService.loggedInUser.employeeCode;
    this._regReqService.registration.sb = emp;
    this._regReqService.registration.lud = new Date();
    this.isRegistrationUpdating = true;

    // To retain the client priority so that no extra api call is required for that
    let clientPriorityName = this.registration?.cl?.clientPriorityName;

    this.registrationService.updateRegistration(this._regReqService.registration).subscribe(registration => {
      this.registration = registration;
      this._regReqService.registration = registration;
      this.isRegistrationUpdating = false;
      if (this.updatedField == "Stage" && (
        this.registration.sgTI == RegistrationStageEnum.ClosedLost ||
        this.registration.sgTI == RegistrationStageEnum.ClosedDropped ||
        this.registration.sgTI == RegistrationStageEnum.ClosedBainTurnedDown ||
        this.registration.sgTI == RegistrationStageEnum.Terminated
      )) {
        if (this.updatedStageId != this.registration.sgTI) {

          this.sendClosedStageMail(this.registration.sgTI);
          this.deleteStaffingOpportunity(this.registration.id, this.registration.sgTI);

        }

      }
      if (this.updatedField == "Stage") {
        this.updatePipelineMbActiveStatus(this.registration.id);
      }
      //Create backup once closed email is sent.


      this.isRegDetailsRefresh = JSON.parse(JSON.stringify({ refreshRegDetails: true }));
      if (this.updatedField == "Client") {
        this.sendUpdatedDataToStaffing(this.updatedField)
      }

      this.sendUpdateDataToCortex(this.updatedField)
      this.reInitializeUpdatedRegistration(registration, false, false);

      // To set the client priority as getregistratioById didn't get the priority name in real time
      this.registration.cl.clientPriorityName = clientPriorityName
    },
      () => {
        this.toastr.showError('Error while updating registrations. Please try again.', 'Error');
      }
    );
  }
  sendUpdatedDataToStaffing(fieldName: string) {
    this.registrationService.sendUpdatedDataToStaffing(fieldName, this._regReqService.registration.id).subscribe(registration => {

    });

  }
  reInitializeUpdatedRegistration(reg: Registrations, isRegDetails: boolean, suppressSuccessMessage: boolean) {
    let currentDate = new Date();
    let statusUpdateDate = Number(new Date(reg.sd));
    let EighteenMonthWindow = Number(new Date(currentDate.getFullYear() - 1, currentDate.getMonth() - 6, currentDate.getDay()));
    if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport))) {
      if (reg.sgTI == 3 || reg.sgTI == 6 || reg.sgTI == 7 || reg.sgTI == 8 || reg.sti == 7 || (reg.stn && reg.stn.registrationStatusId == 7)) {
        this.SetUpdatedRegistration(reg, this.registrationType.Archived_Registrations);
      }
      else {
        if (statusUpdateDate == 0) {
          this.SetUpdatedRegistration(reg, this.registrationType.Registration);
        }
        else if (statusUpdateDate >= EighteenMonthWindow) {
          this.SetUpdatedRegistration(reg, this.registrationType.Registration);
        }
        else {
          this.SetUpdatedRegistration(reg, this.registrationType.Archived_Registrations);
        }

      }
    } else {
      this.updateRegistrationNode(reg);
    }

    if (isRegDetails == false && suppressSuccessMessage == false) {
      this.auditLogService.saveAuditLog();
      this.toastr.showSuccess(this.updatedField + ' has been updated successfully', 'Success');
    }

    let currentModel = this.gridApi.getFilterModel();
    this.gridApi.setFilterModel(currentModel);
  }

  SetUpdatedRegistration(registration: Registrations, registrationType: RegistrationType) {
    if (this.registrationStatusOptions.some(x=>x.isSelected==true && x.value == registrationType)) {
      this.updateRegistrationNode(registration);
    }
    else {
      this.rowData = this.rowData.filter(e => e.nid != registration.nid);
      this.gridApi.setRowData(this.rowData);
    }
  }

  updateRegistrationNode(registration: Registrations) {
   
    var rowNode = this.gridApi.getRowNode(registration.nid.toString());
    if (rowNode) {
      rowNode.setData(registration);
      var params = { force: true, rowNode: rowNode };
      this.gridApi.refreshCells(params);
    }
    else {

      this.gridApi.applyTransaction({ add: [registration] });

    }

    this.gridApi.refreshClientSideRowModel();
    let updatedRowIndex = this.rowData.findIndex(i => i.nid == registration.nid);
    this.rowData[updatedRowIndex] = registration;
    this.resetDisplayCount();
   
  }

  OpenMarketPurchaseChange(newValue) {
    this.updatedField = "Open Market Purchase";
    this.auditLogService.addAuditLog(this.updatedField, null, newValue);
    this._regReqService.registration.iomp = newValue;
    this.updateRegistrationData();

  }

  canFillOpenMarketPurchase() {
    let enabled = ((this._regReqService.registration.ptd || this._regReqService.registration.pte) && (this.registration.wti == 2 || this.registration.wti == 3));

    if (!enabled) {
      this.registration.iomp = false;
      this._regReqService.registration.iomp = false;
    }
    return enabled;
  }

  OnWorkTypeChanged(selectedValue) {
    this.updatedField = "Type of Work";
    this.auditLogService.addAuditLog(this.updatedField, null, selectedValue);
    this._regReqService.registration.wti = selectedValue;
    if (selectedValue != 2 && selectedValue != 3) {
      this.registration.ptd = false;
      this.registration.iomp = false;
      this._regReqService.registration.ptd = false;
      this._regReqService.registration.iomp = false;
    }
    let workType = this.workTypes.find(e => e.workTypeId == selectedValue);
    this._regReqService.registration.wtn = workType ? workType.workTypeName : '';
    if ((selectedValue == '5' || selectedValue == '6') && (!this._regReqService.registration.imb)) {
      this.registration.isSeller = true;
      this._regReqService.registration.isSeller = true;
      this.registration.isb = false;
      this._regReqService.registration.isb = false;
    } else {
      this.registration.isSeller = false;
      this._regReqService.registration.isSeller = false;

      if (!this._regReqService.registration.imb) {
        this.registration.isb = true;
        this._regReqService.registration.isb = true;
      }
    }
    this.updateRegistrationData();
  }

  setRegistrationStatus() {

    this.resetRegistrationStatus();

    const hElementSelected = this.elRef.nativeElement.querySelectorAll('div.clearance-status li.selected');
    if (hElementSelected != undefined && hElementSelected != null) {
      const hElement = this.elRef.nativeElement.querySelectorAll('div.clearance-status li');
      hElement.forEach(element => {
        if (element.getAttribute("statusId") == this.registration.stn.registrationStatusId) {
          element.classList.add('selected');
        }

        if (this.registration.imb) {
          if (!element.classList.contains('selected') && element.classList.contains('multibidder')) {
            element.classList.add('selected');
          }
        }

        // Set single bidder and seller
        if (this.registration.isb) {
          if (!element.classList.contains('selected') && element.classList.contains('singlebidder'))
            element.classList.add('selected');
        }
        if (this.registration.isSeller) {
          if (!element.classList.contains('selected') && element.classList.contains('seller'))
            element.classList.add('selected');
        }

      });
      this.disableClearanceStatus();

    }
  }

  resetRegistrationStatus() {
    this.registration.isSeller = this._regReqService.registration.isSeller;
    this.registration.isb = this._regReqService.registration.isb;
    this.registration.imb = this._regReqService.registration.imb;

    const hElementSelected = this.elRef.nativeElement.querySelectorAll('div.clearance-status li.selected');
    if (hElementSelected.length > 0) {
      const hElement = this.elRef.nativeElement.querySelectorAll('div.clearance-status li');
      hElement.forEach(element => {
        if (element.getAttribute("statusId") == this.registration.stn.registrationStatusId) {
          element.classList.add('selected');
          if (element.classList.contains("show-multibidder")) {
            this.showMultibidder = true;
          }
        } else {
          // if(!element.classList.contains('multibidder'))
          element.classList.remove('selected');
        }

        if (this.registration.imb) {
          this.showMultibidder = true;
          if (!element.classList.contains('selected') && element.classList.contains('multibidder'))
            element.classList.add('selected');
        } else {
          this.showMultibidder = false;
        }
        if (element.classList.contains("show-multibidder")) {
          this.showMultibidder = true;
        }
      });
    }
  }

  disableClearanceStatus() {
    let hElementSelected = this.elRef.nativeElement.querySelectorAll('div.clearance-status li.selected');
    let temphElementSelected = [];
    hElementSelected.forEach(el => {
      if (!el.classList.contains('multibidder') && !el.classList.contains('singlebidder') && !el.classList.contains('seller')) {
        temphElementSelected.push(el)
      }
    });

    hElementSelected = temphElementSelected;
    if (hElementSelected.length > 0) {


      hElementSelected.forEach(element => {
        if (element.getAttribute("statusId") == null) {
          this.disableClrStatus = true;
        }
        if ((element.getAttribute("statusId") == "1" || element.getAttribute("statusId") == "2" ||
          element.getAttribute("statusId") == "3" || element.getAttribute("statusId") == "4" ||
          element.getAttribute("statusId") == "7" || element.getAttribute("statusId") == "8")) {
          this.disableClrStatus = false;
          return undefined;
        } else {
          this.disableClrStatus = true;
        }

      });
    } else {
      this.disableClrStatus = true;

    }
  }
  setRegistrationTypeLabel(event) {
    if (event != null) {


      const index = this.registrationStatusOptions.findIndex(item => item.value === event.value);
      if (index !== -1) {
        this.registrationStatusOptions[index].isSelected = !this.registrationStatusOptions[index].isSelected;
      }
    }
    this.registrationTypeLabel = this.registrationStatusOptions.filter(item => item.isSelected).map(item => item.label).toString();
  }
  public registrationTypeChange(item) {

    if (item.isSelected) {
      let items = [];
      if (this.gridApi)
        this.gridApi.forEachNode((node) => { items.push(node.data) });
      let rowData = items.filter(e => e.rt.toString() != item.value);
      this.rowData = rowData;
      this.toastr.showSuccess(RegistrationType[item.value] + ' removed successfully', 'Success');
    } else {
      this.isLoading = true;
      switch (item.value) {
        case RegistrationType.Registration:
          this.getRegistrationAndAddToGrid();
          break;
        case RegistrationType.Archived_Registrations:
          this.getArchivedRegistrationAndAddToGrid();
          break;
      }
    }
    this.setRegistrationTypeLabel(item);
  }

  getRegistrationAndAddToGrid() {
    this.gridApi.showLoadingOverlay()
    this.registrationService.getRegistrationData().subscribe((data: Registrations[]) => {

      // transform data
      this.rowData.push(...data);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;
      this.toastr.showSuccess('Registrations loaded successfully', 'Success');
      this.isLoading = false;
      this.gridApi.hideOverlay()
    },
      () => {
        this.toastr.showError('Error while loading registrations. Please try again.', 'Error');
        this.gridApi.hideOverlay()

      }
    );
  }

  getArchivedRegistrationAndAddToGrid() {
    this.gridApi.showLoadingOverlay()

    this.registrationService.getArchivedRegistrations().subscribe((data: Registrations[]) => {

      // transform data
      this.rowData.push(...data);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;
      this.toastr.showSuccess('Archived Registrations loaded successfully', 'Success');
      this.isLoading = false;
      this.gridApi.hideOverlay();
    },
      () => {
        this.toastr.showError('Error while archived registrations. Please try again.', 'Error');
        this.isLoading = false;
        this.gridApi.hideOverlay();

      }
    );
  }

  updatedValue(notes) {
    var rowNode = this.gridApi.getRowNode(this._regReqService.registration.nid.toString());
    this.registration.ln = notes;
    rowNode.setData(this.registration);
    var params = {
      force: true,
      rowNodes: [rowNode]
    };
    this.gridApi.refreshCells(params);
  }

  updateRegistrationDetails(registration: any) {
    this._regReqService.registration = registration;
    this.registration = registration;
    this.reInitializeUpdatedRegistration(this._regReqService.registration, true, false);

    // Stage automation, update the stage on UI
    this.registration.sgTI = registration.sgTI;
    this.registration.sgTN = registration.sgTN;
  }

  getUserAuthorization(): any {
    this.registrationService.getUserAuthorization().subscribe(userRoleField => {
      this.registrationService.roleFieldValues = userRoleField;
      this.setFieldAuthorization();
    });
  }

  setFieldAuthorization() {
    let allRoleFields = this.registrationService.roleFieldValues;
    for (let key in this.fieldAuth) {
      for (let i = 0; i < allRoleFields.length; i++) {
        if (key == allRoleFields[i]['field']['fieldName']) {
          this.fieldAuth[key]['isEditable'] = allRoleFields[i]['isEditable'];
          this.fieldAuth[key]['isVisible'] = allRoleFields[i]['isVisible'];
          this.fieldAuth[key]['isMasked'] = allRoleFields[i]['isMasked'];
          break;
        }
      }
    }
  }

  onSortChanged(object) {
    let sortedColumn = object?.columnApi?.columnController?.gridColumns?.filter(a => a.sort != undefined);
    if (sortedColumn?.length > 0) {
      sortedColumn = sortedColumn[0].userProvidedColDef.headerName;
        this.appInsights.logEvent(`${CategoryType.RegistrationGrid} - sorting -${sortedColumn}`);
    }

  }

  onColumnMoved(object) {
    if (object.column.userProvidedColDef.headerName != null && object.column.userProvidedColDef.headerName != undefined) {
      this.appInsights.logEvent(`${CategoryType.RegistrationGrid}- column_dragged - ${object.column.userProvidedColDef.headerName.toString()}`);
    }
    this.mapColumnAttributes(object.columnApi.columnModel.gridColumns, object.columnApi.columnModel.displayedColumns)

  }


  newOpportunity() {
    this.appInsights.logEvent(`${CategoryType.NewOpportunity} - new opportunity button - create new opportunity`);
  }
  processDeal(regObject: Registrations) {
    let deal = new deals();
    let dealRegistrations = new DealRegistrations();
    let registration = new Registrations();

    this._regReqService.registration = regObject;

    registration.id = regObject.id;
    registration.isImpersonated = this.coreService.isImpersonated;
    registration.hasDeal = false;

    dealRegistrations.registration = registration;
    deal.dealRegistrations = new Array<DealRegistrations>();

    deal.targetId = regObject.ti;
    deal.targetName = regObject.tdn;

    deal.industries = []
    deal.submittedBy = CommonMethods.getLoggedInEmployee(this.coreService.loggedInUser);
    deal.dealRegistrations.push(dealRegistrations);

    this._dealService.convertToDeal(deal).subscribe(res => {
      var rowNode = this.gridApi.getRowNode(this._regReqService.registration.nid.toString());
      this.registration.hasDeal = true;
      rowNode.setData(this.registration);
      var params = {
        force: true,
        rowNodes: [rowNode]
      };
      this.gridApi.refreshCells(params);
      this.toastr.showSuccess("The deal has been created successfully.", 'Success');
    });
  }

  resendEmail() {
    this._regReqService.registration.ier = true;
    this.auditLogService.addAuditLog('Email', null, this.coreService.loggedInUser.firstName);
    this.auditLogService.saveAuditLog();
    this.registrationService.resendEmail(this._regReqService.registration.id).subscribe(updatedRes => {
      this._regReqService.registration.ec = updatedRes.ec;
      this._regReqService.registration.ie = updatedRes.ie;
      this._regReqService.registration.ier = false;
    })
  }

  processBulkUpdate(stage) {
    let nodes = this.gridApi.getSelectedNodes();
    this.bulkRgistrations.RegistrationId = [];
    this.bulkRgistrations.SubmittedBy = this.coreService.loggedInUser.employeeCode;
    this.bulkRgistrations.Fields = [];

    nodes.forEach(node => {
      this.bulkRgistrations.RegistrationId.push(node.data.id);
      let field = new RegistrationFields();
      field.FieldName = "registrationStageId";
      field.FieldType = "dropdown";
      field.NewValue = this.registrationStage.find(x => x.registrationStageId == stage).registrationStageId.toString()
      field.AuditOldValue = node.data.sgTN;
      field.AuditNewValue = this.registrationStage.find(x => x.registrationStageId == stage).stageTypeName;
      field.AuditRegistrationid = node.data.id;
      this.bulkRgistrations.Fields.push(field);
    })
    //registrations.RegistrationId
    this.registrationService.bulkUpdate(this.bulkRgistrations)
      .subscribe((res) => {
        this.refreshGrid();
        this.toastr.showSuccess("Stage has been updated successfully", 'Success');
        this.gridApi.deselectAll();

      });
  }

  onCellEditingStopped(object) {
    if (object.newValue && object.oldValue != object.data[object.colDef.field] && object.newValue.trim() != '') {
      this.updateRegistrations(object.newValue, object.colDef.field, true);
    } else {
      this._regReqService.registration[object.colDef.field] = this.getOldValueForGrid(object.colDef.field);
      var rowNode = this.gridApi.getRowNode(this._regReqService.registration.nid.toString());
      if (rowNode) {
        rowNode.setData(this._regReqService.registration);
        var params = { force: true, rowNode: rowNode };
        this.gridApi.refreshCells(params);
      }
    }
  }

  onCellEditingStarted(object) {
    this.retainOldValue = object.value;
    this._regReqService.registration = object.data;
  }

  checkForEditable(object): boolean {
    // To check whether user has clicked on deal column or not
    // In case of deal column clicked, sidebar didn't need to be opened
    if (object.column?.colDef?.field == "hasDeal") {
      return true;
    }

    if (object.data.rt == 1) {
      let currentColumn = this.allColumns.filter(a => a.headerName == object.column.colDef.headerName);
      if (currentColumn != null && currentColumn != undefined && currentColumn.length > 0) {
        return currentColumn[0].isEditable;
      }
    }
    return false;
  }

  updatedRegistrations(value) {
    value.registrations.forEach(currReg => {
      let rowNode = this.gridApi.getRowNode(currReg.id);
      if (rowNode) {
        rowNode.data.dealId = value.dealId;
        rowNode.data.hasDeal = true;
        let params = { force: true, rowNode: rowNode };

        this.gridApi.refreshCells(params);
      }
    });
    this.resetDisplayCount();
    this.gridApi.deselectAll();
    this.toastr.showSuccess("Registration(s) added successfully", "Success");
  }

  resetSelection(value) {
    this.gridApi.deselectAll();
  }

  refreshRegistrationsAfterCopy(event) {
    let nodes = this.gridApi.getSelectedNodes();
    nodes.forEach(selectedRegistrations => {
      this.refreshGridAfterCopy(selectedRegistrations.data.nid, event);
    });
    this.gridApi.deselectAll();
    this.toastr.showSuccess('New Deal Submitted Successfully.', "Confirmation");
  }

  refreshGridAfterCopy(registrationId, deal) {
    var rowNode = this.gridApi.getRowNode(registrationId);
    let updatedRegistration = this.rowData.filter(a => a.nid == registrationId);
    updatedRegistration[0].hasDeal = true;
    updatedRegistration[0].dealId = deal.dealId;
    rowNode.setData(updatedRegistration[0]);
    var params = {
      force: true,
      rowNodes: [rowNode]
    };
    this.gridApi.refreshCells(params);
  }

  refreshGrid() {
    this.isClicked = true;
    this.gridApi.showLoadingOverlay();
    // Gets filter model via the grid API
    this.filterModel = this.gridApi.getFilterModel();
    this.activeRoute.params.subscribe(data => {
      if (data != undefined && data.hasOwnProperty('id')) {
        let searchableRegId = data.id;
        this.registrationService.getFilteredRegistration(searchableRegId).subscribe(resp => {
          this.rowData = resp;
          this.hasQueryParam = true;
          this.isLoading = false;
        })
      } else {
        this.getAllGridData();
        this.hasQueryParam = false;

      }
    });

  }



  getOldValueForGrid(fieldName) {
    if (fieldName == 'cl') {
      return {
        clientName: this.retainOldValue
      }
    } else {
      return this.retainOldValue;
    }
  }

  resetFilter() {
    this.route.navigate(["registrations"]);
  }

  getClientPriorityByBasisClientId(basisClientId) {
    if (basisClientId) {
      this.registrationService.getClientPriorityByClientId(basisClientId).subscribe(data => {
        if (data?.priorityName) {
          this.registration.cl.clientPriorityName = '(' + data?.priorityName + ')';
        }
      })
    }
  }



  displaySideBar(registrtion) {
    if (registrtion) {

    }
  }





}
