import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNotesToolTipComponent } from './employee-notes-tooltip.component';

describe('EmployeeNotesTooltipComponent', () => {
  let component: EmployeeNotesToolTipComponent;
  let fixture: ComponentFixture<EmployeeNotesToolTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeNotesToolTipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNotesToolTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
