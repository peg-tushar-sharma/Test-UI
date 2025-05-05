import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../global/global.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [
    GlobalService,
    ]
})
export class GlobalModule { }
