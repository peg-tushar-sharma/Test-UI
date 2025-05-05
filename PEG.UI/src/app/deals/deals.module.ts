import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { DealsComponent } from "./deals/deals.component";
import { DealsRoutingModule } from "./deals-routing.module";
import { AgGridModule } from "ag-grid-angular";
import { NewDealComponent } from "./new-deal/new-deal.component";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NewRegistrationService } from "../registrations/new-registration/new-registration.service";
import { DealPeopleTagComponent } from "./deal-people-tag/deal-people-tag.component";
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { DealContextComponent } from "./new-deal/deal-context/deal-context.component";
import { DealInfoComponent } from "./new-deal/deal-context/deal-info/deal-info.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { DealProcessComponent } from "./new-deal/deal-context/deal-process/deal-process.component";
import { DealBainHistoryComponent } from "./new-deal/deal-context/deal-bain-history/deal-bain-history.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { DealExpertsComponent } from "./new-deal/deal-experts/deal-experts.component";
import { RegistrationService } from "../registrations/registrations/registration.service";
import { RegistrationGridService } from "../registrations/registrations/registration-grid.service";
import { SharedModule } from "../shared/shared.module";
import { DealClientsComponent } from "./new-deal/deal-clients/deal-clients.component";
import { DealAllocationComponent } from "./new-deal/deal-allocation/deal-allocation.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PopoverModule } from "ngx-bootstrap/popover";
import { UserProfileTooltipComponent } from "./new-deal/deal-strategy/user-profile-tooltip/user-profile-tooltip.component";
import { UserProfileTooltipAllocationComponent } from "./new-deal/deal-allocation/user-profile-tooltip/user-profile-tooltip.component";
import { EditAllocationNotesComponent } from "./new-deal/deal-allocation/edit-allocation-notes/edit-allocation-notes.component";
import { ConfirmModalComponent } from "../../app/shared/confirm-modal/confirm-modal.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ClientDatesComponent } from "./new-deal/deal-clients/client-dates/client-dates.component";
import { DealSecurityService } from "./deal.security.service";
import { DealSecurityComponent } from "./new-deal/deal-security/deal-security.component";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { DealPresetPopupComponent } from "./new-deal/deal-security/deal-preset-popup/deal-preset-popup.component";
import { PendingChangesGuard } from "../security/pending-changes.guard";
import { DealAuditComponent } from "./new-deal/deal-audit/deal-audit.component";
import { AuditLogRepositoryService } from "../shared/AuditLog/audit-log-repository.service";
import { DealGridColumnService } from "../shared/grid-generator/deal-grid-column.service";
import { Title } from "@angular/platform-browser";
import { ResourceAllocationInformationComponent } from "./new-deal/deal-allocation/resource-allocation-information/resource-allocation-information.component";
import { DealStrategyComponent } from "./new-deal/deal-strategy/deal-strategy.component";
import { NewDealV2Component } from "./new-deal-v2/new-deal-v2.component";
import { DealContextV2Component } from "./new-deal-v2/deal-context/deal-contextv2.component";
import { AddExpertPoolComponent } from "./new-deal/deal-strategy/add-expert-pool/add-expert-pool.component";
import { StrategyAllocationNotesComponent } from "./new-deal/deal-strategy/strategy-allocation-notes/strategy-allocation-notes.component";
import { NgbModule, NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { ClientEditorPopUpComponent } from "./new-deal/deal-strategy/client-editor-pop-up/client-editor-pop-up.component";
import { StrategyClientPopupComponent } from "./new-deal/deal-strategy/strategy-client-popup/strategy-client-popup.component";
import { ExpertNotesSummaryPopupComponent } from "./new-deal/deal-strategy/expert-notes-summary-popup/expert-notes-summary-popup.component";
import { PipelineService } from "../pipeline/pipeline.service";
import { RequestInfoPopupComponent } from "./new-deal/deal-strategy/request-info-popup/request-info-popup.component";
import { ClientEmailPopUpComponent } from "./new-deal/deal-strategy/client-email-popup/client-email-popup.component";
import { CdkMenuModule } from "@angular/cdk/menu";
import { AppInsightWrapper } from "../applicationInsight/appInsightWrapper";
import { AgGridSharedComponentsModule } from "../shared/ag-grid-custom-components/ag-grid-shared-components.module";
import { DealsAgGridCustomComponentsModule } from "../shared/ag-grid-custom-components/deals-ag-grid-custom-components.module";
import { OpportunityTypeDetailsPipe } from "../shared/opportunity-type-details-name.pipe";

@NgModule({
    declarations: [
        DealsComponent,
        NewDealComponent,
        DealPeopleTagComponent,
        DealContextComponent,
        DealInfoComponent,
        DealProcessComponent,
        DealBainHistoryComponent,
        DealExpertsComponent,
        DealClientsComponent,
        DealAllocationComponent,
        DealStrategyComponent,
        ConfirmModalComponent,
        UserProfileTooltipComponent,
        UserProfileTooltipAllocationComponent,
        EditAllocationNotesComponent,
        ClientDatesComponent,
        DealSecurityComponent,
        DealPresetPopupComponent,
        DealAuditComponent,
        ResourceAllocationInformationComponent,
        NewDealV2Component,
        DealContextV2Component,
        AddExpertPoolComponent,
        StrategyAllocationNotesComponent,
        ClientEditorPopUpComponent,
        StrategyClientPopupComponent,
        ExpertNotesSummaryPopupComponent,
        RequestInfoPopupComponent,
        ClientEmailPopUpComponent,
        OpportunityTypeDetailsPipe
    ],
    imports: [
        AgGridSharedComponentsModule,
        SharedModule,
        DealsRoutingModule,
        FormsModule,
        CommonModule,
        NgbModule,
        NgbPopoverModule,
        NgSelectModule,
        ButtonsModule.forRoot(),
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        DragDropModule,
        CdkMenuModule,
        PopoverModule.forRoot(),
        BsDatepickerModule,
        AgGridModule,
        DealsAgGridCustomComponentsModule,
    ],
    providers: [
        NewRegistrationService,
        RegistrationService,
        PipelineService,
        RegistrationGridService,
        DealSecurityService,
        PendingChangesGuard,
        AuditLogRepositoryService,
        DatePipe,
        DealGridColumnService,
        Title,
        BsModalService
    ],
    exports: [
        DealPeopleTagComponent,
        DealContextComponent,
        ConfirmModalComponent,
        EditAllocationNotesComponent,
        ClientDatesComponent,
        DealPresetPopupComponent,
        StrategyAllocationNotesComponent,
        OpportunityTypeDetailsPipe
    ],
    bootstrap: [
        DealPeopleTagComponent,
        ConfirmModalComponent,
        EditAllocationNotesComponent,
        ClientDatesComponent,
        DealPresetPopupComponent,
        StrategyAllocationNotesComponent
    ]
})
export class DealsModule {}
