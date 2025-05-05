import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshPopupComponent } from './refresh-popup.component';

describe('RefreshPopupComponent', () => {
  let component: RefreshPopupComponent;
  let fixture: ComponentFixture<RefreshPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefreshPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
