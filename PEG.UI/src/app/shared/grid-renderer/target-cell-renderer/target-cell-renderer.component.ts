import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-target-cell-renderer',
  templateUrl: './target-cell-renderer.component.html',
  styleUrls: ['./target-cell-renderer.component.scss']
})
export class TargetCellRendererComponent implements OnInit {

  public agParams: any;
  public targetName;
  public isMasked :boolean = false;  
  constructor(){

  }

  ngOnInit(){

  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.agParams = params;
    this.targetName = this.agParams.data.tdn;
    this.isMasked = this.agParams.data.isMasked;
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    return true;
  }
 

}
