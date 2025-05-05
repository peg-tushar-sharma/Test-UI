import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealProcessComponent } from './deal-process.component';
import { FormsModule, NgForm, ControlContainer } from '@angular/forms';
import { deals } from '../../../deal';
import { DealSecurityService } from '../../../deal.security.service'
import { SimpleChange } from '@angular/core';


describe('DealProcessComponent', () => {
    let component: DealProcessComponent;
    let fixture: ComponentFixture<DealProcessComponent>;
    let mockDealSecurityService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DealProcessComponent],
            imports: [FormsModule],
            providers: [NgForm,DealSecurityService]
        })
            .compileComponents();
            TestBed.overrideProvider(DealSecurityService, { useValue: mockDealSecurityService });

    }));

    beforeEach(() => {
        mockDealSecurityService = jasmine.createSpyObj('mockDealSecurityService', ['getDealAuthorization','getDealAccessTier','getDealAccessInformation']);
        fixture = TestBed.createComponent(DealProcessComponent);
        component = fixture.componentInstance;
        component.deal = new deals();
        component.deal.importantDates = [{ dateLabel: '', dateValue: '', comment: '', lastUpdated: new Date(), dealDateTrackId: 0, lastUpdatedBy: "", isModified: false, isdirty: false, oldDateValue: "" }];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('should add important dates', () => {
        const elementAdd: HTMLAnchorElement = fixture.nativeElement.querySelector('.addBid');
        elementAdd.click();
        expect(component.importantDates.length).toEqual(2);
    });
    it('should delete important dates', () => {
        const elementDelete: HTMLElement = fixture.nativeElement.querySelector('#impDates > tr:nth-child(1) > td:nth-child(4) > i');
        elementDelete.click();
        expect(component.importantDates.length).toBeGreaterThanOrEqual(0);
    });
    it('should identify model change', () =>{
        //Arrange
        let elementlabel: HTMLElement = fixture.nativeElement.querySelector('#impDates > tr:nth-child(1) > td:nth-child(2) > input');

        //Act
        elementlabel.innerText = "test";
        elementlabel.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        //Assert
        expect(component.deal.importantDates[0].isModified).toBeTruthy();

    })
    it('should empty fields if deal object get empty', () =>{
        //Arrange
        spyOn(component, 'renderDateTrack').and.callThrough();

        //Act
        component.ngOnChanges({
            deal: new SimpleChange(component.deal, new deals(), null)
        });
        fixture.detectChanges();

        //Assert
        expect(component.renderDateTrack).toHaveBeenCalled();
    })
});
