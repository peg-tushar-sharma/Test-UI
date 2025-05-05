import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryEditorComponent } from './industry-editor.component';
import { FormsModule } from '@angular/forms'; 
import { NgSelectModule } from '@ng-select/ng-select';
import { NewRegistrationService } from '../../../registrations/new-registration/new-registration.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('IndustryEditorComponent', () => {
  let component: IndustryEditorComponent;
  let fixture: ComponentFixture<IndustryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports:[FormsModule,NgSelectModule,HttpClientModule,HttpClientTestingModule],
      declarations: [ IndustryEditorComponent ],
      providers:[NewRegistrationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
