import { Component, OnInit, Input, Output, EventEmitter, Inject, LOCALE_ID, OnChanges, SimpleChanges } from '@angular/core';
import { GridOptions, GridApi, ColDef, ExcelExportParams, ProcessCellForExportParams } from 'ag-grid-community';
import { EmployeeEditorComponent } from '../../../shared/grid-editor/employee-editor/employee-editor.component';
import { DealClient } from './dealClient';
import { ClientEditorComponent } from '../../../shared/grid-editor/client-editor/client-editor.component';
import { deals, dealStatus } from '../../deal';
import { Client } from '../../../shared/interfaces/client';
import { StageEditorComponent } from '../../../shared/grid-editor/stage-editor/stage-editor.component';
import { StatusEditorComponent } from '../../../shared/grid-editor/status-editor/status-editor.component';
import { DealsService } from '../../deals.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { DateEditorComponent } from '../../../shared/grid-editor/date-editor/date-editor.component';
import { FormatTimeZone } from '../../../shared/formatTimeZone.pipe';
import { NumericCellEditorComponent } from '../../../../app/shared/grid-editor/numeric-cell-editor/numeric-cell-editor.component';
import { WorkTypeEditorComponent } from '../../..//shared/grid-editor/work-type-editor/work-type-editor.component';
import { SingleDateEditorComponent } from '../../../shared/grid-editor/single-date-editor/single-date-editor.component';
import { BooleanCellEditorComponent } from '../../../shared/grid-editor/boolean-cell-editor/boolean-cell-editor.component';
import { CommonMethods } from '../../../shared/common/common-methods';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { OfficeEditorComponent } from '../../../shared/grid-editor/office-editor/office-editor.component';
import { RoleType } from '../../../shared/enums/role-type.enum';
import { RegistrationStatus } from '../../../shared/enums/registration-status.enum'
import { CoreService } from '../../../core/core.service';
import { PagesTypes } from '../../../shared/enums/page-type.enum';
import { GridColumn } from '../../../shared/interfaces/grid-column.interface';
import { DealGridColumnService } from '../../../shared/grid-generator/deal-grid-column.service';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { GlobalService } from '../../../global/global.service';
import { RegistrationStageEnum } from '../../../shared/enums/registration-stage.enum';
import { CaseEditorComponent } from '../../../shared/grid-editor/case-editor/case-editor.component';
import { Office } from '../../../shared/interfaces/office';
import { ExpectedStartEditorComponent } from '../../../shared/grid-editor/expected-start-editor/expected-start-editor.component';
import { IconsRendererComponent } from '../../../shared/icons-renderer/icons-renderer.component';
import { PipelineStatusEditorComponent } from '../../../shared/grid-editor/pipelineStatus-editor/pipelineStatus-cell.component';
import { DealLikelihoodEditorComponent } from '../../../shared/grid-editor/dealLikelihood-editor/dealLikelihood.component';
import { dealMBStatus } from '../../../shared/enums/deal-mbStatus.enum';

@Component({
  selector: 'app-deal-clients',
  templateUrl: './deal-clients.component.html',
  styleUrls: ['./deal-clients.component.scss']
})
export class DealClientsComponent implements OnInit, OnChanges {
  @Input()
  deal: deals;

  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;

  @Output()
  public emitUpdatedRegistration = new EventEmitter();
  @Output()
  public emitUpdatedStatus = new EventEmitter();

  gridApi: GridApi;
  columnDefs: ColDef[];
  rowData = [];
  defaultColDef;
  currentClientId: number;
  dealClientId: number = 0;
  bsModalRef: BsModalRef;
  private popupParent;
  selectedDealClientId: number;
  _formatTimeZone: FormatTimeZone;
  private components;
  private suppressKeyboardEvent;
  public bainOffices: Office[];

