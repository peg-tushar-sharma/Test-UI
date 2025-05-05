import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AuditLog } from '../../../shared/AuditLog/AuditLog';
import { AuditLogRepositoryService } from '../../../shared/AuditLog/audit-log-repository.service';
import { NoteService } from '../../../registrations/sidebar-notes/sidebar-notes.service';
import { Note } from '../../../shared/interfaces/note';
import { CoreService } from '../../../core/core.service';

@Component({
  selector: 'app-details-history',
  templateUrl: './details-history.component.html',
  styleUrls: ['./details-history.component.scss'],
})
export class DetailsHistoryComponent implements OnChanges {
  @Input() registrationId: number;
  @Input() historyType: 'notes' | 'audit';

  @Output() sidebarHidden = new EventEmitter();

  public isLoading = false;
  public logs: AuditLog[] = [];
  public notes: Note[] = [];

  constructor(
    private auditLogRepositoryService: AuditLogRepositoryService,
    private noteService: NoteService,
    private coreService: CoreService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.historyType && changes.historyType.currentValue) {
      this.getRecords();
    }
  }

  getRecords(): void {
    if (this.registrationId > 0 && this.historyType) {
      this.isLoading = true;
      // getting data in the component to show the logs whenever user clicks on the history button.
      // Now user don't have to refresh the page to see the logs.
      if (this.historyType === 'audit') {
        this.auditLogRepositoryService.getAuditLogs(this.registrationId, false).subscribe((logs) => {
          this.logs = logs;
          this.isLoading = false;
        });
      }

      if (this.historyType === 'notes') {
        // TODO: Call notes service to retrieve notes.
        if (this.registrationId) {
          this.noteService.getGeneralNotes(this.registrationId, false).subscribe((notes: Note[]) => {
            this.notes = notes;
            this.isLoading = false;
          });
        }
      }
    }
  }
  hideSidebar() {
    this.sidebarHidden.emit();
  }

  addNewNote(note: Note) {
    note.submittedBy = this.coreService.loggedInUser.employeeCode;
    this.noteService.saveNewNote(note).subscribe(() => {
      this.getRecords();
    });
  }
}
