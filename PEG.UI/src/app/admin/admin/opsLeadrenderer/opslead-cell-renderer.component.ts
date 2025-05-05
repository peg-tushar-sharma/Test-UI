import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-opslead-cell-renderer',
  templateUrl: './opslead-cell-renderer.component.html',
  styleUrls: ['./opslead-cell-renderer.component.scss']
})
export class OpsLeadCellRendererComponent implements ICellRendererAngularComp {

  constructor() { }
  params:any;
  checkedValue:boolean = false;
  
  refresh(params: any): boolean {
    
    return true;
  }

  agInit(params: any): void {
    if(params.data.name == "PEG Administrator"){
      this.checkedValue = true;
    }
    else{
      this.checkedValue = false;
    }
   }
   toggleEvent(event){
   }
}
