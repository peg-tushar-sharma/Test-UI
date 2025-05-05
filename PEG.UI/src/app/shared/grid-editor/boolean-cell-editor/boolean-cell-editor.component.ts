import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-boolean-cell-editor',
  templateUrl: './boolean-cell-editor.component.html',
  styleUrls: ['./boolean-cell-editor.component.scss']
})
export class BooleanCellEditorComponent implements OnInit {
  @ViewChild('BooleanCellEditorComp') ela:NgSelectComponent  
  values:any = [];
  selectedValue: any;
  params:any;
  field:any;
  constructor() {}

  ngOnInit() {   
  }


  agInit(params: any): void {
    if(params?.colDef?.field == 'isOVPHelp' || params?.colDef?.field == 'isSVPHelp'){
      setTimeout(() => {
        if(this.ela!=undefined)
        {
          this.ela.searchInput.nativeElement.focus()
        }    
      }, 200);
    }
    let objVal = [{
      name: 'Yes',
      value: true
    }, {
      name: 'No',
      value: false
    }
    ]
    this.values = objVal;
    this.params = params;
    this.field=params?.colDef?.field;
    switch(this.params?.colDef?.field){
      case 'isOVPHelp':{
        this.selectedValue=this.params?.data?.isOVPHelp;
        return
      }
      case 'isSVPHelp':{
        this.selectedValue=this.params?.data?.isSVPHelp;
        return
      }
    }

    if (this.params.data.publiclyTraded) {
      this.selectedValue = this.values.find(a => a.name ==  this.params.data.publiclyTraded).value;
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
    switch(this.field){
      case 'isOVPHelp':{
        return this.params?.data?.isOVPHelp
        
      }
      case 'isSVPHelp':{
        return this.params?.data?.isSVPHelp
        
      }
    }
    return  this.params.values == undefined ? Object.keys(this.params.data.publiclyTraded).length === 0 ? '' : this.params.data.publiclyTraded : this.params.publiclyTraded;
  }

  onSelectionChange(event) {
    switch(this.field){
      case 'isOVPHelp':{
         this.params.data.isOVPHelp=event.value;
          if (this.params.api) {
            return this.params.api.stopEditing();
          }
        
      }
      case 'isSVPHelp':{
         this.params.data.isSVPHelp=event.value
          if (this.params.api) {
            return this.params.api.stopEditing();
          }
      }
    }

    this.params.values = event;
    this.params.publiclyTraded = event.name;
    this.params.data.publiclyTraded = event.value;
  }

  resetDropDown(){
    this.params.values = '';
    this.params.data.values = {};
  }
  
}
