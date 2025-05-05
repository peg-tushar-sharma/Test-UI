import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service'
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';


@Injectable()
export class AppInsightWrapper {

  appInsights: ApplicationInsights;
  private cloudRoleName: string = 'PEG.UI';

  constructor(private coreService: CoreService, private router: Router) {
  }
  public loadAppInsightConfig() {
    this.appInsights = new ApplicationInsights({
      config: {
        connectionString: this.coreService.appSettings.AzureAppInsightsConnectionString,
        instrumentationKey: this.coreService.appSettings.AzureInstrumentationKey,
        enableAutoRouteTracking: true, // option to log all route changes
      }
    });
    this.appInsights?.loadAppInsights();
    this.appInsights?.setAuthenticatedUserContext(this.coreService.loggedInUser.employeeCode, this.coreService.loggedInUser.employeeCode, true);
    this.setCloudRoleName(this.cloudRoleName);
    this.loadCustomTelemetryProperties();
    this.createRouterSubscription();
  }
  private createRouterSubscription() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.logPageView("Application Module", event.urlAfterRedirects);
    });
  }
  private loadCustomTelemetryProperties() {
    this.appInsights?.addTelemetryInitializer(envelope => {
      var item = envelope.baseData;
      envelope.ext.user.id = this.coreService.loggedInUser.employeeCode;
      item.properties = item.properties || {};
      item.properties["ApplicationPlatform"] = "Web";
      item.properties["ApplicationName"] = "C2C-" + this.coreService.appSettings.environment;
      item.properties["EmployeeCode"] = this.coreService.loggedInUser.employeeCode;
    });
  }
  private setCloudRoleName(roleName: string): void {
    this.appInsights?.addTelemetryInitializer((envelope) => {
      const telemetryItem = envelope as any;
      if (!telemetryItem.tags) {
        telemetryItem.tags = {};
      }
      telemetryItem.tags['ai.cloud.role'] = roleName; // Set cloud role name
    });
  }
  logPageView(name?: string, url?: string) { // option to call manually
    this.appInsights?.trackPageView({
      name: name,
      uri: url
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights?.trackEvent({ name: name }, properties);
  }
  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    this.appInsights?.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    this.appInsights?.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    this.appInsights?.trackTrace({ message: message }, properties);
  }


}