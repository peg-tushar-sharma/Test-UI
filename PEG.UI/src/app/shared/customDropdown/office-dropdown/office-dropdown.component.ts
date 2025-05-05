import { Component, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-office-dropdown',
  templateUrl: './office-dropdown.component.html',
  styleUrls: ['./office-dropdown.component.scss']
})
export class OfficeDropdownComponent implements ICellEditorAngularComp {

  public value;
  public mCOunt;
  public mDescription;
  
  constructor() { }

  getValue() {
    this.mCOunt = this.mCOunt ? this.mCOunt : '';
    this.mDescription = this.mDescription ? this.mDescription : '';

    return this.mCOunt + " " + this.mDescription
  }

  isPopup() {
    return true
  }

  selectOption(event) {
    if(event.target.dataset.select) {
      this.mDescription = event.target.dataset.select;
    }
  }

  agInit(params): void {
    this.value = params.value
  }

}
