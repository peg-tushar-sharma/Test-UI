import * as moment from 'moment';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from "../../../shared/common/constants";
import { StaffingService } from '../../staffing.service';
import { CommonMethods } from '../../../shared/common/common-methods';
import { TeamSize } from '../../../shared/interfaces/teamSize';
import { RegistrationStage } from '../../../shared/interfaces/RegistrationStage';
import { UpdateStageStaffingModalComponent } from '../../update-stage-staffing-modal/update-stage-staffing-modal.component';
import { RegistrationClosedInfo } from '../../../registrations/registrationClosedInfo';
import { BsModalService } from 'ngx-bootstrap/modal';
import { StaffingOpportunityTypeDetails } from '../../staffing-opportunity-type-details/staffing-opportunity-type-details';

@Component({
  selector: 'app-staff-editible',
  templateUrl: './staff-editible.component.html',
  styleUrls: ['./staff-editible.component.scss']
})
export class StaffEditibleComponent implements OnInit, OnChanges {
  @Input() inputName: string;
  @Input() type: string;
  @Input() formGroup: FormGroup;
  @Input() items: any[];
  @Input() multiple: boolean = false;
  @Input() bindLabel: string;
  @Input() bindValue: any;
  @Input() isClearable: boolean = true;
  @Input() registrationId: number;

  @Input() multipleTypeahead: boolean = true;

  typeAheadList;
  employeeTypeAhead = new Subject<string>();
  peopleTagLoad = false;
  includeAllEmployee = true;
  isIncludeExternalEmployee = false;
  levelCode = LEVEL_STATUS_CODE;
  selectedValues: any;
  selectedTeamSize: any;
  durationRegEx = '(^(\\d{1,2})\\.\\d$)|(^\\d{0,2}$)';
  durationValidKeys = '\\d|\\.';

  @Input() teamSize: any[];
  teamSizeMasterData: any[] = [];

  @Output()
  public saveOppChanges: EventEmitter<any> = new EventEmitter<any>();

  editing: boolean = false;
  control;

  dateFormatStr: string = 'MMMM D, YYYY';
  minDate: Date = new Date();

  bsConfig: any = {
    dateInputFormat: this.dateFormatStr,
    containerClass: 'theme-red',
    adaptivePosition: true
  };

  protectDateChange: boolean = true;

