import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageCellEditorComponent } from './stage-cell-editor.component';

describe('StageCellEditorComponent', () => {
  let component: StageCellEditorComponent;
  let fixture: ComponentFixture<StageCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageCellEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StageCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
