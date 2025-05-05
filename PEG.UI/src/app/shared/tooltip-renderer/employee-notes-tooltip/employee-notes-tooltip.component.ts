import { CommonMethods } from '../../common/common-methods';
import { Component, OnInit } from '@angular/core';
import { ITooltipParams } from 'ag-grid-community';

@Component({
  selector: 'app-employee-notes-tooltip',
  templateUrl: './employee-notes-tooltip.component.html',
  styleUrls: ['./employee-notes-tooltip.component.scss']
})
export class EmployeeNotesToolTipComponent implements OnInit {

  constructor() { }
  params: any;
  colDefField: string;
  toolTipNote:any;
  ngOnInit(): void {
  }
  agInit(params: ITooltipParams): void {

    this.params = params;
    this.fetchNote();
  }
  fetchNote()
  {
       this.colDefField = this.params.colDef.field; 
       if (this.params.data && 
          this.params.data[this.colDefField]
        && this.params.data[this.colDefField]?.partners.length>0 ) {
        const element = CommonMethods.getEmployeeNameList(this.params.data[this.colDefField]?.partners);
        this.toolTipNote = "<div><b>"+this.params.colDef.headerName+":</b> <span>" + element + "</span></div><hr>";
      
      }             
    else{
      this.toolTipNote = "<div><b>"+this.params.colDef.headerName+":</b></div><hr>";
    }
    
    if(this.params.data &&
      this.params.data[this.colDefField] &&
      this.params.data[this.colDefField]?.comments)
      {
      let splitData = this.params.data[this.colDefField]?.comments.split("\n");
      for (let index = 0; index < splitData.length; index++) {
        const element = splitData[index];
        if (index == 0) {
          this.toolTipNote += "<div><b>Notes:</b> <span>" + element + "</span></div>";
        } else {
          this.toolTipNote += "<div>" + element + "</div>";
        }
      }
      }
    else{
      this.toolTipNote += "<div><b>Notes:</b> </div>";
    }

  }

}
