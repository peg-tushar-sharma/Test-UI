import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConflictDetailsComponent } from './components/conflict-details/conflict-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: ':conflictId',
    component: ConflictDetailsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
