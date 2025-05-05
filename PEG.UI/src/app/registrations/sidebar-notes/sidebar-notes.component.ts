import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { fieldAuth } from '../../shared/common/fieldAuth';

@Component({
  selector: 'app-sidebar-notes',
  templateUrl: './sidebar-notes.component.html',
  styleUrls: ['./sidebar-notes.component.scss']
})
export class SidebarNotesComponent implements OnInit, OnChanges {

  // inputs
  @Input()
  public fieldAuthConfig: fieldAuth;

  @Input()
  public registrationId: number;

  @Input()
  commitDate: any;

  @Input()
  completionDate: any;

  @Input()
  sgTI: number;

  @Input()
  public isMasked: boolean;
  @Input()
  public isRegRefresh:any;

  // outputs
  @Output()
  emitUpdatedValue = new EventEmitter();

  @Output()
  emitRegistrationDetails = new EventEmitter();

  @Output()
  workTypeEmitter = new EventEmitter();

  

  // local variables
  // tabs to show
  public generalNotes = true;
  public regDetails = false;
  public legalNotes = false;
  public reviewers = false;
  public tags = false;
  public auditLog = false;

  public activeTab = "RegDetails";

  // collapsible sections
  expandReg: boolean = true;
  expandNotes: boolean = true;
  expandReviewers: boolean = true;
  expandTags: boolean = true;
  expandAudits: boolean = true;
  expandConflicts: boolean = true;

  constructor() { }

  ngOnInit() {
    this.toggleSection(this.activeTab);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeTab) {
      let tabValue = "";
      if (changes.activeTab.currentValue.indexOf('#') > 0) {
        tabValue = changes.activeTab.currentValue.split('#')[0];
      }
      else {
        tabValue = changes.activeTab.currentValue;
      }

      this.toggleSection(tabValue);
    }

    if(changes.registrationId){
      this.activeTab = 'RegDetails';
      this.toggleSection(this.activeTab);
    }
  }

  toggleSection(section: string) {
    this.generalNotes = this.auditLog = this.legalNotes = this.regDetails = this.reviewers = this.tags = false;

    switch (section) {
      case 'GeneralNotes': {
        this.generalNotes = true;
        this.activeTab = 'GeneralNotes';
        break;
      }
      case 'RegDetails': {
        this.regDetails = true;
        this.activeTab = 'RegDetails';
        break;
      }
      case 'LegalNotes': {
        this.legalNotes = true;
        this.activeTab = 'LegalNotes';
        break;
      }
      case 'Reviewers': {
        this.reviewers = true;
        this.activeTab = 'Reviewers';
        break;
      }
      case 'Tags': {
        this.tags = true;
        this.activeTab = 'Tags';
        break;
      }
      case 'AuditLog': {
        this.auditLog = true;
        this.activeTab = 'AuditLog';
        break;
      }
    }
  }

  updatedNotes(notes) {
    this.emitUpdatedValue.emit(notes);
  }

  registrationDetailsChanged(registration: any) {
    this.emitRegistrationDetails.emit(registration);
  }

  workTypeChanged(value) {
    this.workTypeEmitter.emit(value);
  }

  
}