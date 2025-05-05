import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

import { GlobalService } from '../../../global/global.service';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Office } from '../../interfaces/office';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-office-cell-editor',
  templateUrl: './office-cell-editor.component.html',
  styleUrls: ['./office-cell-editor.component.scss']
})
export class OfficeCellEditorComponent  implements ICellEditorAngularComp {
  @ViewChild('office') ela:NgSelectComponent

  public offices: Office[];
  params: any;
  selectedOffice;
  dropdownPosition: string = 'auto';
  officeTypeAhead = new Subject<string>();
  officeLoad = false;
  officeToBeStaffed:Office;
  constructor( private globalService: GlobalService) {

    this.officeTypeAhead.pipe(
      tap(() => { this.officeLoad = true}),
      debounceTime(400),
      switchMap(term => this.globalService.GetBainOfficesByName(term)),
      tap(() => this.officeLoad = false)
    ).subscribe(items => {
        this.offices = items;
    });
   
    } 
    agInit(params: ICellEditorParams): void {
      if (params.rowIndex && params.rowIndex > 4)
      {
        this.dropdownPosition = "top";
      }

      this.params = params;
      if(params.data && params.data.officeToBeStaffed)
      {
        this.selectedOffice = params.data.officeToBeStaffed.officeName;  
      }
     
      this.officeToBeStaffed= params.data.officeToBeStaffed;
      setTimeout(() => {
        if(this.ela!=undefined)
        {
          this.ela.searchInput.nativeElement.focus()
        }
       
      }, 100);
    }

    ngOnChanges(changes: SimpleChanges) {
      
        if (changes?.officeToBeStaffed?.currentValue) {
          this.selectedOffice = changes?.officeToBeStaffed?.currentValue;
        }
     
    }
  getValue() {
    if(this.selectedOffice)
    {
      this.params.data.officeToBeStaffed= this.officeToBeStaffed;
    }
    else{
      this.officeToBeStaffed = {
        officeCode:null,
        officeName:null,
        officeAbbr:null,
        officeCluster:null,
        officeClusterCode:null,
       
      }
      this.params.data.officeToBeStaffed=this.officeToBeStaffed;
    }
  
    return  this.params.data.officeToBeStaffed;
  }
  isPopup?(): boolean {
    return true;
  } 

  onOfficeChange(event)
  {
    this.officeToBeStaffed=event;

  }

}
