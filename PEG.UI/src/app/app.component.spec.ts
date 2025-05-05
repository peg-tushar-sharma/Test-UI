import { AppComponent } from './app.component';
import { AppInsightWrapper } from './applicationInsight/appInsightWrapper';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CoreService } from './core/core.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DealsService } from './deals/deals.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationService } from './registrations/registrations/registration.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SignalRService } from './shared/signalr/signalr.service';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    let mockAppInsightWrapper;
    let mockDealsService;
    let mockRegistrationService;
    let mockCoreService;

  beforeEach(waitForAsync(() => {

    mockAppInsightWrapper = jasmine.createSpyObj("mockAppInsightWrapper",['logEvent']);
    mockDealsService = jasmine.createSpyObj("mockDealsService",['']);
    mockRegistrationService = jasmine.createSpyObj("mockRegistrationService",['getUserAuthorization']);
      mockCoreService = jasmine.createSpyObj("mockCoreService",['']);        
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false })
      ],
      declarations: [
        AppComponent
      ],
      providers:[AppInsightWrapper,DealsService, RegistrationService, RegistrationService, CoreService, SignalRService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    TestBed.overrideProvider(AppInsightWrapper, {useValue: mockAppInsightWrapper });
    TestBed.overrideProvider(DealsService,{useValue: mockDealsService});
    TestBed.overrideProvider(RegistrationService,{useValue: mockRegistrationService});
    TestBed.overrideProvider(CoreService,{useValue: mockCoreService});
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockCoreService.appSettings ={environment:"",PEGSignalRBasePath:"https://localhost:7267/peglive"};
    mockCoreService.loggedInUser = { id:'',employeeCode:'',firstName:'test',lastName:'user',employeeOffice:0,profileImageUrl:'',securityRoles:[{id:4,name:'Multibidder Manager'}],token:'',displayName:'',familiarName:'',internetAddress:'',role:'',pages:[{id:1,name:'Dashboard',level:1,redirectionUrl:''}]}
    mockRegistrationService.getUserAuthorization.and.returnValue(of([{roleFieldMappingId:1,securityRoleId:4,isVisible:true,isEditable:false,field:{FieldId:"1", FieldName:'newDeal'}}]));
    
    fixture.detectChanges()
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  


});
