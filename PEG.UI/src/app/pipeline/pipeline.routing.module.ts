import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PipelineGridComponent } from './pipeline-grid/pipeline-grid.component';


const routes: Routes = [
  {
    path: '',
    component: PipelineGridComponent,
    
  }
  

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PipelineRoutingModule {

}
