import { Observable, of } from 'rxjs';

const REGISTRATION_FREQUENCY = [{ submissionDate: '03/03/2018', submissionCountPerDay: 50 }];

export class MockReportService {

  public getRegistrationFrequencyReportData(): Observable<any> {
    return of(REGISTRATION_FREQUENCY);
  }
}
