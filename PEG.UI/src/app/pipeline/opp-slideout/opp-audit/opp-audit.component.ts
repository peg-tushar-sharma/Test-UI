import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditLog } from '../../../shared/AuditLog/AuditLog';
import { PipelineService } from '../../pipeline.service';
import * as moment from 'moment';

@Component({
  selector: 'app-opp-audit',
  templateUrl: './opp-audit.component.html',
  styleUrls: ['./opp-audit.component.scss']
})
export class OppAuditComponent implements OnInit, OnChanges {

  @Input() opportunity: any;
  public $auditLogs: Observable<AuditLog[]>;

  constructor(public pipelineService: PipelineService) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.opportunity?.currentValue) {
      this.$auditLogs = this.pipelineService.
        getPipelineAuditLog(changes?.opportunity?.currentValue?.pipelineId, changes?.opportunity?.currentValue?.registrationId);
    }
  }


  displayAuditValue(audit){
    if(! audit.newValue)
      return 'Blank';
    const dtField = ['expected start','expectedstart', 'lateststartdate','expectedstartdate']

    if((dtField.includes(audit.fieldName.toLowerCase())) ){
      let dateStr = audit.newValue.split('T')[0];

      return moment(dateStr).format('DD-MMM-YYYY');
    }
    
    return audit.newValue;
  }

}
