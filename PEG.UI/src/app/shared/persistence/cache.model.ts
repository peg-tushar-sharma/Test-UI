import { HttpResponse } from '@angular/common/http';

export interface CacheModel {
    url: string;
    response: HttpResponse<any>;
    lastRead: number;
}