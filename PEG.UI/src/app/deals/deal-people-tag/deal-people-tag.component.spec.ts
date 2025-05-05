import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, SimpleChange, SimpleChanges, Output, HostListener } from '@angular/core';

import { DealPeopleTagComponent } from './deal-people-tag.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DealsService } from '../deals.service';
import { FormsModule, NgForm } from '@angular/forms';
import { PegTostrService } from '../../core/peg-tostr.service';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { deals } from '../deal';
import { PopupComponent } from 'ag-grid-community';
import { expertGroup } from '../new-deal/deal-experts/expertGroup';
import { DealClient } from '../new-deal/deal-clients/dealClient';


describe('DealPeopleTagComponent', () => {

    let component: DealPeopleTagComponent;
    let fixture: ComponentFixture<DealPeopleTagComponent>;
    let mockDealsService;
    let mockPegTostrService;

    beforeEach(async(() => {
        mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
        mockDealsService = jasmine.createSpyObj('mockDealsService', ['getDealTaggedPeopleById']);

        TestBed.configureTestingModule({
            declarations: [DealPeopleTagComponent],
            imports: [NgSelectModule, FormsModule, ToastrModule.forRoot()],
            providers: [DealsService, PegTostrService]
        })
        TestBed.overrideProvider(DealsService, { useValue: mockDealsService })
        TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DealPeopleTagComponent);
        component = fixture.componentInstance;
        component.taggedPplList = [{ "dealPeopleTagId": 56, "dealId": 0, "employeeCode": "01ASA", "firstName": "Ana", "lastName": "Smith", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Senior Counsel, Americas", "pegRole": 7, "pegRoleName": "General" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "01NIA", "firstName": "Steven", "lastName": "Stepanian", "familiarName": "Steve", "employeeStatusCode": "A", "office_name": "Amsterdam", "positionTitle": "Director, Talent and Operations, EM", "pegRole": 2, "pegRoleName": "PEG Operations" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "01REU", "firstName": "Reuven", "lastName": "Steinberg", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Expert Principal", "pegRole": 2, "pegRoleName": "PEG Operations" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "01RSH", "firstName": "Rebecca", "lastName": "Burack", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Director", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "10TAN", "firstName": "Andrew", "lastName": "Tymms", "familiarName": null, "employeeStatusCode": "A", "office_name": "Melbourne", "positionTitle": "Director", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "14CVU", "firstName": "Christophe", "lastName": "De Vusser", "familiarName": null, "employeeStatusCode": "A", "office_name": "Brussels", "positionTitle": "Director", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "15ELL", "firstName": "Erica", "lastName": "Fiene", "familiarName": null, "employeeStatusCode": "A", "office_name": "Atlanta", "positionTitle": "Senior Program Manager, Americas PE", "pegRole": 4, "pegRoleName": "Multibidder Manager" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "26KYA", "firstName": "Yiqi", "lastName": "Yang", "familiarName": "Kiki", "employeeStatusCode": "A", "office_name": "Hong Kong", "positionTitle": "Vice President", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "42162", "firstName": "Abhishek", "lastName": "Gupta", "familiarName": null, "employeeStatusCode": "A", "office_name": "New Delhi - BCC", "positionTitle": "Senior Coordinator, TSG, Quality As", "pegRole": 4, "pegRoleName": "Multibidder Manager" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "46225", "firstName": "Zoe", "lastName": "Grant", "familiarName": null, "employeeStatusCode": "A", "office_name": "London", "positionTitle": "Specialist, Private Equity Operatio", "pegRole": 4, "pegRoleName": "Multibidder Manager" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "47812", "firstName": "Claire", "lastName": "Michaud", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Specialist, Risk Management", "pegRole": 4, "pegRoleName": "Multibidder Manager" }]

        mockDealsService.getDealTaggedPeopleById.and.returnValue(of(
            [{ "dealPeopleTagId": 56, "dealId": 0, "employeeCode": "01ASA", "firstName": "Ana", "lastName": "Smith", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Senior Counsel, Americas", "pegRole": 7, "pegRoleName": "General" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "01NIA", "firstName": "Steven", "lastName": "Stepanian", "familiarName": "Steve", "employeeStatusCode": "A", "office_name": "Amsterdam", "positionTitle": "Director, Talent and Operations, EM", "pegRole": 2, "pegRoleName": "PEG Operations" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "01REU", "firstName": "Reuven", "lastName": "Steinberg", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Expert Principal", "pegRole": 2, "pegRoleName": "PEG Operations" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "01RSH", "firstName": "Rebecca", "lastName": "Burack", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Director", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "10TAN", "firstName": "Andrew", "lastName": "Tymms", "familiarName": null, "employeeStatusCode": "A", "office_name": "Melbourne", "positionTitle": "Director", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "14CVU", "firstName": "Christophe", "lastName": "De Vusser", "familiarName": null, "employeeStatusCode": "A", "office_name": "Brussels", "positionTitle": "Director", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "15ELL", "firstName": "Erica", "lastName": "Fiene", "familiarName": null, "employeeStatusCode": "A", "office_name": "Atlanta", "positionTitle": "Senior Program Manager, Americas PE", "pegRole": 4, "pegRoleName": "Multibidder Manager" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "26KYA", "firstName": "Yiqi", "lastName": "Yang", "familiarName": "Kiki", "employeeStatusCode": "A", "office_name": "Hong Kong", "positionTitle": "Vice President", "pegRole": 3, "pegRoleName": "PEG Leadership" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "42162", "firstName": "Abhishek", "lastName": "Gupta", "familiarName": null, "employeeStatusCode": "A", "office_name": "New Delhi - BCC", "positionTitle": "Senior Coordinator, TSG, Quality As", "pegRole": 4, "pegRoleName": "Multibidder Manager" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "46225", "firstName": "Zoe", "lastName": "Grant", "familiarName": null, "employeeStatusCode": "A", "office_name": "London", "positionTitle": "Specialist, Private Equity Operatio", "pegRole": 4, "pegRoleName": "Multibidder Manager" }, { "dealPeopleTagId": 0, "dealId": 0, "employeeCode": "47812", "firstName": "Claire", "lastName": "Michaud", "familiarName": null, "employeeStatusCode": "A", "office_name": "Boston", "positionTitle": "Specialist, Risk Management", "pegRole": 4, "pegRoleName": "Multibidder Manager" }]
        ));


        fixture.detectChanges();
    });

    it('should create', () => {

        expect(component).toBeTruthy();
    });

    it('Add People to tagged List', () => {
        const newUser = JSON.parse('{"contentId":"00000000-0000-0000-0000-000000000000","employeeCode":"42VRU","lastName":"Shrivastava","firstName":"Varun","familiarName":null,"title":"Lead Software Engineer","officeName":"New Delhi - BCC","levelGrade":null,"employeeStatusCode":"A","lastUpdated":"0001-01-01T00:00:00Z","lastUpdatedBy":null,"lastUpdatedName":null,"pegRole":5,"pegRoleName":"PEG Administrator","searchableName":"Shrivastava, Varun (42VRU)"}')
        component.onPeopleAdd(newUser)
        fixture.detectChanges();
        expect(component.taggedPplList.some(x => x.employeeCode == newUser.employeeCode)).toBeTruthy();
    });

    it('Remove to tagged List', () => {
        const newUser = JSON.parse('{"contentId":"00000000-0000-0000-0000-000000000000","employeeCode":"42VRU","lastName":"Shrivastava","firstName":"Varun","familiarName":null,"title":"Lead Software Engineer","officeName":"New Delhi - BCC","levelGrade":null,"employeeStatusCode":"A","lastUpdated":"0001-01-01T00:00:00Z","lastUpdatedBy":null,"lastUpdatedName":null,"pegRole":5,"pegRoleName":"PEG Administrator","searchableName":"Shrivastava, Varun (42VRU)"}')
        component.removePeople(newUser);
        fixture.detectChanges()
        expect(component.taggedPplList.some(x => x.employeeCode == '42VRU')).toBeFalsy();
    });
    it('should Save Tagged People to local', () => {
        let ele: ElementRef = new ElementRef({ click() { } });
        component.PopupModal = ele;
        component.SaveToDatabase = false;
        component.deal = new deals();
        component.deal.dealId = 0;
        component.SaveTaggedPeople();
        expect(component.taggedPplList.length).toEqual(0);
    })
    it('should clear items', () => {
        component.form = new NgForm([], []);
        component.clearItems();
        expect(component.typeaheadPeopleList.length).toEqual(0)
    })

    it('should Call NgOnChange', () => {
        component.SaveToDatabase = false;
        component.ngOnChanges({
            deal: new SimpleChange(null, component.deal,true)
        });
        fixture.detectChanges();
        expect(component.taggedPplList.length).toBeGreaterThanOrEqual(0)
    })

});
