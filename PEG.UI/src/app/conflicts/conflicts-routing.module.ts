import { RouterModule, Routes } from "@angular/router";
import { ConflictsComponent } from "./components/conflicts/conflicts.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      component: ConflictsComponent
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  }) export class ConflictsRoutingModule {}
  
  