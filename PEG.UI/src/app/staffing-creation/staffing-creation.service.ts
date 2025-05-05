import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../core/core.service';
import { Employee } from '../shared/interfaces/Employee';
import { Office } from '../shared/interfaces/office';
import { industry } from '../shared/interfaces/industry';
import { Client } from '../shared/interfaces/client';
import { CommonMethods } from '../shared/common/common-methods';

@Injectable()
export class StaffingCreationService {
    private baseApiUrl: any;
    private baseGatewayApiUrl: any;

    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
        this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }


    public insertNewStaffingOpportunity(newOpportunity: any, oldOpportunity:any): Observable<any> {

        if(oldOpportunity){
            let changeLog = CommonMethods.createChangeLogForStaffingOpportunity(oldOpportunity,newOpportunity);
            newOpportunity.changeLog = changeLog;
        }
        const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/insertNewStaffingOpportunity';
        return this.http.post<any>(apiUrl , newOpportunity);
    }
}