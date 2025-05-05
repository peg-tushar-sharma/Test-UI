import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsComponent } from './deals.component';
import { DealsService } from './../deals.service';
import { GlobalService} from './../../global/global.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PegTostrService } from '../../core/peg-tostr.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule  } from 'ngx-bootstrap/dropdown';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { RegistrationGridService } from '../../registrations/registrations/registration-grid.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FormsModule } from '@angular/forms';
import { DealList, dealStatus } from '../deal';
import { CoreService } from '../../core/core.service';
import { DealSecurityService } from '../deal.security.service';
import { PipelineService } from '../../pipeline/pipeline.service';

describe('DealsComponent', () => {
  let component: DealsComponent;
  let fixture: ComponentFixture<DealsComponent>;
  let mockDealService;
  let mockPegTostrService;
  let mockBsModalService;
  let mockRegistrationService;
  let mockRegistrationGridService;
  let mockPipelineService;
  let mockcoreService: CoreService;


  let routes: Routes = [
    {
      path: 'deals/deal/:dealid',
      component: DealsComponent
    }
  ];


  beforeEach(async(() => {
    mockDealService = jasmine.createSpyObj("mockDealService", ["getDealTaggedPeopleById", "getDeals", "convertToDeal", "saveTaggedPeople", "getEmployeeByName", "getExpertGroup", "getDealById",
      "getRegions", "setDealId", "getDealId", "saveExpertGroup", "getExpertCategories", "getClientsById","getDealStatus"]);
    mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
    mockBsModalService = jasmine.createSpyObj('mockBsModalService', ['']);
    mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationData', 'getRegistrationStatus',
      'getRegistrationStage', 'updateRegistration', 'getProhibitions', 'getInvestments', 'getGridColumns', 'getWorkTypeData', 'getUserAuthorization', 'setFieldAuthorization']);
    mockRegistrationGridService = jasmine.createSpyObj('mockRegistrationGridService', ['getColumnDefinitions']);
    mockcoreService = jasmine.createSpyObj('mockcoreService', ['loggedInUser']);
    mockPipelineService = jasmine.createSpyObj('mockPipelineService', ['getUserColumns', 'savePipelineColumnPrefrences']);
    


    TestBed.configureTestingModule({
      declarations: [DealsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, HttpClientTestingModule,BrowserAnimationsModule, RouterTestingModule.withRoutes(routes),BsDropdownModule.forRoot(), FormsModule, BsDatepickerModule.forRoot()],
      providers: [DealsService, PegTostrService, BsModalService, RegistrationService, RegistrationGridService,GlobalService,DealSecurityService,PipelineService]
    });

    TestBed.overrideProvider(DealsService, { useValue: mockDealService });
    TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
    TestBed.overrideProvider(BsModalService, { useValue: mockBsModalService });
    TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
    TestBed.overrideProvider(RegistrationGridService, { useValue: mockRegistrationGridService });
    TestBed.overrideProvider(PipelineService, { useValue: mockPipelineService });
    TestBed.overrideProvider(CoreService, { useValue: mockcoreService });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsComponent);
    component = fixture.componentInstance;

    mockPipelineService.getUserColumns.and.returnValue(of([
      { headerName: 'Target', field: 'targetName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'Client', field: 'clientName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'industry', field: 'industryName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'test', field: 'test', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false }
    ]));
    mockPipelineService.savePipelineColumnPrefrences.and.returnValue(of([ {} ]));
    mockRegistrationGridService.getColumnDefinitions.and.returnValue(of([
      { headerName: 'Target', field: 'targetName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'Client', field: 'clientName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'industry', field: 'industryName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'test', field: 'test', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false }
    ]));
    mockDealService.getRegions.and.returnValue(of([{ regionId: 1, regionName: "Asia/Pacific" }]))
    mockDealService.getDeals.and.returnValue(of([{ dealid: 0, industryName: '', targetName: '', clientName: '', submittedBy: '' }]));
    mockRegistrationService.getGridColumns.and.returnValue(of([
      { headerName: 'Target', field: 'targetName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'Client', field: 'clientName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'industry', field: 'industryName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
      { headerName: 'test', field: 'test', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false }
    ]));
    

    mockRegistrationService.getUserAuthorization.and.returnValue(of([{ roleFieldMappingId: 1, securityRoleId: 4, isVisible: true, isEditable: false, field: { FieldId: "1", FieldName: 'newDeal' } }]));
    let dealStatus: dealStatus = { dealStatusId: 1, dealStatusName: 'test' }
    let deal: DealList = { "dealStatusName": "sadf", "dealId": 3, "targetName": "Avaloq", "notes": "this is test notes", "submittedBy": "46225", "lastUpdated": new Date(), "lastUpdatedBy": "48248", "submissionDate": new Date(), "industries": [{ "industryId": 2074, "industryName": "Technology" }], "clients": [{ "clientId": 119, "clientName": "Ardian", "clientHeadEmployeeCode": null, "clientHeadFirstName": null, "clientHeadLastName": null, "clientPriorityId": null, "clientPriorityName": null, "clientReferenceId": 0 }], "regions": [{ "regionId": 3, "regionName": "EMEA" }],"dealStatusId":0, "dealStatus": dealStatus, noOfClients: "0", industryDN: "test", region: "region",dealRegion:"dealRegion" ,lockedBy:'test',sessionId:1}
    component.rowData = [];
    component.rowData.push(deal);
    mockDealService.getDealStatus.and.returnValue(of([dealStatus]));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call add new tracker function', () => {

    spyOn(component, 'AddNewTracker').and.callThrough();
    //Arrange
    component.fieldAuth.newDeal.isVisible = true;
    fixture.detectChanges();

    //Act
    let newTrackerButton = fixture.nativeElement.querySelector('#newMBTracker');
    newTrackerButton.click();

    //Assert
    expect(component.AddNewTracker).toHaveBeenCalled();
  })
});
