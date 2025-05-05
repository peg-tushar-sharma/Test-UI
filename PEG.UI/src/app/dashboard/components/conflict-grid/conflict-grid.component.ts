import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../dashboard/dashboard';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { PagesTypes } from '../../../shared/enums/page-type.enum';
import { GridColumn } from '../../../shared/interfaces/grid-column.interface';
import { ConflictsDashboardGridColumnService } from '../../services/conflicts-dashboard-grid-column.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-conflict-grid',
  templateUrl: './conflict-grid.component.html',
  styleUrls: ['./conflict-grid.component.scss']
})
export class ConflictGridComponent implements OnInit, OnChanges {

  @Input() filterTerm: string;

  rowData: Dashboard[] = [];
  columnDefs = [];

  defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    resizable: true,

  };
  gridOptions: GridOptions = {
    suppressMenuHide: true,
    sortingOrder: ["desc", "asc"],
    rowHeight: 33,
    headerHeight: 33,
    suppressContextMenu: true,
    getRowNodeId: (data: Dashboard) => data.registrationId.toString(),

  };
  public gridApi: GridApi;
  public gridColumnApi: any;

  constructor(private router: Router, private dashboardService: DashboardService, private conflictsDashboardGridColumnService: ConflictsDashboardGridColumnService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterTerm && changes.filterTerm.currentValue) {
      if (changes.filterTerm.currentValue != "") {
        this.gridApi.setQuickFilter(changes.filterTerm.currentValue);
      }
      else {
        if (this.gridApi) {
          this.onResetFilter(undefined);
        }

      }
    } else {
      if (this.gridApi) {
        this.onResetFilter(undefined);
      }
    }
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeColumnsToFit();
  }
  sizeColumnsToFit() {
    if (this.gridColumnApi) {
      this.gridColumnApi.sizeColumnsToFit();
    }
  }
  getColumnData() {
    this.dashboardService.getUserColumns(PagesTypes.ConflictsDashboard).subscribe((columns: GridColumn[]) => {
      this.columnDefs = this.conflictsDashboardGridColumnService.getColumnDefinitions(columns);
      this.getdashboardData('COMPLETED', '', '');
    });
  }
  ngOnInit(): void {
    this.getColumnData();
  }
  onResetFilter(event: MouseEvent) {
    this.gridApi.setFilterModel(null);
    this.gridApi.setQuickFilter(null);
    this.filterTerm = "";

    // TODO: Implement.
  }
  onCellClicked(event) {

    if (event.colDef.field === 'cdRegistrationId') {

      let url = this.router.serializeUrl(
        this.router.createUrlTree(["/registrations;registrationid=" + event.data.registrationId])
      );
      url = url.replace("%3B", ";");
      url = url.replace("%3D", "=");
      window.open(url, '_blank');
    } else if (event.colDef.field === 'cdViewConflicts') {
      this.router.navigate(['/pending-approval', event.data.registrationId]);
    }
  }
  getdashboardData(filterName, startDate, endDate) {
    this.dashboardService.getDashboardRegistrations(filterName, startDate, endDate, 0).subscribe((res) => {
      this.rowData = res;
    });
  }

}
