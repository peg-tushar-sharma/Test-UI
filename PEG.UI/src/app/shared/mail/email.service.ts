import { CoreService } from "../../core/core.service";
import { EmailTemplate } from "../interfaces/emailTemplate";
import { EmailTemplateType } from "../enums/emailTemplateType.enum";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
    private baseGatewayApiUrl: any
    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;

     }
    getEmailTemplate(templateType:EmailTemplateType):Observable<EmailTemplate>{
        const apiUrl = this.baseGatewayApiUrl+'keyGetEmailTemplate?templateType='+templateType;
        return this.http.get<EmailTemplate>(apiUrl);
    }
  
}
