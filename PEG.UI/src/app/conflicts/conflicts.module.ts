import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ConflictsComponent } from "./components/conflicts/conflicts.component";
import { ConflictsRoutingModule } from "./conflicts-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AddConflictComponent } from './components/add-conflict/add-conflict.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ValidationModule } from '../shared/validations/validation.module';
import { AgGridStagesComponent } from './components/ag-grid-stages/ag-grid-stages.component';
import { ConflictsService } from "./services/conflicts.service";
import { ConflictsGridColumnService } from "./services/conflicts-grid-column.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [ConflictsComponent, AddConflictComponent, AgGridStagesComponent],
    imports: [CommonModule, ConflictsRoutingModule, FormsModule, AgGridModule, NgSelectModule, ValidationModule, ReactiveFormsModule],
    providers: [ConflictsService,NgbModal,NgbModal,ConflictsGridColumnService]
})
export class ConflictsModule {}
