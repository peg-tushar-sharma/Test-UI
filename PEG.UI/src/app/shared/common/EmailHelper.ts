import * as moment from 'moment';
import { CommonMethods } from '../common/common-methods';
import { OpsLikelihoodEnum, OpsLikelihoodSortOrderMap } from '../enums/OpsLikelihood.enum';
import { dealMBStatus } from '../enums/deal-mbStatus.enum';

export class EmailHelper {
    static generateEmailBody(pipelineList: any[], oppNameFields: string[]): string {
        let body = "<div><b>Pipeline</b></div><br />";

        const sortedList = this.sortPipelineListAccordingToOpsLikelihood(pipelineList);

        sortedList.forEach((item, index) => {
            body += this.generatePipelineItemBody(item, sortedList, index, oppNameFields);
        });

        return body;
    }

    public static sortPipelineListAccordingToOpsLikelihood(pipelineList: any[]): any[] {
        return pipelineList.sort((a, b) => {
            const aLikelihoodId = a?.pipeline?.opsLikelihood?.opsLikelihoodId;
            const bLikelihoodId = b?.pipeline?.opsLikelihood?.opsLikelihoodId;

            const aLikelihoodName = OpsLikelihoodEnum[aLikelihoodId] || "Unknown";
            const bLikelihoodName = OpsLikelihoodEnum[bLikelihoodId] || "Unknown";

            const aSortOrder = OpsLikelihoodSortOrderMap[aLikelihoodName];
            const bSortOrder = OpsLikelihoodSortOrderMap[bLikelihoodName];

            if (aSortOrder === bSortOrder) {
                return 0;
            }

            return aSortOrder - bSortOrder;
        });
    }

    private static generatePipelineItemBody(item: any, pipelineList: any[], index: number, oppNameFields: string[]): string {
        let body = '';
        if (index == 0 ||
            (index > 0 &&
                pipelineList[index]?.pipeline?.opsLikelihood?.opsLikelihoodId != pipelineList[index - 1]?.pipeline?.opsLikelihood?.opsLikelihoodId)) {
            body += `<div><b>${item?.pipeline?.opsLikelihood?.opsLikelihoodName ?? "No Staffing Status"}</b></div><br />`;
        }

        let pipelineObject = item.pipeline;
        let conflictedOfficeList = item.conflictedOffice.map((office) => office?.hasOwnProperty('office') ? office.office.officeName : office.officeName);
        const uniqueOfficeArray = conflictedOfficeList.filter(
            (item, index, self) =>
              self.findIndex((obj) => obj === item) === index
          );
        body += '<ul><li>' + CommonMethods.getOpportunityName(pipelineObject, oppNameFields);
        if (pipelineObject?.mbStatus?.mbStatusId === dealMBStatus.ActiveMB) {
            body += '<b style="color: #FF0000"> (MB vs ' + uniqueOfficeArray.join(', ') + ') </b>';
        }

        body += '</li>';

        let innerList = this.generatePartnersList(pipelineObject);
        innerList += this.generateTeamSizeAndDuration(pipelineObject);
        innerList += this.generateStartDateString(pipelineObject);
        body += innerList ? '<ul>' + innerList + '</ul></ul>' : '<br /><br />';
        body += '<br />'
        return body;
    }

    private static generateTeamSizeAndDuration(pipelineObject: any): string {
        return "<li>" +
            ((pipelineObject?.teamSize?.length > 0
                ? "Team Size: " + pipelineObject?.teamSize?.map((ts) => ts?.teamSize)?.join(", ") + ";  "
                : "Team Size: TBD; ") +
                (pipelineObject?.duration ? "Duration: " + pipelineObject?.duration + " Weeks" : "Duration: TBD")) +
            "</li>";
    }

    static generateStartDateString(pipelineObject: any): string {
        const dateText = pipelineObject?.opsLikelihood?.opsLikelihoodId === OpsLikelihoodEnum.Staffed ? "Start Date: " : "Estimated Start Date: ";

        if (pipelineObject?.expectedStart?.expectedStartDate) {
            const startDate = moment.utc(pipelineObject.expectedStart.expectedStartDate);
            const formattedStartDate = startDate.format("DD-MMM-YYYY");

            if (pipelineObject?.latestStartDate) {
                const latestDate = moment.utc(pipelineObject.latestStartDate);
                const formattedLatestDate = latestDate.format("DD-MMM-YYYY");
                return `<li>${dateText}${formattedStartDate} to ${formattedLatestDate}</li>`;
            } else {
                return `<li>${dateText}${formattedStartDate}</li>`;
            }
        }
        else {
            const TBD = "TBD";
            return `<li>${dateText}${TBD}</li>`;
        }
    }

    static generatePartnersList(pipelineObject: any): string {
            let partnersList = '';

            if (pipelineObject?.operatingPartner?.partners?.length > 0) {
                partnersList += 'OVP: ' + pipelineObject.operatingPartner.partners
                    .map((ovp) => ovp.firstName + " " + ovp.lastName)
                    .join(", ");

                if (pipelineObject.operatingPartner.comments) {
                    partnersList += `, Notes: ${pipelineObject.operatingPartner.comments}`;
                }

                if (pipelineObject?.svp?.partners?.length > 0) {
                    partnersList += "; ";
                }
            }
            else {
                partnersList += 'OVP: TBD';
                if (pipelineObject?.operatingPartner?.comments) {
                    partnersList += `, Notes: ${pipelineObject?.operatingPartner?.comments}`;
                }
                partnersList += "; ";
            }

            if (pipelineObject?.svp?.partners?.length > 0) {
                partnersList += 'SVP: ' + pipelineObject.svp.partners
                    .map((svp) => svp.firstName + " " + svp.lastName)
                    .join(", ");

                if (pipelineObject.svp.comments) {
                    partnersList += `, Notes: ${pipelineObject.svp.comments}`;
                }
            }
            else {
                partnersList += 'SVP: TBD'
                if (pipelineObject?.svp?.comments) {
                    partnersList += `, Notes: ${pipelineObject?.svp?.comments}`;
                }
            }

            return '<li>' + partnersList + '</li>';
    }

    static openEmail(subject: string): void {
        let mailText = "mailto:?subject=" + subject + "&body=" + ""; // add the links to body
        window.open(mailText, "_blank");
    }
}
