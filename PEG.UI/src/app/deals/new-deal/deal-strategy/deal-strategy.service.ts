import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreService } from '../../../core/core.service';
import { DealTrackerClient } from '../../deal-tracker-client';
import { DealTracker } from '../../dealTracker';
import { DealClient } from '../deal-clients/dealClient';
import { Employee } from '../../../shared/interfaces/Employee';

@Injectable({
  providedIn: 'root'
})
export class DealStrategyService {
  private baseApiUrl: any;
  private baseGatewayApiUrl: any
  constructor(private http: HttpClient, private coreService: CoreService) { 
    this.baseApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath;
    this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
  }

  saveExpertAllocation(employeeCode:string,dealId:number,allocationType:number,registrationId:number, isExternalEmployee,isAllocationActive,isDelete:boolean){
    let urlParameters=`employeeCode=${employeeCode}&dealId=${dealId}&allocationType=${allocationType}&registrationId=${registrationId}&isExternalEmployee=${isExternalEmployee}&isAllocationActive=${isAllocationActive}&isDelete=${isDelete}`;
    return this.http.post<DealTracker>(this.baseGatewayApiUrl+'keySaveExpertAllocation/DealTracker/saveExpertAllocation?'+urlParameters,null);
  }
  public getEmployeeNames(query: string, employeeStatusCode: string, levelStatusCode: string, levelGrade: string): Observable<Employee[]> {
    const apiUrl = this.baseGatewayApiUrl + 'keyEmployee/employeeNames';
    return this.http.get<Employee[]>(apiUrl + "?query=" + query + "&employeeStatuscode=" + employeeStatusCode + "&levelStatusCode=" + levelStatusCode + "&levelGrade=" + levelGrade);
}
  toggleAllocationActiveState(registrationId:number,isAllocationActive:boolean,employeeCode:string){
    let urlParameters=`&registrationId=${registrationId}&isAllocationActive=${isAllocationActive}&employeeCode=${employeeCode}&`;
    return this.http.post<number>(this.baseApiUrl+'api/DealTracker/toggleAllocationActiveState?'+urlParameters,null);
  }
  saveClientDetails(client:DealTrackerClient,fieldName:string,dealId:number){
    let userRegion = this.coreService.loggedInUser.employeeRegionId;
    if(!userRegion){
        userRegion=0;
    }
    const apiUrl = this.baseGatewayApiUrl + 'keyupsertClientDetails/dealTracker/upsertClientDetails?fieldName=' + fieldName +'&dealId=' + dealId+'&userRegion='+userRegion;
    return this.http.post<DealTrackerClient>(apiUrl, client, { withCredentials: true });
  
  }

  public deleteClientById(registrationId: number,dealId:number): Observable<any> {
    const apiUrl = this.baseApiUrl + 'api/DealTracker/deleteClientById?registrationId=' + registrationId+'&dealId='+dealId;
    return this.http.get<number>(apiUrl);
}

  public deleteClientAllocation(employeeCode: string, dealId: number): Observable<any> {
    const apiUrl = this.baseApiUrl + 'api/DealTracker/deleteClientAllocation?employeeCode=' + employeeCode + '&dealId=' + dealId;
    return this.http.get<number>(apiUrl);
  }


  public sendClientEmail(emailDetails: any): Observable<any> {
    const apiUrl = this.baseGatewayApiUrl + 'keySendClientEmail/sendClientEmail';
    return this.http.post<number>(apiUrl, emailDetails, { withCredentials: true });
  }
  public getClientHeadsByClientName(clientId: any): Observable<any[]> {
    const apiUrl = this.baseGatewayApiUrl + 'keyGetClientHeadByClientCode?clientCode=' + clientId;
    return this.http.get<any[]>(apiUrl);
  }

  public getMBStatusByDealId(dealId: any): Observable<number> {
    const apiUrl = this.baseGatewayApiUrl + 'keyGetMBStatusByDealId?dealId=' + dealId;
    return this.http.get<number>(apiUrl);
  }
  public getSellSideStatusByDealId(dealId: any): Observable<number> {
    const apiUrl = this.baseGatewayApiUrl + 'keyGetSellSideStatusByDealId?dealId=' + dealId;
    return this.http.get<number>(apiUrl);
  }
}
