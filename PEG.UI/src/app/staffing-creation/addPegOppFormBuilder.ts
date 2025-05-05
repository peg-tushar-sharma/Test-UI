import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaffingOpportunityTypeDetails } from "../staffing/staffing-opportunity-type-details/staffing-opportunity-type-details";

@Injectable()
export class AddPegOppFormBuilder {
    constructor() { }

    buildManualForm(): FormGroup {
        let form: FormGroup = new FormGroup({
            addPegOppForm: new FormGroup({
                client: new FormControl(null, Validators.required),
                industry: new FormControl(null, Validators.required),
                projectName: new FormControl(null,[Validators.maxLength(100)]),
                expectedStartDate: new FormControl(null, Validators.required),
                officeToBeStaffed: new FormControl(null, Validators.required),
                likelihood: new FormControl(null, Validators.required),
                duration: new FormControl(null, [Validators.required, Validators.pattern('(^(\\d{1,2})\\.\\d$)|(^\\d{0,2}$)')]),
                sellingPartner: new FormControl(null),
                svp: new FormControl(null),
                ovp: new FormControl(null),
                submittedBy: new FormControl(null),
                teamSize:new FormControl(null),
                pipelineId: new FormControl(),
                registrationId: new FormControl(),
                opportunityTypeDetails: new FormControl(new StaffingOpportunityTypeDetails()),

            })
        });

        return form;
    }
}
