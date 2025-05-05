// import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync, flush } from '@angular/core/testing';
// import { RegistrationsComponent } from './registrations.component';
// import { RegistrationService } from './registration.service';
// import { of } from 'rxjs';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { RegistrationStatus } from '../../shared/interfaces/registrationStatus';
// import { RegistrationStage } from '../../shared/interfaces/RegistrationStage';
// import { PegTostrService } from '../../core/peg-tostr.service';
// import { CoreModule } from '../../core/core.module';
// import { RegistrationRequestService } from './registration-request-service';
// import { MockRegistrationRequestService } from '../../Mock/MockRegistrationRequestService';
// import { By } from "@angular/platform-browser";
// import { Registrations } from './registrations'
// import { SharedModule } from '../../shared/shared.module';
// import { Prohibition } from '../prohibitions/prohibition';
// import { AuditLogService } from '../../shared/AuditLog/auditLog.service';
// import { Investment } from './investment';
// import { RegistrationGridService } from './registration-grid.service';
// import { GridColumn } from '../../shared/interfaces/models';
// import { HttpClientModule } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { HttpErrorHandler } from '../../error/http-error-handler.service';
// import { ErrorService } from '../../error/error.service';
// import { CoreService } from '../../core/core.service';
// import { RoleFieldMapping } from '../../shared/interfaces/roleFieldMapping';
// import { Field } from '../../shared/interfaces/field';
// import { Routes } from '@angular/router';
// import { DealsService } from '../../deals/deals.service'
// import { GlobalService } from '../../global/global.service';
// import { Partnership } from './partnership';
// import { Subject } from 'rxjs';
// import { NewRegistrationService } from '../new-registration/new-registration.service';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { RouterTestingModule } from '@angular/router/testing';
// import { PipelineService } from '../../pipeline/pipeline.service';
// import { Priority } from '../../shared/interfaces/priority';
// import { NoteService } from '../sidebar-notes/sidebar-notes.service';

// describe('RegistrationsComponent', () => {
//   let component: RegistrationsComponent;
//   let fixture: ComponentFixture<RegistrationsComponent>;
//   let mockRegistrationService;
//   let registrationStatus: HTMLElement;
//   let mockAuditLogService;
//   let mockcoreService: CoreService;
//   let mockDealService;
//   let mockPipelineService: PipelineService;
//   let mockGlobalService;
//   let mockNewRegistrationservice;
//   let editProhibition: Subject<any> = new Subject<any>();
//   let addProhibition: Subject<any> = new Subject<any>();
//   let updateProhibition: Subject<any> = new Subject<any>();
//   let mockNoteService;
//   let routes: Routes = [
//     {
//       path: 'search/:id',
//       component: Registrations
//     },
//     {
//       path: 'registrations',
//       component: Registrations
//     }
//   ];

//   beforeEach(waitForAsync(() => {
//     mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationData', 'getRegistrationStatus', 'getRegistrationById',
//       'getRegistrationStage', 'updateRegistration', 'getProhibitions', 'getInvestments', 'getGridColumns', 'getWorkTypeData', 'getUserColumns',
//       'getUserAuthorization', 'setFieldAuthorization', 'getPartnership', 'getClientPriorityByClientId']);
//     mockAuditLogService = jasmine.createSpyObj('mockAuditLogService', ['addAuditLog', 'addAuditLogForbidders']);
//     mockDealService = jasmine.createSpyObj('mockAuditLogService', ['getDeals', 'convertToDeal']);
//     mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getRegistrationStage', 'getWorkTypeData', 'getWorkToStartData', 'getLocationofDeals', 'getIndustrySectors','getOffice']);
//     mockcoreService = jasmine.createSpyObj('mockcoreService', ['loggedInUser', 'editProhibition', 'addProhibition', 'updateProhibition']);
//     mockNewRegistrationservice = jasmine.createSpyObj('mockNewRegistrationservice', ['getClientsByName', 'getOffice']);
//     mockPipelineService = jasmine.createSpyObj('mockPipelineService', ['savePipelineColumnPrefrences']);
//     mockNoteService = jasmine.createSpyObj('mockNoteService', ['getGeneralNotes', 'saveNewNote', 'updateNote', 'getRelatedTrackerClientsByRegistrationId'])
//     mockcoreService.editProhibition = editProhibition;
//     mockcoreService.addProhibition = addProhibition;
//     mockcoreService.updateProhibition = updateProhibition;

