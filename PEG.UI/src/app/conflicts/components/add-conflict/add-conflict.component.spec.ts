// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { AddConflictComponent } from './add-conflict.component';
// import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
// import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { By } from '@angular/platform-browser';
// import { ConflictsService } from '../../../dashboard/services/conflicts.service';

// describe('AddConflictComponent', () => {
//   let component: AddConflictComponent;
//   let fixture: ComponentFixture<AddConflictComponent>;
//   let ConflictsService:ConflictsService
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ AddConflictComponent ],
//       imports: [ReactiveFormsModule, NgbModalModule, NgSelectModule],
//       providers: [
//         {
//           provide: NgbActiveModal,
//           useValue: {
//             close: () => {},
//           }
//         }
//       ]
//     })
//     .compileComponents();
//   });
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     ConflictsService = TestBed.inject(ConflictsService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AddConflictComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should define the form properly', () => {
//     component.ngOnInit();

//     expect(component.addConflictForm).toBeDefined();
//     expect(component.addConflictForm.get('type')).toBeInstanceOf(AbstractControl);
//     expect(component.addConflictForm.get('companyName')).toBeInstanceOf(AbstractControl);
//     expect(component.addConflictForm.get('submittedBy')).toBeInstanceOf(AbstractControl);
//     expect(component.addConflictForm.get('submittedDate')).toBeInstanceOf(AbstractControl);
//     expect(component.addConflictForm.get('stages')).toBeInstanceOf(AbstractControl);
//     expect(component.addConflictForm.get('notes')).toBeInstanceOf(AbstractControl);
//   });

//   it('should attempt to close the modal when the cancel button is clicked', () => {
//     spyOn(component, 'closeModal');
//     const cancelButton = fixture.debugElement.query(By.css('button[type=button]'));

//     expect(cancelButton).toBeDefined();

//     cancelButton.nativeElement.click();

//     expect(component.closeModal).toHaveBeenCalled();
//   });

//   it('should NOT call saveConflict when form is invalid and save button is clicked', () => {
//     spyOn(component, 'saveConflict');
//     const saveButton = fixture.debugElement.query(By.css('button.save-button'));

//     expect(saveButton).toBeDefined();

//     saveButton.nativeElement.click();

//     expect(component.saveConflict).not.toHaveBeenCalled();
//   });

//   it('should call saveConflict when form is valid and save button is clicked', () => {
//     spyOn(component, 'saveConflict');
//     component.addConflictForm.setValue({
//       type: 'Confidential',
//       companyName: 'Example Co.',
//       submittedBy: 'Administrator User',
//       submittedDate: '2024-01-01',
//       stages: 'active',
//       notes: ''
//     });
//     fixture.detectChanges();

//     const saveButton = fixture.debugElement.query(By.css('button.save-button'));
//     saveButton.nativeElement.click();

//     expect(component.saveConflict).toHaveBeenCalled();
//   });
// });
