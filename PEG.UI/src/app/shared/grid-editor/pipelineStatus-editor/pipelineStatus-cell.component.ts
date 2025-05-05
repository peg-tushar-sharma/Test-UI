import { Component, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { Likelihood } from '../../../pipeline/pipeline';
import { GlobalService } from '../../../global/global.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
    selector: 'app-pipelineStatus-cell',
    templateUrl: './pipelineStatus-cell.component.html',
    styleUrls: ['./pipelineStatus-cell.component.scss']
})
export class PipelineStatusEditorComponent implements AgEditorComponent {
    @ViewChild('pipelineStatusComp') ela:NgSelectComponent
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
        setTimeout(() => {
            this.ela.searchInput.nativeElement.focus()
          }, 200);
        this.params = params;
        this.globalService.getPipelineStatus().subscribe(res => {
            this.statusList = res;
            if (params.data.likelihood && params.data.likelihood.likelihoodId>0) {
                this.selectedPercent = params.data.likelihood;
            } 
            
            
        })
    }


    getValue(): any {
        
        this.params.data.likelihood =this.selectedPercent;
        return this.params.data.likelihood;


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
