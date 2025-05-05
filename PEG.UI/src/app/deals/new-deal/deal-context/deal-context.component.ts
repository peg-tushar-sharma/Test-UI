import { Component, OnInit, Input, OnChanges,  SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { RegistrationStageEnum } from '../../../shared/enums/registration-stage.enum';
import { RegistrationStatus } from '../../../shared/enums/registration-status.enum';
import { deals } from '../../deal';
import { uniqBy } from 'lodash'

@Component({
  selector: 'app-deal-context',
  templateUrl: './deal-context.component.html',
  styleUrls: ['./deal-context.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]

})
export class DealContextComponent implements OnInit, OnChanges {
  @Input()
  deal: deals
  constructor() { }

  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;

  totalRegistration: number = 0;
  mbHighlights = { interest: 0, commitment: 0, workStarted: 0, workCompleted: 0, terminated: 0 };
  totalUniqueClients = 0;

  ngOnInit() {

  }

  ngOnChanges(simpleChange: SimpleChanges)
  {
    this.setMBHighlights()
  }

  setMBHighlights() {
    if (this.deal.dealRegistrations) {
      let dealClients = this.deal.clients.filter(x => x.client.clientName != undefined && x.client.clientName.trim() != '');
      dealClients.map(x => {
        x.client.clientName = x.client.clientName.trim();
        x.client.clientName = x.client.clientName.replace(/\s+/g, ' ');
      });
      this.totalUniqueClients = uniqBy(dealClients.filter(x => x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate), 'client.clientName').length;
      this.totalRegistration = dealClients.filter(x => x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.interest = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.Interest && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.commitment = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.Commitment && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.workStarted = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.WorkStarted && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.workCompleted = dealClients.filter(x => x.stage && x.stage.registrationStageId == RegistrationStageEnum.WorkCompleted && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
      this.mbHighlights.terminated = dealClients.filter(x => x.stage &&( x.stage.registrationStageId == RegistrationStageEnum.Terminated
        ||x.stage.registrationStageId == RegistrationStageEnum.ClosedLost
        ||x.stage.registrationStageId == RegistrationStageEnum.ClosedDropped
        ||x.stage.registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown) && x.registrationStatus?.registrationStatusId != RegistrationStatus.Duplicate).length;
    }
  }
  
}
