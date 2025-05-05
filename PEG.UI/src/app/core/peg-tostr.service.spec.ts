import { TestBed } from '@angular/core/testing';

import { PegTostrService } from './peg-tostr.service';
import { CoreModule } from './core.module';

describe('PegTostrService', () => {
  beforeEach(() => TestBed.configureTestingModule({

    // declarations: [RegistrationsComponent],
    // schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    // providers: [RegistrationService, PegTostrService],
    imports: [
      CoreModule
    ],

  }));

  it('should be created', () => {
    const service: PegTostrService = TestBed.get(PegTostrService);
    expect(service).toBeTruthy();
  });
});