//     setMockData();
//     TestBed.configureTestingModule({
//       declarations: [RegistrationsComponent],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       providers: [RegistrationService, PegTostrService, HttpErrorHandler, ErrorService, RegistrationRequestService, AuditLogService, DealsService,
//         RegistrationGridService, NewRegistrationService, CoreService, PipelineService],
//       imports: [
//         CoreModule,
//         SharedModule,
//         HttpClientModule,
//         HttpClientTestingModule,
//         NgSelectModule,
//         SharedModule,
//         RouterTestingModule.withRoutes(routes)
//       ],
//     });
//     TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
//     TestBed.overrideProvider(RegistrationRequestService, { useValue: MockRegistrationRequestService });
//     TestBed.overrideProvider(AuditLogService, { useValue: mockAuditLogService });
//     TestBed.overrideProvider(CoreService, { useValue: mockcoreService });
//     TestBed.overrideProvider(DealsService, { useValue: mockDealService });
//     TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
//     TestBed.overrideProvider(NewRegistrationService, { useValue: mockNewRegistrationservice });
//     TestBed.overrideProvider(PipelineService, { useValue: mockPipelineService });
//     TestBed.overrideProvider(NoteService, { useValue: mockNoteService });
//     TestBed.compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RegistrationsComponent);
//     component = fixture.componentInstance;

//     let data = {
//       tdn: 'target',
//       cl: {},
//       wti: 2,
//       wtn: 'worktypename',
//       ic: 'Intreset',
//       cd: null,
//       lsd: null,
//       stn: 'statusTypeName',
//       sd: null,
//       ceD: null,
//       hfc: 'Yes',
//       pte: 'false',
//       ptd: 'false',
//       rt: 1,
//     };

//     let object = {
//       data: {
//         tdn: 'target',
//         cl: {},
//         wti: 2,
//         wtn: 'worktypename',
//         ic: 'Intreset',
//         cd: null,
//         lsd: null,
//         stn: 'statusTypeName',
//         sd: null,
//         ceD: null,
//         hfc: 'Yes',
//         pte: 'false',
//         ptd: 'false',
//         rt: 1,
//       },
//       column: {
//         colDef: {
//           editable: false
//         }
//       }
//     }

//     let registrationStatus: RegistrationStatus = {
//       registrationStatusId: 1,
//       statusTypeName: 'status', sortOrder: 0
//     }

//     let registrationStage: RegistrationStage = {

//       registrationStageId: 1,
//       stageTypeName: 'stage'
//     }

//     let Prohibitions: Prohibition[] = [
//       <Prohibition>{
//         ti: 1,
//         tdn: '',
//         id: 1,
//         ln: '',
//         lsd: null
//       },
//       <Prohibition>{
//         ti: 2,
//         tdn: '',
//         id: 2,
//         ln: '',
//         lsd: null
//       }
//     ]

//     let Investment: Investment[] = [
//       {
//         id: 1,
//         lsd: null,
//         tdn: 'abc',
//         ud: null
//       } as Investment,
//       {
//         id: 2,
//         lsd: null,
//         tdn: 'def',
//         ud: null
//       } as Investment
//     ]

//     let gridColumn: GridColumn = {
//       field: "tdn",
//       filter: "textFilterComponent",
//       headerName: "Target",
//       isQuickFilter: true,
//       order: 1,
//       sort: "asc",
//       type: "text",
//       maxWidth: 130,
//       filterParams: "",
//       isEditable: true,
//       isRowGroup: false,
//       isRowDrag: false,
//       splitChar: "",
//       cellEditor: '',
//       cellRenderer: '',
//       tooltipComponent: '',
//       headerClass: '',
//       hasMiniFilter: false,
//       isMasked: false,
//       isHide: false,
//       isDefault: false,
//       hide: false,
//       sortOrder: 0,
//       roleSortOrder: 0,
//       isFilterable: false,
//       isOppName: false,
//       oppSortOrder: 0,
//       isDefaultOppName: false,
//       includeAsOppName: false,
//       columnId: 0,
//       rowGroupIndex: 0,
//       columnWidth: 0,
//       delimiter: "",
//       isDropdownVisible: false
//     };

