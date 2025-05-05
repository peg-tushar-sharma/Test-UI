import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryEditorComponent } from "../grid-editor/category-editor/category-editor.component";
import { DateEditorComponent } from "../grid-editor/date-editor/date-editor.component";
import { NumericCellEditorComponent } from "../grid-editor/numeric-cell-editor/numeric-cell-editor.component";
import { OfficeEditorComponent } from "../grid-editor/office-editor/office-editor.component";
import { SingleDateEditorComponent } from "../grid-editor/single-date-editor/single-date-editor.component";
import { WorkTypeEditorComponent } from "../grid-editor/work-type-editor/work-type-editor.component";
import { DealLikelihoodEditorComponent } from "../grid-editor/dealLikelihood-editor/dealLikelihood.component";
import { AgGridModule } from "ag-grid-angular";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

@NgModule({
    declarations: [
        CategoryEditorComponent,
        DateEditorComponent,
        WorkTypeEditorComponent,
        SingleDateEditorComponent,
        OfficeEditorComponent,
        NumericCellEditorComponent,
        DealLikelihoodEditorComponent
    ],
    imports: [
        CommonModule,
        AgGridModule,
        NgSelectModule,
        FormsModule,
        BsDatepickerModule
    ],
    exports: [
        CategoryEditorComponent,
        DateEditorComponent,
        WorkTypeEditorComponent,
        SingleDateEditorComponent,
        OfficeEditorComponent,
        NumericCellEditorComponent,
        DealLikelihoodEditorComponent
    ]
})
export class DealsAgGridCustomComponentsModule {}
