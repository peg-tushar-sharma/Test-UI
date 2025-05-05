import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NewOpportunityComponent } from "./new-opportunity/new-opportunity.component";

const routes: Routes = [
    {
        path: "newopportunity",
        component: NewOpportunityComponent
    }, {
        path: 'newopportunity/:registrationId',
        component: NewOpportunityComponent,
    },
    {
        path: 'newopportunity/:registrationId/:source',
        component: NewOpportunityComponent,
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OpportunityRoutingModule { }