//     let field: Field = {
//       fieldId: 1,
//       fieldName: 'clearanceStatus'
//     }

//     let roleAuthorization: RoleFieldMapping = {
//       roleFieldMappingId: 2,
//       securityRoleId: 1,
//       isVisible: true,
//       isEditable: true,
//       field: field
//     };

//     let Partnership: Partnership[] = [
//       {
//         partnershipId: 1,
//         company: 'test',
//         submissionDate: null
//       } as Partnership,
//       {
//         partnershipId: 1,
//         company: 'test',
//         submissionDate: null
//       } as Partnership,
//     ]


//     component.fieldAuth = {
//       txtTarget: { isEditable: true, isVisible: true, isMasked: false },
//       workTypeName: { isEditable: true, isVisible: true, isMasked: false },
//       txtClient: { isEditable: true, isVisible: true, isMasked: false },
//       openMarketPurchase: { isEditable: true, isVisible: true, isMasked: false },
//       txtCorpRel: { isEditable: true, isVisible: true, isMasked: false },
//       stageTypeName: { isEditable: true, isVisible: true, isMasked: false },
//       txtIndustry: { isEditable: true, isVisible: true, isMasked: false },
//       workToStart: { isEditable: true, isVisible: true, isMasked: false },
//       txtWebsite: { isEditable: true, isVisible: true, isMasked: false },
//       clearanceStatus: { isEditable: true, isVisible: true, isMasked: false },
//       PTE: { isEditable: true, isVisible: true, isMasked: false },
//       CO: { isEditable: true, isVisible: true, isMasked: false },
//       PTD: { isEditable: true, isVisible: true, isMasked: false },
//       HF: { isEditable: true, isVisible: true, isMasked: false },
//       bainOffice: { isEditable: true, isVisible: true, isMasked: false },
//       clientHead: { isEditable: true, isVisible: true, isMasked: false },
//       clientSectorLead: { isEditable: true, isVisible: true, isMasked: false },
//       othersInvolved: { isEditable: true, isVisible: true, isMasked: false },
//       restrictions: { isEditable: true, isVisible: true, isMasked: false },
//       staffingApprover: { isEditable: true, isVisible: true, isMasked: false },
//       txtProjectName: { isEditable: true, isVisible: true, isMasked: false },
//       txtLocation: { isEditable: true, isVisible: true, isMasked: false },
//       commitDate: { isEditable: true, isVisible: true, isMasked: false },
//       completedDate: { isEditable: true, isVisible: true, isMasked: false },
//       addNote: { isEditable: true, isVisible: true, isMasked: false },
//       auditLog: { isEditable: true, isVisible: true, isMasked: false },
//       resendEmail: { isEditable: true, isVisible: true, isMasked: false },
//       newDeal: { isEditable: true, isVisible: true, isMasked: false },
//       downloadReport: { isEditable: true, isVisible: true, isMasked: false },
//       downloadPipelineReport: { isEditable: true, isVisible: true, isMasked: false },
//       SPAC: { isEditable: true, isVisible: true, isMasked: false },
//       saveDeal: { isEditable: true, isVisible: true, isMasked: false },
//       txtCaseCode: { isEditable: true, isVisible: true, isMasked: false },
//       txtCaseName: { isEditable: true, isVisible: true, isMasked: false },
//       caseStartDate: { isEditable: true, isVisible: true, isMasked: false },
//       caseEndDate: { isEditable: true, isVisible: true, isMasked: false },
//       caseOffice: { isEditable: true, isVisible: true, isMasked: false },
//       isREN: { isEditable: true, isVisible: true, isMasked: false },
//       sector: { isEditable: true, isVisible: true, isMasked: false },
//       estimatedStartDate: { isEditable: false, isVisible: true, isMasked: false },
//     }

