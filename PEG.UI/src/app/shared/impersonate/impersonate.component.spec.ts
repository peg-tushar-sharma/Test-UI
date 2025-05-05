import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpersonateComponent } from './impersonate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ImpersonateComponent', () => {
  let component: ImpersonateComponent;
  let fixture: ComponentFixture<ImpersonateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ ImpersonateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpersonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input text box', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('#employeeCode')).length).toEqual(1);
  });
});
