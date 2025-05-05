import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationMessageService } from './../registration-message/registration-message.service';
import { RoleType } from '../../../app/shared/enums/role-type.enum';

@Component({
  selector: 'app-registration-message',
  templateUrl: './registration-message.component.html',
  styleUrls: ['./registration-message.component.scss']
})
export class RegistrationMessageComponent implements OnInit {
  registrationMessageConfig: object;
  paramKey: string;
  buttons: Array<object>
  redirectUrl: string;
  constructor(private coreService: CoreService, private router: Router, private messageService: RegistrationMessageService, private route: ActivatedRoute) {
    if (this.coreService.isNewRegistration == true) {
      this.router.navigate(['/registrations/newregistration']);
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.paramKey = params['term'];
      this.messageService.getRegistrationMessageConfig().subscribe(items => {
        this.registrationMessageConfig = items.filter((ele) => ele['key'] == this.paramKey)[0];
        this.registrationMessageConfig['buttons'][0]['buttonUrl'] = this.getBtnUrl()
      });
    });
  }

  getBtnUrl() {
    return '/registrations/newregistration';
  }

}
