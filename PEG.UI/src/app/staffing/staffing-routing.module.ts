import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../shared/errorPages/not-found/not-found.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';

const routes: Routes = [
    {
        path: '',
        component: NotFoundComponent
    },
    {
        path: ':params',
        component: StaffDetailsComponent,
      }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaffingRoutingModule { }
