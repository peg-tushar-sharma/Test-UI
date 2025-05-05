import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { of } from 'rxjs';
import { GlobalService } from '../../../global/global.service';

import { CaseComplexityEditorComponent } from './case-complexity-editor.component';

describe('CaseComplexityEditorComponent', () => {
  let component: CaseComplexityEditorComponent;
  let fixture: ComponentFixture<CaseComplexityEditorComponent>;
  let mockGlobalService;
  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getCaseComplexity']);

    await TestBed.configureTestingModule({
      declarations: [ CaseComplexityEditorComponent ],
     imports: [HttpClientTestingModule],
      providers: []
     
    })
    .compileComponents();
    TestBed.overrideProvider(GlobalService, {useValue: mockGlobalService});

  });
 
  beforeEach(() => {
    mockGlobalService.getCaseComplexity.and.returnValue(of([{caseComplexityId:'1',caseComplexityName:'test'}]));
    fixture = TestBed.createComponent(CaseComplexityEditorComponent);
    component = fixture.componentInstance;
    component.params=
    {
      data : {
        team: {
          caseComplexityId:1,
          caseComplexityName:'test'
        }
     }
   
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
