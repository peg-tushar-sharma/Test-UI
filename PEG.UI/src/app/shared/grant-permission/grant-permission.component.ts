import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-grant-permission',
  templateUrl: './grant-permission.component.html',
  styleUrls: ['./grant-permission.component.scss']
})
export class GrantPermissionComponent implements ICellRendererAngularComp {

  constructor() { }


  agInit(params: any): void {
  }
  refresh(params: any): boolean {
    
    return true;
  }
}
