import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OpportunityTypeDetails, OpportunityTypeDetailsSize } from './opportunity-type-details';
import { element } from 'protractor';
import { CommonMethods } from '../common/common-methods';

@Component({
  selector: 'app-opportunity-type-details',
  templateUrl: './opportunity-type-details.component.html',
  styleUrls: ['./opportunity-type-details.component.scss'],

})
export class OpportunityTypeDetailsComponent implements OnInit, OnChanges {
  @ViewChild('OppTypeDetailsDropdown') OppTypeDetailsDropdown!: any;


  @Output()
  opportunityTypeDetailsChange = new EventEmitter<OpportunityTypeDetails>();

  @Output()
  opportunityTypeDetailsClick = new EventEmitter<void>();
  @Input()
  inputOpportunityTypeDetails: OpportunityTypeDetails;

  @Input()
  buttonType: string;
  @Input()
  hideHeader: boolean = false;
  @Input()
  isDisabled: boolean = true;

  @Input()
  isRequired: boolean = false;

  opportunityTypeDetails: OpportunityTypeDetails = new OpportunityTypeDetails();
  OpportunityTypeDetailsLabel: string;


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputOpportunityTypeDetails?.currentValue) {
      this.opportunityTypeDetails = changes.inputOpportunityTypeDetails.currentValue;

      this.opportunityTypeDetails.additionalTeamValue.forEach(element => {
        this.teams.find(x => x.value === element.value).checked = true;
      });

      this.opportunityTypeDetails.nextPhaseValue.forEach(element => {
        this.phases.find(phase => phase.value === element.value).checked = true;
      });
      this.OpportunityTypeDetailsLabel = CommonMethods.generateOpportunityTypeDetailsLabel(this.opportunityTypeDetails);
    }
  }

  ngOnInit(): void {

  }

  teams = [{ index: 1, label: '1', value: 1, checked: false }, { index: 2, label: '2', value: 2, checked: false }, { index: 3, label: '3', value: 3, checked: false }, { index: 0, label: '4', value: 4, checked: false }];
  phases = [{ index: 0, label: '0', value: 0, checked: false }, { index: 1, label: '1', value: 1, checked: false }, { index: 2, label: '2', value: 2, checked: false }, { index: 3, label: '3', value: 3, checked: false }];

  applySelection(): void {
    this.OppTypeDetailsDropdown.isOpen = false;
    this.opportunityTypeDetails.nextPhaseValue = new Array<OpportunityTypeDetailsSize>();
    this.opportunityTypeDetails.additionalTeamValue = new Array<OpportunityTypeDetailsSize>();
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
  onDropdownClick(): void {
    this.opportunityTypeDetailsClick.emit();  // Emit the click event
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
