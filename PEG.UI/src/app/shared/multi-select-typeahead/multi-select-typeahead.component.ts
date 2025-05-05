import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { Employee } from '../interfaces/models';
import { NewRegistrationService } from '../../registrations/new-registration/new-registration.service';
import { CommonMethods } from '../common/common-methods';
import { EXPERT_PARTNER_LEVELGRADE } from '../common/constants';


@Component({
  selector: 'app-multi-select-typeahead',
  templateUrl: './multi-select-typeahead.component.html',
  styleUrls: ['./multi-select-typeahead.component.scss']
})

export class MultiSelectTypeaheadComponent implements OnInit, OnChanges {

  @Input()
  isMultiSelect: false;
  @Input()
  name: string = "";
  @Input()
  selectedValue: string = "";
  @Input()
  selectedEmployeeCodes: string = "";
  @Input()
  isDisabled: boolean = false;

  @Input()
  isEditable: boolean = false;

  @Input()
  employeeStatusCode: string ="";

  @Input()
  levelStatusCode: string ="";

  @Input()
  selectedNameWithCode = "";

  employeeLoad = false;
  employees: Employee[] = [];
  selectedEmployees: any;
  employeeTypeAhead = new Subject<string>();
  isRequired = false;
  renderedLabel: string = "";
  @Output()
  public saveValue: EventEmitter<any> = new EventEmitter<any>();

  selectedEmployeeCode: string = '';

  constructor(private newRegistrationService: NewRegistrationService) {
    
    this.employeeTypeAhead.pipe(
      tap(() => { this.employeeLoad = true; this.employees = []; }),
      debounceTime(200),
      switchMap(term => this.newRegistrationService.getEmployeeNames(term, this.employeeStatusCode, this.levelStatusCode,EXPERT_PARTNER_LEVELGRADE)),
      tap(() => this.employeeLoad = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";

      });
      this.employees = items;
    });
  }

  ngOnInit() {
     
  }

  ngOnChanges(changes: SimpleChanges) {
    this.renderedLabel = "";
    if (changes.selectedValue && changes.selectedValue.currentValue) {
      let selEmployees: Employee[] = []
      let empList = changes.selectedValue.currentValue;
    
      if (Array.isArray(empList)) {
        empList.forEach(element => {
          let emp: Employee = {} as Employee;
          emp.searchableName = CommonMethods.getEmployeeName(element);
          emp.employeeCode = element.employeeCode;
          if (element.employeeCode) {
            selEmployees.push(emp);
            this.renderedLabel = this.renderedLabel + emp.searchableName + '; ';
          }
        });
      } else {
        let emp: Employee = {} as Employee;
        emp.searchableName = CommonMethods.getEmployeeName(empList);
        emp.employeeCode = empList.employeeCode;
        if (empList.employeeCode) {
          selEmployees.push(emp);
          this.renderedLabel = this.renderedLabel + emp.searchableName + '; ';
        }
      }
    
      this.employees = selEmployees;
      if (!this.isMultiSelect) {
        this.selectedEmployees = (selEmployees) ? selEmployees[0].searchableName : null;
        this.selectedEmployeeCode = selEmployees[0].employeeCode;
      }
      else {
        this.selectedEmployees = selEmployees;
      }

    }
    else {
      if (!this.isMultiSelect && this.isDisabled) {
        this.selectedEmployees = [];
      }
    }

  }

  emitValue(event) {
    if (!this.isMultiSelect) {
      if (this.selectedEmployees) {
        this.selectedEmployeeCode = this.selectedEmployees.employeeCode;
        this.saveValue.emit(this.selectedEmployees);
      }
      else {
        this.saveValue.emit(null);
      }

    }
    else {
      this.saveValue.emit(this.selectedEmployees);
    }
  }



}
