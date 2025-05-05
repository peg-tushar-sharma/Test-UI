import { AgGridModule } from 'ag-grid-angular';
import { AuditLogRepositoryService } from '../shared/AuditLog/audit-log-repository.service';
import { AuditLogService } from '../shared/AuditLog/auditLog.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { commonUtility } from '../shared/common/common-utility';
import { InfoTextService } from '../shared/info-icon/infoText.service';
import { NewOpportunityComponent } from './new-opportunity/new-opportunity.component';
import { NewOpportunityService } from '../opportunity/new-opportunity/new-opportunity.service';
import { NewRegistrationService } from '../registrations/new-registration/new-registration.service';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NoteService } from '../registrations/sidebar-notes/sidebar-notes.service';
import { OpportunityFormBuilder } from './new-opportunity/newopportunityform';
import { OpportunityRoutingModule } from './opportunity-routing.module';
import { PipelineService } from '../pipeline/pipeline.service';
import { ProhibitionService } from '../registrations/prohibitions/prohibition.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationGridService } from '../registrations/registrations/registration-grid.service';
import { RegistrationRequestService } from '../registrations/registrations/registration-request-service';
import { RegistrationService } from '../registrations/registrations/registration.service';
import { SearchHighlightDirective } from '../shared/directives/highlight.directive';
import { SharedModule } from '../shared/shared.module';
import { TxtBoxDirective } from '../shared/directives/txtBox.directive';
import { TreeViewModule } from '../external/tree-view.module';
import { AgGridSharedComponentsModule } from '../shared/ag-grid-custom-components/ag-grid-shared-components.module';


@NgModule({
    declarations: [
        NewOpportunityComponent,
        TxtBoxDirective,
        SearchHighlightDirective

    ],
    imports: [
        OpportunityRoutingModule,
        CommonModule,
        SharedModule,
        AgGridModule,
        AgGridSharedComponentsModule,
        ReactiveFormsModule,
        NgSelectModule,
        BsDatepickerModule.forRoot(),
        TreeViewModule,
    ],
    providers: [DatePipe, NewRegistrationService, RegistrationService, RegistrationRequestService, NoteService, ProhibitionService,PipelineService,
        AuditLogService, AuditLogRepositoryService, RegistrationGridService, InfoTextService, commonUtility, NewOpportunityService, OpportunityFormBuilder]
})

export class OpportunityModule { }
