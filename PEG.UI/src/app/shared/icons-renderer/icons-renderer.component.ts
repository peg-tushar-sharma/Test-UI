import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { opportunityType } from '../enums/opportunityType.enum';

@Component({
  selector: 'app-icons-renderer',
  templateUrl: './icons-renderer.component.html',
  styleUrls: ['./icons-renderer.component.scss']
})
export class IconsRendererComponent implements ICellRendererAngularComp {

  constructor() { }
  public dealId;
  public params: any;
  public hasDeal: boolean;
  public hasRegistration: boolean = false;
  public trackerId: boolean = false;
  public registrationID: string;
  public isDeleteTracker: boolean = false;
  refresh(params: any): boolean {
    this.params = params;

    if ((params.colDef.field == 'hasDeal' && params.data.hasDeal) || params.data.opportunityType == opportunityType.Tracker) {
      this.dealId = this.params.data.dealId;
      this.hasDeal = true;
    }
    else if (params.data.opportunityType == opportunityType.Registration) {
      this.hasRegistration = true;
    }
    if (params.data.hasRegistration && params.colDef.field == 'hasRegistrationIcon') {
      this.hasRegistration = true;
      if (params.data.id) {
        this.registrationID = params.data.id;
      }
    }

    if (params.colDef.field == "deleteTracker") {
      this.isDeleteTracker = true;
    }
    if( params.colDef.field == 'dealId'){
      this.trackerId=true;
      this.dealId = this.params.data.dealId;

    }
    return true;
  }
  redirectToDeal() {
    
      if (this.params.data && this.params.data.dealId)
        window.open("../deals/deal/" + this.params.data.dealId, "_blank")
    
  }
  agInit(params: any): void {
    this.params = params;
    if ((params.colDef.field == 'hasDeal' && params.data.hasDeal) || params.data.opportunityType == opportunityType.Tracker) {
      this.dealId = this.params.data.dealId;
      this.hasDeal = true;
    }
    else if (params.data.opportunityType == opportunityType.Registration) {
      this.hasRegistration = true;
    }
    if (params.data.hasRegistration && params.colDef.field == 'hasRegistration') {
      this.hasRegistration = true;
      if (params.data.id) {
        this.registrationID = params.data.id;
      }
      if (params.data.registrationId) {
        this.registrationID = params.data.registrationId;
      }
    }

    if (params.colDef.field == 'link') {
      this.hasRegistration = true;
      this.registrationID = params.data.registrationId;
    }

    if (params.colDef.field == "deleteTracker") {
      this.isDeleteTracker = true;
    }
    if (params.colDef.field == 'dealId') {
      this.trackerId = true;
      this.dealId = this.params.data.dealId;

    }

  }
  show: boolean = false;
  showID() {
    this.show = !this.show;

  }
}
