import { Client } from '../../../shared/interfaces/client';
import { Priority } from '../../../shared/interfaces/priority';
import { Partner } from '../../../shared/interfaces/partner';
import { RegistrationStatus, RegistrationStage } from '../../../shared/interfaces/models';
import { dateTrack } from '../deal-context/deal-process/dateTracker';
import { WorkType } from '../../../registrations/new-registration/workType';
import { Office } from '../../../shared/interfaces/office';
import { ExpectedStart } from '../../../shared/interfaces/expectedStart';
import * as internal from 'stream';

export class DealClient {
    dealClientId: any;
    registrationId: number;
    client: Client;
    field: string;
    seekingExpertise:string;
    registrationStatus:RegistrationStatus;
    notes:string; 
    allocationNote:string;    
    allocationNoteFormatted:string;
    allocationNoteTexts:string[];
    stage: RegistrationStage;
    priorityId: string;
    priorityName: string;
    priority: Priority;
    projectLead:Partner;
    clientHeads: Partner[];
    clientSectorLeads: Partner[];
    othersInvolved: Partner[];
    statusTypeName: string;
    stageTypeName: string;
    submittedBy:string;
    isMultipleEmployee: boolean;
    isMultipleClient: boolean;
    tmpDealClientId: number;
    committed:any[]=[];
    heardFrom:any[]=[];
    nextCall:any[]=[];
    ovp:any[]=[];
    registrationSubmittedBy:string;
    RegistrationSubmitter:any;
    registrationSubmitterLocation:string;
    registrationSubmitterEcode:string;
    dealClientAllocationNotes:string;
    likelihoodId: number;
    possibleStartDateRangeTo:any = null;
    callDates:callDates[] = [];
    registrationSubmissionDate: Date = null;
    dealThesis:string;
    possibleStartDateRange:any[];
    caseCode:string;
    svp: Partner[];
    workType: WorkType;
    workEndDate: Date = null;
    phaseZeroStartDate: Date = null;
    phaseZeroEndDate: Date = null;
    phaseOneStartDate: Date = null;
    phaseOneEndDate: Date = null;
    phaseTwoStartDate: Date = null;
    phaseTwoEndDate: Date = null;
    interestDate: Date = null;
    commitmentDate: Date = null;
    terminatedDate: Date = null;
    statusUpdateDate:Date = null;
    lostTo:string;
    callLog:string;
    projectName:string;
    dealStage:string;
    clientOrder:number;
    caseOffice: Office;
    caseOfficeName: string;
    allocationDescription: string;
    caseStartDate:any= null;
    caseEndDate:any = null;
    caseName:string;
    caseId:number;
    officeCluster:string;
    expectedStart:ExpectedStart;
    registrationStage:RegistrationStage;
    isSingleBidder?:boolean;
   
}

export class callDates
{
    dealClientId:any;
    callDate:any
}
