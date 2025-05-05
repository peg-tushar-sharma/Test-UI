
import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AgEditorComponent } from 'ag-grid-angular';
import { WorkPhase } from '../../interfaces/workphase';
@Component({
  selector: 'app-work-phase-cell-editor',
  templateUrl: './work-phase-cell-editor.component.html',
  styleUrls: ['./work-phase-cell-editor.component.scss']
})
export class WorkPhaseCellEditorComponent implements AgEditorComponent {
  @ViewChild('workPhaseComp') ela: ElementRef<HTMLElement>;
  params: any;
  workPhase: WorkPhase;
  relatedCaseCode: string = '';
  agInit(params): void {

    this.params = params;
    if (params.data) {
      if (params.data.workPhase && params.data.workPhase != undefined) {
        this.workPhase = JSON.parse(JSON.stringify(params.data.workPhase));
        this.relatedCaseCode = this.workPhase.relatedCaseCode;
      }
      else {
        this.workPhase = { isContinuation: false, isNext: false, isRestartPhase: false, relatedCaseCode: '' };
      }
    }
    setTimeout(() => {
      if (this.ela != undefined) {
        this.ela.nativeElement.focus()
      }
    }, 200);
  }
  getValue(): any {
    if (this.workPhase) {

      this.workPhase.relatedCaseCode = this.relatedCaseCode;
    }
    this.params.data.workPhase = this.workPhase;
    return this.params.data.workPhase;
  }
  isPopup(): boolean {
    return true;
  }
  getPopupPosition(): string {
    return "under";
  }
  toggleEvent(event, field) {
    if (this.workPhase)
      this.workPhase[field] = event.target.checked;
  }

}