  gridOptions: GridOptions = {
    rowHeight: 40,
    headerHeight: 40,
    onFirstDataRendered: this.onFirstDataRendered.bind(this),
    onGridReady: this.onGridReady.bind(this),
    suppressCsvExport: true,
    suppressContextMenu: true,
    frameworkComponents: {
      agEmployeeEditor: EmployeeEditorComponent,
      agClientEditor: ClientEditorComponent,
      agStageEditor: StageEditorComponent,
      agStatusEditor: StatusEditorComponent,
      agDateEditor: DateEditorComponent,
      agSingleDateEditor: SingleDateEditorComponent,
      agWorkTypeEditor: WorkTypeEditorComponent,
      agPubliclyTradedEditor: BooleanCellEditorComponent,
      agOfficeEditor: OfficeEditorComponent,
      numericCellEditor: NumericCellEditorComponent,
      agCaseEditor: CaseEditorComponent,
      PipelineStatusEditorComponent: PipelineStatusEditorComponent,
      ExpectedStartEditorComponent: ExpectedStartEditorComponent,
      iconsRendererComponent: IconsRendererComponent
    },
    onCellClicked: this.onCellClicked.bind(this),
    stopEditingWhenGridLosesFocus: false,
    excelStyles: [
      {
        id: "dateFormat",
        dataType: "DateTime",
        numberFormat: { format: "dd-mmm-yyyy;@" }
      }
    ]
  };


