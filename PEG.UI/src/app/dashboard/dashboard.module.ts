import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardService } from "./services/dashboard.service";
import { SharedModule } from "../shared/shared.module";
import { RegistrationService } from "../registrations/registrations/registration.service";
import { AuditLogService } from "../shared/AuditLog/auditLog.service";
import { AuditLogRepositoryService } from "../shared/AuditLog/audit-log-repository.service";
import { RegistrationRequestService } from "../registrations/registrations/registration-request-service";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { ConflictsListComponent } from "./components/conflicts-list/conflicts-list.component";
import { ConflictCardComponent } from "./components/conflict-card/conflict-card.component";
import { ConflictAssigneeComponent } from "./components/conflict-assignee/conflict-assignee.component";
import { ConflictAreaComponent } from "./components/conflict-area/conflict-area.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ConflictsService } from "./services/conflicts.service";
import { DealsService } from "../deals/deals.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConflictDetailsComponent } from "./components/conflict-details/conflict-details.component";
import { ConflictGalleryComponent } from "./components/conflict-gallery/conflict-gallery.component";
import { PipelineService } from "../pipeline/pipeline.service";
import { ConflictGridComponent } from "./components/conflict-grid/conflict-grid.component";
import { AgGridModule } from "ag-grid-angular";
import { ConflictsDashboardGridColumnService } from "./services/conflicts-dashboard-grid-column.service";
import { DetailsHistoryComponent } from "./components/details-history/details-history.component";
import { DetailsHistoryItemComponent } from "./components/details-history-item/details-history-item.component";
import { AddNoteFormComponent } from "./components/add-note-form/add-note-form.component";
import { NoteService } from "../registrations/sidebar-notes/sidebar-notes.service";
import { AgGridSharedComponentsModule } from "../shared/ag-grid-custom-components/ag-grid-shared-components.module";

@NgModule({
    declarations: [
        DashboardComponent,
        ConflictsListComponent,
        ConflictCardComponent,
        ConflictAssigneeComponent,
        ConflictAreaComponent,
        ConflictDetailsComponent,
        ConflictGalleryComponent,
        ConflictGridComponent,
        DetailsHistoryComponent,
        DetailsHistoryItemComponent,
        AddNoteFormComponent
    ],
    imports: [
        CommonModule,
        AgGridModule,
        SharedModule,
        DashboardRoutingModule,
        NgbAccordionModule,
        NgSelectModule,
        ReactiveFormsModule,
        AgGridSharedComponentsModule,
        FormsModule
    ],
    providers: [
        DashboardService,
        RegistrationService,
        AuditLogService,
        AuditLogRepositoryService,
        RegistrationRequestService,
        ConflictsService,
        DealsService,
        PipelineService,
        ConflictsDashboardGridColumnService,
        NoteService
    ]
})
export class DashboardModule {}
