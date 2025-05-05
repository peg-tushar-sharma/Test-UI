import { Component } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { Likelihood } from '../../../pipeline/pipeline';
import { GlobalService } from '../../../global/global.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
    selector: 'app-dealLlikelihood',
    templateUrl: './dealLikelihood.component.html',
    styleUrls: ['./dealLikelihood.component.scss']
})
export class DealLikelihoodEditorComponent implements AgEditorComponent {
    selectedPercent: any=[];
    selectedValue: any;
    params: any;
    statusList: Likelihood[] = [];

    constructor(public globalService: GlobalService) {

    }
    onKeypress(event) {
        if (!(event.charCode >= 48 && event.charCode <= 57)) {
            return event.preventDefault()
        }
    }
    agInit(params): void {
         this.params = params;
        this.globalService.getPipelineStatus().subscribe(res => {
            this.statusList = res;
            if (params.data.likelihoodId>0) {
                this.selectedPercent = params.data.label;
            } else if (typeof params.data.label == 'number' && params.data.label != undefined) {
                this.selectedPercent = params.data.label;
            }
            this.selectedValue=params.data.likelihoodId;
            
        })
    }

    getValue(): any {
        
        this.params.data.likelihoodId =this.selectedPercent.likelihoodId;
        this.params.data.label=this.selectedPercent.label;
        return this.params.data.likelihoodId;


    }

    isPopup(): boolean {
        return true;
    }
    getPopupPosition(): string {
        return "under";
    }
    onStatusChange(element) {
        this.selectedPercent = element;
 
    }
    clearValue(event){
        this.selectedPercent=null;
    }
}