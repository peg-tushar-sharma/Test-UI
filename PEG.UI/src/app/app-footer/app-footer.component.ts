import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { CommonMethods } from '../shared/common/common-methods';
import { CoreService } from '../core/core.service';
import { RoleType } from '../shared/enums/role-type.enum';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {
 
   isStaffingUser: boolean=false;

  deviceInfo:any;
  majorVersion: string

  constructor(private coreService:CoreService) { }

  ngOnInit(): void {
    if (this.coreService.loggedInUserRoleId == RoleType.Staffing) {
      this.isStaffingUser = true;
    } else {
      this.isStaffingUser = false;

    }
    this.majorVersion =environment.version;
    this.deviceInfo=CommonMethods.deviceInfo()
  }

}
