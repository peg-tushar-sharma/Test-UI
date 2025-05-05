export class OpportunityTypeDetails {
    isNextPhase:boolean = false;
    nextPhaseValue: OpportunityTypeDetailsSize[] = [];
    isAdditionalTeam: boolean = false;
    additionalTeamValue: OpportunityTypeDetailsSize[] = [];
    isRestart: boolean = false;
    isContinuation: boolean = false;
}

export class OpportunityTypeDetailsSize
{

     opportunityTypeDetailSizeId :number;
     sizeType :number;
     value :number;
}