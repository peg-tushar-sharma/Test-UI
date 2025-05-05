import { Component, OnInit, Input, ViewChild, OnChanges,  SimpleChanges, HostListener } from '@angular/core';
import { Expert } from './expert'
import { DealsService } from '../../deals.service';
import {  GridOptions,  ColDef, GridReadyEvent, RowDropZoneParams } from 'ag-grid-community';
import { DealExpertsList, deals } from '../../deal';
import { expertGroup } from './expertGroup';
import { NgForm } from '@angular/forms';
import { EmployeeEditorComponent } from '../../../shared/grid-editor/employee-editor/employee-editor.component'
import { ClientEditorComponent } from '../../../shared/grid-editor/client-editor/client-editor.component';
import { IndustryEditorComponent } from '../../../shared/grid-editor/industry-editor/industry-editor.component';
import { CategoryEditorComponent } from '../../../shared/grid-editor/category-editor/category-editor.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { GlobalService } from '../../../global/global.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { CoreService } from '../../../core/core.service';
import { RoleType } from '../../../shared/enums/role-type.enum';
import * as moment from 'moment';
import { CommonMethods } from '../../../shared/common/common-methods';


@Component({
  selector: 'app-deal-experts',
  templateUrl: './deal-experts.component.html',
  styleUrls: ['./deal-experts.component.scss']
})
export class DealExpertsComponent implements OnInit, OnChanges {

  @ViewChild('form', { static: true })
  private form: NgForm;

  @Input()
  deal: deals;

  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;

  columnDefs: ColDef[];
  rowData = [];
  private gridApi;
  dealId: number;
  expertGroup: expertGroup = new expertGroup();
  expertGroupId: number = 0;
  editingRowIndex: number;
  errorMessage: string;
  isDuplicateName: boolean = false;
  bsModalRef: BsModalRef;
  lstColors: any[] = [];
  lstExpertGroupCategory: any[] = [];
  oldNode: any;
  oldNodeId: any;
  currentExpertIndex: any;
  selectedImportDeal: DealExpertsList;
  selectedImportExpertGroup: expertGroup;
  selectedImportExpertPool: any;
  currentEditGroupIndex: number = 0;
  selectedImportNotes: any
  importExpert: boolean;
  selectedImportExpertPoolcolor: any;
  enableImport: boolean = false;

  active = 'none';
  importPoolNotes = '';
  disableImportPool: boolean = false;
  disableNew: boolean = false;

  private popupParent;
  currentExpertStack: any

  gridOptions: GridOptions = {
    rowHeight: 47,
    headerHeight: 47,
    onFirstDataRendered: this.onFirstDataRendered.bind(this),
    onGridReady: this.onGridReady.bind(this),
    suppressCsvExport: true,
    suppressContextMenu: true,
    frameworkComponents: {
      agEmployeeEditor: EmployeeEditorComponent,
      agClientEditor: ClientEditorComponent,
      agIndustryEditor: IndustryEditorComponent,
      agCategoryEditor: CategoryEditorComponent
    },
    onCellClicked: this.onCellClicked.bind(this),
    onCellEditingStarted: this.onCellEditingStarted.bind(this),
    onCellEditingStopped: this.onCellEditingStopped.bind(this),
    stopEditingWhenGridLosesFocus: true,
  };

