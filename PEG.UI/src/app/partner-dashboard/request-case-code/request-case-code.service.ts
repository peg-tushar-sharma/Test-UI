import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CoreService } from "../../core/core.service";

// interfaces
import { Office } from "../../shared/interfaces/office";
@Injectable({ providedIn: 'any' })
export class RequestCaseCodeService {
    private baseApiUrl: any;
    private baseGatewayApiUrl: any;

    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;

        this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }

    public getOffice(): Observable<Office[]> {
        const apiUrl = this.baseApiUrl + 'api/office';
        return this.http.get<Office[]>(apiUrl, { headers: { cache: 'yes' } });
    }
 
    public getNewOpportunityById(registrationId) {
        const apiUrl = this.baseGatewayApiUrl + 'keyCaseCode/getCaseCodeRequestById';
        return this.http.get<string>(apiUrl + "?registrationId=" + registrationId);
    }
    public getCaseRequestDocumentById(documentId):Observable<string> {
        const apiUrl = this.baseGatewayApiUrl + 'keyDocument/getCaseRequestDocumentById';
        return this.http.get<string>(apiUrl + "?documentId=" +documentId);
    }

    public submitCaseCodeRequest(requestData):Observable<any>{
        const formData = new FormData();
      
        requestData.submittedBy=this.coreService.loggedInUser;
        formData.append('caseCodeRequestJson', JSON.stringify(requestData))
        // formData.append('discountApproval', requestData.discountApproval[0]);
        // formData.append('scopeOfWork', requestData.scopeOfWorkFiles[0]);
        for (let i = 0; i < requestData.discountApproval?.length; i++) {
            formData.append("discountApproval", requestData.discountApproval[i]); // Append each file under the same key
        }

        for (let i = 0; i < requestData.scopeOfWork?.length; i++) {
            formData.append("scopeOfWork", requestData.scopeOfWork[i]); // Append each file under the same key
        }
        const apiUrl = this.baseGatewayApiUrl + "keyCaseCode/submitCaseCodeRequest";
       return this.http.post<any>( apiUrl , formData );
    }

}
