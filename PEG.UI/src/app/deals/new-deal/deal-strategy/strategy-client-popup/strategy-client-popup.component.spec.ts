import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PegTostrService } from '../../../../core/peg-tostr.service';
import { StrategyClientPopupComponent } from './strategy-client-popup.component';

describe('StrategyClientPopupComponent', () => {
  let component: StrategyClientPopupComponent;
  let fixture: ComponentFixture<StrategyClientPopupComponent>;

  let mockPegTostrService;

  beforeEach(async () => {
    mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);

    await TestBed.configureTestingModule({
      declarations: [ StrategyClientPopupComponent ],
      providers: [BsModalRef, PegTostrService]
    })
    .compileComponents();

    TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyClientPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
