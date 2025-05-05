import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CoreService } from '../../core/core.service';
import { Note } from '../../shared/interfaces/note';

@Injectable()
export class NoteService {

  private baseApiUrl = this.coreService.appSettings ? this.coreService.appSettings.PEGApiBasePath : '';
  private gatewayApiUrl = this.coreService.appSettings && this.coreService.appSettings.PEGGatewayApiBasePath;

  private getGeneralNotesUrl = this.baseApiUrl + 'api/' + 'Note';
  private saveNoteUrl = this.getGeneralNotesUrl + '/Insert';
  private updateNoteUrl = this.getGeneralNotesUrl + '/Update';

  constructor(private http: HttpClient, private coreService: CoreService) {

  }

  public getGeneralNotes(registrationId: number, isMasked: boolean): Observable<Note[]> {
    let roleId = this.coreService.loggedInUserRoleId;
    return this.http.get<Note[]>(this.getGeneralNotesUrl + '?roleId=' + roleId + '&registrationId=' + registrationId + '&isMasked=' + isMasked, { withCredentials: true });
  }

  public saveNewNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.saveNoteUrl, note, { withCredentials: true });
  }

  public updateNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.updateNoteUrl, note, { withCredentials: true });
  }

  public getRelatedTrackerClientsByRegistrationId(registrationId): Observable<any> {
    const apiUrl = this.gatewayApiUrl + "KeyGetRelatedTrackerClientsByRegistrationId/getRelatedTrackerClientsByRegistrationId?registrationId=" + registrationId;
    return this.http.get<any>(apiUrl, { withCredentials: true });
  }
}