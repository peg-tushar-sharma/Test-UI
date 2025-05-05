import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../../error/http-error-handler.service';
import { CoreService } from '../../core/core.service';
import { RegistrationFrequency } from '../../shared/interfaces/registrationFrequency.interface';


@Injectable()
export class ReportService {
    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler, private coreService: CoreService) {
    }

    public generateRegistrationReport(): Observable<any> {
        const  apiUrl = this.coreService.appSettings.PEGApiBasePath + 'api/' + 'reports/getregistrations';

        let user = this.coreService.loggedInUser.lastName+ ", "+ ((this.coreService.loggedInUser.familiarName!=null)?this.coreService.loggedInUser.familiarName:this.coreService.loggedInUser.firstName);

        return this.http.get(apiUrl+"?user=" + user, { responseType: 'text', withCredentials: true});

    }

    public getRegistrationFrequencyReportData(): Observable<RegistrationFrequency> {
        const  apiUrl = this.coreService.appSettings.PEGApiBasePath + 'api/' + 'registrationfrequencyreport';

        return this.http.get<RegistrationFrequency>(apiUrl, {withCredentials: true});

    }
}
