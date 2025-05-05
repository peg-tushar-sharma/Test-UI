import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../../core/core.service';
import { Employee } from '../../shared/interfaces/Employee';
import { Registrations } from '../registrations/registrations';
import { Office } from '../../shared/interfaces/office';
import { industry } from '../../shared/interfaces/industry';
import { map } from 'rxjs/operators';

@Injectable()
export class RegistrationMessageService {
    private baseApiUrl: any;

    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
    }

  
    public getRegistrationMessageConfig():Observable<any>{
        const  apiUrl = 'assets/registrationMessages.json';
        return this.http.get<any>(apiUrl);
    }

  
    

    
}