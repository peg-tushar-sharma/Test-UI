import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { GlobalService } from '../../../../global/global.service';
import { DealsService } from '../../../../deals/deals.service';
import { ClientEditorPopUpComponent } from './client-editor-pop-up.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

describe('CaseEditorPopUpComponent', () => {
  let component: ClientEditorPopUpComponent;
  let fixture: ComponentFixture<ClientEditorPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditorPopUpComponent],
      imports: [HttpClientTestingModule, FormsModule, NgSelectModule],
      providers: [BsModalRef, BsModalService, DealsService, GlobalService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditorPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
