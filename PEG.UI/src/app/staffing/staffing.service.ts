import { Competitor } from './update-stage-staffing-modal/update-stage-staffing-modal.component';
import { CoreService } from '../core/core.service';
import { Employee } from '../shared/interfaces/Employee';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Office } from '../shared/interfaces/office';
import { PegDetails } from './peg-details';
import { Region } from '../shared/enums/region';
import { RegistrationClosedInfo } from '../registrations/registrationClosedInfo';
import { RegistrationStage } from '../shared/interfaces/RegistrationStage';

@Injectable({
  providedIn: 'root'
})
export class StaffingService {
  private baseGatewayApiUrl: any;
  allOffices: Office[];

  constructor(private http: HttpClient, private coreService: CoreService) {
    this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
  }

  public getPegDetails(oppId): Observable<PegDetails> {
    const apiUrl = this.baseGatewayApiUrl + 'getPegDetails?id=' + oppId;
    return this.http.get<PegDetails>(apiUrl);
  }

  public getRelatedTrackerClientsByRegistrationId(registrationId): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + "getRelatedTrackerClientsByRegistrationId?registrationId=" + registrationId;
    return this.http.get<any>(apiUrl, { withCredentials: true });
  }

  public upsertPegDetails(pegDetails, fieldName): Observable<PegDetails> {
    const apiUrl = this.baseGatewayApiUrl + 'upsertPegDetails';
    return this.http.post<PegDetails>(apiUrl + '?employeeCode=' + this.coreService.loggedInUser.employeeCode + '&fieldName=' + fieldName + '&employeeRole=' + this.coreService.loggedInUser.securityRoles[0].name, pegDetails);
  }

  public cloneStaffedOpportunity(oppId): Observable<PegDetails> {
    const apiUrl = this.baseGatewayApiUrl + 'cloneStaffedOpportunity';
    return this.http.post<PegDetails>(apiUrl + '?employeeCode=' + this.coreService.loggedInUser.employeeCode, oppId);
  }

  public getOfficeHierarchy(): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + "getOfficeHierarchy?regionIds=" + Region.EMEA.toString();
    return this.http.get<any>(apiUrl);
  }
  public searchOpportunityStaffing(searchText:string): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + "keyDistribution/searchOpportunityForStaffing?searchText=" + searchText;
    return this.http.get<any>(apiUrl);
  }
  public getTeamSize(): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'getTeamSize';
    return this.http.get<any>(apiUrl);
  }

  public getLikelihood(): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'getLikelihood';
    return this.http.get<any>(apiUrl);
  }

  public insertPipelineAuditLog(pipelineAuditLog): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'insertPipelineAuditLog';
    return this.http.post<any>(apiUrl, pipelineAuditLog, { withCredentials: true });
  }

  public getAllOffice(): Observable<Office[]> {
    if (this.allOffices) {
      return of(this.allOffices);
    } else {
      const apiUrl = this.baseGatewayApiUrl + 'getAllOffices';
      if (apiUrl) {
        return this.http.get<Office[]>(apiUrl, { headers: { cache: 'yes' } }).pipe(
          map((data: Office[]) => {
            this.allOffices = data;
            return this.allOffices;
          })
        );
      }
    }
  }

  public getEmployeeByName(query: string, levelStatusCode: string, levelGrade: string, includeAllEmployee?: boolean, includeExternalEmployee?: boolean): Observable<Employee[]> {
    const apiUrl = this.baseGatewayApiUrl + 'getEmployeeByName';
    if (includeAllEmployee == undefined) {
      includeAllEmployee = false;
    }
    if (includeExternalEmployee == undefined) {
      includeExternalEmployee = false;
    }
    query = (query == null) ? '' : query;
    return this.http.get<Employee[]>(apiUrl + "?query=" + query + "&includeAllEmployee=" + includeAllEmployee + "&includeExternalEmployee=" + includeExternalEmployee + '&levelStatusCode=' + levelStatusCode + '&levelGrade=' + levelGrade);
  }

  public sendUpdatesToStaffing(pegDetails): Observable<PegDetails> {
    const apiUrl = this.baseGatewayApiUrl + 'sendUpdatesToStaffing';
    return this.http.post<PegDetails>(apiUrl + '?employeeCode=' + this.coreService.loggedInUser.employeeCode, pegDetails);
  }
  public SendUpdatesToCortex(registrationId, fieldName): Observable<PegDetails> {
    const apiUrl = this.baseGatewayApiUrl + 'sendUpdatesToCortex';
    return this.http.post<PegDetails>(apiUrl + '?registrationId=' + registrationId + '&fieldName=' + fieldName, "");
  }
  public updateOpsLikelihood(RegId) {
    const apiUrl = this.baseGatewayApiUrl + 'updateOpsLikelihood';
    return this.http.post<any>(apiUrl + '?registrationId=' + RegId + "&employeeCode=" + this.coreService.loggedInUser.employeeCode, "");

  }
  public getCompetitors(): Observable<Competitor[]> {
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/Competitor';
    return this.http.get<Competitor[]>(apiUrl);
  }
  public getRegistrationStage(): Observable<RegistrationStage[]> {
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/getRegistrationStage';
    return this.http.get<RegistrationStage[]>(apiUrl);
  }
  public getSecondaryNotes(): Observable<any[]> {
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/getSecondaryNotes';
    return this.http.get<any[]>(apiUrl);
  }
  public getRegistrationShareDetails(registrationId: number): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/getRegistrationShareDetails?registrationId=' + registrationId;
    return this.http.get<any>(apiUrl);
  }
  public getRegistrationClosedInfo(registrationId: number): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/getRegistrationClosedInfo?registrationId=' + registrationId;
    return this.http.get(apiUrl, { withCredentials: true });
  }
  public upsertRegistrationClosedInfo(registrationClosedInfo: RegistrationClosedInfo): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/upsertRegistrationClosedInfo';
    return this.http.post(apiUrl, registrationClosedInfo, { withCredentials: true });
  }
  public getIndustrySectors(): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/getIndustrySectors';
    return this.http.get<any>(apiUrl);
  }
  public getClientsByName(term: string): Observable<any> {
    let clientParams = {
      value: term
    }
    const apiUrl = this.baseGatewayApiUrl + 'keyDistribution/getClientByClientName';
    return this.http.post<any>(apiUrl, clientParams);
  }
}
