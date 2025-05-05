import { AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode, ValueGetterParams } from "ag-grid-community";
import { IFilterAngularComp } from "ag-grid-angular";
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-text-filter',
    templateUrl: './text-filter.component.html',
    styleUrls: ['./text-filter.component.scss']
})

export class TextFilterComponent implements IFilterAngularComp, AfterViewInit {
    public text: string = '';
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;
    private filterQueryChanged: Subject<string> = new Subject<string>();
  
    @ViewChild('input', { read: ViewContainerRef, static: true }) public input;
  
    agInit(params: IFilterParams): void {
      this.params = params;
      this.valueGetter = (rowNode: RowNode) => {
        return params.valueGetter({
          node: rowNode,
          data: rowNode.data,
          colDef: params.colDef,
          column: params.column,
          api: params.api,
          columnApi: params.columnApi,
          context: params.context
        } as ValueGetterParams);
      };
  
      this.filterQueryChanged
        .pipe(
          debounceTime(50), 
          distinctUntilChanged()
        )
        .subscribe((searchQuery) => {
          if (searchQuery && !searchQuery.trim()) {
            this.text = searchQuery.trim();
          }
          this.params.filterChangedCallback();
        });
    }
  
    isFilterActive(): boolean {
      return this.text !== null && this.text !== undefined && this.text !== '';
    }
  
    doesFilterPass(params: IDoesFilterPassParams): boolean {
      return this.text?.toLowerCase()
        .split(" ")
        .every((filterWord:string) => {
          const cellValue = this.valueGetter(params.node);
          return cellValue && cellValue!=""? cellValue.toString().toLocaleLowerCase().includes(filterWord.toLocaleLowerCase()) ?? true:false;
        });
    }
  
    getModel(): any {
      return { value: this.text };
    }
  
    setModel(model: any): void {
      this.text = model ? model.value : '';
    }
  
    ngAfterViewInit(params?: IAfterGuiAttachedParams): void {
      setTimeout(() => {
        this.input.element.nativeElement.focus();
      });
    }
   
    onChange(newValue: string): void {
      this.filterQueryChanged.next(newValue);
    }
    
    closePopUp(): void {
      this.params.api.hidePopupMenu();
    }
  }
