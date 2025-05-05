import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-expected-leadership',
  templateUrl: './expected-leadership.component.html',
  styleUrls: ['./expected-leadership.component.scss']
})
export class ExpectedLeadershipComponent implements ICellRendererAngularComp{
  public dataArray: any = [];

  refresh(params: any): boolean {
      this.setData(params);
      return true;
  }

  agInit(params: ICellRendererParams): void {
      this.setData(params)
  }

  setData(params) {
    params.value && params.value.forEach(value => {
      let personValue = value[2].map(ele => ele.name).join(";")
      let personObject = {};
      personObject['person'] = personValue;
      personObject['role'] = value[1];
      personObject['qualifier'] = value[3]
      this.dataArray.push(personObject)
    })
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {

  }

}