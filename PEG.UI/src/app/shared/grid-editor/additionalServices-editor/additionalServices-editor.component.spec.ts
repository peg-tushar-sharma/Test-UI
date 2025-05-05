import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GlobalService } from '../../../global/global.service';

import { AdditionalServicesEditorComponent } from './additionalServices-editor.component';

describe('AdditionalServicesEditorComponent', () => {
  let component: AdditionalServicesEditorComponent;
  let fixture: ComponentFixture<AdditionalServicesEditorComponent>;
  let mockglobalService;
  beforeEach(async () => {
    mockglobalService = jasmine.createSpyObj('mockglobalService', ['getAdditionalServices']);

    await TestBed.configureTestingModule({
      declarations: [AdditionalServicesEditorComponent],
      imports: [HttpClientTestingModule],
      providers: [GlobalService]
    })
      .compileComponents();
      TestBed.overrideProvider(GlobalService,{useValue: mockglobalService});
  });

  beforeEach(() => {
    mockglobalService.getAdditionalServices.and.returnValue(of([{additionalServicesId:'1',additionalServicesName:'test'}]));
    fixture = TestBed.createComponent(AdditionalServicesEditorComponent);
    component = fixture.componentInstance;
    component.params=
    {
      data : {
        team: {
          additionalServicesId:1,
          additionalServicesName:'test'
        }
     }
   
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
