import { Competitor } from "../shared/update-stage-modal/update-stage-modal.component";

export interface RegistrationClosedInfo {
    registrationClosedInfoMappingId: number;

    /* Maps to the ID of the associated registration record*/
    registrationId: number;

    registrationStageId: number;

    assignedCompetitor: Competitor;

    primaryNote: string;

    secondaryNote:any[];

    submittedBy: string;

}