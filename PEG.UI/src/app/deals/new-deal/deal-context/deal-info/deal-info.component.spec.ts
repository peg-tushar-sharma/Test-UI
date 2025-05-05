import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DealInfoComponent } from './deal-info.component';
import { FormsModule, NgForm, ControlContainer } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewRegistrationService } from '../../../../registrations/new-registration/new-registration.service';
import { DealsService } from '../../../deals.service';
import { of } from 'rxjs';
import { mockDealData } from '../../../../Mock/mockDealData';
import { GlobalService} from './../../../../global/global.service';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('DealInfoComponent', () => {
    let component: DealInfoComponent;
    let fixture: ComponentFixture<DealInfoComponent>;
    let mockGlobalService;

    beforeEach(waitForAsync(() => {        
        mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getRegions','getLocationofDeals']);

        TestBed.configureTestingModule({
            declarations: [DealInfoComponent],
            imports: [FormsModule, NgSelectModule,HttpClientTestingModule],
            providers: [NgForm,NewRegistrationService,DealsService,GlobalService]
        })
        TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService })

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DealInfoComponent);
        component = fixture.componentInstance;
        mockGlobalService.getLocationofDeals.and.returnValue(of(
            [{
                locationDealId: 1,
                locationName: "UAE"
            }]
        ));

        mockGlobalService.getRegions.and.returnValue(of(
            [{
                regionId: 1,
                regionName: 'Asia/Pacific'
            }]
        ));

        component.deal = mockDealData;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get location on change', () => {
        component.onLocationChange({locationName:'UAE'})
        expect(component.isClearOnLocation).toBeTruthy();
        fixture.detectChanges();

        component.onLocationChange({locationName:''})
        expect(component.isClearOnLocation).toBeFalsy();
        fixture.detectChanges();
    });

});
