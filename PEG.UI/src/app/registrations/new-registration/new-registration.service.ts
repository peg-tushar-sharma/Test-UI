import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../../core/core.service';
import { Employee } from '../../shared/interfaces/Employee';
import { industry } from '../../shared/interfaces/industry';
import { Client } from '../../shared/interfaces/client';

@Injectable({ providedIn: 'any' })
export class NewRegistrationService {
    private baseApiUrl: any;
    private baseGatewayApiUrl:any

    constructor(private http: HttpClient, private coreService: CoreService) {
        this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
        this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }


    public getEmployeeNames(query: string, employeeStatusCode:string, levelStatusCode: string,levelGrade :string ):Observable<Employee[]>{
        const  apiUrl = this.baseApiUrl + 'api/employee/employeeNames';
        return this.http.get<Employee[]>(apiUrl+"?query="+ query + "&employeeStatuscode=" + employeeStatusCode + "&levelStatusCode=" + levelStatusCode+ "&levelGrade=" + levelGrade );
    }

    public getIndustries(query: string) : Observable<industry[]> {
        const  apiUrl = this.baseApiUrl + 'api/industry/industryNames';
        return this.http.get<industry[]>(apiUrl+"?query=" + query);
    }

   
}
