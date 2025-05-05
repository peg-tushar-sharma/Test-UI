import { Component, Input, OnChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Note } from '../../../shared/interfaces/note';
import { NoteService } from '../sidebar-notes.service';
import { NotesType } from '../../../shared/enums/notes-type.enum';
import { CoreService } from '../../../core/core.service';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-general-notes',
  templateUrl: './general-notes.component.html',
  styleUrls: ['./general-notes.component.scss']
})
export class GeneralNotesComponent implements OnChanges {

  @ViewChild('newNoteTextArea', { static: true })
  public newNoteTextArea: ElementRef<HTMLElement>;

  @Input()
  public registrationId: number;

  @Input()
  public isMasked: boolean;

  @Output()
  emitUpdatedNote  = new EventEmitter();

  public generalNotes: Note[];

  public notesType = NotesType;
  public addingNewNote = false;
  public updatingNote = false;
  private backupOldNote: Note;

  public newNote: Note;

  constructor(private noteService: NoteService, private coreService: CoreService, private toastr: PegTostrService) { 
    this.newNote = new Note(this.registrationId);
  }

  ngOnChanges() {
    this.getGeneralNotes();
  }

  getGeneralNotes() {
    if (this.registrationId) {
      this.generalNotes = [];
      this.noteService.getGeneralNotes(this.registrationId,this.isMasked)?.subscribe((notes: Note[]) => this.generalNotes = notes);
    }
  }

  addNewNote() {
    if (!this.addingNewNote) {
      this.addingNewNote = true;
      this.newNote = new Note(this.registrationId);

      setTimeout(() => {
        this.newNoteTextArea.nativeElement.focus();
      }, 1);
    }
  }

  saveNewNote() {
    this.newNote.submittedBy = this.coreService.loggedInUser.employeeCode;
    this.noteService.saveNewNote(this.newNote).subscribe((res: Note) => {
      if (res) {
        this.generalNotes.splice(0, 0, res);
        this.emitUpdatedNote.emit(res.notes);
        this.addingNewNote = false;
        this.toastr.showSuccess('The note has been saved successfully.', 'success');
      }
      else {
        this.toastr.showError('There is a problem in saving note. Please try again', 'error');
      }
    },
      (error: any) => {
        this.toastr.showError('There is a problem in saving note. Please try again', 'error');
      });
  }

  editNote(note: Note, editNoteTextArea: HTMLElement, editNoteModel: FormControl) {
    if (!this.addingNewNote && !this.updatingNote) {
      this.backupOldNote = Object.assign({}, note);
      note.isEditing = true;
      this.updatingNote = true;
      note.notes = '';
      editNoteModel.markAsPristine();
      const backupNotes = this.backupOldNote.notes;
      setTimeout(() => {
        note.notes = backupNotes;
        editNoteTextArea.focus();
      }, 1);
    }
  }

  saveNote(note: Note) {
    note.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
    this.noteService.updateNote(note).subscribe((res: Note) => {
      if (res) {
        note.notes = res.notes;
        note.lastUpdated = res.lastUpdated;
        note.lastUpdatedBy = res.lastUpdatedBy;
        note.lastUpdatedByName = res.lastUpdatedByName;
        note.isEditing = false;
        this.updatingNote = false;
        this.emitUpdatedNote.emit(note.notes);
        this.generalNotes.sort((a, b) => {
          return a.lastUpdated > b.lastUpdated ? -1 : a.lastUpdated < b.lastUpdated ? 1 : 0;
      });
        this.toastr.showSuccess('The note has been saved successfully.', 'success');
      }
      else {
        this.toastr.showError('There is a problem in saving note. Please try again', 'error');
      }
    },
      (error: any) => {
        this.toastr.showError('There is a problem in saving note. Please try again', 'error');
      });
  }

  cancelSave(note?: Note) {
    if (note) {
      note.notes = this.backupOldNote.notes;
      note.isEditing = false;
      this.updatingNote = false;
      this.backupOldNote = null;
    } else {
      this.addingNewNote = false;
    }
  }
}
