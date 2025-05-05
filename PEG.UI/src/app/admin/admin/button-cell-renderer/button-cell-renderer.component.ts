import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-button-cell-renderer',
  templateUrl: './button-cell-renderer.component.html',
  styleUrls: ['./button-cell-renderer.component.scss']
})
export class BtnCellRendererComponent implements ICellRendererAngularComp {

  constructor() { }
  params:any;
  stringNames:any;
  gridApi: GridApi;
  rowData = [];
  refresh(params: any): boolean {
    
    return true;
  }

  agInit(params: any): void {
    this.params=params;
    this.rowData.push(this.params.data);
    
   }
   toggleEvent(){
   
  }
}
