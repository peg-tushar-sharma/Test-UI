import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { OppEditComponent } from './opp-edit.component';
import { SharedModule } from '../../../shared/shared.module';

describe('OppEditComponent', () => {
  let component: OppEditComponent;
  let fixture: ComponentFixture<OppEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OppEditComponent ],
      imports: [HttpClientTestingModule, FormsModule, NgSelectModule, SharedModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OppEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});