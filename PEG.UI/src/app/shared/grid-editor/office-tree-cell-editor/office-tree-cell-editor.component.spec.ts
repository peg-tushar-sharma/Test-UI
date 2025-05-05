import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfficeTreeCellEditorComponent } from './office-tree-cell-editor.component';

describe('OfficeTreeCellEditorComponent', () => {
  let component: OfficeTreeCellEditorComponent;
  let fixture: ComponentFixture<OfficeTreeCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ OfficeTreeCellEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeTreeCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
