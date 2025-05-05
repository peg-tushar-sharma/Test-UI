import { Component, ElementRef, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { ClientType } from '../../interfaces/clienttype';
@Component({
    selector: 'app-client-type-editor',
    templateUrl: './client-type-editor.component.html',
    styleUrls: ['./client-type-editor.component.scss']
})
export class ClientTypeEditorComponent implements AgEditorComponent {
    @ViewChild('clientTypes') ela: ElementRef<HTMLElement>;

    params: any = [];
    clientTypeObj: ClientType;
    agInit(params): void {
        this.params = params
        if (params.data.clientType) {
            this.clientTypeObj = params.data.clientType
        }else{
            this.clientTypeObj={isCorporate:false,isGrowthEquity:false,isHedgeFundClient:false,isInfra:false,isPrivateEquity:false,isSpecialPurposeAcquisitionCompany:false} 
        }
        setTimeout(() => {
            if(this.ela!=undefined)
            {
              this.ela.nativeElement.focus()
            }
           
          }, 100);
    }

    getValue(): any {
        this.params.data.clientType = this.clientTypeObj;
        return this.clientTypeObj;
    }
    isPopup(): boolean {
        return true;
    }
    getPopupPosition(): string {
        return "under";
    }
    onCheckboxChange($event,obj) {
        this.clientTypeObj[obj]=$event.target.checked;
    }

}