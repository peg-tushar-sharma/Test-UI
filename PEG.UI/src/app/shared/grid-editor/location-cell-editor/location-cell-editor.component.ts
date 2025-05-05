import { Component, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { Office } from '../../interfaces/office';
import * as _ from 'lodash';
import { PipelineLocation } from '../../interfaces/pipelineLocation';
import { GlobalService } from '../../../../../src/app/global/global.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Region } from '../../enums/region';
@Component({
  selector: 'app-location-cell-editor',
  templateUrl: './location-cell-editor.component.html',
  styleUrls: ['./location-cell-editor.component.scss']
})
export class LocationCellEditorComponent implements AgEditorComponent {
  @ViewChild('preferedOffice') ela: NgSelectComponent

  constructor(private globalService: GlobalService) {

  }

  params: any;
  preferred: any = [];
  conflicted: any = [];
  allocated: any = [];
  public bainOffices: Office[];
  agInit(params): void {
    this.globalService.getOffice().subscribe(office => {
      this.bainOffices = office.filter(x=>x.regionId!=Region.Global);
    });
    this.params = params;
    if (this.params.data.location && this.params.data.location.preferred) {
      this.preferred = this.params.data.location.preferred.map((location) => {
        return location.office.officeCode;
      });
    }
    if (this.params.data.location && this.params.data.location.allocated) {
      this.allocated = this.params.data.location.allocated.map((location) => {
        return location.office.officeCode;
      });
    }
    if (this.params.data.location && this.params.data.location.conflicted) {
      this.conflicted = this.params.data.location.conflicted.map((location) => {
        return location.office.officeCode;
      });
    }

    setTimeout(() => {
      if (this.ela != undefined) {
          this.ela.searchInput.nativeElement.focus()
      }

  }, 100);
  }

  getValue(): any {
    let preferredList = [];
    this.preferred.map((office) => {
      if (this.params.data?.location?.preferred) {
        this.bainOffices.filter(x => x.officeCode == office).forEach((eachLocation) => {
          let newLocation: PipelineLocation = {
            locationType: 1,
            office: eachLocation,
            pipelineLocationId: 0,
            pipelineId: this.params.data.pipelineId
          }
          preferredList.push(_.omit(newLocation, ['pipelineLocationId']));
        });
      }

    })
    let conflictedList = [];
    this.conflicted.map((office) => {
      if (this.params.data?.location?.conflicted) {
        this.bainOffices.filter(x => x.officeCode == office).forEach((eachLocation) => {
          let newLocation: PipelineLocation = {
            locationType: 2,
            office: eachLocation,
            pipelineLocationId: 0,
            pipelineId: this.params.data.pipelineId
          }
          conflictedList.push(_.omit(newLocation, ['pipelineLocationId']));
        });
      }
    })
    let allocatedList = [];
    this.allocated.map((office) => {
      if (this.params.data?.location?.allocated) {
        this.bainOffices.filter(x => x.officeCode == office).forEach((eachLocation) => {
          let newLocation: PipelineLocation = {
            locationType: 3,
            office: eachLocation,
            pipelineLocationId: 0,
            pipelineId: this.params.data.pipelineId
          }
          allocatedList.push(_.omit(newLocation, ['pipelineLocationId']));
        });
      }
    })
    this.params.data.location = this.params.data.location || {}
    this.params.data.location["preferred"] = preferredList;
    this.params.data.location["conflicted"] = conflictedList;
    this.params.data.location["allocated"] = allocatedList;

    return this.params.data.location;
  }

  isPopup(): boolean {
    return true;
  }

  getPopupPosition(): string {
    return "under";
  }

  callEvent(event, condition) {
    if (condition == "preferred") {
      this.preferred.push(event.name)
    }
    if (condition == "allocated") {
      this.allocated.push(event.name)
    }
    if (condition == "conflicted") {
      this.conflicted.push(event.name)
    }

  }


}
