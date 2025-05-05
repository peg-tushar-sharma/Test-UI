import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../core/core.service';

@Injectable()
export class SettingsService {
    private baseApiUrl: any;
    private apiurl: any;
    public roleFieldValues;


    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
    }

    public syncIndustries(): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/' + 'Industry/syncIndustries';
        return this.http.post(apiUrl, { withCredentials: true });
    }
    public updateUserTargetMasked(employeeCode: string, isTargetMasked): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/' + 'AdminSecurity/updateUserTargetMasked?employeeCode=' + employeeCode + '&isTargetMasked=' + isTargetMasked;
        return this.http.post(apiUrl, { withCredentials: true });
    }
}
