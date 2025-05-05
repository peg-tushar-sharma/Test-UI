// import { async, ComponentFixture, TestBed, tick, fakeAsync } from "@angular/core/testing";
// import { PartnerDashboardComponent } from "./partner-dashboard.component";
// import { PartnerDashboardService } from "./partner-dashboard.service";
// import { HttpErrorHandler } from "../../error/http-error-handler.service";
// import { HttpClientModule } from "@angular/common/http";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { ErrorService } from "../../error/error.service";
// import { mockDashBoardRegistrations } from "../../Mock/MockDashBoardService";
// import { of } from "rxjs/internal/observable/of";
// import { By } from "@angular/platform-browser";
// import { SharedModule } from "../../shared/shared.module";
// import { RegistrationService } from "../../registrations/registrations/registration.service";
// import { AuditLogService } from "../../shared/AuditLog/auditLog.service";
// import { CoreService } from "../../core/core.service";
// import { RegistrationRequestService } from "../../registrations/registrations/registration-request-service";
// import { AuditLogRepositoryService } from "../../shared/AuditLog/audit-log-repository.service";
// import { Subject } from "rxjs";
// import { PartnerDashboard } from "./partner-dashboard";
// import { RouterTestingModule } from "@angular/router/testing";
// import { PipelineService } from "../../pipeline/pipeline.service";

// describe("DashboardComponent", () => {
//     let component: PartnerDashboardComponent;
//     let fixture: ComponentFixture<PartnerDashboardComponent>;
//     let mockdashboardService;
//     let mockregistrationServiceService;
//     let mockPipelineService;

//     beforeEach(async(() => {
//         mockdashboardService = jasmine.createSpyObj("mockdashboardService", ["getDashboardRegistrations"]);
//         mockregistrationServiceService = jasmine.createSpyObj("mockregistrationServiceService", ["resendEmail"]);
//         mockPipelineService = jasmine.createSpyObj("mockPipelineService", ["getUserColumns"]);

//         TestBed.configureTestingModule({
//             declarations: [PartnerDashboardComponent],
//             providers: [
//                 PartnerDashboardService,
//                 HttpErrorHandler,
//                 ErrorService,
//                 RegistrationService,
//                 AuditLogService,
//                 CoreService,
//                 RegistrationRequestService,
//                 AuditLogRepositoryService,
//                 PipelineService
//             ],
//             imports: [HttpClientModule, HttpClientTestingModule, SharedModule, RouterTestingModule]
//         });

//         TestBed.overrideProvider(PartnerDashboardService, { useValue: mockdashboardService });
//         TestBed.overrideProvider(RegistrationService, { useValue: mockregistrationServiceService });
//         TestBed.overrideProvider(PipelineService, { useValue: mockPipelineService });

//         TestBed.compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PartnerDashboardComponent);
//         component = fixture.componentInstance;
       
//         mockdashboardService.getDashboardRegistrations.and.returnValue(of(mockDashBoardRegistrations));
//         mockregistrationServiceService.resendEmail.and.returnValue(of(mockDashBoardRegistrations));
//         mockregistrationServiceService.getUserColumns.and.returnValue(of([]));
//     });

//     it("should create DashboardComponent", () => {
//         expect(component).toBeTruthy();
//     });

   

   
// });
