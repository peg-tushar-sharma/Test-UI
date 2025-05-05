import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { PipelineService } from '../../pipeline.service';
import { PipelineNoteComponent } from './pipeline-note.component';

describe('PipelineNoteComponent', () => {
  let component: PipelineNoteComponent;
 

  
  
  let fixture: ComponentFixture<PipelineNoteComponent>;
  let mockPegTostrService;
//   let mockBsModalService;
  let mockPipelineService;

  beforeEach(async () => {
    mockPipelineService = jasmine.createSpyObj("mockPipelineService",['getOfficeNote','getEmployeeNote']);
    mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
    //mockBsModalService = jasmine.createSpyObj('mockBsModalService', ['']);
    await TestBed.configureTestingModule({
      declarations: [ PipelineNoteComponent ],
      imports: [HttpClientTestingModule],
      providers: [PipelineService,PegTostrService,BsModalRef]
    })
    .compileComponents();
    
    TestBed.overrideProvider(PipelineService,{useValue: mockPipelineService});
    TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
    //TestBed.overrideProvider(BsModalRef, { useValue: mockBsModalService });
  });
 
  beforeEach(() => {
    mockPipelineService.getOfficeNote.and.returnValue(of([{officeCode:'1234',officeNote:'TestNote'}]));
    mockPipelineService.getEmployeeNote.and.returnValue(of([{employeeCode:'59039',employeeNote:'TestNote'}]));
    fixture = TestBed.createComponent(PipelineNoteComponent);
    component = fixture.componentInstance;  
    
    component.title="Manager";
    component.data=
  {
   employee : {
     employeeCode: '5939'
   },
   office:{
    officeCode:'1234'
   }
  }
  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
