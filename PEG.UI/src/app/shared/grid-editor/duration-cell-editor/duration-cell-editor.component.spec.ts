import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationCellEditorComponent } from './duration-cell-editor.component';

describe('DurationCellEditorComponent', () => {
  let component: DurationCellEditorComponent;
  let fixture: ComponentFixture<DurationCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationCellEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
