import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { GlobalService } from '../../../global/global.service';
import { NgSelectComponent } from '@ng-select/ng-select';


@Component({
  selector: 'app-ops-likelihood',
  templateUrl: './ops-likelihood.component.html',
  styleUrls: ['./ops-likelihood.component.scss']
})
export class OpsLikelihoodComponent implements ICellEditorAngularComp {

  @ViewChild('opsLikelihoodCom') element:NgSelectComponent
  params: any
  opsLikelihoods: any
  selectedOpsLikelihood;
  isClear: boolean = false;
  constructor(private globalService: GlobalService) { }
  getValue() {
      return this.params.data.opsLikelihood;
  }
  isPopup?(): boolean {
    return true;
  }
  agInit(params: ICellEditorParams): void {
     setTimeout(() => {
      if(this.element!=undefined)
      {
        this.element.searchInput.nativeElement.focus()
      }    
    }, 200);
    this.params = params;
    this.globalService.getOpsLikelihood().subscribe(items => {
      this.opsLikelihoods = items;     
      if (this.params.data.opsLikelihood) {
        this.selectedOpsLikelihood = this.params.data.opsLikelihood;
      }
    });
   
  }
 
  onOpsLikelihoodChange(item: any) {
  
    if (item) {
     this.selectedOpsLikelihood = item;
     this.params.data.opsLikelihood = item;
   }
   else
   {
     this.params.data.opsLikelihood =null
   }
 }

}
