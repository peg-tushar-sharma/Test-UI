import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { CoreService } from '../../core/core.service';
import { Prohibition } from './prohibition';
import { observeOn } from 'rxjs/operators';
@Injectable({providedIn:'root'})

export class ProhibitionService {
    private baseApiUrl: any;
    private apiurl: any;

    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
    }

    public insertProhibition(prohibition: Prohibition): Observable<Prohibition> {
        const  apiUrl = this.baseApiUrl + 'api/' + 'Prohibition/Insert';
        return <Observable<Prohibition>>this.http.post(apiUrl, prohibition, {withCredentials: true});
    }

    public updateProhibition(prohibition: Prohibition): Observable<Prohibition> {
        const  apiUrl = this.baseApiUrl + 'api/' + 'Prohibition/Update';
        return <Observable<Prohibition>>this.http.post(apiUrl, prohibition, {withCredentials: true});
    }
}
