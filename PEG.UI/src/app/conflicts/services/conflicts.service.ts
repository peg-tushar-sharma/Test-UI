import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../company';
import { CoreService } from '../../core/core.service';
import { CompanyType } from '../CompanyType';
import { GridColumn } from '../../shared/interfaces/grid-column.interface';

@Injectable()
export class ConflictsService {
  private baseGatewayApiUrl = this.coreService.appSettings ? this.coreService.appSettings.PEGGatewayApiBasePath : "";
  private getConflictsUrl = this.baseGatewayApiUrl + "keyConflicts"

  constructor(private http: HttpClient, private coreService: CoreService ) { }
  public getUserColumns(pageId: number): Observable<GridColumn[]> {
    const apiUrl = this.baseGatewayApiUrl + "keyPipelineGridColumn/PipelineGridColumn";
    return this.http.get<GridColumn[]>(
        apiUrl + "?employeeCode=" + this.coreService.loggedInUser.employeeCode + "&pageId=" + pageId,
        { headers: { cache: "yes" } }
    );
}

  getConflicts(isActive:boolean) : Observable<Company[]> {
    return this.http.get<Company[]>(this.getConflictsUrl+"?isActive="+isActive, { withCredentials: true });
  }

  upsertConflict(company): Observable<Company>{
    return this.http.post<Company>(this.baseGatewayApiUrl+"keyUpsertConflict",company ,  { withCredentials: true });
  }
  getConflictTypes(): Observable<CompanyType[]>{
    return this.http.get<CompanyType[]>(this.baseGatewayApiUrl+"keyConflictTypes", { withCredentials: true });
  }
}
