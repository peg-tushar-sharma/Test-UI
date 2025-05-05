// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { PipelineComponent } from './pipeline.component';
// import { RegistrationService } from '../../registrations/registrations/registration.service';
// import { PegTostrService } from '../../core/peg-tostr.service';
// import { RegistrationGridService } from '../../registrations/registrations/registration-grid.service';
// import { PipelineService } from '../pipeline.service'; 
// import { of } from 'rxjs';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { Pipeline } from '../pipeline';
// import { RoleFieldMapping } from '../../shared/interfaces/roleFieldMapping';
// import { Field } from '../../shared/interfaces/field';
// import { PipelineGridColumnService } from '../../shared/grid-generator/pipeline-grid-colum.service';
// import { Overlay } from '@angular/cdk/overlay';
// import { CoreService } from '../../core/core.service';
// import { GlobalService } from './../../global/global.service';

// describe('PipelineComponent', () => {
//   let component: PipelineComponent;
//   let fixture: ComponentFixture<PipelineComponent>;
//   let mockRegistrationService;
//   let mockPipelineService;
//   let mockPegTostrService;
//   let mockRegistrationGridService;
//   let mockCoreService;
//   let mockGlobalService;
//   let mockPipelineGridColumnService;

//   beforeEach(async(() => {

//     mockPipelineService = jasmine.createSpyObj("mockPipelineService",["getPipelineData"]);
//     mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
//     mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationData', 'getRegistrationStatus',
//     'getRegistrationStage', 'updateRegistration', 'getProhibitions', 'getInvestments', 'getGridColumns', 'getWorkTypeData', 'getUserAuthorization', 'setFieldAuthorization']);
//     mockRegistrationGridService = jasmine.createSpyObj('mockRegistrationGridService', ['getColumnDefinitions']);
//     mockGlobalService = jasmine.createSpyObj("mockGlobalService", ['getRegistrationStage', 'getRegions', 'getPipelineGroupData']);
//     mockPipelineGridColumnService = jasmine.createSpyObj("mockPipelineGridColumnService", ['getRegistrationStage', 'getColumnDefinitions']);
//     ;

//     TestBed.configureTestingModule({
//       declarations: [ PipelineComponent ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[HttpClientModule, HttpClientTestingModule],
//       providers:[RegistrationService,PegTostrService,RegistrationGridService,PipelineService,PipelineGridColumnService, Overlay]
//     });
//     TestBed.overrideProvider(RegistrationService,{useValue:mockRegistrationService});
//     TestBed.overrideProvider(PegTostrService, {useValue: mockPegTostrService});
//     TestBed.overrideProvider(RegistrationGridService,{useValue:mockRegistrationGridService});
//     TestBed.overrideProvider(PipelineService,{useValue: mockPipelineService});
//     TestBed.overrideProvider(CoreService, {useValue: mockCoreService});
//     TestBed.overrideProvider(GlobalService, {useValue: mockGlobalService});
//     TestBed.overrideProvider(PipelineGridColumnService, {useValue: mockPipelineGridColumnService});
    
//     TestBed.compileComponents();
//   }));

//   beforeEach(() => {    
//     Object.defineProperty(mockCoreService, 'loggedInUser', {value: {pages:[]}});
//     fixture = TestBed.createComponent(PipelineComponent);
//     component = fixture.componentInstance;

//     let pipeline: Pipeline = { targetName:"test", clientName:"test", duration:{startDuration:10, endDuration:12, quantifier:'test'},expectedLeaderShip:"test", industryName:"tets",lastUpdatedDate:new Date(),likelihood:"test"
//                                 ,pipelineId:1, progressUpdate:"test",projectNickName:"test",sector:"test", stage:"test",subSector:"test", teamSize:2,workStartDate: new Date(),
//                               groupId:0,groupName:'test',expectedStartDate:new Date(),expectedEndDate:new Date(),expectedStartDateQuantifier:'',clientPriority:'',durationQuantifier:'',
//                               opportunityType:'', estimatedStartDate:'', isFlagged: false,lastUpdatedBy:'',preference:'',durationPeriod:'2-3?',lastClientUpdate:undefined};
//     mockPipelineService.getPipelineData.and.returnValue(of([pipeline]));
//     mockRegistrationService.getGridColumns.and.returnValue(of([
//       { headerName: 'Target', field: 'targetName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
//       { headerName: 'Client', field: 'clientName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
//       { headerName: 'industry', field: 'industryName', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false },
//       { headerName: 'test', field: 'test', filter: '', type: 'text', order: 1, sort: 'asc', isQuickFilter: false, tooltipField: '', maxWidth: 110, isEditable: false }
//     ]));
//     mockGlobalService.getRegistrationStage.and.returnValue(of(['']));
//     mockGlobalService.getRegions.and.returnValue(of(['']));
//     mockGlobalService.getPipelineGroupData.and.returnValue(of(['']));
//     mockPipelineGridColumnService.getRegistrationStage.and.returnValue(of(['']));

//     let field : Field = {
//       fieldId: 32,
//       fieldName:'downloadPipelineReport'
//     }


//     let roleAuthorization: RoleFieldMapping ={
//       roleFieldMappingId: 2,
//       securityRoleId:1,
//       isVisible: true,
//       isEditable: true,
//       field: field
//     };

//     mockRegistrationService.getUserAuthorization.and.returnValue(of([roleAuthorization]));
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
