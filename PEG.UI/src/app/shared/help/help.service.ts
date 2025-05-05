import { CoreService } from '../../core/core.service';
import { Injectable } from '@angular/core';
import { Help } from '../interfaces/help';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HelpService {
    private baseApiUrl: any;

    constructor(private http: HttpClient,public coreService: CoreService){
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
    }

    public submitHelpQuery(help: Help): Observable<Help> {
        const  apiUrl = this.baseApiUrl + 'api/' + 'Help/SubmitFeedback';
        help.sender =  this.coreService.loggedInUser.internetAddress;
        return <Observable<Help>>this.http.post(apiUrl, help);
    }

}