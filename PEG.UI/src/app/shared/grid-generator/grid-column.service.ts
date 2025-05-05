import { Injectable } from '@angular/core';
import { ColDef, ICellRendererComp, ICellRendererFunc } from 'ag-grid-community';
import { GridColumn } from '../interfaces/models';
import { GridValues, GridFilters, GridRenderers, fontIcons } from './grid-constants';
import { FilterFunctions } from './filter-functions';
import { FormatTimeZone } from '../../shared/formatTimeZone.pipe'
import { RegistrationType } from '../enums/registration-type.enum';
import { GridCellRenderer } from './grid-cell-renderer';
import { GridFilterValue } from './grid-filter-value';
import { CoreService } from '../../core/core.service';
import { GlobalService } from '../../global/global.service';
import * as moment from 'moment';

@Injectable()
export class GridService<T = null> {
    _formatTimeZone: FormatTimeZone;
    /**
     *
     */
    constructor(public coreService: CoreService, public globalService: GlobalService) {

    }

    public get getDefaultColumnDefinition(): ColDef {
        return <ColDef>{
            sortable: true,
            filter: true,
            resizable: true,
            menuTabs: GridValues.menuTabs
        };
    }

    public getColumnDefinitions(columns: GridColumn[]): ColDef[] {
        let columnDefs: ColDef[] = [];

        columnDefs = columns.map(this.generateColumnDefinition.bind(this));
        return columnDefs;
    }


