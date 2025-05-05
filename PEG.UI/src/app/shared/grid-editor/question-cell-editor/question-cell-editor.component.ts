import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CommonMethods } from '../../common/common-methods';
@Component({
  selector: 'app-question-cell-editor',
  templateUrl: './question-cell-editor.component.html',
  styleUrls: ['./question-cell-editor.component.scss']
})
export class QuestionCellEditorComponent implements OnInit {

  @ViewChild('QuestionCellEditorComp') ela:NgSelectComponent

 answers:any=CommonMethods.getAnswerObject();
 selectedAnswer:any;
 isClearable: boolean = false;
 params: any;
 field:any;
 constructor() { }

  agInit(params: any): void {
    setTimeout(() => {
      if(this.ela!=undefined)
      {
        this.ela.searchInput.nativeElement.focus()
      }    
    }, 200);
    this.params=params;
    this.field=params?.colDef?.field;
    switch(this.field){
      case 'isRetainer':{
        this.selectedAnswer=params?.data?.isRetainer ?? '';
        break;
      }
      case 'isMBPartner':{
        this.selectedAnswer=params?.data?.isMBPartner ?? '';
        break;
      }
    }
  }
  ngOnInit(): void {
    
  }
  onSelectionChange(event){
    
    switch (this.field){
      case 'isRetainer':{
        this.params.data.isRetainer=event.value;
      }
      case 'isMBPartner':{
        this.params.data.isMBPartner=event.value;
      }

    }
   if (this.params.api) {
    this.params.api.stopEditing();
  }
  }
  isPopup() {
    return true;
  }
  getValue(): any {

    switch (this.field){
      case 'isRetainer':{
        return this.params.data?.isRetainer;
      }
      case 'isMBPartner':{
        return this.params.data?.isMBPartner;
      }

    }
  }

}
