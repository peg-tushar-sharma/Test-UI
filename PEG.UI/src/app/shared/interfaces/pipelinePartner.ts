import { Employee } from "./Employee";

export interface PipelinePartner
{
    firstName: string,
    lastName: string,
    familiarName: string,
    employeeCode: string,
    searchableName: string,
    officeAbbrevation?: string,
    context:String,
    tag:String,
    
}