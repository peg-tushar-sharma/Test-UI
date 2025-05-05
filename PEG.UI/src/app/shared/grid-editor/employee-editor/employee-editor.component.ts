import {  Component, ViewChild, ViewContainerRef } from "@angular/core";
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { DealsService } from '../../../deals/deals.service';
import { Employee } from '../../interfaces/Employee';
import { Subject } from 'rxjs';
import { ICellEditorAngularComp } from "ag-grid-angular";
import { Partner } from '../../interfaces/partner';
import { EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from "../../common/constants";
import { CommonMethods } from "../../common/common-methods";
import { NgSelectComponent } from "@ng-select/ng-select";

@Component({
  selector: 'app-employee-editor',
  templateUrl: './employee-editor.component.html',
  styleUrls: ['./employee-editor.component.scss']
})
export class EmployeeEditorComponent implements ICellEditorAngularComp {

  @ViewChild('expertSelect') ela:NgSelectComponent

  params: any;
  typeaheadEmployeeList: Employee[];
  PeopleTagload = false;
  selectedExpert;
  hasChanged = false;
  clearItem: boolean = false;
  isMultiple: boolean = false;
  isAddItem: boolean = false;
  dropdownPosition: string = 'auto';
  nonCategoryExpertSortOrder: number = 5;
  width: string = '220';
  levelCode = "";
  isIncludeExternalEmployee: boolean = false;
  selectEmployeeTypeAhead = new Subject<string>();
  currentColumn: string;
  currentDealObject: string;
  includeAllEmployee = true;
  constructor(private _dealService: DealsService) {

  }


  agInit(params: any): void {
    window.setTimeout(() => {
      this.ela.searchInput.nativeElement.focus();
    }, 100)
    if (params.rowIndex > 4){
      this.dropdownPosition = "top";
    }

    this.isMultiple = params.data.isMultipleEmployee;
    this.isAddItem = this.isMultiple == true ? false : true;
    this.currentColumn = params.colDef.field;
    if (this.currentColumn == 'agClientSectorLeads') {
      this.currentDealObject = 'clientSectorLeads';
    } else if (this.currentColumn == 'agOthersInvolved') {
      this.currentDealObject = 'othersInvolved';
    } else if (this.currentColumn == 'agSVP') {
      this.currentDealObject = 'svp';
    } else if (this.currentColumn == 'sellingPartner') {
      this.isMultiple = true;
      this.isAddItem = false;
      this.width = '280';
      this.currentDealObject = 'sellingPartner';
      this.levelCode = LEVEL_STATUS_CODE;
    }
    else if (this.currentColumn == 'operatingPartner') { //extra changes
      this.isMultiple = true;
      this.isAddItem = false;
      this.width = '280';
      this.currentDealObject = 'operatingPartner';
      this.levelCode = LEVEL_STATUS_CODE;
    }
    else if (this.currentColumn == 'othersInvolved') { //extra changes
      this.isMultiple = true;
      this.isAddItem = false;
      this.width = '280';
      this.currentDealObject = 'othersInvolved';
      this.levelCode = LEVEL_STATUS_CODE;
    }
    else if (this.currentColumn == 'requestedSM') { //extra changes
      this.isMultiple = true;
      this.isAddItem = false;
      this.width = '280';
      this.currentDealObject = 'requestedSM';
      this.levelCode = LEVEL_STATUS_CODE;
    }
    else if (this.currentColumn == 'svp') { //extra changes
      this.isMultiple = true;
      this.isAddItem = false;
      this.width = '280';
      this.currentDealObject = 'svp';
      this.levelCode = LEVEL_STATUS_CODE;
    }
    else {
      this.currentDealObject = 'clientHeads';
    }

    this.isIncludeExternalEmployee = this.isMultiple == true ? false : true;

    if (this.currentColumn == 'agProjectLead') {
      this.isMultiple = false;
      this.isAddItem = false;
      this.currentDealObject = 'agProjectLead';
      this.isIncludeExternalEmployee = false;
    }

    this.selectEmployeeTypeAhead.pipe(
      tap(() => { this.PeopleTagload = true; }),
      debounceTime(200),
      switchMap(term => this._dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), this.levelCode, EXPERT_PARTNER_LEVELGRADE,this.includeAllEmployee, this.isIncludeExternalEmployee)),
      tap(() => this.PeopleTagload = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });

      this.typeaheadEmployeeList = items

    });
    this.params = params;
    if (this.params.data.employeeCode || this.params.data.expertName) {
      this.selectedExpert = this.params.data.expertName;
    }
    if (params.data.hasOwnProperty('clientHeads')) {
      this.selectedExpert = params.data[this.currentDealObject];
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map(element => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
    if (params.data.hasOwnProperty('sellingPartner')) {
      this.selectedExpert = params.data[this.currentDealObject];
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map(element => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
    if (params.data.hasOwnProperty('operatingPartner')) {
      this.selectedExpert = params.data[this.currentDealObject];
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map(element => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
    if (params.data.hasOwnProperty('othersInvolved')) {
      this.selectedExpert = params.data[this.currentDealObject];
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map(element => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
    if (params.data.hasOwnProperty('agothersInvolved')) {
      this.selectedExpert = params.data[this.currentDealObject];
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map(element => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
    if (params.data.hasOwnProperty('svp')) {
      this.selectedExpert = params.data[this.currentDealObject];
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map(element => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
    if (params.data.hasOwnProperty('requestedSM')) {
      this.selectedExpert = params.data[this.currentDealObject];
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map(element => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
  }

  isPopup() {
    return true;
  }

   getValue(): any {

    return this.selectedExpert;
  }

  onSelectionChange(event) {
    if (this.isMultiple) {
      if (this.typeaheadEmployeeList != undefined && this.typeaheadEmployeeList.length > 0) {
        let employee = this.typeaheadEmployeeList.find(x => x.searchableName == event[event.length - 1].searchableName);
        if (employee) {
          let tmpPartner: Partner = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            employeeCode: employee.employeeCode,
            familiarName: employee.familiarName,
            partnerWorkTypeName: null,
            region: null,
            searchableName: employee.searchableName,
            officeAbbreviation: employee.officeAbbreviation
          }

          this.params.data.bainOffice = employee.officeName;
          this.params.data.employeeCode = employee.employeeCode;
          if (this.params.colDef.field == 'agClientSectorLeads') {
            this.params.data.clientSectorLeads.push(tmpPartner)
          } else if (this.params.colDef.field == 'othersInvolved') {
            this.params.data.othersInvolved.push(tmpPartner)
          } else if (this.params.colDef.field == 'requestedSM') {
            if (this.params.data.requestedSM == null) {
              this.params.data.requestedSM = []
            }
            this.params.data.requestedSM.push(tmpPartner)
          } else if (this.params.colDef.field == 'agOthersInvolved') {
            this.params.data.othersInvolved.push(tmpPartner)
          } else if (this.params.colDef.field == 'agSVP') {
            if (this.params.data.svp == null) {
              this.params.data.svp = []
            }
            this.params.data.svp.push(tmpPartner);
          } else if (this.params.colDef.field == 'sellingPartner') {
            if (this.params.data.sellingPartner == null) {
              this.params.data.sellingPartner = [];
            }
            this.params.data.sellingPartner.push(tmpPartner)
          }
          else if (this.params.colDef.field == 'svp') {
            this.params.data.svp.push(tmpPartner)
          }
          else {
            this.params.data.clientHeads.push(tmpPartner);
          }
        }
      }
      else {
        let updatedPartners = [];
        event.forEach(element => {
          //let eCode = element.hasOwnProperty('searchableName') ?  element.searchableName.toString().split('(')[1] : element.toString().split('(')[1];
          let eCode = element.employeeCode;
          let filteredData;
          filteredData = this.params.data[this.currentDealObject].filter(a => a.employeeCode == eCode);
          if (filteredData.length > 0) {
            updatedPartners.push(filteredData[0])
          }
        });

        if (this.params.colDef.field == 'agClientSectorLeads') {
          this.params.data.clientSectorLeads = updatedPartners;
        } else if (this.params.colDef.field == 'agOthersInvolved') {
          this.params.data.othersInvolved = updatedPartners;
        } else if (this.params.colDef.field == 'agSVP') {
          this.params.data.svp = updatedPartners;
        } else if (this.params.colDef.field == 'sellingPartner') {
          this.params.data.sellingPartner = updatedPartners;
        } else if (this.params.colDef.field == 'requestedSM') {
          this.params.data.requestedSM = updatedPartners;
        }
        else {
          this.params.data.clientHeads = updatedPartners;
        }
      }
    }
    else {
      let employee = this.typeaheadEmployeeList != undefined && this.selectedExpert ? this.typeaheadEmployeeList.find(x => x.employeeCode == this.selectedExpert.employeeCode) : undefined;
      if (employee) {
        if (this.params.colDef.field == 'agProjectLead') {
          let tmpPartner: Partner = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            employeeCode: employee.employeeCode,
            familiarName: employee.familiarName,
            partnerWorkTypeName: null,
            region: null,
            searchableName: employee.searchableName,
            officeAbbreviation: employee.officeAbbreviation
          }

          this.params.data.projectLead = tmpPartner;
        }
        else {
          this.params.data.expertName = this.selectedExpert != null ? this.selectedExpert.searchableName : undefined;
          this.params.data.expertData = this.selectedExpert;
          this.params.data.bainOffice = employee.officeName;
          this.params.data.employeeCode = employee.employeeCode;
          this.params.data.title = employee.title;
          this.params.data.levelName = employee.levelName;
          this.params.data.abbreviation = employee.abbreviation;
          this.params.data.gradeName = employee.gradeName !== '0' ? employee.gradeName : '';
          this.params.data.isExternalEmployee = employee.employeeStatusCode == 'EX' ? true : false;
          this.params.data.expertNameWithoutAbbreviation = this.selectedExpert ? this.getExpertNameWithoutAbbr(this.selectedExpert) : undefined;
          this.params.data.officeAbbreviation = this.selectedExpert ? this.selectedExpert.officeAbbreviation : '';
          this.params.data.sortOrder = (this.params.data.sortOrder) ? this.params.data.sortOrder : this.nonCategoryExpertSortOrder;
          this.params.data.statusCode = employee?.statusCode;
        }
      } else {
        if (this.selectedExpert != undefined) {

          this.params.data.title = '';
          this.params.data.levelName = '';
          this.params.data.gradeName = '';
          this.params.data.bainOffice = '';
          this.params.data.abbreviation = '';
          this.params.data.expertName = this.selectedExpert != null ? this.selectedExpert.searchableName : undefined;
          this.params.data.employeeCode = this.selectedExpert != null ? this.GuidForExternalEmloyee() : undefined;
          this.params.data.expertNameWithoutAbbreviation = this.selectedExpert ? this.selectedExpert.searchableName : '';
          this.params.data.officeAbbreviation = '';
          this.params.data.sortOrder = (this.params.data.sortOrder) ? this.params.data.sortOrder : this.nonCategoryExpertSortOrder;

          let externalEmployee: Partner = {
            employeeCode: this.params.data.employeeCode,
            searchableName: this.selectedExpert != null ? this.selectedExpert.searchableName : undefined,
            familiarName: "",
            firstName: '',
            lastName: '',
            partnerWorkTypeName: null,
            region: null,
            officeAbbreviation: ''
          };
          this.selectedExpert = externalEmployee;

          this.params.data.isExternalEmployee = true;
        } else {
          if (this.params.colDef.field == 'agProjectLead') {
            this.params.data.projectLead = null;
            this.params.data.agProjectLead = null;
          }

        }
      }
    }
    if (!this.isMultiple) {
      this.params.api.stopEditing();
    }
    this.typeaheadEmployeeList = undefined;
  }

  GuidForExternalEmloyee() {
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
      (<any>c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> <any>c / 4).toString(16)
    );
  }

  getExpertNameWithoutAbbr(employee) {
    return ((employee.lastName) ? employee.lastName + ", " : '') +
      ((employee.familiarName) ? employee.familiarName : employee.firstName)
  }

}
