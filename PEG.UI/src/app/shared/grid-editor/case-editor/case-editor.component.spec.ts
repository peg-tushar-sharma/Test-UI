import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Case } from '../../interfaces/case';
import { DealsService } from '../../../deals/deals.service';
import { CaseEditorComponent } from './case-editor.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NewRegistrationService } from '../../../registrations/new-registration/new-registration.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


describe('CaseEditorComponent', () => {
  let component: CaseEditorComponent;
  let fixture: ComponentFixture<CaseEditorComponent>;
  let mockGlobalService;
  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getOffice']);

    await TestBed.configureTestingModule({
      declarations: [ CaseEditorComponent ],
      imports: [NgSelectModule, FormsModule, HttpClientTestingModule],
      providers: [DealsService,NewRegistrationService,BsModalRef,BsModalService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    TestBed.overrideProvider(NewRegistrationService, {useValue: mockGlobalService});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseEditorComponent);
    component = fixture.componentInstance;
    let mockCaseDate: Case []  = [{
      oldCaseCode: "text",
      billingOfficeAbbreviation:"",
      billingOfficeCode:"",
      billingOfficeName:"",
      caseAttributes:"",
      caseCode:"",
      caseManagerCode:"",
      caseName:"",
      caseServedByRingfence:"",
      caseType:"",
      caseTypeCode:"",
      clientCode:"",
      clientName:"",
      endDate: new Date(),
      isPrivateEquity:true,
      managingOfficeAbbreviation:"",
      managingOfficeCode:"",
      managingOfficeName:"",
      primaryCapability:"",
      primaryIndustry:"",
      startDate: new Date(),
      type:"",
      customGroup:""
    }]
    component.cases = mockCaseDate;
    mockGlobalService.getOffice.and.returnValue(of(['']));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
