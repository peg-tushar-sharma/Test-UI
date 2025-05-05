import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { CacheStore } from './cache.store';
import { Observable, of } from 'rxjs';
import { NgModule } from '@angular/core';

export class CachingInterceptor implements HttpInterceptor {

    /**
     *
     */
    constructor(private cache: CacheStore) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method !== 'GET' || !req.headers.has('cache')) {
            return next.handle(req);
        }

        const cachedResponse = this.cache.get(req);

        if (cachedResponse) {
            let httpResponse = new HttpResponse({
                status: cachedResponse.status,
                body: cachedResponse.body,
                headers: cachedResponse.headers,
                statusText: cachedResponse.statusText,
                url: cachedResponse.url
            });

            return of(httpResponse);
        } else {
            return this.sendRequest(req, next);
        }

    }

    sendRequest(
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({ headers: req.headers.delete('cache') });
        return next.handle(req).pipe(
            tap(event => {
                try {
                    if (event instanceof HttpResponse && event.ok) {
                        this.cache.set(req, event);
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
            })
        );
    }
}

@NgModule({
    providers: [
        CacheStore,
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }
    ]
})
export class CachingInterceptorModule { }
