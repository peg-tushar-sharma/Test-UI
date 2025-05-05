import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { DealStrategyService } from './deal-strategy.service';

describe('DealStrategyService', () => {
  let service: DealStrategyService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [DealStrategyService]
    })

    injector = getTestBed();
    service = injector.inject(DealStrategyService);
    httpMock = injector.inject(HttpTestingController);
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
