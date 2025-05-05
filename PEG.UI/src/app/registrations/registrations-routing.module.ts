import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegistrationsComponent } from "./registrations/registrations.component";
import { RegistrationMessageComponent } from "./registration-message/registration-message.component";
import { UpdatedRegistrationsComponent } from "./updated-registrations/updated-registrations.component";

const routes: Routes = [
    {
        path: "",
        component: RegistrationsComponent
    },
    {
        path: "registration2.0",
        component: UpdatedRegistrationsComponent
    },
    {
        path: ":id",
        component: RegistrationsComponent
    },
    {
        path: "registration-message",
        component: RegistrationMessageComponent,
        data: { claimType: "registrations" }
    },
    {
        path: "registration-message/:term",
        component: RegistrationMessageComponent,
        data: { claimType: "registrations" }
    },     
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegistrationsRoutingModule { }
