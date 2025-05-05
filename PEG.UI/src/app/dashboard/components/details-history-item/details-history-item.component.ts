import { Component, Input } from '@angular/core';
import { AuditLog } from '../../../shared/AuditLog/AuditLog';

@Component({
  selector: 'app-details-history-item',
  templateUrl: './details-history-item.component.html',
  styleUrls: ['./details-history-item.component.scss'],
})
export class DetailsHistoryItemComponent {
  @Input() date: Date;
  @Input() user: string;
}
