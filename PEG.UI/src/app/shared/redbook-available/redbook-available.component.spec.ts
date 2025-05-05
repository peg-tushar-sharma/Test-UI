import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedbookAvailableComponent } from './redbook-available.component';

describe('RedbookAvailableComponent', () => {
  let component: RedbookAvailableComponent;
  let fixture: ComponentFixture<RedbookAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedbookAvailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedbookAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
