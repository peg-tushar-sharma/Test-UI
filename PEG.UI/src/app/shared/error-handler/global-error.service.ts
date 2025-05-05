import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PegTostrService } from '../../core/peg-tostr.service';
import { AppInsightWrapper } from '../../applicationInsight/appInsightWrapper';
import { CoreService } from '../../core/core.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  constructor(private injector: Injector,private _appInsight: AppInsightWrapper) { }

  handleError(error: Error | HttpErrorResponse) {

    // Log errors to Application insights
    //this.injector.get<AppInsightWrapper>(AppInsightWrapper).logException(error);
    this._appInsight.logException(error);
    console.log(error);

    const notifier = this.injector.get(PegTostrService);
    const coreService = this.injector.get(CoreService);

    let errorMessage;
    let stackTrace;

    if (error instanceof HttpErrorResponse) {
      // Server Error
      errorMessage = this.getServerMessage(error);
      //notifier.showError(errorMessage,'Error');
    } else {
      // Chunk failed
      const chunkFailedMessage = /Loading chunk [\d]+ failed/;
      if (chunkFailedMessage.test(error.message)) {
        //window.location.reload();
      }
      // Client Error
      errorMessage = this.getClientMessage(error);
      stackTrace = this.getClientStack(error);

      const typeaheadDownArrowKeyErrorMessage = 'Cannot read property \'disabled\' of undefined';
      if (stackTrace.indexOf('_handleArrowDown') > -1 && errorMessage.indexOf(typeaheadDownArrowKeyErrorMessage) > -1) {
        return;
      }
    }

    let excludedErrors = ["_isDestroyed"]

    if (coreService?.appSettings?.environment.trim() != '') {
      let showError:boolean = true;

      excludedErrors.forEach(e => {
        if(errorMessage.toLowerCase().indexOf(e.toLowerCase()) > -1){
          showError = false;
        }
      });

      if(showError){
        notifier.showError(errorMessage, 'Error');
      }
    }

    console.error(error);
  }

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'No Internet Connection';
    }
    return error.message ? error.message : error.toString();
  }

  getClientStack(error: Error): string {
    return error.stack;
  }

  getServerMessage(error: HttpErrorResponse): string {
    return error.message;
  }

  getServerStatusCode(error: HttpErrorResponse): string {
    return `Status:${error.status}, StatusText:${error.statusText} `;
  }
}
