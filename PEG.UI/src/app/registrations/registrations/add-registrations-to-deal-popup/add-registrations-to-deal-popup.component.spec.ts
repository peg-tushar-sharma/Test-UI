// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { AddRegistrationsToDealPopupComponent } from './add-registrations-to-deal-popup.component';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { RegistrationService } from '../registration.service'
// import { FormsModule } from '@angular/forms';
// import { DealsService } from '../../../deals/deals.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router, Routes } from '@angular/router';
// import { SimpleChange, Component, ViewChild } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { Registrations } from '../registrations';



// describe('AddRegistrationsToDealPopupComponent', () => {
//   let component: AddRegistrationsToDealPopupComponent;
//   let fixture: ComponentFixture<AddRegistrationsToDealPopupComponent>;
//   let mockDealService;

//   beforeEach(async(() => {
//     mockDealService = jasmine.createSpyObj("mockDealService",["getDealsByName"]);

//     TestBed.configureTestingModule({
//       declarations: [ AddRegistrationsToDealPopupComponent ]
//       ,imports:[NgSelectModule,FormsModule]
//     })
//     TestBed.overrideProvider(DealsService, {useValue: mockDealService});

//     TestBed.compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AddRegistrationsToDealPopupComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