  constructor(public dealService: DealsService, private modalService: BsModalService, @Inject(LOCALE_ID) private locale: string,
    private coreService: CoreService, public registrationService: RegistrationService, public dealGridService: DealGridColumnService,
    public gloablService: GlobalService) {
    this.popupParent = document.querySelector('body');
    // this.components = {
    //   numericCellEditor: NumericCellEditor.getNumericCellEditor()
    // };

    this.suppressKeyboardEvent = function (params) {
      var KEY_TAB = 9;
      var keysToSuppress = [
        KEY_TAB,
      ];
      var event = params.event;
      var key = event.which;
      var suppress = keysToSuppress.indexOf(key) >= 0;
      return suppress;
    };

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deal && changes.deal.currentValue) {
      if (changes.deal.currentValue.dealId > 0) {
        this.rowData = this.rowData.filter(x => x.client != undefined && x.client.clientName != undefined && x.client.clientName.trim() != '');
        this.refreshCells();
        this.selectedDealClientId = 0;
      }
    }
    else if (changes.isTabReadOnly && changes.isTabReadOnly.currentValue != undefined) {
      this.resetColumnConfig(changes.isTabReadOnly.currentValue)

    }
  }
  onFirstDataRendered() {
    if (this.gridApi && this.columnDefs && this.columnDefs.length) {
      this.resetColumnConfig(this.isTabReadOnly)
    }
  }

  resetColumnConfig(value) {
    var oldColumnDef = this.columnDefs;
    oldColumnDef.forEach(oldColumn => {
      if (this.editableField.some(x => x == oldColumn['field'])) {
        if (oldColumn['field'] == 'clientName' || oldColumn['field'] == 'typeOfWork' || oldColumn['field'] == 'statusTypeName') {
          oldColumn['editable'] = ((params) => { if (this.isTabReadOnly) { return false; } else if (params.data.registrationId > 0) { return false; } else { return true; } })
        } else if (oldColumn['field'] == 'stageTypeName') {
          oldColumn['editable'] = ((params) => {
            if (this.isTabReadOnly) { return false; }
            else if (params.data.registrationId > 0 && this.coreService.loggedInUser.securityRoles.some(role => (role.id != RoleType.MultibidderManager && role.id != RoleType.TSGSupport && role.id != RoleType.PEGAdministrator))) { return false; }
            else if (params.data.registrationStatus != null) {
              if (((params.data.registrationStatus.registrationStatusId == RegistrationStatus.Conflicted && params.data.registrationId > 0)
                || (params.data.registrationStatus.registrationStatusId == RegistrationStatus.Duplicate && params.data.registrationId > 0))
                && this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.MultibidderManager))) { return false; }
              else { return true; }
            }
            else { return true; }
          })
        }
        else if (oldColumn['field'] == 'expectedStart') {

          oldColumn['editable'] = ((params) => {
            if (this.isTabReadOnly) { return false; }
            else if (params.data.registrationId > 0) {

              return true;

            }
            else {
              return false
            }

          })

        }

        else {
          oldColumn['editable'] = !value;
        }
      }
    });
    oldColumnDef.forEach(oldColumn => {
      if (this.hiddenField.some(x => x == oldColumn['colId'])) {
        oldColumn['hide'] = value;
      }

    });
    this.gridApi.setColumnDefs(oldColumnDef);
  }

  ngOnInit() {
    this.rowData = [];

    this.defaultColDef = {
      editable: false,
      resizable: true,
      suppressMenu: true,
      filter: false,
      floatingFilterComponentParams: { suppressFilterButton: true },

      tooltip: (params) => {
        if (params.data) {
          if (params.column.colId == "notes") {
            return params.data.notes;
          }
          else if (params.column.colId == "dealThesis") {
            return params.data.dealThesis;
          }
          else if (params.column.colId == "seekingExpertise") {
            return params.data.seekingExpertise;
          }
          else if (params.column.colId == "agClientHeads") {
            let clientHeads: string = "";
            if (params.data.clientHeads)
              params.data.clientHeads.forEach(element => {
                if (clientHeads)
                  clientHeads += "; ";

                clientHeads += element.lastName + ', ' + (element.familiarName ? element.familiarName : element.firstName) + ' (' + element.officeAbbreviation + ')-' + element.employeeCode;
              });

            return clientHeads;
          }
          else if (params.column.colId == "agClientSectorLeads") {
            let hoverText: string = "";
            if (params.data.clientSectorLeads)
              params.data.clientSectorLeads.forEach(element => {
                if (hoverText)
                  hoverText += "; ";

                hoverText += element.lastName + ', ' + (element.familiarName ? element.familiarName : element.firstName) + ' (' + element.officeAbbreviation + ')-' + element.employeeCode;
              });

            return hoverText;
          }
          else if (params.column.colId == "agOthersInvolved") {
            let hoverText: string = "";
            if (params.data.othersInvolved)
              params.data.othersInvolved.forEach(element => {
                if (hoverText)
                  hoverText += "; ";

                hoverText += element.lastName + ', ' + (element.familiarName ? element.familiarName : element.firstName) + ' (' + element.officeAbbreviation + ')-' + element.employeeCode;
              });

            return hoverText;
          }
          else if (params.column.colId == "agSVP") {
            let hoverText: string = "";
            if (params.data.svp)
              params.data.svp.forEach(element => {
                if (hoverText)
                  hoverText += "; ";

                hoverText += element.lastName + ', ' + (element.familiarName ? element.familiarName : element.firstName) + ' (' + element.officeAbbreviation + ')-' + element.employeeCode;
              });

            return hoverText;
          }
          else if (params.column.colId == "agProjectLead") {
            if (params.data.projectLead) {
              let employee = params.data.projectLead;
              return employee.employeeCode;
            }
          }
          else if (params.column.colId == "registrationSubmittedBy") {
            return params.data.registrationSubmitterEcode;
          }
        }
      }
    };



  }
  onEditDeal() {
    this.dealService.editDeal.subscribe(res => {
      if (res != null && res.clients != null && res.clients.length > 0) {
        this.rowData = [];
        for (let i = 0; i < res.clients.length; i++) {
          let tmpRow: any = res.clients[i];
          res.clients[i].tmpDealClientId = i;
          res.clients[i].dealClientId = res.clients[i].dealClientId != null && typeof res.clients[i].dealClientId == 'number' && res.clients[i].dealClientId > 0 ? res.clients[i].dealClientId : CommonMethods.getGUID();;

          tmpRow.stageTypeName = tmpRow.stage != null ? tmpRow.stage.stageTypeName : '';
          tmpRow.statusTypeName = tmpRow.registrationStatus != null ? tmpRow.registrationStatus.statusTypeName : '';
          tmpRow.agProjectLead = this.getPartnerNameForGrid(tmpRow.projectLead);
          tmpRow.agClientHeads = this.getPartnersNameForGrid(tmpRow.clientHeads);
          tmpRow.agClientSectorLeads = this.getPartnersNameForGrid(tmpRow.clientSectorLeads);
          tmpRow.agOthersInvolved = this.getPartnersNameForGrid(tmpRow.othersInvolved);
          tmpRow.priorityName = tmpRow.priority != null ? tmpRow.priority.priorityName : '';
          tmpRow.clientName = tmpRow.client.clientName;
          tmpRow.committed = (tmpRow.committed) ? tmpRow.committed : [];
          tmpRow.heardFrom = (tmpRow.heardFrom) ? tmpRow.heardFrom : [];
          tmpRow.nextCall = (tmpRow.nextCall) ? tmpRow.nextCall : [];
          tmpRow.ovp = (tmpRow.ovp) ? tmpRow.ovp : [];
          tmpRow.registrationSubmittedBy = typeof tmpRow.registrationSubmittedBy == "object" ? CommonMethods.getEmployeeName(tmpRow.registrationSubmittedBy) : tmpRow.registrationSubmittedBy;
          tmpRow.registrationSubmitterLocation = tmpRow.registrationSubmitterLocation;
          tmpRow.isMultipleEmployee = true;
          tmpRow.isMultipleClient = false;
          tmpRow.registrationSubmissionDate = tmpRow.registrationSubmissionDate;
          tmpRow.likelihoodId = tmpRow.likelihoodId;
          tmpRow.possibleStartDateRangeTo = tmpRow.possibleStartDateRangeTo;
          tmpRow.dealThesis = tmpRow.dealThesis;
          tmpRow.caseCode = tmpRow.caseCode;
          tmpRow.lostTo = tmpRow.lostTo;
          tmpRow.agSVP = this.getPartnersNameForGrid(tmpRow.svp);
          tmpRow.typeOfWork = tmpRow.workType != null ? tmpRow.workType.workTypeName : '';
          tmpRow.publiclyTraded = tmpRow.publiclyTraded == true || tmpRow.publiclyTraded == 'Yes' ? 'Yes' : 'No';
          tmpRow.caseOfficeName = tmpRow.caseOffice ? tmpRow.caseOffice.officeName : '';
          tmpRow.officeCluster = tmpRow.caseOffice ? CommonMethods.getOfficeCluster(tmpRow.caseOffice.officeCode, this.bainOffices) : '';
          tmpRow.caseStartDate = tmpRow.caseStartDate;
          tmpRow.caseEndDate = tmpRow.caseEndDate;
          tmpRow.caseName = tmpRow.caseName;
          tmpRow.commitmentDate = tmpRow.commitmentDate;
          tmpRow.terminatedDate = tmpRow.terminatedDate;
          this.rowData.push(tmpRow);
        }

        let re = this.gridApi.applyTransaction({ add: this.rowData });
        var params = { force: true, rowNode: re };
        this.gridApi.refreshCells(params);
        this.dealClientId = res.clients.length;
        this.rowData = this.rowData.sort((a, b) => { return a.registrationStatus?.sortOrder - b.registrationStatus?.sortOrder });
        this.rowData = this.rowData.sort((a, b) => { return a.clientOrder - b.clientOrder });

        let clients = this.rowData.sort((a, b) => {
          return CommonMethods.sortCllients((a.stage) ? a.stage.registrationStageId : 0, a, b);
        })

        this.rowData = clients.sort((a, b) => { return a.clientOrder - b.clientOrder });


        this.rowData = this.sortDuplicateAndConflictedRecords(this.rowData, RegistrationStatus.Conflicted);// sort Conflicted

        this.rowData = this.sortDuplicateAndConflictedRecords(this.rowData, RegistrationStatus.Duplicate); //sortDuplicate
        this.refreshCells();
      }

    }, () => { }, () => {
      this.dealService.switchTab.next('allocation')
    })


    this.dealService.switchTab.subscribe((tem) => {

      if (tem != null && tem == 'clients') {
        this.deal.clients = this.deal.clients.filter(c => c.client.clientName != '' && c.client.clientName != null);
        this.rowData = this.rowData.filter(r => r.client.clientName != '' && r.client.clientName != null);
        this.rowData = this.rowData.sort((a, b) => { return a.registrationStatus?.sortOrder - b.registrationStatus?.sortOrder });
        this.rowData = this.rowData.sort((a, b) => { return a.clientOrder - b.clientOrder });
        let clients = this.rowData.sort((a, b) => {
          return CommonMethods.sortCllients((a.stage) ? a.stage.registrationStageId : 0, a, b);
        })

        this.rowData = clients.sort((a, b) => { return a.clientOrder - b.clientOrder });

        this.rowData = this.sortDuplicateAndConflictedRecords(this.rowData, RegistrationStatus.Conflicted);// sort Conflicted

        this.rowData = this.sortDuplicateAndConflictedRecords(this.rowData, RegistrationStatus.Duplicate); //sortDuplicate

        this.refreshCells();
      }
    })
  }


  sortDuplicateAndConflictedRecords(data: any, order: any) {
    let filterData=[];
    for(let i=0;i<data.length;i++)
    {
      if (data[i].registrationStatus != null && (data[i].registrationStatus.registrationStatusId == order)) {
        if(order==RegistrationStatus.Conflicted)
        { 
          if(data[i].stage?.registrationStageId != RegistrationStageEnum.Terminated)
          {
            var removed= this.rowData.splice(data.indexOf(data[i]), 1);
            filterData.push(removed[0]);        
            i--;
          }
          
        }
        if(order==RegistrationStatus.Duplicate)
        {
          var removed= this.rowData.splice(data.indexOf(data[i]), 1);
          filterData.push(removed[0]);        
          i--;
        }
       }
    }   
    if(filterData)
    {
      filterData.forEach(item=>{
        data.push(item);
      })
    }    
    return data;
  }
  editableField = [];
  hiddenField = ['1', '2'];
  onGridReady(params) {
    this.gridApi = params.api;
    this.gloablService.getOffice().subscribe(office => {
      this.bainOffices = office;
      if (this.columnDefs == undefined) {
        this.onEditDeal();
      }
      this.getColumnData();
    });



  }
  getColumnData() {
    // use this for agGrid col def
    this.gloablService.getGridColumns(PagesTypes.ClientsTab).subscribe((columns: GridColumn[]) => {
      this.columnDefs = this.dealGridService.getColumnDefinitions(columns);
      this.columnDefs.forEach(r => {
        if (r.field == 'delete') {
          r.colId = "2";
          r.hide = this.isTabReadOnly

        }
      });
      let fields = this.columnDefs.filter(res => res.editable != false);
      this.editableField = fields.map(r => r.field);

      this.resetColumnConfig(this.isTabReadOnly);
    });


  }

  addClient() {
    let tmpClient: Client = {
      clientId: 0,
      basisClientId: 0,
      clientName: '',
      clientHeadEmployeeCode: '',
      clientHeadFirstName: '',
      clientHeadLastName: '',
      clientPriorityId: 0,
      clientPriorityName: '',
      clientReferenceId: 0,
      clientPrioritySortOrder: 0,
      accountId:'',
      customGroup:'',
      accountType:'',
      clientGroup:'',
    }
    let qualifier = { quantifierId: 0, quantifierName: "", typeId: 0 }
    var newRow: DealClient =
    {
      expectedStart: { expectedEndtDate: undefined, expectedStartDate: undefined, qualifier: qualifier },
      tmpDealClientId: this.dealClientId,
      dealClientId: CommonMethods.getGUID(),
      client: tmpClient,
      field: '',
      seekingExpertise: '',
      registrationStatus: {
        registrationStatusId: 0,
        statusTypeName: '',
        sortOrder: 4
      },
      notes: '',
      allocationNote: '',
      allocationNoteFormatted: '',
      allocationNoteTexts: [],
      registrationId: 0,
      stage: null,
      registrationStage:null,
      priorityId: null,
      priorityName: null,
      clientHeads: [],
      clientSectorLeads: [],
      othersInvolved: [],
      priority: null,
      statusTypeName: null,
      stageTypeName: null,
      submittedBy: '',
      isMultipleEmployee: true,
      isMultipleClient: false,
      committed: [],
      heardFrom: [],
      nextCall: [],
      ovp: [],
      registrationSubmittedBy: null,
      registrationSubmitterLocation: null,
      registrationSubmitterEcode: null,
      callDates: [],
      dealClientAllocationNotes: null,
      dealThesis: null,
      possibleStartDateRangeTo: null,
      likelihoodId: null,
      projectLead: null,
      registrationSubmissionDate: null,
      caseOfficeName: null,
      possibleStartDateRange: null,
      caseCode: null,
      svp: null,
      workType: null,
      workEndDate: null,
      phaseZeroStartDate: null,
      phaseZeroEndDate: null,
      phaseOneStartDate: null,
      phaseOneEndDate: null,
      phaseTwoStartDate: null,
      phaseTwoEndDate: null,
      interestDate: null,
      commitmentDate: null,
      terminatedDate: null,
      statusUpdateDate: null,
      lostTo: null,
      callLog: null,
      projectName: null,
      dealStage: null,
      clientOrder: 5,
      caseOffice: null,
      allocationDescription: '',
      caseStartDate: null,
      caseEndDate: null,
      caseName: null,
      caseId: null,
      officeCluster: null,
      RegistrationSubmitter:null
    }
   
    this.rowData.push(newRow);
    var res = this.gridApi.applyTransaction({ add: [newRow] });
    var params = { force: true, rowNode: res };
    this.gridApi.refreshCells(params);

    this.deal.clients.push(newRow);
    this.dealClientId = this.dealClientId + 1;
    this.updateStatus();
    
  }
  updateStatus() {
    this.emitUpdatedStatus.emit();
  }
  onCellClicked(object) {
    if (object.column.colDef.headerName == 'Delete') {

      if (object.data.committed.length > 0 || object.data.heardFrom.length > 0 || object.data.nextCall.length > 0 || object.data.ovp.length > 0) {

        const initialState = {
          data: 'This action will delete the allocation for ' + object.data.clientName + '. Would you like to continue?',
          title: 'Confirmation'
        };
        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState, backdrop: "static", keyboard: false });

        this.bsModalRef.content.closeBtnName = 'Close';

        this.bsModalRef.content.event.subscribe(a => {
          if (a == 'reset') {
            this.deleteCurrentRow(object.data);
          }
        })
      } else {
        this.deleteCurrentRow(object.data);
      }
    }
    else if (object.column.colDef.field == 'callDates') {
      this.selectClientDates(object.data.dealClientId);
    }

  }

  deleteCurrentRow(object) {
    this.rowData = this.rowData.filter(a => a.tmpDealClientId != object.tmpDealClientId);
    this.deal.clients = this.deal.clients.filter(a => a.tmpDealClientId != object.tmpDealClientId);
    const registrationId = object.registrationId;

    if (registrationId != 0) {
      this.emitUpdatedRegistration.emit(registrationId);
    }
    else {
      this.emitUpdatedRegistration.emit();
    }
  }


  onCellValueChanged(event) {
    let curentClients: DealClient[] = this.deal.clients.filter(a => a.tmpDealClientId == event.data.tmpDealClientId);
    if (curentClients.length > 0) {
      if (curentClients[0].client != undefined && curentClients[0].client != null && event.newValue) {
        if (event.colDef.field == "clientName" && event.newValue != null && event.newValue != undefined && event.newValue.trim() != '') {
          if (curentClients[0].client.clientId != undefined && curentClients[0].client.clientId != null) {
            if (event.oldValue == undefined || event.oldValue == null) {
              this.resetClientData(curentClients[0], event.rowIndex);
            }
            else if (event.oldValue != undefined) {
              this.resetCurrentClientAllocation(curentClients[0], event.oldValue, event.rowIndex, false, curentClients[0].client.clientId);
            }
          } else {
            if (event.oldValue != event.newValue && event.oldValue != undefined) {
              this.resetCurrentClientAllocation(curentClients[0], event.oldValue, event.rowIndex, true, curentClients[0].client.clientId);
            }
          }
        } else if (event.colDef.field == "clientName" && event.newValue == null) {
          this.currentClientId = curentClients[0].client.clientId;
          this.resetCurrentClientAllocation(curentClients[0], event.oldValue, event.rowIndex, true, curentClients[0].client.clientId);
        }
        this.setRegistrationStatus(event.data, curentClients[0]);
        this.setRegistrationStage(event, curentClients[0]);

        this.setWorkType(event.data, curentClients[0]);

        this.updateEmployees(event);
        this.setPriority(event.data, curentClients[0]);
        curentClients[0].client.clientName = typeof event.data.clientName == 'object' ? '' : event.data.clientName;
        curentClients[0].client.clientId = event.data.client != undefined ? event.data.client.clientId : curentClients[0].client.clientId;
        this.refreshCells();
        this.emitUpdatedRegistration.emit();
      }
    }
  }

  resetClientData(currentClient, rowIndex) {
    this.currentClientId = currentClient.client.clientId;
    this.getClientDetailedInfo(currentClient, currentClient.client.clientId, rowIndex);
  }

  resetDataExternalClients(currentClient) {
    currentClient.priorityName = '';
    currentClient.clientHeads = [];
    currentClient.agClientHeads = [];

    if (currentClient.priority) {
      if (currentClient.priority.hasOwnProperty('priorityName')) {
        currentClient.priority.priorityName = '';
        currentClient.priority.priorityId = 0;
        currentClient.priority.sortOrder = 100;
      }
    }

    if (currentClient.clientName == null) {
      this.rowData = this.rowData.filter(a => a.tmpDealClientId != currentClient.tmpDealClientId);
      this.deal.clients = this.deal.clients.filter(a => a.tmpDealClientId != currentClient.tmpDealClientId);
    }
    this.refreshCells();
  }

  resetCurrentClientAllocation(currentClient, previousValue, rowIndex, isExternal: boolean, previousClientId) {

    if (currentClient.committed.length > 0 || currentClient.heardFrom.length > 0 || currentClient.nextCall.length > 0 || currentClient.ovp.length > 0) {
      const initialState = {
        data: 'This action will delete the allocation for ' + (currentClient.client.clientName) + '. Would you like to continue?',
        title: 'Confirmation'
      };
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState, backdrop: "static", keyboard: false });
      this.bsModalRef.content.closeBtnName = 'Close';

      this.bsModalRef.content.event.subscribe(a => {
        if (isExternal && a != 'revert') {
          this.resetDataExternalClients(currentClient);
        }
        if (a == 'reset') {
          currentClient.committed.forEach(element => {
            if (element.isAllocationActive)
              this.setActiveExpertGrid(element.employeeCode, false);
          })


          this.deal.clientAllocations = this.deal.clientAllocations.filter(e => e.dealClientId != currentClient.dealClientId);
          currentClient.committed = [];
          currentClient.heardFrom = [];
          currentClient.nextCall = [];
          currentClient.ovp = [];
          this.currentClientId = undefined;
          if (!isExternal) {
            this.getClientDetailedInfo(currentClient, currentClient.client.clientId, rowIndex);
          }
          if (currentClient.clientName == null) {
            this.rowData = this.rowData.filter(a => a.tmpDealClientId != currentClient.tmpDealClientId);
            this.deal.clients = this.deal.clients.filter(a => a.tmpDealClientId != currentClient.tmpDealClientId);
          }

          this.refreshCells();
        } else if (a == 'revert') {
          currentClient.client.clientId = previousClientId;
          currentClient.client.clientName = previousValue;
          currentClient.clientName = previousValue;
          this.refreshCells();
        }
      })
    } else {
      if (currentClient.client.clientId != undefined && currentClient.client.clientId != null && currentClient.clientName != null) {
        this.getClientDetailedInfo(currentClient, currentClient.client.clientId, rowIndex);
      } else {
        this.resetDataExternalClients(currentClient);
      }
    }
  }

  getClientDetailedInfo(currentClient, clientId, index) {    
    if (clientId && currentClient.client?.basisClientId) {
      if (this.gridOptions.api != undefined) {
        this.gridOptions.api.showLoadingOverlay();
      }
      this.dealService.getClientHeadsByClientName(currentClient.client.basisClientId).subscribe(res => {
        this.setPartners(res, currentClient, index);
        if (this.gridOptions) {
          this.gridOptions.api.hideOverlay()
        }
      })
    }
  }

  setActiveExpertGrid(employeeCode, isActive) {
    this.deal.clients.forEach(obj => {

      obj.heardFrom.forEach(heardFromExpert => {
        if (employeeCode == heardFromExpert.employeeCode) {
          heardFromExpert.isAllocationActive = isActive;
        }
      });
      obj.nextCall.forEach(nextCallExpert => {
        if (employeeCode == nextCallExpert.employeeCode) {
          nextCallExpert.isAllocationActive = isActive;
        }
      });
    })
  }

  setPriority(data, currentClient: DealClient) {
    if (data.priorityName) {
      currentClient.priorityName = data.priorityName;
      if (currentClient.priority == null || currentClient.priorityId == undefined) {
        currentClient.priority = {
          priorityId: 0,
          priorityName: '',
          sortOrder: 100
        }
      }
      //currentClient.priority.priorityId = data.priority.priorityId;
      currentClient.priority.priorityName = data.priorityName;
      currentClient.priority.sortOrder = data.clientPrioritySortOrder;
      this.refreshCells();
    }
  }

  setPartners(data, currentClient, index) {
    if (data.partners != null && data.partners != undefined) {
      if (data.partners.length > 0) {
        this.rowData[index].agClientHeads = this.getPartnersNameForGrid(data.partners);
        currentClient.clientHeads = data.partners.filter(a => a.firstName != null && a.lastName != null);
        this.refreshCells();
      }
    }
  }

  setRegistrationStatus(data, currentClient) {
    if (data.statusTypeName != null && data.statusTypeName != undefined && data.statusTypeName.hasOwnProperty('registrationStatusId')) {
      currentClient.registrationStatus = data.statusTypeName;
      currentClient.statusTypeName = currentClient.registrationStatus.statusTypeName;
      currentClient.sortOrder = currentClient.registrationStatus.sortOrder;
    }
  }

  setRegistrationStage(event, currentClient) {
    if (event.data.stageTypeName != null && event.data.stageTypeName != undefined && event.data.stageTypeName.hasOwnProperty('registrationStageId')) {
      currentClient.stage = event.data.stageTypeName;
      currentClient.stageTypeName = currentClient.stageTypeName.stageTypeName;
    }
  }


  setWorkType(data, currentClient) {
    if (data.typeOfWork != null && data.typeOfWork != undefined && data.typeOfWork.hasOwnProperty('workTypeId')) {
      currentClient.workType = data.typeOfWork;
      currentClient.typeOfWork = currentClient.typeOfWork.workTypeName;
    }
  }

  getPartnersNameForGrid(partnerName) {
    var names;
    if (partnerName) {
      names = partnerName.map(function (item) {
        if (item.lastName != null && item.firstName != null) {
          return item.lastName + ', ' + (item.familiarName ? item.familiarName : item.firstName) + ' (' + item.officeAbbreviation + ')';
        }
      });
      names = names.filter(a => a != undefined);
    }
    return names;
  }

  getPartnerNameForGrid(partnerName) {
    if (partnerName) {
      return partnerName.lastName + ', ' + (partnerName.familiarName ? partnerName.familiarName : partnerName.firstName) + ' (' + partnerName.officeAbbreviation + ')';
    }
    else {
      return '';
    }

  }


  refreshCells() {
    if (this.gridApi != undefined) {
      var params = { force: true };
      this.gridApi.refreshCells(params);
    }
  }

  selectClientDates(clientId) {
    this.selectedDealClientId = clientId;
  }

  excelDownload() {
    let name;
    if (this.deal.targetName != null && this.deal.targetName != undefined && this.deal.targetName.trim() != '') {
      const sanitizedName = this.deal.targetName.replace('.', ' ');
      name = sanitizedName.trim() + '_Client_' + CommonMethods.getDateLabel(new Date());
    } else {
      name = 'Client_' + CommonMethods.getDateLabel(new Date());
    }
    let allFields: any = this.columnDefs;
    allFields = allFields.map(a => {
      return a.field;
    })
    allFields = allFields.filter(a => a != undefined && a != 'callDates');
    let params: ExcelExportParams = <ExcelExportParams>{
      allColumns: false,
      columnKeys: allFields,
      fileName: name,
      sheetName: 'Clients',
      processCellCallback: (params: ProcessCellForExportParams): string => {
        let value = params.value;
        let colDef = params.column.getColDef();
        if (colDef.headerName != 'Delete') {

          if (colDef.headerName == '') {
            value = params.node.data.registrationId > 0 ? 'R' : '';
          }
          else if (colDef.headerName.toLowerCase().endsWith('date')) {

            value = params && params.value ? moment(CommonMethods.converToLocal(params.value)).format('DD-MMM-YYYY') : '';
          }
          else if (colDef.headerName == 'Deal Thesis' || colDef.headerName == 'Notes') {
            value = params && params.value ? params.value.replace(/[^a-zA-Z0-9]/g, ' ') : ' ';
          }

          return value;
        }
      }
    };

    this.gridOptions.api.exportDataAsExcel(params);
  }




  updateEmployees(event) {
    let tempEmployee = [];
    if (event.colDef.field == 'agClientHeads') {
      tempEmployee = event.data.clientHeads.map(a => {
        return this.getSearchableName(a);
      })
      event.data.agClientHeads = tempEmployee;
    } else if (event.colDef.field == 'agProjectLead') {
      event.data.agProjectLead = this.getSearchableName(event.data.projectLead);
    } else if (event.colDef.field == 'agClientSectorLeads') {
      tempEmployee = event.data.clientSectorLeads.map(a => {
        return this.getSearchableName(a);
      })
      event.data.agClientSectorLeads = tempEmployee;
    }
    else if (event.colDef.field == 'agOthersInvolved') {
      tempEmployee = event.data.othersInvolved.map(a => {
        return this.getSearchableName(a);
      })
      event.data.agOthersInvolved = tempEmployee;
    }
    else if (event.colDef.field == 'agSVP') {
      tempEmployee = event.data.svp.map(a => {
        return this.getSearchableName(a);
      })
      event.data.agSVP = tempEmployee;
    }
  }

  getSearchableName(employee) {
    if (employee.hasOwnProperty('searchableName')) {
      return employee.searchableName;
    } else if (employee.hasOwnProperty('firstName')) {
      return ((employee.lastName) ? employee.lastName + ", " : '') +
        ((employee.familiarName) ? employee.familiarName : employee.firstName) +
        " (" + (employee.officeAbbreviation) + ")"
    } else {
      return employee
    }
  }

  isStageEditable(params) {
    //((params) => { if (this.isTabReadOnly) { return false; } else if (params.data.registrationId > 0 && this.coreService.loggedInUser.securityRoles.some(role => (role.id != RoleType.MultibidderManager)))  { return false; } else { return true; } })

    return false;
  }



}
