import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StaffingService } from '../staffing.service';
import { UpdateStageStaffingModalComponent } from './update-stage-staffing-modal.component';
describe('UpdateStageStaffingModalComponent', () => {
  let component: UpdateStageStaffingModalComponent;
  let fixture: ComponentFixture<UpdateStageStaffingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStageStaffingModalComponent ],
      providers:[BsModalRef,StaffingService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[HttpClientModule,
        HttpClientTestingModule, ModalModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStageStaffingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
