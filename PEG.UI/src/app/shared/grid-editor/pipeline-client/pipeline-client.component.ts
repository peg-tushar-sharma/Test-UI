import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'child-cell',
  templateUrl: './pipeline-client.component.html',
  styles: [
    `
      .flag-icon {
        color: #cc0101;
      }
    `,
  ],
})
export class PipelineClientRenderer implements ICellRendererAngularComp {
  public params: any;
  public clients: any[]=[];
  
  

  agInit(params: any): void {      
    this.params = params;
   
    if(params.data.client && params.data.client.length>0)
    {
      params.data.client.map((eachClient)=>{
        this.clients.push({clientName:eachClient.clientName,clientPriority:eachClient.clientPriorityName});         

      });     

    }
    
  }

    

  refresh(): boolean {
    return false;
  }
}