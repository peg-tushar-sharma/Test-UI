
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealAllocationComponent } from './deal-allocation.component';
import { DragDropModule, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { DragDropRegistry } from '@angular/cdk/drag-drop';
import { PegTostrService } from '../../../core/peg-tostr.service';

import { NgSelectModule } from '@ng-select/ng-select';
import { EditAllocationNotesComponent } from '../../new-deal/deal-allocation/edit-allocation-notes/edit-allocation-notes.component';
import { UserProfileTooltipAllocationComponent } from './user-profile-tooltip/user-profile-tooltip.component';
import { PopoverModule, PopoverConfig, PopoverDirective } from 'ngx-bootstrap/popover';
import { DealsService } from '../../deals.service';
import { expertGroup } from '../deal-experts/expertGroup';
import { DealClient } from '../deal-clients/dealClient';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CoreService } from '../../../core/core.service';

describe('DealAllocationComponent', () => {
    let component: DealAllocationComponent;
    let fixture: ComponentFixture<DealAllocationComponent>;

    //let mockDealsService;
    let switchTab: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    let mockDealService;
    let mockPegTostrService;
    let mockcoreService;


    beforeEach(async(() => {
        mockDealService = jasmine.createSpyObj('mockDealService', ['formateAllocationNote','splitAndRemoveTextSpace']);
        mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
        mockcoreService = jasmine.createSpyObj('mockcoreService', ['loggedInUser', 'editProhibition', 'addProhibition', 'updateProhibition']);
        TestBed.configureTestingModule({
            declarations: [DealAllocationComponent, EditAllocationNotesComponent, UserProfileTooltipAllocationComponent],
            imports: [DragDropModule, NgSelectModule, PopoverModule.forRoot(), FormsModule],
            providers: [DealsService, PopoverConfig, PopoverDirective, PegTostrService, DatePipe,CoreService]
        })
        TestBed.overrideProvider(DealsService, { useValue: mockDealService });
        TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
        TestBed.overrideProvider(CoreService, { useValue: mockcoreService });

        TestBed.compileComponents();
        Object.defineProperty(mockDealService, 'switchTab', {value: new BehaviorSubject<any>('allocation')});

    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(DealAllocationComponent);
        component = fixture.componentInstance;
        let DataexpertGroup: expertGroup[] = JSON.parse('[{"expertGroupName":"Primary","expertGroupId":1,"dealId":0,"experts":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","expertNameWithoutAbbreviation":"Jain, Shreyas","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0,"isAllocationActive":false}]}]')
        let dataClients: DealClient[] = JSON.parse('[{"tmpDealClientId":0,"dealClientId":0,"client":{"clientId":168,"clientName":"Bain Capital","clientHeadEmployeeCode":"","clientHeadFirstName":"","clientHeadLastName":"","ClientPriorityId":0,"ClientPriorityName":"","clientReferenceId":0},"field":"","seekingExpertise":"","registrationStatus":{"registrationStatusId":0,"statusTypeName":""},"notes":"","allocationNote":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book","registrationId":0,"stage":{"registrationStageId":0,"stageTypeName":""},"priorityId":1,"priorityName":"P1A","clientHeads":[{"dealClientId":0,"employeeCode":"01DLP","firstName":"David","lastName":"Lipman","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"CBIER","firstName":"Christopher","lastName":"Bierly","familiarName":"Chris","partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"04RWE","firstName":"Rolf-Magnus","lastName":"Weddigen","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"03NGR","firstName":"Nicholas","lastName":"Greenspan","familiarName":"Nick","partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"10TAN","firstName":"Andrew","lastName":"Tymms","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":1,"regionName":"Asia/Pacific"}}],"priority":{"priorityId":1,"priorityName":"P1A"},"statusTypeName":null,"stageTypeName":null,"submittedBy":"","isMultipleEmployee":true,"isMultipleClient":false,"committed":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","expertNameWithoutAbbreviation":"Jain, Shreyas","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0,"expertPoolColor":[]}],"ovp":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"heardFrom":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"nextCall":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"clientId":168,"clientName":"Bain Capital","clientHead":["Lipman, David (01DLP)","Bierly, Christopher (CBIER)","Weddigen, Rolf-Magnus (04RWE)","Greenspan, Nicholas (03NGR)","Tymms, Andrew (10TAN)"]}]')
        let clientAllocation = JSON.parse('[{"dealId":0,"clientId":169,"allocationType":1,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":2,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":3,"employeeCode":"48248","lastUpdatedBy":null}]')
        component.dealExpertsGroups = DataexpertGroup;
        component.deal = {
            "priorWork":"",
            "dealId": 0,
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
            "attendees":null, 
            "dateOfCall":null, 
            "sentTo":null, "trainers":null, 
            "isExpertTrainUpCall":null, 
            "publiclyTraded": null,
            "isMasked":false,
            "statusUpdateDate":null

        }

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component.deal.expertGroup[0].expertGroupName).toBe('Primary');
        expect(component.deal.expertGroup[0].experts[0].expertName).toBe('Jain, Shreyas (NDS)');
    });

    it('Should have experts in expert list', () => {
        fixture.detectChanges();
        let elementExperGrouptList: HTMLElement = fixture.nativeElement.querySelector('.expertGroup');
        let elementExpertList: HTMLElement = fixture.nativeElement.querySelector('#expertGroupList0 > div > div > div:nth-child(2)');
        expect(elementExperGrouptList.innerHTML).toContain('Primary');
        expect(elementExpertList.innerHTML).toContain('Jain, Shreyas');
    });

    it('Should filter experts', () => {
        const btnFilter: HTMLElement = fixture.nativeElement.querySelector('#btnFilter');
        btnFilter.click();
        fixture.detectChanges();
        const expertFilter: HTMLSelectElement = fixture.nativeElement.querySelector('#ddlfilter');
        expect(component.dealExpertsGroups.length).toBeGreaterThan(0);


    });

    it('Should reset filter', () => {
        component.filterClose();
        fixture.detectChanges();
        const expertFilter: HTMLSelectElement = fixture.nativeElement.querySelector('#ddlfilter');
        expect(expertFilter).toBeNull();
    });

    it('Should filter experts', () => {
        component.filterExperts(component.deal.expertGroup[0]);
        fixture.detectChanges();
        expect(component.deal.expertGroup.length).toBeGreaterThan(0);
    });

    it('Should have clients matrix', () => {
        const tblClientGroup: HTMLElement = fixture.nativeElement.querySelector('#client-allocation');
        expect(tblClientGroup.childNodes.length).toBeGreaterThan(1);
    });

    it('Should have clients in client list', () => {
        const clients: HTMLElement = fixture.nativeElement.querySelector('#client-allocation > tbody > tr:nth-child(1) > th:nth-child(1) > div:nth-child(1) > span > b');
        expect(clients.textContent).toContain('Bain Capital')
    });
    it('Should toggle Filter', () => {
        component.isFilterHidden = false;
        fixture.detectChanges();
        component.toggelFilter();
        expect(component.isFilterHidden).toBeTruthy();

    });
    it('Should remove item', () => {
        component.removeItem(component.deal.clients[0].client, 'Committed', component.deal.clients[0].committed[0],1)
        fixture.detectChanges();
        expect(component.deal.clients[0].committed.length).toEqual(1)


        component.removeItem(component.deal.clients[0].client, 'HeardFrom', component.deal.clients[0].heardFrom[0],1)
        fixture.detectChanges();
        expect(component.deal.clients[0].heardFrom.length).toEqual(1)


        component.removeItem(component.deal.clients[0].client, 'NextCall', component.deal.clients[0].nextCall[0],1)
        fixture.detectChanges();
        expect(component.deal.clients[0].nextCall.length).toEqual(1)

    });

    it('should create', () => {
        expect(component.deal.expertGroup[0].expertGroupName).toBe('Primary');
        expect(component.deal.expertGroup[0].experts[0].expertName).toBe('Jain, Shreyas (NDS)');
    });

    it('should toggle the allocaton notes', ()=>{
        //Arrange
        spyOn(component, 'toggleAllocationNotes').and.callThrough();
        mockDealService.formateAllocationNote.and.callFake(DealsService.prototype.formateAllocationNote);
        //mockDealService.formateAllocationNote();
        
        component.renderAllocationTab(component.deal.dealId);
        fixture.detectChanges();
        //Act
        let readMoreButton: HTMLElement = fixture.nativeElement.querySelector('#currentAllocationNotesReadButton'+component.deal.clients[0].dealClientId);
        readMoreButton.click();

        //Assert
        expect(component.toggleAllocationNotes).toHaveBeenCalled();
    });

});


