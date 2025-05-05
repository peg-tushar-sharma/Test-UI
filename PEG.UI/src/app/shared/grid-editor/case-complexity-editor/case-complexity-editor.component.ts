import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import {  AgEditorComponent, ICellEditorAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalService } from '../../../global/global.service';
import { CaseComplexity } from '../../interfaces/caseComplexity';

@Component({
  selector: 'app-case-complexity-editor',
  templateUrl: './case-complexity-editor.component.html',
  styleUrls: ['./case-complexity-editor.component.scss']
})
export class CaseComplexityEditorComponent implements AgEditorComponent {
  @ViewChild('caseComplexityComp') ela:NgSelectComponent
  case: CaseComplexity[] = [];
  params: any;
  caseComplexity: any[] = [];
  selectedCaseComplexity = [];
  constructor(private _globalService: GlobalService) {

   }
  
  isPopup() {
    return true;
}

  agInit(params: any): void {
    setTimeout(() => {
      if(this.ela!=undefined)
      {
        this.ela.searchInput.nativeElement.focus()
      }    
    }, 200);
    this.params = params;
    this.selectedCaseComplexity = params.data.caseComplexity;
    this._globalService.getCaseComplexity().subscribe(r => {
      this.caseComplexity = r;
  });
}

getValue() {
  let filteredData = []
  this.selectedCaseComplexity.forEach(r => {
    if (!((r.caseComplexityId == 0 || r.caseComplexityId == null))) {
      filteredData.push(r);
    }
  });
  this.params.data.caseComplexity = filteredData
  return this.params.data.caseComplexity;
 }
}
