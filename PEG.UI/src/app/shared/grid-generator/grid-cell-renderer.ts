import { DatePipe } from "@angular/common";
import * as moment from 'moment';
import { CoreService } from "../../core/core.service";
import { CommonMethods } from "../common/common-methods";
import { RoleType } from "../enums/role-type.enum";
import { GridRenderers } from "./grid-constants";

export class GridCellRenderer {
    public coreService: any;
    public isLegalUserorAdmin: boolean = false;

    constructor(coreService: CoreService) {
        this.coreService = coreService;
    }

    public getCellRenderer(column, params) {
        switch (column.cellRenderer) {
            case 'people':
                if (params.data[column.field]) {
                    let value = CommonMethods.getEmployeeNameList(params.data[column.field]);
                    return value.join('; ');
                }
                break;

            case 'status':
                if (params.data.stn) {
                    return params.data.stn.statusTypeName;
                }
                break;

            case 'mbStatus':
                if (params.data.mbStatus) {
                    return params.data.mbStatus.mbStatusName;
                }
                break;

            case 'stage':
                if (params.data.conflictApprovalTracker && params.data.conflictApprovalTracker.length > 0) {
                    this.isLegalUserorAdmin = this.coreService.loggedInUser.securityRoles.some(role => (role.id == RoleType.Legal || role.id == RoleType.PEGAdministrator || role.id == RoleType.TSGSupport));
                    if (params.data.conflictApprovalTracker.some(x => x.hasApproved == false && x.fieldName == "registrationStageId")) {
                        return params.value ? this.isLegalUserorAdmin ? `${params.value} <i class="ml-1 fas fa-clock icon-orange"></i>` : params.value : '';
                    }
                    else {
                        return params.value;
                    }
                } else {
                    return params.value;
                }
            case 'submittedby':
                if (params.data.sb) {
                    return CommonMethods.getEmployeeName(params.data.sb);
                }
                break;



            case 'client':
                if (params.data.cl) {
                    return params.data.cl.clientName;
                }
                break;
            case 'case':
                if (params.data.case) {
                    return params.data.case[column.field];
                }
                break;
            case 'clientName':
                if (params.data.client) {
                    return params.data.client.clientName;
                }

                break;
            case 'stageTypeName':
                if (params.data.stage) {
                    return params.data.stage.stageTypeName;
                }

                break;

            case 'priorityName':
                if (params.data.client) {
                    return params.data.client.clientPriorityName;
                }
                break;

            case 'dealLikelihood':
                if (params.data.likelihood && params.data.likelihood.likelihoodId > 0) {
                    return params.data.likelihood.label + '%';
                }
                break;

            case 'trackerExpectedStart':
                if (params.data.expectedStart) {
                    let expectedStart = '';
                    if (params.data.expectedStart.expectedStartDate) {

                        expectedStart = moment(params.data.expectedStart.expectedStartDate).format('DD-MMM-YYYY');
                    }
                    return expectedStart;
                }
                break;

            case 'sector':
                if (params?.data?.sectors && params?.data?.sectors.length > 0) {
                    return params?.data?.sectors.map((a) => a.sectorName).join(',');
                }
                break;

            case 'targetDescriptionDT':
                if (params.data.isMasked) {
                    return `<div style="background-color: #bdbdbd;height: 70%;width: 100%;margin-top: 5px;"></div>`
                } else {
                    return params.data.targetDescription;
                }
                break;

            case 'supportedWinningBidder':
                if (params?.data?.supportedWinningBidder) {
                    return params.data.supportedWinningBidder;
                }
                break;

            case 'isDealNews':
                if (params?.data?.isDealNews) {
                    return params.data.isDealNews;
                } else {
                    return "No";
                }
                break;
            case 'dealSellSideRenderer':
                if (params?.data?.sellSideStatus) {
                    return params?.data?.sellSideStatus?.sellSideStatusName
                }
                break;
            default:
                return column.splitChar && params.value ? params.value.join(column.splitChar) : params.value;
        }
    }
}