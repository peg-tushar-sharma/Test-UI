import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilterComponent } from './date-filter.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateFilterComponent ],
      imports:[BsDatepickerModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
