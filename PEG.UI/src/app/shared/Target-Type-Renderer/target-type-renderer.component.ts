import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { TargetType } from '../interfaces/targetType';

@Component({
  selector: 'app-target-type-renderer',
  templateUrl: './target-type-renderer.component.html',
  styleUrls: ['./target-type-renderer.component.scss']
})
export class TargetTypeRendererComponent implements ICellRendererAngularComp {

  constructor() { }
  params:any;
  targetType:TargetType;
  refresh(params: any): boolean {
    this.params = params;

   

    return true;
  } 
  
  redirectToDeal() {
   
  }
  agInit(params: any): void {
    
    this.params = params;
        if(params.data.targetType)
        {
          this.targetType=params.data.targetType;      
        }
    }
  
}
