import { TestBed } from '@angular/core/testing';

import { HttpErrorHandler } from './http-error-handler.service';
import { ErrorService } from './error.service';

describe('HttpErrorHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpErrorHandler, ErrorService]
  }));

  it('should be created', () => {
    const service: HttpErrorHandler = TestBed.get(HttpErrorHandler);
    expect(service).toBeTruthy();
  });

  it('should log error in console', ()=>{
    
    
    const service: HttpErrorHandler = TestBed.get(HttpErrorHandler);
    spyOn(service,"handleError").and.callThrough();
    service.handleError();
    expect(service.handleError).toHaveBeenCalled();
  })
});
