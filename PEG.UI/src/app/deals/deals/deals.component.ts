import { Component, OnInit, ChangeDetectorRef, Inject, LOCALE_ID } from '@angular/core';
import { GridApi, ColDef, GridOptions, ExcelExportParams, ProcessCellForExportParams } from 'ag-grid-community';
import { DealsService } from './../deals.service';
import { PegTostrService } from '../../core/peg-tostr.service';
import { GridValues } from '../../shared/grid-generator/grid-constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CoreService } from '../../core/core.service';
import { RoleType } from '../../shared/enums/role-type.enum';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { RegistrationGridService } from '../../registrations/registrations/registration-grid.service';
import { GridColumn } from '../../shared/interfaces/models';
import { fieldAuth } from '../../shared/common/fieldAuth';
import { Router } from '@angular/router';
import { TextFilterComponent } from '../../shared/customFilters/text-filter/text-filter.component';
import { CustomHeaderComponent } from '../../shared/customFilters/custom-header/custom-header.component';
import { CommonMethods } from '../../shared/common/common-methods';
import { TrackerStatus } from '../../shared/enums/trackerStatus.enum'
import { GrantPermissionComponent } from '../../shared/grant-permission/grant-permission.component';
import { CopyLinkIconComponent } from '../../shared/copy-link-icon/copy-link-icon.component';
import { DateFilterComponent } from '../../shared/customFilters/date-filter/date-filter.component';
import { IconsRendererComponent } from '../../shared/icons-renderer/icons-renderer.component';
import { formatDate } from '@angular/common';
import { CategoryType } from '../../shared/enums/ga-category.enum'
import { GlobalService } from '../../global/global.service'
import { CustomSetFilterComponent } from './../../shared/customFilters/custom-set-filter/custom-set-filter.component'
import { DealSecurityService } from '../deal.security.service';
import { DealIconRendererComponent } from '../../shared/deal-icon-renderer/deal-icon-renderer.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { DealValidationType } from '../../shared/enums/deal-validation-type.enum'
import * as moment from 'moment';
import { PagesTypes } from '../../shared/enums/page-type.enum';
import { PipelineService } from '../../pipeline/pipeline.service';
import { UserColumn } from '../../pipeline/userColumn';
import { AppInsightWrapper } from '../../applicationInsight/appInsightWrapper';


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})


export class DealsComponent implements OnInit {

  public fieldAuth: fieldAuth = new fieldAuth();
  public selectedTrackerLabel = "";

