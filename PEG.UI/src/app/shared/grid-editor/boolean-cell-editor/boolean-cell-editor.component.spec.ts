import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BooleanCellEditorComponent } from './boolean-cell-editor.component';

describe('BooleanCellEditorComponent', () => {
  let component: BooleanCellEditorComponent;
  let fixture: ComponentFixture<BooleanCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooleanCellEditorComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NgSelectModule, FormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
