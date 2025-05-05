import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { DealsService } from '../../../deals/deals.service';
import { GlobalService } from '../../../global/global.service';
import { Case } from '../../../shared/interfaces/case';
import { CaseInfo } from '../../../shared/interfaces/caseInfo';
import { Office } from '../../../shared/interfaces/office';

@Component({
  selector: 'app-case-editor-pop-up',
  templateUrl: './case-editor-pop-up.component.html',
  styleUrls: ['./case-editor-pop-up.component.scss']
})
export class CaseEditorPopUpComponent implements OnInit {
  title: string;
  data: any;

  caseTypeAhead = new Subject<string>();
  cases: Case[] = [];
  caseLoad = false;
  selectedCases;
  isMultiple: boolean = false;
  dropdownPosition: string = 'auto';
  caseInfo: CaseInfo;
  public bainOffices: Office[];

  @Output()
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef, private dealService: DealsService, private globalService: GlobalService) {
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

  ngOnInit(): void {

    if (this.data?.pipeline && this.data?.pipeline?.hasOwnProperty('case')) {
      this.selectedCases = this.data?.pipeline?.case?.caseCode;
      this.caseInfo=this.data?.pipeline?.case;
    }
  }
  ngAfterViewInit() {
    // The reason behind to put this code because whenever we try to apply the 
    // styling through css all the modals are impacted and we only need to add style over the confirm modal
    let modalElement = document.getElementsByClassName('modal-backdrop');
    for (let i = 0; i < modalElement.length; i++) {
      const slide = modalElement[i] as HTMLElement;
      slide.setAttribute("style", "z-index : 99999 !important");
    }

    let modalElemen = document.getElementsByClassName('modal');
    for (let i = 0; i < modalElemen.length; i++) {
      const slide = modalElemen[i] as HTMLElement;
      slide.setAttribute("style", "z-index : 99999 !important");
    }

  }
  close() {
    this.bsModalRef.hide();
  }
    onCaseChange(event) {
     if (event && event.oldCaseCode.trim() != '') {
      
      let CurrCase = this.cases.find(r => r.oldCaseCode == this.selectedCases.trim());
     this.caseInfo = {
        caseId: this.data?.pipeline?.case ? this.data?.pipeline?.case?.caseId : 0,
        caseCode: CurrCase ? CurrCase.oldCaseCode.trim() : null,
        caseName: CurrCase ? CurrCase.caseName : null,
        caseStartDate: CurrCase ? CurrCase.startDate : null,
        caseEndDate: CurrCase ? CurrCase.endDate : null,
        caseOffice: CurrCase ? Number(CurrCase.managingOfficeCode) : 0,
        caseOfficeName: this.data?.pipeline?.case?.caseOfficeName,
        officeCluster: this.data?.pipeline?.case?.caseOffice?.officeCluster
      };
      this.updateCaseOfficeData(this.caseInfo, this.caseInfo.caseOffice) 
     
    }
    else
    {
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
    }
    

  }
   save() {
    this.data.pipeline.case = this.caseInfo;
    this.close();
    this.event.emit('saveCaseCode');

  }
  updateCaseOfficeData(caseData, managingOfficeCode) {
       let office = this.bainOffices.filter(x => x.officeCode == managingOfficeCode);
    if (office && office[0]) {
      caseData.caseOffice =  office[0].officeCode;
      caseData.officeCluster = office[0].officeCluster;
      caseData.caseOfficeName = office[0].officeName;
      caseData.OfficeAbbreviation = office[0].officeAbbr;
    } else {
      caseData.caseOffice = 0;
      caseData.officeCluster = '';
      caseData.caseOfficeName = '';
    }
    if (!managingOfficeCode) {
      this.selectedCases = null;
    }
  }
 

}
