import { Component } from '@angular/core';
import { CoreService } from '../../../core/core.service';
import { GridApi,ColumnApi, IAfterGuiAttachedParams,IToolPanelParams } from "ag-grid-community";
import { GridColumn } from '../../interfaces/grid-column.interface';
import { IToolPanelAngularComp } from "ag-grid-angular";
import { PagesTypes } from '../../enums/page-type.enum';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { PipelineGridColumnService } from '../../grid-generator/pipeline-grid-colum.service';
import { PipelineService } from '../../../pipeline/pipeline.service';
import { UserColumn } from '../../../pipeline/userColumn';

@Component({
  selector: 'app-opportunity-name-tool-panel',
  templateUrl: './opportunity-name-tool-panel.component.html',
  styleUrls: ['./opportunity-name-tool-panel.component.scss']
})
export class OpportunityNameToolPanelComponent implements IToolPanelAngularComp {
  gridColumn: GridColumn[] = [];
  selectedHeaders: GridColumn[] = [];
  disableCheckBox:boolean=false;
  gridApi:GridApi;
  columnApi:ColumnApi;
  constructor(private pipelineService: PipelineService, private gridService: PipelineGridColumnService, private coreService: CoreService, private toastr: PegTostrService) {

    // This is to reset the column preferences when any changes are made via grid or column tab in Ag Grid column pannel
    this.pipelineService.preferenceChanges$.subscribe((columns: GridColumn[]) => {
      if (columns) {
        this.setColumnData(columns);
      }
    });

  }
 
  agInit(params: IToolPanelParams): void {
    this.getGridColumnData();
    this.gridApi = params.api;
    this.columnApi=params.columnApi;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    // throw new Error('Method not implemented.');
  }
  refresh(): void {

  }

  getGridColumnData() {
    this.pipelineService.getUserColumns(PagesTypes.HomeDashboard)
      .subscribe((columns: GridColumn[]) => {
        this.setColumnData(columns);
      });
  }
  setColumnData(columns: GridColumn[]) {
    this.gridColumn=[];
    this.gridColumn = columns
    this.setOpportunityHeaders(columns);
  }

  setOpportunityHeaders(column: GridColumn[]) {
    this.selectedHeaders=[];
    column.forEach(element => {
      if (element.isOppName == true) {
        this.selectedHeaders.push(element);
      } else {
        this.selectedHeaders = this.selectedHeaders.filter(item => {
          return item.headerName !== element.headerName;
        })
      }
    });
    this.sortSelectedHeaders()
  }
  sortSelectedHeaders(){
    this.selectedHeaders = this.selectedHeaders.sort((a, b) => (a.oppSortOrder < b.oppSortOrder ? -1 : 1));
  }
  onDelimiterChange(event,data){
    if(event.keyCode==191 || event.keyCode==189 || event.keyCode==111){
      data.delimiter=event.target.value;

    }else{
      data.delimiter=undefined;
    }
    data.isDropdownVisible=!data.isDropdownVisible;
    this.saveUserPrefrences();
    this.setOpportunityHeaders(this.gridColumn)
  }
  sortByRoleColumOrder(prop: string) {

    return this.gridColumn.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }
  onOpportunitySelect(data: GridColumn) {
    this.disableCheckBox=true;
    if (data.isOppName == true) {
      this.selectedHeaders.push(data);
    } else {
      this.selectedHeaders = this.selectedHeaders.filter(item => {
        return item.headerName !== data.headerName;
      })
    }
    this.gridColumn.forEach((element) => {
      if(this.selectedHeaders.some((header)=>header.field==element?.field)){
        let index = this.selectedHeaders.findIndex((header)=>header.field==element?.field);
        element.oppSortOrder = index;
      }
    });
    this.saveUserPrefrences();
  }
  saveUserPrefrences(resetColumnOrdering: boolean = false) {
    this.pipelineService.savePipelineColumnPrefrences(this.updateUserColumn(this.gridColumn), resetColumnOrdering).subscribe((res) => {
      let val: GridColumn[] = res;
      this.gridColumn = val;
      //This will retain the saved selected view sorting on grid
      this.setSelectedSortModel();
      let ColDefs = this.gridService.getColumnDefinitions(val);
      
      this.pipelineService.recreatePipelineGrid(ColDefs);
      this.toastr.showSuccess('Preferences has been saved', 'Success');
      this.disableCheckBox=false;
    });
  }

  setSelectedSortModel(){
   let sortTemplateJS=  JSON.stringify(this.columnApi.getColumnState())
   if(sortTemplateJS){
      let existingSort = this.gridColumn.filter((x) => x.sortType != null);

      existingSort?.forEach((existingSortElement) => {
          existingSortElement.sortType = null;
      });
      let sortTemplateValue = JSON.parse(sortTemplateJS);
      sortTemplateValue.forEach((element, sortIndex) => {
          let columnIndex = this.gridColumn.findIndex((x) => x.columnId == element.colId);
          this.gridColumn[columnIndex].sortType = element.sort;
          this.gridColumn[columnIndex].sortIndex = sortIndex;
      });
    }
  }

  updateUserColumn(columns) {
    let userColumnList = [];
    let userColumn: UserColumn = new UserColumn();
    columns.forEach(element => {
      userColumn = new UserColumn();
      userColumn.columnId = element.column.columnId;
      userColumn.userColumnId = 0;
      userColumn.lastUpdated = new Date();
      userColumn.sortOrder = element.sortOrder;
      userColumn.isOppName = element.isOppName ? element.isOppName : 0;
      userColumn.isHide = element.isHide;
      userColumn.columnWidth = element.maxWidth;
      userColumn.oppSortOrder = element.oppSortOrder;
      userColumn.employeeCode = this.coreService.loggedInUser.employeeCode;
      userColumn.pageId = PagesTypes.HomeDashboard;
      userColumn.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
      userColumn.delimiter=element.delimiter;
      userColumnList.push(userColumn);
    });
    return userColumnList;
  }
}
