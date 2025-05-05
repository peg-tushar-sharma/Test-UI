import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Note } from '../../../shared/interfaces/note';

@Component({
  selector: 'app-add-note-form',
  templateUrl: './add-note-form.component.html',
  styleUrls: ['./add-note-form.component.scss'],
})
export class AddNoteFormComponent {
  @Input() registrationId: number;
  @Output() noteAdded = new EventEmitter<Note>();

  noteInput = new FormControl('');

  clearNote(): void {
    this.noteInput.setValue('');
  }

  addNote(): void {
    const inputValue = this.noteInput.value.trim();
    if (inputValue !== '') {
      const newNote = new Note(this.registrationId);
      newNote.notes = inputValue;
      this.noteAdded.emit(newNote);
    }
  }
}
