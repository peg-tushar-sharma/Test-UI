import { CoreService } from '../../core/core.service';
import { Injectable } from '@angular/core';
import { CacheModel } from './cache.model';

@Injectable({
    providedIn: 'root'
})
export class PersistenceService {

    /**
     *
     */
    constructor(private coreService: CoreService) {
    }

    setItem(key: string, value: CacheModel): void {
        if (key && value) {
            let itemKey = this.getUserKey(key);
            localStorage.setItem(itemKey, JSON.stringify(value));
        }
    }

    getItem(key: string): CacheModel {
        if (key) {
            let itemKey = this.getUserKey(key);
            let value = localStorage.getItem(itemKey);
            return <CacheModel>JSON.parse(value);
        } else {
            return null;
        }
    }

    delete(key: string) {
        if (key) {
            let itemKey = this.getUserKey(key);
            localStorage.removeItem(itemKey);
        }
    }

    checkForExpiry(expired: number) {
        for (let index = 0; index < localStorage.length; index++) {
            const expiredEntry = localStorage.key[index];
            if (expiredEntry && expiredEntry.lastRead && expiredEntry.lastRead < expired) {
                this.delete(expiredEntry.url);
            }
        }
    }

    clear() {
        localStorage.clear();
    }
    

    private getUserKey(key: string): string {
        return this.coreService.loggedInUser.employeeCode + '_' + key;
    }
}