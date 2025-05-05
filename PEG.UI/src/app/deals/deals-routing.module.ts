import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealsComponent } from './deals/deals.component';
import { NewDealComponent } from './new-deal/new-deal.component';
import { PendingChangesGuard } from '../security/pending-changes.guard';
import { NewDealV2Component } from './new-deal-v2/new-deal-v2.component';

const routes: Routes = [
  {
    path: '',
    component: DealsComponent
  },
  {
    path: 'dealv1/:dealid',
    component: NewDealComponent,
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'deal/:dealid',
    component: NewDealV2Component,
  },
  {
    path: 'deal/:dealid/:mailclients',
    component: NewDealV2Component,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealsRoutingModule {

}
