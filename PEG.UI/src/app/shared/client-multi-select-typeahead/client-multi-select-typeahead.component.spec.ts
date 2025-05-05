import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewRegistrationService } from '../../registrations/new-registration/new-registration.service';
import { NewOpportunityService } from '../../opportunity/new-opportunity/new-opportunity.service';

import { ClientMultiSelectTypeaheadComponent } from './client-multi-select-typeahead.component';

describe('ClientMultiSelectTypeaheadComponent', () => {
  let component: ClientMultiSelectTypeaheadComponent;
  let fixture: ComponentFixture<ClientMultiSelectTypeaheadComponent>;
  let mockNewRegistrationservice;

  beforeEach(async(() => {
    mockNewRegistrationservice = jasmine.createSpyObj('mockNewRegistrationservice',['getClientsByName']);
    TestBed.configureTestingModule({
      declarations: [ ClientMultiSelectTypeaheadComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NgSelectModule, FormsModule, HttpClientModule,
        HttpClientTestingModule
      ],
      providers:[NewRegistrationService,NewOpportunityService],
      
    })
    
    TestBed.overrideProvider(NewRegistrationService,{ useValue: mockNewRegistrationservice});
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMultiSelectTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
