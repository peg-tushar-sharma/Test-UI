import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OfficeEditorComponent } from './office-editor.component';
import { NewRegistrationService } from '../../../registrations/new-registration/new-registration.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OfficeEditorComponent', () => {
  let component: OfficeEditorComponent;
  let fixture: ComponentFixture<OfficeEditorComponent>;
  let mockNewRegistrationservice;

  beforeEach(async(() => {
    mockNewRegistrationservice = jasmine.createSpyObj('mockNewRegistrationservice', ['getOffice']);

    TestBed.configureTestingModule({
      declarations: [ OfficeEditorComponent ],
      imports: [HttpClientTestingModule],
      providers: [NewRegistrationService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    TestBed.overrideProvider(NewRegistrationService, {useValue: mockNewRegistrationservice});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeEditorComponent);
    component = fixture.componentInstance;

    mockNewRegistrationservice.getOffice.and.returnValue(of(['']));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
