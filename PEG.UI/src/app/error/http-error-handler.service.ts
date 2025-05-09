import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ErrorService } from './error.service';

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

/** Handles HttpClient errors */
@Injectable()
export class HttpErrorHandler {

  constructor(private errorService: ErrorService) { }

  /** Create handleError function that already knows the service name */
  createHandleError = (serviceName = '') => <T>
    (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result)

  /**
   * * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName: name of the data service
   * @param operation: name of the failed operation
   * @param result: optional value to return as the observable result
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {

      // TODO: Send the error to remote logging infrastructure
      console.error(error);

      const message = (error.error instanceof ErrorEvent)
        ? error.error.message
        : `{error code: ${error.status}, body: "${error.message}"}`;

      // Todo -> Transforming error for user consumption
      this.errorService.errorMessage = `${serviceName} -> ${operation} failed. Message: ${message}`;

      return throwError(error);
    };
  }
}
