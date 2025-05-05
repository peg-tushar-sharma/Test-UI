import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { Subject } from 'rxjs';
import { Case } from '../../interfaces/case';
import { DealsService } from '../../../deals/deals.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Office } from '../../interfaces/office';
import { GlobalService } from '../../../global/global.service';
import { CaseInfo } from '../../interfaces/caseInfo';
import { NgSelectComponent } from '@ng-select/ng-select';
import { RegistrationStageEnum } from '../../enums/registration-stage.enum';

@Component({
  selector: 'app-case-editor',
  templateUrl: './case-editor.component.html',
  styleUrls: ['./case-editor.component.scss']
})
export class CaseEditorComponent implements ICellEditorAngularComp, OnChanges, OnInit {
  @ViewChild('caseComp') ela: NgSelectComponent
  @Input()
  fromSidebar = false;

  @Input()
  caseCode: string = '';

  @Input()
  caseName: string = '';

  @Input()
  dropdownPosition: string = 'auto';

  @Input()
  isEditable = true;

  @Input()
  dropdownParent: string = '';

  @Output()
  public caseDataChanges = new EventEmitter();

  caseTypeAhead = new Subject<string>();
  cases: Case[] = [];
  caseLoad = false;
  selectedCases;
  selectedCaseData;
  params: any;
  isMultiple: boolean = false;
  caseInfo: CaseInfo;
  public bainOffices: Office[];
  parentField: any;
  constructor(private dealService: DealsService, private globalService: GlobalService) {
    this.caseTypeAhead.pipe(
      tap(() => { this.caseLoad = true; }),
      debounceTime(200),
      switchMap(term => this.dealService.getCCMCasesByName(term == undefined || term == null ? '' : term.toString().trim())),
      tap(() => this.caseLoad = false)
    ).subscribe(items => {
      items.forEach(item => {
        item.startDate = moment(item.startDate).local().format("DD-MMM-YYYY");
        item.endDate = moment(item.endDate).local().format("DD-MMM-YYYY");
        item.customGroup = moment(item.endDate) < moment(new Date()) ? 'Inactive' : 'Active'
      }
      )
      let activeCases = items.filter(group => group.customGroup == 'Active');
      let inActiveCases = items.filter(group => group.customGroup == 'Inactive');
      items = [];
      items = activeCases.concat(inActiveCases);
      this.cases = items;
    });

    this.globalService.getOffice().subscribe(office => {
      this.bainOffices = office;
    });
  }

  agInit(params: any): void {

    setTimeout(() => {
      if (this.ela != undefined) {
        this.ela.searchInput.nativeElement.focus()
      }
    }, 200);
    if (params.rowIndex && params.rowIndex > 4)
      this.dropdownPosition = "top";

    this.isMultiple = params.data?.isMultipleClient != undefined ? params.data?.isMultipleClient : false;
    this.parentField = params?.context?.componentParent?.parentField != undefined ? params.context?.componentParent?.parentField : null;
    this.params = params;

    if (this.parentField && this.parentField == 'pipelineGrid') {
      if (params.data.hasOwnProperty('case')) {
        this.selectedCases = params.data?.case?.caseCode;
      }
    }
    else {
      if (params.data.hasOwnProperty('caseCode')) {
        this.selectedCases = params.data.caseCode;
      }
    }

  }

