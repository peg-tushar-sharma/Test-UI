// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ClientEditorComponent } from './client-editor.component';
// import { FormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { HttpClientTestingModule } from  '@angular/common/http/testing';
// import { NewRegistrationService } from '../../../registrations/new-registration/new-registration.service';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { Client } from '../../interfaces/client';

// describe('ClientEditorComponent', () => {
//   let component: ClientEditorComponent;
//   let fixture: ComponentFixture<ClientEditorComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ClientEditorComponent ],
//       imports: [NgSelectModule, FormsModule, HttpClientTestingModule],
//       providers: [NewRegistrationService],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ClientEditorComponent);
//     component = fixture.componentInstance;

//       let mockClientData : Client[] = [{
//           clientId: 1,
//           basisClientId:1,
//           clientName: "Test International",
//           clientHeadEmployeeCode: null,
//           clientHeadFirstName: null,
//           clientHeadLastName: null,
//           clientPriorityId: 1,
//           clientPriorityName: null,
//           clientReferenceId: 30,
//           clientPrioritySortOrder:0
//       }];

//       component.clients = mockClientData;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize typeahead', () => {
//     let mockParams = {
//         params:{
//           data:{
//             isMultipleClient: true,
//             clientName:'test'
//           }
//         }
//       }
//     component.agInit(mockParams.params);
//     fixture.detectChanges();
//     expect(component.selectedClients).toBe(mockParams.params.data.clientName);
//   });

  
//   it('should have popup set to true', () => {
//     expect(component.isPopup()).toBeTruthy();
//   });

//   it('should get client value', () => {
//     expect(component.getValue()).not.toBeNull();
//   });

//   // it('should get single value', () => {
//   //     component.isMultiple = false;
//   //     component.params = {};
//   //     component.params.data = {};
//   //     component.params.data.client = {};
//   //     let mockData = {
//   //       clientReferenceId: 1
//   //     }
//   //   component.onClientChange(mockData);
//   //   fixture.detectChanges();
//   //   expect(component.params.data.clientId).toBe(mockData.clientReferenceId);
//   // });
// });
