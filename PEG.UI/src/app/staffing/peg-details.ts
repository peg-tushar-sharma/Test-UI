import { CaseComplexity } from "../shared/interfaces/caseComplexity";
import { Client } from "../shared/interfaces/client";
import { ClientCommitment } from "../shared/interfaces/clientCommitment";
import { industry } from "../shared/interfaces/industry";
import { Likelihood } from "../pipeline/pipeline";
import { Manager } from "../pipeline/manager";
import { MBStatus, SellSideStatus } from "../shared/interfaces/dealStatus";
import { Office } from "../shared/interfaces/office";
import { Partner } from "../shared/interfaces/partner";
import { RegistrationStatus } from "../shared/interfaces/registrationStatus";
import { TeamSize } from "../shared/interfaces/teamSize";
import { RegistrationStage } from "../shared/interfaces/RegistrationStage";
import { OpsLikelihood } from "../shared/interfaces/opsLikelihood";
import { StaffingOpportunityTypeDetails } from "./staffing-opportunity-type-details/staffing-opportunity-type-details";

export class PegDetails {
    pipelineId!: number;
    registrationId!: number;
    additionalInfo!: string;
    projectName!: string;
    expectedStart!: string;
    expectedEnd!: string;
    languageRequired!: string[];
    notes!: string;
    duration!: string;
    teamSize!: TeamSize[];
    likelihood!: Likelihood;
    opsLikelihood!: OpsLikelihood;
    client!: Client[];
    industry!: industry[];
    sector!: industry[];
    caseComplexity!: CaseComplexity[];
    officeToBeStaffed!: Office[];
    sellingPartner!: Partner[];
    svp!: Partner[];
    ovp!: Partner[];
    manager!: Manager[];
    isSVPHelp!:boolean;
    isOVPHelp!:boolean;
    latestStartDate!:string;
    teamComments!:string;
    clientCommitment!:ClientCommitment;
    legalStatus!:RegistrationStatus
    mbStatus!:MBStatus;
    pipelineNotes!:string;
    bucketOfficeCode!:string;
    stage!:RegistrationStage;
    needOpsStaffingSupport:number;
    sellSideStatus!:SellSideStatus
    isOpportunityStaffed:boolean=true;
    opportunityTypeDetails:StaffingOpportunityTypeDetails;
}