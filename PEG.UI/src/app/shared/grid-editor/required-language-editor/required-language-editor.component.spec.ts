import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GlobalService } from '../../../global/global.service';
import { RequiredLanguageEditorComponent } from './required-language-editor.component';




describe('RequiredLanguageEditorComponent', () => {
  let component: RequiredLanguageEditorComponent;
  let fixture: ComponentFixture<RequiredLanguageEditorComponent>;
  let mockGlobalService;
  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['getLanguages']);

    await TestBed.configureTestingModule({
      declarations: [ RequiredLanguageEditorComponent ],
      imports: [HttpClientTestingModule],
      providers: [GlobalService]
    })
    .compileComponents();
    TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredLanguageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
