import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralNotesComponent } from './general-notes.component';
import { NoteService } from '../sidebar-notes.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorHandler } from '../../../error/http-error-handler.service';
import { CoreModule } from '.././../../core/core.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorService } from '../../../../app/error/error.service';
import { SharedModule } from '../../../shared/shared.module';
import { of, throwError } from 'rxjs';
import { Note } from '../../../shared/interfaces/note';
import { CoreService } from '../../../core/core.service';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { FormControl } from '@angular/forms';
import { RegistrationService } from '../../../registrations/registrations/registration.service';

describe('GeneralNotesComponent', () => {
  let component: GeneralNotesComponent;
  let fixture: ComponentFixture<GeneralNotesComponent>;

  // services
  let coreService: CoreService;
  let notesService: NoteService;
  let toastrService: PegTostrService;

  // Mock variables
  let fakeNote: Note;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralNotesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NoteService, HttpErrorHandler, ErrorService, RegistrationService],
      imports: [
        CoreModule, HttpClientModule, HttpClientTestingModule, SharedModule
      ]
    });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(GeneralNotesComponent);
    component = fixture.componentInstance;

    // Services Injection
    coreService = fixture.debugElement.injector.get(CoreService);
    notesService = fixture.debugElement.injector.get(NoteService);
    toastrService = fixture.debugElement.injector.get(PegTostrService);

    let getGeneralNotesSpy = spyOn(notesService, 'getGeneralNotes').and.returnValue(of([fakeNote]));
    setMockData();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect changes', () => {
    // Arrange

    component.registrationId = 1;

    // Act
    fixture.detectChanges();
    component.ngOnChanges();

    // Assert
    expect(component.generalNotes[0].notes).toBe('general');
  });

  it('should add new note', () => {
    // Arrange

    // Act
    fixture.detectChanges();
    component.addNewNote();

    // Assert
    expect(component.newNote.noteId).toBe(0);
    expect(component.addingNewNote).toBeTruthy();
  });

  it('should save new note sucessfully', () => {
    // Arrange
    let getGeneralNotesSpy = spyOn(notesService, 'saveNewNote').and.returnValue(of(fakeNote));
    const spySubsciber = spyOn(toastrService, 'showSuccess').and.callThrough();
    component.registrationId = 1;

    // Act
    fixture.detectChanges();
    component.addNewNote();
    component.saveNewNote();

    // Assert
    expect(component.newNote.submittedBy).toBe(coreService.loggedInUser.employeeCode);
    expect(notesService.saveNewNote).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(component.generalNotes[0]).toBe(fakeNote);
      expect(component.addingNewNote).toBe(false);
      expect(spySubsciber).toHaveBeenCalled();
    }).catch(()=>{

    });
  });

  it('should save new note with error', () => {
    // Arrange
    let getGeneralNotesSpy = spyOn(notesService, 'saveNewNote').and.returnValue(throwError('Some error message'));
    const spySubsciber = spyOn(toastrService, 'showError');
    component.registrationId = 1;

    // Act
    fixture.detectChanges();
    component.saveNewNote();

    // Assert
    expect(notesService.saveNewNote).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(spySubsciber).toHaveBeenCalled();
    }).catch(()=>{

    });
  });

  it('should save new note no response', () => {
    // Arrange
    let getGeneralNotesSpy = spyOn(notesService, 'saveNewNote').and.returnValue(of(null));
    spyOn(toastrService, 'showError');
    component.registrationId = 1;

    // Act
    fixture.detectChanges();
    component.saveNewNote();

    // Assert
    expect(notesService.saveNewNote).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(toastrService.showError).toHaveBeenCalled();
    }).catch(()=>{

    });
  });

  it('should edit note', () => {
    // Arrange
    let element = fixture.debugElement.nativeElement.querySelector("#newNoteTextArea");
    let control = new FormControl('value');

    // Act
    fixture.detectChanges();
    component.editNote(fakeNote, element, control);

    // Assert
    expect(fakeNote.isEditing).toBe(true);
    expect(component.updatingNote).toBeTruthy();
  });

  it('should save note sucessfully', () => {
    // Arrange
    let getGeneralNotesSpy = spyOn(notesService, 'updateNote').and.returnValue(of(fakeNote));
    let element = fixture.debugElement.nativeElement.querySelector("#newNoteTextArea");
    let control = new FormControl('value');
    spyOn(toastrService, 'showSuccess');
    component.registrationId = 1;

    // Act
    fixture.detectChanges();
    component.editNote(fakeNote, element, control);
    component.saveNote(fakeNote);

    // Assert
    expect(notesService.updateNote).toHaveBeenCalled();
    expect(fakeNote.lastUpdatedBy).toBe(coreService.loggedInUser.employeeCode);
    fixture.whenStable().then(() => {
      expect(fakeNote.isEditing).toBe(false);
      expect(toastrService.showSuccess).toHaveBeenCalled();
    }).catch(()=>{

    });
  });

  it('should save note with error', () => {
    // Arrange
    let getGeneralNotesSpy = spyOn(notesService, 'updateNote').and.returnValue(throwError('Some error message'));
    spyOn(toastrService, 'showError');
    component.registrationId = 1;

    // Act
    fixture.detectChanges();
    component.saveNote(fakeNote);

    // Assert
    expect(notesService.updateNote).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(toastrService.showError).toHaveBeenCalled();
    }).catch(()=>{

    });
  });

  it('should save note no response', () => {
    // Arrange
    let getGeneralNotesSpy = spyOn(notesService, 'updateNote').and.returnValue(of(null));
    spyOn(toastrService, 'showError');
    component.registrationId = 1;

    // Act
    fixture.detectChanges();
    component.saveNote(fakeNote);

    // Assert
    expect(notesService.updateNote).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(toastrService.showError).toHaveBeenCalled();
    }).catch(()=>{

    });
  });

  it('should cancel saving new note', () => {
    // Arrange

    // Act
    fixture.detectChanges();
    component.cancelSave();

    // Assert
    expect(component.addingNewNote).toBe(false);
  });

  it('should cancel saving existing note', () => {
    // Arrange
    let element = fixture.debugElement.nativeElement.querySelector("#newNoteTextArea");
    let control = new FormControl('value');

    // Act
    fixture.detectChanges();
    component.editNote(fakeNote, element, control);
    component.cancelSave(fakeNote);

    // Assert
    expect(fakeNote.isEditing).toBe(false);
    expect(component.updatingNote).toBe(false);
  });

  let setMockData = () => {
    fakeNote = <Note>{ noteId: 1, notes: 'general' };

    // set Mock User
    coreService.loggedInUser = {
      displayName: null
      , employeeCode: "47081"
      , employeeOffice: 111
      , familiarName: null
      , firstName: "Manav"
      , id: '13'
      , internetAddress: null
      , lastName: "Agarwal"
      , pages: [{ id: 2, name: "Dashboard", level: 1, redirectionUrl: "dashboard",isModal:false,modalTarget:'test',isHideInNavigation:false,claims:""  }]
      , profileImageUrl: "http://gxcdocs.local.bain.com/gxc3/files/Employee_Images/47081"
      , role: null
      , securityRoles: [{ id: 5, name: "PEG Administrator" }]
      , token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ik1hbmF2Iiwicm9sZSI6IlBFRyBBZG1pbmlzdHJhdG9yIiwibmJmIjoxNTYyMDYwMTYxLCJleHAiOjE1NjI2NjQ5NjEsImlhdCI6MTU2MjA2MDE2MX0.vf8kP3iyhaZfDtaV3q24qAC09IjakX-T6TkUGC2yi8s"
      , officeAbbreviation: "NDL"
      , employeeRegion: "Asia/Pacific"
      , employeeRegionId: 1
    };

    component.generalNotes = [fakeNote];
  };
});


