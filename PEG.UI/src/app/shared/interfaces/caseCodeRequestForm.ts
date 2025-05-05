import { Employee } from "./Employee";
import { Client } from "./client";
import { industry } from "./industry";
import { Office } from "./office";
import { sector } from "./sector";
import { TeamSize } from "./teamSize";

export interface CaseCodeRequestForm {
    registrationId:number;
    // case details
    client: Client | any;
    industry: industry | any;
    capability: any;
    fundType: any;
    projectDuration: number;

    // dates
    startDate: Date;
    endDate: Date;

    projectName: string;
    opportunityType: string;
    teamSize: TeamSize | any;
    weeklyRackRate: TeamSize | any;

    // discount
    isDiscounted: boolean;
    discountNotes: string;
    discountApproval: any;

    financeNotes: string;

    // billing
    billingContact: string;
    billingEmail: string;
    billingAddress: string;

    scopeOfWork: any;

    // resource details
    billingOffice: Office;

    svp: Employee;
    svpAllocation: number;

    ovp: Employee;
    ovpAllocation: number;

    manager: Employee;
    managerAllocation: number;

    billingPartner: Employee;
    billingPartnerAllocation: number;

    coreAdvisor: Employee;
    coreAdvisorAllocation: number;

    lightAdvisor: Employee;
    lightAdvisorAllocation: number;

    qtr: Employee;
    qtrAllocation: number;

    sellingPartner: Employee;
    sellingPartnerAllocation: number;

    highBainExpert: Employee;
    highBainExpertAllocation: number;

    lightBainExpert: Employee;
    lightBainExpertAllocation: number;

    recipients: Employee;
    changeLog:any;
    partnerNotes:any;
};       
