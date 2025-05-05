import { CommonMethods } from '../../common/common-methods';
import { Component, ViewChild } from '@angular/core';
import { DealsService } from '../../../deals/deals.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Employee } from '../../interfaces/Employee';
import { EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../../common/constants';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Partner } from '../../interfaces/partner';
import { PartnersDetails } from '../../interfaces/partnersDetails';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-employee-note-editor',
  templateUrl: './employee-note-editor.component.html',
  styleUrls: ['./employee-note-editor.component.scss']
})
export class EmployeeNoteEditorComponent implements ICellEditorAngularComp {

  constructor(private _dealService: DealsService) { }

  @ViewChild('expertSelect') elementRef:NgSelectComponent

  params: any;
  typeAheadEmployeeList: Employee[];
  isMultiple: boolean = false;
  selectEmployeeTypeAhead = new Subject<string>();
  dropdownPosition: string = 'auto';
  isAddItem: boolean = false;
  currentColumn: string;
  PeopleTagload = false;
  levelCode = "";
  isIncludeExternalEmployee: boolean = false;
  includeAllEmployee = true;
  width: string = '220';
  selectedExpert:Partner[];
  notes:string;


  
  agInit(params: any): void {
    window.setTimeout(() => {
      this.elementRef.searchInput.nativeElement.focus();
    }, 100)
    if (params.rowIndex > 4){
      this.dropdownPosition = "top";
    }
    

    this.currentColumn = params.colDef.field;
    this.isMultiple = true;
    this.isAddItem = false;
    this.width = '280';
    this.levelCode = LEVEL_STATUS_CODE;

    this.selectEmployeeTypeAhead.pipe(
      tap(() => { this.PeopleTagload = true; }),
      debounceTime(200),
      switchMap((term) => this._dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(),
       this.levelCode, EXPERT_PARTNER_LEVELGRADE,this.includeAllEmployee, this.isIncludeExternalEmployee)),
      tap(() => this.PeopleTagload = false)
    ).subscribe((items) => {
      items.forEach((element) => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });

      this.typeAheadEmployeeList = items;
    });
    this.params = params;
    if (params.data.hasOwnProperty(this.currentColumn)) {
      this.selectedExpert = params.data[this.currentColumn].partners;
      this.notes=params?.data[this.currentColumn]?.comments ?? "";
      if (this.isMultiple && this.selectedExpert)
        this.selectedExpert.map((element) => {
          element.searchableName = CommonMethods.getEmployeeName(element)
        });
    }
  }
  

  isPopup() {
    return true;
  }


  onSelectionChange(event) {
    if(this.typeAheadEmployeeList != undefined && this.typeAheadEmployeeList.length > 0){
    let employee = this.typeAheadEmployeeList.find((x) => x.searchableName == event[event.length - 1].searchableName);
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
      
        if(this.params.data &&
          this.params.data[this.currentColumn] &&
          this.params.data[this.currentColumn]?.partners?.length>=0){
          this.params.data[this.currentColumn]?.partners.push(tmpPartner)
        }
        else{
          this.params.data[this.currentColumn]=new Object() as PartnersDetails;
          this.params.data[this.currentColumn].partners=[];
          this.params.data[this.currentColumn].comments=this.notes ?? null;
        }
      
      
    }
  }
  this.typeAheadEmployeeList = undefined
  }
  onNotesChange(value){
    
      if(this.params.data &&
        this.params.data[this.currentColumn] &&
        this.params.data[this.currentColumn]){
        this.params.data[this.currentColumn].comments = value ?? null;
      }
  
  }

   getValue(): any {

    let partnersDetails= new Object() as PartnersDetails;
    partnersDetails.comments=this.notes ?? null;
    partnersDetails.partners=this.selectedExpert;
    return partnersDetails;
  }

  onEnterKeyPress(event) {
   
    if (event.keyCode == 13 && event.shiftKey) {
      event.stopPropagation();
    
    }
  }

}
