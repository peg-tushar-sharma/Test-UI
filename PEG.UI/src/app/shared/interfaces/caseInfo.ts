import { Employee } from "./Employee";

export interface CaseInfo { 
    caseId: number,
    caseCode: string,
    caseName: string,
    caseStartDate:any,
    caseEndDate:any,
    caseOffice:number,
    caseOfficeName: string,
    officeCluster:string
    caseManager?: Employee;
}