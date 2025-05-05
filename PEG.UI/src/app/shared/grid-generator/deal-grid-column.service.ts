import { Injectable } from '@angular/core';
import { ColDef, ICellRendererComp, ICellRendererFunc } from 'ag-grid-community';
import { GridColumn } from '../interfaces/models';
import { GridRenderers, fontIcons } from './grid-constants';
import { FormatTimeZone } from '../formatTimeZone.pipe';
import { GridService } from './grid-column.service';
import { GlobalService } from '../../global/global.service';
import { GridFilterValue } from './grid-filter-value';
import { CoreService } from '../../core/core.service';
import { GridCellRenderer } from './grid-cell-renderer';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';


@Injectable()
export class DealGridColumnService extends GridService {
    stage;
    constructor(globalService: GlobalService, public coreService: CoreService) {
        super(coreService,globalService);
        globalService.getRegistrationStage().subscribe(res => {
            this.stage = res;
        });
    }
    public getColumnDefinitions(columns: GridColumn[]): ColDef[] {
        let columnDefs: ColDef[] = [];

        columnDefs = columns.map(this.generateDealColumnDefinition.bind(this));
        return columnDefs;
    }
    public generateDealColumnDefinition(column: GridColumn): ColDef {
        this._formatTimeZone = new FormatTimeZone()
        let columnDef: ColDef = {};

        columnDef.valueGetter = function (params) {
            return GridFilterValue.getFilterValue(column, params, columnDef);
        };

        columnDef.headerName = column.headerName;
        columnDef.field = column.field;
        columnDef.tooltipField = column.tooltipField;
        columnDef.filter = false;
        columnDef.sort = column.sort;
        columnDef.cellEditor = column.cellEditor
        columnDef.cellEditorParams = this.getCellEditorParams(column);
        columnDef.cellRenderer = this.getDealCellRenderer(column, column.cellRenderer);
        columnDef.minWidth = column.maxWidth;
        columnDef.width = column.maxWidth;
        if (column.filter) {
            columnDef.filter = column.filter;
            columnDef.filterParams = this.getFilterParams(column);
            columnDef.headerComponentParams = { menuIcon: fontIcons.filterIcon };
        }
      columnDef.suppressMenu = !column.filter;
        columnDef.editable = column.isEditable;
        if(column.field=='clientName'|| column.field=='link'){
            columnDef.pinned='left'
        }
        return columnDef;
    }

    getCellEditorParams(column: GridColumn) {

        switch (column.field) {

            case 'notes':
                return {
                    maxLength: '10000'
                }
            case 'dealThesis':
                return {
                    maxLength: '10000'
                }
            case 'seekingExpertise':
                return {
                    maxLength: '10000'
                }
            case 'callLog':
                return {
                    maxLength: '10000'
                }
            default:
                break;
        }

    }



    getDealCellRenderer(column: any, customRenderer): { new(): ICellRendererComp; } | ICellRendererFunc | string {
        let cellRenderer: ((params: any) => HTMLElement | string) | string;

        switch (column.type) {
            case 'check':
                cellRenderer = (params) => {
                    return params.data.iomp ? GridRenderers.checkMarkHTML : '';
                }
                break;

            case 'date':
                cellRenderer = (params: any) => {

                    if (params.data) {
                        if (column.cellRenderer == 'case') {
                            return params && params.data[column.field] ? this._formatTimeZone.transform(params.data[column.field]) : '';
                        }  
                    
                        return params && params.value ? this._formatTimeZone.transform(params.value) : '';
                    }
                };
                break;


            case 'icon':
                if (customRenderer &&  ( customRenderer == 'iconsRendererComponent' )) {
                    cellRenderer = customRenderer;

                }
                else {
                    cellRenderer = (params) => {
                        if (column.field == 'delete') {
                            return '<div style="cursor:pointer"><i class="fas fa-trash cell-icon"></i></div>'
                        } else if (column.field == 'callDates') {
                            return '<div style="cursor:pointer; width: 132px;  height: 38px; margin-left:-10px" data-backdrop="static" data-keyboard="false" data-toggle="modal" data-target="#dealClientDates"><i  style="margin-left:8px" class="fas fa-calendar-plus"></i></div>';
                        }
                    }
                     }
                break;
            case 'custom':
                cellRenderer = (params) => {
                    let gridCellRenderer = new GridCellRenderer(this.coreService);
                    return gridCellRenderer.getCellRenderer(column, params);
                }
                break;

              
            default:

                break;
        }
        return cellRenderer;
    } 


}
