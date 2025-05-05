import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleValueTooltipComponent } from './single-value-tooltip.component';

describe('SingleValueTooltipComponent', () => {
  let component: SingleValueTooltipComponent;
  let fixture: ComponentFixture<SingleValueTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleValueTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleValueTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