    public generateColumnDefinition(column: GridColumn): ColDef {
        this._formatTimeZone = new FormatTimeZone()
        let columnDef: ColDef = {};
        columnDef.valueGetter = function (params) {
            return GridFilterValue.getFilterValue(column, params, columnDef);
        };
        columnDef.colId = column.columnId ? column.columnId.toString() : "0";
        columnDef.headerName = column.headerName;
        columnDef.field = column.field;
        columnDef.hide = column.isHide;
        columnDef.filter = false;
        columnDef.resizable = true;

        if (column.sortType) {
            columnDef.sort = column.sortType;
        } else {
            columnDef.sort = column.sort;
        }
        columnDef.editable = this.getEditable(column);
        columnDef.cellEditorSelector = function (params) {
            if (params.colDef.field == 'tdn') {
                if (params.data.isMasked) {
                    return { component: column.cellEditor };
                }
            } else {
                return { component: column.cellEditor };
            }
        }
        //columnDef.cellEditor = column.cellEditor

        // Need to move to pipeline service
        //columnDef.filter = true;

        columnDef.cellRenderer = this.getCellRenderer(column);
        let checkedColumns = ['OMP', 'HF', 'PTD', 'PTE', 'Select', 'SPAC']
        if (checkedColumns.includes(column.headerName)) {
            columnDef.maxWidth = column.maxWidth;
            columnDef.minWidth = 30;
        } else {
            columnDef.minWidth = 30;
        }

        columnDef.width = column.maxWidth;
        if (columnDef.headerName.toLowerCase().endsWith('dt')) {
            columnDef.cellClass = "dateFormat"
            if (columnDef.field == "submissionDate") {
                columnDef.cellClass = "dateFormat1"
            }
        }
        columnDef.suppressMenu = !column.filter;
        if (column.filter) {
            columnDef.filter = column.filter;
            columnDef.filterParams = this.getFilterParams(column);
            columnDef.headerComponentParams = { menuIcon: fontIcons.filterIcon };
            //Set Case sensitive true to enable blanks for set column filter
            if (columnDef.filterParams && (['hasRegistration', 'hasDeal'].includes(columnDef?.field))) {
                columnDef.filterParams.caseSensitive = true;
            }
            // Set the predefined values in case of set filters
            // because in case of SSRM some prefefined values are required to fill in
            // work type, stage and registration status
            if (column.filter == 'agSetColumnFilter' && column.field == 'wtn') {
                this.globalService.getWorkTypeData()
                    .subscribe(workTypes => {
                        columnDef.filterParams = {
                            values: workTypes.map(w => w.workTypeName)
                        }
                    });
            }

            // Set predefined values of deal region in case of server side rendering
            if (column.filter == 'agSetColumnFilter' && column.field == 'drn') {
                this.globalService.getRegions()
                    .subscribe(region => {
                        columnDef.filterParams = {
                            values: region.map(w => w.regionName)
                        }
                    });
            }
            if (column.filter == 'agSetColumnFilter' && column.field == 'in') {
                this.globalService.getIndustrySectors()
                    .subscribe((industry: any) => {
                        columnDef.filterParams = {

                            values: industry.map(w => w.isTopIndustry ? w.industryName : 'Others')

                        }

                    });
            }
        }

        if (columnDef.field == 'status') {
            columnDef.cellClass = 'status',
                columnDef.cellStyle = function (params) {
                    if (params.data.dealStatus.dealStatusId == 1) {
                        return { color: '#c50' };
                    } else if (params.data.dealStatus.dealStatusId == 2) {
                        return { color: '#076007' };
                    } else if (params.data.dealStatus.dealStatusId == 3) {
                        return { color: '#000' };
                    }
                    else if (params.data.dealStatus.dealStatusId == 4) {
                        return { color: '#6a318f' };
                    }
                    else if (params.data.dealStatus.dealStatusId == 5) {
                        return { color: '#010088' };
                    }
                    else {
                        return null;
                    }
                }
        }
        if (columnDef.field == 'noOfClients') {
            columnDef.cellClass = 'noOfClients'
        }
        if (columnDef.field == 'noOfInterests') {
            columnDef.cellClass = 'noOfClients'
        }


        if (!column.isQuickFilter) {
            columnDef.getQuickFilterText = () => null;
        }
        if (columnDef.headerName == 'Select') {
            columnDef.checkboxSelection = this.getCheckBoxSelection()

        }

        if (column.field == 'targetName' || column.field == 'sessionId' || column.field == 'dealId' || column.field == 'hasDeal' || column.field == 'tdn' || column.field == 'hasRegistration' || column.field == '') {
            columnDef.pinned = 'left'
        }
        if (columnDef.field == "caseStartDate" || columnDef.field == "caseEndDate") {
            columnDef.comparator = function (date1, date2, node1, node2, isDesc) {
                let returnVal = 0;

                // Row sorting
                if ((!date1 && !date2) || date1 == date2) {
                    returnVal = 0;
                } else if(!date1) {
                    returnVal = isDesc ? -1 : 1;
                } else if(!date2) {
                    returnVal = isDesc ? 1 : -1;
                } else{
                    returnVal = new Date(date1) > new Date(date2) ? 1 : -1;
                }

                // Group row sorting
                if(node1?.key && node2?.key){
                    returnVal = new Date(node1.key) > new Date(node2.key) ? 1 : -1;
                }

                return returnVal;
            };
        }

        return columnDef;
    }
    getFilterParams(column: GridColumn, suppressAndOrCondition: boolean = true, suppressMiniFilter: boolean = true, defaultFilterOptions?: any, defaultComparatorFunc?: Function): {} {
        let filterParams: any = {};
        switch (column.filter) {
            case GridFilters.textFilterComponent:
                filterParams.suppressAndOrCondition = suppressAndOrCondition;
                break;

            case GridFilters.agSetColumnFilter:
                filterParams.suppressMiniFilter = !column.hasMiniFilter;
                filterParams.caseSensitive = false;
                break;

            case GridFilters.tagsFilterComponent:
                filterParams.suppressMiniFilter = suppressMiniFilter;
                break;

            case GridFilters.agDateColumnFilter:
                filterParams.suppressAndOrCondition = suppressAndOrCondition;
                filterParams.filterOptions = defaultFilterOptions ? defaultFilterOptions : GridValues.dateFilterOptions;
                filterParams.comparator = defaultComparatorFunc ? defaultComparatorFunc : FilterFunctions.dateComparator;
                filterParams.clearButton = true;
                filterParams.inRangeInclusive = true;
                filterParams.minValidYear = 1900;
                filterParams.maxValidYear = 3000;

                // Custom filter option relative to current date
                filterParams.filterOptions.push(
                    {
                        displayKey: 'previousSevenDays',
                        displayName: 'Previous 7 days',
                        numberOfInputs: 0,
                        predicate: (filterValue, cellValue) => {
                            let cellDateTime:number = moment(cellValue).valueOf();

                            let filterStartTime:number = moment().utc().startOf('day').subtract(7, 'days').valueOf();
                            let filterEndTime:number = moment().utc().endOf('day').valueOf();
                            
                            return (cellDateTime >= filterStartTime && cellDateTime <= filterEndTime);
                        }
                    },
                    {
                        displayKey: 'nextSevenDays',
                        displayName: 'Next 7 days',
                        numberOfInputs: 0,
                        predicate: (filterValue, cellValue) => {
                            let cellDateTime:number = moment(cellValue).valueOf();
                            let filterStartTime:number = moment().utc().startOf('day').valueOf();
                            let filterEndTime:number = moment().utc().endOf('day').add(7, 'days').valueOf();
                            
                            return (cellDateTime >= filterStartTime && cellDateTime <= filterEndTime);
                        }
                    },
                    {
                        displayKey: 'previousFourteenDays',
                        displayName: 'Previous 14 days',
                        numberOfInputs: 0,
                        predicate: (filterValue, cellValue) => {
                            let cellDateTime:number = moment(cellValue).valueOf();

                            let filterStartTime:number = moment().utc().startOf('day').subtract(14, 'days').valueOf();
                            let filterEndTime:number = moment().utc().endOf('day').valueOf();
                            
                            return (cellDateTime >= filterStartTime && cellDateTime <= filterEndTime);
                        }
                    },
                    {
                        displayKey: 'nextFourteenDays',
                        displayName: 'Next 14 days',
                        numberOfInputs: 0,
                        predicate: (filterValue, cellValue) => {
                            let cellDateTime:number = moment(cellValue).valueOf();
                            let filterStartTime:number = moment().utc().startOf('day').valueOf();
                            let filterEndTime:number = moment().utc().endOf('day').add(14, 'days').valueOf();
                            
                            return (cellDateTime >= filterStartTime && cellDateTime <= filterEndTime);
                        }
                    }
                );
                break;

            case GridFilters.agNumberColumnFilter:
                filterParams.suppressAndOrCondition = suppressAndOrCondition;
                filterParams.filterOptions = defaultFilterOptions ? defaultFilterOptions : GridValues.numberFilterOptions;
                filterParams.clearButton = true;
                break;
            case GridFilters.agTextColumnFilter:
                filterParams.suppressAndOrCondition = suppressAndOrCondition;
                filterParams.trimInput = true;
                filterParams.filterOptions = ['contains'];
                filterParams.debounceMs = 1000;
                filterParams.clearButton = true;


                break;
            case "agMultiColumnFilter":
                filterParams.filters =
                    [
                        {
                            filter: GridFilters.textFilterComponent,
                            filterParams: {
                                suppressAndOrCondition: true,
                                filterOptions: null,
                                suppressMiniFilter: true
                            },
                        },
                        { filter: 'agSetColumnFilter' },
                    ]
                break;
            default:
                break;
        }
        return filterParams
    }

