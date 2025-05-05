import { Component, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AgEditorComponent, ICellEditorAngularComp } from 'ag-grid-angular';
import { GlobalService } from '../../../global/global.service';
import { industry } from '../../interfaces/industry';
@Component({
    selector: 'app-industry-dropdown',
    templateUrl: './industry-dropdown.component.html',
    styleUrls: ['./industry-dropdown.component.scss']
})
export class IndustryDropdownComponent implements AgEditorComponent {
    @ViewChild('industriesComp') ela:NgSelectComponent
    industries: industry[] = [];
    industryLoad: boolean = false;
    selectedIndustries = [];
    params: any
  isClearOnIndustry: boolean = true;
    constructor(private _globalService: GlobalService) {


    }
    agInit(params: any): void {
        setTimeout(() => {
            this.ela.searchInput.nativeElement.focus()
          }, 200);
      
        this.params = params;
        
        if (this.params.data) {
            this.isClearOnIndustry = this.params.data.oppType == 'R' ? false : true;
        }
        this._globalService.getIndustrySectors().subscribe(items => {
            this.industries = items.filter(x => x.isTopIndustry == true);
            if (this.params.data.industries && this.params.data.industries.length > 0) {
                let industries = this.params.data.industries[0];
                this.selectedIndustries = industries;
            }
        });

    }

    isPopup() {
        return true;
    }

    getValue(): any {
        return this.params.data.industries;
    }

    onIndustryChange(event) {
        if (event) {


            this.params.data.industries = [event];
            if (this.params.data.industries && this.params.data.industries.length > 0) {
                let industries = this.params.data.industries[0];
                this.selectedIndustries = industries;
            }
        }else{
            this.params.data.industries=[];
        }
    }

}
