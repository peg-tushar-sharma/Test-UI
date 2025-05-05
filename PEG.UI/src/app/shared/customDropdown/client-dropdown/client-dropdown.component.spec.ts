import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDropdownComponent } from './client-dropdown.component';
import { FormsModule } from '@angular/forms';


describe('ClientDropdownComponent', () => {
  let component: ClientDropdownComponent;
  let fixture: ComponentFixture<ClientDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDropdownComponent ],
      imports :[FormsModule]    
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
