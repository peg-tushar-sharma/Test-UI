import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpComponent } from './help.component';
import { FormsModule } from '@angular/forms';
import { HelpService } from './help.service';
import { HttpClientModule } from '@angular/common/http';
import { PegTostrService } from '../../core/peg-tostr.service'

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let mockPegTostrService;

  beforeEach(async(() => {
    mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);

    TestBed.configureTestingModule({
      declarations: [ HelpComponent ],
      imports: [FormsModule,HttpClientModule],
      providers: [HelpService,PegTostrService]
    })
    TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
