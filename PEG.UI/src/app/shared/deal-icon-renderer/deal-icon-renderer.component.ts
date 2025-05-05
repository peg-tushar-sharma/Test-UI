import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { opportunityType } from '../enums/opportunityType.enum';

@Component({
  selector: 'deal-icon-renderer',
  templateUrl: './deal-icon-renderer.component.html',
  styleUrls: ['./deal-icon-renderer.component.scss']
})
export class DealIconRendererComponent implements ICellRendererAngularComp {

  constructor() { }
  public params: any;
  public isLocked: boolean = false;

  refresh(params: any): boolean {
   return true
  }

  agInit(params: any): void {
   if(params.data.sessionId){
     this.isLocked = true;
   }
  }
  
}
