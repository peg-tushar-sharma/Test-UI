import { DealRegistrations } from './dealRegistrations';
import { industry } from "../../app/shared/interfaces/industry";
import { expertGroup } from "../deals/new-deal/deal-experts/expertGroup";
import { Client } from '../shared/interfaces/client';
import { DealClient } from './new-deal/deal-clients/dealClient';
import { dateTrack } from './new-deal/deal-context/deal-process/dateTracker';
import { Employee } from '../shared/interfaces/models';
import { Partner } from '../shared/interfaces/partner';
import { DealSecurityTab } from '../deals/new-deal/deal-security/dealSecurityTab';

export class taggedPeople {
    dealId: number
    employeeCodes: string
}
export class deals {
    dealId: number;
    industries: {}[] = [];
    //industryName: string;
    targetName: string;
    //industryId: number;
    targetId: number;
    submittedBy: Employee;
    clientName: string;
    dealRegistrations: DealRegistrations[];
    expertGroup: expertGroup[];
    clients: DealClient[];
    clientAllocations: clientAllocations[];
    createdOn: string = null;
    bankRunningProcess: string = null;
    bankProcessName: string = null;
    currentEBITDA: string = null;
    dealSize: string = null;
    targetDescription: string = null;
    isPubliclyKnown: string = null;
    nickname: string = null;
    notes: string = null;
    owner: string = null;
    targetCountry: string = null;
    associatedRegistrations: string = null;
    mbAdvisor: Employee[] = [];
    mbStatus: number = null;
    sellSideStatus: number = null;
    sector: string = null;
    externalProjectName: string = null;
    visibleTo: string = null;
    biddersList: string = null;
    dealWinner: string = null;
    dealStatus: number = null;
    bidDates: string = null;
    bidDatesType: string = null;
    vddProvider: string = null;
    redbookAvailable: number;
    importantDates: dateTrack[] = [];
    managedBy: string = null;
    dealRegions: {}[] = [];
    dealSecurity: DealSecurityTab[];
    transactedTo: string
    supportedWinningBidder: string
    processExpectation: string;
    supportRequested: boolean
    expertLineupPrepared: boolean;
    expertOnBoard: boolean
    transactedDate: any;
    submissionDate: any;
    sectors: any[];
    subSectors: any[];
    priorWork: string;
    publiclyTraded?: boolean;
    isExpertTrainUpCall?: boolean;
    dateOfCall: any;
    trainers: Employee[];
    attendees: Employee[];
    sentTo: Employee[];
    isMasked: boolean;
    statusUpdateDate: Date;
}

export class DealList {
    dealId: number
    industries: any
    targetName: string
    clients: any
    regions: any[];
    dealStatus: dealStatus;
    lastUpdated: Date;
    dealStatusId: number;
    dealStatusName: string;
    submissionDate: any;
    notes: string;
    submittedBy: string;
    lastUpdatedBy: string;
    industryDN: string;
    noOfClients: string;
    region: string;
    dealRegion: string;
    sessionId: any;
    lockedBy: string;
}
export class dealStatus {
    dealStatusId: number = 0;
    dealStatusName: string;
}

export class taggedPeopleList {
    dealPeopleTagId: number
    dealId: number
    firstName: string
    familiarName: string
    lastName: string
    employeeCode: string
    office_name: string
    positionTitle: string
}


export class visibleToHighlights {
    general: number
    legal: number
    mb: number
    leadership: number
    operation: number
    admin: number
}


export class clientAllocations {
  dealId: number
    dealClientId: number // dealClientId not removing becuase it's used  in old dealallocation component.
    registrationId: number
    allocationType: number
    employeeCode: string
    isAllocationActive: boolean
}

export class ResourceAllocationInfomration {
    employeeCode: string
    employeeName: string
    operatingOfficeCode: string
    currentLevelGrade: string
    startDate: string
    endDate: string
    operatingOfficeAbbreviation: string
    caseRoleCode: string
}


export class DealExpertsList {
    dealId: number
    industries: any
    targetName: string
    expertGroupName:string
    expertGroupId:number
    clients: any
    regions: any[];
    dealStatus: dealStatus;
    lastUpdated: Date;
    dealStatusName: string;
    submissionDate: any;
    notes: string;
    submittedBy: string;
    lastUpdatedBy: string;
    industryDN: string;
    sectorDN: string;
    subSectorDN: string;
    noOfClients: string;
    region: string;
    dealRegion: string;
    sessionId: any;
    lockedBy: string;
    expertGroups: expertGroup[];
    isMasked: boolean
}
