import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DurationDropdownComponent } from './duration-dropdown.component';
import { GlobalService } from '../../../global/global.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('DurationdropdownComponent', () => {
  let component: DurationDropdownComponent;
  let fixture: ComponentFixture<DurationDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationDropdownComponent ],
      imports :[FormsModule,HttpClientModule],
      providers:[GlobalService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
