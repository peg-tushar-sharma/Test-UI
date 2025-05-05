import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StatusEditorComponent } from './status-editor.component';
import { DealsService } from '../../../deals/deals.service';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('StatusEditorComponent', () => {
    let component: StatusEditorComponent;
    let fixture: ComponentFixture<StatusEditorComponent>;
    let mockRegistrationService;

    beforeEach(waitForAsync(() => {
        mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationStatus']);

        TestBed.configureTestingModule({
            declarations: [StatusEditorComponent],
            imports: [HttpClientModule],
            providers: [RegistrationService, DealsService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
            
        TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatusEditorComponent);
        component = fixture.componentInstance;

        component.params = {
            registrationStatus: 'Cleared',
            data:{
                registrationStatus: 'Cleared',
            }
        }
        mockRegistrationService.getRegistrationStatus.and.returnValue(of(['']));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize typeahead', () => {
        let mockParams = {
            params: {
                data: {
                    statusTypeName: 'Cleared'
                }
            }
        }
        component.agInit(mockParams.params);
        fixture.detectChanges();
        expect(component.selectedStatus).toBe(mockParams.params.data.statusTypeName);
    });


    it('should have popup set to true', () => {
        expect(component.isPopup()).toBeTruthy();
    });

    it('should get status value', () => {
        expect(component.getValue()).not.toBeNull();
    });

    it('should reset status', () => {
        component.resetStatus();
        fixture.detectChanges();
        expect(component.params.registrationStatus).toBe('');
    });

    it('should change selection', () => {
        let mockStatus = 'Pending Partner Approval';
        component.onSelectionChange(mockStatus);
        fixture.detectChanges();
        expect(component.params.registrationStatus).toBe(mockStatus);
    });

});
