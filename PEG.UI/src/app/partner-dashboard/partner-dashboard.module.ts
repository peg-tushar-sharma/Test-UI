import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { DashboardRoutingModule } from "./partner-dashboard-routing.module";
import { PartnerDashboardComponent } from "./partner-dashboard/partner-dashboard.component";
import { PartnerDashboardService } from "./partner-dashboard/partner-dashboard.service";
import { SharedModule } from "../shared/shared.module";
import { RegistrationService } from "../registrations/registrations/registration.service";
import { AuditLogService } from "../shared/AuditLog/auditLog.service";
import { AuditLogRepositoryService } from "../shared/AuditLog/audit-log-repository.service";
import { RegistrationRequestService } from "../registrations/registrations/registration-request-service";
import { AgGridModule } from "ag-grid-angular";
import { StageCellRendererComponent } from "./stage-cell-renderer/stage-cell-renderer.component";
import { StageCellEditorComponent } from "./stage-cell-editor/stage-cell-editor.component";
import { CreateOppSlideoutComponent } from "./create-opp-slideout/create-opp-slideout.component";
import { PartnerDashboardGridColumnService } from "../shared/grid-generator/partner-dashboard-grid-column.service";
import { PipelineService } from "../pipeline/pipeline.service";
import { NewRegistrationService } from "../registrations/new-registration/new-registration.service";
import { NoteService } from "../registrations/sidebar-notes/sidebar-notes.service";
import { ProhibitionService } from "../registrations/prohibitions/prohibition.service";
import { RegistrationGridService } from "../registrations/registrations/registration-grid.service";
import { InfoTextService } from "../shared/info-icon/infoText.service";
import { commonUtility } from "../shared/common/common-utility";
import { NewOpportunityService } from "../opportunity/new-opportunity/new-opportunity.service";
import { SharingModalComponent } from './sharing-modal/sharing-modal.component';
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { RequestCaseCodeComponent } from './request-case-code/request-case-code.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { GlobalService } from "../global/global.service";
import { RequestCaseCodeFormBuilder } from "./request-case-code/request-case-code-form-builder";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RequestCaseCodeService } from "./request-case-code/request-case-code.service";
import { QuillModule } from "ngx-quill";
import { MentionPartnersComponent } from "../shared/mention-partners/mention-partners.component";

@NgModule({
    declarations: [
        PartnerDashboardComponent,
        StageCellRendererComponent,
        StageCellEditorComponent,
        CreateOppSlideoutComponent,
        SharingModalComponent,
        RequestCaseCodeComponent,
        MentionPartnersComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
        BsDatepickerModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPopoverModule,
        AgGridModule,
        QuillModule.forRoot()
    ],
    providers: [
        PartnerDashboardService,
        //remove registration specifc imports
        RegistrationService,
        AuditLogService,
        AuditLogRepositoryService,
        RegistrationRequestService,
        PartnerDashboardGridColumnService,
        PipelineService,
        GlobalService,
        DatePipe, NewRegistrationService, NoteService, ProhibitionService,
        RegistrationGridService, InfoTextService, commonUtility, NewOpportunityService, RequestCaseCodeFormBuilder, RequestCaseCodeService
        //remove registration specifc imports
    ]
})
export class PartnerDashboardModule { }
