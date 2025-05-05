import { WorkType } from "../../registrations/new-registration/workType";
import { Client } from "../../shared/interfaces/client";
import { RegistrationStatus } from "../../shared/interfaces/registrationStatus";
import { RegistrationStage } from "../../shared/interfaces/RegistrationStage";
import { MBStatus, SellSideStatus } from "../../shared/interfaces/dealStatus";
import { Employee } from "../../shared/interfaces/Employee";

export class Dashboard {
    registrationId: number;
    corporateRelationship:string;
    statusUpdateDate:Date;
    assignedUser: Employee;
    submissionDate: Date;
    lastUpdated: Date;
    website: string;
    lastUpdatedBy: Employee;
    client: Client;
    workType: WorkType;
    target: any;
    registrationStatus: RegistrationStatus
    registrationStage: RegistrationStage
    conflictApprovalTracker: any[];
    mbStatus:MBStatus
    sellSideStatus:SellSideStatus
}