    getCellRenderer(column: GridColumn): { new(): ICellRendererComp; } | ICellRendererFunc | string {
        let cellRenderer: ((params: any) => HTMLElement | string) | string;

        switch (column.type) {
            case 'check':
                cellRenderer = (params) => {
                    return params.data[column.field] ? GridRenderers.checkMarkHTML : '';
                }
                break;

            case 'date':
                cellRenderer = (data: any) => {
                    if (column.cellRenderer == 'case') {
                        return data && data.data.case && data.data.case[column.field] ? this._formatTimeZone.transform(data.data.case[column.field]) : '';
                    }

                    if (column.cellRenderer == 'transactedDate') {
                        return data && data.value && data.value != "0001-01-01T00:00:00Z" ? moment.utc(data.value).format('DD-MMM') : '';
                    }

                    if (column.cellRenderer == 'expectedStartDt' || column.cellRenderer == 'latestStartDt' || column.cellRenderer=="latestRegistrationDate" ) {
                        return data && data.value ? moment.utc(data.value).format('DD-MMM-YYYY') : '';
                    }
                    if(column.cellRenderer=="bidDate"){
                        return data && data.value ? moment(data.value).format('DD-MMM-YYYY') : '';

                    }
                    return data && data.value ? this._formatTimeZone.transform(data.value) : '';
                };
                break;

            case 'datetime':
                cellRenderer = (data: any) => {
                    return data && data.value ? this._formatTimeZone.transform(data.value, true) : '';
                };
                break;

            case 'tag':
                cellRenderer = GridRenderers.tagsRendererComponent;
                break;

            case 'icon':
                cellRenderer = GridRenderers.iconRendererComponent;
                break;
            case 'dealPermission':
                cellRenderer = GridRenderers.grantPermissionComponent;
                break;
            case 'copyLink':
                cellRenderer = GridRenderers.copyLinkIconComponent;
                break;
            case 'lock':
                cellRenderer = GridRenderers.dealIconRendererComponent;
                break;
            case 'text':
                cellRenderer = (params) => {
                    if (column.isMasked && params.data.isMasked) {
                        return `<div style="background-color: #bdbdbd;height: 70%;width: 100%;margin-top: 5px;"></div>`
                    } else {
                        let gridCellRenderer = new GridCellRenderer(this.coreService);
                        return gridCellRenderer.getCellRenderer(column, params);
                    }
                }
                break;

            default:
                break;
        }
        return cellRenderer;
    }

    getCheckBoxSelection(): ((params: any) => boolean) {
        let isCheckboxSelectionEnabled: ((params: any) => boolean) | boolean;

        isCheckboxSelectionEnabled = (params) => {
            switch (params.data.rt) {
                case RegistrationType.Investments:
                    return false;

                case RegistrationType.Archived_Investments:
                    return false;

                case RegistrationType.Prohibitions:
                    return false;

                case RegistrationType.Archived_Prohibitions:
                    return false;

                case RegistrationType.Registration:
                    return true;

                case RegistrationType.Archived_Registrations:
                    return true;
                default:
                    return false;
            }

        }
        return isCheckboxSelectionEnabled;
    }

    getEditable(column): ((params: any) => boolean) {
        let isCellEditable: ((params: any) => boolean) | boolean = false;
        isCellEditable = (params) => {
            if (column.isEditable && params.data.isMasked) {
                return true;
            } else {
                if (params.data.rt == RegistrationType.Registration && column.isEditable) {
                    return true;
                } else if (params.data.rt == RegistrationType.Archived_Registrations && column.isEditable) {
                    return true;
                } else {
                    return false
                }
            }
        }
        return isCellEditable;
    }
}
