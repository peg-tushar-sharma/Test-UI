import { Component, HostListener, OnInit } from '@angular/core';
import { ColDef, ColGroupDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { debounce } from '../../../partner-dashboard/partner-dashboard/partner-dashboard.component';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { AddConflictComponent } from '../add-conflict/add-conflict.component';
import { AgGridStagesComponent } from '../ag-grid-stages/ag-grid-stages.component';
import { PagesTypes } from '../../../shared/enums/page-type.enum';
import { PipelineService } from '../../../pipeline/pipeline.service';
import { GridColumn } from '../../../shared/interfaces/grid-column.interface';
import { ConflictsGridColumnService } from '../../services/conflicts-grid-column.service';
import { ConflictsService } from '../../services/conflicts.service';
import { Company } from '../../company';
import { CoreService } from '../../../core/core.service';
import { Employee } from '../../../shared/interfaces/Employee';

@Component({
  selector: 'app-conflicts',
  templateUrl: './conflicts.component.html',
  styleUrls: ['./conflicts.component.scss']
})
export class ConflictsComponent implements OnInit {
  activeTab: 'active' | 'archived' = 'active';
  recordCount = 0;
  searchText = '';



  rowData: Company[] = [];
  columnDefs: (ColDef | ColGroupDef)[];
  defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    suppressAutoSize: false
  };
  gridOptions: GridOptions = {
    suppressMenuHide:true,
    frameworkComponents: {
      stageRendererComponent: AgGridStagesComponent
    },
    getRowNodeId: (conflict:Company ) => conflict.companyId.toString(),
    onFilterChanged:(event) => this.onFilterChanged(event)

  };
  public gridApi: GridApi;



  constructor(private readonly modalService: NgbModal, private conflictsGridColumnService: ConflictsGridColumnService,
    private readonly conflictsService: ConflictsService, private coreService: CoreService) { }

  ngOnInit(): void {
    this.getColumnData();

  }
  getColumnData() {
    this.conflictsService.getUserColumns(PagesTypes.Conflicts).subscribe((columns: GridColumn[]) => {
      this.columnDefs = this.conflictsGridColumnService.getColumnDefinitions(columns);
      //calling grid data once column is rendered.
      this.getConflicts();  //Getting active Conlicts
    });
  }

  getConflicts() {
    let isActive = this.activeTab == 'active';
    this.conflictsService.getConflicts(isActive).subscribe((conflicts: Company[]) => {
      this.rowData = conflicts;
      this.gridApi.setRowData( this.rowData);
      this.resetDisplayCount();
    });

  }
  resetDisplayCount() {
    if (this.gridApi) {
      this.recordCount = this.gridApi.getDisplayedRowCount();
    }
  }

  createConflict(data, isEdit = false) {
    const ref = this.modalService.open(AddConflictComponent, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
    });
    ref.componentInstance.data = data;
    ref.componentInstance.isEdit = isEdit;
    ref.closed.pipe(take(1)).subscribe((result) => {
      if (result) {
        //Setting up submitted By
        this.conflictsService.upsertConflict(result).subscribe((data: Company) => {
          if (data) {
            let responseStage = data.stageType ? 'active' : 'archived';
            if (responseStage == this.activeTab) {
              if (result.isEdit) {
                let index = this.rowData.findIndex((i) => i.companyId == data.companyId);
                this.rowData[index] = data;
                this.gridApi.setRowData(this.rowData);
                var rowNode = this.gridApi.getRowNode(data?.companyId?.toString());
                var params = { force: true, suppressFlash: true, update: [rowNode] };
                this.gridApi.redrawRows({ rowNodes: [rowNode] });
                this.gridApi.refreshCells(params);
              } else {
                this.gridApi.applyTransaction({ add: [data] });
              }
              this.resetDisplayCount();

            }
            else if (result.isEdit) {
              let index = this.rowData.findIndex((i) => i.companyId == data.companyId);
              if (index !== -1) {
                this.rowData.splice(index, 1);
                this.gridApi.setRowData(this.rowData);
              }
              this.resetDisplayCount();
            }
          }
        });
      }

    });
  }

  toggleConflictTypeTab(isArchived: boolean) {
    this.activeTab = isArchived ? 'archived' : 'active';
    this.getConflicts();
  }

  onSearchChanged(event) {
    // TODO: API Call to search.
    let searchQuery = event.target.value;
    this.gridApi.setQuickFilter(searchQuery);
  }

  onResetFilter(event: MouseEvent) {
    this.gridApi.setFilterModel(null);
    this.gridApi.setQuickFilter(null);
    this.searchText = "";

    // TODO: Implement.
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }
  onCellDoubleClicked(event) {
    this.createConflict(event.data, true);
  }
  onFilterChanged(event){
    this.resetDisplayCount();
  }
}
