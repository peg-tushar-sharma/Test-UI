import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-grid-stages',
  templateUrl: './ag-grid-stages.component.html',
  styleUrls: ['./ag-grid-stages.component.scss']
})
export class AgGridStagesComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;
  value: 'active' | 'archived';

  agInit(params: ICellRendererParams) {
    this.params = params;
    this.value = params.value.toLowerCase();
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
