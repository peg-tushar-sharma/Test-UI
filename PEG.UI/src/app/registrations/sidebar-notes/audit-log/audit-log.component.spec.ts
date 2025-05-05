import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditLogComponent } from './audit-log.component';
import { AuditLogService } from '../../../shared/AuditLog/auditLog.service';
import { AuditLogRepositoryService } from '../../../shared/AuditLog/audit-log-repository.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../../../error/http-error-handler.service';
import { ErrorService } from '../../../error/error.service';
import { RegistrationRequestService } from '../../registrations/registration-request-service';
import { BehaviorSubject, of } from 'rxjs';
import { AuditLog } from '../../../shared/AuditLog/AuditLog';
import { SimpleChange } from '@angular/core';
import { FormatTimeZone} from '../../../shared/formatTimeZone.pipe';

describe('AuditLogComponent', () => {
  let component: AuditLogComponent;
  let fixture: ComponentFixture<AuditLogComponent>;

  // Mock services
  let mockAuditLogService: any;
  let mockAuditLogRepositoryService: any;

  beforeEach((() => {
    mockAuditLogService = jasmine.createSpyObj('mockAuditLogService', ['refreshAuditLogs', 'addAuditLog', 'addAuditLogForbidders', 'saveAuditLog']);
    mockAuditLogRepositoryService = jasmine.createSpyObj('mockAuditLogRepositoryService', ['addAuditLog', 'getAuditLogs','formatValues']);
    TestBed.configureTestingModule({
      declarations: [AuditLogComponent,FormatTimeZone],
      providers: [AuditLogService, AuditLogRepositoryService, RegistrationRequestService, HttpErrorHandler, ErrorService],
      imports: [
        HttpClientModule,
        HttpClientTestingModule]
    })

    TestBed.overrideProvider(AuditLogService, { useValue: mockAuditLogService });
    TestBed.overrideProvider(AuditLogRepositoryService, { useValue: mockAuditLogRepositoryService });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(AuditLogComponent);
    component = fixture.componentInstance;
    mockAuditLogService.refreshAuditLogs = new BehaviorSubject<boolean>(false);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetch auditlogs on refresh flag', () => {
    spyOn(component, 'getAuditLogs');
    fixture.detectChanges();
    mockAuditLogService.refreshAuditLogs.next(true);
    expect(component.getAuditLogs).toHaveBeenCalled();
  });

  it('should call fetch auditlogs on registrationId change', () => {
    spyOn(component, 'getAuditLogs');
    fixture.detectChanges();
    component.registrationId = 2;
    component.ngOnChanges({ registrationId: new SimpleChange(0,2,false) });
    expect(component.getAuditLogs).toHaveBeenCalled();
  });

  it('should call API on calling getAuditLogs', () => {
    let auditLog: AuditLog = {
      id: 1,
      targetName: 'Target',
      fieldName: 'Target',
      oldValue: 'x',
      newValue: 'y',
      registrationId: 40,
      submissionDate: new Date(),
      submittedBy: '47081',
      submittedByName: 'Agarwal, Manav (47081)',
      isMasked:false,
      auditSource:'Registration',
      logType:'manually'
    };

    component.registrationId = 1;
    mockAuditLogRepositoryService.getAuditLogs.and.returnValue(of([auditLog]));
    fixture.detectChanges();
    component.getAuditLogs();
    expect(mockAuditLogRepositoryService.getAuditLogs).toHaveBeenCalled();
    component.$auditLogs.subscribe(logs => {
      expect(logs).not.toBeNull();
      expect(logs).toBeTruthy();
      expect(logs.length).toEqual(1);
    })
  });
   it('should format input', () => {
    let auditLog: AuditLog = {
      id: 1,
      targetName: 'Target',
      fieldName: 'Commit date',
      oldValue: 'x',
      newValue: 'y',
      registrationId: 40,
      submissionDate: new Date(),
      submittedBy: '47081',
      submittedByName: 'Agarwal, Manav (47081)',
      isMasked:false,
      auditSource: 'Registration',
      logType:'manually'
    };

     let date=Date.parse('2021-04-08 01:05');
    fixture.detectChanges(); 

    expect('08-Apr-2021'==component.formatValues(auditLog,date)).toBeTruthy();
  });

  it('should return same value', () => {
    let date=Date.parse('2021-04-08 01:05');
   fixture.detectChanges(); 

   expect(date==component.formatValues('',date)).toBeTruthy();
 });
});
