import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Registrations } from '../../registrations/registrations/registrations';
import { HttpClient } from '@angular/common/http';
import { CoreService } from '../../core/core.service';
import { Dashboard } from '../dashboard/dashboard';
import { Employee } from '../../shared/interfaces/Employee';
import { RegistrationClosedInfo } from '../../registrations/registrationClosedInfo';
import { GridColumn } from '../../shared/interfaces/grid-column.interface';
import { Company } from '../../conflicts/company';
import { Note } from '../../shared/interfaces/note';
@Injectable()
export class DashboardService {
  private baseApiUrl = this.coreService.appSettings ? this.coreService.appSettings.PEGApiBasePath : '';
  private baseGatewayApiUrl = this.coreService.appSettings ? this.coreService.appSettings.PEGGatewayApiBasePath : '';
  public LegalUsers: Employee[] = [];
  constructor(
    private http: HttpClient,
    private coreService: CoreService,
  ) { }

  public getDashboardRegistrations(filterName, startDate, endDate, registrationId): Observable<Dashboard[]> {

    return this.http.get<Dashboard[]>(this.baseGatewayApiUrl + 'keyDashboardData?filterName=' + filterName + '&startDate=' + startDate + '&endDate=' + endDate + '&registrationId=' + registrationId, { withCredentials: true });
  }
  public getUsersByRole(roleId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseGatewayApiUrl + 'keyEmployee/getUsersByRole?roleId=' + roleId.toString(), { withCredentials: true });
  }
  public upsertRegistrationClosedInfo(registrationClosedInfo: RegistrationClosedInfo): Observable<any> {
    const apiUrl = this.baseApiUrl + 'api/Registrations/upsertRegistrationClosedInfo';
    return this.http.post(apiUrl, registrationClosedInfo, { withCredentials: true });
  }
  public updateConflictDashboard(fieldName: string, dashboard: Dashboard): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'keyUpdateConflictDashboard?fieldName=' + fieldName + "&currentEmployeeRegion=" + this.coreService.loggedInUser.employeeRegionId;
    return this.http.post(apiUrl, dashboard, { withCredentials: true });
  }
  public getRegistrationByTargetName(targetName: string): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + "keyGetRegistrationByTargetName?targetName=" + targetName;
    return this.http.get<any>(apiUrl, { withCredentials: true });
  }

  public getUserColumns(pageId: number): Observable<GridColumn[]> {
    const apiUrl = this.baseGatewayApiUrl + "keyPipelineGridColumn/PipelineGridColumn";
    return this.http.get<GridColumn[]>(
      apiUrl + "?employeeCode=" + this.coreService.loggedInUser.employeeCode + "&pageId=" + pageId,
      { headers: { cache: "yes" } }
    );
  }
  public getConflictsDetailsById(registrationId): Observable<Dashboard> {

    return this.http.get<Dashboard>(this.baseGatewayApiUrl + 'KeyGetConflictsDetailsById?registrationId=' + registrationId, { withCredentials: true });
  }
  public getGeneralNotes(registrationId: number, isMasked: boolean): Observable<Note[]> {
    let roleId = this.coreService.loggedInUserRoleId;
    return this.http.get<Note[]>(this.baseApiUrl + 'api/Note?roleId=' + roleId + '&registrationId=' + registrationId + '&isMasked=' + isMasked, { withCredentials: true });
  }
  public getConflictsByCompanyName(companyName: string): Observable<Company[]> {

    return this.http.get<Company[]>(this.baseGatewayApiUrl + 'keyGetConflictsByCompanyName?companyName=' + companyName, { withCredentials: true });
  }
  public getLinkedRegistrationById(registrationId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseGatewayApiUrl + 'keyGetLinkedRegistrationById?registrationId=' + registrationId, { withCredentials: true });
  }
}
