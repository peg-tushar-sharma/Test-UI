import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StageEditorComponent } from './stage-editor.component';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DealsService } from '../../../deals/deals.service';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { of } from 'rxjs';
import { GlobalService } from '../../../global/global.service';

describe('StageEditorComponent', () => {
    let component: StageEditorComponent;
    let fixture: ComponentFixture<StageEditorComponent>;
    let mockGlobalService;

    beforeEach(waitForAsync(() => {
        mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getRegistrationStage']);

        TestBed.configureTestingModule({
            declarations: [StageEditorComponent],
            imports: [HttpClientModule],
            providers: [RegistrationService, DealsService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();

        TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StageEditorComponent);
        component = fixture.componentInstance;

        component.params = {
            registrationStage: 'Interest',
            data: {
                registrationStage: 'Interest',
            }
        }
        mockGlobalService.getRegistrationStage.and.returnValue(of(['']));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize typeahead', () => {
        let mockParams = {
            params: {
                colDef:{
                    field:"stageTypeName"
                },
                data: {
                    stageTypeName: 'Interest',
                }
            }
        }
        component.agInit(mockParams.params);
        fixture.detectChanges();
        expect(component.selectedStage).toBe(mockParams.params.data.stageTypeName);
    });


    it('should have popup set to true', () => {
        expect(component.isPopup()).toBeTruthy();
    });

    it('should get status value', () => {
        expect(component.getValue()).not.toBeNull();
    });

    it('should reset stage', () => {
        component.currentColumn = 'stageTypeName';
        component.resetStage();
        fixture.detectChanges();
        expect(component.params.registrationStage).toBe('');
    });

    it('should change selection', () => {
        let mockStage = 'Commitment';
        component.onSelectionChange(mockStage);
        fixture.detectChanges();
        expect(component.params.registrationStage).toBe(mockStage);
    });

});
