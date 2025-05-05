import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { ColDef, ICellRendererComp, ICellRendererFunc } from 'ag-grid-community';
import { GridService } from '../../shared/grid-generator/grid-column.service';

import { ColumnType, GridColumn } from '../../shared/interfaces/models';
import { CommonMethods } from '../../shared/common/common-methods';
import { CoreService } from '../../core/core.service';
import { GlobalService } from '../../global/global.service';
import { SecurityUserDetails } from '../../admin/admin';
import { DatePipe } from '@angular/common';
import { GridRenderers } from './grid-constants';
import * as moment from 'moment';
import { PipelineGridCellRenderer } from './pipeline-grid-cell-renderer';
import { FormatTimeZone } from '../formatTimeZone.pipe';
import { GridFilterValue } from './grid-filter-value';


@Injectable()
export class AdminGridColumnService extends GridService<SecurityUserDetails> {

    /**
     *
     */
    constructor(@Inject(LOCALE_ID) locale: string, public coreService: CoreService, public globalService: GlobalService) {
        super(coreService, globalService);
    }
    oppNameFields = [];

    public generateColumnDefinition(column: GridColumn): ColDef {
        let columnDef = super.generateColumnDefinition(column);
        let cellRenderer: ((params: any) => HTMLElement | string) | string;
        // client display name -> filterParams = { suppressAndOrCondition: true } is missing

        columnDef.valueGetter = function (params) {
            if (params.data) {
                return GridFilterValue.getFilterValue(column, params, columnDef);
            }
        }

        columnDef.cellRenderer = this.getAdminCellRenderer(column.type, column.cellRenderer, column);
        columnDef.filter = column.filter;
        // if (column.field == 'securityRole') {
        //     columnDef.cellEditorParams = 'RoleEditorComponent';
        // }


        if (!column.isQuickFilter) {
            columnDef.getQuickFilterText = () => null;
        }

        return columnDef;
    }


    getAdminCellRenderer(type: ColumnType, customRenderer, column): { new(): ICellRendererComp; } | ICellRendererFunc | string {
        let cellRenderer: ((params: any) => HTMLElement | string) | string;

        switch (type) {
            case 'icon':
                cellRenderer = (params) => {
                    return params.data.iomp ? GridRenderers.checkMarkHTML : '';
                }
                break;

            case 'date':
                cellRenderer = (params: any) => {



                    if (params.data) {


                        if (params.colDef.field == 'expirationDate') {
                            let expirationDate;

                            if (params.data && params.data.expirationDate && params.data.expirationDate != "0001-01-01T00:00:00Z") {
                                expirationDate = moment(params.data.expirationDate).format('DD-MMM-YYYY');
                            }
                            return expirationDate;
                        }
                        if (params.colDef.field == 'lastModified') {
                            if (params.data.lastUpdated) {
                                let UiDate = moment(this._formatTimeZone.transform(params.data.lastUpdated)).format('DD-MMM-YYYY');
                                this._formatTimeZone = new FormatTimeZone();
                                let dateparsed = this._formatTimeZone.transform(params.data.lastUpdated, true);
                                let date1 = new Date(moment(dateparsed).format('DD-MMM-YYYY'));
                                let date2 = (moment(dateparsed).format('DD-MMM-YYYY'));
                                return date2;
                            }
                        }
                        else if (params.colDef.field == 'caseStartDate') {
                            if (params.data?.case?.caseStartDate) {
                                let UiDate = moment(this._formatTimeZone.transform(params.data?.case?.caseStartDate)).format('DD-MMM-YYYY');
                                return UiDate;
                            }
                        }
                        else if (params.colDef.field == 'caseEndDate') {
                            if (params.data?.case?.caseEndDate) {
                                let UiDate = moment(this._formatTimeZone.transform(params.data?.case?.caseEndDate)).format('DD-MMM-YYYY');
                                return UiDate;
                            }
                        }
                        else {
                            if (params.value) {
                                let dateparsed = this._formatTimeZone.transform(params.value, true);
                                let UiDate = params && params.value ? moment(dateparsed).format('DD-MMM') : '';
                                return UiDate;
                            }
                        }
                    }

                };
                break;

            case 'icon':
                cellRenderer = GridRenderers.iconRendererComponent;
                break;

            case 'text':


                if (customRenderer && (customRenderer == 'adminNameCellRendererComponent' || customRenderer == 'OpsLeadCellRendererComponent' || customRenderer == 'NotesCellRendererComponent' || customRenderer == 'BtnCellRendererComponent')) {
                    cellRenderer = customRenderer;
                }

                else {
                    cellRenderer = (params) => {
                        if (params.data) {
                            if (column.isMasked && params.data.isMasked) {
                                return `<div style="background-color: #bdbdbd;height: 70%;width: 100%;margin-top: 5px;"></div>`
                            }

                            else {
                                switch (column.cellRenderer) {
                                    case 'modifiedBy':
                                        if (params.data.modifiedBy) {
                                            return CommonMethods.getEmployeeName(params.data.modifiedBy);;
                                        }
                                        break;
                                    case 'dashIndustryRenderer':
                                        if (params.data?.industries) {
                                            let industries: string[] = [];
                                            params.data.industries.map((eachIndustry) => {
                                                industries.push(eachIndustry?.industryName);
                                            });
                                            return industries.join(', ');
                                        }
                                    case 'securityRole':
                                        return params.data?.securityRole?.name;
                                    case 'adminEditRenderer':
                                        return `<div style="text-align: center;"> <span ><i class="fa fa-reply" aria-hidden="true"></i>
                                        </span></div>`;

                                    default:
                                        return column.splitChar && params.value ? params.value.length > 0 ? params.value.join(column.splitChar) : params.value : params.value;
                                }

                            }
                        }
                    }
                }

                break;

            default:
                break;
        }

        return cellRenderer;
    }




    getFormattedValue() {

    }
}
