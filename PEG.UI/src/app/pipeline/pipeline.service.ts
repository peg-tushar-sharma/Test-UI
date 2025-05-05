import { AuditLog } from "../shared/AuditLog/AuditLog";
import { BucketGroup, PipelineBucketGroupInfo } from "./bucketGroup";
import { CoreService } from "../core/core.service";
import { Employee } from "../shared/interfaces/Employee";
import { EmployeNotes, OfficeNotes, PipelineBucket } from "./pipelineBucket";
import { GridColumn } from "../shared/interfaces/grid-column.interface";
import { HttpClient } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { BehaviorSubject, firstValueFrom, Observable, Subject } from "rxjs";
import { OpportunityFlag } from "../shared/interfaces/opportunityFlag";
import { OpportunityStageStatusInfo } from "./opportunity-stage-status-info";
import { Pipeline } from "./pipeline";
import { PipelineBucketMapping } from "./pipelineBucketMapping";
import { UserFilter } from "./userFilter";
import { UserPreference } from "./userPreference";
import { opportunityPosition } from "./opportunityPosition";

export const CONTAINER_DATA = new InjectionToken<{}>("CONTAINER_DATA");

@Injectable()
export class PipelineService {
    
  private pipelinePositionDataSubject = new BehaviorSubject<any>(null); // Store API data
  pipelinePosition$ = this.pipelinePositionDataSubject.asObservable(); // Expose observable for subscription

