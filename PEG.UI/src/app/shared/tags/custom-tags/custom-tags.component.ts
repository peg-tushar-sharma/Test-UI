
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-tags',
  templateUrl: './custom-tags.component.html',
  styleUrls: ['./custom-tags.component.scss']
})
export class CustomTagsComponent implements OnInit {

  @Input()
  public ispubliclyTradedEquity: boolean = false;
  @Input()
  public ispubliclyTradedDebt: boolean = false;
  @Input()
  public workToStart: number;
  @Input()
  public typeOfWork: number;
  @Input()
  public isMultibidder: boolean = false;
  @Input()
  public isSingleBidder: boolean = false;
  @Input()
  public isSeller: boolean = false;
  @Input()
  public openMarketPurchase: boolean = false;
  @Input()
  public showFullTagName: boolean = false;

  tags = [];

  constructor() { }

  ngOnInit() {
  }

}


