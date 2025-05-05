import { CommonMethods } from "../common/common-methods";
import { GridColumn } from "../interfaces/models";
import { dealMBStatus } from "../enums/deal-mbStatus.enum";

export class GridFilterValue {
    public static getFilterValue(column: GridColumn, params, columnDef) {
        if (column.splitChar) {
            if (typeof params.data[columnDef.field] == "object") {
                let val = CommonMethods.getEmployeeNameList(params.data[columnDef.field]);
                if (val != undefined && val.length > 0) {
                    return val
                }
                else {
                    return '';
                }
            }
            else if (params.data[columnDef.field]) {
                return params.data[columnDef.field].split(column.splitChar).map(item => item.trim());
            }
            else {
                return '';
            }
        } else {
            if (columnDef.field == 'iomp' || columnDef.field == 'spac' || columnDef.field == 'pte' || columnDef.field == 'isptd' || columnDef.field == 'hf') {
                var checkValue;
                if (params.data[columnDef.field] == true) {
                    checkValue = "Yes"
                } else if (params.data[columnDef.field] == false) {
                    checkValue = "No"
                }
                return checkValue;
            } else if (columnDef.field == 'stn') {
                return params.data[columnDef.field] ? params.data[columnDef.field].statusTypeName : '';
            } else if (columnDef.field == 'sb') {
                return CommonMethods.getEmployeeName(params.data.sb);
            } else if (columnDef.field == 'stage') {
                return params.data[columnDef.field] ? params.data[columnDef.field].stageTypeName : '';
            } else if (columnDef.field == 'stageStatus') {
                return params.data.registrationStage ? params.data.registrationStage.stageTypeName : '';
            } else if (columnDef.field == 'in') {
                return params.data[columnDef.field] ? params.data[columnDef.field].industryName : '';
            } else if (columnDef.field == 'cl') {
                return params.data[columnDef.field] ? params.data[columnDef.field].clientName : '';
            } else if (columnDef.field == 'caseCode' || columnDef.field == 'caseName' || columnDef.field == 'caseStartDate' || columnDef.field == 'caseEndDate' || columnDef.field == 'caseOfficeName' || columnDef.field == 'officeCluster') {
                return params.data.hasOwnProperty(columnDef.field) ? params.data[columnDef.field] : params.data['case'] ? params.data['case'][columnDef.field] : '';
            }
            else if (columnDef.field == 'hasDeal') {
                return params.data[columnDef.field] ? params.data.dealId : '';
            }
            else if (columnDef.field == 'hasRegistration' && params.data?.hasOwnProperty(columnDef.field)) {
                if (columnDef.headerName == 'Reg ID') {
                    return params.data.id ? params.data.id : '';
                }
                else if (columnDef.headerName == 'Opp ID') {
                    return params.data.registrationId ? params.data.registrationId : '';
                }
            } else if (columnDef.field == 'mbStatusName') {
                return params.data.mbStatus ? params.data.mbStatus.mbStatusName : '';
            } else if (columnDef.field == 'targetName' && params.data.target) {
                return params.data.target ? params.data.target.targetName : '';
            }
            else if(columnDef.field == 'submittedBy') {
            
                return CommonMethods.getEmployeeNames([params.data?.submittedBy], ';');
                    }
            else if (columnDef.field == 'clientName' && params.data.client && params.data.client.length > 0) {
                let clients = [];
                clients = params.data.client.map((eachClient) => {
                    return eachClient.clientName;
                })

                return clients.join(', ');
            }
            else if (columnDef.field == 'locationName' && params.data.locationOfDeal) {
                return params.data.locationOfDeal.locationName ? params.data.locationOfDeal.locationName : '';
            }
            else if (columnDef.field == 'workTypeName' && params.data.workType) {
                return params.data.workType.workTypeName ? params.data.workType.workTypeName : '';
            }
            else if (columnDef.field == 'stageTypeName' && params.data.registrationStage) {
                return params.data.registrationStage ? params.data.registrationStage.stageTypeName : '';
            }
            else if (columnDef.field == 'workToStartName' && params.data.workToStart) {
                return params.data.workToStart ? params.data.workToStart.workToStartName : '';
            }
            else if (columnDef.field == 'customPriority' && params.data.customPriority) {
                return CommonMethods.getCustomPriority(params.data);
            }
            else if (columnDef.field == 'targetType' && params.data.targetType) {

                let targetTypes: any[] = [];
                if (params.data.targetType.isPubliclyTradedEquity) {
                    targetTypes.push('PTE');
                }
                if (params.data.targetType.isPubliclyTradedDebt) {
                    targetTypes.push('PTD');
                }
                if (params.data.targetType.isOpenMarketPurchase) {
                    targetTypes.push('OMP');
                }
                if (params.data.targetType.carveOut) {
                    targetTypes.push('CO');
                }

                return targetTypes;
            }
            else if (columnDef.field == 'industries' && params.data.industries) {
                let industries = [];
                industries = params.data.industries.map((eachIndustry) => {
                    let industryName = eachIndustry.abbreviation ? eachIndustry.abbreviation : "";
                    return industryName;
                })

                return industries;
            }  
                         
            else if (columnDef.field == 'clientCommitment' && params.data.clientCommitment) {
                           return params.data.clientCommitment.clientCommitmentName;

            }
           
            else if (columnDef.field == 'opsLikelihood' ) {
                  return params.data.opsLikelihood?.opsLikelihoodName ? params.data.opsLikelihood.opsLikelihoodName : undefined;

              }
            else if (columnDef.field == 'operatingPartner' && params.data.operatingPartner?.partners?.length > 0) {

                let partnerList = CommonMethods.getEmployeeNameList(params.data.operatingPartner.partners)
                return partnerList.join(',');;
            }
            else if (columnDef.field == 'othersInvolved' && params.data.othersInvolved) {

                let partnerList = CommonMethods.getEmployeeNameList(params.data.othersInvolved)
                return partnerList.join(',');;
            }
            else if (columnDef.field == 'manager' && params.data.manager) {
                return CommonMethods.getEmployeeName(params.data.manager)

            }
            else if (columnDef.field == 'sellingPartner' && params.data.sellingPartner) {
                let partnerList = CommonMethods.getEmployeeNameList(params.data.sellingPartner)
                return partnerList.join(',');
            }
            else if (columnDef.field == 'svp' && params.data.svp?.partners?.length>0) {
                let partnerList = CommonMethods.getEmployeeNameList(params.data.svp.partners)
                return partnerList.join(',');
            }
            else if (columnDef.field == 'mbStatus' && params.data.mbStatus) {

                let returnText = ''
                if (params.data.mbStatus.mbStatusId == dealMBStatus.SingleRegistration) {
                    returnText = 'N'
                } else if (params.data.mbStatus.mbStatusId == dealMBStatus.ActiveMB || params.data.mbStatus.mbStatusId == dealMBStatus.PotentialMB) {
                    returnText = 'Y'
                }
                return returnText;
            }
            else if (columnDef.field == 'workPhase' && params.data.workPhase) {


                let workPhase = params.data.workPhase;
                let workPhaseList = [];
                if (workPhase.isContinuation) {
                    workPhaseList.push('Continuation Phase');
                }
                if (workPhase.isNext) {
                    workPhaseList.push('Next phase');
                }
                if (workPhase.isRestartPhase) {
                    workPhaseList.push('Restart Phase');
                }
                if (workPhase.relatedCaseCode) {
                    workPhaseList.push(workPhase.relatedCaseCode);
                }
                return workPhaseList.join(', ');
            }
            else if (columnDef.field == 'likelihood' && params.data) {
                if (params.data.likelihood && params.data.likelihood.likelihoodId > 0) {
                    return (params.data.likelihood.label);
                } else {
                    return ""

                }

            }
            else if (columnDef.field == 'duration' && params.data.duration) {
                if (params.data.duration) {
                    return params.data.duration;
                }
            }
            else if (columnDef.field == 'expectedStart' && params.data.expectedStart) {
                if (params.data.expectedStart) {
                    let expectedStart = '';
                    if (params.data.expectedStart.expectedStartDate) {
                        expectedStart = params.data.expectedStart.expectedStartDate
                    }
                    return expectedStart;
                }
            }
            else if (columnDef.field == 'pipelineSubmittedDate' && params.data.pipelineInfoRequestedDate) {
                if (params.data.pipelineInfoRequestedDate) {
                    let pipelineInfoRequestedDate = '';
                    if (params.data.pipelineInfoRequestedDate) {
                        pipelineInfoRequestedDate = params.data.pipelineInfoRequestedDate
                    }
                    return pipelineInfoRequestedDate;
                }
            }
            else if (columnDef.field == 'clientType' && params.data.clientType) {
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
            }

            else if (columnDef.field == 'location' && params.data.location) {
                let locationList = [];
                if (params.data.location && params.data.location.preferred) {

                    params.data.location.preferred.map((office) => {
                        locationList.push(office.office.officeAbbr);
                    });
                    locationList.join(', ');
                }
                if (params.data.location && params.data.location.allocated) {


                    params.data.location.allocated.map((office) => {
                        locationList.push(office.office.officeAbbr);
                    });
                    locationList.join(', ');
                }
                if (params.data.location && params.data.location.conflicted) {


                    params.data.location.conflicted.map((office) => {
                        locationList.push(office.office.officeAbbr);
                    });
                    locationList.join(', ');
                }
                return locationList;
            }
            else if (columnDef.field == 'teamSize' && params.data.teamSize) {
                let teamSizelist = [];
                params.data.teamSize.map((teamSize) => {
                    teamSizelist.push(teamSize.teamSize);
                });
                return teamSizelist.join(',');
            }
            else if (columnDef.field == 'requiredLanguage' && params?.data?.requiredLanguage) {
                return params?.data?.requiredLanguage.join(',');
            } else if (columnDef.field == 'caseComplexity' && params.data.caseComplexity) {
                let caseComplexitylist = [];
                params.data.caseComplexity.map((caseComplexityName) => {
                    caseComplexitylist.push(caseComplexityName.caseComplexityName);
                });
                return caseComplexitylist.join(',');
            } else if (columnDef.field == 'expectedProjectName' && params.data.expectedProjectName) {
                return params.data?.expectedProjectName ? params.data?.expectedProjectName : '';
            } else if (columnDef.field == 'processInfo' && params.data.processInfo) {
                return params.data?.processInfo ? params.data?.processInfo : '';
            } else if (column.field == 'oppStage') {
                return params.data && params.data.opportunityStage ? params.data.opportunityStage.opportunityStageName : "others";

            }  else if (columnDef.field == 'additionalServicesName' && params.data.additionalServices) {
                let additionalServiceslist = [];
                params.data.additionalServices.map((additionalServices) => {
                    additionalServiceslist.push(additionalServices.additionalServicesName);
                });
                return additionalServiceslist.join(',');
            } else if (columnDef.field == 'officeToBeStaffed' && params.data.officeToBeStaffed) {
                if (params.data.officeToBeStaffed) {
                    return params.data.officeToBeStaffed?.map((of) => of.officeName).join(', ');
                }
            } else if (columnDef.field == 'securityUserName' && params.data.securityUser) {
                return params.data.securityUser.firstName + " " + params.data.securityUser.lastName;
            } else if (columnDef.field == 'securityRole' && params.data.securityRole) {
                return params.data.securityRole.name;
            } else if (columnDef.field == 'adminNotes' && params.data.note) {
                return params.data.note.trim();
            } else if (columnDef.field == 'modifiedBy' && params.data.modifiedBy) {
                return params.data.modifiedBy.firstName + " " + params.data.modifiedBy.lastName;
            } else if (columnDef.field == 'legalStatus' && params.data.registrationStatus) {
                return params?.data?.registrationStatus?.statusTypeName;
            } else if (columnDef.field == "weekStart") {
                if (params.data.expectedStart && params.data.expectedStart.expectedStartDate) {
                        return new Date(CommonMethods.getWeekStart(params.data.expectedStart.expectedStartDate as Date));
                }else{
                    return "";
                }             
            }
            else if (column.field == 'clientInformalName') {
                if (params.data?.clientInformalName) {
                    return params.data.clientInformalName;
                }
                else {
                    return "";
                } 
            }
           else if (columnDef.field == 'requestedSM') {
                if (params?.data?.requestedSM && params?.data?.requestedSM.length > 0) {
                    let partnerList = CommonMethods.getEmployeeNameList(params?.data?.requestedSM);
                    return partnerList.join(',');

                }
            }  else if (columnDef.field == 's' && params.data.sellingPartner) {
                let partnerList = CommonMethods.getEmployeeNameList(params.data.sellingPartner)
                return partnerList.join(',');
            } else if(column.field == 'targetDescriptionDT'){
                return params.data.targetDescription;
            } else if(column.field == "supportedWinner"){
                return params.data.supportedWinningBidder;
            } else if(column.field == "dealInTheNews"){
                return params?.data?.isDealNews ? params?.data?.isDealNews : "No" ;
            }
            else if(column.field == "sellSideStatusId"){
                return params?.data?.sellSideStatus ? params?.data?.sellSideStatus.sellSideStatusName : "" ;
            }
            else if (columnDef.field == 'bidDate' && params.data.bidDate) {
                if (params.data.bidDate) {
                    let bidDate = '';
                    if (params.data.bidDate) {
                        bidDate = params.data.bidDate
                    }
                    return bidDate;
                }
            }
            else {
                return params.data[columnDef.field];
            }
        }

    }
}
