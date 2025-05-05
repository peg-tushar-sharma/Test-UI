import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-location-cell-renderer',
  templateUrl: './location-cell-renderer.component.html',
  styleUrls: ['./location-cell-renderer.component.scss']
})
export class LocationCellRendererComponent implements ICellRendererAngularComp {

  preferred: any;
  allocated: any;
  conflicted: any;
  constructor() { }
  params: any;

  refresh(params2: any): boolean {
    this.loadData(params2);
    return true;
  }

  agInit(params: any): void {
    if (params.data) {
      this.loadData(params);
    }
  }

  loadData(params) {
    if (params.data.location && params.data?.location?.preferred) {
      let preferredList = [];
      params.data.location.preferred.map((office) => {
        preferredList.push(office.office.officeAbbr);
      });
      this.preferred = preferredList.join(', ');
    }
    if (params.data.location && params.data?.location?.allocated) {
      let allocatedList = [];

      params.data.location.allocated.map((office) => {
        allocatedList.push(office.office.officeAbbr);
      });
      this.allocated = allocatedList.join(', ');
    }
    if (params.data.location && params.data?.location?.conflicted) {
      let conflictedList = [];
      params.data.location.conflicted.map((office) => {
        conflictedList.push(office.office.officeAbbr);
      });
      this.conflicted = conflictedList.join(', ');

    }
  }

}