  public tackerStatusOptions = [{
    value: TrackerStatus.ComingToMarket,
    label: 'Coming to Market',
    isSelected: true
  }, {
    value: TrackerStatus.Active,
    label: 'Active',
    isSelected: true,
  }, {
    value: TrackerStatus.Transacted,
    label: 'Transacted',
    isSelected: false
  }, {
    value: TrackerStatus.ProcessDied,
    label: 'Process Died',
    isSelected: false
  }, {
    value: TrackerStatus.Cold,
    label: 'Cold',
    isSelected: false
  }]
  gridApi: GridApi;
  public isDownloadingExcel = false;
  public isDownloadingReport = false;
  public isReportEnabled: boolean = false;
  isFilterDisabled = false;
  rowData = []
  isGenralOrLegal = false;
  deal: object = null;
  dealStatus = []
  dealId: number;
  initialRowData: any[];
  filterValue: string;
  trackerStatus = TrackerStatus;
  columnDefs: ColDef[];
  bsModalRef: BsModalRef;
  disableFilters: boolean = true;
  disableReport: boolean = false;;
  displayCount: number = 0;
  dealData: any;
  filterModel: any;
  targetName: string;
  gridOptions: GridOptions = {
    sortingOrder: ['desc', 'asc'],
    defaultColDef: this.registrationGridService.getDefaultColumnDefinition,
    unSortIcon: false,
    suppressMenuHide: true,
    suppressRowClickSelection: true,
    rowHeight: 33,
    headerHeight: 33,
    suppressColumnVirtualisation: true,
    accentedSort: true,
    enableRangeSelection: true,
    rowSelection: "multiple",
    copyHeadersToClipboard: true,

    onCellClicked: this.onCellClicked.bind(this),
    onCellValueChanged: this.onCellValueChanged.bind(this),
    onFilterChanged: this.onFilterChanged.bind(this),
    onRowClicked: this.onRowClicked.bind(this),
    onRowDataChanged: this.onRowDataChanged.bind(this),

    onColumnVisible: this.onColumnVisible.bind(this),
    onColumnMoved: this.onColumnMoved.bind(this),
    onColumnResized: this.onWidthChanged.bind(this),

    excelStyles: [
      {
        id: "dateFormat",
        dataType: "DateTime",
        numberFormat: { format: "dd-mmm-yyyy hh:MM;" }
      },
      {
        id: "dateFormat1",
        dataType: "DateTime",
        numberFormat: { format: "dd-mmm-yyyy;" }
      }
    ],
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
      copyLinkIconComponent: CopyLinkIconComponent,
      grantPermissionComponent: GrantPermissionComponent,
      textFilterComponent: TextFilterComponent,
      iconsRendererComponent: IconsRendererComponent,
      customSetFilterComponent: CustomSetFilterComponent,
      dealIconRendererComponent: DealIconRendererComponent,
    },
    onGridReady: params => {
      this.gridApi = params.api;
      params.api.sizeColumnsToFit();
      this.resetDisplayCount();
      this.getDeals()

    },

  };

  defaultColumns: GridColumn[] = [];
  userColumnList = [];

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);

  }

  onRowDataChanged(event) {
    if (this.gridApi) {
      this.gridApi.setFilterModel(this.filterModel);
      this.gridApi.onFilterChanged();
      this.filterModel = undefined;
    }
    this.resetDisplayCount();
  }

  onClearAllFilters() {
    this.filterValue = null;

    this.gridApi.setFilterModel(null);
    this.gridApi.onFilterChanged();
  }
  onCellClicked(event) {
    if (event.colDef.field == 'copyLink') {
      this.CopyToClipboard(event.data);

    } else if (event.colDef.field == 'dealPermission') {
      this.grantPermission(event.data);
    } else if (event.colDef.field == 'deleteTracker') {
      this.targetName = event.data.targetName;
      this.validateTrackerState(event.data.dealId);
    } else {
      this.editDeal(event.data);
    }
  }
  onFilterChanged(event) {
    this.resetDisplayCount();
  }
  onRowClicked(event) {

  }
  onCellValueChanged(event) {

  }
  validateTrackerState(trackerId) {

    this.dealsService.validateTrackerState(trackerId).subscribe((res) => {
      if (res == DealValidationType.HasClients) {
        this.toastr.showWarning('Clear all clients before deleting', 'Warning');
      } else if (res == DealValidationType.HasExperts) {
        this.toastr.showWarning('Clear all experts pool information before deleting', 'Warning');
      } else if (res == DealValidationType.HasLock) {
        this.toastr.showWarning('Unlock the tracker before deleting', 'Warning');
      } else {
        const initialState = {
          data: 'This action will delete the tracker ' + this.targetName + '. Would you like to continue?',
          title: 'Confirmation'
        };
        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState, backdrop: "static", keyboard: false });

        this.bsModalRef.content.closeBtnName = 'Close';

        this.bsModalRef.content.event.subscribe(a => {
          if (a == 'reset') {
            this.deleteDealByIdRow(trackerId);
          }
        })
      }
    });
  }
  deleteDealByIdRow(dealId) {
    this.dealsService.deleteDealById(dealId).subscribe((res) => {
      this.rowData = this.rowData.filter(a => a.dealId != dealId);
      this.resetDisplayCount();
      this.toastr.showSuccess('Tracker has been deleted', 'Success');
    });
  }

  resetDisplayCount() {
    if (this.gridApi) {
      setTimeout(() => {
        this.displayCount = this.gridApi.getDisplayedRowCount();
      }, 1000);
     
    }
  }

  constructor(private _coreService: CoreService, private dealsService: DealsService, private toastr: PegTostrService, public dealSecurityService: DealSecurityService,
    private modalService: BsModalService, private cd: ChangeDetectorRef, private registrationService: RegistrationService, private pipelineService: PipelineService,
    private route: Router, private registrationGridService: RegistrationGridService, @Inject(LOCALE_ID) private locale: string, private appInsights: AppInsightWrapper, private globalService: GlobalService) {
  }



  TrackerStatusChange(event) {
    const index = this.tackerStatusOptions.findIndex(item => item.value === event.value);
    if (index !== -1) {
      this.tackerStatusOptions[index].isSelected = !this.tackerStatusOptions[index].isSelected;
    }
    this.disableFilters = true;
    this.setTrackerStatusLabel();
    this.getDeals();
  }

  setTrackerStatusLabel() {
    this.selectedTrackerLabel = this.tackerStatusOptions.filter(x => x.isSelected).map(x => x.label).toString();

  }
  ngOnInit() {
    this.setTrackerStatusLabel();
    if (this._coreService.loggedInUser.securityRoles) {
      this.isReportEnabled = this._coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport));
    }
    this.dealId = undefined
    this.getDealStatus();
    this.getColumnData();

    this.getUserAuthorization();
    let securityRoleId = this._coreService.loggedInUserRoleId;

  }
  ngAfterViewInit() {

  }
  getDeals() {
    this.gridApi.showLoadingOverlay();
    const selectedItemIds = this.tackerStatusOptions.filter(x => x.isSelected).map(x => x.value);

    this.dealsService.getDeals(selectedItemIds.toString()).subscribe((res) => {
      this.resetDisplayCount();
      if (res != undefined && res != null && res.length > 0) {
        this.rowData = res;
        this.initialRowData = res;
        this.dealData = res;
        this.disableFilters = false;
        this.disableReport = false;
        this.toastr.showSuccess('Deal Trackers loaded successfully', 'Success');
        this.resetDisplayCount();
        this.appInsights.logEvent( `${CategoryType.ExpertiseTracker} - Grid Load - Tracker grid loaded successfully`);

      } else {

        this.disableFilters = false;
        this.disableReport = true;
        this.rowData = [];
        this.initialRowData = [];
        this.resetDisplayCount();

      }
      this.gridApi.hideOverlay();
    });
  }
  getDealStatus() {
    this.globalService.getDealStatus().subscribe(res => {
      this.dealStatus = res;
    })
  }

  getColumnData() {
    // use this for agGrid col def
    this.pipelineService.getUserColumns(PagesTypes.Deal).subscribe((columns: GridColumn[]) => {
      this.defaultColumns = columns;
      this.columnDefs = this.registrationGridService.getColumnDefinitions(columns);
    });
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
      userColumn.employeeCode = this._coreService.loggedInUser.employeeCode;
      userColumn.pageId = PagesTypes.Deal;
      userColumn.lastUpdatedBy = this._coreService.loggedInUser.employeeCode;
      this.userColumnList.push(userColumn);
    });
    this.saveUserPrefrences(this.userColumnList);
  }

  saveUserPrefrences(userColumnList) {
    this.pipelineService.savePipelineColumnPrefrences(userColumnList, false).subscribe((res) => {
      let val: GridColumn[] = res;
      this.defaultColumns = val;
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

  getUserAuthorization(): any {
    this.registrationService.getUserAuthorization()
      .subscribe(userRoleField => {
        this.registrationService.roleFieldValues = userRoleField;
        this.setFieldAuthorization();
      });
  }

  AddNewTracker() {
    this.clearExistingDeal();
    this._coreService.isTrackerDirty = true;
    this.dealSecurityService.isReadOnlyMode = false;
    this.route.navigate(['/deals/deal/0']);
  }

  clearExistingDeal() {
    if (this.dealsService.multipleRegToDeal != undefined && this.dealsService.multipleRegToDeal.getValue() != null) {
      this.dealsService.multipleRegToDeal.next(null);
    }
  }

  setFieldAuthorization() {
    let allRoleFields = this.registrationService.roleFieldValues;
    for (let key in this.fieldAuth) {
      for (let i = 0; i < allRoleFields.length; i++) {
        if (key == allRoleFields[i]['field']['fieldName']) {
          this.fieldAuth[key]['isEditable'] = allRoleFields[i]['isEditable'];
          this.fieldAuth[key]['isVisible'] = allRoleFields[i]['isVisible'];
          break;
        }
      }
    }
  }
  editDeal(val) {
    this.clearExistingDeal();
    this._coreService.isTrackerDirty = true;
    this.dealsService.setDealId(val.dealId);
    this.appInsights.logEvent(`${CategoryType.ExpertiseTracker} -Edit Tracker - Tracker Id: ${val.dealId}`);
   // this.dealId = val.dealId;
    let encodedDealId = CommonMethods.encodeData( val.dealId.toString());

    const url = this.route.serializeUrl(
      this.route.createUrlTree([`/deals/deal/${encodedDealId}`])
    );

    window.open(url, '_blank');
    // this.route.navigate(['/deals/deal/' + encodedDealId]);
  }
  grantPermission(row) {

    var openPopup = document.getElementById('openModalButton')
    openPopup.click();
    this.deal = row;
  }




  CopyToClipboard(row) {
    const el = document.createElement('textarea');
    el.value = document.location.href + '/deal/' + CommonMethods.encodeData(row.dealId);
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.toastr.showSuccess("Link copied successfully", "Copied")
  }
  downloadExcel(event: any) {

    this.registrationService.VersionCheck().subscribe(res => {
      this.isDownloadingExcel = true;
      setTimeout(() => this.processExcelDownload(), 1);
    })
  }

  processExcelDownload() {
    let columns = []
    this.columnDefs.forEach((r) => {
      if (r.headerName != '')
        columns.push(r.field);

    })
    if (this.columnDefs.some(r => r.field == 'copyLink')) {
      columns.push('copyLink');
    }

    let name = `DealTracker_${formatDate(new Date(), GridValues.dateFormat, this.locale)}`;
    let params: ExcelExportParams = <ExcelExportParams>{
      allColumns: true,
      fileName: name,
      sheetName: name,
      // columnKeys: columns,
      processCellCallback: (params: ProcessCellForExportParams): string => {
        let value = params.value;
        let colDef = params.column.getColDef();

        switch (colDef.field) {
          case "copyLink":
            value = params.node.data.dealId;
            break;

          case "targetDescriptionDT":
            value = params.node.data.targetDescription;
            break;

          case "supportedWinner":
            value = params.node.data.supportedWinningBidder;
            break;

          case "dealInTheNews":
            if (params?.node?.data?.isDealNews) {
              value = params.node.data.isDealNews;
            } else {
              value = "No";
            }
            break;
        }
        if (value != undefined) {
          if (colDef.headerName.toLowerCase().endsWith('dt')) {
            value = params && params.value ? CommonMethods.converToLocal(params.value, true) : '';
          }
          if (colDef.field == "copyLink") {

            value = document.location.href + '/deal/' + value;
          }

          return value;
        }
      }

    };

    this.gridOptions.api.exportDataAsExcel(params);
    this.isDownloadingExcel = false;
  }

  convertToUInt8(inputString) {
    var buf = new ArrayBuffer(inputString.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != inputString.length; ++i) view[i] = inputString.charCodeAt(i) & 0xFF;
    return buf;
  }

  downloadReport() {
    this.isDownloadingReport = true;
    this.disableFilters = true;
    let filteredRowData = [];
    let filteredDealId = [];
    this.gridApi.forEachNodeAfterFilter(node => filteredRowData.push(node.data));
    filteredRowData.forEach(element => {
      filteredDealId.push({ 'referenceId': element.dealId })
    });
    var d = new Date();
    var n = d.getTimezoneOffset()
    if (n > 0) {
      n = n * -1
    } else {
      n = Math.abs(n);
    }

    this.dealsService.getMBTrackerReport(filteredDealId, n).subscribe(res => {

      let arrayBuffer = this.convertToUInt8(atob(res))
      const blob = new Blob([arrayBuffer], { type: 'application/vnd.ms.excel' });

      //download the file
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'Expertise_Tracker_' + CommonMethods.getDateLabel(new Date()) + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      this.isDownloadingReport = false;
      this.disableFilters = false;
    })
  }

  refreshTracker() {
    this.filterModel = this.gridApi.getFilterModel();
    this.gridApi.showLoadingOverlay();
    this.getDeals();
  }
}
