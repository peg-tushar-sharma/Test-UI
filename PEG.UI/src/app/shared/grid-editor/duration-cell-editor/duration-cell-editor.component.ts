import { Component, OnInit } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { CommonMethods } from '../../common/common-methods';

@Component({
  selector: 'app-duration-cell-editor',
  templateUrl: './duration-cell-editor.component.html',
  styleUrls: ['./duration-cell-editor.component.scss']
})
export class DurationCellEditorComponent implements AgEditorComponent {

  constructor() { }
  durationInfo;
  range:string;
  noOfWeek:string;
  hideRange:boolean=false;
  hideWeeks:boolean=false;
  params:any;
  
  agInit(params): void{
    this.params=params;
   this.durationInfo=params?.data?.duration;
    
    // if(params.value != undefined){
    //   if(params.data.duration && params.data.duration.noOfWeek){
    //     this.noOfWeek = params.data.duration.noOfWeek;
    //     if(this.noOfWeek != ""){
    //       this.hideRange =true;
    //      }
    //   }
    //   if(params.data.duration && params.data.duration.range){
    //     this.range = params.data.duration.range;
    //     if(this.range != ""){
    //       this.hideWeeks =true;
    //       }
    //   }
    //   if(params.data.duration && params.data.duration.durationInfo){
    //     this.durationInfo = params.data.duration.durationInfo;
    //   }
    //}
  }
  getValue(): any { 
    return this.durationInfo;
  }
  isPopup(): boolean {
        return false;
  }
  getPopupPosition() : string {
         return "under";
  } 
  viewEdit(event){
    console.log(event);
    if(event == "range"){
      if(this.range != ""){
      this.hideWeeks =true;
      }
      else{
        this.hideWeeks =false;
       }  
    }
    if(event == "weeks"){
     if(this.noOfWeek != ""){
      this.hideRange =true;
     }
     else{
      this.hideRange =false;
     }         
    }
  }

  validateKeysForDuration(event){               
      CommonMethods.ValidateKeysForDuration(event);
  }
}
