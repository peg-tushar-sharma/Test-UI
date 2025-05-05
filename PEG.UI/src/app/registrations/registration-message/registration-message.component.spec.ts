import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationMessageComponent } from './registration-message.component';
import { CoreService } from '../../core/core.service';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { RegistrationMessageService } from './registration-message.service';
import { of } from 'rxjs';

@Component({
  selector: 'fake',
  templateUrl: './registration-message.component.html',
  styleUrls: ['./registration-message.component.scss']
})
export class FakeComponent{
  constructor(){}
}

describe('RegistrationMessageComponent', () => {
  let component: RegistrationMessageComponent;
  let fixture: ComponentFixture<RegistrationMessageComponent>;

  let routes: Routes = [
    {
      path: 'search/newregistration',
      component: FakeComponent
    },
    {
      path: 'registrations/newregistration',
      component: FakeComponent
    }
  ];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [RegistrationMessageComponent, FakeComponent],
      providers: [CoreService, RegistrationMessageService, {
        provide: ActivatedRoute,
        useValue: {'params': of({term:'RS'})}
      }],
      imports: [HttpClientModule, RouterTestingModule.withRoutes(routes)]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
