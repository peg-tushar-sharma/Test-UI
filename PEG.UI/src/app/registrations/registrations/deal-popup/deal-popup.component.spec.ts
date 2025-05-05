import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DealPopupComponent } from './deal-popup.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RegistrationService } from '../registration.service'
import { FormsModule } from '@angular/forms';
import { DealsService } from '../../../deals/deals.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { SimpleChange, Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Registrations } from '../registrations';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PegTostrService } from '../../../core/peg-tostr.service';

@Component({
  template: `<app-deal-popup #popup  [selectedRegistrations]="registration"></app-deal-popup>`,
})
export class TestWrapperComponent {
  registration: any[] = [];
  @ViewChild('popup', { static: true }) /* using viewChild we get access to the TestComponent which is a child of TestHostComponent */ /* using viewChild we get access to the TestComponent which is a child of TestHostComponent */ /* using viewChild we get access to the TestComponent which is a child of TestHostComponent */ /* using viewChild we get access to the TestComponent which is a child of TestHostComponent */
    public popupComponent: any;
}


describe('DealPopupComponent', () => {
  let component: DealPopupComponent;
  let fixture: ComponentFixture<DealPopupComponent>;
  let testWrapperComponent: TestWrapperComponent;
  let testFixture: ComponentFixture<TestWrapperComponent>; 
  let mockRegistrationService;
  let mockDealService;
  let mocktostrService;

  
  let routes: Routes = [
    {
      path: 'deals/deal/:dealid',
      component: DealPopupComponent
    }];

  beforeEach(async(() => {
    mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationData', 'getRegistrationStatus',
    'getRegistrationStage', 'updateRegistration', 'getProhibitions', 'getInvestments', 'getGridColumns', 'getWorkTypeData', 'getUserAuthorization','setFieldAuthorization','getUsersByRole']);
    
    mockDealService = jasmine.createSpyObj("mockDealService",["getDealTaggedPeopleById","getDeals","convertToDeal","saveTaggedPeople","getEmployeeByName","getExpertGroup","getDealById",
    "getRegions","setDealId","getDealId","saveExpertGroup","getExpertCategories","getClientsById","getIndustrySectors"]);

    mocktostrService = jasmine.createSpyObj('mocktostrService',['showSuccess', 'showError', 'showWarning']);
    TestBed.configureTestingModule({
      declarations: [ DealPopupComponent, TestWrapperComponent ],
      imports :[NgSelectModule,FormsModule, RouterTestingModule.withRoutes(routes), HttpClientModule, HttpClientTestingModule ],
      providers : [DealsService,RegistrationService]
    });

    TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
    TestBed.overrideProvider(DealsService, {useValue: mockDealService});
    TestBed.overrideProvider(PegTostrService,{useValue: mocktostrService});
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealPopupComponent);
    component = fixture.componentInstance;
    mockRegistrationService.getUsersByRole.and.returnValue(of([{employeeCode:"test", firstNmae:"test",lastName:"test",familiarName:"test"}]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load popup with selected values', ()=>{

    
    //Arrange
    testFixture = TestBed.createComponent(TestWrapperComponent);
    testWrapperComponent = testFixture.componentInstance;
    component = testWrapperComponent.popupComponent
    
    spyOn(component,"ngOnChanges").and.callThrough();

    testWrapperComponent.registration.push(
       { data:{
            tdn: "target", bo: "", boc: 0, cd: null, cdn: "", ceD: null, co: null, cr: 'test', gn: "", hfc: null,
            hfcdn: "", ic: "", id: 0, iac: null, imb: null, in: "test", iomp: null, l: "", ln: null,
            lsd: null, oi: "", pn: "", ptd: null, pte: null, ptedn: "", ch: "", csl: "", rt: null, sb: '42vru',
            sbn: null, sd: null, sgTI: 0, sgTN: null, sr: null, sti: 0, stn: null, ti: null,
            ws: null, wti: 0, wtn: null, wts: 0, srAprv: "", nid: "", lud: null, tln: "", isImpersonated: false, hasDeal: false, SON: "",
            LODI: 0, LODN: "test", ec: 1, ie: 1, ier: false, ism:false, ci:"", CPI:'',CPN:"",lodr:1   }},
            {data:{
                tdn: "target", bo: "", boc: 0, cd: null, cdn: "", ceD: null, co: null, cr: 'test', gn: "", hfc: null,
                hfcdn: "", ic: "", id: 0, iac: null, imb: null, in: "test", iomp: null, l: "", ln: null,
                lsd: null, oi: "", pn: "", ptd: null, pte: null, ptedn: "", ch: "", csl: "", rt: null, sb: '42vru',
                sbn: null, sd: null, sgTI: 0, sgTN: null, sr: null, sti: 0, stn: null, ti: null,
                ws: null, wti: 0, wtn: null, wts: 0, srAprv: "", nid: "", lud: null, tln: "", isImpersonated: false, hasDeal: false, SON: "",
                LODI: 0, LODN: "test", ec: 1, ie: 1, ier: false, ism:false, ci:"", CPI:'',CPN:"", lodr:1   }}
        )
    //Act

    testFixture.detectChanges();
    //Assert
   
      
      expect(component.ngOnChanges).toHaveBeenCalled()
   
    
  });

  it('should execute creatNewMBTracker when next button clicked', ()=>{

    //Arrange
    testFixture = TestBed.createComponent(TestWrapperComponent);
    testWrapperComponent = testFixture.componentInstance;
    component = testWrapperComponent.popupComponent
    
    spyOn(component,"creatNewMBTracker").and.callThrough();

    testWrapperComponent.registration.push(
       { data:{
            tdn: "target", bo: "", boc: 0, cd: null, cdn: "", ceD: null, co: null, cr: 'test', gn: "", hfc: null,
            hfcdn: "", ic: "", id: 0, iac: null, imb: null, in: "test", iomp: null, l: "", ln: null,
            lsd: null, oi: "", pn: "", ptd: null, pte: null, ptedn: "", ch: "", csl: "", rt: null, sb: '42vru',
            sbn: null, sd: null, sgTI: 0, sgTN: null, sr: null, sti: 0, stn: null, ti: null,
            ws: null, wti: 0, wtn: null, wts: 0, srAprv: "", nid: "", lud: null, tln: "", isImpersonated: false, hasDeal: false, SON: "",
            LODI: 0, LODN: "test", ec: 1, ie: 1, ier: false, ism:false, ci:"", CPI:'',CPN:"",lodr:1   }},
            {data:{
                tdn: "target", bo: "", boc: 0, cd: null, cdn: "", ceD: null, co: null, cr: 'test', gn: "", hfc: null,
                hfcdn: "", ic: "", id: 0, iac: null, imb: null, in: "test", iomp: null, l: "", ln: null,
                lsd: null, oi: "", pn: "", ptd: null, pte: null, ptedn: "", ch: "", csl: "", rt: null, sb: '42vru',
                sbn: null, sd: null, sgTI: 0, sgTN: null, sr: null, sti: 0, stn: null, ti: null,
                ws: null, wti: 0, wtn: null, wts: 0, srAprv: "", nid: "", lud: null, tln: "", isImpersonated: false, hasDeal: false, SON: "",
                LODI: 0, LODN: "test", ec: 1, ie: 1, ier: false, ism:false, ci:"", CPI:'',CPN:"",lodr:1   }}
        )
    
    //Act
    testFixture.detectChanges();
    testFixture.debugElement.nativeElement.querySelector('button.btn-primary').click()
    testFixture.detectChanges();
   
    //Assert
    expect(component.creatNewMBTracker).toHaveBeenCalled();
  });


  it('should execute close modal when cancel button clicked', ()=>{

    //Arrange
    testFixture = TestBed.createComponent(TestWrapperComponent);
    testWrapperComponent = testFixture.componentInstance;
    component = testWrapperComponent.popupComponent
    
    spyOn(component,"closeModal").and.callThrough();
    spyOn(component,"resetObjects").and.callThrough();

    testWrapperComponent.registration.push(
       { data:{
            tdn: "target", bo: "", boc: 0, cd: null, cdn: "", ceD: null, co: null, cr: 'test', gn: "", hfc: null,
            hfcdn: "", ic: "", id: 0, iac: null, imb: null, in: "test", iomp: null, l: "", ln: null,
            lsd: null, oi: "", pn: "", ptd: null, pte: null, ptedn: "", ch: "", csl: "", rt: null, sb: '42vru',
            sbn: null, sd: null, sgTI: 0, sgTN: null, sr: null, sti: 0, stn: null, ti: null,
            ws: null, wti: 0, wtn: null, wts: 0, srAprv: "", nid: "", lud: null, tln: "", isImpersonated: false, hasDeal: false, SON: "",
            LODI: 0, LODN: "test", ec: 1, ie: 1, ier: false, ism:false, ci:"", CPI:'',CPN:"",lodr:1   }},
            {data:{
                tdn: "target", bo: "", boc: 0, cd: null, cdn: "", ceD: null, co: null, cr: 'test', gn: "", hfc: null,
                hfcdn: "", ic: "", id: 0, iac: null, imb: null, in: "test", iomp: null, l: "", ln: null,
                lsd: null, oi: "", pn: "", ptd: null, pte: null, ptedn: "", ch: "", csl: "", rt: null, sb: '42vru',
                sbn: null, sd: null, sgTI: 0, sgTN: null, sr: null, sti: 0, stn: null, ti: null,
                ws: null, wti: 0, wtn: null, wts: 0, srAprv: "", nid: "", lud: null, tln: "", isImpersonated: false, hasDeal: false, SON: "",
                LODI: 0, LODN: "test", ec: 1, ie: 1, ier: false, ism:false, ci:"", CPI:'',CPN:"",lodr:1   }}
        )
    
    //Act
    testFixture.detectChanges();
    testFixture.debugElement.nativeElement.querySelector('button.btn-tertiary').click()
    testFixture.detectChanges();
   
    //Assert
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.resetObjects).toHaveBeenCalled();
  });
});
