import {Component} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
    selector: 'app-custom-cell',
    templateUrl: './custom-cell.component.html',
    styleUrls: ['./custom-cell.component.scss']
})

export class CustomCellComponent implements ICellRendererAngularComp{
    public agParams: any;
    public clientvalue: string;
    public clientname: string;
    public clientpriority: string;
    public pipelineId: number;

    refresh(params: any): boolean {
        this.setData(params);
        return true;
    }

    agInit(params: ICellRendererParams): void {
        this.setData(params);
    }
    
    setData(params) {
        this.agParams = params;
        this.agParams.selectedFlag = this.agParams.data.isFlagged;
        this.clientvalue = this.agParams.data.clientName;
        this.clientpriority = this.agParams.data.clientPriority == undefined ? '' : this.agParams.data.clientPriority;
        this.pipelineId = this.agParams.data.pipelineId;
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
        
    }

    showRedFlag(){
        this.agParams.selectedFlag = !this.agParams.selectedFlag;
        this.agParams.data.isFlagged = this.agParams.selectedFlag;
        this.agParams.context.componentParent.methodFromCustomCell(
            this.agParams.data
          );
    }

}