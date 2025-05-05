import { industry } from "../../shared/interfaces/industry";
import { Client } from "../../shared/interfaces/client";
import { WorkType } from "../../registrations/new-registration/workType";
import { RegistrationStatus } from "../../shared/interfaces/registrationStatus";
import { RegistrationStage } from "../../shared/interfaces/RegistrationStage";

export class PartnerDashboard {

    registrationId: number;
    opportunityTypeId:number;
    client:Client;
    target:any;
    industry:industry;
    workType:WorkType;
    status:RegistrationStatus;
    expectedStartDate:string;
    Duration:string;
    stage:RegistrationStage;
     isExpertInfoRequested :boolean
    isPipelineInfoRequested :boolean
    caseRequestId:number;
}
