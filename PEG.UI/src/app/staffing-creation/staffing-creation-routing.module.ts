import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffingCreationComponent } from './staff-creation-form/staffing-creation.component';

const routes: Routes = [
  {
    path: '',
    component: StaffingCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffingCreationRoutingModule { }
