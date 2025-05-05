// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SharingModalComponent } from './sharing-modal.component';
// import { BsModalRef } from 'ngx-bootstrap/modal';
// import { Component } from '@angular/core';
// import { of, Observable } from 'rxjs';

// // interfaces
// import { Registrations } from "../../registrations/registrations/registrations";

// // modules
// import { SharedModule } from '../../shared/shared.module';
// import { HttpClientModule } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { NgSelectModule } from '@ng-select/ng-select';

// // services
// import { PegTostrService } from "../../core/peg-tostr.service";
// import { NewRegistrationService } from '../../registrations/new-registration/new-registration.service';
// import { RegistrationService } from "../../registrations/registrations/registration.service";
// import { RegistrationRequestService } from "../../registrations/registrations/registration-request-service";
// import { MockRegistrationRequestService } from '../../Mock/MockRegistrationRequestService';
// import { AuditLogService } from "../../shared/AuditLog/auditLog.service";
// import { GlobalService } from "../../global/global.service";

// describe('SharingModalComponent', () => {
//   let component: SharingModalComponent;
//   let fixture: ComponentFixture<SharingModalComponent>;

//   let mockRegistrationService;
//   let mockAuditLogService;
//   let mockPegTostrService;

//   let mockGlobalService;
//   let testHostComponent: TestHostComponent;
//   let testHostFixture: ComponentFixture<TestHostComponent>;

//   beforeEach(async () => {
//     mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationById', 'updateRegistrationDetails']);
//     mockAuditLogService = jasmine.createSpyObj('mockAuditLogService', ['addAuditLog']);
//     mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
//     mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getIndustrySectors']);

//     await TestBed.configureTestingModule({
//       declarations: [SharingModalComponent],
//       imports: [SharedModule, HttpClientTestingModule, HttpClientModule, NgSelectModule],
//       providers: [BsModalRef, RegistrationService, RegistrationRequestService, PegTostrService, AuditLogService, NewRegistrationService]
//     })
//       .compileComponents();

//     TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
//     TestBed.overrideProvider(AuditLogService, { useValue: mockAuditLogService });
//     TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
//     TestBed.overrideProvider(RegistrationRequestService, { useValue: MockRegistrationRequestService });
//     TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
//   });

//   beforeEach(() => {
//     testHostFixture = TestBed.createComponent(TestHostComponent);
//     testHostComponent = testHostFixture.componentInstance;

//     fixture = TestBed.createComponent(SharingModalComponent);
//     component = fixture.componentInstance;

//     let data = {
//       tdn: 'target',
//       cdn: 'clientdisplayename',
//       wti: 2,
//       wtn: 'worktypename',
//       ic: 'Intreset',
//       cd: null,
//       lsd: null,
//       stn: 'statusTypeName',
//       sd: null,
//       ceD: null,
//       hfc: 'Yes',
//       pte: 'Yes',
//       ptd: 'Yes',
//       in: {
//         industryId: '1',
//         industryName: 'Test'
//       },
//       case: {
//         caseCode: 1,
//         caseName: 'test',
//         caseStartDate: null,
//         caseEndDate: null
//       }
//     };

//     component.topLevelIndustries = [{ hierarchyLeft: 2, hierarchyRight: 42, industryId: '1', industryName: "Test Industry", isTopIndustry: true, abbreviation: "" }];
//     component.registrationId = 1;

//     mockRegistrationService.getRegistrationShareDeatails.and.returnValue(of([data]));
//     mockGlobalService.getIndustrySectors.and.returnValue(of([{ hierarchyLeft: 2, hierarchyRight: 42, industryId: '1', industryName: "Test Industry", isTopIndustry: true }]));

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     component.getRegistrationShareDeatails();
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   // it('should update Client Head', () => {
//   //   //Arrange
//   //   let reg = new Observable<Registrations>();
//   //   let obj = jasmine.createSpyObj(reg);
//   //   spyOn(component, "updateClientHeads").and.callThrough().and.returnValue(obj);

//   //   //Act
//   //   component.updateClientHeads('01tst');

//   //   //Assert
//   //   expect(component.updateClientHeads).toHaveBeenCalled();

//   // });

//   // it('should update Client Sector Lead', () => {
//   //   //Arrange
//   //   let reg = new Observable<Registrations>();
//   //   let obj = jasmine.createSpyObj(reg);
//   //   spyOn(component, "updateClientSectorLeads").and.callThrough().and.returnValue(obj);

//   //   //Act
//   //   component.updateClientSectorLeads('01tst');

//   //   //Assert
//   //   expect(component.updateClientSectorLeads).toHaveBeenCalled();

//   // });

//   // it('should update Others Involved', () => {
//   //   //Arrange
//   //   let reg = new Observable<Registrations>();
//   //   let obj = jasmine.createSpyObj(reg);
//   //   spyOn(component, "updateOthersInvolved").and.callThrough().and.returnValue(obj);

//   //   //Act
//   //   component.updateOthersInvolved('01tst');

//   //   //Assert
//   //   expect(component.updateOthersInvolved).toHaveBeenCalled();

//   // });

//   @Component({
//     selector: `host-component`,
//     template: `<app-sharing-modal></app-sharing-modal>`
//   })
//   class TestHostComponent { }
// });
