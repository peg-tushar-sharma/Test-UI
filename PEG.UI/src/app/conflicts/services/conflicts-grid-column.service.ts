import { Injectable } from "@angular/core";
import { GridService } from "../../shared/grid-generator/grid-column.service";
import { GlobalService } from "../../global/global.service";
import { CoreService } from "../../core/core.service";
import { ColDef, ICellRendererComp, ICellRendererFunc } from "ag-grid-community";
import { GridColumn } from "../../shared/interfaces/grid-column.interface";
import { ConflictsValueGetter } from "../conflicts-value-getter";
import { fontIcons } from "../../shared/grid-generator/grid-constants";
import * as moment from "moment";
import { retry } from "rxjs/operators";

@Injectable()
export class ConflictsGridColumnService extends GridService {
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
        columnDefs = columns.map(this.generatePipelineColumnDefinition.bind(this));
        return columnDefs;
    }
    public generatePipelineColumnDefinition(column: GridColumn): ColDef {
        let columnDef: ColDef = {};
        columnDef.field = column.field;
        columnDef.colId = column.columnId.toString();
        columnDef.headerName = column.headerName;
        columnDef.filter = column.isFilterable;
        columnDef.suppressMenu = !column.isFilterable;
        columnDef.sort = column.sortType;
        columnDef.cellEditor = column.cellEditor;
        columnDef.headerTooltip = column.headerName;
        columnDef.width = column.maxWidth;
        columnDef.valueGetter = function (params) {
            if (params.data) {
                return ConflictsValueGetter.getValue(column, params);
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

        if(columnDef.field == "companyName"){
            columnDef.comparator = (valueA, valueB) => {
                return valueA.localeCompare(valueB);
            }
        }

        return columnDef;
    }
    getCellRenderer(column: GridColumn): string | ICellRendererFunc | (new () => ICellRendererComp) {
        let windowWidth = window.innerWidth;
        let cellRenderer: ((params: any) => HTMLElement | string) | string;
        if (column.cellRenderer) {
            switch (column.cellRenderer) {
                case 'SubmittedDate':
                    cellRenderer = (params) => {
                        if (params?.data?.submittedDate && new Date(moment(params.data.submittedDate).format('DD-MMM-YYYY')) > new Date('01-Jan-0001')) {
                            return moment(params.data.submittedDate).format('DD-MMM-YYYY')

                        } else {
                            return "";
                        }
                    }
                    break;

                case 'stageType':
                    cellRenderer = (params) => {

                        let isActive: boolean = params?.data?.stageType ? true : false;
                        const colorToUse = isActive ? "#8ee8b4" : "#f9b66b";

                        const element = document.createElement("div");
                        element.style.cssText = "display: flex; align-items: center; height: 100%";

                        if (params?.data?.stageType != null) {
                            element.innerHTML = windowWidth <= 768 ? `<i class="fas fa-circle mr-1" style="color: ${colorToUse}; font-size: 10px"></i>` : `
                            <i class="fas fa-circle mr-1" style="color: ${colorToUse}; font-size: 10px"></i>
                            <span style="overflow: hidden; text-overflow: ellipsis">${isActive ? 'Active' : 'Archived'}</span>
                            `;
                        }

                        return element;
                    }
            }
        }
        else {
            cellRenderer = null;
        }
        return cellRenderer
    }
}