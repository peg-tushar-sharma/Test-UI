import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreService } from '../../core/core.service';
import { ColDef, CsvExportParams, ExcelExportParams, GridOptions, RowDataTransaction } from 'ag-grid-community';
import { adminNameCellRendererComponent } from '../partner-cell-renderer/partner-cell-renderer.component';
import { OpsLeadCellRendererComponent } from './opsLeadrenderer/opslead-cell-renderer.component';
import { NotesCellRendererComponent } from './notesRenderer/notes-cell-renderer.component';
import { BtnCellRendererComponent } from './button-cell-renderer/button-cell-renderer.component';
import { PegTostrService } from '../../core/peg-tostr.service';
import { RoleEditorComponent } from './role-cell-editor/role-celleditor.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdminService } from '../admin.service';
import { AdminGridColumnService } from '../../shared/grid-generator/admin-grid-colum.service';
import { PagesTypes } from '../../shared/enums/page-type.enum';
import { Employee, GridColumn } from '../../shared/interfaces/models';
import { GlobalService } from '../../global/global.service';
import { DealsService } from '../../deals/deals.service';
import { EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../../shared/common/constants';
import { SecurityUserDetails } from '../admin';
import { Region } from '../../shared/interfaces/region';
import { CommonMethods } from '../../shared/common/common-methods';
import { RoleType } from '../../shared/enums/role-type.enum';
import * as moment from 'moment';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';



@Component({

  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('template', { read: TemplateRef }) addUserTemplate: TemplateRef<any>;
  @ViewChild('templateConfirmDelete', { read: TemplateRef }) templateConfirmDelete: TemplateRef<any>;

  hasIndustryAccess: boolean = false;
  isEditMode: boolean = false;
  SelectedEmployeeDetails: SecurityUserDetails;
  modalRef?: BsModalRef;
  modalRefDelete?: BsModalRef;
  regionItem: Region[] = [];
  securityRoles: any = [];
  PeopleTagload = false;

  levelCode = LEVEL_STATUS_CODE;
  filterValue: string;
  typeaheadEmployeeList: Employee[];
  isIncludeExternalEmployee: boolean = false;
  includeAllEmployee = true;
  ind: any = [];
  employeeItems: any;
  selectedExpert;
  selectEmployeeTypeAhead = new Subject<string>();
  isAddNewUserButtonDisabled = true;

  gridOptions: GridOptions = {
    getRowNodeId: (data: any) => data.securityUser.employeeCode.toString(),
    sortingOrder: ['desc', 'asc', null],
    unSortIcon: true,
    suppressMenuHide: true,
    suppressRowClickSelection: false,
    headerHeight: 45,
    tooltipShowDelay: 0,
    rowHeight: 50,
    suppressColumnVirtualisation: true,
    defaultColDef: {
      floatingFilter: false
    },
    accentedSort: true,
    cacheQuickFilter: true,
    onGridReady: this.onGridReady.bind(this),
    onCellClicked: this.onCellClicked.bind(this),
    onFirstDataRendered: this.onFirstDataRendered.bind(this),
    getContextMenuItems: this.getContextMenuItems.bind(this),
    components: {
      adminNameCellRendererComponent: adminNameCellRendererComponent,
      OpsLeadCellRendererComponent: OpsLeadCellRendererComponent,
      NotesCellRendererComponent: NotesCellRendererComponent,
      BtnCellRendererComponent: BtnCellRendererComponent,
      RoleEditorComponent: RoleEditorComponent,
    }
  }

  gridApi;
  columnDefs: ColDef[];
  rowData: any = []

  constructor(private modalService: BsModalService, private toastr: PegTostrService, private adminService: AdminService,
    private adminGridService: AdminGridColumnService, public globalService: GlobalService, private _dealService: DealsService, private coreService: CoreService
  ) { }

  hasUserIndustryAccess() {
    if (this.SelectedEmployeeDetails?.securityRoleId == RoleType.PAM || this.SelectedEmployeeDetails?.securityRoleId == RoleType.PracticeAreaManagerRestricted) {
      return true;
    } else {
      return false;
    }
  }

  onSecurityRoleChange($event) {
    this.SelectedEmployeeDetails.industries = [];
  }

  onFirstDataRendered() {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  ngOnInit() {
    this.getColumnData();
    this.getIndustries();
    this.getAdminData();
    this.getSecurityRoles();
    this.getEmployees();
    this.getRegion();
    let userSecurityRole  = this.coreService?.loggedInUser?.securityRoles.map(role=>role.id);
    this.isAddNewUserButtonDisabled = !(userSecurityRole.includes(RoleType.PEGAdministrator) || userSecurityRole.includes(RoleType.TSGSupport));
  }

  onFilterTextBoxChanged(value) {
    this.gridApi.setQuickFilter(value);
  }

  getColumnData() {
    this.adminService.getGridColumns(PagesTypes.Admin).subscribe((columns: GridColumn[]) => {
      if (columns && columns.length) {
        // set note and industry columns to also be searchable
        columns.forEach((column) => {
          if (column.field == "adminNotes" || column.field == "industry") {
            column.isQuickFilter = true;
          }
        });

        this.columnDefs = this.adminGridService.getColumnDefinitions(columns);

        this.columnDefs.forEach((columnDef) => {
          // add sorting to name column
          if (columnDef.field == 'securityUserName') {
            columnDef.sortable = true;
          }

          // set industry value
          if (columnDef.field == 'industry') {
            columnDef.valueGetter = function (params) {
              return params.data.industries.map((x) => x.industryName).join(', ').trim();
            }
          }
        });
      }
    });
  }

  getAdminData() {
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
    this.adminService.getAdminData().subscribe((res) => {
      this.rowData = res;
      this.toastr.showSuccess('Admins loaded successfully', 'Success');
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  getSecurityRoles(): void {
    this.globalService.getSecurityRoles().subscribe(res => {
      this.securityRoles = res.filter(x => x.id != 7);
    });
  }

  getIndustries() {
    this.globalService.getIndustrySectors().subscribe(items => {
      this.ind = items.filter(x => x.isTopIndustry == true);
    });
  }
  getEmployee() {
    this._dealService.getEmployeeByName('a', this.levelCode, EXPERT_PARTNER_LEVELGRADE, this.includeAllEmployee, this.isIncludeExternalEmployee).subscribe(res => {
      this.employeeItems = res;
    });
  }

  getEmployees() {
    this.selectEmployeeTypeAhead.pipe(
      tap(() => { this.PeopleTagload = true; }),
      debounceTime(200),
      switchMap(term => this._dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), this.levelCode, EXPERT_PARTNER_LEVELGRADE, this.includeAllEmployee, this.isIncludeExternalEmployee)),
      tap(() => this.PeopleTagload = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });

      this.rowData.forEach(data => {
        items = items.filter(a => a.employeeCode != data.securityUser.employeeCode);
      })

      this.typeaheadEmployeeList = items;
      this.employeeItems = items;
    });
  }

  addUser() {
    let newInstance: SecurityUserDetails = new SecurityUserDetails();
    newInstance.employee = this.SelectedEmployeeDetails.employee;
    newInstance.expirationDate = this.SelectedEmployeeDetails.expirationDate ? moment(this.SelectedEmployeeDetails?.expirationDate).format("YYYY-MM-DD") : null;
    newInstance.industries = this.SelectedEmployeeDetails.industries ? this.SelectedEmployeeDetails?.industries : [];
    newInstance.lastUpdateBy = this.coreService.loggedInUser.employeeCode;
    newInstance.note = this.SelectedEmployeeDetails?.note;
    newInstance.regions = this.SelectedEmployeeDetails.regions ? this.SelectedEmployeeDetails.regions : [];
    newInstance.securityRoleId = this.SelectedEmployeeDetails?.securityRoleId;

    this.adminService.addSystemUser(newInstance).subscribe(res => {
      let index = this.rowData.findIndex((i) => i.securityUser.employeeCode == res.securityUser.employeeCode);
      if (index < 0) {
        this.rowData.push(res);
        this.gridApi.setRowData(this.rowData);
        this.toastr.showSuccess('User ' + CommonMethods.getEmployeeName(res.securityUser) + " added successfully!", "Success");

      } else {
        this.rowData[index] = res;
        this.gridApi.setRowData(this.rowData);
        var rowNode = this.gridApi.getRowNode(res?.securityUser.employeeCode?.toString());

        if (rowNode) {
          rowNode.setData(res);
          var params = { force: true, suppressFlash: true, update: [rowNode] };
          this.gridApi.redrawRows({ rowNodes: [rowNode] });
          this.gridApi.refreshCells(params);
          this.toastr.showSuccess('User ' + CommonMethods.getEmployeeName(res.securityUser) + " updated successfully!", "Success");
        }
      }

      this.closePopup();
    });
  }

  closePopup() {
    this.SelectedEmployeeDetails = new SecurityUserDetails();
    this.isEditMode = false;
    this.modalRef.hide();
  }

  getRegion() {
    this.globalService.getRegions().subscribe(res => {
      this.regionItem = res;
    })
  }

  deleteUser(userInfo) {
    this.adminService.deleteSystemUser(userInfo.securityUser.employeeCode).subscribe(res => {
      let index = this.rowData.findIndex(i => i.securityUser.employeeCode == userInfo.securityUser.employeeCode);
      this.rowData.splice(index, 1);
      this.gridApi.applyTransaction({ remove: [userInfo] });
      this.toastr.showSuccess("User " + CommonMethods.getEmployeeName(userInfo.securityUser) + " deleted successfully", "Success")
    })
  }

  onCellClicked(event) {
    if (event.colDef.field == "adminDelete") {
      let message = 'Are you sure? ' + CommonMethods.getEmployeeName(event.node.data.securityUser) + ' will be removed.'

      const initialState = {
        data: message,
        title: 'Confirmation'
      };

      this.modalRefDelete = this.modalService.show(ConfirmModalComponent, { initialState });
      this.modalRefDelete.content.closeBtnName = 'Close';

      this.modalRefDelete.content.event.subscribe(a => {
        if (a == 'reset') {
          this.deleteUser(event.node.data);
        } else {
        }
      });
    } else if (event.colDef.field == "adminEdit") {
      this.openModel(event.data, true);
    }
  }

  openModel(val: any, isEdit: boolean) {
    this.SelectedEmployeeDetails = new SecurityUserDetails();
    this.isEditMode = false;

    if (isEdit) {
      this.isEditMode = true;
      this.adminService.getAdminDataByCode(val.securityUser.employeeCode).subscribe((res: any) => {
        let value = res[0];
        value.securityUser.searchableName = CommonMethods.getEmployeeName(value.securityUser);
        this.SelectedEmployeeDetails.employee = value.securityUser;
        this.SelectedEmployeeDetails.expirationDate = value.expirationDate && value.expirationDate != "0001-01-01T00:00:00Z" ? moment(value.expirationDate).format("DD-MMM-YYYY") : undefined;
        this.SelectedEmployeeDetails.industries = value.industries;
        this.SelectedEmployeeDetails.note = value.note;
        this.SelectedEmployeeDetails.lastUpdateBy = this.coreService.loggedInUser.employeeCode;
        this.SelectedEmployeeDetails.securityRoleId = value.securityRole.id;
      });
    }

    const initialState = {
      title: "Add user"
    };

    this.modalRef = this.modalService.show(this.addUserTemplate, {
      initialState,
      class: "modal-dialog-centered modal-lg",
      backdrop: "static",
      keyboard: false
    });
  }

    getContextMenuItems(params: any) {
    return [
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
    }
    processDownload() {
        const params: CsvExportParams = {
            fileName: "admin_grid_data_export",
            columnKeys: this.getAllColumns(),
            skipColumnHeaders: false,
        };

        this.gridOptions.api.exportDataAsCsv({
            ...params,
            processCellCallback: ({ column, value, node }) =>
                this.processCell(column, value, node),
        });
    }

    processExcelDownload() {
        const params: ExcelExportParams = {
            fileName: "admin_grid_data_export",
            columnKeys: this.getAllColumns(),
            skipColumnHeaders: false,
        };

        this.gridOptions.api.exportDataAsExcel({
            ...params,
            processCellCallback: ({ column, value, node }) =>
                this.processCell(column, value, node),
        });
    }


    processCell(column: any, value: any, params?: any) {
        let fieldname :string = column?.colDef?.field ?? '';
        if (fieldname === "expirationDate" && value) {
            return (value && value != "0001-01-01T00:00:00Z") ? moment(value).format("DD-MMM-YYYY") : "";
        }
        if (fieldname=== "lastModified" && params?.data?.lastUpdated) {
            return(params?.data?.lastUpdated && params?.data?.lastUpdated != "0001-01-01T00:00:00Z") ? moment(params?.data?.lastUpdated).format("DD-MMM-YYYY") : "";
        }
        return value;
    }

    getAllColumns() {
        return this.gridOptions.columnApi.getAllColumns().map(col => col.getColId());
    }

}
