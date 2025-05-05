import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { StaffingOpportunityTypeDetails, StaffingOpportunityTypeDetailsSize } from './staffing-opportunity-type-details';
import { element } from 'protractor';
import { CommonMethods } from '../../shared/common/common-methods';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-staffing-opportunity-type-details',
  templateUrl: './staffing-opportunity-type-details.component.html',
  styleUrls: ['./staffing-opportunity-type-details.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StaffingOpportunityTypeDetailsComponent),
      multi: true
    }
  ]

})
export class StaffingOpportunityTypeDetailsComponent implements ControlValueAccessor {
  @ViewChild('OppTypeDetailsDropdown') OppTypeDetailsDropdown!: any;


  @Output()
  opportunityTypeDetailsChange = new EventEmitter<StaffingOpportunityTypeDetails>();

  @Input()
  buttonType: string;
  @Input()
  hideHeader: boolean = false;
  @Input()
  isOpen: boolean = true;

  opportunityTypeDetails: StaffingOpportunityTypeDetails = new StaffingOpportunityTypeDetails();
  OpportunityTypeDetailsLabel: string;

  constructor() { }
  writeValue(obj: any): void {
    
    if (obj) {
      this.opportunityTypeDetails = obj;

      this.opportunityTypeDetails.additionalTeamValue.forEach(element => {
        this.teams.find(x => x.value === element.value).checked = true;
      });

      this.opportunityTypeDetails.nextPhaseValue.forEach(element => {
        this.phases.find(phase => phase.value === element.value).checked = true;
      });
      this.OpportunityTypeDetailsLabel = CommonMethods.generateOpportunityTypeDetailsLabel(this.opportunityTypeDetails);

    }
  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {

  }

  teams = [{ index: 1, label: '1', value: 1, checked: false }, { index: 2, label: '2', value: 2, checked: false }, { index: 3, label: '3', value: 3, checked: false }, { index: 0, label: '4', value: 4, checked: false }];
  phases = [{ index: 0, label: '0', value: 0, checked: false }, { index: 1, label: '1', value: 1, checked: false }, { index: 2, label: '2', value: 2, checked: false }, { index: 3, label: '3', value: 3, checked: false }];

  applySelection(): void {
    this.OppTypeDetailsDropdown.isOpen = false;
    this.opportunityTypeDetails.nextPhaseValue = new Array<StaffingOpportunityTypeDetailsSize>();
    this.opportunityTypeDetails.additionalTeamValue = new Array<StaffingOpportunityTypeDetailsSize>();
    this.phases.forEach(element => {
      if (element.checked) {
        this.opportunityTypeDetails.nextPhaseValue.push({ opportunityTypeDetailSizeId: 0, sizeType: 1, value: element.value });
      }
    });


    this.teams.forEach(element => {
      if (element.checked) {
        this.opportunityTypeDetails.additionalTeamValue.push({ opportunityTypeDetailSizeId: 0, sizeType: 2, value: element.value });
      }
    });
    this.OpportunityTypeDetailsLabel = CommonMethods.generateOpportunityTypeDetailsLabel(this.opportunityTypeDetails);
    this.opportunityTypeDetailsChange.emit(this.opportunityTypeDetails);

  }
  toggleTeam() {
    if (!this.opportunityTypeDetails.isAdditionalTeam) {
      this.teams.forEach(team => team.checked = false);
    }
  }
  togglePhase() {
    if (!this.opportunityTypeDetails.isNextPhase) {
      this.phases.forEach(phase => phase.checked = false);
    }
  }


}
