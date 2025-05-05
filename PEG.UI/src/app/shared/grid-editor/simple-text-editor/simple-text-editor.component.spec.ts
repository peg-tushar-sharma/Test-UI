import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTextEditorComponent } from './simple-text-editor.component';

describe('SimpleTextEditorComponent', () => {
  let component: SimpleTextEditorComponent;
  let fixture: ComponentFixture<SimpleTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
