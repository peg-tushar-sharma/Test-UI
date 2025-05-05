import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { GlobalService } from '../../../global/global.service';
import { DealsService } from '../../../deals/deals.service';
import { CaseEditorPopUpComponent } from './case-editor-pop-up.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CaseEditorPopUpComponent', () => {
  let component: CaseEditorPopUpComponent;
  let fixture: ComponentFixture<CaseEditorPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseEditorPopUpComponent],
      imports: [HttpClientTestingModule, FormsModule, NgSelectModule],
      providers: [BsModalRef,BsModalService,DealsService,GlobalService],
      schemas: [NO_ERRORS_SCHEMA]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseEditorPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

