import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { PersistenceService } from './persistence.service';
import { CacheModel } from './cache.model';
import { CoreService } from '../../core/core.service';

// const maxAge = 24 * 60 * 60 * 1000;
@Injectable({
    providedIn: 'root'
})
export class CacheStore {

    // private cache = new Map();

    /**
     *
     */
    constructor(private persistenceService: PersistenceService, private coreService: CoreService) {
    }

    get(req: HttpRequest<any>): HttpResponse<any> | undefined {
        const url = req.urlWithParams;
        const cached = this.persistenceService.getItem(url);

        if (!cached) {
            return undefined;
        }

        const isExpired = cached.lastRead < (Date.now() - (+this.coreService.appSettings.cacheAgeInMilliseconds));
        if (isExpired) {
            return undefined;
        }

        return cached.response;
    }

    set(req: HttpRequest<any>, response: HttpResponse<any>): void {
        const url = req.urlWithParams;
        const entry = <CacheModel>{ url, response, lastRead: Date.now() };
        this.persistenceService.setItem(url, entry);

        const expired = Date.now() - (+this.coreService.appSettings.cacheAgeInMilliseconds);
        this.persistenceService.checkForExpiry(expired);
    }
}