import { TestBed } from '@angular/core/testing';
import { AuditLogService } from './auditLog.service'
import { RegistrationRequestService } from '../../registrations/registrations/registration-request-service';
import { AuditLogRepositoryService } from './audit-log-repository.service';
import { Registrations } from '../../registrations/registrations/registrations';
import { of } from 'rxjs';
import { AuditLog } from './AuditLog';

describe('Auditlog servic tests', () => {
    let auditLogService: AuditLogService;
    let regReqService: RegistrationRequestService;
    const mockAuditLogRepositoryService = jasmine.createSpyObj('mockAuditLogRepositoryService', ['addAuditLog', 'getAuditLogs',]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuditLogService, RegistrationRequestService, AuditLogRepositoryService]
          });

        TestBed.overrideProvider(AuditLogRepositoryService, { useValue: mockAuditLogRepositoryService });
        TestBed.overrideProvider(RegistrationRequestService, { useValue: regReqService });
        auditLogService = TestBed.get(AuditLogService);
        regReqService = new RegistrationRequestService();
        regReqService.workTypes = [{ workTypeId: 1, workTypeName: 'oldWorkType' }, { workTypeId: 2, workTypeName: 'newWorkType' }];
        regReqService.registrationStage = [{ registrationStageId: 1, stageTypeName: 'oldStage' },
            { registrationStageId: 2, stageTypeName: 'newStage' }];
        regReqService.registrationStatus = [{ registrationStatusId: 1, statusTypeName: 'oldStatus',sortOrder:0 },
            { registrationStatusId: 2, statusTypeName: 'newStatus',sortOrder:0 }];
        regReqService.registration = new Registrations();
        regReqService.registration.iomp = false;
        regReqService.registration.wti = 1;
        regReqService.registration.sti = 1;
        regReqService.registration.sgTI = 1;
        regReqService.registration.imb = false;
        const data = new AuditLog();
        data.id = 1;
        mockAuditLogRepositoryService.addAuditLog.and.returnValue(of([data]));
    });

    it('should be created', () => {
        expect(auditLogService).toBeTruthy();
    });

    it('addAuditLog updated value for open market purchase', () => {
        auditLogService.addAuditLog('Open Market Purchase', 'iomp', true);
        expect(auditLogService.auditLog.newValue).toBe('Yes');
    });

    it('addAuditLog updated value for workType', () => {
        auditLogService.addAuditLog('Type of Work', 'wti', 2);
        expect(auditLogService.auditLog.newValue).toBe('newWorkType');
    });

    it('addAuditLog updated value for Registration Stage', () => {
        auditLogService.addAuditLog('Stage', 'sgTI', 2);
        expect(auditLogService.auditLog.newValue).toBe('newStage');
    });

    it('addAuditLog updated value for Registration Status', () => {
        auditLogService.addAuditLog('Status', 'sti', 2);
        expect(auditLogService.auditLog.newValue).toBe('newStatus');
    });

    it('addAuditLog updated value for MultiBidder', () => {
        auditLogService.addAuditLogForbidders(true, false);
        expect(mockAuditLogRepositoryService.addAuditLog).toHaveBeenCalled();
    });

});
