import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { CoreService } from '../core/core.service';
import { deals, DealList, taggedPeople, DealExpertsList, ResourceAllocationInfomration } from './deal';
import { Employee } from '../shared/interfaces/Employee';
import { expertGroup } from './new-deal/deal-experts/expertGroup';
import { Case } from '../shared/interfaces/case';
import { DealTracker } from './dealTracker';
import { Expert } from './new-deal/deal-experts/expert';
import { Client } from '../shared/interfaces/client';
import { DealClientNote } from './dealClientNote';

@Injectable()
export class DealsService {
    private baseApiUrl: any;
    private apiurl: any;
    private baseGatewayApiUrl: any
    public roleFieldValues;
    public dealId: number = undefined;
    public editDeal: BehaviorSubject<deals> = new BehaviorSubject<deals>(null);
    public multipleRegToDeal: BehaviorSubject<deals> = new BehaviorSubject<deals>(null);
    public AddRegistrationToDeal: BehaviorSubject<deals> = new BehaviorSubject<deals>(null);
    public region: Observable<any>;
    public isReadyForAllocation: boolean = false;
    public switchTab: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public dealBackup: deals;
    public isFromRegistration: boolean = false;
    public updateOfficeCluster: Subject<number> = new Subject<number>();
    public updateResource: Subject<string> = new Subject<string>();
     updateClientStage = new Subject<any>();
    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
        this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }

    public deleteAppSession(appSession): Observable<boolean> {
        const apiUrl = this.baseApiUrl + 'api/general/deleteAppSession';
        return this.http.post<boolean>(apiUrl, appSession, { withCredentials: true });
    }
    public validateTrackerState(trackerID: number): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'validateTrackerState/validateTrackerState?trackerID=' + trackerID;
        return this.http.get<number>(apiUrl);
    }
    public deleteDealById(trackerID: number): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'deleteDealById/deleteDealById?trackerID=' + trackerID;
        return this.http.get<number>(apiUrl);
    }
    public getDealTaggedPeopleById(dealId: number): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'getDealTaggedPeopleById/getDealTaggedPeopleById';
        if (dealId == undefined) {
            dealId = 0
        }
        return this.http.get<any>(apiUrl + '?dealId=' + dealId, { withCredentials: true });
    }
    public getClientsByName(query: any): Observable<Client[]> {
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/GetClientByClientName';
        return this.http.post<Client[]>(apiUrl, { value: query });
    }
    public getDeals(sTrackerStatus): Observable<DealList[]> {
        let employeeCode = this.coreService.loggedInUser.employeeCode;
        let userRegion = this.coreService.loggedInUser.employeeRegionId;
        if (!userRegion) {
            userRegion = 0;
        }
        const apiUrl = this.baseApiUrl + 'api/deals/getdeals' + '?employeeCode=' + employeeCode + '&sTrackerStatus=' + sTrackerStatus + '&userRegion=' + userRegion;
        return this.http.get<DealList[]>(apiUrl);

    }

    public convertToDeal(deal: deals): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/deal/InsertDeal';
        return this.http.post(apiUrl, deal);
    }

    public saveTaggedPeople(taggedPeople: taggedPeople): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/deals/saveTaggedPeople';
        return this.http.post(apiUrl, taggedPeople, { withCredentials: true });
    }

    public getEmployeeByName(query: string, levelStatusCode: string, levelGrade: string, includeAllEmployee?: boolean, includeExternalEmployee?: boolean): Observable<Employee[]> {
        const apiUrl = this.baseApiUrl + 'api/employee/getEmployeeByName';
        if (includeAllEmployee == undefined) {
            includeAllEmployee = false;
        }
        if (includeExternalEmployee == undefined) {
            includeExternalEmployee = false;
        }
        query = (query == null) ? '' : query;
        return this.http.get<Employee[]>(apiUrl + "?query=" + query + "&includeAllEmployee=" + includeAllEmployee + "&includeExternalEmployee=" + includeExternalEmployee + '&levelStatusCode=' + levelStatusCode + '&levelGrade=' + levelGrade);
    }

    public getResouceAllocatioInformation(caseCode: string): Observable<ResourceAllocationInfomration[]> {
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/deal/GetResourceAllocation';
        return this.http.get<ResourceAllocationInfomration[]>(apiUrl + "?casecode=" + caseCode);
    }

    public getExpertGroup(dealId): Observable<expertGroup[]> {
        const apiUrl = this.baseApiUrl + 'api/deals/GetExpertGroup?dealId=' + dealId;
        return this.http.get<expertGroup[]>(apiUrl);
    }

    public getDealById(dealId, isReadOnlyMode): Observable<any> {
        let employeeCode = this.coreService.loggedInUser.employeeCode;
        //const apiUrl = this.baseApiUrl + 'api/deals/getDealById?dealId=' + dealId + '&employeeCode=' + employeeCode + '&isReadOnlyMode=' + isReadOnlyMode;
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/deal/GetDealById?dealId=' + dealId.toString() + '&employeeCode=' + employeeCode + '&isReadOnlyMode=' + isReadOnlyMode;
        return this.http.get<deals>(apiUrl);
    }    
    public getPAMAccessOnDealTracker(dealId): Observable<any> {
        //const apiUrl = this.baseApiUrl + 'api/deals/getDealById?dealId=' + dealId + '&employeeCode=' + employeeCode + '&isReadOnlyMode=' + isReadOnlyMode;
        const apiUrl = this.baseApiUrl + 'api/dealtracker/getPAMAccessOnDealTracker?dealId=' + dealId.toString();
        return this.http.get<boolean>(apiUrl);
    }   
    public setDealId(dealId) {
        this.dealId = dealId;
    }

    public getDealId(): number {
        return this.dealId;
    }

    public saveExpertGroup(expertGroup: expertGroup): Observable<expertGroup> {
        const apiUrl = this.baseApiUrl + 'api/deals/SaveExpertGroup';
        return this.http.post<expertGroup>(apiUrl, expertGroup, { withCredentials: true });
    }
    public saveExpertGroups(expertGroup: expertGroup): Observable<expertGroup> {
        const apiUrl = this.baseGatewayApiUrl + 'keySaveExpertGroup/dealTracker/SaveExpertGroup';
        return this.http.post<expertGroup>(apiUrl, expertGroup, { withCredentials: true });
    }


       public saveExpert(expert: Expert): Observable<Expert> {
        const apiUrl = this.baseGatewayApiUrl + 'keysaveScalerExpert/dealTracker/saveScalerExpert';

       return this.http.post<Expert>(apiUrl, expert, { withCredentials: true });
    }
    public deleteExpertGroupById(expertGroupId: number, dealId: number): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/DealTracker/deleteExpertGroupById?expertGroupId=' + expertGroupId + '&dealId=' + dealId;
        return this.http.get<number>(apiUrl);
    }
    public deleteExpertById(expertId: number, dealId: number): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/DealTracker/deleteExpertById?expertId=' + expertId + '&dealId=' + dealId;
        return this.http.get<number>(apiUrl);
    }

    public getClientHeadsByClientName(clientId: any): Observable<any[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyGetClientHeadByClientCode?clientCode=' + clientId;
        return this.http.get<any[]>(apiUrl);
    }

    public getDealsByName(searchText): Observable<DealList[]> {
        let roleID = this.coreService.loggedInUserRoleId;
        const apiUrl = this.baseApiUrl + 'api/deals/GetDealsByName' + '?searchText=' + searchText + '&roleId=' + roleID;
        return this.http.get<DealList[]>(apiUrl);
    }

    public addRegistrationsToTracker(registrations, dealId): Observable<any[]> {
        const apiUrl = this.baseApiUrl + 'api/deals/addRegistrationsToTracker';
        return this.http.post<any[]>(apiUrl, { addRegistrationsTrackerInfo: registrations, dealId: dealId, submittedBy: this.coreService.loggedInUser.employeeCode }, { withCredentials: true });
    }

    public createNewTrackerFromCopy(deal: deals): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/deals/insertDealFromCopy';
        return this.http.post(apiUrl, deal, { withCredentials: true });
    }

    public getMBTrackerReport(filteredData: any, offset: any): Observable<any> {
        let roleID = this.coreService.loggedInUserRoleId;
        const apiUrl = this.baseGatewayApiUrl + 'keyGetExpertiesTrackerReport/deal/GetExpertiesTrackerReport' + '?offset=' + offset + '&roleId=' + roleID;
        return this.http.post(apiUrl, filteredData, { withCredentials: true });
    }

    

    public formateAllocationNote(note: string, showFullText: boolean) {
        if (!showFullText && note) {

            if (note.split(/\r\n|\r|\n/).length >= 4) {

                return note.split("\n", 4).join("\n")
            }
            else {
                return note.substr(0, 400);
            }
        }
        else {
            if (note) {
                return note;
            }
        }
    }

    public splitAndRemoveTextSpace(allocationNoteFormatted: string) {
        let textList = [];
        let text = allocationNoteFormatted.split('<br/>');
        text.forEach(s => {
            textList.push(s.replace(/&nbsp;/g, ' ').trim());
        });
        return textList;
    }

    public getLinkedRegistrations(registrationIds: string[]): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/deals/getLinkedRegistrations';
        return this.http.post(apiUrl, registrationIds, { withCredentials: true });
    }

    public getDealsToImportExperts(searchText): Observable<DealExpertsList[]> {
        let roleID = this.coreService.loggedInUserRoleId;
        let userRegion = this.coreService.loggedInUser.employeeRegionId;
        if (!userRegion) {
            userRegion = 0;
        }
        const apiUrl = this.baseApiUrl + 'api/deals/getDealsToImportExperts' + '?searchText=' + searchText + '&roleId=' + roleID + '&employeeCode=' + this.coreService.loggedInUser.employeeCode + '&userRegion=' + userRegion;
        return this.http.get<DealExpertsList[]>(apiUrl);
    }

    public getCCMCasesByName(query: any): Observable<Case[]> {
        const apiUrl = this.baseGatewayApiUrl + 'case/GetCCMDetails';
        return this.http.get<Case[]>(apiUrl + '?searchText=' + query);
    }

    // Deal v2 API calls
    public upsertDealTracker(dealTracker: DealTracker, fieldName: string): Observable<DealTracker> {
        const apiUrl = this.baseApiUrl + 'api/dealTracker/upsertDeal?fieldName=' + fieldName;
        return this.http.post<DealTracker>(apiUrl, dealTracker, { withCredentials: true });
    }

    public saveDealClientAllocationNotes(dealClientNote:DealClientNote): Observable<DealTracker> {
        const apiUrl = this.baseApiUrl + 'api/dealTracker/saveDealClientAllocationNotes';
        return this.http.post<DealTracker>(apiUrl, dealClientNote,{ withCredentials: true });
    }

    public upsertCase(caseInfo: Case, dealClientId: number, registrationId: number):Observable<number> {
        const apiUrl = this.baseApiUrl + 'api/dealTracker/upsertCase?dealClientId=' + dealClientId + '&registrationId=' + registrationId;
        return this.http.post<number>(apiUrl, caseInfo, { withCredentials: true });
    }

    public upsertStage(stageId: number, dealClientId: number, registrationId: number):Observable<number> {
        const apiUrl = this.baseApiUrl + 'api/dealTracker/upsertStage?stageId=' + stageId + '&registrationId=' + registrationId + '&dealClientId=' + dealClientId;
        return this.http.post<number>(apiUrl, { withCredentials: true });
    }

    public upsertClient(client: Client, dealId: number):Observable<number> {
        const apiUrl = this.baseApiUrl + 'api/dealTracker/upsertClient?dealId=' + dealId;
        return this.http.post<number>(apiUrl, client, { withCredentials: true });
    }

    public getDealTrackerById(dealId: string):Observable<any>{
        const apiUrl = this.baseApiUrl + 'api/dealTracker/getDealTrackerById?dealId=' + dealId;
        return this.http.get<any>(apiUrl, { withCredentials: true });
    }

    public getDealCapabilitiesById(dealId: string): Observable<any>{
        const apiUrl = this.baseApiUrl + 'api/dealTracker/getDealCapabilitiesById?dealId=' + dealId;
        return this.http.get<any>(apiUrl, { withCredentials: true });
    }

    public getMBStrategyById(dealId): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/deal/getMbStrategyById?dealId=' + dealId.toString();
        return this.http.get<DealTracker>(apiUrl);
    }
    public getOpportunityExpertDetailsById(registrationId): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'keyGetOpportunityExpertInfoByRegistrationId/getOpportunityExpertDetailsById?registrationId='+registrationId.toString();
        return this.http.get<DealTracker>(apiUrl);
    }
    public getOpportunityPipelineDetailsById(registrationId): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'keyGetOpportunityPipelineInfoByRegistrationId/getOpportunityPipelineDetailsById?registrationId='+registrationId.toString();
        return this.http.get<any>(apiUrl);
    }
}
