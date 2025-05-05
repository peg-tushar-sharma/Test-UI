import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CustomTagsComponent } from '../custom-tags/custom-tags.component';

@Component({
  selector: 'app-tags-renderer',
  templateUrl: './tags-renderer.component.html',
  styleUrls: ['./tags-renderer.component.scss']
})
export class TagsRendererComponent implements ICellRendererAngularComp {

  constructor() { }

  public params: any;

  
  public ispubliclyTradedEquity:boolean = false;
  public ispubliclyTradedDebt:boolean = false;
  public workToStart:number;
  public typeOfWork:number;
  public openMarketPurchase:boolean;
  public isMultibidder: boolean;
  public isSingleBidder: boolean;
  public isSeller: boolean;
  public showFullTagName: boolean = false;

  agInit(params: any): void {
      this.params = params;
      this.ispubliclyTradedEquity =  params.data.pte;
      this.ispubliclyTradedDebt =  params.data.ptd;
      this.workToStart = params.data.wts;
      this.typeOfWork = params.data.wti;
      this.isMultibidder = params.data.imb;
      this.isSingleBidder = params.data.isb;
      this.isSeller = params.data.isSeller;
      this.openMarketPurchase = params.data.iomp;

  }


  refresh(params): boolean {
      this.params = params;
      this.ispubliclyTradedEquity =  params.data.pte;
      this.ispubliclyTradedDebt =  params.data.ptd;
      this.workToStart = params.data.wts;
      this.typeOfWork = params.data.wti;
      this.isMultibidder = params.data.imb;
      this.isSingleBidder = params.data.isb;
      this.isSeller = params.data.isSeller;
      this.openMarketPurchase = params.data.iomp;  
      return true;
  }

}
