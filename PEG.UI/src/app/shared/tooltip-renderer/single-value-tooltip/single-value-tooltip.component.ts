import { Component, OnInit } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ColDef, ITooltipParams } from 'ag-grid-community';
@Component({
  selector: 'app-single-value-tooltip',
  templateUrl: './single-value-tooltip.component.html',
  styleUrls: ['./single-value-tooltip.component.scss']
})
export class SingleValueTooltipComponent implements ITooltipAngularComp {

  constructor() { }
  params: any;
  tooltipValue: string = undefined;
  agInit(params: ITooltipParams): void {
    this.params = params;
    if (params.node.field == 'customPriority') {
      let predefinedP = params.data.client[0]?.clientPriorityName ? params.data.client[0]?.clientPriorityName : '';
      let customPriority = params.data.customPriority[0]?.priorityName ? params.data.customPriority[0]?.priorityName : ''
      if (!(predefinedP == "" && customPriority == "")) {
        this.tooltipValue = predefinedP + ' - ' + customPriority;
      }
    }
    if (this.params.colDef.field == 'teamSize') {
      let multipleValues = [];
      let teamsData = this.params.data[this.params.colDef.field];
      teamsData.forEach(r => {
        if (!(r.teamSizeId == 0 || r.teamSizeId == null)) {
          multipleValues.push(r.teamSize);
        }
      });
      this.tooltipValue = multipleValues.join(', ');
    }
    else {
      this.tooltipValue = params.value;
    }
  }
  location: "cell"

}
