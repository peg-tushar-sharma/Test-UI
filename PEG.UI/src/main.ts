import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environmentLoader } from './environments/environmentLoader';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// for enterprise customers
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey("Using_this_AG_Grid_Enterprise_key_( AG-045130 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( Bain & Company, Inc. )_is_granted_a_( Multiple Applications )_Developer_License_for_( 18 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_AG_Grid_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 16 June 2025 )____[v2]_MTc1MDAyODQwMDAwMA==4f18f2d9647078bb3a21aab19569b416");

environmentLoader.then(env => {
  if (environment.production) {
    enableProdMode();
    if (window) {
      window.console.log = () => { };
    }
  }
  environment.settings = env.settings;


  platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
    if ('serviceWorker' in navigator && environment.production) {
      navigator.serviceWorker.register('ngsw-worker.js');
    }
  }).catch(err => console.error(err));
});