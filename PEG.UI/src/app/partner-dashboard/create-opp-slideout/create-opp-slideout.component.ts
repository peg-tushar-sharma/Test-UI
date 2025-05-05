import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Registrations } from "../../registrations/registrations/registrations";
import { RegistrationService } from "../../registrations/registrations/registration.service";
import { RegistrationType } from "../../shared/enums/registration-type.enum";
import { fieldAuth } from "../../shared/common/fieldAuth";
import { RegistrationRequestService } from "../../registrations/registrations/registration-request-service";

@Component({
  selector: "app-create-opp-slideout",
  templateUrl: "./create-opp-slideout.component.html",
  styleUrls: ["./create-opp-slideout.component.scss"]
})
export class CreateOppSlideoutComponent implements OnInit {
  // @Inputs
  @Input() openForm: boolean;
  @Input() opportunity: any;
  @Input() oppNameFields: any;

  // @Outputs
  @Output() toggleSlideOutEmitter = new EventEmitter();

  public fieldAuth: fieldAuth = new fieldAuth();
  defaultNotesTab = ""
  public showFullTagName: boolean = false;
  // Variables
  public slideOutWidth: number = 1200;
  registration: Registrations = new Registrations();
  constructor(private registrationService: RegistrationService, public _regReqService: RegistrationRequestService) { }

  ngOnInit(): void {
    this.getUserAuthorization();
  }

  // Open & Close Slideover
  toggleSlideOut(open: boolean, registrationId: number) {
    this.registration = new Registrations();
    this.defaultNotesTab = "RegDetails" + '#' + registrationId;



    if (registrationId > 0) {
      this.getRegistrationById(registrationId)
    }

    this.openForm = open;
  }

  getRegistrationById(registrationId) {
    this.registrationService.getRegistrationById(registrationId).subscribe((res) => {
      this.registration = res;
      this._regReqService.registration = res;

      // To get the client priority based on basis client id
      // This property will be read only
      this.getClientPriorityByBasisClientId(this._regReqService.registration.cl?.basisClientId);

    })
  }

  // Close from outside click
  handleOutsideClick(event: MouseEvent) {
    const windowWidth = window.innerWidth;
    if (windowWidth - event.clientX > this.slideOutWidth) {
      this.toggleSlideOut(false, 0);
    }
  }
  getUserAuthorization(): any {
    this.registrationService.getUserAuthorization().subscribe(userRoleField => {
      this.registrationService.roleFieldValues = userRoleField;
      this.setFieldAuthorization();
    });
  }

  setFieldAuthorization() {
    let allRoleFields = this.registrationService.roleFieldValues;
    for (let key in this.fieldAuth) {
      for (let i = 0; i < allRoleFields.length; i++) {
        if (key == allRoleFields[i]['field']['fieldName']) {
          this.fieldAuth[key]['isEditable'] = allRoleFields[i]['isEditable'];
          this.fieldAuth[key]['isVisible'] = allRoleFields[i]['isVisible'];
          this.fieldAuth[key]['isMasked'] = allRoleFields[i]['isMasked'];
          break;
        }
      }
    }
  }

  getClientPriorityByBasisClientId(basisClientId) {
    if (basisClientId) {
      this.registrationService.getClientPriorityByClientId(basisClientId).subscribe(data => {
        if (data?.priorityName) {
          this.registration.cl.clientPriorityName = '(' + data?.priorityName + ')';
        }
      })
    }
  }
}