    private baseApiUrl: any;
    public dragDropAccess = [];
    public bucketGroupDragDropAccess = [];
    public mappingDragDropAccess = [];
    private gatewayApiUrl: any;
    regionFilterChange = new Subject<any>();
    deletePipelineBucket = new Subject<any>();
    deletePipelineBucketGroup = new Subject<any>();
    updateOppStage = new Subject<any>();
    preferenceChanges$ = new Subject<any>();

    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
        this.gatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }

    getUserPreferenceRegion() {
        let employeeCode = this.coreService.loggedInUser.employeeCode;
        const apiUrl =
            this.gatewayApiUrl + "keyGetUserPreferenceRegion/getUserPreferenceRegion?employeeCode=" + employeeCode;
        return this.http.get<any>(apiUrl);
    }

    getUserByPage(pageId): Observable<Employee[]> {
        const apiUrl = this.baseApiUrl + "api/Users/getUsersByPage?pageId=" + pageId;
        return this.http.get<Employee[]>(apiUrl);
    }

    getPipelineData(regionFilterText: string, oppStageFilter: string, filterTypes): Observable<Pipeline[]> {
        let employeeCode = this.coreService.loggedInUser.employeeCode;
        let roleID = this.coreService.loggedInUserRoleId;
        const apiUrl =
            this.gatewayApiUrl +
            "keygetPipelineData/GetPipelineGridData" +
            "?roleId=" +
            roleID +
            "&employeeCode=" +
            employeeCode +
            "&selectedRegions=" +
            regionFilterText +
            "&oppStage=" +
            oppStageFilter + 
            "&filterTypes=" + filterTypes;
        return this.http.get<Pipeline[]>(apiUrl);
    }

    // To show the pipeline export section
    private pipelineExportSource = new Subject<any>();
    pipelineExport$ = this.pipelineExportSource.asObservable();
    public isExport = true;

    showPipelineExport(selType) {
        var data = [
            {
                enableExport: this.isExport,
                selectedType: selType
            }
        ];
        this.pipelineExportSource.next(data);
    }

    //To re-create new grid based on selected visibility/ordering
    public pipelineNewGrid = new Subject<any>();
    redrawPipeGrid$ = this.pipelineNewGrid.asObservable();

    recreatePipelineGrid(selColumns) {
        this.pipelineNewGrid.next(selColumns);
    }

   

    public getUserColumns(pageId: number): Observable<GridColumn[]> {
        const apiUrl = this.gatewayApiUrl + "keyPipelineGridColumn/PipelineGridColumn";
        return this.http.get<GridColumn[]>(
            apiUrl + "?employeeCode=" + this.coreService.loggedInUser.employeeCode + "&pageId=" + pageId,
            { headers: { cache: "yes" } }
        );
    }

    public getPipelineById(registrationId: number): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyPipelineGetPipeline/getPipelineById";
        return this.http.get<any>(
            apiUrl +
            "?employeeCode=" +
            this.coreService.loggedInUser.employeeCode +
            "&registrationId=" +
            registrationId,
            { headers: { cache: "yes" } }
        );
    }

    public savePipelineColumnPrefrences(columns, resetColumnOrdering: boolean): Observable<GridColumn[]> {
        const apiUrl = this.gatewayApiUrl + "keysavePipelineColumnPreferences/savePipelineColumnPreferences";
        return this.http.post<any>(apiUrl + "?resetColumnOrdering=" + resetColumnOrdering, columns, {
            withCredentials: true
        });
    }

    public updatePipeline(pipeline, field, regionFilterText): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyupdatePipeline/updatePipeline";
        let employeeRegionId = this.coreService.loggedInUser.employeeRegionId;
        pipeline.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        return this.http.post<any>(
            apiUrl +
            "?field=" +
            field.charAt(0).toUpperCase() +
            field.substr(1) +
            "&selectedRegions=" +
            regionFilterText +
            "&currentEmployeeRegion=" +
            employeeRegionId,
            pipeline,
            { withCredentials: true }
        );
    }

    public deletePipelineRegistratinAndOppruntiy(pipeline): Observable<boolean> {
        const apiUrl = this.gatewayApiUrl + "keyPipeline/deletePipelineAndOpportunity";
        return this.http.post<boolean>(apiUrl, pipeline, { withCredentials: true });
    }

    public upsertPipelineBucket(
        pipelineBucket: PipelineBucket,
        weekOffset: number,
        region: string
    ): Observable<PipelineBucketGroupInfo> {
        pipelineBucket.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        if (region == "") {
            region = null;
        }

        let employeeRegionId = this.coreService.loggedInUser.employeeRegionId;
        const apiUrl = this.gatewayApiUrl + "KeyupdatePipelineBucket/updatePipelineBucket";
        return this.http.post<PipelineBucketGroupInfo>(
            apiUrl + "?currentEmployeeRegion=" + employeeRegionId + "&weekOffset=" + weekOffset + "&region=" + region,
            pipelineBucket,
            { withCredentials: true }
        );
    }
    deleteBucketDataAutomation(registrationId: number, weekOffset: number, region: string,fieldName:string): Observable<any> {

        let employeeRegionId = this.coreService.loggedInUser.employeeRegionId;
        const apiUrl = this.gatewayApiUrl +
         "keyPipelineDeleteBucketDataAutomation/deleteBucketDataAutomation?registrationId="+ registrationId
         + "&currentEmployeeRegion=" + employeeRegionId + "&weekOffset=" + weekOffset + "&region=" + region + "&fieldName=" + fieldName;
        return this.http.post<any>(apiUrl, { withCredentials: true });
    }
    public upsertPipelineGroup(
        bucketGroup: BucketGroup,
        weekOffset: number,
        region: string
    ): Observable<PipelineBucketGroupInfo> {
        const apiUrl = this.gatewayApiUrl + "KeyupdatePipelineGroup/updatePipelineGroup";
        if (region == "") {
            region = null;
        }
        let employeeRegionId = this.coreService.loggedInUser.employeeRegionId;
        bucketGroup.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        return this.http.post<PipelineBucketGroupInfo>(
            apiUrl + "?weekOffset=" + weekOffset + "&region=" + region +"&employeeRegionId=" + employeeRegionId,
            bucketGroup
        );
    }

    public updatePipelineGroupOrder(bucketGroups: BucketGroup[]): Observable<boolean> {
        const apiUrl = this.gatewayApiUrl + "KeyupdatePipelineGroup/updatePipelineGroupOrder";

        let self = this;
        bucketGroups.forEach(function (group, index) {
            group.lastUpdatedBy = self.coreService.loggedInUser.employeeCode;
        });

        return this.http.post<boolean>(apiUrl, bucketGroups);
    }

    public getPipelineBucket(weekOffset: number, region: string): Observable<PipelineBucketGroupInfo> {
        let employeeRegionId = this.coreService.loggedInUser.employeeRegionId;
        if (region == "") {
            region = null;
        }
        const apiUrl = this.gatewayApiUrl + "KeyGetPipelineBucketData/getPipelineBucketData";
        return this.http.get<PipelineBucketGroupInfo>(
            apiUrl + "?currentEmployeeRegion=" + employeeRegionId + "&weekOffset=" + weekOffset + "&region=" + region
        );
    }
    public getEmployeeLocationByName(
        query: string,
        levelStatusCode: string,
        levelGrade: string,
        includeAllEmployee?: boolean,
        includeExternalEmployee?: boolean,
        ringfenceStart?: string
    ): Observable<any[]> {
        const apiUrl = this.gatewayApiUrl + "keyGetRingfenceEmployeesLocation/GetRingfenceEmployeeLocation";
        if (includeAllEmployee == undefined) {
            includeAllEmployee = false;
        }
        if (includeExternalEmployee == undefined) {
            includeExternalEmployee = false;
        }
        query = query == null ? "" : query;
        return this.http.get<Employee[]>(
            apiUrl +
            "?query=" +
            query +
            "&includeAllEmployee=" +
            includeAllEmployee +
            "&includeExternalEmployee=" +
            includeExternalEmployee +
            "&levelStatusCode=" +
            levelStatusCode +
            "&levelGrade=" +
            levelGrade +
            "&ringfenceStart=" +
            ringfenceStart
        );
    }

    public saveNote(employeNotes: EmployeNotes): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyEmployee/saveEmployeeNote";
        employeNotes.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        return this.http.post<any>(apiUrl, employeNotes);
    }

    public getEmployeeNote(employeeCode: string): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyEmployee/getEmployeeNote";
        return this.http.get<EmployeNotes>(apiUrl + "?employeeCode=" + employeeCode);
    }

    public saveOfficeNote(officeNotes: OfficeNotes): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyOffice/saveOfficeNote";
        officeNotes.lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        return this.http.post<any>(apiUrl, officeNotes);
    }

    public getOfficeNote(officeCode: string, pipelineBucketId:number): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyOffice/getOfficeNote";
        return this.http.get<OfficeNotes>(apiUrl + "?officeCode=" + officeCode + "&pipelineBucketId="+pipelineBucketId);
    }

    public updatePageSettings(userPreference: UserPreference): Observable<any> {
        userPreference?.region.forEach((element) => {
            element.employeeCode = this.coreService.loggedInUser.employeeCode;
        });
        const apiUrl = this.baseApiUrl + "api/Pipeline/updatePageSettings";
        return this.http.post<any>(apiUrl, userPreference);
    }
    public sendPipelineOpportunityData(data): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyPipelineOppData/sendPipelineOpportunityData";
        return this.http.post<any>(apiUrl, data);
    }
    public getUserColumnPreference(): Observable<any> {
        const apiUrl = this.baseApiUrl + "api/pipeline/getColumnSettings";
        return this.http.get<any>(apiUrl);
    }
    public saveUserPreferenceGroupColumn(data, pageId, employeeCode): Observable<any> {
        const apiUrl =
            this.baseApiUrl +
            "api/UserPreference/saveUserPreferenceGroupColumn?pageId=" +
            pageId +
            "&employeeCode=" +
            employeeCode;
        return this.http.post<any>(apiUrl, data);
    }

    public updateBulkOppStage(pipelineId, stageId): Observable<any> {
        const apiUrl =
            this.baseApiUrl + "api/Pipeline/UpdateBulkStage?pipelineId=" + pipelineId + "&stageId=" + stageId;
        return this.http.get<any>(apiUrl);
    }
    public setOpportunityStageStatus(mappingData: OpportunityStageStatusInfo): Observable<any> {
        let lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        mappingData.lastUpdatedBy = lastUpdatedBy;
        const apiUrl = this.baseApiUrl + 'api/Pipeline/setOpportunityPipelineStatus';
        return this.http.post<any>(apiUrl, mappingData);
    }
    public updateOpsLikelihood(RegId)
    {
        const apiUrl = this.baseApiUrl + "api/Pipeline/updateOpsLikelihood?registrationId=" +RegId;
        return this.http.post<any>(apiUrl, { withCredentials: true });
    }
    public upsertUserFilter(userFilter: UserFilter): Observable<any> {
        const apiUrl = this.baseApiUrl + "api/Pipeline/upsertUserFilter";
        return this.http.post<any>(apiUrl, userFilter, { withCredentials: true });
    }

    public getUserFilter(): Observable<any> {
        const apiUrl =
            this.baseApiUrl + "api/Pipeline/getUserFilter?employeeCode=" + this.coreService.loggedInUser.employeeCode;
        return this.http.get<any>(apiUrl);
    }
    public getFilterByFilterId(filterId: number, pageId: number): Observable<any> {
        const apiUrl =
            this.baseApiUrl +
            "api/Pipeline/getFilterByFilterId?filterId=" +
            filterId +
            "&employeeCode=" +
            this.coreService.loggedInUser.employeeCode +
            "&pageId=" +
            pageId;
        return this.http.get<any>(apiUrl);
    }

    public shareFilter(filterTemplateId, employeeCodes, isShareWithEveryone): Observable<boolean> {
        let lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        const apiUrl =
            this.baseApiUrl +
            "api/Pipeline/shareFilter?filterTemplateId=" +
            filterTemplateId +
            "&employeeCodes=" +
            employeeCodes +
            "&isShareWithEveryone=" +
            isShareWithEveryone +
            "&lastUpdatedBy=" +
            lastUpdatedBy;
        return this.http.post<boolean>(apiUrl, { withCredentials: true });
    }

    public getSharedUserFilter(filterTemplateId): Observable<any> {
        const apiUrl = this.baseApiUrl + "api/Pipeline/getSharedUserFilter?filterTemplateId=" + filterTemplateId;
        return this.http.get<any>(apiUrl);
    }

    public getPipelineAuditLog(pipelineId: Number, registrationId: Number): Observable<AuditLog[]> {
        const apiUrl =
            this.gatewayApiUrl + "keyPipelineAuditLog?pipelineId=" + pipelineId + "&registrationId=" + registrationId;
        return this.http.get<any>(apiUrl, { withCredentials: true });
    }

    public insertPipelineAuditLog(pipelineAuditLog): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "keyInsertPipelineAuditLog";
        return this.http.post<any>(apiUrl, pipelineAuditLog, { withCredentials: true });
    }

    public getRelatedTrackerClientsByRegistrationId(registrationId): Observable<any> {
        const apiUrl =  this.gatewayApiUrl + "KeyGetRelatedTrackerClientsByRegistrationId/getRelatedTrackerClientsByRegistrationId?registrationId=" + registrationId;
        return this.http.get<any>(apiUrl, { withCredentials: true });
    }
    public getRelatedTrackerClientsByRegistrationIdPromise(registrationId):Promise<any> {
        const apiUrl =  this.gatewayApiUrl + "KeyGetRelatedTrackerClientsByRegistrationId/getRelatedTrackerClientsByRegistrationId?registrationId=" + registrationId;
        return this.http.get<any>(apiUrl, { withCredentials: true }).toPromise();
    }

    public createAutomatedPlaceholder(
        caseEndDate: string,
        registrationId: number
    ): Observable<any> {
        const apiUrl =
            this.baseApiUrl +
            "api/Pipeline/createAutomatedPlaceholder?caseEndDate=" +
            caseEndDate +
            "&registrationId=" +
            registrationId;
        return this.http.post<any>(apiUrl, { withCredentials: true });
    }

    public getEmployeeDetailsByCode(employeeCode): Observable<any> {
        const apiUrl = this.baseApiUrl + "api/employee/getSignalrEmployeeByEmployeeCodes?employeeCode=" + employeeCode;
        return this.http.get<any>(apiUrl);
    }    
    public updateOpportunitiesFlag(registrationIds): Observable<OpportunityFlag[]> {
        const apiUrl = this.gatewayApiUrl + "keyUpdateOpportunitiesFlag";
        return this.http.post<any>(apiUrl, registrationIds, { withCredentials: true });
    }

    public updateOpportunitiesPartnerFlag(registrationIds, flagValue): Observable<OpportunityFlag[]> {
        const apiUrl = this.gatewayApiUrl + "keyUpdateOpportunitiesPartnerFlag?flagValue=" + flagValue;
        return this.http.post<any>(apiUrl, registrationIds, { withCredentials: true });
    }

    public mergeGroups(sourceGroupId:number[], targetGroupId: number): Observable<any> {
        const apiUrl = this.gatewayApiUrl + "KeyMergePipelineBuckectGroup/mergePipelineBuckectGroup";
        let mergeBucketGroup = { sourceGroupId: sourceGroupId, targetGroupId: targetGroupId }
        return this.http.post<any>(apiUrl, mergeBucketGroup, { withCredentials: true });
    }
    public clonePipelineOpportunity(registrationId): Observable<Pipeline> {
        const apiUrl = this.gatewayApiUrl + "keyClonePipelineOpportunity";
        return this.http.post<any>(apiUrl, registrationId, { withCredentials: true });
    }  
    public getOpportunityPosition(registrationId:number) {
        const apiUrl = this.gatewayApiUrl + "KeyGetOppPosition/getOppPosition?registrationId=" + registrationId;
         this.http.get<opportunityPosition>(apiUrl).subscribe((response)=>{
            this.pipelinePositionDataSubject.next(response); // Emit the data
         }
        );
    }    

    public getOpportunityPositionSynch(registrationId:number) : Observable<any> {
        const apiUrl = this.gatewayApiUrl + "KeyGetOppPosition/getOppPosition?registrationId=" + registrationId;
        return this.http.get<any>(apiUrl);      
        
    }
    async setPipelinePositionToNull(): Promise<any> {
        this.pipelinePositionDataSubject.next(null); // Emit the data
    }
    
}
