// import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
// import { getTestBed, TestBed } from "@angular/core/testing";
// import { mockDashBoardRegistrations } from "../../Mock/MockDashBoardService";

// import { DashboardService } from "./dashboard.service";

// describe("DashboardService", () => {
//     let service: DashboardService;
//     let injector: TestBed;
//     let httpMock: HttpTestingController;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule],
//             providers: [DashboardService]
//         });

//         injector = getTestBed();
//         service = injector.inject(DashboardService);
//         httpMock = injector.inject(HttpTestingController);
//     });

//     it("should be created", () => {
//         const service: DashboardService = TestBed.inject(DashboardService);
//         expect(service).toBeTruthy();
//     });

//     it("should get getDashboardRegistrations", () => {
//         service.getDashboardRegistrations().subscribe((res) => {
//             expect(res).toEqual(mockDashBoardRegistrations);
//         });
//     });
// });
