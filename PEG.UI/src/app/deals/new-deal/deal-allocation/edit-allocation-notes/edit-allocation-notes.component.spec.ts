import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DealsService } from '../../../deals.service';
import { EditAllocationNotesComponent } from './edit-allocation-notes.component';

describe('EditAllocationNotesComponent', () => {
  let component: EditAllocationNotesComponent;
  let fixture: ComponentFixture<EditAllocationNotesComponent>;
  let mockDealService;

  beforeEach(async(() => {
    mockDealService = jasmine.createSpyObj('mockDealService', ['formateAllocationNote']);

    TestBed.configureTestingModule({
      declarations: [ EditAllocationNotesComponent ],
      imports:[FormsModule],
      providers:[DealsService]
    })
    .compileComponents();
    TestBed.overrideProvider(DealsService, { useValue: mockDealService })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAllocationNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
