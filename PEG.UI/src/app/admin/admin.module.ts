import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AgGridModule } from 'ag-grid-angular';
import { adminNameCellRendererComponent } from './partner-cell-renderer/partner-cell-renderer.component';
import { RoleEditorComponent } from './admin/role-cell-editor/role-celleditor.component';
import { NotesCellRendererComponent } from './admin/notesRenderer/notes-cell-renderer.component';
import { AdminService } from './admin.service';
import { AdminGridColumnService } from '../shared/grid-generator/admin-grid-colum.service';
import { GlobalService } from '../global/global.service';
import { DealsService } from '../deals/deals.service';
import { AgGridSharedComponentsModule } from '../shared/ag-grid-custom-components/ag-grid-shared-components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent,
    adminNameCellRendererComponent,
    RoleEditorComponent,
    NotesCellRendererComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    AgGridModule,
    NgSelectModule,
    BsDatepickerModule,
    AgGridSharedComponentsModule,
    FormsModule
  ],
  providers: [AdminService, AdminGridColumnService, GlobalService, DealsService],
})
export class AdminModule { }