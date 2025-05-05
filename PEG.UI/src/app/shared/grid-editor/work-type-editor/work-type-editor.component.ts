import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from "ag-grid-angular";
import { GlobalService } from '../../../global/global.service';

@Component({
  selector: 'app-work-type-editor',
  templateUrl: './work-type-editor.component.html',
  styleUrls: ['./work-type-editor.component.scss']
})
export class WorkTypeEditorComponent implements ICellEditorAngularComp, AfterViewInit{

  workType:any = [];
  selectedWorkType: any;
  params:any;
  constructor(private globalService: GlobalService) {
    
   }

  ngOnInit(){
    this.globalService.getWorkTypeData()
    .subscribe(workTypes => {
      this.workType = workTypes;
    });
  }



  agInit(params: any): void {
    this.params = params;
    if (this.params.data.workType) {
      this.selectedWorkType = this.params.data.workType;
    }
    if (this.params.data.workType != null) {
      if (this.params.data.workType.workTypeId) {
        this.selectedWorkType = this.params.data.workType.workTypeId;
      }
    }
  }

  isPopup() {
    return true;
  }

  ngAfterViewInit() {
    window.setTimeout(() => {
    })
  }

  getValue(): any {
    return  this.params.workType == undefined ? this.params.data.workType == null ? '' : Object.keys(this.params.data.workType).length === 0 ? '' : this.params.data.workType : this.params.workType;
  }

  onSelectionChange(event) {
    this.params.workType = event;
    if (this.params.api) {
      this.params.api.stopEditing();
    }
  }

  resetWorkType(){
    this.params.workType = '';
    this.params.data.workType = {};
  }
}