  constructor(private staffingService: StaffingService, private modalService: BsModalService) {
    this.employeeTypeAhead.pipe(
      tap(() => { this.peopleTagLoad = true; this.typeAheadList = []; }),
      debounceTime(200),
      switchMap(term => this.staffingService.getEmployeeByName(term == undefined || term == null || term == '' ? 'a' : term.toString().trim(), this.levelCode, EXPERT_PARTNER_LEVELGRADE, this.inputName == 'manager' ? this.includeAllEmployee : false, this.isIncludeExternalEmployee)),
      tap(() => this.peopleTagLoad = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });
      this.typeAheadList = items;
    });
  }

  ngOnInit(): void {
    this.control = this.formGroup.controls[this.inputName];
    if (this.inputName == "duration") {
      this.formGroup.controls['duration'].setValidators([Validators.required, Validators.pattern(this.durationRegEx)])
      this.formGroup.controls['duration'].updateValueAndValidity()
    }
  }
  openStageModal(stage, event) {
    let stageValue: RegistrationStage = stage;

    const modalRef = this.modalService.show(UpdateStageStaffingModalComponent, {
      initialState: {
        modalData: stageValue,
        registrationId: this.registrationId,
        targetData: 'No target'
      },
      class: "modal-dialog-centered closed-detail-popup",
      backdrop: "static", keyboard: false
    });

    modalRef.content.saveClosedEmitter.subscribe((res) => {
      this.control.setValue(res.stage);

      this.formGroup.get('registrationStage').setValue(res.stage);
      let eveValue = {
        target: {
          name: this.inputName
        }
      }

      this.saveChanges(eveValue);
      // closed data
      let closedDetailData: RegistrationClosedInfo = res.closedInfo;
      closedDetailData.registrationId = this.registrationId;

      this.staffingService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
      });

      this.editing = false;
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.teamSize && this.teamSize !== undefined && this.teamSizeMasterData.length == 0) {
      this.teamSizeMasterData = JSON.parse(JSON.stringify(this.teamSize));
    }
  }
  validateKeys(event) {
    if (event && this.inputName == 'duration') {
      let currentDurationValue = event?.target?.value as string;
      let newFormedValue = "";
      let insertedIndex = event?.target?.selectionStart
      if (insertedIndex == currentDurationValue?.length) {
        newFormedValue = currentDurationValue + event.key;
      }
      else {
        newFormedValue = currentDurationValue.substring(0, insertedIndex) +
          event.key + currentDurationValue.substring(insertedIndex)
      }

      if (!new RegExp(this.durationValidKeys).test(event.key) ||
        (currentDurationValue.includes('.') && !new RegExp(this.durationRegEx).test(newFormedValue)) ||
        (!currentDurationValue.includes('.') && event.key != '.'
          && !new RegExp('^\\d{0,2}$').test(currentDurationValue + event.key))) {
        event.preventDefault();
      }
    }
  }
  onOpportunityTypeDetailsChange(event) {
    this.formGroup.get('opportunityTypeDetails').setValue(event);
    let eveValue = {
      target: {
        name: this.inputName
      }
    }

    this.saveChanges(eveValue);
  }
  convertRow(_control = null) {
    this.editing = !this.editing;
    if (!this.editing) {
      this.protectDateChange = true;
    }
   
    if (this.inputName == 'svp') {
      if (this.editing) {
        this.selectedValues = this.formGroup.controls['svp'].value;
        this.formGroup.controls['svp'].value.forEach(element => {
          element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
            ((element.familiarName) ? element.familiarName : element.firstName) +
            (" (" + (element.officeAbbreviation) + ")")

        });

      }
    }
    if (this.inputName == 'registrationStage') {
      if (this.editing) {
        console.log(this.selectedValues);
        console.log(this.formGroup.controls['registrationStage'].value);
        this.selectedValues = this.formGroup.controls['registrationStage'].value;
      }
    }

    if (this.inputName == 'ovp') {
      if (this.editing) {
        this.selectedValues = this.formGroup.controls['ovp'].value;
        this.formGroup.controls['ovp'].value.forEach(element => {
          element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
            ((element.familiarName) ? element.familiarName : element.firstName) +
            (" (" + (element.officeAbbreviation) + ")")

        });
      }
    }
    if (this.inputName == 'sellingPartner') {
      if (this.editing) {
        this.selectedValues = this.formGroup.controls['sellingPartner'].value;
        this.formGroup.controls['sellingPartner'].value.forEach(element => {
          element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
            ((element.familiarName) ? element.familiarName : element.firstName) +
            (" (" + (element.officeAbbreviation) + ")")

        });
      }
    }
    if (this.inputName == 'manager') {
      if (this.editing && this.formGroup.controls['manager'].value && this.formGroup.controls['manager'].value.length > 0) {

        this.selectedValues = this.formGroup.controls['manager'].value;
        this.formGroup.controls['manager'].value.forEach(element => {
          element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
            ((element.familiarName) ? element.familiarName : element.firstName) +
            (" (" + (element.officeAbbreviation) + ")")

        });

      }
    }

    if (this.inputName == 'teamSize') {
      if (this.editing) {
        // Convert string into array of team size objects
        this.selectedTeamSize = [];
        let predefinedValues = _control.value.split(',');
        predefinedValues.forEach(element => {
          let tmpTeamSize = JSON.parse(JSON.stringify(this.teamSize.find(d => d.teamSize == element?.trim())));
          this.selectedTeamSize.push(tmpTeamSize.teamSizeId);
        });
      } else if (_control.value.forEach) {
        // Convert array of team size id's into a string of labels
        this.selectedTeamSize = [];
        _control.value.forEach(element => {
          this.selectedTeamSize.push(
            this.teamSize.find(d => d.teamSizeId == element).teamSize
          );
        });
        _control.setValue(this.selectedTeamSize.join(", "));
      }
    }

    // Convert likelihood object to percentage value
    if (this.inputName == 'likelihood' && _control?.value?.label) {
      _control.setValue(_control.value.label + '%');
    }

    // Autofocus the form field
    if (this.editing) {
      setTimeout(function () {
        let element: HTMLElement = (document.querySelector("#staffingInput input, input#staffingInput") as HTMLElement);
        if (element) {
          element.focus();
        }
      }, 100);
    }

  }
  saveTypeheadChanges() {
    this.convertRow();
  }
  saveChanges(event) {
    this.convertRow();
    this.saveOppChanges.emit(event);
  }

  onDateChanged(event) {
    /* 
 * bsDateChanged fires when input is first rendered. This flag prevents this function
 * from triggering when the user first clicks to edit the field.
 */

    if (event) {
      event = {
        target: {
          name: this.inputName
        }
      }
      this.convertRow();

      this.saveOppChanges.emit(event);
    }
  }

  revertDateInput(event) {
    // Don't convert a date field while using the calendar popup
    if (document.querySelectorAll(".bs-datepicker:hover").length > 0) {
      return false;
    }

    this.convertOnDelay(event);
  }

  /* For some fields, blur happens before change events are triggered so this prevents any conflicts */
  convertOnDelay(event) {
    let self = this;
    setTimeout(function () {
      if (self.editing) {
        self.convertRow(self.control);
      }
    }, 100);
  }

  formatDate(dateTime) {
    if (!dateTime) {
      return '';
    }
    return moment(dateTime).format(this.dateFormatStr).toString();
  }

  formatTypeahead(value) {
    if (value && value.length > 0) {
      return CommonMethods.getEmployeeNames(value, ';');
    } else if (value && value.hasOwnProperty('employeeCode')) {
      return CommonMethods.getEmployeeName(value);
    }
  }

  onSelectChange(event, inputName) {
    event = {
      target: {
        name: inputName
      },
      value: event
    }
    this.saveOppChanges.emit(event);

    // Revert fields that are single select
    // if (!this.multiple) {
    this.convertOnDelay(this.control);
    // }
  }

  onTypeaheadChange(event, inputName) {
    event = {
      target: {
        name: inputName
      },
      value: event ?? ''
    }
    this.saveOppChanges.emit(event);
    this.convertOnDelay(this.control);
  }

  updateOfficeSelection(value?) {
    let currentOfficeCodes = value && value.length > 0 ? value.map((o) => o.officeCode) : [];
    let previouwstOfficeCodes = this.items && this.items.length > 0 ?
      this.items?.map((o) => o.officeCode) : [];
    if (currentOfficeCodes?.length == previouwstOfficeCodes?.length &&
      currentOfficeCodes.every((of) => previouwstOfficeCodes.includes(of))) {
      return
    }

    let changedValue = value?.map((of) => of?.officeName).join(', ');
    let event = {
      target: {
        name: this.inputName
      },
      value: changedValue,
      offices: value
    }

    this.saveOppChanges.emit(event);
    this.control.setValue(value);
    this.items = value;
  }

  clearValue() {
    this.control.setValue('');
  }

  onClearAll(fieldName: string, $event) {
    this.staffingService.getTeamSize().subscribe(res => {
      this.teamSize = res;
      let event = {
        target: {
          name: fieldName
        },
        value: []
      }
      this.saveOppChanges.emit(event);
    })

  }

  onTeamSizeChange(fieldName: string, value) {
    let item = value;
    let IdArr: number[] = JSON.parse(JSON.stringify(this.teamSize.map(x => x.teamSizeId)))
    let max = Math.max(...IdArr);
    let currentItem: TeamSize = { sortOrder: 0, teamSize: "", teamSizeId: 0 };
    currentItem.teamSizeId = max + 1;
    currentItem.sortOrder = item.sortOrder;
    currentItem.teamSize = item.teamSize;
    this.teamSize = [...this.teamSize, currentItem].sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });

    let teamData = [];
    this.selectedTeamSize.forEach(element => {
      let item = this.teamSize.find(x => x.teamSizeId == element);
      teamData.push(JSON.parse(JSON.stringify(item)));
    });

    teamData.forEach(element => {
      let item = this.teamSizeMasterData.find(x => x.teamSize == element.teamSize);
      element.teamSizeId = item.teamSizeId;
    });

    let event = {
      target: {
        name: fieldName
      },
      value: teamData
    }
    this.saveOppChanges.emit(event);
  }

  onRemoveTeamSize(fieldName: string, event) {
    this.teamSize = [...this.teamSize.filter(x => x.teamSizeId != event?.teamSizeId)];
    let teamData = [];
    this.selectedTeamSize.forEach(element => {
      let item = this.teamSize.find(x => x.teamSizeId == element)
      teamData.push(JSON.parse(JSON.stringify(item)));
    });

    teamData.forEach(element => {
      let item = this.teamSizeMasterData.find(x => x.teamSize == element.teamSize)
      element.teamSizeId = item.teamSizeId;
    });

    let updateEvent = {
      target: {
        name: fieldName
      },
      value: teamData
    }
    this.saveOppChanges.emit(updateEvent);
  }

  formatNgSelect(control) {
    if (control?.value?.hasOwnProperty("label")) {
      return control?.value?.label;
    } else if (control?.value?.length > 0 && control?.value[0].hasOwnProperty("name")) {
      return control?.value?.map((x) => x.name).join(", ");
    } else if (control?.value?.length > 0 && control?.value[0].hasOwnProperty("officeName")) {
      return control?.value?.map((x) => x.officeName).join(", ");
    } else if (control?.value && control?.value.hasOwnProperty("isAdditionalTeam")) {
      return CommonMethods.generateOpportunityTypeDetailsLabel(control?.value);
    }
    else {
      return control?.value;
    }
  }

}
