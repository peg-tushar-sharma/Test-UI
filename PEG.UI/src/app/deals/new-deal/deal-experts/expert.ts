import { industry } from '../../../shared/interfaces/industry';
import { Client } from '../../../shared/interfaces/client';
import { ExpertCategory } from './expertCategory';

export class Expert{
    employeeCode:string;
    expertName : string;
    expertGroupId: any;
    expertId:number;
    categoryId: number;
    categoryName:string;
    sortOrder: number;
    expertise: string;
    bainOffice:string;
    title:string;
    levelName:string;
    gradeName?:string;
    expertIndustries:string;
    industry:string; 
    expertClients:string;
    client:string; 
    note: string;
    isMultipleEmployee:boolean= false;
    isMultipleClient:boolean = true;
    expertState:number = 0;
    filterState:number;
    isExternalEmployee:boolean;
    isAllocationActive=false;
    associatedExpertPool:any[];
    expertNameWithoutAbbreviation: string;
    officeAbbreviation:string;
    statusCode:string;
    expertCategory:ExpertCategory;
    expertPoolColor: any = null;
    internetAddress:string;
}