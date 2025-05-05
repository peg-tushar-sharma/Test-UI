import { async, ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { RegDetailsComponent } from './reg-details.component';
import { SharedModule } from '../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RegistrationService } from '../../registrations/registration.service';
import { AuditLogService } from '../../../shared/AuditLog/auditLog.service';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { NewRegistrationService } from '../../new-registration/new-registration.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegistrationRequestService } from '../../registrations/registration-request-service';
import { MockRegistrationRequestService } from '../../../Mock/MockRegistrationRequestService';
import { of, Observable } from 'rxjs';
import { Registrations } from '../../registrations/registrations';
import { Field } from '../../../shared/interfaces/field';
import { RoleFieldMapping } from '../../../shared/interfaces/roleFieldMapping';
import { fieldAuth } from '../../../shared/common/fieldAuth';
import { NO_ERRORS_SCHEMA, Component, SimpleChange } from '@angular/core';
import { GlobalService } from '../../../../app/global/global.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DealsService } from '../../../deals/deals.service'
import { PipelineService } from '../../../pipeline/pipeline.service';
import { industrSectorSubSector } from '../../../shared/interfaces/industrSectorSubsector';
import { InfoTextService } from '../../../../app/shared/info-icon/infoText.service';
// @Component({
//   selector: 'app-radio-list-select',
//   template: '<p>Mock Product Settings Component</p>'
// })
// class MockRadioSelectComponent {}

describe('RegDetailsComponent', () => {
  let component: RegDetailsComponent;
  let fixture: ComponentFixture<RegDetailsComponent>;
  let mockRegistrationService;
  let mockAuditLogService;
  let mockNewRegistrationService;
  let mockPegTostrService;
  let mockDealService;
  let mockPipelineService;
  let mockInfoTextService;
  let mockGlobalService;
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  beforeEach(waitForAsync(() => {
    mockNewRegistrationService = jasmine.createSpyObj('mockNewRegistrationService', ['getOffice', 'getEmployeeNames', 'Insert']);
    mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationDetails', 'getRegistrationData', 'getRegistrationStatus',
      'getRegistrationStage', 'updateRegistration', 'getProhibitions', 'getInvestments', 'getGridColumns', 'getRegistrationById', 'updateRegistrationDetails', 'getUserAuthorization', 'setFieldAuthorization', 'getWorkTypeData', 'getLocationofDeals']);
    mockAuditLogService = jasmine.createSpyObj('mockAuditLogService', ['addAuditLog']);
    mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
    mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getLocationofDeals', 'getWorkToStartData', 'getIndustrySectors', 'getWorkTypeData','getAllIndustrySectorsSubSectors','getOffice']);
    mockDealService = jasmine.createSpyObj('mockDealService', ['getCCMCasesByName']);
    mockPipelineService = jasmine.createSpyObj('mockPipelineService', ['createAutomatedPlaceholder']);
    mockPipelineService = jasmine.createSpyObj('mockPipelineService', ['createAutomatedPlaceholder']);
    mockInfoTextService=jasmine.createSpyObj('mockInfoTextService',['getInfoTooltipText']);
    

    TestBed.configureTestingModule({
      declarations: [RegDetailsComponent],
      imports: [SharedModule, BsDatepickerModule.forRoot(), HttpClientModule, HttpClientTestingModule, NgSelectModule],
      providers: [RegistrationService, PegTostrService, AuditLogService, NewRegistrationService, RegistrationRequestService, DealsService,InfoTextService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    TestBed.overrideProvider(NewRegistrationService, { useValue: mockNewRegistrationService });
    TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
    TestBed.overrideProvider(AuditLogService, { useValue: mockAuditLogService });
    TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
    TestBed.overrideProvider(RegistrationRequestService, { useValue: MockRegistrationRequestService });
    TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
    TestBed.overrideProvider(DealsService, { useValue: mockDealService });
    TestBed.overrideProvider(PipelineService, { useValue: mockPipelineService });
    TestBed.overrideProvider(InfoTextService, { useValue: mockInfoTextService });
    TestBed.compileComponents();
  }));

  beforeEach(() => {

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    fixture = TestBed.createComponent(RegDetailsComponent);
    component = fixture.componentInstance;
    let data = {
      tdn: 'target',
      cdn: 'clientdisplayename',
      wti: 2,
      wtn: 'worktypename',
      ic: 'Intreset',
      cd: null,
      lsd: null,
      stn: 'statusTypeName',
      sd: null,
      ceD: null,
      hfc: 'Yes',
      pte: 'Yes',
      ptd: 'Yes',
      in: {
        industryId: '1',
        industryName: 'Test'
      },
      case: {
        caseCode: 1,
        caseName: 'test',
        caseStartDate: null,
        caseEndDate: null
      }
    };

    let field: Field = {
      fieldId: 1,
      fieldName: 'clearanceStatus'
    }

    let staffingApproverRadiooptions = [
      { id: true, name: 'Yes' },
      { id: false, name: 'No' }

    ];
    let roleAuthorization: RoleFieldMapping = {
      roleFieldMappingId: 2,
      securityRoleId: 1,
      isVisible: true,
      isEditable: true,
      field: field
    };
    let industrySectorSubsectors:industrSectorSubSector={
      industries: [
        {
            industryId: '1',
            industryName: "industry 1",
            hierarchyLeft: 2,
            hierarchyRight: 2,
            isTopIndustry: true,
            abbreviation:null
        }
    ],
    sectors: [
        {
           industryId: 1,
           sectorId: 1,
           sectorName: "sector 1",
        }
    ],
    subSectors: [
        {
            sectorId: 1,
            subSectorId: 1,
            subSectorName: "sub sector 1",
        }
    ]
};

    component.fieldAuthConfig = new fieldAuth();
    component.topLevelIndustries = [{ hierarchyLeft: 2, hierarchyRight: 42, industryId: '1', industryName: "Test Industry", isTopIndustry: true, abbreviation: "" }];
    component.registrationId = 1;
    //component.fieldAuthConfig.txtIndustry = {isEditable: true}




    mockGlobalService.getWorkToStartData.and.returnValue(of([{ workToStartId: 1, workToStartName: 'test1' }, { workToStartId: 1, workToStartName: 'test2' }]));
    mockNewRegistrationService.getOffice.and.returnValue(of([{ officeCode: 1, OfficeName: 'NewDelhi-BCC' }]));
    mockRegistrationService.getRegistrationById.and.returnValue(of([data]));
    mockRegistrationService.getUserAuthorization.and.returnValue(of([roleAuthorization]));
    mockGlobalService.getLocationofDeals.and.returnValue(of([{ locationDealId: 1, locationName: 'test location', dealRegionId: 1 }, { locationDealId: 2, locationName: 'United States', dealRegionId: 1 }]));
    mockGlobalService.getIndustrySectors.and.returnValue(of([{ hierarchyLeft: 2, hierarchyRight: 42, industryId: '1', industryName: "Test Industry", isTopIndustry: true }]));
   mockGlobalService.getAllIndustrySectorsSubSectors.and.returnValue(of([industrySectorSubsectors]));
   mockGlobalService.getOffice.and.returnValue(of([{ officeCode:1,officeName:'NewDelhi-BCC',officeAbbr:'',officeCluster:''  }]));
    //mockRegistrationService.setFieldAuthorization.and.returnValue(of([fieldAuthele]));

    mockGlobalService.getWorkTypeData.and.returnValue(of(['']));
    mockRegistrationService.getWorkTypeData.and.returnValue(of([{ workTypeId: 1, workTypeName: 'debt' }, { workTypeId: 2, workTypeName: 'equity' }]));
mockInfoTextService.getInfoTooltipText.and.returnValue(of('test'));

    fixture.detectChanges();
  });

  it('should create', () => {
    component.getRegistrationDetails();
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update industry', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);    //Arrange

    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.updateRegistrations('test Industry', 'in');

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update website', () => {
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);    //Arrange
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.updateRegistrations('test Website', 'ws');

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update ProjectName', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);

    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.updateRegistrations('test ProjectName', 'pn');

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Location', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.onDealLocationChanged({ dealRegionId: 1, locationDealId: 2, locationName: 'test location' });

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update workToStart', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.onWorkToStartChanged({ workToStartId: 1, workToStartName: 'test' });

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('Should update Open Market Purchase value for Registration', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.iompChange(true);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();
  });

  it('should update Publicly Traded Equity', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.pteChange(true);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Publicly Traded Debt', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.ptdChange(true);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update CarveOut', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.coChange(true);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update spac', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.spacChange(true);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });


  // Commented due to testing was affected
  // TODO: fix this test case
  // it('should update client Hedge Fund', () => {
  //   //Arrange
  //   let reg = new Observable<Registrations>();
  //   let obj = jasmine.createSpyObj(reg);
  //   spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

  //   //Act
  //   component.registration.hfc = true;

  //   //Assert
  //   expect(component.updateRegistrationData).toHaveBeenCalled();

  // });

  it('should update Client Head', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.updateClientHeads('01tst');

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Client Sector Lead', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.updateClientSectorLeads('01tst');

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Others Involved', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.updateOthersInvolved('01tst');

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Staffing Approver', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.updateStaffingApprover('01tst');

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Staffing Restriction', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.onStaffingRestrictionsChanged(true);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Bain Office', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    //Act
    component.onBainOfficeChanged(101);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Commit Date', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);
    const commitDate = { date: null, epoc: null, formatted: null, jsdate: new Date() };

    //Act
    component.updateCommitDate(commitDate);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should update Completed Date', () => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);
    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);
    const completedDate = { date: null, epoc: null, formatted: null, jsdate: new Date() };

    //Act
    component.updateCompletedDate(completedDate);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  });

  it('should Call NgOnChange', () => {
    component.registrationId = 1;
    component.ngOnChanges({
      changes: new SimpleChange(null, component.registrationId, true)
    });
    fixture.detectChanges();
    expect(component.registrationId).not.toBeNull();
  });

  it('should Call NgOnChange to update commitDate', () => {
    testHostComponent.setCommitDate('2021-04-08');
    testHostFixture.detectChanges();
    expect(component.registration.cd).not.toBeNull();
  });

  it('Should update target value for Registration', fakeAsync(() => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);

    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    component.updateRegistrations('test target', 'tdn');

    expect(component.updateRegistrationData).toHaveBeenCalled();

  })
  );

  it('Should update Target Owner/Parent Company value for Registration', fakeAsync(() => {
    //Arrange
    let reg = new Observable<Registrations>();
    let obj = jasmine.createSpyObj(reg);

    spyOn(component, "updateRegistrationData").and.callThrough().and.returnValue(obj);

    component.updateRegistrations('test target owner', 'cr');

    expect(component.updateRegistrationData).toHaveBeenCalled();
  })
  );

  // Client is currently not editable from the Registrations flyout
  /*it('Should update Client value for Registration', fakeAsync(() => {
    //Arrange
    spyOn(component, "updateRegistrationData").and.callThrough();


    //Act
    tick();
    fixture.detectChanges();
    fixture.nativeElement.querySelector("input.client-input").focus();
    fixture.detectChanges();

    const focusOut = new FocusEvent('focusout');
    let textElement = fixture.nativeElement.querySelector('div.form-inline input#editableText');
    textElement.value = "test";
    textElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(100);

    textElement.dispatchEvent(focusOut);

    //Assert
    expect(component.updateRegistrationData).toHaveBeenCalled();

  })
  );*/

  // Commenting out as work type is no longer editable in the Registrations flyout
  /*it('Should update work type value for Registration', fakeAsync(() => {
    //Arrange
    const spyUpdateRegistration = spyOn(component, "updateRegistrationData").and.callThrough();
    component.workTypes = [
      {
        workTypeId: 1,
        workTypeName: 'test'
      },
      {
        workTypeId: 2,
        workTypeName: 'test1'
      },

    ]

    //Act
    const select = fixture.nativeElement.querySelectorAll('ng-select');
    select.value = 2;  // <-- select a new value
    fixture.detectChanges();
    select.dispatchEvent(new Event('ngModelChange'));
    fixture.detectChanges();
    tick(100);

    //Assert
    expect(spyUpdateRegistration).toHaveBeenCalled();

  })
  );*/

  @Component({
    selector: `host-component`,
    template: `<app-reg-details  [fieldAuthConfig]="fieldAuthConfig"     [sgTI]="sgTI" [completionDate]="completionDate" [commitDate]="commitDate" [registrationId]="registrationId"></app-reg-details>`
  })
  class TestHostComponent {
    private sgTI: any;
    private completionDate: any;
    private commitDate: any;
    private registrationId: any;
    public fieldAuthConfig: fieldAuth;
    setCommitDate(val: any) {
      this.commitDate = val;
    }

  }

});
