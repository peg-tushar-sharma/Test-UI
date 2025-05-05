import {Component} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
    selector: 'app-custom-cell',
    templateUrl: './custom-cell.component.html',
    styleUrls: ['./custom-cell.component.scss']
})

export class CustomCellPipelineComponent implements ICellRendererAngularComp{
    public agParams: any;
    public clientvalue: string;
    public clientname: string;
    public clientpriority: string;

    refresh(params: any): boolean {
        this.setData(params);
        return true;
    }

    agInit(params: ICellRendererParams): void {
        this.setData(params);    
        
    }
    
    setData(params) {
        
        this.agParams = params;
      
        let valueSplit = this.agParams.value && this.agParams.value.split("(");
        
        if(valueSplit && valueSplit.length === 2) {
            this.clientvalue = valueSplit[0]
            // this.clientpriority = valueSplit[1]
            this.clientpriority = this.agParams.data.clientPriority;
        } else if(valueSplit && valueSplit.length === 1) {
            this.clientvalue = valueSplit[0]
            this.clientpriority = ""
        } else {
            this.clientvalue = ""
            this.clientpriority = ""
        }
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
        
    }

    showRedFlag(){
        this.agParams.data.isFlagged = !this.agParams.data.isFlagged;   
        this.setData(this.agParams);
    }

}