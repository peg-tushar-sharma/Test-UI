import { Region } from './region';
import { PartnerType } from '../enums/partner-type.enum';

export interface Partner {
    employeeCode: string,
    familiarName:string,
    firstName:string,
    lastName:string,
    partnerWorkTypeName:string,
    region: Region,
    searchableName: string,
    officeAbbreviation: string
}