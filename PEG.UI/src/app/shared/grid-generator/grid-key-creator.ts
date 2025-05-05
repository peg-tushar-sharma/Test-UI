import * as moment from "moment";

import { CommonMethods } from "../common/common-methods";

export class GridKeyCreatorValue {
    public static getKeyValue(params, columnDef) {
        let outString = undefined
        switch (columnDef.field) {
            case "customPriority":
                if (params?.data?.client) {
                    outString= CommonMethods.getCustomPriority(params?.data);
                }
                break;
            case "oppStage":
                outString = params?.data?.opportunityStage?.sortOrder + '. ' + params?.data?.opportunityStage?.opportunityStageName;
                break;
            case "expectedStart":
                if (params.data && params.data.expectedStart && params.data.expectedStart.expectedStartDate && params.data.expectedStart.expectedStartDate != "0001-01-01T00:00:00Z") {
                    var key = undefined;
                    key = moment.utc(params.data.expectedStart.expectedStartDate).format('DD-MMM-YYYY');
                    outString = key;               
                } else {
                    outString = "";
                }
                break;
            case "industries":
                if (params.data.industries && params.data.industries.length > 0) {
                    let industries = [];
                    industries = params.data.industries.map((eachIndustry) => {
                        let industryName = eachIndustry.abbreviation ? eachIndustry.abbreviation : "";
                        return industryName;
                    })
                    outString = industries.join(',');
                } else{
                    outString = '';
                }
                break;

            case "likelihood":
                if (params.data.likelihood && params.data.likelihood.label) {
                    outString = params.data.likelihood.label;
                } else {
                    outString = "";
                }
                break;

            case "weekStart":
                if (params.data && params.data.expectedStart && params.data.expectedStart.expectedStartDate && params.data.expectedStart.expectedStartDate != "0001-01-01T00:00:00Z") {
                    var key = undefined;
                    
                    key = CommonMethods.getWeekStart(params.data.expectedStart.expectedStartDate as Date);                  
                    outString = key
                }else{
                    outString ="";

                }
                break;
            case "opsLikelihood":
                if (params.data.opsLikelihood) {
                    outString = params.data.opsLikelihood.opsLikelihoodName;
                } else {
                    outString = "";
                }
                break;
            case "isRetainer":
            case "isMBPartner":
                outString= params.data[columnDef.field] && params.data[columnDef.field]!=0 ?
                CommonMethods.getAnswerObject()[params.data[columnDef.field]-1].name:"";
                break;
            case "isSVPHelp":
            case "isOVPHelp":
                outString=  params.data[columnDef.field]?"Yes":"No";
                break;
            case 'stageStatus':
                outString=  params?.data?.registrationStage?.stageTypeName ?? '';
                break;
            case 'officeToBeStaffed':
                outString=params?.data.officeToBeStaffed?.map((of) => of.officeName).join(', ')??'';
                break;
            case 'clientCommitment':
                outString= params?.data?.clientCommitment?.clientCommitmentName??'';
                break;
            case 'legalStatus':
                outString=params?.data?.registrationStatus?.statusTypeName??'';
                break;
            case 'clientName':
                if(params?.data?.client && params?.data?.client?.length>0){
                    outString=params.data.client[0].clientName;
                }
                else{
                    outString='';
                }
                break;
            default:
                if (params?.value) {
                    outString = params.value;
                }
                break;
        }
        return outString
    }
}
