import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Registrations } from "../../registrations/registrations/registrations";
import { HttpClient } from "@angular/common/http";
import { CoreService } from "../../core/core.service";
import { PartnerDashboard } from "./partner-dashboard";
import { Competitor } from "../../shared/update-stage-modal/update-stage-modal.component";
import { Employee } from "../../shared/interfaces/Employee";
@Injectable({ providedIn: 'any' })
export class PartnerDashboardService {
    private baseApiUrl = this.coreService.appSettings ? this.coreService.appSettings.PEGApiBasePath : "";
    private baseGatewayApiUrl = this.coreService.appSettings ? this.coreService.appSettings.PEGGatewayApiBasePath : "";

    private getDashboardRegistrationsUrl = this.baseGatewayApiUrl + "keyPartnerDashboardData";
    constructor(private http: HttpClient, private coreService: CoreService) {}

    public getPartnerDashboardData(isActiveRegistration:boolean): Observable<PartnerDashboard[]> {
        return this.http.get<PartnerDashboard[]>(this.getDashboardRegistrationsUrl+"?isActiveRegistration="+isActiveRegistration, { withCredentials: true });
    }
    public saveAuditLogWithSource(auditLog):Observable<any>{
        const apiUrl = this.baseGatewayApiUrl + 'AuditLog/insertPartnerDashboardAuditLogWithSource';
        return this.http.post<any>(apiUrl,auditLog);
    }
    public updateDashboard(dashboardData, field,isActiveRegistration:boolean): Observable<any> {
        const apiUrl = this.baseGatewayApiUrl + "keyupdateDashboardData/updateDashboardRegistration";
       
        return this.http.post<any>( apiUrl + "?field=" + field + "&isActiveRegistration="+ isActiveRegistration, dashboardData,{ withCredentials: true }
        );
    }

    public getCompetitors():Observable<Competitor[]>{
        const apiUrl = this.baseApiUrl + 'api/Competitor';
        return this.http.get<Competitor[]>(apiUrl);
    }
    
    public getEmployeeNames(query: string, employeeStatusCode: string, levelStatusCode: string, levelGrade: string): Observable<Employee[]> {
        const apiUrl = this.baseApiUrl + 'api/employee/employeeNames';
        return this.http.get<Employee[]>(apiUrl + "?query=" + query + "&employeeStatuscode=" + employeeStatusCode + "&levelStatusCode=" + levelStatusCode + "&levelGrade=" + levelGrade);
    }
}
