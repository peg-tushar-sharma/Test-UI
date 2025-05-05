import { Component, OnInit, Input, ViewChild, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { deals } from '../../deal';
import { Employee } from '../../../shared/interfaces/models';
import { Subject } from 'rxjs';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { DealsService } from '../../deals.service';
import { DealSecurityTab } from './dealSecurityTab';
import { DealSecurityService } from '../../deal.security.service';
import { RoleType } from '../../../shared/enums/role-type.enum';
import { NgForm } from '@angular/forms';
import { EXPERT_PARTNER_LEVELGRADE } from '../../../shared/common/constants';

@Component({
  selector: 'app-deal-security',
  templateUrl: './deal-security.component.html',
  styleUrls: ['./deal-security.component.scss']
})
export class DealSecurityComponent implements OnInit, OnChanges {
  @ViewChild('securityForm', { static: true })
  public securityForm: NgForm;

  @Input()
  public deal: deals = null;

  @Output()
  public outSecurityPeople: EventEmitter<null> = new EventEmitter<null>();

  @Input()
  isReadOnly: boolean;


  checkModel: any = { left: false, middle: true, right: false };
  radioModel: any = true;
  typeaheadPeopleList: Employee[];
  selectPeopleTypeAhead = new Subject<string>();
  PeopleTagload = false;
  selectedPeople: any;
  dealPeopleLoad: boolean = false;

  dealAccessTier = [];

  constructor(private _dealsService: DealsService, public _dealSecurityService: DealSecurityService) {
    this.selectPeopleTypeAhead.pipe(
      tap(() => { this.PeopleTagload = true; this.typeaheadPeopleList = []; }),
      debounceTime(200),
      switchMap(term => this._dealsService.getEmployeeByName(term, "",EXPERT_PARTNER_LEVELGRADE,false)),
      tap(() => this.PeopleTagload = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.officeAbbreviation + ")";
      });

      this.typeaheadPeopleList = items

    });
  }

  ngOnInit() {
    this._dealSecurityService.getDealAccessTier().subscribe(res => {
      this.dealAccessTier = res;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.deal){
      this.deal.dealSecurity = changes.deal.currentValue.dealSecurity;
    }    
  }

  onPeopleAdd(value) {
    if (value != undefined) {


      let isExists = this.deal.dealSecurity.filter(a => a.employee.employeeCode == value.employeeCode);

      if (isExists.length == 0) {
        let tmpemployee: any = {};
        tmpemployee.employeeCode = value.employeeCode;
        tmpemployee.lastName = value.lastName;
        tmpemployee.firstName = value.firstName;
        tmpemployee.familiarName = value.familiarName;
        tmpemployee.pegRoleName = value.pegRoleName;
        tmpemployee.pegRole = value.pegRole;
        tmpemployee.officeAbbreviation = value.officeAbbreviation;
        let adminDefaults = this.dealAccessTier.find(a => a.accessTierId == 1);
        let objSecurityData: DealSecurityTab = new DealSecurityTab();
        objSecurityData = {
          name: value.lastName + ", " + ((value.familiarName) ? value.familiarName : value.firstName) + " (" + value.officeAbbreviation + ")",

          role: value.pegRoleName,
          employee: tmpemployee,
          accessTierId: 1,
          tabs: JSON.parse(JSON.stringify(adminDefaults))
        }
        this.deal.dealSecurity.unshift(objSecurityData);
        this.outSecurityPeople.emit();
      }
    }
  }


  clearItems() {
    this.selectedPeople = null;
    this.typeaheadPeopleList = [];
    this.securityForm.reset();
  }

  deletePeople(data: DealSecurityTab) {
    this.deal.dealSecurity = this.deal.dealSecurity.filter(a => a.employee.employeeCode != data.employee.employeeCode);

    this.outSecurityPeople.emit();
  }

  onUpdateValue(update) {
    let updateDealSecurity = this.deal.dealSecurity.filter(a => a.employee.employeeCode == update.employeeCode);
    if (updateDealSecurity.length > 0) {
      updateDealSecurity[0].tabs[update.tab][update.property] = update.value;

      //is Visiable is set to false , isEditable is also set to false
      if (update.property == 'isVisible' && !update.value) {
        updateDealSecurity[0].tabs[update.tab]['isEditable'] = update.value;
      }
      //is editable is set to true , isvisible is also set to true
      if (update.property == 'isEditable' && update.value) {
        updateDealSecurity[0].tabs[update.tab]['isVisible'] = update.value;
      }

    }
  }

  updateTier(employee, value) {

    if (employee.pegRole != RoleType.PEGOperations && employee.pegRole != RoleType.PEGLeadership && employee.pegRole != RoleType.MultibidderManager) {
      let updateDealSecurity = this.deal.dealSecurity.filter(a => a.employee.employeeCode == employee.employeeCode);
      if (updateDealSecurity.length > 0) {
        updateDealSecurity[0].accessTierId = value;
        let CurrentAccessTier = this.dealAccessTier.find(a => a.accessTierId == value);
        if (CurrentAccessTier != undefined) {
          updateDealSecurity[0].tabs = JSON.parse(JSON.stringify(CurrentAccessTier));

        }
      }
    }
  }

}
