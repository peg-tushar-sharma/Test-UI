import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PartnerDashboardComponent } from "./partner-dashboard/partner-dashboard.component";

const routes: Routes = [
    {
        path: "",
        component: PartnerDashboardComponent,
        pathMatch: "full"

    }, {
        path: "stage-update/:registrationId",
        component: PartnerDashboardComponent,
        pathMatch: "full"

    }

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
