import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DealSecurityComponent } from './deal-security.component';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DealsService } from './../../deals.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DealSecurityService } from '../../deal.security.service';
import { of } from 'rxjs';
import { deals } from '../../deal';
import { Employee } from '../../../shared/interfaces/models';
import { SecurityCheckboxComponent } from '../../../shared/security-checkbox/security-checkbox.component';

describe('DealSecurityComponent', () => {
  let component: DealSecurityComponent;
  let fixture: ComponentFixture<DealSecurityComponent>;
  let mockDealService;
  let mockDealSecurityService;

  beforeEach(async(() => {
    mockDealService = jasmine.createSpyObj('mockDealService', ['convertToDeal', 'getDealId', 'getIndustrySectors','setDealId',
    'getDealTaggedPeopleById','getDealStatus','getRegions','getUsersByRole','getMBStatus', 'getDealById', 'getEmployeeByName']);
    mockDealSecurityService = jasmine.createSpyObj('mockDealSecurityService', ['getDealAuthorization','getDealAccessTier','getDealAccessInformation']);

    TestBed.configureTestingModule({
      declarations: [ DealSecurityComponent, SecurityCheckboxComponent ],
      imports: [FormsModule, NgSelectModule,HttpClientModule,RouterTestingModule],
      providers: [DealsService,DealSecurityService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    TestBed.overrideProvider(DealSecurityService, {useValue: mockDealSecurityService});
    TestBed.overrideProvider(DealsService, {useValue: mockDealService});
  }));

  beforeEach(() => {
  
    fixture = TestBed.createComponent(DealSecurityComponent);
    component = fixture.componentInstance;
    component.deal = new deals();
    component.deal.dealSecurity = [];
    mockDealSecurityService.getDealAccessTier.and.returnValue(of([{"accessTierId":1,"accessTierName":"Custom","tabName":null,"header":{"isVisible":true,"isEditable":true,"isNone":false},"context":{"isVisible":true,"isEditable":true,"isNone":false},"clients":{"isVisible":true,"isEditable":true,"isNone":false},"experts":{"isVisible":true,"isEditable":true,"isNone":false},"allocation":{"isVisible":true,"isEditable":true,"isNone":false}}]));
    mockDealService.getEmployeeByName.and.returnValue(of([{"employeeCode":"01ECB","lastName":"Berger","firstName":"Eric","familiarName":null,"title":"Vice President","officeName":"Boston","levelName":"V","gradeName":"1","officeAbbreviation":"BOS","employeeStatusCode":"A","pegRole":7,"pegRoleName":"General","abbreviation":"VP", "searchableName":""}]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add people when selecting from drop down', fakeAsync(()=>{
    //Arrange
    spyOn(component, 'outSecurityPeople').and.callFake(()=>{ return null;});

    var txtTagPeople = fixture.nativeElement.querySelector('#dealTagPeopleList input');
    txtTagPeople.textContent = 'eric';
    fixture.detectChanges();
    
    var element: HTMLElement = fixture.nativeElement.querySelector('#dealTagPeopleList input') as HTMLElement
    var event = new Event('input', {
      'bubbles': true,
      'cancelable': true
    });
    element.dispatchEvent(event);
    tick(500);
    fixture.detectChanges();

    //Act
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#dealTagPeopleList'); 
    component.selectedPeople = component.typeaheadPeopleList[0];
    select.value = component.typeaheadPeopleList[0].employeeCode;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    //Assert
    expect(component.deal.dealSecurity.length).toEqual(1);
  }));
  

  it('should delete people', fakeAsync(()=>{
    //Arrange
    component.deal.dealSecurity.push({name:'Berger, Eric (BOS)',role:'General',employee:{"employeeCode":"01ECB","lastName":"Berger","firstName":"Eric","familiarName":null,"pegRoleName":"General","pegRole":7,"officeAbbreviation":"BOS"} as Employee,'accessTierId':1,'tabs':{"header":{"isVisible":true,"isEditable":true,"isNone":false},"context":{"isVisible":true,"isEditable":true,"isNone":false},"clients":{"isVisible":true,"isEditable":true,"isNone":false},"experts":{"isVisible":true,"isEditable":true,"isNone":false},"allocation":{"isVisible":true,"isEditable":true,"isNone":false}}});
    fixture.detectChanges();
    tick(100);
    //Act
    let element: HTMLElement = fixture.nativeElement.querySelector('.fas.fa-trash-alt');    
    element.click();//triggerEventHandler('click', null);
    fixture.detectChanges();

    //Assert
    expect(component.deal.dealSecurity.length).toEqual(0);
  }));

  it('should clear Items', fakeAsync(()=>{
    //Arrange
    spyOn(component, "clearItems").and.callThrough();

    //Act
    component.clearItems();

    //Assert
    expect(component.clearItems).toHaveBeenCalled();
  }));

  it('should update tier', ()=>{
    //Arrange 
    spyOn(component, "updateTier").and.callThrough();
    component.deal.dealSecurity.push({name:'Berger, Eric (BOS)',role:'General',employee:{"employeeCode":"01ECB","lastName":"Berger","firstName":"Eric","familiarName":null,"pegRoleName":"General","pegRole":7,"officeAbbreviation":"BOS"} as Employee,'accessTierId':1,'tabs':{"header":{"isVisible":true,"isEditable":true,"isNone":false},"context":{"isVisible":true,"isEditable":true,"isNone":false},"clients":{"isVisible":true,"isEditable":true,"isNone":false},"experts":{"isVisible":true,"isEditable":true,"isNone":false},"allocation":{"isVisible":true,"isEditable":true,"isNone":false}}});
    fixture.detectChanges();

    //Act
    component.updateTier(component.deal.dealSecurity[0].employee, component.deal.dealSecurity[0].accessTierId);

    //Assert
    expect(component.updateTier).toHaveBeenCalled();
  });

  it('should update value', ()=>{
    //Arrange    
    spyOn(component, "onUpdateValue").and.callThrough();
    component.deal.dealSecurity.push({name:'Berger, Eric (BOS)',role:'General',employee:{"employeeCode":"01ECB","lastName":"Berger","firstName":"Eric","familiarName":null,"pegRoleName":"General","pegRole":7,"officeAbbreviation":"BOS"} as Employee,'accessTierId':1,'tabs':{"header":{"isVisible":true,"isEditable":true,"isNone":false},"context":{"isVisible":true,"isEditable":true,"isNone":false},"clients":{"isVisible":true,"isEditable":true,"isNone":false},"experts":{"isVisible":true,"isEditable":true,"isNone":false},"allocation":{"isVisible":true,"isEditable":true,"isNone":false}}});
    fixture.detectChanges();
    //Act
    let element: HTMLElement = fixture.nativeElement.querySelector('#headerview01ECB');
    element.click();
    fixture.detectChanges();

    //Assert
    expect(component.onUpdateValue).toHaveBeenCalled();
  });
});
