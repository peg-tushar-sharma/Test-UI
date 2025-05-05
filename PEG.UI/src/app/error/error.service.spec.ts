import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { of } from 'rxjs';

describe('ErrorService', () => {
  let mockErrorService;
  mockErrorService = jasmine.createSpyObj('mockErrorServicd', ['getError']);
  beforeEach(() => {TestBed.configureTestingModule({
    providers: [ErrorService]
  }).compileComponents();

  TestBed.overrideProvider(ErrorService, { useValue: mockErrorService });

  mockErrorService.getError.and.returnValue(of([{message:'test'}]));
});

  // it('should be created', () => {
  //   const service: ErrorService = TestBed.get(ErrorService);
  //   expect(service).toBeTruthy();
  // });
});
