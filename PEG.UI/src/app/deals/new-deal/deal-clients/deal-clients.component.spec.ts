

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DealClientsComponent } from './deal-clients.component';
import { EmployeeEditorComponent } from '../../../shared/grid-editor/employee-editor/employee-editor.component';
import { ClientEditorComponent } from '../../../shared/grid-editor/client-editor/client-editor.component';
import { StageEditorComponent } from '../../../shared/grid-editor/stage-editor/stage-editor.component';
import { StatusEditorComponent } from '../../../shared/grid-editor/status-editor/status-editor.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { DealsService } from '../../deals.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DealClient } from './dealClient';
import { deals } from '../../deal';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Client } from '../../../shared/interfaces/client';
import { BehaviorSubject } from 'rxjs';
import { DealGridColumnService } from '../../../shared/grid-generator/deal-grid-column.service';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { GlobalService } from '../../../global/global.service';

describe('DealClientsComponent', () => {
  let component: DealClientsComponent;
  let fixture: ComponentFixture<DealClientsComponent>;

  let switchTab: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  const mockDealsService = {
    switchTab: switchTab.asObservable()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DealClientsComponent, StatusEditorComponent, StageEditorComponent,
        EmployeeEditorComponent, ClientEditorComponent, ConfirmModalComponent],
      providers: [DealsService, BsModalService, BsModalRef, deals,DealGridColumnService,RegistrationService,GlobalService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NgSelectModule, FormsModule, HttpClientModule,
        HttpClientTestingModule, ModalModule.forRoot()
      ]
    });
    TestBed.overrideProvider(DealsService, { useValue: mockDealsService })

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealClientsComponent);
    component = fixture.componentInstance;
    switchTab.next('clients');

    let dataClients: DealClient[] = JSON.parse

      ('[{"data":{"tmpDealClientId":0},"colDef":{"field":"clienthead"},"tmpDealClientId":0,"dealClientId":0,"client":{"clientId":168,"clientName":"Bain Capital","clientHeadEmployeeCode":"","clientHeadFirstName":"","clientHeadLastName":"","ClientPriorityId":0,"ClientPriorityName":"","clientReferenceId":0},"field":"","seekingExpertise":"","registrationStatus":{"registrationStatusId":0,"statusTypeName":""},"notes":"","registrationId":0,"stage":{"registrationStageId":0,"stageTypeName":""},"priorityId":1,"priorityName":"P1A","clientHeads":[{"dealClientId":0,"employeeCode":"01DLP","firstName":"David","lastName":"Lipman","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"CBIER","firstName":"Christopher","lastName":"Bierly","familiarName":"Chris","partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"04RWE","firstName":"Rolf-Magnus","lastName":"Weddigen","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"03NGR","firstName":"Nicholas","lastName":"Greenspan","familiarName":"Nick","partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"10TAN","firstName":"Andrew","lastName":"Tymms","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":1,"regionName":"Asia/Pacific"}}],"priority":{"priorityId":1,"priorityName":"P1A"},"statusTypeName":null,"stageTypeName":null,"submittedBy":"","isMultipleEmployee":true,"isMultipleClient":false,"committed":[],"ovp":[],"heardFrom":[],"nextCall":[],"clientId":168,"clientName":"Bain Capital","clientHead":["Lipman, David (01DLP)","Bierly, Christopher (CBIER)","Weddigen, Rolf-Magnus (04RWE)","Greenspan, Nicholas (03NGR)","Tymms, Andrew (10TAN)"]}]')


    let clientAllocation = JSON.parse
      ('[{"dealId":0,"clientId":169,"allocationType":1,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":2,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":3,"employeeCode":"48248","lastUpdatedBy":null}]')

    let tmpClient: Client = {
      clientId: 0,
      basisClientId:0,
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
      accountType:''
    }

    let newRow: DealClient =
    {
      tmpDealClientId: 0,
      dealClientId: 0,
      client: tmpClient,
      field: '',
      seekingExpertise: '',
      registrationStatus: {
        registrationStatusId: 0,
        statusTypeName: '',sortOrder:0
      },
      notes: '',
      registrationId: 0,
      stage: {
        registrationStageId: 0,
        stageTypeName: ''
      },
      registrationStage: {
        registrationStageId: 0,
        stageTypeName: ''
      },
      priorityId: null,
      priorityName: null,
      clientHeads: [],
      clientSectorLeads: [],
      othersInvolved: [],
      priority: {
        priorityId: 0,
        priorityName: '',
        sortOrder: 0
      },
      statusTypeName: null,
      stageTypeName: null,
      submittedBy: '',
      isMultipleEmployee: true,
      isMultipleClient: false,
      committed: [],
      heardFrom: [],
      nextCall: [],
      allocationNoteTexts: [],
      ovp: [],
      registrationSubmitterLocation: null,
      registrationSubmittedBy: null,
      allocationNote: '',
      callDates: [],
      dealClientAllocationNotes: null,
      dealThesis: null,
      possibleStartDateRange: null,
      possibleStartDateRangeTo: null,
      likelihoodId: null,
      projectLead: null,
      registrationSubmissionDate: null,
      caseOffice: null,
      caseOfficeName: null,
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
      lostTo: '',
      callLog: '',
      projectName: '',
      dealStage: '',
      registrationSubmitterEcode: '',
      clientOrder:100,
      allocationDescription:'',
      allocationNoteFormatted: '',
      caseStartDate:null,
      caseEndDate:null,
      caseName: null,
      caseId:null,
      officeCluster:null,
      expectedStart: null,
      RegistrationSubmitter:null

    }
    component.rowData = [];
    component.rowData.push(newRow);

    component.deal = {
      "priorWork": "",
      "dealId": 0,
      "targetName": null,
      "targetId": 0,
      "submittedBy": null,
      "clientName": null,
      "dealRegistrations": [],
      "createdOn": null,
      "bankRunningProcess": null,
      "bankProcessName": null,
      "currentEBITDA": null,
      "dealSize": null,
      "targetDescription": null,
      "isPubliclyKnown": null,
      "nickname": null,
      "notes": null,
      "owner": null,
      "targetCountry": null, "associatedRegistrations": null, "mbAdvisor": null, "mbStatus": null, "sector": null, "externalProjectName": null, "visibleTo": null, "biddersList": null, "dealWinner": null, "dealStatus": null, "bidDates": null, "bidDatesType": null, "vddProvider": null, "redbookAvailable": null, "industries": [],
      "expertGroup": [],
      "clients": dataClients,
      "clientAllocations": clientAllocation,
      "importantDates": [],
      "managedBy": null,
      "dealRegions": null,
      "dealSecurity": [],
      "transactedTo": '',
      "supportedWinningBidder": '',
      "processExpectation": '',
      "supportRequested": false,
      "expertLineupPrepared": false,
      "expertOnBoard": false,
      "transactedDate": null,
      "submissionDate": null,
      "sectors": [],
      "subSectors": [], 
      "attendees":null,
      "dateOfCall": null,
      "sentTo": null,
      "trainers": null,
      "isExpertTrainUpCall":null,
      "publiclyTraded": null,
      "isMasked":false,
       "statusUpdateDate":null

    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.deal.clients[0].client.clientName).toBe('Bain Capital');
    expect(component).toBeTruthy();
  });

  it('should add a new row in grid ', () => {
    const btnAddClient: HTMLElement = fixture.nativeElement.querySelector('#addClient');
    btnAddClient.click();
    expect(component.rowData.length).toBeGreaterThan(0);
  });

  it('should get client head and priority', () => {
    expect(component.deal.clients[0].priority.priorityId).toBe(1);
    expect(component.deal.clients[0].priority.priorityName).toBe('P1A');
    expect(component.deal.clients[0].clientHeads[0].employeeCode).toBe('01DLP');
    expect(component.deal.clients[0].clientHeads[0].firstName).toBe('David');
    expect(component).toBeTruthy();
  });

  it('should delete client row', () => {
    component.deal.clients[0].committed = [];
    component.deal.clients[0].heardFrom = [];
    component.deal.clients[0].nextCall = [];
    component.deal.clients[0].ovp = [];
    let testData = {
      column: {
        colDef: {
          headerName: 'Delete'
        }
      },
      data: component.deal.clients[0]
    }

    component.onCellClicked(testData);
    fixture.detectChanges();
    expect(component.deal.clients.length).toEqual(0);
  });

  it('should detect cell value changes', () => {
    component.onCellValueChanged(component.deal.clients[0]);
    fixture.detectChanges();
    expect(component.deal.clients[0].client.clientName).toEqual(component.deal.clients[0].client.clientName);
  });

  it('should get the first client name', () => {
    fixture.detectChanges();
    expect(component.deal.clients[0].client.clientId).toEqual(component.deal.clients[0].client.clientId);
  });

  it('should set the priority of client head', () => {
    let data = {
      priority: {
        priorityId: 1,
        priorityName: 'P1A'
      }
    }
    component.setPriority(data, component.deal.clients[0]);
    fixture.detectChanges();
    expect(component.deal.clients[0].priority.priorityId).toEqual(data.priority.priorityId);
  });

  it('should set the client heads of client', () => {
    let data = {
      clientHeads: [{
        firstName: 'test',
        lastName: 'test2',
        employeeCode: '1234'
      }]
    }
    component.rowData = [];
    component.rowData.push({});
    component.rowData[0].clientHead = [];
    component.setPartners(data, component.deal.clients[0], 0);
    fixture.detectChanges();
    expect(component.deal.clients[0].clientHeads.length).toBeGreaterThan(0);
  });

  it('should reset client allocation', () => {
    component.deal.clients[0].committed = [];
    component.deal.clients[0].heardFrom = [];
    component.deal.clients[0].nextCall = [];
    component.deal.clients[0].ovp = [];
    fixture.detectChanges();
    expect(component.deal.clients[0].client.clientId).toEqual(component.deal.clients[0].client.clientId);
  });

  it('should reset client in case of new clients', () => {
    component.resetDataExternalClients(component.deal.clients[0]);
    fixture.detectChanges();
    expect(component.deal.clients[0].priorityName).toEqual('');
  });


});
