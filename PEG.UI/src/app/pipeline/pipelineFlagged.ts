export class PipelineFlagged
{
    pipelineId: number;
    targetName: string;
    clientName: string;
    clientPriority:string;
    industryName: string;
    sector: string;
    subSector: string;
    projectNickName:string;
    workStartDate: Date;
    stage:string;
    duration:string;
    teamSize: number;
    likelihood: Likelihood;
    expectedLeaderShip:string;
    progressUpdate:string;
    lastUpdatedDate:Date;
    groupId:number;
    groupName:string;
    expectedStartDate:Date;
    durationQuantifier:any;
    opportunityType: any;
    expectedEndDate:Date;
    expectedStartDateQuantifier:string;
    estimatedStartDate:string;
    isFlagged:boolean;
    lastUpdatedBy:string;
    preference:string;
    durationPeriod:string;
    lastClientUpdate:Date;
}



export class duration {
    startDuration:any;
    endDuration:any;
    quantifier: string;
}

export class Likelihood {
    likelihoodId: number;
    label: string
    value: number
} 

