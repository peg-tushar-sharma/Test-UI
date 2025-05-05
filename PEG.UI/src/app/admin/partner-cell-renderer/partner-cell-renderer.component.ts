import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { CommonMethods } from './../../shared/common/common-methods';

@Component({
  selector: 'app-partner-cell-renderer',
  templateUrl: './partner-cell-renderer.component.html',
  styleUrls: ['./partner-cell-renderer.component.scss']
})
export class adminNameCellRendererComponent implements ICellRendererAngularComp {
  UserImagePath="";
  title:string;
  name:string;
  office:string;
  pic:string;
  constructor() { }
  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }
  params:any;
  stringNames:any;
  // refresh(params: any): boolean {
  //   this.loadData(params);
  //   return true;
  // }

  agInit(params: any): void {
    this.params = params;
    this.loadData(params)
    this.title=params.data.securityUser.title.split(",")[0];
    this.name= CommonMethods.getEmployeeNameWithoutAbbr(this.params.data.securityUser) ;
    this.office=this.params.data.securityUser.officeAbbreviation;
    this.UserImagePath="https://employeephotos.bain.com/photos/"+this.params.data.securityUser.employeeCode+".jpg"
   }
   loadData(params){


   }
}
