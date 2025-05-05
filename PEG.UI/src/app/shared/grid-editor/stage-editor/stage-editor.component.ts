import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationStage } from '../../../shared/interfaces/RegistrationStage';
import { GlobalService } from '../../../global/global.service'
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { RegistrationStageEnum } from '../../enums/registration-stage.enum';

@Component({
  selector: 'app-stage-editor',
  templateUrl: './stage-editor.component.html',
  styleUrls: ['./stage-editor.component.scss']
})
export class StageEditorComponent implements ICellEditorAngularComp, OnInit {
  @ViewChild('stageStatus') ela: NgSelectComponent

  params: any
  selectedStage: any;
  registrationStage: RegistrationStage[];
  currentColumn: string;
  isClearable: boolean = false;
  isOnSelectionChange: boolean = false;
  stage: any;
  constructor(private globalService: GlobalService) {

  }

  ngOnInit() {
    this.globalService.getRegistrationStage()
      .subscribe(regStage => {
        this.registrationStage = regStage;
       if(this.params && this.params.colDef?.field=='registrationStage' ){
        this.registrationStage=this.registrationStage.filter(x=> (x.registrationStageId == RegistrationStageEnum.Interest) 
        || (x.registrationStageId == RegistrationStageEnum.Commitment) || (x.registrationStageId == RegistrationStageEnum.Terminated)
        || (x.registrationStageId == RegistrationStageEnum.ClosedLost) || (x.registrationStageId == RegistrationStageEnum.ClosedDropped )
        || (x.registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown)
        )
      }
      });
  }


  agInit(params: any): void {
    this.params = params;
    this.currentColumn = params.colDef.field;
    if (this.currentColumn == 'stageTypeName') {
      this.isClearable = params.data.registrationId > 0 ? false : true;
      if (this.params.data.stageTypeName) {
        this.selectedStage = this.params.data.stageTypeName;
      }
      if (this.params.data.stage != null) {
        if (this.params.data.stage.registrationStageId) {
          this.selectedStage = this.params.data.stage.registrationStageId;
          this.stage = this.params.data.stage;
        }
      }
    } else if (this.currentColumn == 'stageStatus') {
      this.isClearable = params.data.registrationId > 0 ? false : true;
      if (this.params.data.registrationStage) {
        this.selectedStage = this.params.data.registrationStage.registrationStageId;
        ;
      }
    }
    else if(this.currentColumn == 'registrationStage')
  {
    if (this.params.data.stage.registrationStageId) {
      this.selectedStage = this.params.data.stage.registrationStageId;
      this.stage = this.params.data.stage;
      }

  }
    setTimeout(() => {
      if (this.ela && this.ela.searchInput) {
        this.ela.searchInput.nativeElement.focus()
      }

    }, 100);

  }

  isPopup() {
    return true;
  }

  ngAfterViewInit() {
    window.setTimeout(() => {
    })
  }

  getValue(): any {

    if (this.currentColumn == 'stageTypeName') {
      return this.stage?.stageTypeName;
    }
    else if (this.currentColumn == 'stageStatus') {
      return this.params.data.registrationStage;
    }
    else if (this.currentColumn == 'registrationStage') {
      return this.params.data.stage;

    }
  }

  onSelectionChange(event) {
    this.isOnSelectionChange = true;
    this.params.registrationStage = event;
    if (this.currentColumn == 'stageTypeName') {
      this.params.data.clientOrder = this.getClientOrder((event) ? event.registrationStageId : 0);
      this.stage = this.params.registrationStage == undefined ? this.params.data.stage && Object.keys(this.params.data.stage).length === 0 ? '' : this.params.data.stage : this.params.registrationStage;
      this.params.data.stage = this.stage;
    }
    else if (this.currentColumn == 'stageStatus') {
      this.params.data.registrationStage = event;
    }
    else if (this.currentColumn == 'registrationStage') {
      this.params.data.stage = event;
    }

    if (!event) {
      this.resetStage();
    }
    if (this.params.api) {
      this.params.api.stopEditing();
    }


  }

  getClientOrder(registrationStageId) {
    switch (registrationStageId) {
      case 1:
        return 4;
        break;
      case 2:
        return 3;
        break;
      case 3:
        return 6;
        break;
      case 4:
        return 1;
        break;
      case 5:
        return 2;
        break;
      default:
        return 5;
    }

  }

  resetStage() {
    if (this.currentColumn == 'stageTypeName') {
      this.params.registrationStage = '';
      this.params.data.stage = {};
    } else if (this.params.data.registrationStage) {
      this.params.data.registrationStage = undefined;
      this.params.data.stage = {};
    }
  }

}
