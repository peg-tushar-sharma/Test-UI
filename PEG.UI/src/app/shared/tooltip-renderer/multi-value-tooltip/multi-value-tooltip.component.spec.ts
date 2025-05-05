import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiValueTooltipComponent } from './multi-value-tooltip.component';

describe('MultiValueTooltipComponent', () => {
  let component: MultiValueTooltipComponent;
  let fixture: ComponentFixture<MultiValueTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiValueTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiValueTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
