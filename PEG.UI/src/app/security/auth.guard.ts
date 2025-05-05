
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { CommonMethods } from '../shared/common/common-methods';
import { CoreService } from '../core/core.service';
import { Injectable } from '@angular/core';
import { MsalService, MsalGuard } from '@azure/msal-angular';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  deviceInfo: any;

  constructor(private coreService: CoreService, private router: Router, private authService: MsalService, private msalGuard: MsalGuard
  ) {

  }
  waitForVariableToBeTrue(): Promise<void> {
    return new Promise((resolve) => {
      const checkVariable = () => {
        if (this.coreService.loggedInUser.employeeCode != "" && this.coreService.loggedInUser.employeeCode != null && this.coreService.loggedInUser.employeeCode != undefined) {
          resolve();
        } else {
          setTimeout(checkVariable, 100); // Check again after 100ms
        }
      };
      checkVariable();
    });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.msalGuard.canActivate(next, state).pipe(
      switchMap(async (isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.deviceInfo = CommonMethods.deviceInfo();
          let canActivate = false;
          let claimType: Array<string> = next.data['claimType'];
          // Wait for app initilizer to load and get the auth data when try accessing the route link
          await this.waitForVariableToBeTrue();
          let loggedInUserClaims = this.coreService.loggedInUserClaims;
          claimType?.forEach(claimTypeItem => {
            if (claimTypeItem) {
              const claimTypeItemLower = claimTypeItem.toLowerCase();
              if (loggedInUserClaims && loggedInUserClaims[claimTypeItemLower]) {
                canActivate = true;
              }
            }
          });
          if (!canActivate) {
            this.router.navigate(['/invalidaccesscomponent']);
          }
          return canActivate;
        } else {
          return false;
        }
      }),
      switchMap((canActivate) => of(canActivate)),
      catchError(() => {
        this.router.navigate(['/invalidaccesscomponent']);  // Navigate to an error component if needed
        return of(false);
      })
    );
  }
}