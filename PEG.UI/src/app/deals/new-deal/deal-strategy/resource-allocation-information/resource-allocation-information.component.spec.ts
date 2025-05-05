import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DealsService } from '../../../deals.service';

import { ResourceAllocationInformationComponent } from './resource-allocation-information.component';

describe('ResourceAllocationInformationComponent', () => {
  let component: ResourceAllocationInformationComponent;
  let fixture: ComponentFixture<ResourceAllocationInformationComponent>;
  let mockDealService;
  beforeEach(async () => {
    mockDealService = jasmine.createSpyObj("mockDealService",['getResouceAllocatioInformation']);

    await TestBed.configureTestingModule({
      declarations: [ ResourceAllocationInformationComponent ],
      imports: [HttpClientTestingModule],
      providers: [DealsService]
    })
    .compileComponents();
    TestBed.overrideProvider(DealsService,{useValue: mockDealService});
  });

  beforeEach(() => {
    mockDealService.getResouceAllocatioInformation.and.returnValue(of([{employeeCode:'1234',employeeName:'TestNote'}]));
    fixture = TestBed.createComponent(ResourceAllocationInformationComponent);
    component = fixture.componentInstance;
    component.caseCode='testcase code';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
