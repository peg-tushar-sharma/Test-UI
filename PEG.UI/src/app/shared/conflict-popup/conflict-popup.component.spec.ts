import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictPopupComponent } from './conflict-popup.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('ConflictPopupComponent', () => {
  let component: ConflictPopupComponent;
  let fixture: ComponentFixture<ConflictPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictPopupComponent ],
      providers: [BsModalRef]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
