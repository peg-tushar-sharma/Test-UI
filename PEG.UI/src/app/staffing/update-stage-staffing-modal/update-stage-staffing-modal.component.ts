import { BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RegistrationClosedInfo } from '../../registrations/registrationClosedInfo';
import { RegistrationStage } from '../../shared/interfaces/RegistrationStage';
import { RegistrationStageEnum } from '../../shared/enums/registration-stage.enum';
import { StaffingService } from '../staffing.service';
import { CoreService } from '../../core/core.service';
export interface Competitor {
  competitorId: number;
  competitorName: string;
};
export interface SecondaryOption {
  registrationStageId: number;
  label: string;
  secondaryNoteId: number;
  value: boolean;
  show: boolean;
}

@Component({
  selector: 'app-update-stage-staffing-modal',
  templateUrl: './update-stage-staffing-modal.component.html',
  styleUrls: ['./update-stage-staffing-modal.component.scss']
})


export class UpdateStageStaffingModalComponent implements OnInit {


  // outputs
  @Output() saveClosedEmitter = new EventEmitter();

  isPageLoading: boolean = false;
  // local vars
  modalData: RegistrationStage;
  closedDetailData: any;
  targetData: string;
  hideWorkOptions: boolean;

  // for backup
  modalDataBackup: RegistrationStage;
  registrationClosedInfoBackup: RegistrationClosedInfo = { registrationClosedInfoMappingId: 0, registrationId: 0, registrationStageId: 0, assignedCompetitor: null, primaryNote: '', secondaryNote: [],submittedBy:undefined };

  // for stage
  selectedStage: RegistrationStage;
  registrationStage: RegistrationStage[];
  showClosedFields: boolean = false;

  registrationId: number;
  registration: any;

  submittedBy: string;
  targetName: string;

  // checks
  isCold: boolean = false;
  isLost: boolean = false;
  isClientDropped: boolean = false;
  isBainDeclined: boolean = false;

  secondaryOptions: SecondaryOption[] = [];
  competitorOptions: Competitor[] = [];

  note: string = "";
  selectedSecondaryOptions = [];
  selectedCompetitor: Competitor = null;

  saveEnabled: boolean = false;

  constructor(public modalRef: BsModalRef, private staffingService:StaffingService,private coreService:CoreService) {
  }

  ngOnInit(): void {
    this.isPageLoading = false;
    combineLatest([this.staffingService.getCompetitors(), this.staffingService.getRegistrationStage(), this.staffingService.getSecondaryNotes()]).subscribe(([dashboard, regstate, secondaryOptions]) => {

      this.competitorOptions = dashboard;
      this.registrationStage = regstate;
      if (this.hideWorkOptions === true) {
        this.registrationStage = this.registrationStage.filter((option) => option.registrationStageId !== 4 && option.registrationStageId !== 5)
      }

      this.secondaryOptions = secondaryOptions;
      this.secondaryOptions.forEach((option) => {
        option.value = false;
        option.show = false;
      })

      if (this.registrationId > 0) {
        if (this.modalData) {
          this.modalDataBackup = JSON.parse(JSON.stringify(this.modalData));
           this.getRegistrationDetails();
          this.onStageSelectionChange(this.modalData);
        }
      }
    })
  }

  // set options
  getRegistrationDetails() {
    this.staffingService.getRegistrationShareDetails(this.registrationId).subscribe((res) => {
      this.registration = res;
      this.submittedBy = res.submittedBy ? res.submittedBy.firstName + " " + res.submittedBy.lastName : "...";
      this.targetName = res.targetName ? res.targetName : this.targetData;
    });

    this.staffingService.getRegistrationClosedInfo(this.registrationId).subscribe((res) => {
      let info: RegistrationClosedInfo = res;
      this.registrationClosedInfoBackup = JSON.parse(JSON.stringify(res));
      if (info != null) {
        this.note = info.primaryNote;
        this.selectedCompetitor = info.assignedCompetitor;
        //Parse secondary options
        if (info?.secondaryNote?.length > 0) {
          this.secondaryOptions.forEach((element) => {
            if (info.registrationStageId == element.registrationStageId) {
              element.show = true;
            }
            if (info.secondaryNote.some((x) => x.secondaryNoteId == element.secondaryNoteId)) {
              element.value = true;
            }
          });
          this.selectedSecondaryOptions = this.secondaryOptions.filter((x) => x.value == true && x.show == true)
        }
      }
      this.isPageLoading = true;

      this.toggleSaveButton();
    });
  }
  onNotesChanged(event) {
    let note = event.target['value'];
    this.toggleSaveButton(note);
  }



  // handle selections
  updateSecondarySelection(option, index) {

    this.secondaryOptions[index].value = option;
    this.selectedSecondaryOptions = this.secondaryOptions.filter((x) => x.value == true && x.show == true);
    this.toggleSaveButton();

  }
  compareTwoArrays(a1, a2) {
    let missing = a1.filter((item) => item != 0 && a2.indexOf(item) < 0);
    return missing;
  }
  updateCompetitor(competitor) {
    this.competitorOptions.forEach((item) => {
      if (item.competitorId == competitor.competitorId) {
        this.selectedCompetitor = item;
      }
    });
    this.toggleSaveButton();
  }

