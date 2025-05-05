import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDropdownComponent } from './date-dropdown.component';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../global/global.service';
import { HttpClientModule } from '@angular/common/http';


describe('DateDropdownComponent', () => {
  let component: DateDropdownComponent;
  let fixture: ComponentFixture<DateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateDropdownComponent ],
      imports :[FormsModule,HttpClientModule],
      providers:[GlobalService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
