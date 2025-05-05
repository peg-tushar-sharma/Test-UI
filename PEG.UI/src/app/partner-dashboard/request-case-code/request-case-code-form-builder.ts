import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { requiredFieldValidator } from './../../shared/opportunity-type-details-form-required.validators';

@Injectable({ providedIn: 'any' })
export class RequestCaseCodeFormBuilder {
    constructor() { }

    buildRequestForm(): FormGroup {
        let form: FormGroup = new FormGroup({

            // case details..
            caseDetailsForm: new FormGroup({
                registrationId:new FormControl(),
                pipelineId:new FormControl(),
                client: new FormControl(),
                industry: new FormControl(),
                workType:new FormControl(),
                registrationStatus:new FormControl(),
                capability: new FormControl(null),
                fundType: new FormControl(null),
                duration: new FormControl(null, Validators.required),

                // ..dates
                expectedStartDate: new FormControl(null, Validators.required),
                endDate: new FormControl(null, Validators.required),

                expectedProjectName: new FormControl(null, Validators.required),
                opportunityTypeDetails: new FormControl(null, requiredFieldValidator()),
                opportunityTypeDetailsreadonly:new FormControl(),

                revenueCurrency: new FormControl(null, Validators.required),
                teamSize: new FormControl(null, Validators.required),
                weeklyRackRate: new FormControl(),
                weeklyRackRateId: new FormControl(),
                teamComments: new FormControl(null,Validators.maxLength(1000)),
                ratePricedAt: new FormControl(null, Validators.required),

                // ..discounts
                isDiscounted: new FormControl(null, Validators.required),
                discountNotes: new FormControl(),
                discountApproval: new FormControl(),

                financeNotes: new FormControl(null,Validators.maxLength(800)),

                // ..billing
                billingContact: new FormControl(null,Validators.maxLength(200)),
                billingEmail: new FormControl(null, Validators.email),
                billingOffice: new FormControl(null, Validators.required),
                billingPartner: new FormControl(null, Validators.required),

                scopeOfWork: new FormControl(null, Validators.required),
            }),

            // resource..
            resourceDetailsForm: new FormGroup({
            

                // ..ovp
                ovp: new FormControl(null, Validators.required),
                ovpAllocation: new FormControl(Validators.max(100)),

                // ..svp
                svp: new FormControl(null, Validators.required),
                svpAllocation: new FormControl(Validators.max(100)),

                // ..manager
                manager: new FormControl(null,Validators.required),
                managerAllocation: new FormControl(Validators.max(100)),

                // advisor
                advisor: new FormControl(),
                advisorAllocation: new FormControl(null, Validators.max(100)),

              
               
                // ..advisors
                coreAdvisor: new FormControl(),
                coreAdvisorAllocation: new FormControl(Validators.max(100)),

                lightAdvisor: new FormControl(),
                lightAdvisorAllocation: new FormControl(Validators.max(100)),

                // ..qtr
                qtr: new FormControl(null, Validators.required),
                qtrAllocation: new FormControl(Validators.max(100)),

                // ..selling partners
                sellingPartners: new FormControl(),
                sellingPartnerAllocation: new FormControl(Validators.max(100)),

                // ..bain experts
                highBainExpert: new FormControl(),
                highBainExpertAllocation: new FormControl(Validators.max(100)),

                lightBainExpert: new FormControl(),
                lightBainExpertAllocation: new FormControl(Validators.max(100))
            }),

            emailDetailsForm: new FormGroup({
                recipients: new FormControl(Validators.max(100)),
                partnerNotes: new FormControl(null,Validators.maxLength(800)),
                partnerNotesAllocation: new FormControl(null,Validators.maxLength(800)),
                mentionControl: new FormControl(null, Validators.max(100))
                
            })
        });

        return form;
    }
}
