import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipelineService } from '../../pipeline.service';

import { OppAuditComponent } from './opp-audit.component';

describe('OppAuditComponent', () => {
  let component: OppAuditComponent;
  let fixture: ComponentFixture<OppAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OppAuditComponent ],
      imports: [HttpClientTestingModule],
      providers: [PipelineService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OppAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
