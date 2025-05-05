import { Priority } from "./priority";

export interface Client { 
    clientId: number,
    basisClientId: number,
    clientName: string,
    clientHeadEmployeeCode:string,
    clientHeadFirstName:string,
    clientHeadLastName:string,
    clientPriorityId:number,
    clientPriorityName:string,
    clientReferenceId: number,
    clientPrioritySortOrder: number
    accountId:string;
    customGroup:string;
    accountType:string;
    clientGroup:string;
}