//     let clientPriority: Priority = {
//       priorityId: 0,
//       priorityName: 'Px',
//       sortOrder: 0
//     }

//     mockRegistrationService.getRegistrationData.and.returnValue(of([data]));
//     mockRegistrationService.getRegistrationStatus.and.returnValue(of([registrationStatus]));
//     mockRegistrationService.getRegistrationStage.and.returnValue(of([registrationStage]));
//     mockRegistrationService.getProhibitions.and.returnValue(of([Prohibitions]));
//     mockRegistrationService.getRegistrationById.and.returnValue(of([data]));
//     mockRegistrationService.getInvestments.and.returnValue(of([Investment]));
//     mockRegistrationService.getPartnership.and.returnValue(of([Partnership]));
//     mockRegistrationService.getUserColumns.and.returnValue(of([gridColumn]));
//     mockRegistrationService.getUserAuthorization.and.returnValue(of([roleAuthorization]));
//     mockGlobalService.getRegistrationStage.and.returnValue(of(['']));
//     mockGlobalService.getWorkTypeData.and.returnValue(of(['']));
//     mockGlobalService.getWorkToStartData.and.returnValue(of([{ workToStartId: 1, workToStartName: 'test1' }, { workToStartId: 1, workToStartName: 'test2' }]));
//     mockGlobalService.getIndustrySectors.and.returnValue(of([{ hierarchyLeft: 2, hierarchyRight: 42, industryId: '1', industryName: "Test Industry", isTopIndustry: true }]));
//     mockRegistrationService.getClientPriorityByClientId.and.returnValue(of([clientPriority]));
//     mockNewRegistrationservice.getOffice.and.returnValue(of([{ officeCode: 1, OfficeName: 'NewDelhi-BCC' }]));

//     mockGlobalService.getLocationofDeals.and.returnValue(of([{ locationDealId: 1, locationName: 'test location', dealRegionId: 1 }, { locationDealId: 2, locationName: 'United States', dealRegionId: 1 }]));

//     mockNoteService.getRelatedTrackerClientsByRegistrationId.and.returnValue(of([{ locationDealId: 1, locationName: 'test location', dealRegionId: 1 }, { locationDealId: 2, locationName: 'United States', dealRegionId: 1 }]));

//     //mockRegistrationService.setFieldAuthorization.and.returnValue(of([fieldAuthele]));
//     mockRegistrationService.getWorkTypeData.and.returnValue(of([{ workTypeId: 1, workTypeName: 'debt' }, { workTypeId: 2, workTypeName: 'equity' }]));
//     mockDealService.convertToDeal;
//     component.onCellClicked(object);
//     fixture.detectChanges();

//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//     expect(component.columnDefs[0].headerName).toBe('Target');
//     expect(component.rowData[0].pte).toBeTruthy();
//   });

//   it('Status of the registration slide popup', () => {
//     fixture.detectChanges();
//     registrationStatus = fixture.nativeElement.querySelector('#idStatusTypeName');
//     expect(registrationStatus.innerHTML).toContain('Status');
//   });

//   it('Multibidder value in the dropdown', () => {
//     component.showMultibidder = true;
//     fixture.detectChanges();
//     const multiBidder = fixture.nativeElement.querySelector('.multibidder');
//     expect(multiBidder).toBeTruthy();
//   });

//   it('Should update Status value for Registration', fakeAsync(() => {
//     //Arrange
//     let object = {
//       data: {
//         tdn: 'target',
//         cl: {
//           clientId: 1,
//           clientName: 'test client'
//         },
//         wti: 2,
//         wtn: 'worktypename',
//         ic: 'Intreset',
//         cd: null,
//         lsd: null,
//         stn: {
//           registrationStatusId: 1,
//           statusTypeName: 'Cleared'
//         },
//         sd: null,
//         ceD: null,
//         hfc: 'Yes',
//         pte: 'Yes',
//         ptd: 'Yes'
//       },
//       column: {
//         colDef: {
//           editable: false
//         }
//       }
//     };
//     spyOn(component, "updateRegistrationData").and.callThrough();


