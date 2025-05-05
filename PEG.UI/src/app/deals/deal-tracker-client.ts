import { Target } from '@angular/compiler';
import { Likelihood } from '../pipeline/pipeline';
import { WorkType } from '../registrations/new-registration/workType';
import { CaseInfo } from '../shared/interfaces/caseInfo';
import { Client } from '../shared/interfaces/client';
import { Employee } from '../shared/interfaces/Employee';
import { Partner } from '../shared/interfaces/partner';
import { Priority } from '../shared/interfaces/priority';
import { RegistrationStage } from '../shared/interfaces/RegistrationStage';
import { RegistrationStatus } from '../shared/interfaces/registrationStatus';
import { Expert } from './new-deal/deal-experts/expert';
import { OpportunityTypeDetails } from '../shared/opportunity-type-details/opportunity-type-details';
export class DealTrackerClient {
    dealClientId:number;
    registrationId:number;//op
    dealId:number;
    latestStartDate:any;
    client: Client;
    registrationStage:RegistrationStage;
    registrationStatus:RegistrationStatus;
    notes:string;
    lastUpdatedBy:Employee;
    lastUpdatedDate:any;
    bidDate:any;
    allocationNote:string;
    likelihood:Likelihood;
    caseInfo:CaseInfo;
    commitmentDate:string;
    terminatedDate:string;
    registrationSubmissionDate:string;
    registrationSubmitter:Employee;
    registrationSubmittedBy:string;
    workType:WorkType;
    isSinglebidder:boolean;
    isMultibidder:boolean;
    isSeller:boolean;
    isPubliclyTradedEquity:boolean;
    statusUpdateDate:string;
    expectedStartDate:any;
    expectedEndDate:any;
    target:Target;
    committed:Expert[];
    heardFrom:Expert[];
    nextCall:Expert[];
    //Used to get data 
    clientHeads:Partner[];
    clientSectorLeads:Partner[];
    othersInvolved:Partner[];
    clientOrder:number;
    priority:Priority;
    allocationNoteFormatted:any
    clientHeadsName:string;
    opportunityTypeId:number;
    retainerNotes:string;
    opportunityTypeDetails:OpportunityTypeDetails;    
    tempOpportunityTypeDetails:OpportunityTypeDetails; // used to temporarily store the opportunity type details to manage edit icon visibility   
}

export class DealTrackerClientForEmail extends DealTrackerClient
{
    additionalPartnersToEmail: Expert[]
}
