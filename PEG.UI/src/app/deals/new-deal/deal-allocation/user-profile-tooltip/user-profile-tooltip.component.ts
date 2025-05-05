import { Component, OnInit ,Input} from '@angular/core';
import { ExpertCategories } from '../../../../shared/enums/expert-category.enum'

@Component({
  selector: 'app-user-profile-tooltip-allocation',
  templateUrl: './user-profile-tooltip.component.html',
  styleUrls: ['./user-profile-tooltip.component.scss']
})
export class UserProfileTooltipAllocationComponent implements OnInit {
  @Input()
  item: any;
  NACategoryID : number;
  constructor() { }

  ngOnInit() {
   this.NACategoryID = ExpertCategories.NotAvailable;
  }

}
