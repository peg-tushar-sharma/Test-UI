import { Component, AfterViewInit } from '@angular/core';
import { DealsService } from '../../../deals/deals.service';
import { RegistrationService } from '../../../registrations/registrations/registration.service';
import { RegistrationStatus } from '../../interfaces/models';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { GlobalService} from '../../../global/global.service'

@Component({
  selector: 'app-status-editor',
  templateUrl: './status-editor.component.html',
  styleUrls: ['./status-editor.component.scss']
})
export class StatusEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  params: any
  selectedStatus: any;
  registrationStatus: RegistrationStatus[];

  constructor(private dealService: DealsService,public registrationService: RegistrationService,private globalService:GlobalService) {
}

  ngOnInit(){
    this.registrationService.getRegistrationStatus()
      .subscribe(regStatus => {
        this.registrationStatus = regStatus;
        this.registrationStatus = this.registrationStatus.filter(r => r.registrationStatusId <= 4 || r.registrationStatusId == 7);
      });
  }



  agInit(params: any): void {
    this.params = params;
    if (this.params.data.statusTypeName) {
      this.selectedStatus = this.params.data.statusTypeName;
    }
    if (this.params.data.registrationStatus != null) {
      if (this.params.data.registrationStatus.registrationStatusId) {
        this.selectedStatus = this.params.data.registrationStatus.registrationStatusId;
      }
    }
  }

  isPopup() {
    return true;
  }

  ngAfterViewInit() {
    window.setTimeout(() => {
    })
  }

  getValue(): any {
    return  this.params.registrationStatus == undefined ? (this.params.data.registrationStatus && Object.keys(this.params.data.registrationStatus).length === 0) ? '' : this.params.data.registrationStatus : this.params.registrationStatus;
  }

  onSelectionChange(event) {
    this.params.registrationStatus = event;
    if(!event){
      this.params.data.registrationStatus = {
        registrationStatusId: '',
        statusTypeName: '',
        sortOrder:4
      };
    }
    if (this.params.api) {
      this.params.api.stopEditing();
    }
  }

  resetStatus(){
    this.params.registrationStatus = '';
    this.params.data.registrationStatus = {};
  }


}
