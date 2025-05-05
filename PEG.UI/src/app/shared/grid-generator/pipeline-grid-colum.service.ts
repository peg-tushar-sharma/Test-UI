import { Injectable } from "@angular/core";
import {
    ColDef,
    Column,
    ICellRendererComp,
    ICellRendererFunc,
    IRowDragItem,
    SuppressHeaderKeyboardEventParams
} from "ag-grid-community";
import { GridColumn, ColumnType } from "../interfaces/models";
import { GridRenderers, fontIcons, GridValues } from "./grid-constants";
import { FormatTimeZone } from "../../shared/formatTimeZone.pipe";
import { GridService } from "./grid-column.service";
import * as moment from "moment";
import { GlobalService } from "./../../global/global.service";
import { GridFilterValue } from "./grid-filter-value";
import { CoreService } from "../../core/core.service";
import { PipelineGridCellRenderer } from "./pipeline-grid-cell-renderer";
import { PipelineGridTooltipRenderer } from "./pipeline-grid-tooltip-renderer";
import { CommonMethods } from "../common/common-methods";
import { type } from "os";
import { parse } from "path";
import { GridKeyCreatorValue } from "./grid-key-creator";
import { Opportunity_Stage } from "../enums/opportunity-stage";
import { Priority } from "../interfaces/priority";
import { OpsLikelihood } from "../interfaces/opsLikelihood";
import { FilterType } from "../enums/FilterType";

@Injectable()
export class PipelineGridColumnService extends GridService {
    stage;
    oppNameFields = [];
    dateFormat: string = 'DD-MMM';
    priorities: Priority[];
    opsLikelihood: OpsLikelihood[];
    opsLikelihoodFilter: OpsLikelihood[];
    constructor(globalService: GlobalService, public coreService: CoreService) {
        super(coreService, globalService);
        globalService.getRegistrationStage().subscribe((res) => {
            this.stage = res;
        });
        globalService.getPriority().subscribe(res => {
            this.priorities = res;
        })
        globalService.getOpsLikelihood().subscribe(res => {
            this.opsLikelihood = res;

            this.opsLikelihoodFilter = JSON.parse(JSON.stringify(res));
            this.opsLikelihoodFilter.unshift({ opsLikelihoodId: 0, opsLikelihoodName: null, color: "white", sortOrder: 100 });

        })

    }

    public get getDefaultColumnDefinition(): ColDef {
        return <ColDef>{
            sortable: true,
            filter: true,
            resizable: true
        };
    }
    public getColumnDefinitions(columns: GridColumn[]): ColDef[] {
       
        let columnDefs: ColDef[] = [];
        columnDefs = columns.map(this.generatePipelineColumnDefinition.bind(this));
        return columnDefs;
    }

    public setOppNameFields(oppNameFields) {
        this.oppNameFields = oppNameFields;
    }

