import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DealsService } from '../../../deals/deals.service';
import { EmployeeNoteEditorComponent } from './employee-note-editor.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';




describe('EmployeeNoteEditorComponent', () => {
  let component: EmployeeNoteEditorComponent;
  let fixture: ComponentFixture<EmployeeNoteEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeNoteEditorComponent ],
      imports: [NgSelectModule, FormsModule, HttpClientModule],
      providers: [DealsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNoteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
