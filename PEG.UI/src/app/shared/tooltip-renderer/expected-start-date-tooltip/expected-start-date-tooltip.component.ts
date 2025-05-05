import { Component, OnInit } from '@angular/core';

import { ITooltipParams } from 'ag-grid-community';
import * as moment from 'moment';

@Component({
  selector: 'app-expected-start-date-toolTip',
  templateUrl: './expected-start-date-toolTip.component.html',
  styleUrls: ['./expected-start-date-toolTip.component.scss']
})
export class ExpectedStartDateToolTipComponent implements OnInit {
  params: any;
  colDefField: string;
  toolTipNote:any;
   constructor() { }
  ngOnInit(): void {
    }


  agInit(params: ITooltipParams): void {

    this.params = params;
    this.fetchNote();
  }
 
  fetchNote()
  {
       this.colDefField = this.params.colDef.field; 
       if (this.params.data.expectedStart.expectedStartDate && this.params.data.expectedStart.expectedStartDate ) {
        const element = moment.utc(this.params.data.expectedStart.expectedStartDate).format('DD-MMM-YYYY');;
        this.toolTipNote = "<div><b>Expected Start Date:</b> <span>" + element + "</span></div><hr>";
      
      }             
    else{
      this.toolTipNote = "<div><b>Expected Start Date:</b></div><hr>";
    }
    
    if(this.params.data.expectedStart.expectedStartDateNote)
      {
      let splittedData = this.params.data.expectedStart.expectedStartDateNote.split("\n");
      for (let index = 0; index < splittedData.length; index++) {
        const element = splittedData[index];
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
