import * as moment from 'moment';
import { ColDef, ColumnApi, ICellRendererComp, ICellRendererFunc, ICellRendererParams } from 'ag-grid-community';
import { CommonMethods } from '../common/common-methods';
import { CoreService } from '../../core/core.service';
import { fontIcons } from './grid-constants';
import { GlobalService } from '../../global/global.service';
import { GridColumn } from '../interfaces/models';
import { GridService } from './grid-column.service';
import { Injectable } from '@angular/core';
import { OppType } from '../enums/opp-type';
import { PartnerDashboardValueGetter } from './partner-dashboard-value-getter';
import { RegistrationStageEnum } from '../enums/registration-stage.enum';
import { RegistrationStatus } from '../enums/registration-status.enum';


@Injectable({ providedIn: 'any' })
export class PartnerDashboardGridColumnService extends GridService {
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

        columnDef.valueGetter = function (params) {
            if (params.data) {
                return PartnerDashboardValueGetter.getValue(column, params);
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
        columnDef.cellStyle = {
            color: "#121212",
            "font-family": "'Graphik', sans-serif",
            "font-size": "12px"
        }

        // set min-width for client
        if (columnDef.field === "client") {
            columnDef.minWidth = 140;
        } else {
            columnDef.minWidth = 80;
        }

        // remove "(weeks)" from "duration (weeks)" column
        if (columnDef.field === "duration") {
            columnDef.headerName = "Duration";
            columnDef.headerTooltip = "Duration"
        }

        columnDef.width = column.maxWidth;

        if (columnDef.field === "client" || columnDef.field === "targetName") {
            if (window.innerWidth <= 768) {
                columnDef.pinned = true;
            } else {
                columnDef.pinned = false;
            }
        }

        return columnDef;
    }

    getCellRenderer(column: GridColumn): string | ICellRendererFunc | (new () => ICellRendererComp) {
        let windowWidth = window.innerWidth;
        let cellRenderer: ((params: any) => HTMLElement | string) | string;

        let buttonCssText = "font-size: 12px; font-weight: 500; font-family: 'Graphik', sans-serif; color: #284ce0";
        let buttonHref = "javascript:void(0)";

        switch (column.cellRenderer) {
            case "dashClientRenderer":
                cellRenderer = (params) => {
                    return params.data.client ? params.data.client.clientName : "";
                }

                break;

            case "dashTargetRenderer":
                cellRenderer = (params) => {
                    return params.data.target ? params.data.target.targetName : "";
                }

                break;

            case "dashIndustryRenderer":
                cellRenderer = (params) => {
                    return params.data.industry ? params.data.industry.abbreviation ? params.data.industry.abbreviation : params.data.industry.industryName : "";
                }

                break;
            case "dashSubmissionDateRenderer":
                cellRenderer = (params) => {
                    return params.data.submissionDate ? moment(params.data.submissionDate).format('DD-MMM'): "";
                }

                break;
            case "dashWorkTypeRenderer":
                cellRenderer = (params) => {
                    return params.data.workType ? params.data.workType.workTypeName : "";
                }

                break;

            case "dashRegistrationStatusRenderer":
                cellRenderer = (params) => {
                    let status = params.data.status ? params.data.status.statusTypeName : "";
                    let registrationStatusId = params?.data?.status ? params.data.status.registrationStatusId : "";

                    const colorToUse = (registrationStatusId == RegistrationStatus.Cleared ||
                        registrationStatusId == RegistrationStatus.ClearanceNotRequired) ? "#8ee8b4" : "#f9b66b";

                    const element = document.createElement("div");
                    element.style.cssText = "display: flex; align-items: center; height: 100%";

                    if (status != null && status != "") {
                        element.innerHTML = windowWidth <= 768 ? `<i class="fas fa-circle mr-1" style="color: ${colorToUse}; font-size: 10px"></i>` : `
                            <i class="fas fa-circle mr-1" style="color: ${colorToUse}; font-size: 10px"></i>
                            <span style="overflow: hidden; text-overflow: ellipsis">${status}</span>
                            `;
                    } else {
                        element.innerHTML = `<span style="overflow: hidden; text-overflow: ellipsis">${status}</span>`;
                    }


                    return element;
                }

                break;

            case "dashExpectedStartDateRenderer":
                cellRenderer = (params) => {
                    return params.data.expectedStartDate ? moment(params.data.expectedStartDate).format('DD-MMM') : "";
                }

                break;

            case "dashDurationRenderer":
                cellRenderer = (params) => {
                    if (params?.data?.duration) {
                        let stringValue = params.data.duration.toString() as string
                        if (stringValue.includes('.') && stringValue.charAt(stringValue.length - 1) == '0') {
                            return stringValue.substring(0, stringValue.length - 2);
                        } else {
                            return params.data.duration;
                        }
                    } else {
                        return ""
                    }
                }

                break;

            case "dashRegistrationStageRenderer":
                cellRenderer = (params: ICellRendererParams) => {
                    let stage: string = params.data.stage ? params.data.stage.stageTypeName : "";
                    let stageId: number = params.data.stage.registrationStageId;


                    // change button style based on stage == work started or work completed
                    let colorToUse = stageId == RegistrationStageEnum.WorkCompleted || stageId == RegistrationStageEnum.WorkStarted ? "#616568" : "#284ce0";
                    let cursorTouse = stageId == RegistrationStageEnum.WorkCompleted || stageId == RegistrationStageEnum.WorkStarted ? "default" : "pointer";
                    let opacityToUse = stageId === RegistrationStageEnum.WorkCompleted || stageId === RegistrationStageEnum.WorkStarted ? "0.5" : "1";

                    const buttonElement = document.createElement("a");
                    buttonElement.style.cssText = buttonCssText;
                    buttonElement.href = buttonHref;
                    buttonElement.innerHTML = stage;
                    buttonElement.style.color = colorToUse;
                    buttonElement.style.cursor = cursorTouse;
                    buttonElement.style.opacity = opacityToUse;
                    return buttonElement;
                }
                break;

            case "resourceRequestRenderer":
                cellRenderer = (params) => {
                    const buttonElement = document.createElement("a");
                    buttonElement.style.cssText = buttonCssText;
                    buttonElement.href = buttonHref;

                    if (params.data?.isPipelineInfoRequested) {
                        buttonElement.innerHTML = "Submitted";
                        return buttonElement;
                    }
                    else {
                        buttonElement.innerHTML = windowWidth <= 768 ? '<i class="far fa-plus-square">' : "Request";
                        return buttonElement;
                    }
                }

                break;

            case "expertInfoRenderer":
                cellRenderer = (params) => {
                    const buttonElement = document.createElement("a");
                    buttonElement.style.cssText = buttonCssText;
                    buttonElement.href = buttonHref;

                    if (params.data?.opportunityTypeId == OppType.Registered || params.data?.opportunityTypeId == OppType.Duplicate) {

                        if (params.data?.isExpertInfoRequested) {
                            buttonElement.innerHTML = "Submitted";
                            return buttonElement;
                        }
                        else {
                            buttonElement.innerHTML = windowWidth <= 768 ? '<i class="fas fa-user-plus">' : "Request";
                            return buttonElement;
                        }
                    }
                }
                break;         
            case "dashboardSharingRenderer":
                cellRenderer = (params) => {
                    const buttonElement = document.createElement("a");
                    buttonElement.style.cssText = buttonCssText;
                    buttonElement.href = buttonHref;

                    buttonElement.innerHTML = windowWidth <= 768 ? '<i class="fas fa-edit">' : "Edit Sharing";
                    return buttonElement;
                }

                break;
                case "partnerDashCaseCodeRenderer":
                    cellRenderer = (params) => {
                        const buttonElement = document.createElement("a");
                        buttonElement.style.cssText = buttonCssText;
                        buttonElement.href = buttonHref;
    
    
                        if (params.data?.regionId ==2 || params.data?.regionId ==3) {
                            if(params.data.caseRequestId>0)
                            {                   
                                buttonElement.innerHTML = "Submitted";
                            }
                            else
                            {
                                buttonElement.innerHTML = "Case Request";
                            }
                           
                            return buttonElement;
                        } else  {
                            buttonElement.innerHTML = '';
                            return buttonElement;
                        } 
                    }
                    break;
            default:
                cellRenderer = column.cellRenderer;

                break;
        }
        return cellRenderer;

    }
}
