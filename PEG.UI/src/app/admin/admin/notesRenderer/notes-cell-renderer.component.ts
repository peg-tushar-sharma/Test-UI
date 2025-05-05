import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-notes-cell-renderer',
  templateUrl: './notes-cell-renderer.component.html',
  styleUrls: ['./notes-cell-renderer.component.scss']
})
export class NotesCellRendererComponent implements ICellRendererAngularComp {

  constructor() { }
  params:any;
  stringNames:any;
  refresh(params: any): boolean {
    
    return true;
  }

  agInit(params: any): void {
    this.params = params;
    
   }
  
}
