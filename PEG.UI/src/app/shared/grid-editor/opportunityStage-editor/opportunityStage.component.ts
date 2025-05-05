import { Component, ElementRef, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { OpportunityStage } from '../../../pipeline/pipeline';
import { GlobalService } from '../../../global/global.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Opportunity_Stage } from '../../enums/opportunity-stage';

@Component({
    selector: 'app-opportunityStage',
    templateUrl: './opportunityStage.component.html',
    styleUrls: ['./opportunityStage.component.scss']
})
export class OpportunityStageEditorComponent implements AgEditorComponent {
    @ViewChild('oppStage') ela: NgSelectComponent;

    selectedOpportunityStage: any=[];
    selectedValue: any=[];
    params: any;
    opportunityStage: OpportunityStage[] = [];
    bsModalRef: BsModalRef;

    constructor(public globalService: GlobalService,private modalService: BsModalService) {

    }
    onKeypress(event) {
        if (!(event.charCode >= 48 && event.charCode <= 57)) {
            return event.preventDefault()
        }
    }
    agInit(params): void {
        this.params = params;
        this.globalService.getOpportunityStage().subscribe((res: OpportunityStage[])=> {
            if(res){
                res.forEach((oppStage)=>{
                    if(oppStage.opportunityStageId==Opportunity_Stage.Mobilizing){
                        oppStage.disabled=true;
                    }
                })
            }

            this.opportunityStage = res;

            if (params.data.opportunityStage.opportunityStageId>0) {
                this.selectedOpportunityStage = params.data.opportunityStage;}
            
        })
        this.selectedValue=this.selectedOpportunityStage;
        setTimeout(() => {
            if (this.ela != undefined) {
                this.ela.searchInput.nativeElement.focus()
            }

        }, 100);
    }

    getValue(): any {
        this.params.data.opportunityStage=this.selectedOpportunityStage;
        return this.params.data.opportunityStage.opportunityStageId;
        

    }

    isPopup(): boolean {
        return true;
    }
    getPopupPosition(): string {
        return "under";
    }

    onStatusChange(element) {  
        this.selectedOpportunityStage = element; 
    }
    clearValue(event){
        this.selectedOpportunityStage=null;
    }
}
