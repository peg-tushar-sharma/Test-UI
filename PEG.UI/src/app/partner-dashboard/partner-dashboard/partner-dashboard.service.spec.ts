import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { mockDashBoardRegistrations } from "../../Mock/MockDashBoardService";

import { PartnerDashboardService } from "./partner-dashboard.service";

describe("DashboardService", () => {
    let service: PartnerDashboardService;
    let injector: TestBed;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PartnerDashboardService]
        });

        injector = getTestBed();
        service = injector.inject(PartnerDashboardService);
        httpMock = injector.inject(HttpTestingController);
    });

    it("should be created", () => {
        const service: PartnerDashboardService = TestBed.inject(PartnerDashboardService);
        expect(service).toBeTruthy();
    });

   
});
