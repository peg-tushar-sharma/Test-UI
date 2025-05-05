import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { NgSelectModule } from "@ng-select/ng-select";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { of } from "rxjs";
import { AppInsightWrapper } from "../../applicationInsight/appInsightWrapper";
import { CoreService } from "../../core/core.service";
import { PegTostrService } from "../../core/peg-tostr.service";
import { ErrorService } from "../../error/error.service";
import { HttpErrorHandler } from "../../error/http-error-handler.service";
import { GlobalService } from "../../global/global.service";
import { RegistrationService } from "../../registrations/registrations/registration.service";
import { commonUtility } from "../../shared/common/common-utility";
import { InfoTextService } from "../../shared/info-icon/infoText.service";
import { LocationTreeViewService } from "../../shared/location-tree-view/location-tree-view.service";
import { SharedModule } from "../../shared/shared.module";
import { NewOpportunityComponent } from "./new-opportunity.component";
import { NewOpportunityService } from "./new-opportunity.service";
import { OpportunityFormBuilder } from "./newopportunityform";

describe('NewOpportunityComponent', () => {

    let routes:Routes = [
        {
            path: "newopportunity",
            component: NewOpportunityComponent
        }, {
            path: 'newopportunity/:registrationId',
            component: NewOpportunityComponent,
        },
        {
            path: 'newopportunity/:registrationId/:source',
            component: NewOpportunityComponent,
        },
    ];

    let component: NewOpportunityComponent;
    let fixture: ComponentFixture<NewOpportunityComponent>;

    let mockOpportunityService;
    let mockPegTostrService;
    let mockGlobalService;
    let mockInfoTextService;
    let mockRegistrationService;
    let mockCoreService;
    let mockLocationTreeViewService;
    let mockAppInsightWrapper;


    beforeEach(async(() => {
        mockAppInsightWrapper = jasmine.createSpyObj("mockAppInsightWrapper", ['logEvent']);
        mockOpportunityService = jasmine.createSpyObj('mockOpportunityService', ['getOffice', 'getEmployeeNames', 'Insert', 'getIndustries', 'getClientsByName','getLocationOfDealByEmployeeCode', 'getEmployeeByName', 'getNewOpportunityById']);
        mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationData', 'getRegistrationStatus']);
        mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
        mockInfoTextService = jasmine.createSpyObj('mockInfoTextService', ['getInfoTooltipText']);
        mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getLocationofDeals', 'getWorkTypeData', 'getWorkToStartData','getIndustrySectors', 'getOfficeHierarchy']);
        mockCoreService = jasmine.createSpyObj('mockCoreService', ['loggedInUser', 'editProhibition', 'addProhibition', 'updateProhibition']);
        mockLocationTreeViewService = jasmine.createSpyObj('mockLocationTreeViewService', ['patchLocationTree', 'updateCompleteLocationTree', 'setSelectedOfficesCode', 'markCheckTrueForOffices', 'markCheckTrueForChildren']);

        setMockData();

        TestBed.configureTestingModule({
            declarations: [NewOpportunityComponent],
            providers: [NewOpportunityService, RegistrationService, HttpErrorHandler, ErrorService, 
              PegTostrService, InfoTextService, CoreService, commonUtility, OpportunityFormBuilder, LocationTreeViewService, AppInsightWrapper],
            imports: [HttpClientTestingModule, ReactiveFormsModule, NgSelectModule, RouterTestingModule.withRoutes(routes), SharedModule, BsDatepickerModule.forRoot()]
        });
        TestBed.overrideProvider(AppInsightWrapper, { useValue: mockAppInsightWrapper });
        TestBed.overrideProvider(NewOpportunityService, { useValue: mockOpportunityService });
        TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
        TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
        TestBed.overrideProvider(InfoTextService, { useValue: mockInfoTextService });
        TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
        TestBed.overrideProvider(CoreService, {useValue: mockCoreService});
        TestBed.overrideProvider(LocationTreeViewService, {useValue: mockLocationTreeViewService});
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewOpportunityComponent);
        component = fixture.componentInstance;

        mockGlobalService.getOfficeHierarchy.and.returnValue(of(['']));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open section on yes', () => {
        // Arrange

        // Act
        fixture.nativeElement.querySelectorAll('input#sectionToggleExpertsOn')[0].click();
        fixture.detectChanges();
        fixture.nativeElement.querySelectorAll('input#sectionTogglePipelineOn')[0].click();
        fixture.detectChanges();

        // Assert
        expect(component.formSections[2].show).toEqual(true);
        expect(component.formSections[3].show).toEqual(true);
        expect(component.experts.enabled).toEqual(true);
        expect(component.pipeline.enabled).toEqual(true);

    });

    let setMockData = () => {
        // set Mock User
        mockCoreService.loggedInUser = {
          displayName: null
          , employeeCode: "47081"
          , employeeOffice: 111
          , familiarName: null
          , firstName: "Manav"
          , id: '13'
          , internetAddress: null
          , lastName: "Agarwal"
          , pages: [{ id: 2, name: "Dashboard", level: 1, redirectionUrl: "dashboard", isModal: false, modalTarget: 'test', isHideInNavigation: false, claims: "" }]
          , profileImageUrl: "http://gxcdocs.local.bain.com/gxc3/files/Employee_Images/47081"
          , role: null
          , securityRoles: [{ id: 5, name: "PEG Administrator" }]
          , token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ik1hbmF2Iiwicm9sZSI6IlBFRyBBZG1pbmlzdHJhdG9yIiwibmJmIjoxNTYyMDYwMTYxLCJleHAiOjE1NjI2NjQ5NjEsImlhdCI6MTU2MjA2MDE2MX0.vf8kP3iyhaZfDtaV3q24qAC09IjakX-T6TkUGC2yi8s"
          , officeAbbreviation: 'NDL'
          , employeeRegion: 'Asia/Pacific'
          , employeeRegionId: 1
        };
    }

});