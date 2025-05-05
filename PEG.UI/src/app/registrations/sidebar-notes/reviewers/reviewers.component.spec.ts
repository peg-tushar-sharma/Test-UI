import { Component, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import { ReviewersComponent } from './reviewers.component';

describe('ReviewersComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let component: ReviewersComponent;
  let fixture: ComponentFixture<ReviewersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewersComponent,TestHostComponent ],
      imports:[ FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance; 
    fixture = TestBed.createComponent(ReviewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
   it('should call onchanges', () => { 
    testHostComponent.setregistrationId('1');
    testHostFixture.detectChanges(); 
    expect(testHostFixture.nativeElement.querySelector('#tab-content-reviewers table thead th input').value=='').toBeTruthy();
    
  });

  @Component({
    selector: `host-component`,
    template: `<app-reviewers [registrationId]="registrationId"></app-reviewers>`
  })
  class TestHostComponent {
    private registrationId: string;

    setregistrationId(newInput: string) {
      this.registrationId = newInput;
    }
  }
});
