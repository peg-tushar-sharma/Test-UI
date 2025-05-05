import { Component, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';

import { GlobalService } from '../../../global/global.service';
import { AdditionalServices } from '../../interfaces/additionalServices';
import * as _ from 'lodash';
import { NgSelectComponent } from '@ng-select/ng-select';
@Component({
  selector: 'app-additionalServices-editor',
  templateUrl: './additionalServices-editor.component.html',
  styleUrls: ['./additionalServices-editor.component.scss']
})
export class AdditionalServicesEditorComponent implements AgEditorComponent {
  @ViewChild('additionalServicesComp') ela:NgSelectComponent
  services: AdditionalServices[] = [];
  params: any;
  additionalServices: any[] = [];
  constructor(private _globalService: GlobalService) {

  }


  agInit(params): void {
    setTimeout(() => {
      if(this.ela!=undefined)
      {
        this.ela.searchInput.nativeElement.focus()
      }    
    }, 200);
    this.params = params;
    this.services = params.data.additionalServices;
    this._globalService.getAdditionalServices().subscribe(r => {
      this.additionalServices = r;
    })

    if (this.params.data && this.params.data.additionalServices) {
      this.services = this.params.data.additionalServices.map((additionalServices) => {
        return additionalServices.additionalServicesId;
      });
    }


  }
  getValue(): any {
    let filteredData = []
    this.services.map((additionalServices) => {
      if (this.params.data.additionalServices)

        this.additionalServices.filter(x => x.additionalServicesId == additionalServices).forEach((serviceDetail) => {

          let newTeam: AdditionalServices = {
            additionalServicesId: serviceDetail.additionalServicesId,
            additionalServicesName: serviceDetail.additionalServicesName

          }

          filteredData.push(newTeam);

        });

    })

    this.params.data.additionalServices = filteredData;
    return this.params.data.additionalServices;
  }

  isPopup(): boolean {
    return true;
  }

  getPopupPosition(): string {
    return "under";
  }

}
