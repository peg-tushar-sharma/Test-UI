import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../core/core.service';
import { DealSecurity } from '../shared/interfaces/dealSecurity';

// Security Service for the Deal Page which helps to add authorization on fields or section or tabs on edit of any deal

@Injectable()
export class DealSecurityService {
    private baseApiUrl: any;
    public isReadOnlyMode:boolean=true;

    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
    }

    public getDealAuthorization(dealId: number): Observable<DealSecurity[]> {
        if (dealId == undefined || dealId == null) {
            dealId = 0;
          }
        const apiUrl = this.baseApiUrl + 'api/deals/SecurityConfig';
        return this.http.get<any>(apiUrl + '?dealId=' + dealId + '&employeeCode=' + this.coreService.loggedInUser.employeeCode+'&isReadOnly=' + this.isReadOnlyMode, { withCredentials: true });
    }

    public getDealAccessTier(): Observable<any[]>{
        const apiUrl = this.baseApiUrl + 'api/deals/GetDealAccessTier';
        return this.http.get<any>(apiUrl, { withCredentials: true });
    }

    public getDealAccessInformation():Observable<any[]>{
        const apiUrl = this.baseApiUrl + 'api/deals/GetDealAccessInformation';
        return this.http.get<any>(apiUrl, { withCredentials: true });
    }
   
      
}
