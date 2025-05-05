import { RegistrationMessages } from '../../shared/enums/registrationMessages.enum';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { RoleType } from '../enums/role-type.enum';

@Injectable({ providedIn: 'any' })
export class commonUtility {
    constructor(public router:Router, private coreService: CoreService) {

    }

    public routeToMessagePage(Page: RegistrationMessages) {
      this.router.navigate(['/registrations/registration-message/' + Page.toString()]); 
  }

}