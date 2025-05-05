import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityTypeDetailsComponent } from './opportunity-type-details.component';

describe('OpportunityTypeDetailsComponent', () => {
  let component: OpportunityTypeDetailsComponent;
  let fixture: ComponentFixture<OpportunityTypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityTypeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
