import { Component } from "@angular/core";
import { IDoesFilterPassParams, IFilterParams, RowNode } from "ag-grid-community";
import { IFilterAngularComp } from "ag-grid-angular";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { debounceTime, takeUntil, tap } from "rxjs/operators";
@Component({
  selector: 'app-custom-set-filter',
  templateUrl: './custom-set-filter.html',
  styleUrls: ['./custom-set-filter.component.scss']
})
export class CustomSetFilterComponent implements IFilterAngularComp {

  private static readonly rowHeight: number = 10;

  private model: Array<string>;
  private uniqueCheck: object;
  private filterParams: IFilterParams;
  private fieldId: string;
  private filterList: Array<string>;
  private ngUnsubscribe: Subject<any>;

  /**
   * Indicator to check if all items are selected
   */
  isEverythingSelected: boolean;
  /**
   * The height of the container holding our list of unique values
   * for the given column. The height is determined by the number of
   * items * rowHeight (28px);
   */
  containerHeight: number;
  /**
   * Using an object to store our selected values. The lookup will be
   * faster on a simple object, then using an array to filter or using a Map.
   */
  selectedValuesMap: object;
  /**
   * Holds our list of values for the user to select from.
   */
  onFilterListChange$: BehaviorSubject<string[]>;
  onFilterValuesChanged$: Observable<string[]>;

  agInit(params: IFilterParams): void {
    this.filterParams = params;
    this.uniqueCheck = {};
    this.selectedValuesMap = {};
    this.filterList = new Array<string>();

    this.fieldId = params.colDef.field;

    this.onFilterListChange$ = new BehaviorSubject<string[]>([]);
    this.ngUnsubscribe = new Subject<any>();

    this.onFilterValuesChanged$ = this.onFilterListChange$.pipe(
      debounceTime(250),
      tap(values => this.sortValues(values)),
      tap(values => this.setContainerHeight())
    );

    this.setUniqueValues();
    this.selectEverything();
  }

  setUniqueValues() {
    this.filterParams.rowModel.forEachNode((node: RowNode) => {
      if (!node.data) {
        return;
      }

      let value = node.data[this.fieldId];
      this.addUniqueValueIfMissing(value);
    });
  }

  toggleItem(value: string) {
    if (this.selectedValuesMap[value]) {
      delete this.selectedValuesMap[value];
    } else {
      this.selectedValuesMap[value] = 1;
    }

    this.isEverythingSelected = Object.keys(this.selectedValuesMap).filter(x=>x!="uncheck").length === this.filterList.length;
    if (Object.keys(this.selectedValuesMap).length == 0) {
      this.selectedValuesMap = { uncheck: 1 }
    }
    this.onFilterChanged();
  }

  toggleEverything() {
    this.isEverythingSelected = !this.isEverythingSelected;
    if (this.isEverythingSelected) {
      this.selectEverything();
    } else {
      this.unselectEverything();
    }
    this.onFilterChanged();
  }

  onNewRowsLoaded() {
    this.setUniqueValues();
  }

  isFilterActive(): boolean {
    return (
      Object.keys(this.selectedValuesMap).length > 0 &&
      !this.isEverythingSelected
    );
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const node = params.node;
    if (!node.data) {
      return false;
    }

    const nodeValue = params.data[this.fieldId];
    if (!this.isValueValid(nodeValue)) {
      return false;
    }

    // check if current row node value exists in our selectedValuesMap
    return Boolean(this.selectedValuesMap[nodeValue]);
  }

  getModel() {
    return this.model;
  }

  onFilterChanged() {
    this.filterParams.filterChangedCallback();
  }

  setModel(value: string) {
    this.unselectEverything();
    this.selectedValuesMap[value] = 1;
    this.addUniqueValueIfMissing(value);
  }

  destroy() {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  private setContainerHeight() {
    this.containerHeight =
      this.filterList.length * CustomSetFilterComponent.rowHeight;
  }

  private sortValues(values: string[]) {
    values.sort();
  }

  private selectEverything() {
    this.filterList.forEach(value => (this.selectedValuesMap[value] = 1));
    this.isEverythingSelected = true;
  }

  private unselectEverything() {
    this.selectedValuesMap = {'uncheck':1};
    this.isEverythingSelected = false;
  }

  private addUniqueValueIfMissing(Currentvalue: string) {
    if (Currentvalue != null) {


      var parts = Currentvalue.split(';');
      parts.forEach(value => {


        if (!this.isValueValid(value)) {
          return;
        }

        if (this.uniqueCheck[value]) {
          return;
        }

        this.filterList.push(value);
        this.onFilterListChange$.next([...this.filterList]);
        this.uniqueCheck[value] = 1;
      });
    }
  }

  private isValueValid(value: string) {
    if (value === undefined || value === null) {
      return false;
    }

    return true;
  }

}
