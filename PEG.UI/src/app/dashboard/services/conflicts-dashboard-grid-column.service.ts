import { Injectable } from "@angular/core";
import { GridService } from "../../shared/grid-generator/grid-column.service";
import { GlobalService } from "../../global/global.service";
import { CoreService } from "../../core/core.service";
import { ColDef, ICellRendererComp, ICellRendererFunc } from "ag-grid-community";
import { GridColumn } from "../../shared/interfaces/grid-column.interface";
import { ConflictsDashboardValueGetter } from "./conflicts-dashboard-value-getter";
import { fontIcons } from "../../shared/grid-generator/grid-constants";
import * as moment from "moment";
import { retry } from "rxjs/operators";

@Injectable()
export class ConflictsDashboardGridColumnService extends GridService {
    constructor(globalService: GlobalService, public coreService: CoreService) {
        super(coreService, globalService);

    }
    public get getDefaultColumnDefinition(): ColDef {
        return <ColDef>{
            sortable: true,
            filter: false,
            resizable: true
        };
    }

    public getColumnDefinitions(columns: GridColumn[]): ColDef[] {
        let columnDefs: ColDef[] = [];
        columnDefs = columns.map(this.generateConflictDashboardColumnDefinition.bind(this));
        return columnDefs;
    }
    public generateConflictDashboardColumnDefinition(column: GridColumn): ColDef {
        let columnDef: ColDef = {};
        columnDef.field = column.field;
        columnDef.colId = column.columnId.toString();
        columnDef.headerName = column.headerName;
        columnDef.filter = column.filter;
        columnDef.suppressMenu = !column.isFilterable;
        columnDef.sort = column.sortType;
        columnDef.cellEditor = column.cellEditor;
        columnDef.headerTooltip = column.headerName;
        columnDef.width = column.maxWidth;
        columnDef.valueGetter = function (params) {
            if (params.data) {
                return ConflictsDashboardValueGetter.getValue(column, params);
            }
        };
        if (!column.isQuickFilter) {
            columnDef.getQuickFilterText = () => null;
        }
        if (column.isFilterable) {
            columnDef.filter = column.filter;
            columnDef.filterParams = this.getFilterParams(column);
            columnDef.headerComponentParams = { menuIcon: fontIcons.filterIcon };
        }
        columnDef.cellRenderer = this.getCellRenderer(column);

        return columnDef;
    }
    getCellRenderer(column: GridColumn): string | ICellRendererFunc | (new () => ICellRendererComp) {
        let windowWidth = window.innerWidth;
        let cellRenderer: ((params: any) => HTMLElement | string) | string;
        if (column.cellRenderer) {
            switch (column.cellRenderer) {
                case 'conflictDashSubmittedDateRenderer':
                    cellRenderer = (params) => {
                        if (params?.data?.submissionDate && new Date(moment(params.data.submissionDate).format('DD-MMM-YYYY')) > new Date('01-Jan-0001')) {
                            return moment(params.data.submissionDate).format('DD-MMM-YYYY')

                        } else {
                            return "";
                        }
                    }
                    break;
                case 'conflictDashLastUpdatedRenderer':
                    cellRenderer = (params) => {
                        if (params?.data?.lastUpdated && new Date(moment(params.data.lastUpdated).format('DD-MMM-YYYY')) > new Date('01-Jan-0001')) {
                            return moment(params.data.lastUpdated).format('DD-MMM-YYYY')

                        } else {
                            return "";
                        }
                    }
                    break;
                case 'conflictDashViewConflictsRenderer':
                    cellRenderer = (params) => {
                        const element = document.createElement("div");
                        element.innerHTML = '<a class="btn btn-link-custom btn-sm">View Conflicts <i class="fa fa-chevron-right ml-1"></i></a>'

                        return element;

                    }
                    break;
                case 'conflictDashRegIdRenderer':
                    cellRenderer = (params) => {
                        const element = document.createElement("div");
                        element.innerHTML = '<a class="btn btn-link-custom btn-sm">' + params.data.registrationId + '</a>'

                        return element;

                    }
                    break;
                case 'conflictDashTargetOwnerRenderer':
                    cellRenderer = (params) => {

                        return params?.data?.corporateRelationship ;

                    }
                    break;
            }
        }
        else {
            cellRenderer = null;
        }
        return cellRenderer
    }
}