    public generatePipelineColumnDefinition(column: GridColumn): ColDef {
        this._formatTimeZone = new FormatTimeZone();
        let columnDef: ColDef = {};
        //Set custom icons
        //  columnDef.icons= {
        //     menu: '<i class="fa fa-filter" style="color:black" />',
        //     sortAscending: '<i class="fa fa-sort-up" style="font-size: 16px;color: #4cb6fb;"/>',
        //     sortDescending: '<i class="fa fa-sort-down" style="font-size: 16px;color: #4cb6fb;"/>',
        //   }

        columnDef.field = column.field;
        columnDef.colId = column.columnId.toString();
        columnDef.suppressHeaderKeyboardEvent = (params: SuppressHeaderKeyboardEventParams) => false;
        columnDef.valueGetter = function (params) {
            if (params.data) {
                return GridFilterValue.getFilterValue(column, params, columnDef);
            }
        };
        columnDef.headerName = column.headerName;

        // Display partner edit flag styling for eligible cells
        columnDef.cellClassRules = {
            "partner-edit-flagged": params => {
                // Only flag opportunities in active/upcoming filter while that filter is selected
                if (!CommonMethods.PassesPipelineFilter(FilterType.ActiveUpcomingNewOpportunities, params.data)
                    || !this.coreService.selectedFilter.includes(4)) {
                    return false;
                }

                if (column.field == "oppName") {
                    return params?.data?.isPartnerEditFlagged;
                } else {
                    return params?.data?.partnerEdit?.findIndex(
                        edit => edit.field == column.field
                    ) > -1;
                }
            }
        }

        if (column.isRowDrag == true) {
            columnDef.dndSource = function (params) {
                let showIcon: boolean;
                if (params.data.opportunityStage.opportunityStageId == Opportunity_Stage.Backlog) {
                    showIcon = true;
                }
                if (params.data.poId.length == 36 || params.node.group) {
                    showIcon = false;
                }
                return showIcon;
            };

            columnDef.dndSourceOnRowDrag = function (params) {
                // create the data that we want to drag
                var rowNode = params.rowNode;
                var event = params.dragEvent;
                var jsonObject = {
                    rowId: rowNode.data.poId,
                    data: rowNode.data,
                    selected: rowNode.isSelected()
                };
                var jsonData = JSON.stringify(jsonObject);
                event.dataTransfer!.setData("application/json", jsonData);
                if (event) {
                    if (event?.type && event?.type == "dragstart") {
                        Array.from(document.getElementsByClassName("groupRowHeader")).forEach((element) => {
                            element.classList.remove("elementHide");
                            element.classList.add("show");
                        });

                        Array.from(document.querySelectorAll(".blankPlaceholder.lateral-opportunity-drag")).forEach((element) => {
                            element.classList.remove("show");
                            element.classList.add("elementHide");
                        });

                        Array.from(document.querySelectorAll(".placeholder, .blankPlaceholder")).forEach((element) => {
                            element.classList.add("placeholderBorder");
                        });

                        event.target.addEventListener("dragend", function (params) {
                            Array.from(document.getElementsByClassName("groupRowHeader")).forEach((element) => {
                                element.classList.remove("show");
                                element.classList.add("elementHide");
                            });

                            Array.from(document.querySelectorAll(".blankPlaceholder.lateral-opportunity-drag")).forEach((element) => {
                                element.classList.remove("elementHide");
                                element.classList.add("show");
                            });

                            Array.from(document.querySelectorAll(".placeholder, .blankPlaceholder")).forEach((element) => {
                                element.classList.remove("placeholderBorder");
                            });

                            event.preventDefault();
                            event.stopPropagation();
                        });
                    }
                }
            };
            columnDef.rowDragText = function (params: IRowDragItem) {
                // keep double equals here because data can be a string or number
                let oppName = params.rowNode.data.oppName;
                return oppName;
            };
        }
        columnDef.hide = column.isHide;

        if (!column.isEditable) {
            columnDef.cellStyle = (params: any) => {
                return { color: "#979797" };
            };
        }

        if (column.tooltipComponent && column.tooltipComponent != "") {
            columnDef.tooltipComponent = column.tooltipComponent;
            // columnDef.tooltipField = column.field;

            columnDef.tooltipValueGetter = function (params) {
                if (!column.isRowGroup && params.data) {
                    let gridCellRenderer = new PipelineGridTooltipRenderer();
                    let tooltip = gridCellRenderer.getTooltipRenderer(params.colDef, params);
                    return tooltip;
                }
            };
        }
        columnDef.filter = column.isFilterable;
        columnDef.suppressMenu = !column.isFilterable;
        columnDef.sort = column.sortType;
        columnDef.sortIndex = column.sortIndex;
        columnDef.cellEditor = column.cellEditor;
        columnDef.enableRowGroup = true;

        if (column.field == "preference") {
            columnDef.cellEditorParams = this.getCellEditorParams(column);
        }

        if (column.field == "processInfo") {
            columnDef.cellEditorParams = this.getCellEditorParams(column);
        }


        if (columnDef.cellEditor == 'agLargeTextCellEditor') {
            columnDef.cellEditorPopup = true;
        }

        if (column.field == "comments") {
            columnDef.cellEditor = "agLargeTextCellEditor";
            columnDef.cellEditorParams = this.getCellEditorParams(column);
        }
        if (column.field == "discount") {
            columnDef.cellEditor = "agLargeTextCellEditor";
            columnDef.cellEditorParams = this.getCellEditorParams(column);
        }

        if (column.cellRenderer) {
            columnDef.cellRenderer = this.getPipelineCellRenderer(column.type, column.cellRenderer, column);
        }

        if (column.cellEditor == "agRichSelectCellEditor") {
            if (column.field == "stage") {
                columnDef.keyCreator = (stage) => {
                    return stage.hasOwnProperty("stageTypeName") ? stage["stageTypeName"] : stage.value;
                };
                columnDef.cellEditorParams = this.getCellEditorParams(column);
            }
        }

        columnDef.minWidth = 30;
        columnDef.width = column.maxWidth;

        if (columnDef.headerName.toLowerCase().endsWith("dt")) {
            columnDef.cellClass = "dateFormat";
        }

        if (column.isFilterable) {
            columnDef.filter = column.filter;
            columnDef.filterParams = this.getFilterParams(column);
            if (columnDef.field == "expectedStart") {
                columnDef.filterParams.includeBlanksInGreaterThan = true;
            }
            if (columnDef.field == "opsLikelihood") {
                columnDef.filterParams = {
                    values: this.opsLikelihoodFilter.map(x => x.opsLikelihoodName),
                    caseSensitive: true
                }
            }
            columnDef.headerComponentParams = { menuIcon: fontIcons.filterIcon };
            if (
                columnDef.filterParams &&
                [
                    "isRetainer",
                    "isMBPartner",
                    "isSVPHelp",
                    "isOVPHelp",
                    "stageStatus",
                    "officeToBeStaffed",
                    "clientCommitment",
                    "legalStatus",
                    "clientName",
                    "opsLikelihood"
                ].includes(columnDef.field)
            ) {
                columnDef.filterParams.caseSensitive = true;
            }

            // Workaround for bug where blank set filter does not return results. Column must be case sensitive for blank filter to work.
            if (columnDef.filter == "agSetColumnFilter") {
                columnDef.filterParams.caseSensitive = true;
            }
        }

        if (!column.isQuickFilter) {
            columnDef.getQuickFilterText = () => null;
        }

        //making only pipeline opportunity editable need to update the method and make it more generic.


        columnDef.editable = column.isEditable;



        if (columnDef.headerName == "Select") {
            columnDef.checkboxSelection = this.getCheckBoxSelection();
        }

        if (columnDef.field == "oppName") {
            columnDef.cellStyle = (params: any) => {
                return {
                    backgroundColor: params.data?.opsLikelihood?.color,
                    color: params.data?.isFlagged ? "red" : "black",
                    "padding-left":
                        params.data.opportunityStage.opportunityStageId == Opportunity_Stage.Backlog ? "0px" : "30px"
                };
            };
        }

        if (columnDef.field == "groupName") {
            columnDef.hide = true;
        }
        if (column.isRowGroup) {
            columnDef.rowGroupIndex = column.rowGroupIndex;
            columnDef.sortable = false;
            columnDef.enableRowGroup = column.isRowGroup;
            columnDef.rowGroup = column.isRowGroup;

            columnDef.keyCreator = function (params) {
                var key = GridKeyCreatorValue.getKeyValue(params, columnDef);
                return key;
            };

            columnDef.valueGetter = function (params) {
                var key = GridKeyCreatorValue.getKeyValue(params, columnDef);
                return key;
            };
        }

        columnDef.keyCreator = function (params) {
            var key = GridKeyCreatorValue.getKeyValue(params, columnDef);
            return key;
        };

        if (columnDef.field == "expectedStart" || columnDef.field == "weekStart") {
            columnDef.comparator = function (date1, date2, node1, node2, isDesc) {
                let returnVal = 0;

                // Row sorting
                if ((!date1 && !date2) || new Date(date1).getTime() == new Date(date2).getTime()) {
                    returnVal = 0;
                } else if (!date1) {
                    returnVal = isDesc ? -1 : 1;
                } else if (!date2) {
                    returnVal = isDesc ? 1 : -1;
                } else {
                    returnVal = new Date(date1).getTime() > new Date(date2).getTime() ? 1 : -1;
                }

                // Group row sorting
                if (node1?.key && node2?.key) {
                    returnVal = new Date(node1.key).getTime() > new Date(node2.key).getTime() ? 1 : -1;
                }

                return returnVal;
            };
        }
        if (columnDef.field == "customPriority") {
            columnDef.comparator = (value1, value2) => {
                let sortOrder1: number = 0;
                let sortOrder2: number = 0;

                if (value1 != '') {
                    let filter1 = this.priorities.filter(p => p.priorityName == value1);

                    if (filter1.length > 0) {
                        sortOrder1 = filter1[0].sortOrder;
                    }
                } else {
                    sortOrder1 = 100; // Sort blanks last
                }

                if (value2 != '') {
                    let filter2 = this.priorities.filter(p => p.priorityName == value2);

                    if (filter2.length > 0) {
                        sortOrder2 = filter2[0].sortOrder;
                    }
                } else {
                    sortOrder2 = 100; // Sort blanks last
                }

                if ((!sortOrder1 && !sortOrder2) || sortOrder1 == sortOrder2) {
                    return 0;
                }

                return sortOrder1 > sortOrder2 ? -1 : 1;
            };
        }


        if (columnDef.field == "likelihood") {
            columnDef.comparator = (value1, value2) => {
                let sortOrder1: number = parseInt(value1);
                let sortOrder2: number = parseInt(value2);

                if (value1 == "<50") {
                    sortOrder1 = 49;
                } else if (value1 == "" || value1 == null) {
                    sortOrder1 = 0;
                }

                if (value2 == "<50") {
                    sortOrder2 = 49;
                } else if (value2 == "" || value2 == null) {
                    sortOrder2 = 0;
                }


                return sortOrder1 > sortOrder2 ? 1 : -1;
            };
        }

        if (columnDef.field == "opsLikelihood") {
            columnDef.comparator = (value1, value2, node1, node2, isDesc) => {

                let sortOrder1: number = 0;
                let sortOrder2: number = 0;
                let res: number = 0;
                let isGroupSorting: boolean = false

                //Row group sorting
                if (node1?.key && node2?.key) {
                    isGroupSorting = true
                }

                if (value1) {
                    let filter1 = this.opsLikelihood.filter((p) => p.opsLikelihoodName == value1);

                    if (filter1.length > 0) {
                        sortOrder1 = filter1[0].sortOrder;
                    }
                }
                else if (node1?.key) {
                    let filter1 = this.opsLikelihood.filter((p) => p.opsLikelihoodName == node1?.key);

                    if (filter1.length > 0) {
                        sortOrder1 = filter1[0].sortOrder;
                    }
                }
                else {
                    sortOrder1 = 100; // Sort blanks last
                }

                if (value2) {
                    let filter2 = this.opsLikelihood.filter((p) => p.opsLikelihoodName == value2);

                    if (filter2.length > 0) {
                        sortOrder2 = filter2[0].sortOrder;
                    }
                }
                else if (node2?.key) {
                    let filter2 = this.opsLikelihood.filter((p) => p.opsLikelihoodName == node2?.key);

                    if (filter2.length > 0) {
                        sortOrder2 = filter2[0].sortOrder;
                    }
                } else {
                    sortOrder2 = 100; // Sort blanks last
                }

                res = sortOrder1 > sortOrder2 ? -1 : 1;

                if ((!sortOrder1 && !sortOrder2) || sortOrder1 == sortOrder2) {
                    res = 0;
                }

                return res;
            };
        }

        if (columnDef.field == "targetName") {
            columnDef.comparator = function (value1, value2, node1, node2) {
                if (value1 == value2) {
                    if (node1?.data?.pipelineId == 0 && node2?.data?.pipelineId != 0) {
                        return -1;
                    } else if (node2?.data?.pipelineId == 0 && node1?.data?.pipelineId != 0) {
                        return 0;
                    } else {
                        return 0;
                    }
                } else {
                    return value1 > value2 ? 1 : -1;
                }
            };
        }

        return columnDef;
    }

