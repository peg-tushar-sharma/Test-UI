import { Injectable, NgModule } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { retry, catchError, tap } from 'rxjs/operators';
import { CoreService } from '../core/core.service'
// import { CoreService } from '../core/core.service';
import { environment } from './../../environments/environment.prod';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private coreService: CoreService,private router:Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    if (req.url.indexOf('json') > 0) {
      return next.handle(req);
    }
    if(req.url.includes('https://graph.microsoft.com/v1.0/me?$select=employeeId')){
      return next.handle(req);
    }

    const token = sessionStorage.getItem('bearerToken');

    if (token) {
      if ((req.url.indexOf('api/users') > 0 && req.url.indexOf('api/users/') === -1) || (req.url.indexOf('api/users/authenticateThirdPartyUser') > 0)) {
        req = req.clone({
          withCredentials: true
        });
        return next.handle(req).pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          })
        );
      } else {
        const newReq = req.clone(
          {
            headers: req.headers
              .set('Authorization', 'Bearer ' + token)
              .set('MajorVersion',environment.version ? environment.version:"0")
              .set('If-Modified-Since', '0')
              .set('Cache-Control','no-cache')
              .set('Pragma','no-cache')
              .set('Expires','0')
          });
        return next.handle(newReq).pipe(
          tap(evt => {


          }),
          catchError((error: HttpErrorResponse) => {

            if (error.status == 409 || error.status == 0 || error.status == 504) { //show popup on conflict and rejected request
              this.coreService.newUpdates.next(true);
            }
            if(error.status==401){
              this.coreService.isTrackerDirty=false;
              this.router.navigate(['/invalidaccesscomponent']);
              
            }
            if(error.status==404){
              this.coreService.isTrackerDirty=false;
              this.router.navigate(['/invalidaccesscomponent']);
              
            }

            return throwError(error);
          })
        );
      }
    } else {
      req = req.clone({
        withCredentials: true
      });
      return next.handle(req).pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
    }
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ]
})
export class HttpInterceptorModule { }