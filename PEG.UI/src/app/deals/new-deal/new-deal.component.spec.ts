import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabDirective, TabsModule } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, of } from 'rxjs';
import { mockDealData, mockDealStatus, mockMBStatus, mockSecurityConfig } from '../../../app/Mock/mockDealData';
import { CoreService } from '../../../app/core/core.service';
import { PegTostrService } from '../../../app/core/peg-tostr.service';
import { ErrorService } from '../../error/error.service';
import { NewRegistrationService } from '../../registrations/new-registration/new-registration.service';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { Field } from '../../shared/interfaces/field';
import { RoleFieldMapping } from '../../shared/interfaces/roleFieldMapping';
import { TimeoutService } from '../../shared/timeout-session/timeout.service';
import { TimeoutDialogService } from '../../shared/timeout-session/timeoutdialog.service';
import { DealSecurityService } from '../deal.security.service';
import { DealsService } from './../deals.service';
import { NewDealComponent } from './new-deal.component';
describe('NewDealComponent', () => {
  let component: NewDealComponent;
  let fixture: ComponentFixture<NewDealComponent>;
  let mockPegTostrService,mockRegistrationService, mockNewRegistrationService;
  let mockDealSecurityService;
  let mockgaService;
  let mockDealService;
  let mockCoreService;
  let mockTimeoutService;
  let mockTimeoutdialogService;
  

  beforeEach(async(() => {
    mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
    mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationData', 'getRegistrationStatus',
      'getRegistrationStage', 'updateRegistration', 'getProhibitions', 'getInvestments', 'getGridColumns', 'getWorkTypeData',
      'getUserAuthorization', 'setFieldAuthorization','getUsersByRole' ]);
    mockDealSecurityService = jasmine.createSpyObj('mockDealSecurityService', ['getDealAuthorization','getDealAccessTier','getDealAccessInformation']);
    mockDealService = jasmine.createSpyObj('mockDealService', ['convertToDeal', 'getDealId', 'getIndustrySectors','setDealId',
      'getDealTaggedPeopleById','getDealStatus','getRegions','getUsersByRole','getMBStatus', 'getDealById']);
    mockNewRegistrationService = jasmine.createSpyObj('mockNewRegistrationService', ['getEmployeeNames']);
    mockTimeoutService = jasmine.createSpyObj('mockTimeoutService', ['startTimer','stopTimer','resetTimer']);
    mockTimeoutdialogService = jasmine.createSpyObj('mockTimeoutdialogService', ['close','open','confirm']);
    
    TestBed.configureTestingModule({
      declarations: [ NewDealComponent ],
      imports: [FormsModule, NgSelectModule,HttpClientModule,RouterTestingModule, 
        TabsModule.forRoot(),],
      providers: [PegTostrService,DealsService,NewRegistrationService,ErrorService,RegistrationService,DealSecurityService,TimeoutService,TimeoutDialogService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
    TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
    TestBed.overrideProvider(DealSecurityService, { useValue: mockDealSecurityService });
    TestBed.overrideProvider(DealsService, {useValue: mockDealService});
    TestBed.overrideProvider(NewRegistrationService, {useValue: mockNewRegistrationService});
    TestBed.overrideProvider(CoreService, {useValue: mockCoreService});
    TestBed.overrideProvider(TimeoutService, {useValue: mockTimeoutService});
    TestBed.overrideProvider(TimeoutDialogService, {useValue: mockTimeoutdialogService});


  }));

  beforeEach(() => {

    let field : Field = {
      fieldId: 1,
      fieldName:'clearanceStatus'
    }
    
    let roleAuthorization: RoleFieldMapping ={
      roleFieldMappingId: 2,
      securityRoleId:1,
      isVisible: true,
      isEditable: true,
      field: field
    };
    mockDealSecurityService = jasmine.createSpyObj('mockDealSecurityService', ['getDealAuthorization','getDealAccessTier','getDealAccessInformation']);

    Object.defineProperty(mockDealService, 'AddRegistrationToDeal', {value: new BehaviorSubject<any>(null)});
    Object.defineProperty(mockDealService, 'multipleRegToDeal', {value: new BehaviorSubject<any>(null)});
    Object.defineProperty(mockDealService, 'editDeal', {value: new BehaviorSubject<any>(null)}); 
    
    fixture = TestBed.createComponent(NewDealComponent);
    component = fixture.componentInstance;

    component.dealId = 0;
    component.fieldAuth.saveDeal.isVisible = true;
    
    component.staticTabs.tabs = [{'heading': 'Context', 'active': true}] as TabDirective[];
    let tagggedPeople = {"contentType":null,"serializerSettings":null,"statusCode":null,"value":[{"dealPeopleTagId":0,"dealId":0,"employeeCode":"01NIA","firstName":"Steven","lastName":"Stepanian","familiarName":"Steve","employeeStatusCode":"A","office_name":"Amsterdam","positionTitle":"Vice President, EMEA PEG Talent and","pegRole":2,"pegRoleName":"PEG Operations","officeAbbreviation":"AMS"},{"dealPeopleTagId":0,"dealId":0,"employeeCode":"01REU","firstName":"Reuven","lastName":"Steinberg","familiarName":null,"employeeStatusCode":"A","office_name":"Boston","positionTitle":"Expert Associate Partner","pegRole":2,"pegRoleName":"PEG Operations","officeAbbreviation":"BOS"},{"dealPeopleTagId":0,"dealId":0,"employeeCode":"01RSH","firstName":"Rebecca","lastName":"Burack","familiarName":null,"employeeStatusCode":"A","office_name":"Boston","positionTitle":"Senior Vice President","pegRole":3,"pegRoleName":"PEG Leadership","officeAbbreviation":"BOS"},{"dealPeopleTagId":0,"dealId":0,"employeeCode":"14CVU","firstName":"Christophe","lastName":"De Vusser","familiarName":null,"employeeStatusCode":"A","office_name":"Brussels","positionTitle":"Senior Vice President","pegRole":3,"pegRoleName":"PEG Leadership","officeAbbreviation":"BRU"},{"dealPeopleTagId":0,"dealId":0,"employeeCode":"15ELL","firstName":"Erica","lastName":"Fiene","familiarName":null,"employeeStatusCode":"A","office_name":"Atlanta","positionTitle":"Director, Americas PEG Ringfence Pi","pegRole":4,"pegRoleName":"Multibidder Manager","officeAbbreviation":"ATL"},{"dealPeopleTagId":0,"dealId":0,"employeeCode":"46225","firstName":"Zoe","lastName":"Grant","familiarName":null,"employeeStatusCode":"A","office_name":"London","positionTitle":"Senior Specialist, EMEA PEG Operati","pegRole":4,"pegRoleName":"Multibidder Manager","officeAbbreviation":"LON"}]};
    spyOn(component, 'initDataServices').and.returnValue(of([mockSecurityConfig, [], tagggedPeople,mockDealStatus,[],[],[],mockMBStatus]));
    mockRegistrationService.getUsersByRole.and.returnValue(of(['']));
    mockDealService.convertToDeal.and.returnValue(of(['']));
    mockDealService.getDealById.and.returnValue(of(mockDealData));
    mockDealService.getDealId.and.returnValue(52);
    mockRegistrationService.getUserAuthorization.and.returnValue(of([roleAuthorization]));

    spyOn(component, 'setVisibleTo').and.callFake(()=>{});
    fixture.detectChanges(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new deal',()=>{
      //Arrange
      spyOn(component, 'submitClose').and.callThrough();
      component.deal.targetName = 'Test';
      fixture.detectChanges(false);

      //Act
      fixture.nativeElement.querySelector('button#saveTrackerButton').click();

      //Assert
      expect(component.submitClose).toHaveBeenCalled();
  })

  it('should not leave the page if form edited', ()=>{
    //Arrange
     component.deal.notes = "Test";
     fixture.detectChanges(false);

    //ACT
    var result = component.canDeactivate();
    //Assert
    expect(result).toBeFalsy();
  })

  it('should leave the page if form not edited', ()=>{
    //Arrange
     fixture.detectChanges(false);

    //Act
    var result = component.canDeactivate();
    //Assert
    expect(result).toBeTruthy();
  })

  it('mbAdvisorListTypeAhed should fetch maching data', fakeAsync(()=>{
    //Arrange
    let mockEmployee = [{"contentId":"00000000-0000-0000-0000-000000000000","employeeCode":"01AFR","lastName":"Frommer","firstName":"Andrew","familiarName":"Andy","title":null,"officeName":null,"levelName":null,"gradeName":null,"officeAbbreviation":"BOS","employeeStatusCode":"A","lastUpdated":"0001-01-01T00:00:00Z","lastUpdatedBy":null,"lastUpdatedName":null,"pegRole":0,"pegRoleName":null}];
    mockNewRegistrationService.getEmployeeNames.and.returnValue(of(mockEmployee));
    component.dealAuth.HeaderTab.isTabVisible = true;
    fixture.detectChanges(false);
    let mbAdvisorTypeAhed = fixture.nativeElement.querySelector('#mbadvisor input');
    mbAdvisorTypeAhed.value = "Frommer, Andy";
    mbAdvisorTypeAhed.dispatchEvent(new Event('input'));

    //Act
    tick(1000);
    fixture.detectChanges(false);

    //Assert
    expect(component.mbAdvisorList[0].searchableName).toEqual('Frommer, Andy (BOS)');

  }))

  it('should open allocation if clicked on the same', fakeAsync(()=>{
    //Arrange
    spyOn(component, 'selectTab').and.callThrough();
    Object.defineProperty(mockDealService, 'switchTab', {value: new BehaviorSubject<any>('allocation')});
    //Act
    component.selectTab('allocation');
    fixture.detectChanges(false);
    tick(1000);
    //Assert
    expect(component.selectTab).toHaveBeenCalled();
    
  }))

  it('should open clients if clicked on the same', fakeAsync(()=>{
    //Arrange
    spyOn(component, 'selectTab').and.callThrough();
    Object.defineProperty(mockDealService, 'switchTab', {value: new BehaviorSubject<any>('clients')});
    //Act
    component.selectTab('clients');
    fixture.detectChanges(false);
    tick(1000);
    //Assert
    expect(component.selectTab).toHaveBeenCalled();
    
  }))

  it('should open security if clicked on the same', fakeAsync(()=>{
    //Arrange
    spyOn(component, 'selectTab').and.callThrough();
    //Act
    component.selectTab('security');
    fixture.detectChanges(false);
    tick(1000);
    //Assert
    expect(component.selectTab).toHaveBeenCalled();
    
  }))

  it('should open experts if clicked on the same', fakeAsync(()=>{
    //Arrange
    spyOn(component, 'selectTab').and.callThrough();
    Object.defineProperty(mockDealService, 'switchTab', {value: new BehaviorSubject<any>('experts')});
    //Act
    component.selectTab('experts');
    fixture.detectChanges(false);
    tick(1000);
    //Assert
    expect(component.selectTab).toHaveBeenCalled();    
  }))

  it('should save deatail if deal copied from registration', fakeAsync(()=>{
    //Arrange   
    spyOn(component, 'submitClose').and.callThrough();
    let targetelement = fixture.nativeElement.querySelector("input[name='targetName']");
    targetelement.value = 'Test Target'
    targetelement.dispatchEvent(new Event('input'));
    fixture.detectChanges(false);
    component.deal = mockDealData;
    //Act
    //mockDealService.multipleRegToDeal.next(mockDealFromRegistration);
    tick(500);
    fixture.detectChanges(false);
    fixture.nativeElement.querySelector('button#saveTrackerButton').click();
    
    //Assert
    expect(component.submitClose).toHaveBeenCalled();
    discardPeriodicTasks();
  }))
});