import * as moment from "moment";
import { GridColumn } from "../interfaces/grid-column.interface";

export class PartnerDashboardValueGetter {
    public static getValue(column: GridColumn, params) {

        switch (column.field) {
            case "client":
                return params.data.client?.clientName;
            case "targetName":
                return params.data.target?.targetName;
            case "industry":
                return params.data.industry?.abbreviation ? params.data.industry?.abbreviation : params.data.industry?.industryName;
            case "workType":
                return params.data.workType?.workTypeName;
            case "registrationStatus":
                return params.data.status?.statusTypeName;
            case "registrationStage":
                return params.data.stage?.stageTypeName;
            case "resourceRequest":
                return params.data?.isPipelineInfoRequested ? 'Submitted' : 'Request'
            case "expertInfo":
                return params.data?.isExpertInfoRequested ? 'Submitted' : 'Request'
            default:
                return params.data[column.field];

        }
    }

}

