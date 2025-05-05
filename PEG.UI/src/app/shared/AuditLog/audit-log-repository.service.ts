import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../../core/core.service';
import { AuditLog } from './AuditLog';

@Injectable()
export class AuditLogRepositoryService {
    private baseApiUrl: any;
    private getAuditLogsUrl: string;
    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
        this.getAuditLogsUrl = this.baseApiUrl + 'api/' + 'AuditLog';
    }

    public addAuditLog(auditLog: AuditLog): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/' + 'AuditLog/';
        if (auditLog) {
            if (auditLog.submittedBy === undefined || auditLog.submittedBy === '') {
                auditLog.submittedBy = this.coreService.loggedInUser.employeeCode;
            }
        }
        return this.http.post(apiUrl, auditLog, { withCredentials: true });
    }
    
    public getAuditLogs(registrationId: number,isRowMasked: boolean): Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(this.getAuditLogsUrl + '?registrationId=' + registrationId+'&isRowMasked='+isRowMasked, { withCredentials: true });
    }

    public getDealAuditLogs(dealId: number):Observable<AuditLog[]>{
        const apiUrl = this.getAuditLogsUrl + '/getDealAudits';
        return this.http.get<AuditLog[]>(apiUrl+'?dealId=' + dealId, { withCredentials: true });
    }
}