  ngOnInit(): void {

    // Get existing case info to display info below dropdown
    if (this.fromSidebar && this.caseName != '') {
      this.dealService.getCCMCasesByName(this.caseCode.trim()).subscribe(
        async res => {
          if (res.length > 0) {
            this.selectedCaseData = res[0];
          }
        }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('caseCode')) {
      if (changes?.caseCode?.currentValue) {
        this.selectedCases = changes?.caseCode?.currentValue;
      }
    }
  }

  isPopup() {
    return true;
  }

  onDropdownOpen() {
    this.cases = [];
  }

  getValue(): any {
    if (this.selectedCases) {
      if (this.parentField && this.parentField == 'pipelineGrid') {
        let CurrCase = this.cases.find(r => r.oldCaseCode == this.selectedCases.trim());
        this.caseInfo = {
          caseId: this.params.data?.case ? this.params.data?.case?.caseId : 0,
          caseCode: CurrCase ? CurrCase.oldCaseCode.trim() : null,
          caseName: CurrCase ? CurrCase.caseName : null,
          caseStartDate: CurrCase ? CurrCase.startDate : null,
          caseEndDate: CurrCase ? CurrCase.endDate : null,
          caseOffice: CurrCase ? Number(CurrCase.managingOfficeCode) : 0,
          caseOfficeName: this.params.data?.caseOfficeName,
          officeCluster: this.params.data?.caseOffice?.officeCluster
        };
        if ((this.selectedCases && CurrCase) || (!this.selectedCases && !CurrCase))
          this.params.data.case = this.caseInfo;
        return this.params.data.case;
      }
      else {
        this.updateStage();
        return this.isMultiple == false || this.isMultiple == undefined ? this.selectedCases.toString().trim().replace(/\s+/g, " ") : this.selectedCases.join(';');
      }
    } else {
      if (this.parentField && this.parentField == 'pipelineGrid') {

        let CurrCase = this.cases.find(r => r.oldCaseCode == this.selectedCases.trim());
        this.caseInfo = {
          caseId: this.params.data?.case ? this.params.data?.case?.caseId : 0,
          caseCode: CurrCase ? CurrCase.oldCaseCode.trim() : null,
          caseName: CurrCase ? CurrCase.caseName : null,
          caseStartDate: CurrCase ? CurrCase.startDate : null,
          caseEndDate: CurrCase ? CurrCase.endDate : null,
          caseOffice: CurrCase ? Number(CurrCase.managingOfficeCode) : 0,
          caseOfficeName: this.params.data?.caseOfficeName ? this.params.data?.caseOfficeName : null,
          officeCluster: this.params.data?.caseOffice?.officeCluster ? this.params.data?.caseOffice?.officeCluster : null
        };
        if ((this.selectedCases && CurrCase) || (!this.selectedCases && !CurrCase))
          this.params.data.case = this.caseInfo;

        return this.params.data.case;
      }
      this.setCaseData('');
      return ''
    }
  }

  onCaseChange(event) {
    if (this.isMultiple == false) {
      if (event && event.oldCaseCode.trim() == '') {
        this.selectedCases = this.params.data.caseCode;
      } else {
        if (event) {
          this.setCaseData(event);
        }
      }
    }
    if (this.params) {
      this.params.api.stopEditing();
    }
  }

  setCaseData(event) {
    this.caseInfo = {
      caseId: 0,
      caseCode: event && event?.oldCaseCode ? event?.oldCaseCode : null,
      caseName: event?.caseName,
      caseStartDate: event?.startDate,
      caseEndDate: event?.endDate,
      caseOffice: 0,
      caseOfficeName: '',
      officeCluster: ''
    };

    if (this.params && this.params.data) {
      this.updateCaseOfficeData(this.params.data, event?.managingOfficeCode);
    } else {
      this.updateCaseOfficeData(this.caseInfo, event?.managingOfficeCode);
    }

    if (this.params) {
      let CurrCase = this.cases.find(r => r.oldCaseCode == event.oldCaseCode.trim());
      this.params.data.caseCode = CurrCase ? CurrCase : event ? event.oldCaseCode.trim() : null;
      this.params.data.caseName = event ? event.caseName : null;
      this.params.data.caseStartDate = event ? moment(event.startDate) : null;
      this.params.data.caseEndDate = event ? moment(event.endDate) : null;
    } else {
      this.caseDataChanges.emit(this.caseInfo);
    }
    this.selectedCaseData = event;
  }

  updateCaseOfficeData(caseData, managingOfficeCode) {
    let office = this.bainOffices.filter(x => x.officeCode == managingOfficeCode);
    if (office && office[0]) {
      caseData.caseOffice = this.params ? office[0] : office[0].officeCode;
      caseData.officeCluster = office[0].officeCluster;
      caseData.caseOfficeName = office[0].officeName;
      caseData.OfficeAbbreviation = office[0].officeAbbr;
    } else {
      caseData.caseOffice = this.params ? null : 0;
      caseData.officeCluster = '';
      caseData.caseOfficeName = '';
    }
    if (!managingOfficeCode) {
      this.selectedCases = null;
    }
  }

  // UPDATE THE STAGE OF REGISTRATION
  // WORK STARTED   - IF THE CASE END DATE IS FUTURE
  // WORK COMPLETED - IF THE CASE END DATE IS PAST
  updateStage() {
    // To update the registration stage
    // When a new case code is added (Excluding weekends)- 
    //    update stage to work started (If the end date is future)
    //    update the stage to work completed (If the end date is past)

    if (this.params.data.caseCode && this.params.data.caseCode?.endDate) {
      let stage = moment(this.params.data.caseCode?.endDate).add(1, 'days').startOf('day') <= moment(new Date()) ?
        {
          "registrationStageId": Number(RegistrationStageEnum.WorkCompleted),
          "stageTypeName": "Work Completed"
        } :
        {
          "registrationStageId": Number(RegistrationStageEnum.WorkStarted),
          "stageTypeName": "Work Started"
        }
      this.params.data.stage = {};
      this.params.data.stageTypeName = stage.stageTypeName;
      this.params.data.stage = stage;
    }
  }

}
