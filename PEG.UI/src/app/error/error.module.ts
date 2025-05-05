import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorHandler } from "./http-error-handler.service";
import { ErrorService } from './error.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [
    HttpErrorHandler,
    ErrorService
    ]
})
export class ErrorModule { }
