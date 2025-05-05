import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RegistrationsComponent } from "./registrations/registrations.component";
import { RegistrationsRoutingModule } from "./registrations-routing.module";
import { AgGridModule } from "ag-grid-angular";
import { SharedModule } from "../shared/shared.module";
import { NewRegistrationService } from "./new-registration/new-registration.service";
import { RegistrationService } from "./registrations/registration.service";
import { NoteService } from "./sidebar-notes/sidebar-notes.service";
import { RegistrationRequestService } from "../registrations/registrations/registration-request-service";
import { CreateEditProhibitionComponent } from "./prohibitions/create-edit-prohibition.component";
import { ProhibitionService } from "./prohibitions/prohibition.service";
import { AuditLogService } from "../shared/AuditLog/auditLog.service";
import { AuditLogRepositoryService } from "../shared/AuditLog/audit-log-repository.service";
import { DateFilterComponent } from "../shared/customFilters/date-filter/date-filter.component";
import { RegistrationGridService } from "./registrations/registration-grid.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { InfoTextService } from "../shared/info-icon/infoText.service";
import { RegistrationMessageComponent } from "./registration-message/registration-message.component";
import { commonUtility } from "../shared/common/common-utility";
import { DealPopupComponent } from "./registrations/deal-popup/deal-popup.component";
import { AddRegistrationsToDealPopupComponent } from "./registrations/add-registrations-to-deal-popup/add-registrations-to-deal-popup.component";
import { UpdatedRegistrationsComponent } from "./updated-registrations/updated-registrations.component";
import { PipelineService } from "../pipeline/pipeline.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NewOpportunityService } from "../opportunity/new-opportunity/new-opportunity.service";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AgGridSharedComponentsModule } from "../shared/ag-grid-custom-components/ag-grid-shared-components.module";

@NgModule({
    declarations: [
        RegistrationsComponent,
        RegistrationMessageComponent,
        DealPopupComponent,
        AddRegistrationsToDealPopupComponent,
        UpdatedRegistrationsComponent,
    ],
    imports: [
        RegistrationsRoutingModule,
        CommonModule,
        SharedModule,
        AgGridModule,
        AgGridSharedComponentsModule,
        ReactiveFormsModule,
        NgSelectModule,
        BsDropdownModule.forRoot(),
        BsDatepickerModule,
        FormsModule
    ],
    providers: [
        DatePipe,
        NewRegistrationService,
        RegistrationService,
        RegistrationRequestService,
        NoteService,
        ProhibitionService,
        PipelineService,
        AuditLogService,
        AuditLogRepositoryService,
        RegistrationGridService,
        InfoTextService,
        commonUtility,
        NewOpportunityService
    ]
})
export class RegistrationsModule {}