  addPool: boolean = false;
  poolEdit: string = 'Save';
  defaultColDef: any;
  isExpertEnabled: boolean = false;
  currentExpertGroupId: number;
  hoverExpertGroupId: number
  updateExpertGroupId: number;
  currentSelectedGroupIndex = 0;
  //hasConfigChanges = false;
  dealTypeAhead = new Subject<string>();
  dealList: any[] = [];
  dealload = false;
  isRightClick:boolean=false;
 
  
  constructor(private dealService: DealsService, private modalService: BsModalService, private tostreService: PegTostrService, private globalService: GlobalService, public core: CoreService) {

    this.popupParent = document.querySelector('body');
    if (this.deal == undefined) {
      this.addPool = true;
    }

    this.dealTypeAhead.pipe(
      tap(() => { this.dealload = true; this.dealList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getDealsToImportExperts(term)),
      tap(() => { this.dealload = false }
      )
    ).subscribe(items => {

      this.dealList = items;
      this.dealList = this.dealList.map(obj => ({ ...obj, disabled: obj.appSessionId ? true : false }))

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
     if (changes.deal && changes.deal.currentValue) {
      if (changes.deal.currentValue.dealId > 0) {
        if (this.deal.expertGroup && this.deal.expertGroup.length > 0 && this.deal.expertGroup[0].expertGroupName != undefined) {
          this.addPool = false;
          this.currentExpertGroupId = this.deal.expertGroup[0].expertGroupId;
         this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex);
          this.setExpertGroupId();
        }
      }
    } else if (changes.isTabReadOnly && changes.isTabReadOnly.currentValue != undefined) {

      this.resetColumnConfig(changes.isTabReadOnly.currentValue)
    }
  }
  resetColumnConfig(value) {
    if (this.gridApi && this.columnDefs && this.columnDefs.length) {

      var oldColumnDef = this.columnDefs;

      oldColumnDef.forEach(oldColumn => {
        if (this.editableField.some(x => x == oldColumn.field)) {
          oldColumn.editable = !value;
        }

      });

      oldColumnDef.forEach(oldColumn => {
        if (this.hiddenField.some(x => x == oldColumn.colId)) {
          oldColumn.hide = value;
        }

      });

      this.gridApi.setColumnDefs(oldColumnDef);
      // this.gridApi.refreshCells({ force: true });
      // this.hasConfigChanges=true;
    }
  }
  ngOnInit() {
    this.globalService.getExpertPoolColors().subscribe(colors => {
      this.lstColors = colors;
    })
    this.globalService.getExpertGroupCategory().subscribe(category => {
      this.lstExpertGroupCategory = category;
    })

    this.rowData = [];
    this.expertGroupId = this.deal.expertGroup.length + 1;

    if (this.currentExpertGroupId) {
      this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex);
    }

    let checkForExpert = this.deal.dealId > 0 ? 0 : 1;
    if (this.deal.expertGroup && this.deal.expertGroup.length > checkForExpert) {
      this.currentExpertGroupId = this.deal.expertGroup[checkForExpert].expertGroupId;
      this.addPool = false;
      this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex);
    } else {
      this.addPool = true;
      if (this.core.loggedInUser.securityRoles.some(e => e.id == RoleType.MultibidderManager || e.id == RoleType.TSGSupport || e.id == RoleType.PEGAdministrator || e.id == RoleType.PracticeAreaManagerRestricted || e.id == RoleType.PAM)) {
        this.enableImport = true;
      }
    }

    this.dealService.switchTab.subscribe((res) => {
      if (res == 'experts') {
        this.rowData = this.rowData.filter(a => a.employeeCode != '' && a.employeeCode != null && a.employeeCode != undefined);
        if (this.currentExpertGroupId)
          this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex);
      }
    })
  }

  onCellEditingStarted(object) {
    if (object.colDef.field == 'expertName') {
      this.oldNode = JSON.parse(JSON.stringify(object.node.data));
      this.oldNodeId = object.node.id;
      let currentExperts: expertGroup[] = this.deal.expertGroup.filter(a => a.expertGroupId == this.currentExpertGroupId);
      this.currentExpertIndex = currentExperts[0].experts.findIndex(a => a.employeeCode == object.node.data.employeeCode);
      this.currentExpertStack = [];
      this.currentExpertStack = JSON.parse(JSON.stringify(currentExperts[0].experts));
    }
  }

  onCellEditingStopped(object) {
  }
  editableField = ['expertName', 'note', 'categoryName', 'expertIndustries', 'expertClients'];
  hiddenField = ['1'];
  onGridReady(params) {
    this.gridApi = params.api;
    this.addDropZones(params);
    this.columnDefs = [
      {
        headerName: '', field: 'IsExternalEmployee', pinned: 'left', editable: false, width: 50, minWidth: 60,
        cellRenderer: (params) => {
          if (params) {
            if (params.data.isExternalEmployee) {
              return '<i title="BAN Expert" class="tag-small" title="BAN Expert">B</i>'
            }
            else {
              return ''
            }

          }
        },
      },
      {
        headerName: 'Name', field: 'expertName', pinned: 'left', minWidth: 220, cellEditor: "agEmployeeEditor", sortable: false,
      },
      {
        headerName: 'Notes', field: 'note', cellEditor: "agLargeTextCellEditor", minWidth: 180, sortable: false, cellEditorParams: (params) => {
          return {
            maxLength: '10000'
          }
        }
      },
      { headerName: 'Cat. of Expertise', field: 'categoryName', minWidth: 130, cellEditor: "agCategoryEditor", sortable: false },
      { headerName: 'Title', field: 'title', editable: false, minWidth: 130, sortable: false },
      { headerName: 'Abbreviation', field: 'abbreviation', editable: false, minWidth: 220, sortable: false },
      { headerName: 'Office', field: 'bainOffice', editable: false, minWidth: 130, sortable: false },
      { headerName: 'Ind. Expertise', field: 'expertIndustries', minWidth: 220, cellEditor: "agIndustryEditor", sortable: false },
      { headerName: 'Client Ties', field: 'expertClients', minWidth: 220, cellEditor: "agClientEditor", sortable: false },
      {
        headerName: 'Delete',
        cellRenderer: (params) => {
          return '<div style="cursor: pointer"><i class="fas fa-trash"></i></div>';
        },
        editable: false,
        colId: '1',
        minWidth: 130,
        hide: this.isTabReadOnly
      }
    ]

    this.defaultColDef = {
      editable: false,
      resizable: true,
      suppressMenu: true,
      filter: false,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltip: (params) => {
        if (params.data) {
          if (params.column.colId == "expertName" && !params.data.isExternalEmployee) {
            return params.data.employeeCode;
          }
          else if (params.column.colId == "note") {
            return params.data.note;
          }
          else if (params.column.colId == "expertIndustries") {
            return params.data.expertIndustries;
          }
          else if (params.column.colId == "expertClients") {
            return params.data.expertClients;
          }
        }
      }
    };



  }

  onFirstDataRendered() {
    if (this.gridApi && this.columnDefs && this.columnDefs.length) {
      this.resetColumnConfig(this.isTabReadOnly)
      this.gridApi.sizeColumnsToFit();
    }
  }

  expertGroupNameChange(event) {
    if (this.poolEdit == 'Update') {
      if (this.updateExpertGroupId) {
        let expertGroup = this.deal.expertGroup.filter(x => x.expertGroupId != this.updateExpertGroupId)
        if (expertGroup.findIndex(x => String(x.expertGroupName).replace(/\s/g, "").toLowerCase().trim() == event.replace(/\s/g, "").toLowerCase().trim()) > -1) {
          this.errorMessage = "* This expert pool name already exists."
          this.isDuplicateName = true;
        }
        else {
          this.errorMessage = "";
          this.isDuplicateName = false;
        }
      }
    }
    else {
      if (this.deal.expertGroup.findIndex(x => String(x.expertGroupName).replace(/\s/g, "").toLowerCase().trim() == event.replace(/\s/g, "").toLowerCase().trim()) > -1) {
        this.errorMessage = "* This expert pool name already exists."
        this.isDuplicateName = true;
      }
      else {
        this.errorMessage = "";
        this.isDuplicateName = false;
      }
    }
  }

  setExpertGroupId() {
    this.expertGroupId = Math.max.apply(Math, this.deal.expertGroup.map(function (o) { return o.expertGroupId; }));
  }

  save() {
    if (this.poolEdit == 'Save') {
      if (this.isDuplicateName) {
        return;
      }
      else {
        if (this.dealId > 0) {
          this.expertGroup.dealId = this.dealId;
          this.expertGroup.experts = [];
          this.expertGroup.lastUpdated = new Date();
          this.deal.expertGroup.push(this.expertGroup);
          this.expertGroup.expertGroupId = this.expertGroupId + 1;
          this.currentExpertGroupId = this.expertGroup.expertGroupId;
          this.addNewExpert();
        }
        else {
          if (this.importExpert == true) {
            this.expertGroup.lastUpdated = new Date();
            this.rowData = [];
            this.expertGroup.expertGroupId = this.expertGroupId + 1;
            this.expertGroup.dealId = 0;

            // let groupCount = this.deal.expertGroup.filter(e => e.expertGroupName.split('_Imported -')[0] == this.selectedImportExpertGroup.expertGroupName);
            // let lastIndex =this.deal.expertGroup && this.deal.expertGroup.length>0? this.deal.expertGroup[this.deal.expertGroup.length-1].expertGroupName.split('_Imported - ')[1]:"0";
            // this.expertGroup.expertGroupName = groupCount.length > 0 ? this.selectedImportExpertGroup.expertGroupName + "_Imported - " +( parseInt(lastIndex?lastIndex:"0")  + 1) : this.selectedImportExpertGroup.expertGroupName;
            this.expertGroup.expertGroupName = this.selectedImportExpertGroup.expertGroupName + "-" + this.selectedImportDeal.dealId;
            if (this.selectedImportExpertGroup && this.selectedImportExpertGroup.experts) {
              
              this.selectedImportExpertGroup.experts.sort((a, b) => {
                if (a.sortOrder == b.sortOrder && (a.expertName!=null && b.expertName!=null) ) {
                  return a?.expertName > b?.expertName ? 1 : -1;                 
                }
                if(a.sortOrder != 8 && b.sortOrder !=8)
                {
                return (a.sortOrder > b.sortOrder) ? 1
                  : ((a.sortOrder < b.sortOrder) ? -1 : 0)
                }
                  }
              );            
                             
              this.selectedImportExpertGroup.experts.forEach(expert => {
                expert.categoryId = 0;
                expert.isMultipleClient = true;
                expert.categoryName = '-';
                expert.industry = (expert.industry) ? expert.industry : '';
                expert.client = (expert.client) ? expert.client : '';
                let expertName = expert?.expertName;
                if(expertName!=null)
                {
                  expert.expertName = expertName + (expert.statusCode == 'L' ? ' (Leave)' : expert.statusCode == 'T' ? ' (Terminated)' : '');

                }
                 this.rowData.push(expert);
              })
            }
            this.expertGroup.experts = this.selectedImportExpertGroup.experts;        
            this.expertGroup.expertPoolColor = this.selectedImportExpertPoolcolor;
            this.expertGroup.expertGroupCategory = this.selectedImportExpertGroup.expertGroupCategory;
            this.expertGroup.expertGroupNote = this.selectedImportNotes;
            this.expertGroup.lastUpdatedExpert = this.selectedImportExpertGroup.lastUpdatedExpert;
            this.deal.expertGroup.push(this.expertGroup);
            this.currentExpertGroupId = this.expertGroup.expertGroupId;
            let currentIndexForNewGroup = this.deal.expertGroup?.findIndex(x => x.expertGroupId === this.currentExpertGroupId);
            this.currentEditGroupIndex = currentIndexForNewGroup;
            this.expertGroup = new expertGroup();
          }
          else {
            this.expertGroup.expertGroupId = this.expertGroupId + 1;
            this.expertGroup.dealId = 0;
            this.expertGroup.experts = [];
            this.expertGroup.lastUpdated = new Date();
            this.deal.expertGroup.push(this.expertGroup);
            this.currentExpertGroupId = this.expertGroup.expertGroupId;
            let currentIndexForNewGroup = this.deal.expertGroup?.findIndex(x => x.expertGroupId === this.currentExpertGroupId);
            this.currentEditGroupIndex = currentIndexForNewGroup;
            this.expertGroup = new expertGroup();
            this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex)
            this.addNewExpert();
          }
        }
        this.addPool = false;
        this.isExpertEnabled = true;

        this.expertGroupId = this.expertGroupId + 1;
      }
    } else {
      let expertPool = this.deal.expertGroup.filter(a => a.expertGroupId == this.updateExpertGroupId);
      let expertPoolIndex = this.deal.expertGroup.indexOf(expertPool[0]);
      this.deal.expertGroup[expertPoolIndex].expertGroupName = this.expertGroup.expertGroupName;
      this.deal.expertGroup[expertPoolIndex].expertGroupNote = this.expertGroup.expertGroupNote;
      this.deal.expertGroup[expertPoolIndex].expertPoolColor = this.expertGroup.expertPoolColor;
      this.deal.expertGroup[expertPoolIndex].expertGroupCategory = this.expertGroup.expertGroupCategory;
      this.deal.expertGroup[expertPoolIndex].lastUpdated = new Date();
      this.addPool = false;
      this.isExpertEnabled = true;
      this.poolEdit = 'Save';
      this.expertGroup = new expertGroup();;
    }
    this.updateExpertGroupId = undefined;
    this.selectedImportDeal = null;
    this.selectedImportExpertGroup = null;
    this.selectedImportExpertPoolcolor = null;
    this.selectedImportNotes = null;
    this.setCotrolAccess();
  }

  addNewExpert() {
    let currentExpertGroup: expertGroup[] = this.deal.expertGroup.filter(x => x.expertGroupId == this.currentExpertGroupId);
    if (currentExpertGroup) {
      let newRow: any =
      {
        employeeCode: '',
        expertName: '',
        categoryId: 0,
        categoryName: '-',
        sortOrder: 0,
        expertise: '',
        bainOffice: '',
        title: '',
        levelName: '',
        gradeName: '',
        expertIndustries: '',
        industry: '',
        expertClients: '',
        client: '',
        note: '',
        isMultipleEmployee: false,
        isMultipleClient: true,
        expertState: 0,
        filterState: 0,
        isExternalEmployee: false,
        employee: null
      }
      this.rowData.push(newRow);

      if (this.gridApi) {
        var res = this.gridApi.applyTransaction({ add: [newRow] });
        var params = { force: true, rowNode: res };
        this.gridApi.refreshCells(params);
        this.gridApi.refreshClientSideRowModel();
      }
    }
  }  
  getExperts(uid: number, index: number) {
    this.rowData = [];
    this.isExpertEnabled = true;
    this.currentExpertGroupId = uid;
    this.currentEditGroupIndex = index;
    let currentExperts: any[] = this.deal.expertGroup?.filter(a => a.expertGroupId == this.currentExpertGroupId);
    if (currentExperts && currentExperts.length > 0 && currentExperts[0].experts != undefined && currentExperts[0].experts != null && currentExperts[0].experts.length > 0) {
      currentExperts[0].experts = currentExperts[0].experts.
        filter(a => a.employeeCode != '' && a.employeeCode != null && a.employeeCode != undefined);
         currentExperts[0].experts.sort((a, b) => {
        if (a.sortOrder == b.sortOrder && (a.expertName!=null && b.expertName!=null)) {          
            return a?.expertName > b?.expertName ? 1 : -1; 
        }
        if(a.sortOrder != 8 && b.sortOrder !=8)
        {         
          return (a.sortOrder > b.sortOrder) ? 1
          : ((a.sortOrder < b.sortOrder) ? -1 : 0)
        }
        }
      );         
        currentExperts[0].experts.forEach((element) => {
        if (element != undefined) {
          element.isMultipleClient = true;

          let expertName = element.expertName;
          if ( element.expertName != null && !element.expertName.includes('(Leave)') && !element.expertName.includes('(Terminated)')) {
            element.expertName = expertName + (element.statusCode == 'L' ? ' (Leave)' : element.statusCode == 'T' ? ' (Terminated)' : '');
          }
          else {
            element.expertName = expertName;
          }
          element.oldEmployee = {};
          element.oldEmployee.employeeCode = element.employeeCode;
          element.oldEmployee.searchableName = element.expertName;
          if (element.categoryName == "")
            element.categoryName = "-";
          this.rowData.push(element);
          
        }
      })
     
      if (this.gridApi) {
        var params = { force: true, rowNode: this.rowData };
        this.gridApi.refreshCells(params);
      }
    }  
  }
  
  resetRowDataForEmployee(employee: any, index: any) {
    this.rowData[index].oldEmployee = {};
    this.rowData[index].oldEmployee = employee;
  }

  deleteExpertsfromClientAllocations(employee: string) {

    // remove from client allocation
    this.deal.clientAllocations = this.deal.clientAllocations.filter(e => e.employeeCode != employee);

    //Method to delete allocation for experts
    this.deal.clients.forEach((element) => {
      if (element.committed && element.committed.length > 0 && element.committed.findIndex(a => a.employeeCode == employee) > -1) {
        element.committed = element.committed.filter(a => a.employeeCode != employee);
      }
      if (element.heardFrom && element.heardFrom.length > 0 && element.heardFrom.findIndex(a => a.employeeCode == employee) > -1) {
        element.heardFrom = element.heardFrom.filter(a => a.employeeCode != employee);

      }
      if (element.nextCall && element.nextCall.length > 0 && element.nextCall.findIndex(a => a.employeeCode == employee) > -1) {
        element.nextCall = element.nextCall.filter(a => a.employeeCode != employee);
      }
      if (element.ovp && element.ovp.length > 0 && element.ovp.findIndex(a => a.employeeCode == employee) > -1) {
        element.ovp = element.ovp.filter(a => a.employeeCode != employee);
      }

    })
  }

  chechForDublicateExperts(employee: string) {
    return this.rowData.some(e => e.employeeCode == employee)
  }

  revertExpert(Employee, currIndex) {
    if (Employee != null && Employee != undefined && Employee != '') {
      this.rowData = this.rowData.filter(a => a.employeeCode != Employee);

    }
  }

  AssignExpertNametoObject() {
    this.rowData.map(res => {
      if (typeof res.expertName == 'object' && res.expertName != null) {
        res.expertName = res.expertName.searchableName;
      }
    })
  }

  PushRowDataToMainObject() {
    this.deal.expertGroup.forEach(res => {
      if (res.expertGroupId == this.currentExpertGroupId) {
        res.experts = this.rowData
      }
    });
    this.dealService.switchTab.next('allocation');
  }

  refreshRowData() {
    let params = { force: true, rowNode: this.rowData };
    this.gridApi.refreshCells(params);
    this.gridApi.refreshClientSideRowModel();
  }

  isDuplicateExpert(employeeCode) {
    let len = this.rowData.filter(ele => ele.employeeCode == employeeCode).length
    if (len > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  setRvertedObject(event) {
    // Update new expert to row data
    if (event.newValue != null) {
      // when user clicks on cross and re enters the
      this.rowData[event.rowIndex] = event.data;
    }
    else {
      //when user click cross and resets the row data to blank node
      this.rowData[event.rowIndex] = this.getBlankNode();
    }
  }

  getBlankNode() {
    let Node = this.gridApi.getRowNode(this.oldNodeId)
    Node.data = {}
    Node.data.employeeCode = '';
    Node.data.expertName = '';
    Node.data.categoryId = 0;
    Node.data.categoryName = '-';
    Node.data.sortOrder = '';
    Node.data.expertise = '';
    Node.data.bainOffice = '';
    Node.data.title = '';
    Node.data.levelName = '';
    Node.data.gradeName = '';
    Node.data.expertIndustries = '';
    Node.data.expertIndustries = '';
    Node.data.industry = '';
    Node.data.expertClients = '';
    Node.data.client = '';
    Node.data.note = '';
    Node.data.isMultipleEmployee = false;
    Node.data.isMultipleClient = true;
    Node.data.expertState = 0;
    Node.data.filterState = 0;
    Node.data.isExternalEmployee = false;
    Node.data.employee = {};
    return Node.data;
  }
  onCellValueChanged(event) {
    if (event.column.colDef.field == 'expertName') {
      let currentEmployeeCode = event.data.employeeCode;
      let otherPools = this.deal.expertGroup.filter(a => a.expertGroupId != this.currentExpertGroupId);
      let employeeinOtherPools: number = 0;

      let oldExpertCode: string;
      let oldExpertName: string;
      let oldExpert: any;

      if (event.newValue) {
        oldExpertCode = this.rowData[event.rowIndex].oldEmployee != undefined ? this.rowData[event.rowIndex].oldEmployee.employeeCode : '';
        oldExpertName = this.rowData[event.rowIndex].oldEmployee != undefined ? this.rowData[event.rowIndex].oldEmployee.searchableName : '';
        oldExpert = this.rowData[event.rowIndex].oldEmployee;
        if (typeof (event.newValue) == 'object') {
          this.resetRowDataForEmployee(event.newValue, event.rowIndex);
        }
        else {
          return;
        }

      } else {
        oldExpertCode = event.data.oldEmployee != undefined ? event.data.oldEmployee.employeeCode : '';
        oldExpertName = event.data.oldEmployee != undefined ? event.data.oldEmployee.searchableName : '';
        oldExpert = event.data;

      }

      otherPools.forEach((element) => {
        if (element.experts && element.experts.length > 0 && element.experts.filter(e => (e != null) && (e.employeeCode == oldExpertCode)).length > 0) {
          employeeinOtherPools = employeeinOtherPools + 1;
        }
      })

      // Adding expert to row data
      this.rowData[event.rowIndex] = event.data;

      // Check for duplicate
      if (this.isDuplicateExpert(currentEmployeeCode)) {
        if (oldExpertCode != '') {
          var rowNode = this.gridApi.getRowNode(this.oldNodeId);
          if (rowNode) {
            rowNode.setData(this.oldNode);
            var params = { force: true, rowNode: rowNode };
            this.gridApi.refreshCells(params);
            this.AssignExpertNametoObject()
            this.rowData[event.rowIndex] = this.oldNode;
          }
        } else {
          this.rowData[event.rowIndex] = this.getBlankNode();
          this.refreshRowData();
        }

        this.PushRowDataToMainObject();
        if (event.data.expertData != undefined)
          this.tostreService.showWarning('The expert ' + (event.data.expertData != undefined ? event.data.expertData.searchableName : '') + 'already exist in this group.', 'Alert')

      } else {
        if (oldExpertCode != undefined && oldExpertCode.trim() != '') {
          //Update expert row

          if (event.column.colDef.field == 'expertName') {
            if (employeeinOtherPools == 0) {
              if (this.isExpertIsAllocated(this.deal, oldExpertCode)) {

                // Set modal config
                const initialState = {
                  data: 'This action will delete the allocation for ' + oldExpertName + '. Would you like to continue?',
                  title: 'Confirmation'
                };

                this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState, backdrop: "static", keyboard: false });


                this.bsModalRef.content.closeBtnName = 'Close';

                this.bsModalRef.content.event.subscribe(a => {
                  if (a == 'reset') {
                    // User selects yes 
                    this.deleteExpertsfromClientAllocations(oldExpertCode);
                    this.setRvertedObject(event);
                    this.AssignExpertNametoObject()
                    this.refreshRowData();
                  } else {
                    // User selects No 
                    var rowNode = this.gridApi.getRowNode(this.oldNodeId);
                    if (rowNode) {
                      rowNode.setData(this.oldNode);
                      var params = { force: true, rowNode: rowNode };
                      this.gridApi.refreshCells(params);
                      this.AssignExpertNametoObject()
                      this.rowData[event.rowIndex] = this.oldNode;
                    }
                  }
                  this.PushRowDataToMainObject()
                })
              } else {
                this.setRvertedObject(event);
                this.AssignExpertNametoObject()
                this.refreshRowData();
                this.PushRowDataToMainObject()
              }
            } else {
              this.setRvertedObject(event);
              this.AssignExpertNametoObject()
              this.refreshRowData();
              this.PushRowDataToMainObject()
            }
          }
        }
        else {
          // Insert new expert row
          if (event.newValue == null) {
            // item is canceled, remove data from row data
            this.rowData[event.rowIndex] = this.getBlankNode();
            this.refreshRowData();
          }

          //End: Adding expert to row data

          // Assigning expert name to object
          this.AssignExpertNametoObject()

          //Refresh Row Data
          this.refreshRowData();

          //Push Data to main object
          this.PushRowDataToMainObject()

        }

      }

      // }
    }
    else if (event.column.colDef.field == 'categoryName') {
      if (event.data.employeeCode) {
        if (event.data.categoryName == "")
          event.data.categoryName = "-";
        this.deal.clients.forEach(client => {
          client.committed.forEach(commited => {
            if (commited.employeeCode == event.data.employeeCode) {
              commited.categoryId = event.data.categoryId
              commited.categoryName = event.data.categoryName

            }
          })
          client.heardFrom.forEach(heardForm => {
            if (heardForm.employeeCode == event.data.employeeCode) {
              heardForm.categoryId = event.data.categoryId
              heardForm.categoryName = event.data.categoryName
              heardForm.sortOrder = event.data.sortOrder
            }
          })
          client.nextCall.forEach(nextCall => {
            if (nextCall.employeeCode == event.data.employeeCode) {
              nextCall.categoryId = event.data.categoryId
              nextCall.categoryName = event.data.categoryName
              nextCall.sortOrder = event.data.sortOrder
            }
          })

        })
      }

    }
    else if (event.column.colDef.field == 'note') {
      if (event.data.employeeCode) {
        this.deal.clients.forEach(client => {
          client.committed.forEach(commited => {
            if (commited.employeeCode == event.data.employeeCode) {
              commited.note = event.data.note
            }
          })
          client.heardFrom.forEach(heardForm => {
            if (heardForm.employeeCode == event.data.employeeCode) {
              heardForm.note = event.data.note
            }
          })
          client.nextCall.forEach(nextCall => {
            if (nextCall.employeeCode == event.data.employeeCode) {
              nextCall.note = event.data.note
            }
          })

        })
      }
    }

  }

  isExpertIsAllocated(dealData: deals, expert): boolean {
    let allocationExists: boolean = false;
    if (expert != undefined && expert != null) {
      if (dealData.clientAllocations.findIndex(a => a.employeeCode == expert) > -1) {
        allocationExists = true;
      }

      for (let i = 0; i < dealData.clients.length; i++) {

        let allocation = dealData.clients[i].committed.concat(dealData.clients[i].heardFrom, dealData.clients[i].nextCall, dealData.clients[i].ovp);

        let isAllocated = allocation.find(e => e.employeeCode == expert);
        if (isAllocated != undefined) {
          allocationExists = true;
        }
      }


      return allocationExists;
    }
  }

  getInfoText(infoText: any) {
    if (infoText?.lastUpdatedExpert) {
      let info = [];
      if (infoText.lastUpdatedExpert != "0001-01-01T00:00:00Z") {
        info.push('Last Updated: ' + moment(infoText.lastUpdatedExpert).format('DD-MMM-YYYY')) + '\n';
      }
      info.push(infoText.expertGroupNote);
      return info;
    } else if (infoText) {
      return infoText?.expertGroupNote?[infoText.expertGroupNote]:[infoText];
    }
  }

  delete(id, type) {
    if (type == 'pool') {
      let expertGroup = this.deal.expertGroup.filter(a => a.expertGroupId == id);
      let otherPools = this.deal.expertGroup.filter(a => a.expertGroupId != id);
      let employeeinOtherPools: number = 0;

      if (expertGroup[0].experts.length == 0) {
        this.deal.expertGroup = this.deal.expertGroup.filter(a => a.expertGroupId != id);
        if (this.deal.expertGroup[0]) {
          this.currentExpertGroupId = this.deal.expertGroup[0].expertGroupId;
          this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex);
        }
        else {
          this.rowData = [];
          this.addPool = true;
        }
      }
      if (expertGroup && expertGroup[0].experts && expertGroup[0].experts.length > 0) {
        let allocatedExperts: number = 0;
        let expertsToBeRemoved: string = '';
        expertGroup[0].experts.forEach((element) => {
          //Fetching allocations
          let isExpertAllocated = this.isExpertIsAllocated(this.deal, element.employeeCode);
          //check if exists in another pool
          if (otherPools.length > 0) {
            let pools = otherPools.filter(x => x.experts.some(s => s.employeeCode == element.employeeCode));
            if ((!pools || pools.length == 0) && isExpertAllocated) {
              expertsToBeRemoved += element.expertName + '; ';
              allocatedExperts = allocatedExperts + 1;
            }
          }
          else if (isExpertAllocated) {
            expertsToBeRemoved += element.expertName + '; ';
            allocatedExperts = allocatedExperts + 1;
          }

        })
        //case1:If one or more then one is allocated
        if (allocatedExperts > 0) {
          let message = (expertGroup[0].experts.length != allocatedExperts) ? expertsToBeRemoved +
            'will be removed from their allocations. Would you like to continue?' :
            'Experts associated with only this pool will be removed from their allocations. Would you like to continue?'

          const initialState = {
            data: message,
            title: 'Confirmation'
          };
          this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
          this.bsModalRef.content.closeBtnName = 'Close';

          this.bsModalRef.content.event.subscribe(a => {
            if (a == 'reset') {
              this.deal.expertGroup = this.deal.expertGroup.filter(a => a.expertGroupId != id);
              if (this.deal.expertGroup[0]) {
                this.currentExpertGroupId = this.deal.expertGroup[0].expertGroupId;
                this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex);
              }
              else {
                this.rowData = [];
                this.addPool = true;
              }
              expertGroup[0].experts.forEach((expert) => {
                if (otherPools.length > 0) {
                  otherPools.forEach((element) => {
                    if (element.experts.filter(e => e != null && e.employeeCode == expert.employeeCode).length == 0) {
                      this.deleteExpertsfromClientAllocations(expert.employeeCode);
                    }

                  })
                }
                else {
                  this.deleteExpertsfromClientAllocations(expert.employeeCode);
                }
              })
            }
          })
        }
        else {
          this.deal.expertGroup = this.deal.expertGroup.filter(a => a.expertGroupId != id);
          if (this.deal.expertGroup[0]) {
            this.currentExpertGroupId = this.deal.expertGroup[0].expertGroupId;
            this.getExperts(this.currentExpertGroupId, this.currentEditGroupIndex);
          }
          else {
            this.rowData = [];
            this.addPool = true;
          }
        }
      }
    } else if (type == 'expert') {
      let expertPool = this.deal.expertGroup.filter(a => a.expertGroupId == this.currentExpertGroupId);
      let otherPools = this.deal.expertGroup.filter(a => a.expertGroupId != this.currentExpertGroupId);
      let expertPoolIndex = this.deal.expertGroup.indexOf(expertPool[0]);
      let expert: Expert[] = this.deal.expertGroup[expertPoolIndex].experts.filter(a => a.employeeCode == id);
      let employeeinOtherPools: number = 0;
      
      if(expert[0].expertName !=null)
      {
      otherPools.forEach((element) => {
        if (element.experts.filter(e => e.employeeCode == id).length > 0) {
          employeeinOtherPools = employeeinOtherPools + 1;
        }
      })

      if (employeeinOtherPools > 0) {
        this.deal.expertGroup[expertPoolIndex].experts = this.deal.expertGroup[expertPoolIndex].experts.filter(a => a.employeeCode != id);
        this.rowData = this.rowData.filter(a => a.employeeCode != id);
      }
      else {

        if (expert && expert.length > 0) {
          if (this.isExpertIsAllocated(this.deal, expert[0].employeeCode)) {
            const initialState = {
              data: 'This action will delete the allocation for ' + expert[0].expertName + '. Would you like to continue?',
              title: 'Confirmation'
            };
            this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
            this.bsModalRef.content.closeBtnName = 'Close';

            this.bsModalRef.content.event.subscribe(a => {
              if (a == 'reset') {
                this.deal.expertGroup[expertPoolIndex].experts = this.deal.expertGroup[expertPoolIndex].experts.filter(a => a.employeeCode != id);
                this.rowData = this.rowData.filter(a => a.employeeCode != id);

                this.deleteExpertsfromClientAllocations(id);


              }
            })
          }
          else {
            this.deal.expertGroup[expertPoolIndex].experts = this.deal.expertGroup[expertPoolIndex].experts.filter(a => a.employeeCode != id);
            this.rowData = this.rowData.filter(a => a.employeeCode != id);
          }
        }
        else {
          this.deal.expertGroup[expertPoolIndex].experts = this.deal.expertGroup[expertPoolIndex].experts.filter(a => a.employeeCode != id);
          this.rowData = this.rowData.filter(a => a.employeeCode != id);
        }

      }
    }
    else {
      this.deal.expertGroup[expertPoolIndex].experts = this.deal.expertGroup[expertPoolIndex].experts.filter(a => a.employeeCode != id);
      this.rowData = this.rowData.filter(a => a.employeeCode != id);
    }

    }
  }

  onCellClicked(object) {
    if (object.column.colDef.headerName == 'Delete') {
      this.delete(object.data.employeeCode, 'expert');
    }
  }

  editExpertPool(poolData) {
    this.cancel();
    this.getExperts(poolData.expertGroupId, this.currentEditGroupIndex)
    this.enableImport = false;
    this.addPool = true;
    this.poolEdit = 'Update';
    this.expertGroup.expertGroupName = poolData.expertGroupName;
    this.expertGroup.expertGroupNote = poolData.expertGroupNote;
    this.expertGroup.expertPoolColor = poolData.expertPoolColor;
    this.expertGroup.expertGroupCategory = poolData.expertGroupCategory;
    this.updateExpertGroupId = poolData.expertGroupId;

  }

  refreshGrid() {
    var params = { force: true };
    this.gridApi.refreshCells(params);
  }

  cancel() {
    this.errorMessage = "";
    this.expertGroup.expertGroupName = "";
    this.expertGroup.expertGroupNote = "";
    this.expertGroup.expertPoolColor = null;
    this.expertGroup.expertGroupCategory = null;
    this.selectedImportDeal = null;
    this.selectedImportExpertGroup = null;
    this.selectedImportExpertPoolcolor = null;
    this.selectedImportNotes = null;
    this.setCotrolAccess();
    this.poolEdit = 'Save';
    this.addPool = false;

  }

  setNewPool() {
    if (this.addPool == false) {
      this.addPool = true;
      if (this.core.loggedInUser.securityRoles.some(e => e.id == RoleType.MultibidderManager || e.id == RoleType.TSGSupport || e.id == RoleType.PEGAdministrator || e.id == RoleType.PracticeAreaManagerRestricted || e.id == RoleType.PAM)) {
        this.enableImport = true;
      }
    }
    else {
      this.addPool = false;
    }
  }

  clearItems() {
    // this.selectedDeal = null;
    this.dealList = [];
    // this.selectedImportDeal = null;
    // this.selectedImportExpertGroup = null;
    // this.selectedImportExpertPool = null;
    // this.selectedImportNotes = null;
    // this.bulkUpdateForm.reset();
  }

  expertGroupChange(event) {
    let expGrp = this.deal.expertGroup.filter(e => e?.expertGroupName == event?.expertGroupName + "-" + this.selectedImportDeal.dealId);
    if (expGrp && expGrp.length == 0) {   
      this.selectedImportExpertPoolcolor = (event) ? event.expertPoolColor : null;     
      this.selectedImportNotes = (event) ? event.expertGroupNote : '';    
      this.errorMessage = "";
      this.isDuplicateName = false;

    } else {
      this.isDuplicateName = true;
      this.errorMessage = "* This expert pool name already exists."

    }

  }
  onImportPoolColorChange(event) {
    this.setCotrolAccess();
    this.selectedImportExpertPoolcolor = event;
  }

  setCotrolAccess() {
    if (this.selectedImportDeal || this.selectedImportExpertGroup || this.selectedImportExpertPool || this.selectedImportNotes) {
      this.disableNew = true;
      this.importExpert = true;
    }
    else {
      this.disableNew = false;
      this.importExpert = false;
    }

    if (this.expertGroup.expertGroupName || this.expertGroup.expertGroupCategory || this.expertGroup.expertPoolColor || this.expertGroup.expertGroupNote) {
      this.disableImportPool = true;
      this.importExpert = false;
    }
    else {
      this.disableImportPool = false;
      this.importExpert = true;
    }
  }

  onTrackerSelectionChanged(event) {
    this.selectedImportExpertGroup = undefined;
    this.selectedImportExpertPoolcolor = undefined;
    this.selectedImportNotes = "";
     this.setCotrolAccess();
    this.settingNotesValue();
  }

  settingNotesValue() {
    // Setting pretext in expert notes
    if (this.selectedImportDeal && this.selectedImportDeal.expertGroups) {
      this.selectedImportDeal.expertGroups.forEach(grp => {
        let groupName = "";
       groupName = grp.expertGroupNote == null ? grp.expertGroupNote = '' : grp.expertGroupNote
        grp.expertGroupNote = "(Imported, Tracker ID - "+  this.selectedImportDeal.dealId +") " + groupName;
      
      });
    }
  }


  addDropZones(params: GridReadyEvent) {
    var tileContainer = document.querySelector('.tile-container') as any;

    var dropZone: RowDropZoneParams = {
      getContainer: () => {
        return tileContainer as any;
      },
      onDragStop: (params) => {
        let result = params.node.data;
        let currentEmployeeCode = result?.employeeCode;
        let len = this.deal.expertGroup.find(x => x.expertGroupId == this.hoverExpertGroupId).experts.filter(ele => ele.employeeCode == currentEmployeeCode).length


        if (currentEmployeeCode != undefined && currentEmployeeCode != "") {
          if (len >= 1) {
            this.tostreService.showWarning('The expert ' + (result != undefined ? result.expertName : '') + ' already exist in this group.', 'Alert')
          }
          else {
            this.deal.expertGroup.find(x => x.expertGroupId == this.hoverExpertGroupId).experts.push(result);



            if (this.gridApi) {
              this.rowData = this.rowData.filter(a => a.employeeCode != '' && a.employeeCode != null && a.employeeCode != undefined && a.employeeCode != currentEmployeeCode);
              this.deal.expertGroup[this.currentEditGroupIndex].experts = this.deal.expertGroup[this.currentEditGroupIndex].experts.filter(a => a.employeeCode != '' && a.employeeCode != null && a.employeeCode != undefined && a.employeeCode != currentEmployeeCode);
              let params = { force: true, rowNode: this.rowData };
              this.gridApi.refreshCells(params);
            }
          }
        }
      },
    };
    params.api.addRowDropZone(dropZone);

  }

  draggedOnGroup(i) {
       this.hoverExpertGroupId = this.deal.expertGroup[i].expertGroupId;

  }
  clickOnPool(event ,group,uid: number, index: number,deal){
    if (event.ctrlKey) {
      if (group.isRowSelected == undefined) {
        group.isRowSelected = true;
      }
      else {
        group.isRowSelected = !group.isRowSelected;
      }
    } else {
      deal?.expertGroup.forEach(element => {
        if (element.hasOwnProperty('isRowSelected')) {
          delete element?.isRowSelected;
        }
      });
      this.getExperts(uid, index)
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
      if (!event.ctrlKey && !this.isRightClick ) {
       let deal =this.deal as any;
      deal?.expertGroup.forEach(element => {
        if(element.hasOwnProperty('isRowSelected'))
         {
            delete element?.isRowSelected;       
        }      
       }); 
    }
  }
  openInOutlook() {
    this.isRightClick=true;
    let deal =this.deal as any;
    let expertGroupList: any[] = [];
    deal?.expertGroup.forEach(element => {

        if ( element.hasOwnProperty('isRowSelected') && element.isRowSelected == true) {
           expertGroupList.push(element)
           delete element?.isRowSelected;  
        }
     
    });
     if(expertGroupList && expertGroupList.length>0)
    {
      var body ="";
    
      expertGroupList.forEach(item => {
       let expertGroupName=  item?.expertGroupName;
       let expertGroupCategoryName = item?.expertGroupCategory?.categoryName
       if (expertGroupCategoryName && expertGroupCategoryName  != ""  ) { expertGroupName += " - " +expertGroupCategoryName ; }
       var table ="<div> <table  style= \"border: 1px solid black;  border-collapse: collapse;\">"
       + "<tr><th style= \"border: 1px solid black; padding:5px\">"+"Expert Name"+"</th>"
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Office"+"</th>"
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Title"+"</th>" 
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Cat of Expertise"+"</th>" 
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Notes"+"</th></tr>" 

       item?.experts?.forEach (expertItem=>{
        let expertName= expertItem?.expertName !=null ? expertItem?.expertName:"";
        let office=expertItem?.bainOffice!=null ? expertItem?.bainOffice:"";
        let abbreviation = expertItem?.abbreviation !=null? expertItem?.abbreviation:"";        
        let categoryName=expertItem?.categoryName !=null ? expertItem?.categoryName:"";
        let note=expertItem?.note !=null ? expertItem?.note:"";
        table+="<tr>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+expertName+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+office+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+abbreviation+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+categoryName+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+note+"</td></tr>";
       });
       table +="</table></div>";

       body += "<div><b>" + expertGroupName+ "</b></div>";
       body  += "<br>";
       body+=table;
       body  += "<br>";
      })
      
      const handleCopy = CommonMethods.copyToClipboard("<div>" + body + "</div>")
       
      var subject = "Experts Overview";
      let mailText = "mailto:?subject=" + subject + "&body=" + "Note: Press Ctrl+V to paste the copied data"; // add the links to body
      window.open(mailText, "_blank");
      this.isRightClick=false;
    }
    else {
      this.tostreService.showWarning("Please select atleast one expert pool row", "Please select a expert pool row")
    }
  }
}