    getCellEditorParams(column: GridColumn) {
        switch (column.field) {
            case "stage":
                return {
                    cellRenderer: function (params) {
                        if (params.value) return params.value.stageTypeName;
                    },
                    values: this.stage
                };
            case "preference":
                return {
                    maxLength: "2000"
                };

            case "processInfo":
                return {
                    maxLength: "800"
                };

            case "comments":
                return {
                    maxLength: "2000"
                };
            case "discount":
                return {
                    maxLength: "300"
                };

            default:
                break;
        }
    }

    getPipelineCellRenderer(
        type: ColumnType,
        customRenderer,
        column
    ): { new(): ICellRendererComp } | ICellRendererFunc | string {
        let cellRenderer: ((params: any) => HTMLElement | string) | string;
        switch (type) {
            case "check":
                cellRenderer = (params) => {
                    return params.data.iomp ? GridRenderers.checkMarkHTML : "";
                };
                break;

            case "date":
                cellRenderer = (params: any) => {
                    if (params.data) {
                        if (customRenderer == "expectedStart") {
                            var key = undefined;
                            if (
                                params.data &&
                                params.data.expectedStart &&
                                params.data.expectedStart.expectedStartDate &&
                                params.data.expectedStart.expectedStartDate != "0001-01-01T00:00:00Z"
                            ) {
                                let date = params.data.expectedStart.expectedStartDate.split("T")[0];
                                key = moment(date).format(this.dateFormat);
                                if (params.data.expectedStart?.expectedStartDateNote != undefined) {
                                    return `<div class="d-flex align-items-center" style="gap: 4px"><i class="fa fa-sticky-note" style="color: rgb(51 78 231);"></i>${key}</div>`

                                }
                                else {
                                    return `<div class="d-flex align-items-center" style="margin-left:13px;" >${key}</div>`;
                                }

                            }
                            else {
                                if (params.data.expectedStart?.expectedStartDateNote != undefined) {
                                    return `<div class="d-flex align-items-center" style="padding-top:5px"> <i class="fa fa-sticky-note" style="color: rgb(51 78 231);"></i></div>`

                                }
                                else {
                                    return key;
                                }



                            }

                        } else if (params.colDef.field == "latestStartDate") {
                            if (params?.data?.latestStartDate) {
                                let uiDate = moment(params.data.latestStartDate.split("T")[0]).format(this.dateFormat);
                                return uiDate;
                            }
                        } else if (params.colDef.field == "caseStartDate") {
                            if (params.data?.case?.caseStartDate) {
                                let uiDate = moment(
                                    this._formatTimeZone.transform(params.data?.case?.caseStartDate)
                                ).format(this.dateFormat);
                                return uiDate;
                            }
                        } else if (params.colDef.field == "caseEndDate") {
                            if (params.data?.case?.caseEndDate) {
                                let uiDate = moment(
                                    this._formatTimeZone.transform(params.data?.case?.caseEndDate)
                                ).format(this.dateFormat);
                                return uiDate;
                            }
                        } else if (params.colDef.field == "submissionDate") {
                            if (params.data?.submissionDate) {
                                let uiDate = moment(this._formatTimeZone.transform(params.data?.submissionDate)).format(this.dateFormat);
                                return uiDate;
                            }
                        } else if (params.colDef.field == "pipelineSubmittedDate") {
                            if (params.data?.pipelineInfoRequestedDate) {
                                let uiDate = moment.utc(params.data?.pipelineInfoRequestedDate).format(this.dateFormat);
                                return uiDate;
                            } else {
                                return "";
                            }

                        } else if (params.colDef.field == "weekStart") {
                            if (params.data.expectedStart) {
                                var key = undefined;
                                if (
                                    params.data &&
                                    params.data.expectedStart &&
                                    params.data.expectedStart.expectedStartDate &&
                                    params.data.expectedStart.expectedStartDate != "0001-01-01T00:00:00Z"
                                ) {
                                    key = CommonMethods.getWeekStart(params.data.expectedStart.expectedStartDate as Date, 'DD-MMM');

                                    // key = moment.utc(
                                    //     CommonMethods.getWeekStart(params.data.expectedStart.expectedStartDate)
                                    // ).format(this.dateFormat);
                                }
                                return key;
                            }
                        } else {
                            if (params.value) {
                                let dateparsed = this._formatTimeZone.transform(params.value, true);
                                let UiDate = params && params.value ? moment(dateparsed).format(this.dateFormat) : "";
                                return UiDate;
                            }
                        }
                    }
                };
                break;
            case "datetime":
                cellRenderer = (data: any) => {
                    if (data.value) {
                        let dateparsed = this._formatTimeZone.transform(data.value, true);
                        let UiDate = data && data.value ? moment(dateparsed).format(this.dateFormat) : "";
                        return UiDate;
                    }
                };
                break;
            case "tag":
                cellRenderer = GridRenderers.tagsRendererComponent;
                break;

            case "icon":
                cellRenderer = GridRenderers.iconRendererComponent;
                break;

            case "text":
                if (
                    customRenderer &&
                    (customRenderer == "LocationCellRendererComponent" ||
                        (column.isEditable == false && customRenderer == "clientCellRenderer") ||
                        customRenderer == "targetTypeCellRenderer" ||
                        customRenderer == "RecordCellComponent" ||
                        customRenderer == "WorkPhaseCellRendererComponent" ||
                        customRenderer == "OpsLeadCellRendererComponent")
                ) {
                    cellRenderer = customRenderer;
                } else {
                    cellRenderer = (params) => {
                        if (params.data) {
                            if (column.isMasked && params.data.isMasked) {
                                return `<div style="background-color: #bdbdbd;height: 70%;width: 100%;margin-top: 5px;"></div>`;
                            } else {
                                let gridCellRenderer = new PipelineGridCellRenderer(this.coreService);
                                return gridCellRenderer.getCellRenderer(column, params, this.oppNameFields);
                            }
                        }
                    };
                }
                break;

            case "stage":
                cellRenderer = (params) => {
                    return params.value && params.value.hasOwnProperty("stageTypeName")
                        ? params.value.stageTypeName
                        : params.value;
                };
                break;

            default:
                break;
        }
        return cellRenderer;
    }
}
