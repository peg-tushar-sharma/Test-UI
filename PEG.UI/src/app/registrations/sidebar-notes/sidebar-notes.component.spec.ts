import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNotesComponent } from './sidebar-notes.component';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { fieldAuth } from '../../shared/common/fieldAuth';

describe('SidebarNotesComponent', () => {
  let component: SidebarNotesComponent;
  let fixture: ComponentFixture<SidebarNotesComponent>;
  let fieldAuthConfig =new fieldAuth();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarNotesComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    component.toggleSection('GeneralNotes');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.generalNotes).toBeTruthy();
  });

  it('should show registration details', () => {
    component.ngOnChanges({ activeTab: new SimpleChange(null, 'RegDetails', true) });
    fixture.detectChanges();
    expect(component.regDetails).toBeTruthy();
  });

  it('should show legalNotes', () => {
    component.ngOnChanges({ activeTab: new SimpleChange(null, 'LegalNotes', true) });
    fixture.detectChanges();
    expect(component.legalNotes).toBeTruthy();
  });

  it('should show reviewers', () => {
    component.ngOnChanges({ activeTab: new SimpleChange(null, 'Reviewers', true) });
    fixture.detectChanges();
    expect(component.reviewers).toBeTruthy();
  });

  it('should show tags', () => {
    component.ngOnChanges({ activeTab: new SimpleChange(null, 'Tags', true) });
    fixture.detectChanges();
    expect(component.tags).toBeTruthy();
  });

  it('should show auditLog', () => {
    component.ngOnChanges({ activeTab: new SimpleChange(null, 'AuditLog', true) });
    fixture.detectChanges();
    expect(component.auditLog).toBeTruthy();
  });
});
