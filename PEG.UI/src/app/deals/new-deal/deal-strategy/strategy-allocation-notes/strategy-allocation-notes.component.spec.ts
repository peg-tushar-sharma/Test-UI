import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DealsService } from '../../../deals.service';
import { StrategyAllocationNotesComponent } from './strategy-allocation-notes.component';

describe('StrategyAllocationNotesComponent', () => {
  let component: StrategyAllocationNotesComponent;
  let fixture: ComponentFixture<StrategyAllocationNotesComponent>;
  let mockDealService;

  beforeEach(async(() => {
    mockDealService = jasmine.createSpyObj('mockDealService', ['formateAllocationNote']);

    TestBed.configureTestingModule({
      declarations: [ StrategyAllocationNotesComponent ],
      imports:[FormsModule],
      providers:[DealsService]
    })
    .compileComponents();
    TestBed.overrideProvider(DealsService, { useValue: mockDealService })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyAllocationNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
