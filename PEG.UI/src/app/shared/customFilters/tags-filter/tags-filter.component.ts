import { Component } from '@angular/core';
import { CommonMethods } from '../../common/common-methods';

@Component({
  selector: 'tags-filter',
  templateUrl: './tags-filter.html'
})
export class TagsFilterComponent {
  isUrgent = false;
  isMultibidder = false;
  isSingleBidder = false;
  isSeller = false;
  isHedgeFund = false;
  isPublicTradedDept = false;
  params: any;

  searches: string[] = [];

  agInit(params: any): void {
    this.params = params;
  }

  onChange(value: any) {
    /* notify the grid about the change */

    this.searchSetter();
    this.params.filterChangedCallback();
  }

  isFilterActive() {
    return this.isUrgent || this.isHedgeFund || this.isMultibidder || this.isSingleBidder || this.isSeller || this.isPublicTradedDept;
  }

  doesFilterPass(params) {
    let doesFilterPassValue = true;
    if (this.searches.length > 0) {
      doesFilterPassValue = false;
      const value = CommonMethods.tagsGetter(params.node);
      if (value) {
        doesFilterPassValue = this.searches.some(search => value.includes(search));
      }
    }

    return doesFilterPassValue;
  }

  searchSetter() {
    this.searches = [];

    if (this.isUrgent)
      this.searches.push("Urgent");

    if (this.isHedgeFund)
      this.searches.push("HF");

    if (this.isMultibidder)
      this.searches.push("MB");

    if (this.isSingleBidder)
      this.searches.push("SB");

    if (this.isSeller)
      this.searches.push("Seller");

    if (this.isPublicTradedDept)
      this.searches.push("PTD");
  }

  getModel(): any {
    return { value: this.searches };
  }

  setModel(model: any): void {
    this.searches = model ? model.value : this.clearAllSelection();
  }

  clearAllSelection() {
    this.isUrgent = false;
    this.isMultibidder = false;
    this.isSingleBidder = false;
    this.isSeller = false;
    this.isHedgeFund = false;
    this.isPublicTradedDept = false;
    return [];
  }

}
