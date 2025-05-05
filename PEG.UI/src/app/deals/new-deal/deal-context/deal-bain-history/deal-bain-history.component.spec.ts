import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealBainHistoryComponent } from './deal-bain-history.component';
import { FormsModule, NgForm, ControlContainer } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DealsService } from '../../../deals.service';
import { of } from 'rxjs';
import { deals } from '../../../../deals/deal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expertGroup } from '../../deal-experts/expertGroup';
import { DealClient } from '../../deal-clients/dealClient';
import { SimpleChange, SimpleChanges } from '@angular/core';


describe('DealBainHistoryComponent', () => {
    let component: DealBainHistoryComponent;
    let fixture: ComponentFixture<DealBainHistoryComponent>;
    let mockDealService;

    beforeEach(waitForAsync(() => {

        mockDealService = jasmine.createSpyObj('mockDealService', ['getRegions']);

        TestBed.configureTestingModule({
            declarations: [DealBainHistoryComponent],
            imports: [FormsModule, NgSelectModule, BsDatepickerModule.forRoot(), HttpClientModule, HttpClientTestingModule,],
            providers: [NgForm, DealsService]
        })

        TestBed.overrideProvider(DealsService, { useValue: mockDealService })
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DealBainHistoryComponent);
        component = fixture.componentInstance;
        mockDealService.getRegions.and.returnValue(of(
            [{
                regionId: 1,
                regionName: 'Asia/Pacific'
            }]
        ));
        // mockDealService.getMBStatus.and.returnValue(of(
        //     [{
        //         mbStatusId: 1,
        //         mbStatusName: 'Asia/Pacific'
        //     }]
        // ));
        let DataexpertGroup: expertGroup[] = JSON.parse('[{"expertGroupName":"Primary","expertGroupId":1,"dealId":0,"experts":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0,"isAllocationActive":false}]}]')
        let dataClients: DealClient[] = JSON.parse('[{"tmpDealClientId":0,"dealClientId":0,"client":{"clientId":168,"clientName":"Bain Capital","clientHeadEmployeeCode":"","clientHeadFirstName":"","clientHeadLastName":"","ClientPriorityId":0,"ClientPriorityName":"","clientReferenceId":0},"field":"","seekingExpertise":"","registrationStatus":{"registrationStatusId":0,"statusTypeName":""},"notes":"","allocationNote":"","registrationId":0,"stage":{"registrationStageId":0,"stageTypeName":""},"priorityId":1,"priorityName":"P1A","clientHeads":[{"dealClientId":0,"employeeCode":"01DLP","firstName":"David","lastName":"Lipman","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"CBIER","firstName":"Christopher","lastName":"Bierly","familiarName":"Chris","partnerWorkTypeName":"DD","region":{"regionId":2,"regionName":"Americas"}},{"dealClientId":0,"employeeCode":"04RWE","firstName":"Rolf-Magnus","lastName":"Weddigen","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"03NGR","firstName":"Nicholas","lastName":"Greenspan","familiarName":"Nick","partnerWorkTypeName":"DD","region":{"regionId":3,"regionName":"EMEA"}},{"dealClientId":0,"employeeCode":"10TAN","firstName":"Andrew","lastName":"Tymms","familiarName":null,"partnerWorkTypeName":"DD","region":{"regionId":1,"regionName":"Asia/Pacific"}}],"priority":{"priorityId":1,"priorityName":"P1A"},"statusTypeName":null,"stageTypeName":null,"submittedBy":"","isMultipleEmployee":true,"isMultipleClient":false,"committed":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"ovp":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"heardFrom":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"nextCall":[{"employeeCode":"48248","expertName":"Jain, Shreyas (NDS)","categoryId":0,"categoryName":"","expertise":"","bainOffice":"New Delhi - BCC","expertIndustries":"","industry":"","expertClients":"","client":"","note":"","isMultipleEmployee":false,"isMultipleClient":true,"expertState":0,"filterState":0}],"clientId":168,"clientName":"Bain Capital","clientHead":["Lipman, David (01DLP)","Bierly, Christopher (CBIER)","Weddigen, Rolf-Magnus (04RWE)","Greenspan, Nicholas (03NGR)","Tymms, Andrew (10TAN)"]}]')
        let clientAllocation = JSON.parse('[{"dealId":0,"clientId":169,"allocationType":1,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":2,"employeeCode":"48248","lastUpdatedBy":null},{"dealId":0,"clientId":169,"allocationType":3,"employeeCode":"48248","lastUpdatedBy":null}]')
        component.deal = {
            "priorWork": "",
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
            "attendees": null,
            "dateOfCall": null,
            "sentTo": null, "trainers": null,
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

    it('should set trainers', () => {
        let employee = {
            'employeeCode': '48414',
            'searchableName': 'Nischal Mishra'
        }
        component.deal.trainers = [];
        component.selectedTrainers = [];
        component.selectedTrainers.push(employee);
        spyOn(component, "setTrainers").and.callThrough();
        component.setTrainers('');
        expect(component.deal.trainers.length).toBeGreaterThan(0);
    });

    it('should set attendes', () => {
        let employee = {
            'employeeCode': '48414',
            'searchableName': 'Nischal Mishra'
        }
        component.deal.attendees = [];
        component.selectedAttendees = [];
        component.selectedAttendees.push(employee);
        spyOn(component, "setAttendees").and.callThrough();
        component.setAttendees('');
        expect(component.deal.attendees.length).toBeGreaterThan(0);
    });

    it('should set sentto', () => {
        let employee = {
            'employeeCode': '48414',
            'searchableName': 'Nischal Mishra'
        }
        component.deal.sentTo = [];
        component.selectedSentTO = [];
        component.selectedSentTO.push(employee);
        spyOn(component, "setSentTO").and.callThrough();
        component.setSentTO('');
        expect(component.deal.sentTo.length).toBeGreaterThan(0);
    });

    it('should get guid for external employee', () => {
        let eCode = component.GuidForExternalEmloyee();
        spyOn(component, "GuidForExternalEmloyee").and.callThrough();
        expect(eCode).not.toBeNull();
    });

    it('should click on cancel', () => {
        component.myDateValue = null;
        spyOn(component, "cancel").and.callThrough();
        component.cancel();
        expect(component.myDateValue).toBeNull();
    });

});
