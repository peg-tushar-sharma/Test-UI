import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule } from '@angular/router';
import {ReportsRoutingModule} from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';


@NgModule({
  declarations: [
    ReportsComponent,
    ],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ],
  providers: [DatePipe]
})
export class ReportsModule { }
