import { DeleteLevel } from "../shared/enums/delete-type";
import { Employee } from "../shared/interfaces/Employee";
import { Office } from "../shared/interfaces/office";
import { PipelineBucketMapping } from "./pipelineBucketMapping";

export class PipelineBucket {
    constructor() {
        let employee: Employee = {
            firstName: '',
            lastName: '',
            familiarName: '',
            employeeCode: '',
            searchableName: '',
            officeName: '',
            officeAbbreviation: '',
            employeeStatusCode: '',
            pegRole: 0,
            pegRoleName: '',
            officeAbbrevation: '',
            levelName: '',
            gradeName: '',
            title: '',
            homeOfficeCode:0,
            abbreviation: '',
            isRingfenceEmployee: false,
            statusCode: '',
            officeClusterCode:0
        };
        this.employee = employee;
        this.isEditable = false;
        this.bucketGroupId;
        this.deleteLevel = DeleteLevel.none;
        this.isDragged=false;
        this.isHighlightedOnSearch=false;
    }
    pipelineBucketId: number;
    pipelineBucketGroupId: number;
    tmpPipelineBucketId: any;
    weekStartDate: Date;
    weekStartDateLabel: string;
    office: Office;
    bucketGroupId: number;
    isEditable: boolean = false;
    employee: Employee;    
    lastUpdated: any;
    lastUpdatedBy: string;
    registrationId: number;
    rowType: number;
    deleteLevel: DeleteLevel;
    availableDate:string;
    pipelineBucketMapping: PipelineBucketMapping[];
    pipelineBucketMappingId: number;
    pipelineBucketMappingSortOrder: number;
    isDragged:boolean;
    bucketColorCode: string;
    opsLikelihoodId: number;
    isHighlightedOnSearch:boolean;
}

export class EmployeNotes {
    employeeCode: string;
    preference: string;
    cdWork: string;
    outrage: string;
    lastUpdatedBy: string;
    pegColorId: number;
    colorCode: string;
}
export class OfficeNotes {
    officeCode: string;
    officeOutrage: string;
    preference: string;
    cdWork: string;
    lastUpdatedBy: string;
    pegColorId: number;
    colorCode: string;
    pipelineBucketId: number;
}