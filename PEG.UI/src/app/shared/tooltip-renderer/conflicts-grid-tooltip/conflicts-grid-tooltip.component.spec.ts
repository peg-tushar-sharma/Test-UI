import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConflictsGridTooltipComponent } from './conflicts-grid-tooltip.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PipelineService } from '../../../pipeline/pipeline.service';


describe('ConflictsGridTooltipComponent', () => {
  let component: ConflictsGridTooltipComponent;
  let fixture: ComponentFixture<ConflictsGridTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ ConflictsGridTooltipComponent ],
      providers:[PipelineService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictsGridTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
