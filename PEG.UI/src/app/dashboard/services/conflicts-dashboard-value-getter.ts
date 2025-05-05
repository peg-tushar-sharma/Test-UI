import { retry } from "rxjs/operators";
import { GridColumn } from "../../shared/interfaces/grid-column.interface";

export class ConflictsDashboardValueGetter {
    public static getValue(column: GridColumn, params) {

        switch (column.field) {
            case "cdTargetName":
                return params?.data?.target? params?.data?.target?.targetName.trim(): "";
            case "cdRegistrationId":
                return params?.data?.registrationId ?? "";
            case "cdTargetOwner":
                if (params?.data?.corporateRelationship) {
                    return params.data.corporateRelationship
                }else{
                    return "";
                }
                
            case "cdClientName":
                if (params?.data?.client) {
                    return params.data.client.clientName.trim();
                } else {
                    return "";
                }
            case "cdWorkTypeName":
                return params?.data?.workType?.workTypeName ?? "";
            case "cdStatusTypeName":
                return params.data.registrationStatus.statusTypeName ?? "";
            case "cdStageTypeName":
                return params.data.registrationStage.stageTypeName ?? "";

            case "cdSubmissionDate":
                return params.data.submissionDate ?? "";
            case "cdLastUpdated":
                return params.data.lastUpdated ?? "";
          
        }
    }

}

