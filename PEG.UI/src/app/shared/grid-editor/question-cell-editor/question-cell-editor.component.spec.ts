import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCellEditorComponent } from './question-cell-editor.component';

describe('QuestionCellEditorComponent', () => {
  let component: QuestionCellEditorComponent;
  let fixture: ComponentFixture<QuestionCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionCellEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
