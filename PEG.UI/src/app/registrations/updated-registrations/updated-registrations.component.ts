import { Component, ElementRef, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { RegistrationService } from '../registrations/registration.service';
import { AuditLogModel, Registrations } from '../registrations/registrations';
import { TextFilterComponent } from '../../shared/customFilters/text-filter/text-filter.component';
import { CustomHeaderComponent } from '../../shared/customFilters/custom-header/custom-header.component';
import { TagsRendererComponent } from '../../shared/tags/tags-renderer/tags-renderer.component';
import { WorkType } from '../new-registration/workType';
import { forkJoin, Observable, Subject } from 'rxjs';
import { RegistrationStatus } from '../../shared/interfaces/registrationStatus';
import { RegistrationRequestService } from '../registrations/registration-request-service';
import { RegistrationStage } from '../../shared/interfaces/RegistrationStage';
import { RegistrationType } from '../../shared/enums/registration-type.enum';
import { Prohibition } from '../prohibitions/prohibition';
import { GridApi, ColDef, GridOptions, GridReadyEvent, IServerSideDatasource, ServerSideStoreType, ProcessCellForExportParams, ExcelExportParams } from 'ag-grid-community';
import { DateFilterComponent } from '../../shared/customFilters/date-filter/date-filter.component'
import { Investment } from '../registrations/investment';
import { TagsFilterComponent } from '../../shared/customFilters/tags-filter/tags-filter.component';
import { Employee, GridColumn } from '../../shared/interfaces/models';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../core/core.service';
import { RoleType } from '../../shared/enums/role-type.enum';
import { IconsRendererComponent } from '../../shared/icons-renderer/icons-renderer.component';
import { fieldAuth } from '../../shared/common/fieldAuth';
import { BulkRegistrations, RegistrationFields } from '../registrations/BulkRegistrations';
import { GlobalService } from '../../global/global.service';
import { Client } from '../../shared/interfaces/client';
import { ClientEditorComponent } from '../../shared/grid-editor/client-editor/client-editor.component';
import { MaskRendererComponent } from '../../shared/grid-renderer/mask-renderer/mask-renderer.component';
import 'ag-grid-enterprise';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { PegTostrService } from '../../core/peg-tostr.service';
import { AuditLogService } from '../../shared/AuditLog/auditLog.service';
import { DealsService } from '../../deals/deals.service';
import { Partnership } from '../registrations/partnership';
import { CategoryType } from '../../shared/enums/ga-category.enum';
import { GridValues } from '../../shared/grid-generator/grid-constants';
import { formatDate } from '@angular/common';
import { RegistrationStatus as StatusRegistration } from '../../shared/enums/registration-status.enum';
import { DealRegistrations } from '../../deals/dealRegistrations';
import { deals, visibleToHighlights } from '../../deals/deal';
import { CommonMethods } from '../../shared/common/common-methods';
import { RegistrationParams } from '../registratonParams';
import * as moment from 'moment';
import { UserColumn } from '../../pipeline/userColumn';
import { PagesTypes } from '../../shared/enums/page-type.enum';
import { PipelineService } from '../../pipeline/pipeline.service';
import { RegistrationGridService } from '../registrations/registration-grid.service';
import { AppInsightWrapper } from '../../applicationInsight/appInsightWrapper';

@Component({
  selector: 'app-updated-registrations',
  templateUrl: './updated-registrations.component.html',
  styleUrls: ['./updated-registrations.component.scss']
})
export class UpdatedRegistrationsComponent implements OnInit {

  public fieldAuth: fieldAuth = new fieldAuth();
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
  type: string;
  auditLogStages: AuditLogModel[] = [];
  currentAuditLogStatus: AuditLogModel = new AuditLogModel();
  previousAuditLogStatus: AuditLogModel = new AuditLogModel();
  gridOptions: GridOptions;
  filterModel: any;
  rowModelType: string;
  components;
  dataSource;
  serverSideDatasource: any;
  defaultColumns: GridColumn[] = []

  public workTypes: WorkType[] = [];
  public region: any = []
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
  private filterQueryChanged: Subject<string> = new Subject<string>();
  public isAllSearch = false;
  public enableExcelDownload = false;
  public registration: Registrations;
  public prohibition: Prohibition = new Prohibition();
  public investment: Investment;
  public registrationTypeFilter: number[] = [RegistrationType.Registration, RegistrationType.Investments, RegistrationType.Prohibitions, RegistrationType.Partnership];
  public registrationType = RegistrationType;
  public updatedStageId: number;
  public isMultipleClient: false;
  public isMultibidderUserorAdmin
  public isLegalUserorAdmin
  public isClicked: boolean = false
  public isRegistrationUpdating = false
  public clientTypeAhead = new Subject<string>();
  public filterData: any = [];
  public isStageEditable: boolean = false;
  public serverSideStoreType: ServerSideStoreType = 'partial';
  public defaultColDef: ColDef = {
    sortable: true,
  };

  searchTypeAhead = new Subject<string>();
  searchData: any;
  selectedSearch: any;

  public filterValue = '';
  public searchLoad = false;
  public searchText = '';

  params: any;
  dateRange: any;
  myDateValue: any[] = [];
  gridParams: GridReadyEvent;
  isRegDetailsRefresh:any;

  constructor(private registrationService: RegistrationService, private gridService: RegistrationGridService, private pipelineService: PipelineService,
    private elRef: ElementRef, private toastr: PegTostrService, public _regReqService: RegistrationRequestService,
    private auditLogService: AuditLogService, private router: Router, private coreService: CoreService,
    @Inject(LOCALE_ID) private locale: string, private appInsights: AppInsightWrapper, private _dealService: DealsService,
    private globalService: GlobalService, private activeRoute: ActivatedRoute, private route: Router) {


    // To search the data by using global search
    this.searchTypeAhead.pipe(
      tap(() => { this.searchLoad = true; }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (term) {
          this.searchData = [];
          let registrationParams = new RegistrationParams();
          registrationParams.startRow = 0;
          registrationParams.endRow = 100;
          registrationParams.searchTerm = term;
          registrationParams.dealRegionId = '1,2,3,4';
          this.selectedSearch = term;
          return this.registrationService.getRegistrationDataUpdated(registrationParams)
        } else {
          this.searchLoad = false;
          this.searchData = [];
          return new Observable<any>();
        }
      }
      ),
      tap(() => this.searchLoad = false)
    ).subscribe(items => {
      if (items && items.length > 0) {
        this.searchData = items;
        this.setGridDataAndUpdateCount(items);
      }
    });

    this.registration = this._regReqService.registration;
    this.prohibition = this._regReqService.prohibition;
    this.investment = this._regReqService.investment;

    this.isMultibidderUserorAdmin = this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport));
    this.isLegalUserorAdmin = this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport || role.id==RoleType.MultibidderManager));
    this.isAllSearch =
      (this.router.url.includes('registrations'))
      && this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport));

    this.enableExcelDownload = this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.MultibidderManager || role.id == RoleType.PEGOperations || role.id == RoleType.TSGSupport || role.id == RoleType.RiskManagement));

    // Setting grid Options
    this.gridOptions = {
      frameworkComponents: {
        textFilterComponent: TextFilterComponent,
        tagsRendererComponent: TagsRendererComponent,
        agDateInput: DateFilterComponent,
        tagsFilterComponent: TagsFilterComponent,
        iconsRendererComponent: IconsRendererComponent,
        agClientEditor: ClientEditorComponent,
        maskRendererComponent: MaskRendererComponent
      },
      getRowNodeId: (data: Registrations) => data.id.toString(),
      sortingOrder: ['desc', 'asc'],
      defaultColDef: this.gridService.getDefaultColumnDefinition,
      unSortIcon: false,
      suppressMenuHide: true,
      suppressRowClickSelection: true,
      rowHeight: 33,
      headerHeight: 33,
      pagination: false,
      suppressColumnVirtualisation: true,
      accentedSort: true,
      context: {
        componentParent: this
      },
      suppressCsvExport: true,
      suppressContextMenu: true,
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
          }
        ]
      }
    };
    this.rowModelType = 'serverSide';
  }

  // Set Registration filter for users
  SetRegistrationFilter() {
    const currUserRole = this.coreService.loggedInUserRoleId;
    if (currUserRole == RoleType.Legal || currUserRole == RoleType.PEGAdministrator || currUserRole == RoleType.TSGSupport) {
      return [RegistrationType.Registration, RegistrationType.Prohibitions, RegistrationType.Investments, RegistrationType.Partnership];
    } else {
      return [RegistrationType.Registration];
    }
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
    this.registrationTypeFilter = this.SetRegistrationFilter();
    this.SetQuickFilterPlaceHolder();
    this.getColumnData();
    this.getRegistrationStatusData();
    this.getRegistrationStageData();
    this.getWorkTypeData();
    this.getRegionData();
    //this.filterQueryChangedSetQuickFilter();
    this.getUserAuthorization();
    this.activeRoute.params.subscribe(data => {
      if (data != undefined && data.hasOwnProperty('id')) {
        let searchableRegId = data.id;
        this.registrationService.getFilteredRegistration(searchableRegId).subscribe(resp => {
          this.rowData = resp;
          this.hasQueryParam = true;
          this.isLoading = false;
        })
      } else {
        // this.getAllGridData();
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

  getRegionData() {
    this.globalService.getRegions()
      .subscribe(regionData => {
        this.region = regionData;
      });
  }

  onRowSelectionChanged(event) {
    let nodes = this.gridApi.getSelectedNodes();

    let isMaskedCount = nodes.filter(e => { return e.data.isMasked })
    let notMaskedCount = nodes.filter(e => { return e.data.isMasked == false })
    if (isMaskedCount.length > 1) {
      this.toastr.showWarning("You cannot add multiple registrations with masked registration.", "Message")
      this.gridApi.deselectNode(event.api.selectionController.lastSelectedNode);
      return;
    }
    if (notMaskedCount.length > 0 && isMaskedCount.length > 0) {
      this.toastr.showWarning("You cannot add multiple registrations with masked registration.", "Message")
      this.gridApi.deselectNode(event.api.selectionController.lastSelectedNode);
      return;
    }
    if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager) || (role.id == RoleType.PEGAdministrator) || (role.id == RoleType.PEGOperations) || (role.id == RoleType.TSGSupport))) {
      nodes.forEach(element => {
        if (element.data.hasDeal) {
          this.toastr.showWarning("This registration is already linked to an expert tracker.", "Message")
          this.gridApi.deselectNode(element);
          return;
        }
      });
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
            this.gridApi.deselectNode(event.api.selectionController.lastSelectedNode);
            return;
          }
          else {
            if (nodes.length > 10) {
              this.toastr.showWarning("Please select an action for these 10 records, Then continue to select additional records.", "Message")
              this.gridApi.deselectNode(event.api.selectionController.lastSelectedNode);
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
        this.gridApi.deselectNode(event.api.selectionController.lastSelectedNode);
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
    this.gridApi.setFilterModel({ "-": { "filter": this.filterValue } });
    this.gridApi.onFilterChanged();
  }

  onClearAllFilters() {
    this.filterValue = null;
    this.onFilterTextBoxChanged();
    this.setGridDataSourceWithoutData(this.gridParams);
    this.gridApi.setFilterModel(null);
    this.gridApi.onFilterChanged();
    this.myDateValue = [];
  }

  getColumnData() {
    this.isLoadingColumns = true;

    this.pipelineService.getUserColumns(PagesTypes.Registration).subscribe((columns: GridColumn[]) => {
      if (columns && columns.length) {
        this.columnDefs = this.gridService.getColumnDefinitions(columns);
        this.isLoadingColumns = false;
        this.defaultColumns = columns;

        this.allColumns = columns;
        this.SetQuickFilterPlaceHolder();
        this.hideUnusedFilters();
      }
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
      columnKeys: columns,

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
    return this.registrationTypeFilter.some(rl => rl == value);
  }


  transformInvestments(investments: Investment[]) {
    let mappedInvestment: Registrations[] = investments.map(invest =>
      <Registrations>{
        tdn: invest.tdn, // targetDisplayName
        ptedn: '', // publiclyTradedEquityDisplayname
        l: '', // location
        cl: {}, // client
        hfcdn: '', // hedgeFundClientDisplayname
        wtn: '', // workTypeName
        pn: '', // projectName
        boc: 111, // bainOffice
        lsd: invest.lsd, // lastSubmittedDate
        ic: '', // intrestOrCommitment
        sgTN: '', // stageTypeName
        stn: '', // statusTypeName
        cd: null, // commitDate
        sd: invest.ud, // statusDate
        ceD: null, // completedDate
        hfc: false, // hedgeFundClient 
        cr: null, // Target Owner/Parent Company
        imb: null, // isMultibidder
        id: 100000 + invest.id, // registrationId (temp solution to keep it working)
        sgTI: 0, // stageTypeId
        sti: 0, // statusTypeId
        ti: invest.id, // targetId
        wti: 2, //  workTypeId
        ln: '', // Legal Notes
        rt: invest.rt,
        iac: false, // IsActive
        sb: '', // Submitted By
        sbn: '',
        lud: null,
        nid: invest.nid,
        hasDeal: false
      }
    );

    return mappedInvestment;
  }
  tranformProhibitionsIntoRegistrations(data: Prohibition[]) {
    let mappedProhibitions: Registrations[] = data.map(note =>
      <Registrations>{
        tdn: note.tdn, // targetDisplayName
        ptedn: '', // publiclyTradedEquityDisplayname
        l: '', // location
        cl: {}, // client
        hfcdn: '', // hedgeFundClientDisplayname
        wtn: '', // workTypeName
        pn: '', // projectName
        boc: 111, // bainOffice
        lsd: note.lsd, // lastSubmittedDate
        ic: '', // intrestOrCommitment
        sgTN: (!note.iac) ? 'Terminated' : '', // stageTypeName
        stn: '', // statusTypeName
        cd: null, // commitDate
        sd: null, // statusDate
        ceD: null, // completedDate
        hfc: false, // hedgeFundClient 
        cr: null, // Target Owner/Parent Company
        imb: null, // isMultibidder
        id: note.id, // registrationId
        sgTI: 0, // stageTypeId
        sti: 0, // statusTypeId
        ti: note.ti, // targetId
        wti: 2, //  workTypeId
        ln: note.ln, // Legal Notes
        rt: note.rt,
        iac: note.iac, // IsActive
        sb: note.sb, // Submitted By
        sbn: note.sbn,
        lud: null,
        nid: note.nid,
        hasDeal: false
      }
    );

    return mappedProhibitions;
  }

  transformPartnership(partnership: Partnership[]) {
    let mappedPartnership: Registrations[] = partnership.map(partnership =>
      <Registrations>{
        tdn: partnership.company, // targetDisplayName
        ptedn: '', // publiclyTradedEquityDisplayname
        l: '', // location
        cl: {}, // client
        hfcdn: '', // hedgeFundClientDisplayname
        wtn: '', // workTypeName
        pn: '', // projectName
        boc: 111, // bainOffice
        lsd: partnership.submissionDate, // lastSubmittedDate
        ic: '', // intrestOrCommitment
        sgTN: '', // stageTypeName
        stn: '', // statusTypeName
        cd: null, // commitDate
        sd: null, // statusDate
        ceD: null, // completedDate
        hfc: false, // hedgeFundClient 
        cr: null, // Target Owner/Parent Company
        imb: null, // isMultibidder
        id: 100000 + partnership.partnershipId, // registrationId (temp solution to keep it working)
        sgTI: 0, // stageTypeId
        sti: 0, // statusTypeId
        ti: null, // targetId
        wti: 2, //  workTypeId
        ln: '', // Legal Notes
        rt: RegistrationType.Partnership,
        iac: false, // IsActive
        sb: '', // Submitted By
        sbn: '',
        lud: null,
        nid: partnership.partnershipId ? partnership.partnershipId.toString() : 0,
        hasDeal: false
      }
    );

    return mappedPartnership;
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridParams = params;
    this.setGridDataSourceWithoutData(params);
  }

  setGridDataSourceWithoutData(params) {
    var datasource = this.createServerSideDatasource();
    params.api!.setServerSideDatasource(datasource);
  }

  // This will reset the grid with the SSRM data source using an API call 
  createServerSideDatasource(startRow = null, endRow = null, searchText = ''): IServerSideDatasource {
    return {
      getRows: (params) => {
        let registrationParams = new RegistrationParams();
        registrationParams.startRow = startRow ?? params.request.startRow;
        registrationParams.endRow = startRow ?? endRow ?? params.request.endRow;
        registrationParams.searchTerm = searchText ?? '';
        registrationParams.dealRegionId = '1,2,3,4';

        // Set the registration params based on grid column filters
        // This will fetch the data based on deal region
        if (params.request.filterModel) {


          Object.keys(params.request.filterModel).forEach(key => {
            if (params.request.filterModel.hasOwnProperty(key)) {
              let currentColDef = params.columnApi['columnModel'].columnDefs.find(x => x.colId == key)

              // Check columns
              if (currentColDef.field == 'drn' && params.request.filterModel[key]) {
                if (params.request.filterModel[key]?.values.length > 0) {
                  let regionId = params.request.filterModel[key].values;
                  regionId = this.region.filter(d => regionId.includes(d.regionName));
                  regionId = regionId.map(d => d.regionId);
                  registrationParams.dealRegionId = regionId.join(',');

                } else {
                  registrationParams.dealRegionId = '';
                }

              } else if (currentColDef.field == 'cl' && params.request.filterModel[key]) {
                registrationParams.clientName = params.request.filterModel[key].value;
              }
            }
          });
          // registrationParams.endRow = 100;
          if (this.gridApi) {
            this.gridApi.showLoadingOverlay();
          }

        }

        this.registrationService.getRegistrationDataUpdated(registrationParams).subscribe(data => {
          const rowsThisPage = data;
          let lastRow = 0;
          // if (rowsThisPage.length < 100) {
          //   params.success({ rowData: rowsThisPage ,rowCount:rowsThisPage.length});
          // }else {
          this.rowData = data;
          params.success({ rowData: rowsThisPage });

          // }
          if (this.gridApi) {
            this.gridApi.hideOverlay();
            this.displayCount = this.gridApi.getDisplayedRowCount()

          }
        })
      },
    };
  }

  // This will reset the grid with the SSRM data source with the data provided 
  createServerSideDatasourceWithData(data: any): IServerSideDatasource {
    return {
      getRows: (params) => {
        const rowsThisPage = data;
        this.rowData = data;
        let lastRow = -1;
        if (data.length <= params.request.endRow) {
          lastRow = data.length + params.request.endRow;
        }
        lastRow = data.length;
        this.displayCount = data.length;
        params.success({ rowData: rowsThisPage, rowCount: lastRow });
      },
    };
  }

  //Case date filter
  onDateChanged(dateRange) {
    if (dateRange && dateRange.length > 1) {
      let registrationParams = new RegistrationParams();
      registrationParams.startRow = 1;
      registrationParams.endRow = 100;
      registrationParams.searchTerm = '';
      registrationParams.caseStartDate = moment(dateRange[0]).format('YYYY-MM-DD');
      registrationParams.caseEndDate = moment(dateRange[1]).format('YYYY-MM-DD');
      this.registrationService.getRegistrationDataUpdated(registrationParams).subscribe(data => {
        this.setGridDataAndUpdateCount(data);
      })
    }
  }

  changeCalendarPosition() {

  }

  onIndustryChange(industry) {

  }

  // Create the data source and set the data and display count
  // Primarily used in setting up multiple filters such as grid filters and outside filters
  setGridDataAndUpdateCount(data) {
    var datasource = this.createServerSideDatasourceWithData(data);
    this.gridApi!.setServerSideDatasource(datasource);
    this.resetDisplayCount();
  }

  // To open the sidebar based on selection of any registration from search typeahead
  onSearchSelect(event) {
    var rowNode = this.gridApi.getRowNode(event?.id.toString());
    this.onCellClicked(rowNode, true);
  }

  // Reset the grid data to default after clicking on cross icon in search typeahead
  onSearchClear(event) {
    this.setGridDataSourceWithoutData(this.gridParams);
    this.searchData = [];
  }

  onCellClicked(object, fromSearch: boolean = false) {
    if (this.checkForEditable(object, fromSearch) == false) {
      this.isSidebarVisible = false;
      if (object.data.rt == this.registrationType.Investments || object.data.rt == this.registrationType.Archived_Investments
        || object.data.rt == this.registrationType.Partnership) {
        //Do nothing
      }
      else if (object.column && object.column.colId && object.column.colId == 'hasDeal') {
        this.isSidebarVisible = false;
        //Do nothing
      }

      else if (object.data.rt != RegistrationType.Prohibitions && object.data.rt != RegistrationType.Archived_Prohibitions) {

        this.registration = Object.assign({}, object.data);
        this.isSidebarVisible = true;
        this.isClientEditing = false;
        this._regReqService.registration = object.data;

         // To get the client priority based on basis client id
        // This property will be read only
        this.getClientPriorityByBasisClientId(this._regReqService.registration.cl?.basisClientId);

        let workType = this.workTypes.find(e => e.workTypeId == this._regReqService.registration.wti);
        this._regReqService.registration.wtn = workType ? workType.workTypeName : '';

        if (this._regReqService.registration.stn && this._regReqService.registration.stn.registrationStatusId == 2) {
          //this.defaultNotesTab = "Reviewers";
          //uncomment above commented code and comment below code once reviewer tab is active
          if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.General) || (role.id == RoleType.PEGOperations) || (role.id == RoleType.PEGLeadership) || (role.id == RoleType.MultibidderManager) || (role.id == RoleType.RiskManagement))) {
            this.defaultNotesTab = "RegDetails" + '#' + this._regReqService.registration.id;
          } else {
            this.defaultNotesTab = "GeneralNotes" + '#' + this._regReqService.registration.id;
          }

        }
        else {
          if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.General) || (role.id == RoleType.PEGOperations) || (role.id == RoleType.PEGLeadership) || (role.id == RoleType.MultibidderManager) || (role.id == RoleType.RiskManagement))) {
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
        // }
        // }
      }
      else {
        this.prohibition = Object.assign({}, object.data);
        this.coreService.editProhibition.next(this.prohibition)
      }
      if (this.registration && this.registration.id != undefined) {
        this.appInsights.logEvent(`${CategoryType.RegistrationGrid} - sidebar open - registration id - ${this.registration.id.toString()}`);
      }
    }
    if (this.registration !== undefined) {
      if ((this.registration.stn.registrationStatusId == StatusRegistration.Conflicted || this.registration.stn.registrationStatusId == StatusRegistration.Duplicate) && this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager))) {
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
      this.displayCount = this.gridApi.getDisplayedRowCount();
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

  getInvestmentsAndAddToGrid() {
    this.registrationService.getInvestments().subscribe((data: Investment[]) => {

      // transform data
      let mappedInvestments = this.transformInvestments(data);
      this.rowData.push(...mappedInvestments);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;
      this.toastr.showSuccess('Investments loaded successfully', 'Success');
      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading Investments. Please try again.', 'Error');
        this.isLoading = false;
      }
    );
  }

  getProhibitionsAndAddToGrid() {
    this.registrationService.getProhibitions().subscribe((data: Prohibition[]) => {

      // transform data
      let mappedProhibitions = this.tranformProhibitionsIntoRegistrations(data);
      this.rowData.push(...mappedProhibitions);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;a
      this.toastr.showSuccess('Prohibitions loaded successfully', 'Success');
      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading prohibitions. Please try again.', 'Error');
        this.isLoading = false;
      }
    );
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

  updateRegistrationData() {
    let emp: Employee = {} as Employee;
    emp.employeeCode = this.coreService.loggedInUser.employeeCode;
    this._regReqService.registration.sb = emp;
    this._regReqService.registration.lud = new Date();
    this.isRegistrationUpdating = true;
    // To retain the client priority so that no extra api call is required for that
     let clientPriorityName = this.registration?.cl?.clientPriorityName;
    this.registrationService.updateRegistration(this._regReqService.registration)
      .subscribe(registration => {
        this.registration = registration;
        this._regReqService.registration = registration;
        this.isRegistrationUpdating = false;
        this.reInitializeUpdatedRegistration(registration, false, false);

        this.isRegDetailsRefresh=JSON.parse(JSON.stringify({refreshRegDetails:true}));   
        // To set the client priority as getregistratioById didn't get the priority name in real time
        this.registration.cl.clientPriorityName = clientPriorityName   
      },

        () => {
          this.toastr.showError('Error while updating registrations. Please try again.', 'Error');
        }
      );
  }

  reInitializeUpdatedRegistration(reg: Registrations, isRegDetails: boolean, suppressSuccessMessage: boolean) {
    let currentDate = new Date();
    let statusUpdateDate = Number(new Date(reg.sd));
    let EighteenMonthWindow = Number(new Date(currentDate.getFullYear() - 1, currentDate.getMonth() - 6, currentDate.getDay()));
    if (this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport))) {
      if (reg.sgTI == 3 || reg.sgTI == 6 || reg.sgTI == 7 || reg.sgTI == 8 || reg.sti == 7 || (reg.stn && reg.stn.registrationStatusId == 7)) {

        // if(submittedDate < EighteenMonthWindow)
        // {
        this.SetUpdatedRegistration(reg, this.registrationType.Archived_Registrations);
        // }
        // else
        // {
        //   this.SetUpdatedRegistration(registration, this.registrationType.Registration);
        // }

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
    if (this.registrationTypeFilter.indexOf(registrationType) > -1) {

      this.updateRegistrationNode(registration);
    }
    else {
      this.rowData = this.rowData.filter(e => e.nid != registration.nid);
      this.setGridDataAndUpdateCount(this.rowData);

    }
  }

  updateRegistrationNode(registration: Registrations) {
    var rowNode = this.gridApi.getRowNode(registration.id.toString());
    if (rowNode) {
      rowNode.setData(registration);
      var params = { force: true, rowNode: rowNode };
      this.gridApi.refreshCells(params);
    }
    else {
      this.gridApi.applyTransaction({ add: [registration] });
    }
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

  public registrationTypeChange(registrationType: number[]) {
    for (const value in RegistrationType) {
      if (Number(value)) {

        let previouslySelected = false;
        let currentlySelected = false;
        if (this.registrationTypeFilter.find(x => x.toString() == value)) {
          previouslySelected = true;
        }

        if (registrationType && registrationType.length && registrationType.find(x => x.toString() == value)) {
          currentlySelected = true;
        }

        if (previouslySelected == true && currentlySelected == false) {
          let items = [];
          if (this.gridApi)
            this.gridApi.forEachNode((node) => { items.push(node.data) });
          let rowData = items.filter(e => e.rt.toString() != value);
          this.rowData = rowData;
          this.toastr.showSuccess(RegistrationType[value] + ' removed successfully', 'Success');
        }

        if (previouslySelected == false && currentlySelected == true) {
          this.isLoading = true;
          switch (value) {
            case RegistrationType.Registration.toString():
              this.getRegistrationAndAddToGrid();
              break;
            case RegistrationType.Investments.toString():
              this.getInvestmentsAndAddToGrid();
              break;
            case RegistrationType.Prohibitions.toString():
              this.getProhibitionsAndAddToGrid();
              break;
            case RegistrationType.Archived_Registrations.toString():
              this.getArchivedRegistrationAndAddToGrid();
              break;
            case RegistrationType.Archived_Investments.toString():
              this.getArchivedInvestmentsAndAddToGrid();
              break;
            case RegistrationType.Archived_Prohibitions.toString():
              this.getArchivedProhibitionsAndAddToGrid();
              break;
            case RegistrationType.Partnership.toString():
              this.getPartnershipAndAddToGrid();
              break;
          }
        }
      }
    }
    this.registrationTypeFilter = registrationType;
  }

  getRegistrationAndAddToGrid() {
    this.registrationService.getRegistrationData().subscribe((data: Registrations[]) => {

      // transform data
      //let mappedProhibitions = this.tranformProhibitionsIntoRegistrations(data); 
      this.rowData.push(...data);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;
      this.toastr.showSuccess('Registrations loaded successfully', 'Success');
      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading prohibitions. Please try again.', 'Error');
      }
    );
  }

  getArchivedRegistrationAndAddToGrid() {
    this.registrationService.getArchivedRegistrations().subscribe((data: Registrations[]) => {

      // transform data
      //let mappedProhibitions = this.tranformProhibitionsIntoRegistrations(data);
      this.rowData.push(...data);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;
      this.toastr.showSuccess('Archived Registrations loaded successfully', 'Success');
      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading prohibitions. Please try again.', 'Error');
        this.isLoading = false;
      }
    );
  }

  getArchivedInvestmentsAndAddToGrid() {
    this.registrationService.getArchivedInvestments().subscribe((data: Investment[]) => {

      // transform data
      let mappedInvestments = this.transformInvestments(data);
      this.rowData.push(...mappedInvestments);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;
      this.toastr.showSuccess('Archived Investments loaded successfully', 'Success');
      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading Investments. Please try again.', 'Error');
        this.isLoading = false;
      }
    );
  }

  getArchivedProhibitionsAndAddToGrid() {
    this.registrationService.getArchivedProhibitions().subscribe((data: Prohibition[]) => {

      // transform data
      let mappedProhibitions = this.tranformProhibitionsIntoRegistrations(data);
      this.rowData.push(...mappedProhibitions);
      this.gridApi.setRowData(this.rowData);
      // this.totalRegistrations = this.rowData.length;
      this.toastr.showSuccess('Archived Prohibitions loaded successfully', 'Success');
      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading prohibitions. Please try again.', 'Error');
        this.isLoading = false;
      }
    );
  }

  getPartnershipAndAddToGrid() {
    this.registrationService.getPartnership().subscribe((data: Partnership[]) => {
      let mappedPartnership = this.transformPartnership(data);
      this.rowData.push(...mappedPartnership);
      this.gridApi.setRowData(this.rowData);
      this.toastr.showSuccess('Partnership loaded successfully', 'Success');
      this.isLoading = false;
    },
      () => {
        this.toastr.showError('Error while loading partnership. Please try again.', 'Error');
        this.isLoading = false;
      }
    );
  }

  public prohibitionInserted(prohibition: Prohibition) {
    if (!this.rowData || !this.rowData.length) {
      this.queueSearchRecords.push(...this.tranformProhibitionsIntoRegistrations([prohibition]));
    }
    this.gridApi.applyTransaction({ add: [prohibition] });
    this.toastr.showSuccess('Prohibition has been created successfully', 'Success');
  }

  public prohibitionUpdated(prohibition: Prohibition) {
    if (prohibition.iac) {
      this.SetUpdatedProhibition(prohibition, this.registrationType.Prohibitions);

    }
    else {
      this.SetUpdatedProhibition(prohibition, this.registrationType.Archived_Prohibitions);
    }
    this.toastr.showSuccess('Prohibition has been updated successfully', 'Success');
  }

  SetUpdatedProhibition(prohibition: Prohibition, registrationType: RegistrationType) {
    if (this.registrationTypeFilter.indexOf(registrationType) > -1) {
      var rowNode = this.gridApi.getRowNode(prohibition.nid.toString());
      var updatedProhibition = this.tranformProhibitionsIntoRegistrations([prohibition])
      rowNode.setData(updatedProhibition[0]);
      var params = {
        force: true,
        rowNodes: [rowNode]
      };
      this.gridApi.refreshCells(params);
    }
    else {
      this.rowData = this.rowData.filter(e => e.id != prohibition.id && e.rt != prohibition.rt);
      this.gridApi.setRowData(this.rowData);
    }

  }

  cancel() {
    this.prohibition = new Prohibition();
  }

  updatedValue(notes) {
    var rowNode = this.gridApi.getRowNode(this._regReqService.registration.nid?.replace("R","").toString());
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
    this.registration=registration
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
    let sortedColumn = object.columnApi.columnController.gridColumns.filter(a => a.sort != undefined);
    if (sortedColumn.length > 0) {
      sortedColumn = sortedColumn[0].userProvidedColDef.headerName;
      this.appInsights.logEvent(`${CategoryType.RegistrationGrid} - sorting - ${sortedColumn}`);
    }
  }

  onColumnMoved(object) {
    if (object.column.userProvidedColDef.headerName != null && object.column.userProvidedColDef.headerName != undefined) {
      this.appInsights.logEvent(`${CategoryType.RegistrationGrid} - column_dragged - ${object.column.userProvidedColDef.headerName.toString()}`);
    }
    this.mapColumnAttributes(object.columnApi.columnModel.gridColumns, object.columnApi.columnModel.displayedColumns)

  }

  newOpportunity() {
    this.route.navigate(['opportunity/newopportunity'])
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

  checkForEditable(object, fromSearch: boolean): boolean {
    // To check whether user has clicked on deal column or not
    // In case of deal column clicked, sidebar didn't need to be opened
    if (object.column?.colDef?.field == "hasDeal") {
      return true;
    }

    if (fromSearch) {
      return false;
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
    var rowNode = this.gridApi.getRowNode(registrationId?.replace("R",""));
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
        this.hasQueryParam = false;

      }
    });

  }

  updateClient(value) {
    this.isClientEditing = false;
    if (value) {
      this.isClientEditing = false;
      this.updatedField = "Client";
      this.auditLogService.addAuditLog(this.updatedField, 'cl', value.clientName);
      this.registration.cl = value;
      this._regReqService.registration.cl = value;
      if (value?.clientId && value?.clientId > 0) {
        this.registrationService.getHedgeFundByClientId(value.clientId, value.basisClientId).subscribe(data => {
          // To save the audit log for client first becasue hedge fund override that previous value
          this.auditLogService.saveAuditLog();
          this.toastr.showSuccess(this.updatedField + ' has been updated successfully', 'Success');

          // To create a new audit log in case of hedge fund is true or false
          // This is onyl ofr those client which have client id
          this.updatedField = "Client is a Hedge Fund";
          this.auditLogService.addAuditLog(this.updatedField, null, data ? data : false);
          this._regReqService.registration.hfc = data
          this.updateRegistrationData();

        });
      }
      else {
        // To save the audit log in case of new client (which didn't have any client id)
        this.auditLogService.saveAuditLog();
        this.toastr.showSuccess(this.updatedField + ' has been updated successfully', 'Success');

        // To set the hedge fund to false becasue new client is not a hedge fund
        this.updatedField = "Client is a Hedge Fund";
        this.auditLogService.addAuditLog(this.updatedField, null, false);
        this._regReqService.registration.hfc = false
        this.updateRegistrationData();
      }

    }
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

  // Hide all the unused filters from the grid
  // This is a temporary solution because this is linked to registration column defs
  // Once we moved to this version this can be accomplished from the DB
  hideUnusedFilters() {
    this.columnDefs.forEach(element => {
      if (element.field != 'drn') {
        element.suppressMenu = true;
      }
    });
  }


  mapColumnAttributes(gridColumnList: any[], displayedColumns: any[]) {
    let userColumnList = [];
    let userColumn: UserColumn;
    gridColumnList.forEach((element, index) => {
      userColumn = new UserColumn();
      userColumn.columnId = Number.parseInt(element.colId);
      userColumn.userColumnId = 0;
      userColumn.lastUpdated = new Date();
      userColumn.sortOrder = index;
      userColumn.columnWidth = element.actualWidth;

      let isPresent: boolean = displayedColumns.some(x => x.colId == element.colId);
      userColumn.isHide = !isPresent;

      let OpportunityField = this.defaultColumns.find(x => x.columnId == Number.parseInt(element.colId));
      if (OpportunityField) {
        userColumn.oppSortOrder = OpportunityField.oppSortOrder;
        userColumn.isOppName = OpportunityField.isOppName ? OpportunityField.isOppName : false;
      } else {
        userColumn.oppSortOrder = 0;
        userColumn.isOppName = false;
      }
      userColumn.employeeCode = this.coreService.loggedInUser.employeeCode;
      userColumn.pageId = PagesTypes.Registration;
      userColumn.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
      userColumnList.push(userColumn);
    });
    this.saveUserPrefrences(userColumnList);
  }
  onWidthChanged(event) {
    if (event.source === 'uiColumnDragged' && event.finished) {
      this.mapColumnAttributes(event.columnApi.columnModel.gridColumns, event.columnApi.columnModel.displayedColumns)

    }
  }
  saveUserPrefrences(userColumnList) {
    this.pipelineService.savePipelineColumnPrefrences(userColumnList, false).subscribe((res) => {
      let val: GridColumn[] = res;
      this.defaultColumns = val;
      this.toastr.showSuccess('Preferences has been saved', 'Success');
    });
  }

  onColumnVisible(event) {
    this.mapColumnAttributes(event.columnApi.columnModel.gridColumns, event.columnApi.columnModel.displayedColumns)
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
}

