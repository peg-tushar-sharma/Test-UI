import { Observable, of } from 'rxjs';

import { ColorType } from '../shared/enums/colorType.enum';
import { CoreService } from '../core/core.service';
import { ExpertCategory } from '../deals/new-deal/deal-experts/expertCategory';
import { GridColumn } from '../shared/interfaces/grid-column.interface';
import { HttpClient } from '@angular/common/http';
import { industrSectorSubSector } from '../shared/interfaces/industrSectorSubsector';
import { industry } from '../shared/interfaces/industry';
import { Injectable } from '@angular/core';
import { Office } from '../shared/interfaces/office';
import { OfficeHierarchy } from '../shared/interfaces/officeHierarchy';
import { map } from 'rxjs/operators';
import { Priority } from '../shared/interfaces/priority';
import { Region } from '../shared/enums/region';
import { Currency } from '../shared/interfaces/currency';
import { Capability } from '../shared/interfaces/capability';
import { FundType } from '../shared/interfaces/fundType';
import { RegistrationStage } from '../shared/interfaces/RegistrationStage';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public region: Observable<any>;
  public expertGroupCategory: Observable<any>;
  public dealStatus: Observable<any>;
  public expertCategories: ExpertCategory[];
  public registrationStage: RegistrationStage[];
  public secondaryNote:any[];
  public expertPoolColors: Observable<any>;
  public resourceNoteColors: Observable<any>;
  public mbStatus: Observable<any>;
  public sellSideStatus: Observable<any>;
  public industrySectors: industry[];
  public locationOfDeal: Observable<any>;
  public workTypeData: Observable<any>;
  public workStartData: Observable<any>;
  public pipelineGroups: Observable<any>;
  public opportunityStage: Observable<any>;
  public pipelineQuantifier: Observable<any>;
  public gridColumn: GridColumn[];
  public priority: Priority[];
  public securityRoles: Observable<any>
  public teamSize: Observable<any>;
  public weeklyRackRate:Observable<any>;
  public additionalServices: Observable<any>;
  public pipelineStatus: Observable<any>;
  public caseComplexity: Observable<any>;
  public clientCommitment: Observable<any>;
  public opsLikelihood:Observable<any>;
  public office: Office[];
  public languages: any[];
  private baseGatewayApiUrl: any
  public industrySectorSubsectors: industrSectorSubSector;
  public officeHierarchy: OfficeHierarchy;
  public allOffices: Office[];
  public currency:Currency[];
  public capabilities:Capability[];
  public fundTypes:FundType[];
  public ratePriced:any;
  constructor(private http: HttpClient, private coreService: CoreService) {
    if (this.coreService.appSettings && this.coreService.appSettings.PEGApiBasePath) {
      this.baseGatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;
    }

  }
  public getOpportunityStage(): Observable<any> {
    if (this.opportunityStage) {
      return of(this.opportunityStage);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getOpportunityStage';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.opportunityStage = data;
          return this.opportunityStage;
        })
      )
    }
  }

  public getPipelineStatus(): Observable<any> {
    if (this.pipelineStatus) {
      return of(this.pipelineStatus);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getPipelineStatus';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.pipelineStatus = data;
          return this.pipelineStatus;
        })
      )
    }
  }
  public getSecurityRoles(): Observable<any> {
    if (this.securityRoles) {
      return of(this.securityRoles);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'AdminSecurity/getSecurityRoles';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.securityRoles = data;
          return this.securityRoles;
        })
      )
    }
  }
  public getTeamSize(): Observable<any> {
    if (this.teamSize) {
      return of(this.teamSize);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getTeamSize';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.teamSize = data;
          return this.teamSize;
        })
      )
    }
  }



  public getCaseComplexity(): Observable<any> {
    if (this.caseComplexity) {
      return of(this.caseComplexity);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getCaseCoplexity';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.caseComplexity = data;
          return this.caseComplexity;
        })
      )
    }
  }
  public getFundTypes(): Observable<FundType[]> {
    if (this.fundTypes) {
      return of(this.fundTypes);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getfundTypes';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.fundTypes = data;
          return this.fundTypes;
        })
      )
    }
  }
  public getRatePriced(): Observable<any> {
    if (this.ratePriced) {
      return of(this.ratePriced);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getRatePriced';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.ratePriced = data;
          return this.ratePriced;
        })
      )
    }
  }
  
  public getWeeklyRackRate():Observable<any>{
    if (this.weeklyRackRate) {
      return of(this.weeklyRackRate);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getWeeklyRackRate';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.weeklyRackRate = data;
          return this.weeklyRackRate;
        })
      )
    }

  }
  public getCapabilities(): Observable<Capability[]> {
    if (this.capabilities) {
      return of(this.capabilities);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getCapabilities';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.capabilities = data;
          return this.capabilities;
        })
      )
    }
  }

  public getAdditionalServices(): Observable<any> {
    if (this.additionalServices) {
      return of(this.additionalServices);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getAdditionalServices';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.additionalServices = data;
          return this.additionalServices;
        })
      )
    }
  }
  public getMBStatus(): Observable<any> {
    if (this.mbStatus) {
      return of(this.mbStatus);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getMBStatus';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.mbStatus = data;
          return this.mbStatus;
        })
      )
    }
  }

  public getSellSideStatus(): Observable<any> {
    if (this.sellSideStatus) {
      return of(this.sellSideStatus);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getSellSideStatus';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.sellSideStatus = data;
          return this.sellSideStatus;
        })
      )
    }
  }

  public getIndustrySectors(): Observable<industry[]> {
    if (this.industrySectors) {
      return of(this.industrySectors);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getIndustrySectors';
      return this.http.get<industry[]>(apiUrl, { withCredentials: true }).pipe(
        map((data: industry[]) => {
          this.industrySectors = data;
          return this.industrySectors;
        })
      )
    }
  }

  public getClientCommitment(): Observable<any> {
    if (this.clientCommitment) {
      return of(this.clientCommitment);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getClientCommitment';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.clientCommitment = data;
          return this.clientCommitment;
        })
      )
    }
  }
  public getOpsLikelihood(): Observable<any> {
    if (this.opsLikelihood) {
      return of(this.opsLikelihood);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getOpsLikelihood';
      return this.http.get<any>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
           this.opsLikelihood = data;
          return this.opsLikelihood;
        })
      )
    }
  }
  public getAllIndustrySectorsSubSectors(): Observable<industrSectorSubSector> {
    if (this.industrySectorSubsectors) {
      return of(this.industrySectorSubsectors);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getAllIndustrySectorsSubSectors';
      return this.http.get<industrSectorSubSector>(apiUrl, { withCredentials: true }).pipe(
        map((data: industrSectorSubSector) => {
          this.industrySectorSubsectors = data;
          return this.industrySectorSubsectors;
        })
      )
    }
  }

  public getExpertPoolColors(): Observable<any> {
    if (this.expertPoolColors) {
      return of(this.expertPoolColors);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/pegColor?colorType='+ColorType.ExpertPool;
      return this.http.get<any[]>(apiUrl, { withCredentials: true }).pipe(
        map((data: any) => {
          this.expertPoolColors = data;
          return this.expertPoolColors;
        })
      )
    }
  }

  public getResourceNoteColors(): Observable<any> {
    if (this.resourceNoteColors) {
      return of(this.resourceNoteColors);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/pegColor?colorType='+ColorType.ResourceNote;
      return this.http.get<any[]>(apiUrl).pipe(
        map((data: any) => {
          this.resourceNoteColors = data;
          return this.resourceNoteColors;
        })
      )
    }
  }

  public getDealStatus(): Observable<any> {
    if (this.dealStatus) {
      return of(this.dealStatus);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/DealStatus';
      return this.http.get<any[]>(apiUrl).pipe(
        map((data: any) => {
          this.dealStatus = data;
          return this.dealStatus;
        })
      )
    }
  }

  public getExpertCategories(): Observable<ExpertCategory[]> {
    if (this.expertCategories) {
      return of(this.expertCategories);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/ExpertCategories';
      return this.http.get<ExpertCategory[]>(apiUrl).pipe(
        map((data: ExpertCategory[]) => {
          this.expertCategories = data;
          return this.expertCategories;
        })
      )
    }
  }

  public getRegions(): Observable<any> {
    if (this.region) {
      return of(this.region);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/Region';
      return this.http.get<any>(apiUrl).pipe(
        map((data: any) => {
          this.region = data;
          return this.region;
        })
      )
    }
  }

  public getExpertGroupCategory(): Observable<any> {
    if (this.expertGroupCategory) {
      return of(this.expertGroupCategory);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getExpertGroupCategory';
      return this.http.get<any>(apiUrl).pipe(
        map((data: any) => {
          this.expertGroupCategory = data;
          return this.expertGroupCategory;
        })
      )
    }
  }

  public getLocationofDeals(): Observable<any> {
    if (this.locationOfDeal) {
      return of(this.locationOfDeal);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/LocationOfDeal';
      return this.http.get<any>(apiUrl).pipe(
        map((data: any) => {
          this.locationOfDeal = data;
          return this.locationOfDeal;
        })
      )
    }
  }

  public getWorkTypeData(): Observable<any> {
    if (this.workTypeData) {
      return of(this.workTypeData);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/worktype';
      return this.http.get<any>(apiUrl).pipe(
        map((data: any) => {
          this.workTypeData = data;
          return this.workTypeData;
        })
      )
    }
  }

  public getWorkToStartData(): Observable<any> {
    if (this.workStartData) {
      return of(this.workStartData);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/worktostart';
      return this.http.get<any>(apiUrl, { headers: { cache: 'yes' } }).pipe(
        map((data: any) => {
          this.workStartData = data;
          return this.workStartData;
        })
      )
    }
  }

  public getPipelineGroupData(): Observable<any> {
    if (this.pipelineGroups) {
      return of(this.pipelineGroups);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getPipelineGroups';
      return this.http.get<any>(apiUrl).pipe(
        map((data: any) => {
          this.pipelineGroups = data;
          return this.pipelineGroups;
        })
      )
    }
  }

  public getPipelineQuantifier(params): Observable<any> {
    if (this.pipelineQuantifier) {
      return of(this.pipelineQuantifier);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getPipelineQuantifier' + '?typeId=' + params;
      return this.http.get<any>(apiUrl).pipe(
        map((data: any) => {
          this.pipelineQuantifier = data;
          return this.pipelineQuantifier;
        })
      )
    }
  }
  public getRegistrationStage(): Observable<RegistrationStage[]> {
    if (this.registrationStage) {
      return of(this.registrationStage);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/RegistrationStage';
      return this.http.get<RegistrationStage[]>(apiUrl).pipe(
        map((data: RegistrationStage[]) => {
          this.registrationStage = data;
          return this.registrationStage;
        })
      )
    }
  }
  public getGetSecondaryNote(): Observable<any[]> {
    if (this.secondaryNote) {
      return of(this.secondaryNote);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getSecondaryNotes';
      return this.http.get<any[]>(apiUrl).pipe(
        map((data: any[]) => {
          this.secondaryNote = data;
          return this.secondaryNote;
        })
      )
    }
  }
  public getPriority(): Observable<Priority[]> {
    if (this.priority) {
      return of(this.priority);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/GetPriority';
      return this.http.get<Priority[]>(apiUrl).pipe(
        map((data: Priority[]) => {
          this.priority = data;
          return this.priority;
        })
      )
    }
  }
  public getGridColumns(pageId: number): Observable<GridColumn[]> {
    if (this.gridColumn) {
      return of(this.gridColumn);
    } else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/RegistrationGridColumn' + '?pageId=' + pageId;
      return this.http.get<GridColumn[]>(apiUrl).pipe(
        map((data: GridColumn[]) => {
          this.gridColumn = data;
          return this.gridColumn;
        })
      )
    }

  }

  public getOffice(): Observable<Office[]> {
    if (this.office) {
      return of(this.office);
    } else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/office';
      if (apiUrl) {
        return this.http.get<Office[]>(apiUrl, { headers: { cache: 'yes' } }).pipe(
          map((data: Office[]) => {
            this.office = data;
            return this.office;
          })
        );
      }
    }
  }
  public getAllOffice(): Observable<Office[]> {
    if (this.allOffices) {
      return of(this.allOffices);
    } else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getAllOffices';
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
  public getLanguages(): Observable<any[]> {
    if (this.languages) {
      return of(this.languages);
    } else {
      const apiUrl = this.baseGatewayApiUrl + 'getLanguages';
      if (apiUrl) {
        return this.http.get<any[]>(apiUrl, { headers: { cache: 'yes' } }).pipe(
          map((data: any[]) => {
            this.languages = data;
            return this.languages;
          })
        );
      }
    }
  }

  public GetBainOfficesByName(query: string): Observable<any[]> {
    const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/getOfficeByName';

    query = (query == null) ? '' : query;
    return this.http.get<Office[]>(apiUrl + "?query=" + query);
  }
  public getCurrency(): Observable<Currency[]> {
    if (this.currency) {
      return of(this.currency);
    }
    else {
      const apiUrl = this.baseGatewayApiUrl + 'keyGlobal/currency';
      return this.http.get<Currency[]>(apiUrl, { withCredentials: true }).pipe(
        map((data: Currency[]) => {
          this.currency = data;
          return this.currency;
        })
      )
    }
  }
  public getOfficeHierarchy(): Observable<any> {
    if (this.officeHierarchy) {
      return of(this.officeHierarchy);
    } else {
      const apiUrl = this.baseGatewayApiUrl + "keyGlobal/getOfficeHierarchy?regionIds="+Region.EMEA.toString();
      if (apiUrl) {
        return this.http.get<any[]>(apiUrl, { headers: { cache: 'yes' } }).pipe(
          map((data: any) => {
            this.officeHierarchy = data;
            return this.officeHierarchy;
          })
        );
      }
    }
  }
}
