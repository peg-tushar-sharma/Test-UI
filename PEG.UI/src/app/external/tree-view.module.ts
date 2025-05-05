import { CommonModule } from "@angular/common";
import { LocationTreeViewComponent } from "../shared/location-tree-view/location-tree-view.component";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTreeModule } from "@angular/material/tree";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { TreeComponent } from "../shared/tree/tree.component";

@NgModule({
  declarations: [
    LocationTreeViewComponent,
    TreeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    LocationTreeViewComponent,
    TreeComponent
  ],
  providers: []
})
export class TreeViewModule {
}

