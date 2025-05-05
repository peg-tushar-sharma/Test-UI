import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { WorkPhase } from '../../interfaces/workphase';

@Component({
  selector: 'app-work-phase-cell-renderer',
  templateUrl: './work-phase-cell-renderer.component.html',
  styleUrls: ['./work-phase-cell-renderer.component.scss']
})
export class WorkPhaseCellRendererComponent implements ICellRendererAngularComp  {

  constructor() { }
  params:any;
  workPhase:WorkPhase;
  workPhases:string[]=[];
  workPhaseValue
  gridApi:any;
  
  refresh(params: any): boolean {
    this.loadvalues(params);
    return true;
  }
 
  agInit(params: any): void {
      this.params = params;
      this.gridApi= params.api;
      if(this.params.data){
        this.loadvalues(params);
      }
    }
    
    loadvalues(params){
      this.workPhases=[];
      if(params.data.workPhase && params.data.workPhase!=null)
          {    
            
            this.workPhase= params.data.workPhase;  
            if(this.workPhase.isContinuation)
                {
                  this.workPhases.push('Continuation Phase');
                }
            if(this.workPhase.isNext)
                {
                  this.workPhases.push('Next phase');
                }
            if(this.workPhase.isRestartPhase)
                {
                  this.workPhases.push('Restart Phase');
                }
            if(this.workPhase.relatedCaseCode)
                {
                  this.workPhases.push(this.workPhase.relatedCaseCode);
                }
              this.workPhaseValue=this.workPhases.join(', ');
              
          }
    }

}
