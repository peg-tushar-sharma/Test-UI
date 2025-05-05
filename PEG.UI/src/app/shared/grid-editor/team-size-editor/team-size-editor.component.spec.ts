import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GlobalService } from '../../../global/global.service';

import { TeamSizeEditorComponent } from './team-size-editor.component';

describe('TeamSizeEditorComponent', () => {
  let component: TeamSizeEditorComponent;
  let fixture: ComponentFixture<TeamSizeEditorComponent>;
  let mockglobalService;
  beforeEach(async () => {
    mockglobalService = jasmine.createSpyObj('mockglobalService', ['getTeamSize']);

    await TestBed.configureTestingModule({
      declarations: [TeamSizeEditorComponent],
      imports: [HttpClientTestingModule],
      providers: [GlobalService]
    })
      .compileComponents();
      TestBed.overrideProvider(GlobalService,{useValue: mockglobalService});
  });

  beforeEach(() => {
    mockglobalService.getTeamSize.and.returnValue(of([{teamSizeId:'1',teamSize:'test'}]));
    fixture = TestBed.createComponent(TeamSizeEditorComponent);
    component = fixture.componentInstance;
    component.params=
    {
      data : {
        team: {
          teamSizeId:1,
          teamSize:'test'
        }
     }
   
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
