import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-deal-country-cell-renderer',
  templateUrl: './deal-country-cell-renderer.component.html',
  styleUrls: ['./deal-country-cell-renderer.component.scss']
})
export class DealCountryCellRendererComponent implements ICellRendererAngularComp  {

  constructor() { }
  params:any;
  locationName:string='';
  refresh(params: any): boolean {
    this.params = params;
    if(params.data.locationOfDeal)
    {
      this.locationName=params.data.locationOfDeal.locationName;
    }
   

    return true;
  }
  TrackerID:any;
  
  redirectToDeal() {
   
  }
  agInit(params: any): void {
    
    this.params = params;
    if(params.data.locationOfDeal)
    {
      this.locationName=params.data.locationOfDeal.locationName;
    }
    }
}
