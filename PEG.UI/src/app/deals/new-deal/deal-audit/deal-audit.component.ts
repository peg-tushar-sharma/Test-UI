import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuditLogRepositoryService } from '../../../shared/AuditLog/audit-log-repository.service'
import { Observable } from 'rxjs';
import { AuditLog } from '../../../shared/AuditLog/AuditLog';
import {DealsService} from '../../deals.service'

@Component({
  selector: 'app-deal-audit',
  templateUrl: './deal-audit.component.html',
  styleUrls: ['./deal-audit.component.scss']
})
export class DealAuditComponent implements OnInit, OnChanges {

  constructor( private _auditLogRepositoryService: AuditLogRepositoryService, private _dealService : DealsService) {
    this._dealService.switchTab.subscribe((res) => {
      if (res != null && res == 'audit') {
        this.$auditLogs =  this._auditLogRepositoryService.getDealAuditLogs(this.dealId);
      }
    });
   }

  @Input() 
  dealId: number

  

  public $auditLogs: Observable<AuditLog[]>;
  ngOnInit() {
  }

  ngOnChanges(simpleChange: SimpleChanges)
  {
    if(simpleChange.dealId && simpleChange.dealId.currentValue)
    {
      if(this.dealId >0)
      {
       this.$auditLogs =  this._auditLogRepositoryService.getDealAuditLogs(this.dealId);
      }        
    }
  }

  formatValues(fieldName, value) {
         return value;
  }

 

}
