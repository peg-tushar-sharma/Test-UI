import { Pipe, PipeTransform } from "@angular/core";
import { CommonMethods } from "./common/common-methods";
import { OpportunityTypeDetails} from "./opportunity-type-details/opportunity-type-details";

@Pipe({
    name: "opportunityTypeDetailsPipe",
    pure: true
})
export class OpportunityTypeDetailsPipe implements PipeTransform {
    constructor() {}

    transform(value: OpportunityTypeDetails): string {
        return CommonMethods.generateOpportunityTypeDetailsLabel(value);
      }
}
