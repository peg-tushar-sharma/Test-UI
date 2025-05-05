import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealPresetPopupComponent } from './deal-preset-popup.component';

describe('DealPresetPopupComponent', () => {
  let component: DealPresetPopupComponent;
  let fixture: ComponentFixture<DealPresetPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealPresetPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealPresetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
