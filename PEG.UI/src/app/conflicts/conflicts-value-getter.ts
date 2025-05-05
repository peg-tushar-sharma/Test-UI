import { retry } from "rxjs/operators";
import { GridColumn } from "../shared/interfaces/grid-column.interface";

export class ConflictsValueGetter {
    public static getValue(column: GridColumn, params) {

        switch (column.field) {
            case "companyTypeName":
                return params?.data?.companyType?.companyTypeName ?? "";
            case "companyName":
                return params?.data?.companyName ?? "";
            case "companySubmittedBy":
                if (params?.data?.submittedBy) {
                    return `${params.data.submittedBy.lastName}, ${params.data.submittedBy.firstName} (${params.data.submittedBy.officeAbbreviation})`;

                } else {
                    return "";
                }

            case "companySubmittedDate":
                if (params?.data?.submittedDate) {
                    return params.data.submittedDate;
                } else {
                    return "";
                }
            case "companyStageType":
                return params?.data?.stageType ? "Active" : "Archived";
            case "companyNotes":
                return params.data.notes ?? "";
            case "stageType":
                if (params?.data?.stageType) {
                    return "Active";
                } else {
                    return "Archived";
                }
                return
        }
    }

}

