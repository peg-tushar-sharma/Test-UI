import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CoreService } from '../core/core.service';
import { SecurityUserDetails } from './admin'
import { GridColumn } from '../shared/interfaces/models';
import { Employee } from '../shared/interfaces/Employee';
import { ColDef } from 'ag-grid-enterprise';
import { fontIcons, GridValues } from '../shared/grid-generator/grid-constants';
import { FilterFunctions } from '../shared/grid-generator/filter-functions';
import { DatePipe } from '@angular/common';
export const CONTAINER_DATA = new InjectionToken<{}>('CONTAINER_DATA');

@Injectable()
export class AdminService {
    private baseApiUrl: any;
    public dragDropAccess = [];
    private gatewayApiUrl: any;
    regionFilterChange = new Subject<any>();
    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
        this.gatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }

    public getGridColumns(pageId: number): Observable<GridColumn[]> {
        const apiUrl = this.gatewayApiUrl + 'getRegistrationGridColumn';
        return this.http.get<GridColumn[]>(apiUrl + '?pageId=' + pageId, { headers: { cache: 'yes' } });
    }

    public getAdminData(): Observable<SecurityUserDetails[]> {
        const apiUrl = this.gatewayApiUrl + 'AdminSecurity/getAdminSecurityData';
        return this.http.get<SecurityUserDetails[]>(apiUrl);
    }

    public addSystemUser(data): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/AdminSecurity/addSystemUser';
        return this.http.post<any>(apiUrl, data, { withCredentials: true });
    }

    public deleteSystemUser(employeeCode): Observable<any> {
        const apiUrl = this.baseApiUrl + 'api/AdminSecurity/deleteSystemUser?employeeCode='+employeeCode;
        return this.http.post<any>(apiUrl, { withCredentials: true });
    }
    public getAdminDataByCode(employeeCode): Observable<SecurityUserDetails[]> {
        const apiUrl = this.gatewayApiUrl + 'AdminSecurity/getAdminSecurityData?employeeCode='+employeeCode;
        return this.http.get<SecurityUserDetails[]>(apiUrl);
    }


}
