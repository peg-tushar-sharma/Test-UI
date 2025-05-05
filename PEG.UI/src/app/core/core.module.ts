import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from './core.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { PegTostrService } from './peg-tostr.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule, // required animations module for toastr
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      iconClasses : {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      }
    })
    
  ],
  exports: [],
  providers: [
    CoreService,
    PegTostrService
    ]
})
export class CoreModule { }
