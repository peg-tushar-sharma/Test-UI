import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../../core/core.service';
import { Employee } from '../../shared/interfaces/Employee';
import { Office } from '../../shared/interfaces/office';
import { industry } from '../../shared/interfaces/industry';
import { Client } from '../../shared/interfaces/client';
import * as moment from 'moment';
import { CommonMethods } from '../../shared/common/common-methods';

@Injectable({ providedIn: 'any' })
export class NewOpportunityService {
    private baseGatewayApiUrl: any
    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }
    public getEmployeeNames(query: string, employeeStatusCode: string, levelStatusCode: string, levelGrade: string): Observable<Employee[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyEmployee/employeeNames';
        return this.http.get<Employee[]>(apiUrl + "?query=" + query + "&employeeStatuscode=" + employeeStatusCode + "&levelStatusCode=" + levelStatusCode + "&levelGrade=" + levelGrade);
    }
    public Insert(opportunity: any, source: string, oldOpportunityData: any): Observable<number> {
        //Set Dates format for Expected & Start Date
        if (opportunity && opportunity.opportunityDetails && opportunity.opportunityDetails.expectedStartDate != undefined && opportunity.opportunityDetails.expectedStartDate != null && opportunity.opportunityDetails.expectedStartDate.toString().trim() != "") {
            var expectedStartDate = moment(opportunity?.opportunityDetails?.expectedStartDate).format('YYYY-MM-DD');
            opportunity.opportunityDetails.expectedStartDate = expectedStartDate;
        }
        else {
            opportunity.opportunityDetails.expectedStartDate = null;
        }

        if (opportunity && opportunity.opportunityDetails && opportunity.opportunityDetails.latestStartDate != undefined && opportunity.opportunityDetails.latestStartDate != null && opportunity.opportunityDetails.latestStartDate.toString().trim() != "") {
            var latestStartDate = moment(opportunity?.opportunityDetails?.latestStartDate).format('YYYY-MM-DD');
            opportunity.opportunityDetails.latestStartDate = latestStartDate;
        }
        else {
            opportunity.opportunityDetails.latestStartDate = null;
        }
        if (opportunity && opportunity.opportunityDetails && opportunity.opportunityDetails.bidDate != undefined && opportunity.opportunityDetails.bidDate != null && opportunity.opportunityDetails.bidDate.toString().trim() != "") {
            var bidDate = moment(opportunity?.opportunityDetails?.bidDate).format('YYYY-MM-DD');
            opportunity.opportunityDetails.bidDate = bidDate;
        }
        else {
            opportunity.opportunityDetails.bidDate = null;
        }

        
        //Pipeline Dates
        if (opportunity && opportunity.pipeline && opportunity.pipeline.expectedStartDate != undefined && opportunity.pipeline.expectedStartDate != null && opportunity.pipeline.expectedStartDate.toString().trim() != "") {
            var expectedStartDate = moment(opportunity?.pipeline?.expectedStartDate).format('YYYY-MM-DD');
            opportunity.pipeline.expectedStartDate = expectedStartDate;
        }
        else {
            opportunity.pipeline.expectedStartDate = null;
        }

        if (opportunity && opportunity.pipeline && opportunity.pipeline.latestStartDate != undefined && opportunity.pipeline.latestStartDate != null && opportunity.pipeline.latestStartDate.toString().trim() != "") {
            var latestStartDate = moment(opportunity?.pipeline?.latestStartDate).format('YYYY-MM-DD');
            opportunity.pipeline.latestStartDate = latestStartDate;
        }
        else {
            opportunity.pipeline.latestStartDate = null;
        }
        if (opportunity && opportunity.pipeline && opportunity.pipeline.bidDate != undefined && opportunity.pipeline.bidDate != null && opportunity.pipeline.bidDate.toString().trim() != "") {
            var bidDate = moment(opportunity?.pipeline?.bidDate).format('YYYY-MM-DD');
            opportunity.pipeline.bidDate = bidDate;
        }
        else {
            opportunity.pipeline.bidDate = null;
        }

        // //Generating change log
        //Generating change log on edit
        if(oldOpportunityData && opportunity ){
          let changesLog = CommonMethods.compareObjectManually(oldOpportunityData, opportunity, this.coreService.loggedInUser.employeeRegionId);
            opportunity.changeLog=changesLog;
        }

        //set process info update date.
        if(oldOpportunityData?.pipeline?.processInfo != opportunity?.pipeline?.processInfo) {
            opportunity.pipeline.processInfoUpdateDate = moment(new Date()).format('DD-MMM-YYYY');
        }
        const apiUrl = this.baseGatewayApiUrl + 'keyInsertNewOpportunity?source=' + source;
        return this.http.post<number>(apiUrl, opportunity, { withCredentials: true });
    }
    public getClientsByName(query: any): Observable<Client[]> {
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/GetClientByClientName';
        return this.http.post<Client[]>(apiUrl, { value: query });
    }
    public getClientsByAccountID(accountId: string): Observable<Client[]> {
        const apiUrl = this.baseGatewayApiUrl + 'aggregator/GetClientByAccountID';
        return this.http.post<Client[]>(apiUrl, { value: accountId });
    }
    public getLocationOfDealByEmployeeCode(employeeCode: string): Observable<string> {
        const apiUrl = this.baseGatewayApiUrl + 'keyLocationOfDealByEmployee';
        return this.http.get<string>(apiUrl + "?employeeCode=" + employeeCode);
    }
    public getEmployeeByName(query: string, levelStatusCode: string, levelGrade: string, includeAllEmployee?: boolean, includeExternalEmployee?: boolean): Observable<Employee[]> {
        const apiUrl = this.baseGatewayApiUrl + 'keyEmployee/getEmployeeByName';
        if (includeAllEmployee == undefined) {
            includeAllEmployee = false;
        }
        if (includeExternalEmployee == undefined) {
            includeExternalEmployee = false;
        }
        return this.http.get<Employee[]>(apiUrl + "?query=" + query + "&includeAllEmployee=" + includeAllEmployee + "&includeExternalEmployee=" + includeExternalEmployee + '&levelStatusCode=' + levelStatusCode + '&levelGrade=' + levelGrade);
    }
    public getNewOpportunityById(registrationId) {
        const apiUrl = this.baseGatewayApiUrl + 'keyRegistration/getNewOpportunityById';
        return this.http.get<string>(apiUrl + "?registrationId=" + registrationId);
    }
}
