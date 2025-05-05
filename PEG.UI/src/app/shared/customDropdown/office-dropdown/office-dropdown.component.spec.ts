import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeDropdownComponent } from './office-dropdown.component';
import { FormsModule } from '@angular/forms';


describe('OfficeDropdownComponent', () => {
  let component: OfficeDropdownComponent;
  let fixture: ComponentFixture<OfficeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeDropdownComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
