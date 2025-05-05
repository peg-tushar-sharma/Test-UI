// import { async, ComponentFixture, TestBed, tick, fakeAsync } from "@angular/core/testing";
// import { DashboardComponent } from "./dashboard.component";
// import { DashboardService } from "../services/dashboard.service";
// import { HttpErrorHandler } from "../../error/http-error-handler.service";
// import { HttpClientModule } from "@angular/common/http";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { ErrorService } from "../../error/error.service";
// import { mockDashBoardRegistrations } from "../../Mock/MockDashBoardService";
// import { of } from "rxjs/internal/observable/of";
// import { By } from "@angular/platform-browser";
// import { SharedModule } from "../../shared/shared.module";
// import { RegistrationService } from "../../../app/registrations/registrations/registration.service";
// import { AuditLogService } from "../../shared/AuditLog/auditLog.service";
// import { CoreService } from "../../core/core.service";
// import { RegistrationRequestService } from "../../registrations/registrations/registration-request-service";
// import { AuditLogRepositoryService } from "../../shared/AuditLog/audit-log-repository.service";
// import { Subject } from "rxjs";
// import { Dashboard } from "./dashboard";
// import { RouterTestingModule } from "@angular/router/testing";

// describe("DashboardComponent", () => {
//     let component: DashboardComponent;
//     let fixture: ComponentFixture<DashboardComponent>;
//     let mockdashboardService;
//     let mockregistrationServiceService;

//     beforeEach(async(() => {
//         mockdashboardService = jasmine.createSpyObj("mockdashboardService", ["getDashboardRegistrations"]);
//         mockregistrationServiceService = jasmine.createSpyObj("mockregistrationServiceService", ["resendEmail"]);

//         TestBed.configureTestingModule({
//             declarations: [DashboardComponent],
//             providers: [
//                 DashboardService,
//                 HttpErrorHandler,
//                 ErrorService,
//                 RegistrationService,
//                 AuditLogService,
//                 CoreService,
//                 RegistrationRequestService,
//                 AuditLogRepositoryService
//             ],
//             imports: [HttpClientModule, HttpClientTestingModule, SharedModule, RouterTestingModule]
//         });

//         TestBed.overrideProvider(DashboardService, { useValue: mockdashboardService });
//         TestBed.overrideProvider(RegistrationService, { useValue: mockregistrationServiceService });

//         TestBed.compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DashboardComponent);
//         component = fixture.componentInstance;
//         component.dashboardData = mockDashBoardRegistrations;
//         mockdashboardService.getDashboardRegistrations.and.returnValue(of(mockDashBoardRegistrations));
//         mockregistrationServiceService.resendEmail.and.returnValue(of(mockDashBoardRegistrations));
//     });

//     it("should create DashboardComponent", () => {
//         expect(component).toBeTruthy();
//     });

//     it("should generate dashboardRegistrations on UI", () => {
//         // Mock Data for services
//         fixture.detectChanges();
//         const registrations = fixture.debugElement.queryAll(By.css("div.grid-body>div.grid-row"));
//         expect(registrations).not.toBeNull();
//     });

//     it("should resend email on UI", () => {
//         fixture.detectChanges();

//         // Mock Data for services
//         const resendButton = fixture.nativeElement.querySelector(".retry-btn") as HTMLButtonElement;
//         fixture.detectChanges();
//         resendButton.click();
//         expect(resendButton).not.toBeNull();
//     });
// });
