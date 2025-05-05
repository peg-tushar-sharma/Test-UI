import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppNavigationComponent } from './app-navigation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RegistrationService } from '../registrations/registrations/registration.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppInsightWrapper } from '../applicationInsight/appInsightWrapper';
import { DealsService } from '../deals/deals.service';
import { CoreService } from '../core/core.service';
import { SignalRService } from '../shared/signalr/signalr.service';
import { of } from 'rxjs';

describe('AppNavigationComponent', () => {
  let component: AppNavigationComponent;
  let fixture: ComponentFixture<AppNavigationComponent>;
  let mockAppInsightWrapper;
  let mockDealsService;
  let mockRegistrationService;
  let mockCoreService;

  beforeEach(waitForAsync(() => {

    mockAppInsightWrapper = jasmine.createSpyObj("mockAppInsightWrapper", ['logEvent']);
    mockDealsService = jasmine.createSpyObj("mockDealsService", ['']);
    mockRegistrationService = jasmine.createSpyObj("mockRegistrationService", ['getUserAuthorization']);
    mockCoreService = jasmine.createSpyObj("mockCoreService", ['']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false })
      ],
      declarations: [
        AppNavigationComponent
      ],
      providers: [AppInsightWrapper, DealsService, RegistrationService, RegistrationService, CoreService, SignalRService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    TestBed.overrideProvider(AppInsightWrapper, { useValue: mockAppInsightWrapper });
    TestBed.overrideProvider(DealsService, { useValue: mockDealsService });
    TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
    TestBed.overrideProvider(CoreService, { useValue: mockCoreService });
    TestBed.compileComponents();
  }));


  beforeEach(() => {

    fixture = TestBed.createComponent(AppNavigationComponent);
    component = fixture.componentInstance;

    mockCoreService.appSettings ={environment:"",PEGSignalRBasePath:"https://localhost:7267/peglive"};
    mockCoreService.loggedInUser = { id:'',employeeCode:'',firstName:'test',lastName:'user',employeeOffice:0,profileImageUrl:'',securityRoles:[{id:4,name:'Multibidder Manager'}],token:'',displayName:'',familiarName:'',internetAddress:'',role:'',pages:[{id:1,name:'Dashboard',level:1,redirectionUrl:''}]}
    

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
