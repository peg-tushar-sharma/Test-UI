import { Component, OnInit } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';
import { CommonMethods } from '../../common/common-methods';

@Component({
  selector: 'app-multi-value-tooltip',
  templateUrl: './multi-value-tooltip.component.html',
  styleUrls: ['./multi-value-tooltip.component.scss']
})
export class MultiValueTooltipComponent implements ITooltipAngularComp {

  multipleValues: any = [];
  params: any;
  colDefField: string;
  agInit(params: ITooltipParams): void {

    this.params = params;
    this.loadValues();
  }
  loadValues() {
    this.colDefField = this.params.colDef.field; 
    if (this.params.value ) {
      this.multipleValues = this.params.data[this.params.colDef.field];
      this.multipleValues.forEach((value) => {
        value.searchableName = '';
        if (value && value.employeeCode && value.employeeCode != "") {
          value.searchableName = CommonMethods.getEmployeeName(value);
        }
        if(value && value.caseComplexityId && value.caseComplexityId != "")
        {
          value.searchableName=value.caseComplexityName;
        }
      });
    }
   }
  location: "under"

}
