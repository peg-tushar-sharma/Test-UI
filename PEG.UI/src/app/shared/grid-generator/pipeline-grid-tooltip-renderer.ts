import * as moment from "moment";
import { CommonMethods } from "../common/common-methods";
import { dealMBStatus } from "../enums/deal-mbStatus.enum";
import { FormatTimeZone } from "../formatTimeZone.pipe";
import { WorkPhase } from "../interfaces/workphase";

export class PipelineGridTooltipRenderer {
    public _formatTimeZone: FormatTimeZone
    constructor() {

    }

    public getTooltipRenderer(column, params) {

        switch (column.field) {
            case 'people':
                if (params.data[column.field]) {
                    let value = [];
                    params.data[column.field].map(element => {
                        value.push(element.searchableName = element.lastName + ', ' + (element.familiarName ? element.familiarName : element.firstName) + ' (' + element.officeAbbreviation + ')');
                    })
                    return value.join('; ');
                }
                break;
            case 'targetName':
                if (params.data.target) {
                    return params.data.target.targetName;
                }
                break;
            case 'stageStatus':
                if (params.data.registrationStage) {
                    return params.data.registrationStage.stageTypeName;
                }
                break;
            case 'workTypeName':
                if (params.data.workType) {
                    return params.data.workType.workTypeName;
                }
                break;
            case 'clientType':
                if (params.data.clientType) {
                    let clientTypeValue: string[] = [];
                    if (params.data.clientType.isSpecialPurposeAcquisitionCompany) {
                        clientTypeValue.push('SPAC')
                    }
                    if (params.data.clientType.isHedgeFundClient) {
                        clientTypeValue.push('HF')
                    }
                    if (params.data.clientType.isPrivateEquity) {
                        clientTypeValue.push('Private Equity')
                    }
                    if (params.data.clientType.isInfra) {
                        clientTypeValue.push('Infra')
                    }
                    if (params.data.clientType.isGrowthEquity) {
                        clientTypeValue.push('Growth Equity')
                    }
                    if (params.data.clientType.isCorporate) {
                        clientTypeValue.push('Corporate')
                    }
                    return clientTypeValue.join(', ');
                }
                break;
            case 'industryName':
                if (params.data.industry) {
                    let industries: string[] = [];
                    params.data.industry.map((eachIndustry) => {
                        industries.push(eachIndustry.industryName);
                    });
                    return industries.join(', ');
                }
                break;
            case 'caseCode':
                if (params.data.case) {
                    return params.data.case[column.field];
                }
                break;
            case 'caseStartDate':
                if (params.data.case && params.data.case.caseStartDate) {
                    this._formatTimeZone = new FormatTimeZone();
                    let dateparsed = this._formatTimeZone.transform(params.data.case.caseStartDate, true);
                    return moment(dateparsed).format('DD-MMM-YYYY');
                }
                break
            case 'caseEndDate':
                if (params.data.case && params.data.case.caseEndDate) {
                    this._formatTimeZone = new FormatTimeZone();
                    let dateparsed = this._formatTimeZone.transform(params.data.case.caseEndDate, true);
                    return moment(dateparsed).format('DD-MMM-YYYY');
                }
                break
            case 'client':
                if (params.data.client) {
                    let clientsData: string[] = [];
                    params.data.client.map((eachIndustry) => {
                        clientsData.push(eachIndustry[column.field]);
                    });
                    return clientsData.join(', ');

                }
                break;
            case 'priority':
                if (params.data.customPriority) {
                    let clientPriority = params.data.client[0] && params.data.client[0].clientPriorityName != null ? params.data.client[0].clientPriorityName : ''
                    let customClientPriority = params.data.customPriority[0] ? params.data.customPriority[0]?.priorityName : '';
                    return clientPriority + ' - ' + customClientPriority;

                }
                break;
            case 'industries':
                if (params.data.industries) {
                    let industryName = '';
                    if (params.data.industries[0] && params.data.industries[0].abbreviation) {
                        industryName = params.data.industries[0] ? params.data.industries[0]?.abbreviation : '';

                    }
                    //  else {
                    //     industryName = params.data.industries[0] ? params.data.industries[0]?.industryName : '';

                    // }
                    return industryName;

                }
                break;
            case 'clientCommitment':
                if (params.data.clientCommitment) {

                    return params.data.clientCommitment.clientCommitmentName;

                }
                break;
            case 'workToStart':
                if (params.data.workToStart) {
                    return params.data.workToStart.workToStartName;
                }

                break;
            case 'submissionDate':
                if (params.data.submissionDate) {
                    this._formatTimeZone = new FormatTimeZone();
                    let dateparsed = this._formatTimeZone.transform(params.data.submissionDate, true);
                    return moment(dateparsed).format('DD-MMM-YYYY');
                }

                break;
            case 'pipelineSubmittedDate':
                if (params.data.pipelineInfoRequestedDate) {
                    this._formatTimeZone = new FormatTimeZone();
                    let dateparsed = this._formatTimeZone.transform(params.data.pipelineInfoRequestedDate, true);
                    return moment(dateparsed).format('DD-MMM-YYYY');
                }

                break;
            case 'updatedDate':
                if (params.data.updatedDate) {
                    this._formatTimeZone = new FormatTimeZone();
                    let dateparsed = this._formatTimeZone.transform(params.data.updatedDate, true);
                    return moment(dateparsed).format('DD-MMM-YYYY');
                }
                break
            case 'hasRegistration':
                if (params.data.hasRegistration) {
                    return params.data.registrationId;
                }

                break;
            case 'workPhase':
                if (params.data.workPhase) {
                    let workPhase: WorkPhase;
                    workPhase = params.data.workPhase;
                    let workPhases: string[] = [];
                    if (params.data.workPhase && params.data.workPhase != null) {

                        if (workPhase.isContinuation) {
                            workPhases.push('Continuation Phase');
                        }
                        if (workPhase.isNext) {
                            workPhases.push('Next phase');
                        }
                        if (workPhase.isRestartPhase) {
                            workPhases.push('Restart Phase');
                        }
                        if (workPhase.relatedCaseCode) {
                            workPhases.push(workPhase.relatedCaseCode);
                        }
                        return workPhases.join(', ');

                    }
                }
                break;
            case 'duration':
                if (params.data.duration) {

                    return params.data.duration;
                }

                break;
            case 'expectedStart':
                if (params.data.expectedStart) {
                    if (params.data.expectedStart?.expectedStartDate) {
                        return moment.utc(params.data.expectedStart.expectedStartDate).format('DD-MMM-YYYY');
                    }
                    else {
                        if (params.data.expectedStart?.expectedStartDateNote) {
                            return params.data.expectedStart.expectedStartDateNote;
                        }
                    }

                }

            case 'latestStartDate':
                if (params?.data?.latestStartDate) {
                    return moment.utc(params?.data?.latestStartDate).format('DD-MMM-YYYY');
                }
                break;
            case 'mbStatus':
                if (params.data.mbStatus) {
                    let returnText = ''
                    if (params.data.mbStatus.mbStatusId == dealMBStatus.SingleRegistration) {
                        returnText = 'N'
                    } else if (params.data.mbStatus.mbStatusId == dealMBStatus.ActiveMB || params.data.mbStatus.mbStatusId == dealMBStatus.PotentialMB) {
                        returnText = 'Y'
                    }
                    return returnText;
                }
                break;
            case 'likelihood':
                if (params.data.likelihood && params.data.likelihood.likelihoodId > 0) {
                    let renderedLikelihoodValue = "";

                    renderedLikelihoodValue = params.data.likelihood.label + '%'
                    return renderedLikelihoodValue


                }


                break;
            case 'sector':
                if (params.data.sector) {
                    let industryName = params.data.sector.map(r => r.industryName)
                    return industryName.join(',')

                }
                break;
            case 'subSector':
                if (params.data.subSector) {
                    let industryName = params.data.subSector.map(r => r.industryName)
                    return industryName.join(',')

                }
                break;
            case 'targetType':
                if (params.data.targetType) {
                    let targetTypeList = [];
                    if (params.data.targetType.isPubliclyTradedEquity) {
                        targetTypeList.push('PTE')
                    }
                    if (params.data.targetType.isPubliclyTradedDebt) {
                        targetTypeList.push('PTD')
                    }
                    if (params.data.targetType.isOpenMarketPurchase) {
                        targetTypeList.push('OMP')
                    }
                    if (params.data.targetType.carveOut) {
                        targetTypeList.push('CO')
                    }

                    return targetTypeList.join(',')

                }
                break;
            case 'expectedProjectName':
                if (params.data.expectedProjectName) {
                    return params.data.expectedProjectName;
                }
                break;

            case 'caseComplexity':
                if (params.data.caseComplexity) {
                    let caseComplexityName = params.data.caseComplexity.map(r => r.caseComplexityName)
                    return caseComplexityName.join(',')
                }

                break;
            case 'officeToBeStaffed':
                if (params.data.officeToBeStaffed) {
                    return params.data.officeToBeStaffed?.map((of) => of.officeName).join(', ');
                }
            case 'processInfo':
                if (params.data.processInfo) {

                    return params.data.processInfo;

                }
                break;
            case 'manager':
                if (params.data.manager) {
                    return CommonMethods.getEmployeeName(params.data.manager)
                }
                break;
            case 'submittedBy':
                if (params.data?.submittedBy) {
                    return CommonMethods.getEmployeeNames([params.data?.submittedBy], ';');
                }
            case 'weekStart':
                if (params.data.expectedStart) {
                    if (params.data.expectedStart.expectedStartDate) {
                        return CommonMethods.getWeekStart(params.data.expectedStart.expectedStartDate as Date);
                    }
                }
                break;
            case 'isOVPHelp': {
                return params?.data?.isOVPHelp ? 'Yes' : 'No';
            }

            case 'isSVPHelp': {
                return params?.data?.isSVPHelp ? 'Yes' : 'No';
            }
            case 'isRetainer': {
                return params?.data?.isRetainer == 1 ? 'Yes' :
                    params?.data?.isRetainer == 2 ? 'No' :
                        params?.data?.isRetainer == 3 ? 'I don’t know' : ''
            }
            case 'isMBPartner': {
                return params?.data?.isMBPartner == 1 ? 'Yes' :
                    params?.data?.isMBPartner == 2 ? 'No' :
                        params?.data?.isMBPartner == 3 ? 'I don’t know' : ''
            }
            case 'clientInformalName':
                if (params?.data?.clientInformalName) {
                    return params.data.clientInformalName;
                }
                break;
            case 'requiredLanguage':
                if (params.data?.requiredLanguage) {
                    return params.data?.requiredLanguage.join(',')

                }
                break;
            case 'opsLikelihood':
                if (params.data.opsLikelihood) {

                    return params.data.opsLikelihood.opsLikelihoodName;

                }
                break;
            case 'oppName':
                return params.data?.mbStatus;
            default:
                return column.splitChar && params.value ? params.value.length > 0 ? params.value.join(column.splitChar) : params.value : params.value;
        }
    }
}
