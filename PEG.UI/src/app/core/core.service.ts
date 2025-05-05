import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../security/app-user-auth';
import { AppSettings } from '../shared/interfaces/appSettings.interface';
import { RoleType } from '../shared/enums/role-type.enum';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Subject, firstValueFrom, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountInfo } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  public authenticated: boolean;
  public appSettings: AppSettings;
  public isTrackerDirty: boolean = false;
  public addProhibition = new Subject<any>();
  public editProhibition = new Subject<any>();
  public updateProhibition = new Subject<any>();

  loggedInUser: User = new User();
  loggedInUserRoleId: RoleType;
  isImpersonated = false;
  loggedInUserPages: any = {};
  loggedInUserClaims: any = {};

  selectedFilter: any;
  public isNewRegistration: boolean = true;
  public newUpdates: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private inject: Injector,
  ) {}

  loadAppSettings(): Promise<AppSettings> {
    return this.http
      .get<AppSettings>('assets/peg-config.json?v=' + new Date().getTime())
      .pipe(
        map(res => {
          if (res) {
            this.appSettings = res;
            if (this.appSettings.clearLocalStorage) {
              Object.entries(localStorage)
                .map(x => x[0])
                .filter(
                  x =>
                    x.includes("registrationdata-") === false &&
                    x.includes(environment.settings.clientId) === false &&
                    x.includes(environment.settings.tenantId) === false &&
                    x.includes("msal.account.keys") === false
                )
                .forEach(x => localStorage.removeItem(x));
            }
            return res;
          } else {
            return undefined;
          }
        })
      )
      .toPromise();
  }


  async loadUser(accountInfo: AccountInfo): Promise<User> {
    // In case of staffing popup, load the third party token based on a different key.
    if (location.pathname.includes('staffing')) {
      try {
        const res: User[] = await firstValueFrom(
          this.http.get<User[]>(
            `${this.appSettings.PEGAuthApiBasePath}api/users/authenticateThirdPartyUser`
          )
        );
        if (res && res[0]) {
          this.loggedInUser = res[0];
          this.authenticated = this.loggedInUser.token !== '';
          this.setRole();
          this.setUserPages();
          this.setPageClaims();
  
          if (this.authenticated) {
            sessionStorage.setItem('bearerToken', this.loggedInUser.token);
          }
          return res[0];
        }
        return undefined;
      } catch (error) {
        console.error('Error authenticating third party user:', error);
        throw error;
      }
    } else {
      sessionStorage.removeItem('bearerToken');
      let employeeCode: string = await this.getEmployeeCode(accountInfo);
      if(this.appSettings.replaceUserEmployeeCode.find(x => x.ADEmployeeCode === employeeCode)){
        employeeCode = this.appSettings.replaceUserEmployeeCode.find(x => x.ADEmployeeCode.toLowerCase() === employeeCode.toLowerCase()).workdayEmployeeCode;
      }
      return await this.getBearerTokenForauthenticatedUser(employeeCode);
    }
  }




  setRole() {
    let roles = this.loggedInUser.securityRoles;
    let role = (roles && roles.length > 0) ? roles[0] : null;
    let roleId = role ? role.id : 0;
    this.loggedInUserRoleId = roleId;
  }

  setUserPages() {
    this.loggedInUserPages = {};
    this.loggedInUser.pages.forEach(page => {
      if (page.name && page.level === 1) {
        this.loggedInUserPages[page.name.toLowerCase()] = true;
      }
    });
  }

  setPageClaims() {
    this.loggedInUserClaims = {};
    this.loggedInUser.pages.forEach(page => {
      if (page.claims && page.level === 1) {
        this.loggedInUserClaims[page.claims.toLowerCase()] = true;
      }
    });
  }

  impersonateUser(employeeCode: string): Promise<User> {
    return this.http
      .get<User>(this.appSettings.PEGApiBasePath + 'api/users/' + employeeCode)
      .pipe(
        map(res => {
          if (res && res[0]) {
            this.loggedInUser = res[0];
            this.authenticated = this.loggedInUser.token !== '' ? true : false;
            this.setRole();
            this.setUserPages();
            this.setPageClaims();

            if (this.authenticated) {
              sessionStorage.setItem('bearerToken', this.loggedInUser.token);
            }
            this.isImpersonated = true;
            return res[0];
          } else {
            return undefined;
          }
        })
      )
      .toPromise();
  }

  loadUserThirdParty(): Promise<User> {
    return this.http
        .get<User>(this.appSettings.PEGAuthApiBasePath + "api/users/authenticateThirdPartyUser")
        .pipe(
            map((res) => {
                if (res && res[0]) {
                    this.loggedInUser = res[0];
                    this.authenticated = this.loggedInUser.token !== "" ? true : false;
                    this.setRole();
                    this.setUserPages();
                    this.setPageClaims();

                    if (this.authenticated) {
                        sessionStorage.setItem("bearerToken", this.loggedInUser.token);
                    }
                    return res[0];
                } else {
                    return undefined;
                }
            })
        )
        .toPromise();
  }
  private getUserGraphApiData() {
    const baseGraphApiUrl = this.appSettings.settings.graphAPIResourceUri;
    return this.http.get(`${baseGraphApiUrl}v1.0/me?$select=employeeId,userPrincipalName`);
  }

  private updateAuthenticationState(user: User): void {
    this.loggedInUser = user;
    this.authenticated = !!user.token;
    this.setRole();
    this.setUserPages();
    this.setPageClaims();

    if (this.authenticated) {
      sessionStorage.setItem('bearerToken', user.token);
    }
  }

  private async getEmployeeCode(accountInfo: AccountInfo): Promise<string> {
    if (accountInfo?.idTokenClaims?.employeeid) {
      return accountInfo.idTokenClaims.employeeid.toString();
    }

    const loggedInUserEmail = accountInfo?.username ?? '';
    const isTestUser =
      loggedInUserEmail.localeCompare(
        this.appSettings.settings.testUserEmail || '',
        'en',
        { sensitivity: 'base' }
      ) === 0;

    if (isTestUser) {
      return this.appSettings.settings.testUserEmployeeId;
    }

    try {
      const graphData:any = await firstValueFrom(this.getUserGraphApiData());
      return graphData?.employeeId?.toString();
    } catch (error) {
      console.error('Error fetching user data from Graph API:', error);
      throw error;
    }
  }

  private async getBearerTokenForauthenticatedUser(employeeCode: string): Promise<User> {
    try {
      const res: User[] = await firstValueFrom(
        this.http.get<User[]>(
          `${this.appSettings.PEGGatewayApiBasePath}authentication/authUser?employeeCode=${employeeCode}`
        )
      );
      if (res && res[0]) {
        this.updateAuthenticationState(res[0]);
        return res[0];
      }
      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }
}
