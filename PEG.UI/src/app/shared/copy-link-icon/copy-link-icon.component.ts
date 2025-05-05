import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-copy-link-icon',
  templateUrl: './copy-link-icon.component.html',
  styleUrls: ['./copy-link-icon.component.scss']
})
export class CopyLinkIconComponent implements ICellRendererAngularComp {

  constructor() { }

  agInit(params: any): void {
  }
  refresh(params: any): boolean {
    
    return true;
  }
}
