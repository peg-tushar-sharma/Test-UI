import {Component} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { $ } from 'protractor';

@Component({
    selector: 'app-custom-cell-teamsize',
    templateUrl: './custom-cell-teamsize.component.html',
    styleUrls: ['./custom-cell-teamsize.component.scss']
})

export class CustomCellTeamsizeComponent implements ICellRendererAngularComp{
    public agParams: any;
    
    refresh(params: any): boolean {
        this.setData(params);
        return true;
    }
    
    agInit(params: ICellRendererParams): void {
        this.setData(params)
    }

    setData(params) {
        this.agParams = params.value;
    }
    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
        
    }

}