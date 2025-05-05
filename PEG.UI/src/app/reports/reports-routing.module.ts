import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
        children: [


            {
                path: '',
                redirectTo: 'reports',
                pathMatch: 'full'
            },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
