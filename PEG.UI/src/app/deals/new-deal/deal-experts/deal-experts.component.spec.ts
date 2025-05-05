import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { DealExpertsComponent } from './deal-experts.component';
import { SharedModule } from '../../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { DealsService } from '../../deals.service';
import { expertGroup } from './expertGroup';
import { By } from "@angular/platform-browser";
import { BsModalService } from 'ngx-bootstrap/modal';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DealClient } from '../deal-clients/dealClient';
import { GlobalService } from '../../../global/global.service';
import { HttpClientModule } from '@angular/common/http';


describe('DealExpertsComponent', () => {
  let component: DealExpertsComponent;
  let fixture: ComponentFixture<DealExpertsComponent>;
  let mockDealService;
  let mockBsModalService;
  let mockPegTostrService;
  let mockGlobalService;

  let switchTab: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  beforeEach(waitForAsync(() => {
    mockDealService = jasmine.createSpyObj("mockDealService", ["getDealTaggedPeopleById", "getDeals", "convertToDeal", "saveTaggedPeople", "getEmployeeByName", "getExpertGroup", "getDealById",
      "setDealId", "getDealId", "saveExpertGroup", "getClientsById", "switchTab"]);
    mockBsModalService = jasmine.createSpyObj("mockBsModalService", ['show']);
    mockPegTostrService = jasmine.createSpyObj("mockPegTostrService", ['']);
    mockGlobalService = jasmine.createSpyObj("mockGlobalService", ['getExpertPoolColors', 'getRegions', 'getExpertCategories', 'getExpertGroupCategory']);
    mockDealService.switchTab = switchTab.asObservable();

    TestBed.configureTestingModule({
      declarations: [DealExpertsComponent],
      imports: [SharedModule,HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DealsService, BsModalService, PegTostrService, GlobalService
        }
      ]
    });

    switchTab.next('experts');

    TestBed.overrideProvider(DealsService, { useValue: mockDealService });
    TestBed.overrideProvider(BsModalService, { useValue: mockBsModalService });
    TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
    TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealExpertsComponent);
    component = fixture.componentInstance;
    mockGlobalService.getExpertPoolColors.and.returnValue(of([{ expertPoolColorId: 0, colorName: 'Bain Red', colorCode: "#cc0000" }]));
    mockGlobalService.getExpertGroupCategory.and.returnValue(of([{ expertGroupCategoryId: 0, abbreviation: 'V', categoryName: "Test" }]));

    let DataexpertGroup: expertGroup[] = JSON.parse('[{"expertGroupName":"Primary","expertGroupId":1,"dealId":0,"expertPoolColor":[],"expertGroupCategory":[],"experts":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","sortOrder":"1","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0,"isAllocationActive":false}]}]')
    let dataClients: DealClient[] = JSON.parse('[{"tmpDealClientId":0,"dealClientId":0,"client":{"clientId":168,"clientName":"Bain Capital","clientHeadEmployeeCode":"","clientHeadFirstName":"","clientHeadLastName":"","ClientPriorityId":0,"ClientPriorityName":"","clientReferenceId":0},"field":"","seekingExpertise":"","registrationStatus":{"registrationStatusId":0,"statusTypeName":""},"notes":"","allocationNote":"","registrationId":0,"stage":{"registrationStageId":0,"stageTypeName":""},"priorityId":1,"priorityName":"P1A","clientHeads":[{"dealClientId":0,"employeeCode":"01DLP","firstName":"David","lastName":"Lipman","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"CBIER","firstName":"Christopher","lastName":"Bierly","familiarName":"Chris","partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"04RWE","firstName":"Rolf-Magnus","lastName":"Weddigen","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"03NGR","firstName":"Nicholas","lastName":"Greenspan","familiarName":"Nick","partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"10TAN","firstName":"Andrew","lastName":"Tymms","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":1,"regionName":"Asia/Pacific"}}],"priority":{"priorityId":1,"priorityName":"P1A"},"statusTypeName":null,"stageTypeName":null,"submittedBy":"","isMultipleEmployee":true,"isMultipleClient":false,"committed":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"ovp":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"heardFrom":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"nextCall":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"clientId":168,"clientName":"Bain Capital","clientHead":["Lipman, David (01DLP)","Bierly, Christopher (CBIER)","Weddigen, Rolf-Magnus (04RWE)","Greenspan, Nicholas (03NGR)","Tymms, Andrew (10TAN)"]}]')
    let clientAllocation = JSON.parse('[{"dealId":0,"clientId":169,"allocationType":1,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":2,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":3,"employeeCode":"48248","lastUpdatedBy":null}]')

    component.deal = {
      "dealId": 1,
      "targetName": null,
      "targetId": 0,
      "submittedBy": null,
      "clientName": null,
      "dealRegistrations": [],
      "createdOn": null,
      "bankRunningProcess": null,
      "bankProcessName": null,
      "currentEBITDA": null,
      "dealSize": null,
      "targetDescription": null,
      "isPubliclyKnown": null,
      "nickname": null,
      "notes": null,
      "owner": null,
      "targetCountry": null,
      "associatedRegistrations": null,
      "mbAdvisor": null,
      "mbStatus": null,
      "sector": null,
      "externalProjectName": null,
      "visibleTo": null,
      "biddersList": null,
      "dealWinner": null,
      "dealStatus": 0,
      "bidDates": null,
      "bidDatesType": null,
      "vddProvider": null,
      "redbookAvailable": null,
      "industries": [],
      "expertGroup": DataexpertGroup,
      "clients": dataClients,
      "clientAllocations": clientAllocation,
      "importantDates": [],
      "managedBy": null,
      "dealRegions": null,
      "dealSecurity": [],
      "transactedTo": null, "transactedDate": null, "expertLineupPrepared": false, "expertOnBoard": false, "processExpectation": null, "supportRequested": false, "supportedWinningBidder": null
      , "submissionDate": null,
      "sectors": [],
      "subSectors": [],
      "priorWork": null,
      "attendees": null,
      "dateOfCall": null,
      "sentTo": null,
      "trainers": null,
      "isExpertTrainUpCall": null,
      "publiclyTraded": null,
      "isMasked":false,
      "statusUpdateDate":null
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new expert group', fakeAsync(() => {

    var inputName: HTMLInputElement = fixture.nativeElement.querySelector('#txtExpertGroupName') as HTMLInputElement;
    inputName.value = "test";
    fixture.detectChanges();

    var buttonSave: HTMLButtonElement = fixture.nativeElement.querySelector('#btnSaveExpertPool') as HTMLButtonElement;
    fixture.detectChanges();

    buttonSave.click();
    fixture.detectChanges();

    expect(component.deal.expertGroup.length).toBeGreaterThan(0);


  }));
  it('should add new expert group when updating a group', fakeAsync(() => {

    component.poolEdit = 'update';
    component.updateExpertGroupId = 1;
    var inputName: HTMLInputElement = fixture.nativeElement.querySelector('#txtExpertGroupName') as HTMLInputElement;
    inputName.value = "test";
    fixture.detectChanges();

    var buttonSave: HTMLButtonElement = fixture.nativeElement.querySelector('#btnSaveExpertPool') as HTMLButtonElement;
    fixture.detectChanges();

    buttonSave.click();
    fixture.detectChanges();

    expect(component.deal.expertGroup.length).toBeGreaterThan(0);


  }));

  it('should add new expert group when updating a group and dealID >0', fakeAsync(() => {
    component.dealId = 1
    component.poolEdit = 'Save';
    component.updateExpertGroupId = 1;
    var inputName: HTMLInputElement = fixture.nativeElement.querySelector('#txtExpertGroupName') as HTMLInputElement;
    inputName.value = "test";
    fixture.detectChanges();

    var buttonSave: HTMLButtonElement = fixture.nativeElement.querySelector('#btnSaveExpertPool') as HTMLButtonElement;
    fixture.detectChanges();

    buttonSave.click();
    fixture.detectChanges();

    expect(component.deal.expertGroup.length).toBeGreaterThan(0);


  }));


  it('should get list of experts when click on group name', fakeAsync(() => {

    spyOn(component, "getExperts").and.callThrough();

    //Arrange
    component.expertGroup = new expertGroup();
    component.expertGroup.expertGroupName = 'test';

    let textPoolNameElement = fixture.nativeElement.querySelector('div input#txtExpertGroupName');
    textPoolNameElement.value = "test";
    textPoolNameElement.dispatchEvent(new Event('input'));
    tick(200);
    fixture.detectChanges();

    let input = fixture.debugElement.query(By.css("button[id='btnSaveExpertPool']"));
    input.triggerEventHandler('click', null);
    fixture.detectChanges();
    //Act
    fixture.nativeElement.querySelector('a.item div.active').click();
    fixture.detectChanges();

    //Assert
    expect(component.getExperts).toHaveBeenCalled();
  })
  );

  it('should add', () => {
    expect(component.deal.expertGroup[0].expertGroupName).toBe('Primary');
    expect(component.deal.expertGroup[0].experts[0].expertName).toBe('Jain, Shreyas (NDS)');
  });

  it('should update', () => {
    expect(component.deal.expertGroup[0].expertGroupName).toBe('Primary');
    expect(component.deal.expertGroup[0].experts[0].expertName).toBe('Jain, Shreyas (NDS)');
  });

  it('should delete the expert group', () => {
    component.deal.clientAllocations = [];
    component.deal.clients = [];
    component.delete(1, 'pool');
    fixture.detectChanges();
    expect(component.deal.expertGroup.length).toEqual(0);
  });

  it('editing expert', () => {
    //Arrange
    spyOn(component, "onCellEditingStarted").and.callThrough();

    //Act
    var obj: any = {};
    obj.node = {}
    obj.node.id = 0;
    obj.node.data = component.deal.expertGroup;
    obj.colDef = {};
    obj.colDef.field = 'expertName'
    component.currentExpertGroupId = 1;
    component.onCellEditingStarted(obj);

    //Assert
    expect(component.onCellEditingStarted).toHaveBeenCalled();


  });


  it('should call ngOnChanges', () => {
    //Arrange
    spyOn(component, "ngOnChanges").and.callThrough();

    //Act
    const previousValue = component.deal
    const currentValue = component.deal;
    currentValue.notes = "test";
    const changesObj: SimpleChanges = {
      deal: new SimpleChange(previousValue, currentValue, false)
    };

    component.ngOnChanges(changesObj);

    //Assert
    expect(component.ngOnChanges).toHaveBeenCalled();

  });

  it('Cancel Pool', () => {
    var editButton: HTMLButtonElement = fixture.nativeElement.querySelector('#btnEditGroup') as HTMLButtonElement
    editButton.click()
    //Act
    fixture.detectChanges();

    //Arrange
    var cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#btnPoolCancel') as HTMLButtonElement
    cancelButton.click()
    //Act
    fixture.detectChanges();

  });
 
});

