import { Injectable } from "@angular/core";
import { FormControl, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from "@angular/forms";


@Injectable() export class OpportunityFormBuilder {

    constructor() { }
    // Custom Validator
    static decimalValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        const regex = /^(?!.*e)(\d{1,14}(\.\d{1,2})?)?$/; // Regex: up to 10 digits before decimal and up to 2 after decimal, no 'e' or scientific notation

        if (value && !regex.test(value)) {
            return { invalidDecimal: true };
        }
        // Check for characters other than digits and dot
        return null;
    }
    buildOpportunityForm(): FormGroup {
        let form: FormGroup = new FormGroup({
            opportunityDetails: new FormGroup({
                client: new FormControl('', [Validators.required]),
                isClientHedgeFund: new FormControl(false),
                target: new FormControl('', [Validators.required, Validators.maxLength(1200)]),
                corporateRelationship: new FormControl('', [Validators.required, Validators.maxLength(1200)]),
                targetOwnerUnknown: new FormControl(),
                website: new FormControl('', [Validators.required, Validators.maxLength(400)]),
                industry: new FormControl('', [Validators.required]),
                sector: new FormControl(),
                targetDescription: new FormControl(null, [Validators.required, Validators.maxLength(300)]),
                workType: new FormControl('', [Validators.required]),
                isOpenMarketPurchase: new FormControl(null,[Validators.required]),
                isSPAC: new FormControl(null),
                isPubliclyTradedEquity: new FormControl(null),
                isPubliclyTradedDebt: new FormControl(null),
                isCarveOut: new FormControl(null),
                locationOfDeal: new FormControl('', [Validators.required]),
                registrationStageId: new FormControl('1', [Validators.required]),
                bidDate: new FormControl(''),
                expectedStartDate: new FormControl(null),
                latestStartDate: new FormControl(null),
                othersInvolved: new FormControl(),
                clientHead: new FormControl('', [Validators.required]),
                clientSectorLead: new FormControl(),
                generalNote: new FormControl('', [Validators.maxLength(2000)]),
                isMobileSubmission: new FormControl(false),
                bainOfficeCode: new FormControl(0),
                submittedBy: new FormControl(null),
                isImpersonated: new FormControl(),
                isExpertInfoRequested: new FormControl(false),
                isPipelineInfoRequested: new FormControl(false),
                isPipelineEdit: new FormControl(false),
                isExpertEdit: new FormControl(false),
                registrationId: new FormControl(0),



            }),
            risk: new FormGroup({
                isREN: new FormControl('', [Validators.required]),
                isProductREN: new FormControl('', [Validators.required]),
            }),

            experts: new FormGroup({
                opportunityExpertId: new FormControl(0),
                expertCall: new FormControl('', [Validators.required]),
                identifyExperts: new FormControl('', [Validators.required]),
                preferredExpertsForCase: new FormControl(),
                expertTeamNotes: new FormControl(null, [Validators.maxLength(2000)]),
                typesOfExpertise: new FormControl(null, [Validators.maxLength(2000)]),
                scheduledFields: new FormGroup({
                    expertCallDate: new FormControl(null, [Validators.required]),
                    expertsOnCall: new FormControl()
                })
            }),
            pipeline: new FormGroup({
                pipelineId: new FormControl(),
                isRetainer: new FormControl(),
                bidDate: new FormControl(),
                expectedStartDate: new FormControl(),
                latestStartDate: new FormControl(),
                teamSize: new FormControl(null, [Validators.required]),
                duration: new FormControl(null, [Validators.required, Validators.pattern('(^(\\d{1,2})\\.\\d$)|(^\\d{0,2}$)')]),
                clientCommitment: new FormControl(),
                likelihood: new FormControl(null, [Validators.required]),
                processInfo: new FormControl(null, [Validators.maxLength(800)]),
                caseComplexity: new FormArray([]),
                additionalServices: new FormArray([]),
                isMultibidderPartner: new FormControl(),
                expectedProjectName: new FormControl(null, [Validators.maxLength(100)]),
                requiredLanguage: new FormControl(),
                sellingPartners: new FormControl(),
                isLikelyOVP: new FormControl(false),
                OVP: new FormControl(),
                isLikelySVP: new FormControl(false),
                SVP: new FormControl(),
                requestedSM: new FormControl(),
                teamComments: new FormControl(null, [Validators.maxLength(1000)]),
                totalRevenue: new FormControl(null, [OpportunityFormBuilder.decimalValidator]),
                revenueCurrency: new FormControl(null),
                icApproved: new FormControl(null, [Validators.maxLength(600)]),
                processInfoUpdateDate: new FormControl(''),
                officeToBeStaffed: new FormControl([]),
                staffingSolvedLocally: new FormControl()
            })
        });
        form.get('opportunityDetails.isPubliclyTradedDebt').disable();
        form.get('opportunityDetails.isOpenMarketPurchase').disable();
        form.get("experts.scheduledFields.expertCallDate").disable();
        form.get("experts").disable();
        form.get("pipeline").disable();

        return form;
    }
}
