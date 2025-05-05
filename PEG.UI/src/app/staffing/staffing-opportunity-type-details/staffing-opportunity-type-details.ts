export class StaffingOpportunityTypeDetails {
    isNextPhase:boolean= false;
    nextPhaseValue: StaffingOpportunityTypeDetailsSize[] = [];
    isAdditionalTeam: boolean = false;
    additionalTeamValue: StaffingOpportunityTypeDetailsSize[] = [];
    isRestart: boolean = false;
    isContinuation: boolean = false;
}

export class StaffingOpportunityTypeDetailsSize
{

     opportunityTypeDetailSizeId :number;
     sizeType :number;
     value :number;
}