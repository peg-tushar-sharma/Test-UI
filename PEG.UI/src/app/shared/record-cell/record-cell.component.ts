import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-record-cell',
  templateUrl: './record-cell.component.html',
  styleUrls: ['./record-cell.component.scss']
})
export class RecordCellComponent implements ICellEditorAngularComp {

  public value=undefined;
  public params;
  public iconValue=undefined;
  public oppType = undefined;
  constructor() { }

  getValue() {
    return this.value;
  }

  isPopup() {
    return true;
  }

  agInit(params): void {
    this.params = params;
    if (params.data) {
      this.oppType = params.data.oppType;
      this.value = params.data.registrationId 
      this.iconValue = params.data.opportunityTypeId  == 1 ? "R" : "O";
    }
  }

}