//     //Act
//     component.onCellClicked(object);
//     fixture.detectChanges();
//     fixture.nativeElement.querySelector("div.clearance-status button.dropdown-toggle").click();
//     fixture.detectChanges();
//     fixture.nativeElement.querySelectorAll('div.clearance-status li')[1].click();

//     //Assert
//     let input = fixture.debugElement.query(By.css('#btnStatusApply'));
//     input.triggerEventHandler('click', null);
//     fixture.detectChanges();
//     expect(component.updateRegistrationData).toHaveBeenCalled();

//   })
//   );

//   // it('Should update Stage value for Registration', fakeAsync(() => {
//   //   //Arrange
//   //   let object = {
//   //     data: {
//   //       tdn: 'target',
//   //       cl: {
//   //         clientId: 1,
//   //         clientName: 'test client'
//   //       },
//   //       wti: 2,
//   //       wtn: 'worktypename',
//   //       ic: 'Intreset',
//   //       cd: null,
//   //       lsd: null,
//   //       stn: {
//   //         registrationStatusId: 1,
//   //         statusTypeName: 'Cleared'
//   //       },
//   //       sd: null,
//   //       ceD: null,
//   //       hfc: 'Yes',
//   //       pte: 'Yes',
//   //       ptd: 'Yes',
//   //       sgTI: 1,
//   //       sgTN: 'Interest'
//   //     },
//   //     column: {
//   //       colDef: {
//   //         editable: false
//   //       }
//   //     }
//   //   };

//   //   spyOn(component, "updateRegistrationData").and.callThrough();

//   //   component.registrationStage = [
//   //     {
//   //       registrationStageId: 1,
//   //       stageTypeName: 'Interest'
//   //     },
//   //     {
//   //       registrationStageId: 2,
//   //       stageTypeName: 'Commitment'
//   //     }
//   //   ]
//   //   //Act
//   //   component.onStageClicked();
//   //   fixture.detectChanges();
//   //   fixture.nativeElement.querySelectorAll("button.dropdown-toggle.stage")[0].click();
//   //   fixture.detectChanges();

//   //   const select = fixture.nativeElement.querySelectorAll('button.dropdown-toggle.stage + ul ul')[0];

//   //   select.querySelectorAll('li')[1].click();  // <-- select a new value
//   //   fixture.detectChanges();
//   //   tick();
//   //   select.dispatchEvent(new Event('ngModelChange'));
//   //   fixture.detectChanges();
//   //   tick(100);

//   //   //Assert
//   //   expect(component.updateRegistrationData).toHaveBeenCalled();

//   // })
//   // );

//   let setMockData = () => {
//     // set Mock User
//     mockcoreService.loggedInUser = {
//       displayName: null
//       , employeeCode: "47081"
//       , employeeOffice: 111
//       , familiarName: null
//       , firstName: "Manav"
//       , id: '13'
//       , internetAddress: null
//       , lastName: "Agarwal"
//       , pages: [{ id: 2, name: "Dashboard", level: 1, redirectionUrl: "dashboard", isModal: false, modalTarget: 'test', isHideInNavigation: false, claims: "" }]
//       , profileImageUrl: "http://gxcdocs.local.bain.com/gxc3/files/Employee_Images/47081"
//       , role: null
//       , securityRoles: [{ id: 5, name: "PEG Administrator" }]
//       , token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ik1hbmF2Iiwicm9sZSI6IlBFRyBBZG1pbmlzdHJhdG9yIiwibmJmIjoxNTYyMDYwMTYxLCJleHAiOjE1NjI2NjQ5NjEsImlhdCI6MTU2MjA2MDE2MX0.vf8kP3iyhaZfDtaV3q24qAC09IjakX-T6TkUGC2yi8s"
//       , officeAbbreviation: 'NDL'
//       , employeeRegion: 'Asia/Pacific'
//       , employeeRegionId: 1
//     };
//   }
// });
