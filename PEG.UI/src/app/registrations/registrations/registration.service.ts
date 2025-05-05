import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CoreService } from '../../core/core.service';
import { Registrations } from './registrations';
import { Prohibition } from '../prohibitions/prohibition';
import { Investment } from './investment';
import { GridColumn, Employee } from '../../shared/interfaces/models';
import { RoleFieldMapping } from '../../shared/interfaces/roleFieldMapping';
import { BulkRegistrations } from './BulkRegistrations';
import { Partnership } from './partnership';
import { RegistrationParams } from '../registratonParams';
import { stringToArray } from 'ag-grid-community';
import { RegistrationClosedInfo } from '../registrationClosedInfo';

@Injectable({ providedIn: 'any' })
export class RegistrationService {
    private baseApiUrl: any;
    public roleFieldValues;
    private baseGatewayApiUrl:any;
    public updateRegistrationSidebar$ = new Subject<any>();
    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
        this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }  

    public VersionCheck(): Observable<void> {
        const apiUrl = this.baseApiUrl + 'api/General/VersionCheck';
        return this.http.get<void>(apiUrl, { headers: { cache: 'yes' } });
    }

    public getProhibitions(): Observable<Prohibition[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyprohibition';
        return this.http.get<Prohibition[]>(apiUrl);
    }

    public getArchivedProhibitions(): Observable<Prohibition[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyProhibition/ArchivedProhibitions';
        return this.http.get<Prohibition[]>(apiUrl);
    }

    public getRegistrationData(): Observable<Registrations[]> {
        let roleId = this.coreService.loggedInUserRoleId;
        let employeeCode = this.coreService.loggedInUser.employeeCode;
        let userRegion = this.coreService.loggedInUser.employeeRegionId;
        if(!userRegion){
            userRegion=0;
        }
        const apiUrl = this.baseGatewayApiUrl  + 'keyRegistrationData?roleId=' + roleId + '&employeeCode=' + employeeCode+ '&userRegion=' + userRegion;
        return this.http.get<Registrations[]>(apiUrl, {  withCredentials: true }  );
    }
    
    public getFilteredRegistration(registrationId: number): Observable<Registrations[]> {
        let roleId = this.coreService.loggedInUserRoleId;
        let employeeCode = this.coreService.loggedInUser.employeeCode;
        let userRegion = this.coreService.loggedInUser.employeeRegionId;
        if(!userRegion){
            userRegion=0;
        }
        const apiUrl = this.baseGatewayApiUrl  + 'keyRegistrations/GetRegistrationsOnTargetName?roleId=' + roleId + '&employeeCode=' + employeeCode+ '&userRegion=' + userRegion+ '&registrationId=' + registrationId;
        return this.http.get<Registrations[]>(apiUrl, {  withCredentials: true }  );
    }

    public getArchivedRegistrations(): Observable<Registrations[]> {
        const apiUrl = this.baseGatewayApiUrl  + 'keyRegistrations/ArchivedRegistrations?employeeCode='+ this.coreService.loggedInUser.employeeCode;
        return this.http.get<Registrations[]>(apiUrl, {  withCredentials: true }  );
    }

    public getRegistrationStatus(): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'keyRegistrations/RegistrationStatus';
        return this.http.get(apiUrl, { withCredentials: true, headers: { cache: 'yes' } });
    }

    public updateRegistration(registration: Registrations): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl  + 'keyRegistrations/UpdateRegistration';
        return this.http.post(apiUrl, registration, { withCredentials: true });
    }   
    public updateRegistrationDetails(registration: Registrations): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl  + 'keyRegistrations/UpdateRegistrationDetails';
        return this.http.post(apiUrl, registration, { withCredentials: true });
    }
    public saveShareAccess(registration: any,registrationId:number,hasSubmitterAccess :boolean): Observable<any> {
        const apiUrl =this.baseApiUrl + 'api/Registrations/saveShareAccess?registrationId=' + registrationId+'&hasSubmitterAccess='+hasSubmitterAccess;
           return this.http.post(apiUrl, registration, { withCredentials: true });
    }    

    public getInvestments(): Observable<Investment[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyinvestment';
        return this.http.get<Investment[]>(apiUrl);
    }

    public getArchivedInvestments(): Observable<Investment[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyInvestment/ArchivedInvestments?employeeCode=' + this.coreService.loggedInUser.employeeCode;
        return this.http.get<Investment[]>(apiUrl);
    }

    public getGridColumns(pageId: number): Observable<GridColumn[]> {
        const apiUrl = this.baseGatewayApiUrl + 'getRegistrationGridColumn';
        return this.http.get<GridColumn[]>(apiUrl + '?pageId=' + pageId, { headers: { cache: 'yes' } });
    }

    public getRegistrationById(registrationId: number): Observable<Registrations> {
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/Registration/GetRegistrationById' + '?registrationId=' + registrationId + "&employeeCode=" + this.coreService.loggedInUser.employeeCode;
        //return this.http.post<Registrations>(apiUrl , { withCredentials: true });
        return this.http.get<Registrations>(apiUrl);
    }
    public getRegistrationShareDeatails(registrationId: number): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/Registrations/getRegistrationShareDetails' + '?registrationId=' + registrationId;
        return this.http.get<any>(apiUrl);
    }
    
    public sendClosedStageMail(registrationStageId:number,registrationId: any): Observable<any> {
        let userRegion = this.coreService.loggedInUser.employeeRegionId;
        if(!userRegion){
            userRegion=0;
        }

        const apiUrl = this.baseApiUrl + 'api/Registrations/closedStageMail?registrationId=' + registrationId 
        +'&registrationStageId=' + registrationStageId 
        +'&region=' + userRegion 
        
        return this.http.post<Registrations>(apiUrl , { withCredentials: true });
    }    

    deleteStaffingOpportunity(registrationId: number,registrationStageId: number): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'keyDeleteStaffingOpportunity/deleteStaffingOpportunity?registrationId=' + registrationId+'&registrationStageId=' +registrationStageId;
        return this.http.post<any>(apiUrl, { withCredentials: true });
    }
    updatePipelineMbActiveStatus(registrationId: number): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'keyUpdatePipelineMbActiveStatus/updatePipelineMbActiveStatus?registrationId=' + registrationId;
        return this.http.post<any>(apiUrl, { withCredentials: true });
    }
    
    public sendUpdatedDataToCortex(fieldName:string,registrationId: any): Observable<any> {
      
        const apiUrl = this.baseGatewayApiUrl + 'keySendUpdatedDataToCortex/sendUpdatedDataToCortex?registrationId=' + registrationId 
        +'&fieldName=' + fieldName 
        
        return this.http.post<any>(apiUrl , { withCredentials: true });
    }
    public sendUpdatedDataToStaffing(fieldName:string,registrationId: any): Observable<any> {
      
        const apiUrl = this.baseGatewayApiUrl + 'keySendUpdatesToStaffing/sendUpdatesToStaffing?registrationId=' + registrationId 
        +'&fieldName=' + fieldName 
        
        return this.http.post<any>(apiUrl , { withCredentials: true });
    }
    
    
    public getUserAuthorization() : Observable<RoleFieldMapping[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyRegistrationRoleField';
        return this.http.get<RoleFieldMapping[]>(apiUrl);
       
    }

    public getUserRoles() : RoleFieldMapping {
        return this.roleFieldValues;
    }

    public getRegistrationClosedInfo(registrationId: number): Observable<any> {
        const apiUrl = this.baseApiUrl  + 'api/Registrations/getRegistrationClosedInfo?registrationId=' + registrationId;
        return this.http.get(apiUrl, { withCredentials: true });
    }

    public resendEmail(registrationId: number): Observable<Registrations> {
        const apiUrl = this.baseGatewayApiUrl + 'keyRegistrations/ResendEmail?registrationId=' + registrationId +'&employeeCode=' + this.coreService.loggedInUser.employeeCode;
        return this.http.post<Registrations>(apiUrl , { withCredentials: true });
    }

    public bulkUpdate(registrations:BulkRegistrations):Observable<any>{
        const apiUrl = this.baseGatewayApiUrl + 'keyRegistrations/UpdateBulkRegistrations';
        return this.http.post(apiUrl,registrations , { withCredentials: true });
    }



    public getUsersByRole(roleId:number):Observable<Employee[]>{
        const apiUrl = this.baseGatewayApiUrl+'keyEmployee/getUsersByRole?roleId='+roleId; 
        return this.http.get<Employee[]>(apiUrl);
    }

    public getPartnership(): Observable<Partnership[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keypartnership/getActivePartnership';
        return this.http.get<Partnership[]>(apiUrl);
    }

    public getRegistrationInfo(searchText): Observable<any[]> {
        const apiUrl = this.baseGatewayApiUrl + 'Registrations/getRegistrationInfo?searchText=' + searchText;
        return this.http.get<any[]>(apiUrl);
    }

    public addRegistrationToPipeline(registrationId,regionFilterText):Observable<any>{
        const apiUrl = this.baseGatewayApiUrl + 'Registrations/addRegistrationToPipeline?registrationId=' + registrationId +'&selectedRegions=' + regionFilterText +'&employeeCode='+this.coreService.loggedInUser.employeeCode;
        return this.http.post(apiUrl , { withCredentials: true });
    }

    public getClientPriority(clientName,basisClientId):Observable<any>{
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/getClientPriority';
        return this.http.post<any>(apiUrl, { ClientName: clientName, BasisClientId: basisClientId});
    }

    public saveAuditLogWithSource(auditLog):Observable<any>{
        const apiUrl = this.baseGatewayApiUrl + 'AuditLog/insertAuditLogWithSource';
        return this.http.post<any>(apiUrl,auditLog);
    }

    public getRegistrationDataUpdated(updatedRegistration: RegistrationParams): Observable<Registrations[]> {
        let roleId = this.coreService.loggedInUserRoleId;
        let employeeCode = this.coreService.loggedInUser.employeeCode;
        let userRegion = this.coreService.loggedInUser.employeeRegionId;
        if (!userRegion) {
            userRegion = 0;
        }        
        updatedRegistration.roleId = roleId;
        updatedRegistration.employeeCode = employeeCode;
        updatedRegistration.userRegion = userRegion;

        const apiUrl = this.baseGatewayApiUrl + 'keyRegistrationDataUpdated';
        return this.http.post<Registrations[]>(apiUrl, updatedRegistration, { withCredentials: true });
    }

    public getSearchedRegistrations(searchText): Observable<any[]> {
        const apiUrl = this.baseApiUrl + 'api/Registrations/getSearchedRegistrations?searchText=' + searchText;
        return this.http.get<any[]>(apiUrl);
    }

    public getClientHeadsByClientId(clientId: number): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + 'keyGetClientHeadByClientCode?clientCode=' + clientId;
        return this.http.get<any[]>(apiUrl);
    }

    public getHedgeFundByClientId(clientId: string,basisClientId:string): Observable<boolean>{
        const  apiUrl = this.baseGatewayApiUrl + 'keyGetHedgeFundByClientId';
        if (basisClientId==null || basisClientId==undefined)
            basisClientId='0';
        return this.http.get<boolean>(apiUrl +"?clientId="+ clientId+"&basisClientId="+basisClientId);
    }

    public getUserColumns(pageId: number): Observable<GridColumn[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyPipelineGridColumn/PipelineGridColumn';
        return this.http.get<GridColumn[]>(apiUrl + '?employeeCode=' + this.coreService.loggedInUser.employeeCode + '&pageId=' + pageId, { headers: { cache: 'yes' } });
    }

    public getClientPriorityByClientId(basisClientId: number): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/client/getPriorityByClientId?basisClientId=' + basisClientId;
        return this.http.get<any[]>(apiUrl);
    }

    public upsertRegistrationClosedInfo(registrationClosedInfo: RegistrationClosedInfo): Observable<any> {
        const apiUrl = this.baseApiUrl  + 'api/Registrations/upsertRegistrationClosedInfo';
        return this.http.post(apiUrl, registrationClosedInfo, { withCredentials: true });
    }

    public getPartnerByRegistrationId(registrationId): Observable<any[]> {
        const apiUrl = this.baseApiUrl + 'api/Registrations/getPartnerByRegistrationId';
        return this.http.post<any[]>(apiUrl, registrationId, { withCredentials: true });
    }
}
