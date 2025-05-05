import * as moment from "moment";
import { CommonMethods } from "../common/common-methods";
import { CoreService } from "../../core/core.service";
import { dealMBStatus } from "../enums/deal-mbStatus.enum";
import { FilterType } from "../enums/FilterType";
import { RegistrationStageEnum } from "../enums/registration-stage.enum";

export class PipelineGridCellRenderer {
    public coreService: any;
    public isLegalUserorAdmin: boolean = false;
    dateFormat: string = 'DD-MMM';

    constructor(coreService: CoreService) {
        this.coreService = coreService;
    }

    public getCellRenderer(column, params, oppNameFields) {
        switch (column.cellRenderer) {
            case "pipelineTargetNameRenderer":
                if (params.data.target) {
                    if( params.data.dealId && params.data.dealId > 0){
                    let target: string = params.data.target.targetName ? params.data.target.targetName : "";
                    const buttonElement = document.createElement("a");
                    buttonElement.style.cssText = "font-size: 12px; font-weight: 500; font-family: 'Graphik', sans-serif; color: #284ce0";
                    buttonElement.href = "javascript:void(0)";
                    buttonElement.innerHTML = target;
                    buttonElement.style.color = "#284ce0";
                    buttonElement.style.cursor = "pointer";
                    buttonElement.style.opacity = "1";
                    return buttonElement;
                    }else{
                        return params.data.target.targetName ? params.data.target.targetName : ""
                    }
                    break;
                }
            case "people":
                if (params.data[column.field]) {
                    let value = [];
                    value = CommonMethods.getEmployeeNameList(params.data[column.field]);
                    return value.join("; ");
                }
                break;
            case "opportunityTypeDetailsRenderer":
                if (params.data[column.field]) {
                    let value = '';
                    value = CommonMethods.generateOpportunityTypeDetailsLabel(params.data.opportunityTypeDetails);
                    return value;
                }
                break;
            case "targetName":
                if (params.data.target) {
                    return params.data.target.targetName;
                }
                break;
            case "stageTypeName":
                if (params.data.registrationStage) {
                    return params.data.registrationStage.stageTypeName;
                }
                break;
            case "pipelineStageStatusRender":
                let stage: string = params.data.registrationStage ? params.data.registrationStage.stageTypeName : "";
                const buttonElement = document.createElement("a");
                buttonElement.style.cssText = "font-size: 12px; font-weight: 500; font-family: 'Graphik', sans-serif; color: #284ce0";
                buttonElement.href = "javascript:void(0)";
                buttonElement.innerHTML = stage;
                buttonElement.style.color = "#284ce0";
                buttonElement.style.cursor = "pointer";
                buttonElement.style.opacity = "1";
                return buttonElement;
                break;
            case "workTypeName":
                if (params.data.workType) {
                    return params.data.workType.workTypeName;
                }
                break;
            case "clientType":
                if (params.data.clientType) {
                    let clientTypeValue: string[] = [];
                    if (params.data.clientType.isSpecialPurposeAcquisitionCompany) {
                        clientTypeValue.push("SPAC");
                    }
                    if (params.data.clientType.isHedgeFundClient) {
                        clientTypeValue.push("HF");
                    }
                    if (params.data.clientType.isPrivateEquity) {
                        clientTypeValue.push("Private Equity");
                    }
                    if (params.data.clientType.isInfra) {
                        clientTypeValue.push("Infra");
                    }
                    if (params.data.clientType.isGrowthEquity) {
                        clientTypeValue.push("Growth Equity");
                    }
                    if (params.data.clientType.isCorporate) {
                        clientTypeValue.push("Corporate");
                    }
                    return clientTypeValue.join(", ");
                }
                break;
            case "industryName":
                if (params.data.industry) {
                    let industries: string[] = [];
                    params.data.industry.map((eachIndustry) => {
                        industries.push(eachIndustry.industryName);
                    });
                    return industries.join(", ");
                }
                break;
            case "case":
                if (params.data.case) {
                    return params.data.case[column.field];
                }
                break;
            case "mbStatus":
                if (params.data.mbStatus) {
                    let returnText = "";
                    if (params.data.mbStatus.mbStatusId == dealMBStatus.SingleRegistration) {
                        returnText = "N";
                    } else if (
                        params.data.mbStatus.mbStatusId == dealMBStatus.ActiveMB ||
                        params.data.mbStatus.mbStatusId == dealMBStatus.PotentialMB
                    ) {
                        returnText = "Y";
                    }
                    return returnText;
                }
                break;
            case "client":
                if (params.data.client) {
                    let clientsData: string[] = [];
                    params.data.client.map((eachIndustry) => {
                        clientsData.push(eachIndustry[column.field]);
                    });
                    return clientsData.join(", ");
                }
                break;
            case "priority":
                return CommonMethods.getCustomPriority(params.data);
                break;
            case "officeToBeStaffed":
                if (params.data.officeToBeStaffed) {
                    return params.data.officeToBeStaffed?.map((of) => of.officeName).join(', ');
                }
                break;

            case "industries":
                if (params.data.industries) {
                    let industryName = "";
                    if (params.data.industries[0] && params.data.industries[0].abbreviation) {
                        industryName = params.data.industries[0] ? params.data.industries[0]?.abbreviation : "";
                    }
                    // else {
                    //     industryName = params.data.industries[0] ? params.data.industries[0]?.industryName : '';

                    // }
                    return industryName;
                }
                break;
            case "workToStart":
                if (params.data.workToStart) {
                    return params.data.workToStart.workToStartName;
                }

                break;
            case "clientCommitment":
                if (params.data.clientCommitment) {
                    return params.data.clientCommitment.clientCommitmentName;
                }

                break;
            case "opsLikelihood":
                if (params.data.opsLikelihood) {
                    return params.data.opsLikelihood.opsLikelihoodName;
                }

                break;

            case "manager":
                if (params.data.manager) {
                    return CommonMethods.getEmployeeName(params.data.manager);
                }

                break;

            case "caseManager":
                if (params.data?.case?.caseManager) {
                    return params.data.case.caseManager.lastName + ", " + params.data.case.caseManager.firstName;
                }

                break;

            case "operatingPartner":
                if (params.data.operatingPartner) {
                    let key = "";
                    if (params.data.operatingPartner.partners?.length > 0) {
                        let partnerList = CommonMethods.getEmployeeNameList(params.data.operatingPartner.partners);
                        key = partnerList.join(",");
                        if (params.data.operatingPartner?.comments) {
                            return `<div class="d-flex align-items-center" style="gap: 4px"><i class="fa fa-sticky-note" style="color: rgb(51 78 231);"></i>${key}</div>`
                        }
                        else {
                            return `<div class="d-flex align-items-center" style="margin-left:13px;" >${key}</div>`;
                        }
                    }
                    else {
                        if (params.data.operatingPartner?.comments) {
                            return `<div class="d-flex align-items-center" style="padding-top:5px"> <i class="fa fa-sticky-note" style="color: rgb(51 78 231);"></i></div>`

                        }
                        else {
                            return key;
                        }
                    }
                }
                break;
            case "sellingPartner":
                if (params.data.sellingPartner) {
                    let partnerList = CommonMethods.getEmployeeNameList(params.data.sellingPartner);
                    return partnerList.join(",");
                }

                break;
            case "svp":
                if (params.data.svp) {
                    let key = "";
                    if (params.data.svp.partners?.length > 0) {
                        let partnerList = CommonMethods.getEmployeeNameList(params.data.svp.partners);
                        key = partnerList.join(",");
                        if (params.data.svp?.comments) {
                            return `<div class="d-flex align-items-center" style="gap: 4px"><i class="fa fa-sticky-note" style="color: rgb(51 78 231);"></i>${key}</div>`
                        }
                        else {
                            return `<div class="d-flex align-items-center" style="margin-left:13px;" >${key}</div>`;
                        }
                    }
                    else {
                        if (params.data.svp?.comments) {
                            return `<div class="d-flex align-items-center" style="padding-top:5px"> <i class="fa fa-sticky-note" style="color: rgb(51 78 231);"></i></div>`

                        }
                        else {
                            return key;
                        }
                    }

                }

                break;
            case "team":
                if (params.data.teamSize) {
                    let values = [];
                    params.data.teamSize.forEach((element) => {
                        if (element.teamSizeId > 0) {
                            values.push(element.teamSize);
                        }
                    });
                    return values.join(",");
                }

                break;

            case "caseComplexity":
                if (params.data.caseComplexity) {
                    let values = [];
                    params.data.caseComplexity.forEach((element) => {
                        if (element.caseComplexityId > 0) {
                            values.push(element.caseComplexityName);
                        }
                    });
                    return values.join(",");
                }

                break;

            case "duration":
                if (params.data.duration) {
                    let stringValue = params.data.duration.toString() as string
                    if (stringValue.includes('.') && stringValue.charAt(stringValue.length - 1) == '0') {
                        return stringValue.substring(0, stringValue.length - 2);
                    } else {
                        return params.data.duration;
                    }
                }
                else {
                    return "";
                }

                break;
            case "expectedStart":
                if (params.data.expectedStart) {
                    let expectedStart = "";
                    if (params.data.expectedStart.expectedStartDate) {
                        expectedStart = moment.utc(params.data.expectedStart.expectedStartDate).format(this.dateFormat);
                    }
                    return expectedStart;
                }

                break;

            case "pipelineLikelihood":
                if (params.data.likelihood && params.data.likelihood.likelihoodId > 0) {
                    let renderedLikelihoodValue = "";
                    if (params.data.likelihood.likelihoodId > 0) {
                        renderedLikelihoodValue = params.data.likelihood.label + "%";
                    }
                    return renderedLikelihoodValue;
                }

                break;
            case "Sectors":
                if (params.data.sector) {
                    let industryName = params.data.sector.map((r) => r.industryName);
                    return industryName.join(",");
                }
                break;
            case "SubSectors":
                if (params.data.subSector) {
                    let industryName = params.data.subSector.map((r) => r.industryName);
                    return industryName.join(",");
                }
                break;

            case "clientCellRenderer":
                if (params.data.client) {
                    let clients = params.data.client.map((r) => r.clientName);
                    return clients.join(",");
                }
                break;
            case "opportunityName":
                if (params.data) {
                    let oppName = CommonMethods.getOpportunityName(params.data, oppNameFields);
                    if (oppName) {
                        params.data.oppName = oppName;
                    } else {
                        params.data.oppName = '';

                    }

                    let elementToReturn;

                    if (params.data.mbStatus?.mbStatusId == dealMBStatus.ActiveMB) {
                        elementToReturn =
                            `<div class="d-flex align-items-center" 
                            style="white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 100%;">
                            <span style="white-space:nowrap;overflow:hidden;
                                    text-overflow:ellipsis;
                                    margin-right: 4px;"> 
                                ${params.data.oppName}
                            </span> 
                            <i class="fas fa-exclamation ml-auto" style="color: #cc0000;float:right">
                            </i>
                        </div>`;
                    } else if (params.data.mbStatus?.mbStatusId == dealMBStatus.PotentialMB) {
                        elementToReturn =
                            `<div class="d-flex align-items-center" 
                            style="white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    max-width: 100%;">
                            <span style="white-space:nowrap;overflow:hidden;
                                        text-overflow:ellipsis;
                                        margin-right: 4px;"> 
                                ${params.data.oppName}
                            </span> 
                            <i class="fas fa-exclamation ml-auto" style="color: #284ce0;float:right">
                            </i>
                        </div>`;
                    } else {
                        elementToReturn = params.data.oppName;
                    }
                    return elementToReturn;
                }

                break;
            case "opportunityStage":
                if (params.data.opportunityStage) {
                    return params.data.opportunityStage.opportunityStageName;
                }

                break;
            case "expectedProjectName":
                if (params.data.expectedProjectName) {
                    return params.data.expectedProjectName;
                }
                break;
            case "additionalServices":
                if (params.data.additionalServices) {
                    let values = [];
                    params.data.additionalServices.forEach((element) => {
                        if (element.additionalServicesId > 0) {
                            values.push(element.additionalServicesName);
                        }
                    });
                    return values.join(",");
                }

            case "submittedBy":
                if (params.data?.submittedBy) {
                    return CommonMethods.getEmployeeNames([params.data.submittedBy], ";");
                }

            case "legalStatus":
                if (params.data?.registrationStatus) {
                    return params?.data?.registrationStatus?.statusTypeName;
                }
                break;

            case "processInfo":
                if (params.data.processInfo) {
                    return params.data.processInfo;
                }
                break;
            case "isOVPHelp": {
                return params?.data?.isOVPHelp ? "Yes" : "No";
            }

            case "isSVPHelp": {
                return params?.data?.isSVPHelp ? "Yes" : "No";
            }
            case "isRetainer": {
                return params?.data?.isRetainer == 1
                    ? "Yes"
                    : params?.data?.isRetainer == 2
                        ? "No"
                        : params?.data?.isRetainer == 3
                            ? "I don’t know"
                            : "";
            }
            case "isMBPartner": {
                return params?.data?.isMBPartner == 1
                    ? "Yes"
                    : params?.data?.isMBPartner == 2
                        ? "No"
                        : params?.data?.isMBPartner == 3
                            ? "I don’t know"
                            : "";
            }
            case "clientInformalName":
                if (params.data?.clientInformalName) {
                    return params.data.clientInformalName;
                }
                break;
            case "requiredLanguage":
                if (params.data?.requiredLanguage) {
                    return params.data.requiredLanguage.join(",");

                }
                break;
            default:
                return column.splitChar && params.value
                    ? params.value.length > 0
                        ? params.value.join(column.splitChar)
                        : params.value
                    : params.value;
        }
    }
}
