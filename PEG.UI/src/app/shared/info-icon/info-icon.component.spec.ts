import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoIconComponent } from './info-icon.component';
import {SharedModule} from '../shared.module'
import { AlertModule } from 'ngx-bootstrap/alert';
import {  TooltipModule } from 'ngx-bootstrap/tooltip';

describe('InfoIconComponent', () => {
  let component: InfoIconComponent;
  let fixture: ComponentFixture<InfoIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoIconComponent ],
      imports:[AlertModule.forRoot(), TooltipModule.forRoot(),]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
