import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WorkType } from '../../../registrations/new-registration/workType';
import { WorkTypeEnum } from '../../../shared/enums/work-type.enum';

@Component({
  selector: 'app-conflict-area',
  templateUrl: './conflict-area.component.html',
  styleUrls: ['./conflict-area.component.scss'],
})
export class ConflictAreaComponent implements OnInit, OnChanges {
  @Input() data: WorkType;
  @Input() customClass = '';
  boldText: string;
  regularText: string;
  cssClass = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.boldText = this.data.workTypeName.split('(')[0];
      this.regularText = this.data.workTypeName.indexOf('(') > -1 ? `(${this.data.workTypeName.split('(')[1]}` : '';

      switch(this.data.workTypeId){
          case WorkTypeEnum.BuySideCorporateMA:
          case WorkTypeEnum.BuySideDebt:
          case WorkTypeEnum.BuySideEquityBuyout:
          case WorkTypeEnum.BuySideEquityNonControl:
            this.cssClass = 'buy-side';
            break;

          case WorkTypeEnum.JointMA:
            this.cssClass = 'joint-ma';
            break;

          case WorkTypeEnum.SellSideIncludingVDDSellSideCorpMA:
            this.cssClass = 'sell-side';
            break;

          case WorkTypeEnum.Rediligence:
            this.cssClass = 're-dilligence';
            break;

          case WorkTypeEnum.PreSaleSupport:
            this.cssClass = 'presale';
            break;
          
          default:
            this.cssClass = '';
          break;
      }
    }
  }
}
