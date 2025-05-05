// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ConflictsComponent } from './conflicts.component';
// import { FormsModule } from '@angular/forms';
// import { AgGridModule } from 'ag-grid-angular';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { of } from 'rxjs';
// import { By } from '@angular/platform-browser';

// describe('ConflictsComponent', () => {
//   let component: ConflictsComponent;
//   let fixture: ComponentFixture<ConflictsComponent>;
//   let modalService: NgbModal;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ ConflictsComponent ],
//       imports: [FormsModule, AgGridModule],
//       providers: [
//         {
//           provide: NgbModal,
//           useValue: {
//             open: (_, options = {}) => {
//               return {
//                 closed: of({})
//               };
//             }
//           }
//         }
//       ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ConflictsComponent);
//     modalService = TestBed.inject(NgbModal);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the correct columns', () => {
//     component.ngOnInit();

//     expect(component.columnDefs[0].headerName).toEqual('Type');
//     expect(component.columnDefs[1].headerName).toEqual('Company');
//     expect(component.columnDefs[2].headerName).toEqual('Submitted By');
//     expect(component.columnDefs[3].headerName).toEqual('Submitted Date');
//     expect(component.columnDefs[4].headerName).toEqual('Stages');
//     expect(component.columnDefs[5].headerName).toEqual('Notes');
//   });

//   it('should open the modal when clicking Add Conflict button', () => {
//     spyOn(modalService, 'open').and.callThrough();
//     const button = fixture.debugElement.query(By.css('.btn-class'));

//     button.nativeElement.click();

//     expect(modalService.open).toHaveBeenCalled();
//   });
// });
