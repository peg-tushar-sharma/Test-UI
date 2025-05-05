import { Component, OnInit } from '@angular/core';
import { AgEditorComponent } from  'ag-grid-angular';

import { element } from 'protractor';
@Component({
  selector: 'app-role-celleditors',
  templateUrl: './role-celleditor.component.html',
  styleUrls: ['./role-celleditor.component.scss']
})
export class RoleEditorComponent implements AgEditorComponent {

  constructor() { }
  params:any;
  presetRole:any;
  roles : any = [
    "General","Legal","Multibidder Manager","PEG Administrator","Practice Area Manager","PEG Leadership"
  ]
  agInit(params: any): void {
      this.params = params;
      this.presetRole =  this.params.name; 
    }
    getValue(): any {
     
      return this.presetRole;
    }
    isPopup(): boolean {
      return true;
    }
    getPopupPosition() : string {
       return "over";
    }
  
    changeValue(event){
      
    }
}


