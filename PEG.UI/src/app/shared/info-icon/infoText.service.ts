import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {InfoText} from './infoText'

@Injectable({ providedIn: 'any' })
export class InfoTextService {
    constructor(private http: HttpClient){}

    public getInfoTooltipText():Observable<InfoText>{
        return this.http.get<InfoText>('assets/infoTooltip.json');
   }
}   