  onStageSelectionChange(stage: RegistrationStage) {

    this.selectedStage = stage;
    let stageValue = stage.registrationStageId;
    this.secondaryOptions.forEach((option) => {
      if (stage.registrationStageId == option.registrationStageId) {
        option.show = true;
        option.value = false;
      } else {
        option.show = false;
        option.value = false;
      }
      if (this.registrationClosedInfoBackup.secondaryNote.some((x) => x.secondaryNoteId == option.secondaryNoteId)) {
        option.value = true;
      }
    })
    this.selectedSecondaryOptions = this.secondaryOptions.filter((x) => x.value == true && x.show == true)

    if (stageValue == RegistrationStageEnum.ClosedBainTurnedDown || stageValue == RegistrationStageEnum.ClosedDropped
      || stageValue == RegistrationStageEnum.ClosedLost || stageValue == RegistrationStageEnum.Terminated) {
      this.showClosedFields = true;

    } else {
      this.showClosedFields = false;
      // this.note = "";
      // this.selectedCompetitor={competitorId:0,competitorName:""};

    }


    this.setConditions();
    this.toggleSaveButton();

  }
  toggleSaveButton(note: string = this.note) {
    if (!this.showClosedFields) {
      //Checking registration Stage
      if (this.selectedStage.registrationStageId === this.modalDataBackup.registrationStageId) {
        this.saveEnabled = false;
      } else {
        this.saveEnabled = true;
      }

    } else {
      if (this.isCold) {
        if (this.selectedStage.registrationStageId === this.modalDataBackup.registrationStageId && this.registrationClosedInfoBackup?.primaryNote === note) {
          this.saveEnabled = false;
        } else { this.saveEnabled = true; }
      }
      else if (this.isLost) {
        if (
          this.selectedStage.registrationStageId === this.modalDataBackup.registrationStageId
          &&
          this.registrationClosedInfoBackup?.primaryNote == note
          &&
          this.registrationClosedInfoBackup?.assignedCompetitor?.competitorId === this.selectedCompetitor?.competitorId
          &&
          this.compareTwoArrays(this.selectedSecondaryOptions.map((x) => { return x.label }), this.registrationClosedInfoBackup?.secondaryNote.map((x) => { return x.label })).length === 0
          &&
          this.compareTwoArrays(this.registrationClosedInfoBackup?.secondaryNote.map((x) => { return x.label }), this.selectedSecondaryOptions.map((x) => { return x.label })).length === 0
        ) {
          this.saveEnabled = false;
        } else { this.saveEnabled = true; }
      }
      else if (this.isClientDropped || this.isBainDeclined) {
        if (
          this.selectedStage.registrationStageId === this.modalDataBackup.registrationStageId
          &&
          this.registrationClosedInfoBackup?.primaryNote == note

          &&
          this.compareTwoArrays(this.selectedSecondaryOptions.map((x) => { return x.secondaryNoteId }), this.registrationClosedInfoBackup?.secondaryNote.map((x) => { return x.secondaryNoteId })).length === 0
          &&
          this.compareTwoArrays(this.registrationClosedInfoBackup?.secondaryNote.map((x) => { return x.secondaryNoteId }), this.selectedSecondaryOptions.map((x) => { return x.secondaryNoteId })).length === 0
        ) {
          this.saveEnabled = false;
        } else { this.saveEnabled = true; }
      }
    }




  }

  setConditions() {
    if (this.selectedStage) {

      this.isCold = this.selectedStage.registrationStageId === RegistrationStageEnum.Terminated;
      this.isLost = this.selectedStage.registrationStageId === RegistrationStageEnum.ClosedLost;
      this.isClientDropped = this.selectedStage.registrationStageId === RegistrationStageEnum.ClosedDropped;
      this.isBainDeclined = this.selectedStage.registrationStageId === RegistrationStageEnum.ClosedBainTurnedDown;
    }
  }

  // handle button clicks
  close() {
    this.modalRef.hide();
  }

  save() {
    const closedInfoData: RegistrationClosedInfo = {
      registrationClosedInfoMappingId: 0,
      registrationId: 0,
      registrationStageId: this.selectedStage.registrationStageId, // Only passed for reference, data is not duplicated on backend
      assignedCompetitor: this.isLost ? this.selectedCompetitor : undefined,
      primaryNote: this.showClosedFields ? this.note : undefined,
      secondaryNote: [],
      submittedBy: this.coreService.loggedInUser.employeeCode

    }

    const resultToSend = {
      stage: this.selectedStage,
      closedInfo: closedInfoData
    }
    if (this.isLost || this.isClientDropped || this.isBainDeclined) {
      if (this.selectedSecondaryOptions?.length) {
        this.selectedSecondaryOptions.forEach((option) => {
          closedInfoData.secondaryNote.push(option);
        });
      }
    } else {
      closedInfoData.secondaryNote = [];
    }
    this.saveClosedEmitter.emit(resultToSend);
    this.close();
  }

}
