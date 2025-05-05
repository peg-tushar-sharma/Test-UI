import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { AppInitializerService } from './app-initializer.service';
import { AppComponent } from './app.component';
import { AppInsightWrapper } from './applicationInsight/appInsightWrapper';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CoreModule } from './core/core.module';
import { CoreService } from './core/core.service';
import { DealsService } from './deals/deals.service';
import { ErrorModule } from './error/error.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorHandler } from './shared/error-handler/global-error.service';
import { GlobalModule } from './global/global.module';
import { HttpInterceptorModule } from './security/http-interceptor.module';
import { HelpComponent } from './shared/help/help.component';
import { HelpService } from './shared/help/help.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ImpersonateComponent } from './shared/impersonate/impersonate.component';
import { InvalidAccessComponent } from './invalid-access/invalid-access.component';
import { LowerCaseUrlSerializer } from './security/app-urlserializer';
import { ModalComponent } from './shared/modal/modal.component';
import { NewUpdatesComponent } from './shared/new-updates/new-updates.component';
import { RegistrationService } from './registrations/registrations/registration.service';
import { AppRoutingModule } from './app-routing.module';
import { UrlSerializer } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from './shared/shared.module';
import { SignalRService } from './shared/signalr/signalr.service';
import { TimeoutDialogComponent, TimeoutDialogService } from './shared/timeout-session/timeoutdialog.service';
import { TimeoutService } from './shared/timeout-session/timeout.service';
import { AppNavigationComponent } from './app-navigation/app-navigation.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { StoreModule } from '@ngrx/store';
import { UndoRedoModule } from './shared/store/undo-redo.module';
import { AppAuthenticationService } from './app-authentication.service';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../environments/environment';
const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export function intializeApp(appInializerService: AppInitializerService, appAuthService: AppAuthenticationService) {
  return () => appAuthService.isEmployeeAuthenticated().then(async () => {
    return await appInializerService.initializeApp();
  });
}

@NgModule({
  declarations: [
    AppComponent,
    InvalidAccessComponent,
    ImpersonateComponent,
    HelpComponent,
    NewUpdatesComponent,
    TimeoutDialogComponent,
    AppNavigationComponent,
    AppFooterComponent,
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    GlobalModule,
    SharedModule,
    HttpInterceptorModule,
    ErrorModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true
    }),
    MsalModule,
    StoreModule.forRoot({}, {}),
    UndoRedoModule
  ],
  exports: [ModalComponent],
  providers: [RegistrationService, TimeoutService, TimeoutDialogService,AppAuthenticationService,
   
    {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },

    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: APP_INITIALIZER,
      useFactory: intializeApp,
      multi: true,
      deps: [AppInitializerService, AppAuthenticationService,CoreService]
    },
    HelpService,
    DealsService,
    SignalRService,
    AppInsightWrapper
  ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})

export class AppModule { }



export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.settings.clientId,
      authority: environment.settings.authority,
      redirectUri: environment.settings.redirectUri,
      postLogoutRedirectUri: environment.settings.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true, // set to true for IE 11
    },
    system: {
      allowRedirectInIframe: true,
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([
      [environment.settings.graphAPIResourceUri, environment.settings.graphAPIResourceScopes]
    ])
  };
}




export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  };
}