import { NotesType } from '../enums/notes-type.enum';

export class Note
{
    registrationId: number;
    noteId: number;
    notesTypeId: number;
    notes: string;
    lastUpdated: Date;
    lastUpdatedBy: string;
    lastUpdatedByName?: string;
    isEditing?: boolean;
    submittedBy?: string;
    submitDate?: Date;
    employee_code: string;

    /**
     * Initialize the values
     */
    constructor(registrationId?: number) {
        this.registrationId = registrationId ? registrationId : 0;
        this.noteId = 0;
        this.notesTypeId = NotesType.Legal;
        this.notes = '';
        this.isEditing = false;
    }
}