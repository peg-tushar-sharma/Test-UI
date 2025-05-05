import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkTypeEditorComponent } from './work-type-editor.component';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { GlobalService } from '../../../../app/global/global.service';

describe('WorkTypeEditorComponent', () => {
  let component: WorkTypeEditorComponent;
  let fixture: ComponentFixture<WorkTypeEditorComponent>;
  let mockRegistrationService;
  let mockGlobalService;

  beforeEach(async(() => {
    mockRegistrationService = jasmine.createSpyObj('mockRegistrationService', ['getRegistrationData', 'getRegistrationStatus',
      'getRegistrationStage', 'updateRegistration', 'getProhibitions', 'getInvestments', 'getGridColumns', 'getUserAuthorization','setFieldAuthorization']);

    mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getWorkTypeData']);

    TestBed.configureTestingModule({
      declarations: [ WorkTypeEditorComponent ],
      imports:[NgSelectModule, FormsModule],
      providers:[RegistrationService]
    });
    TestBed.overrideProvider(RegistrationService, { useValue: mockRegistrationService });
    TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTypeEditorComponent);
    component = fixture.componentInstance;
    mockGlobalService.getWorkTypeData.and.returnValue(of([{ workTypeId: 1, workTypeName: 'debt' },{ workTypeId: 2, workTypeName: 'equity' }]));
    component.params = {
      workType: 'debt',
      data: {
        workType:  'debt',
      }
  }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize typeahead', () => {
    let mockParams = {
        params: {
            data: {
                workType: 'debt',
                
            }
        }
    }
    component.agInit(mockParams.params);
    fixture.detectChanges();
    expect(component.selectedWorkType).toBe(mockParams.params.data.workType);
});


it('should have popup set to true', () => {
    expect(component.isPopup()).toBeTruthy();
});

it('should get status value', () => {
    expect(component.getValue()).not.toBeNull();
});

it('should reset workType', () => {
    component.resetWorkType();
    fixture.detectChanges();
    expect(component.params.workType).toBe('');
});

it('should change selection', () => {
    let mockWorkType = 'Buy Side (debt)';
    component.onSelectionChange(mockWorkType);
    fixture.detectChanges();
    expect(component.params.workType).toBe(mockWorkType);
});


});
