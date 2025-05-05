import { Component, OnChanges, Input, SimpleChanges, OnInit } from '@angular/core';
import { AuditLog } from '../../../shared/AuditLog/AuditLog';
import { AuditLogRepositoryService } from '../../../shared/AuditLog/audit-log-repository.service';
import { AuditLogService } from '../../../shared/AuditLog/auditLog.service';
import { Observable } from 'rxjs';
import { FormatTimeZone } from '../../../shared/formatTimeZone.pipe'
import * as moment from 'moment';
@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit, OnChanges {
  ftz: FormatTimeZone = new FormatTimeZone();
  @Input()
  public registrationId: number;

  @Input()
  public isRowMasked: boolean;

  public $auditLogs: Observable<AuditLog[]>;

  constructor(private auditLogRepositoryService: AuditLogRepositoryService, private auditLogService: AuditLogService) { }

  ngOnInit() {
    this.auditLogService.refreshAuditLogs.subscribe((res: boolean) => {
      if (res) {
        this.getAuditLogs();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.registrationId) {
      this.getAuditLogs();
    }
  }

  getAuditLogs() {
    if (this.registrationId) {
      this.$auditLogs = this.auditLogRepositoryService.getAuditLogs(this.registrationId,this.isRowMasked);
    }
  }

  formatValues(auditLog, value) {

    if (auditLog.isMasked) {
      return '<span  class="maskText" title="' + value + '"></span>'
    } else {
      let dateFields = ['Commit date', 'Completed date', 'Case Start date', 'Case End date', 'Terminated date']
      if (dateFields.includes(auditLog.fieldName)) {
        return this.ftz.transform(moment.utc(value).local())
      } else {
        return value;
      }
    }
  }
}
