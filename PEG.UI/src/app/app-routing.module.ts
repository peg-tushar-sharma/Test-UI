import { ModuleWithProviders, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./security/auth.guard";
import { InvalidAccessComponent } from "./invalid-access/invalid-access.component";
import { DefaultRouteGaurd } from "./default-route-gaurd";
import { MsalGuard } from "@azure/msal-angular";
import { AppComponent } from "./app.component";

const routes: Routes = [
    {
        path: "",
        canActivate: [MsalGuard],
        component: AppComponent,
        pathMatch: "full"
    },
    {
        path: "opportunity",
        loadChildren: () => import("./opportunity/opportunity.module").then((m) => m.OpportunityModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["new opportunity"] }
    },

    {
        path: "pending-approval",
        loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["pendingapproval"] }
    },
    {
        path: "partner-dashboard",
        loadChildren: () =>
            import("./partner-dashboard/partner-dashboard.module").then((m) => m.PartnerDashboardModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["partnerdashboard"] }
    },
    {
        path: 'conflicts',
        loadChildren: () => import("./conflicts/conflicts.module").then(m => m.ConflictsModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ['conflicts'] }
    },
    {
        path: "reports",
        loadChildren: () => import("./reports/reports.module").then((m) => m.ReportsModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["reports"] }
    },
    {
        path: "search",
        loadChildren: () => import("./registrations/registrations.module").then((m) => m.RegistrationsModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["search"] }
    },
    {
        path: "reports",
        loadChildren: () => import("./reports/reports.module").then((m) => m.ReportsModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["reports"] }
    },

    {
        path: "registrations",
        loadChildren: () => import("./registrations/registrations.module").then((m) => m.RegistrationsModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["registrations"] }
    },

    {
        path: "settings",
        loadChildren: () => import("./settings/settings.module").then((m) => m.SettingsModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["settings"] }
    },
    {
        path: "deals",
        loadChildren: () => import("./deals/deals.module").then((m) => m.DealsModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["deals"] }
    },
    {
        path: "invalidaccesscomponent",
        component: InvalidAccessComponent
    },
    {
        path: "pipeline",
        loadChildren: () => import("./pipeline/pipeline.module").then((m) => m.PipelineModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["pipeline"] }
    },
    {
        path: "admin",
        loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["admin"] }
    },
    {
        path: "staffing",
        loadChildren: () => import("./staffing/staffing.module").then((m) => m.StaffingModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["staffing"] }
    },
    {
        path: "staffing-creation",
        loadChildren: () => import("./staffing-creation/staffing-creation.module").then((m) => m.StaffingCreationModule),
        canActivate: [MsalGuard, AuthGuard],
        data: { claimType: ["staffing"] }
    }
];

// export const Routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes, {
//     useHash: false,
//     onSameUrlNavigation: "reload"
// });


@NgModule({
    /* Changes start here. */
    // Replace the following line with the next one
    imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabledBlocking',
        onSameUrlNavigation: "reload",
        useHash: false,

    })],
    /* Changes end here. */
    exports: [RouterModule]
})
export class AppRoutingModule { }