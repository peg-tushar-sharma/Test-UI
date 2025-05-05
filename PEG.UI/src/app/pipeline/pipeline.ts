import { Target } from "@angular/compiler";
import { WorkToStart } from "../registrations/new-registration/workToStart";
import { WorkType } from "../registrations/new-registration/workType";
import { AdditionalServices } from "../shared/interfaces/additionalServices";
import { CaseInfo } from "../shared/interfaces/caseInfo";
import { Client } from "../shared/interfaces/client";
import { ClientType } from "../shared/interfaces/clienttype";
import { Employee } from "../shared/interfaces/Employee";
import { ExpectedStart } from "../shared/interfaces/expectedStart";
import { Location } from "../shared/interfaces/location";
import { LocationOfDeal } from "../shared/interfaces/LocationOfDeal";
import { Office } from "../shared/interfaces/office";
import { Priority } from "../shared/interfaces/priority";
import { RegistrationPartner } from "../shared/interfaces/registrationPartner";
import { RegistrationStage } from "../shared/interfaces/RegistrationStage";
import { RegistrationStatus } from "../shared/interfaces/registrationStatus";
import { TargetType } from "../shared/interfaces/targetType";
import { TeamSize } from "../shared/interfaces/teamSize";
import { WorkPhase } from "../shared/interfaces/workphase";
import { Manager } from "./manager";
import { OpsLikelihood } from "../shared/interfaces/opsLikelihood";
import { PartnersDetails } from "../shared/interfaces/partnersDetails";


export class Pipeline {
    poId: string;
    opportunityTypeId: number;
    hasRegistration: boolean = true;
    registrationId: number;
    dealId: number;
    submissionDate: Date;
    locationOfDeal: LocationOfDeal;
    target: Target;
    targetType: TargetType;
    Client: Client[];
    registrationStatus: RegistrationStatus;
    workType: WorkType;
    workToStart: WorkToStart;
    registrationStage: RegistrationStage;
    case: CaseInfo;
    clientHead: RegistrationPartner[];
    clientSectorLeads: RegistrationPartner[];
    othersInvolved: RegistrationPartner[];
    likelihood:Likelihood;
    updateDate: Date;
    comments: string;
    requiredLanguage: string;
    customPriority: Priority[];
    workPhase: WorkPhase;
    clientType: ClientType;
    additionalServices: AdditionalServices[];
    pipelineId: number;
    discount: string;
    duration:string;     
    teamSize:TeamSize[];     
    expectedStart:ExpectedStart; 
    location:Location;
    opportunityStage:OpportunityStage;  
    oppName:string;
    weekStartDate:Date; 
    expectedProjectName:string;
    manager:Manager;
    icApproved:string;
    otherQuestions:string;
    weekStart:string;
    submittedBy:Employee;
    bucketOffice:Office;
    isRowSelected: boolean = false;
    isFlagged:boolean;
    isPartnerEditFlagged:boolean;
    isPipelineInfoRequested: boolean;
    officeToBeStaffed:Office[];
    svp:PartnersDetails;
    operatingPartner:PartnersDetails;    
    isRemoveRecordFromGrid: boolean = false;
    opsLikelihood:OpsLikelihood;
    partnerEdit:PartnerEdit[];
}


export class duration {
    startDuration: any;
    endDuration: any;
    quantifier: string;
}

export class OpportunityStage {
    opportunityStageId: number;
    opportunityStageName: string;
    sortOrder: number;
    disabled?:boolean;
} 

export class Likelihood {
    likelihoodId: number;
    label: string
    value: number
} 

export class PartnerEdit {
    partnerEditId: number;
    registrationId: number;
    employeeCode: string;
    field: string;
    property: string;
    editDate: Date;
    isCleared: boolean;
}


