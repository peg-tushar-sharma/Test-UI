import { Injectable } from '@angular/core';
import { CoreService } from './core/core.service';
import { AppRoutes } from './app-routes';
import { AppInsightWrapper } from './applicationInsight/appInsightWrapper';
import { AppAuthenticationService } from './app-authentication.service';
import { Router } from '@angular/router';
import { AccountInfo } from '@azure/msal-browser';


@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  constructor(private coreService: CoreService, private insight:AppInsightWrapper, private authService: AppAuthenticationService, private route: Router ) { }

  initializeApp(): Promise<any> {

    // App initialization
    return new Promise((resolve) => {
      let accountInfo: AccountInfo = this.authService.getActiveAccount();
      // Load app settings
      let $appSettings = this.coreService.loadAppSettings();
      // configDeps.push($appSettings);
      $appSettings.then((appSettings) => {

        if (appSettings) {          
          // Load logged in user
          let $user = this.coreService.loadUser(accountInfo);
          // configDeps.push($user);
         
          // configure routes 
          $user.then(user => {
            if (user) {
              this.insight.loadAppInsightConfig();
              setTimeout( ()=>
              { 
                AppRoutes.setDefaultRoute(user);
                resolve(null);
              },1000);
              
                       
            } else {
              alert("Something went wrong. Please contact admin.");
            }
          });
        } else {
          alert("Something went wrong. Please contact admin.");
        }

        // return Promise.all(configDeps);
      });//.then(() => {

      // Initialization completes
      // resolve();
      // });
    });

    // App initialization
  }
}
