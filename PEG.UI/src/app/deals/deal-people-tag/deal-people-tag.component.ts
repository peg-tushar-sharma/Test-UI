import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, SimpleChange, SimpleChanges, Output, HostListener } from '@angular/core';
import { DealsService } from './../deals.service'
import { deals, taggedPeople, taggedPeopleList } from '../deal';
import { ToastrService } from 'ngx-toastr';
import { of, concat, Subject, Observable, fromEvent } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Employee } from '../../shared/interfaces/Employee';
import { NgForm } from '@angular/forms';
import { RoleType } from '../../shared/enums/role-type.enum';
import { EXPERT_PARTNER_LEVELGRADE } from '../../shared/common/constants';


@Component({
  selector: 'app-deal-people-tag',
  templateUrl: './deal-people-tag.component.html',
  styleUrls: ['./deal-people-tag.component.scss']
})
export class DealPeopleTagComponent implements OnInit, OnChanges {

  @ViewChild('dismissButton', { static: false }) public PopupModal: ElementRef<HTMLElement>;

  @ViewChild('form', { static: false })
  public form: NgForm;


  @Input()
  public deal: deals = null;


  @Input()
  public SaveToDatabase: boolean = true;

  @Input()
  public existingPeople: Array<any>;

  @Output()
  public refreshDeal: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public outTaggedPeople: EventEmitter<any> = new EventEmitter<any>();


  typeaheadPeopleList: Employee[];
  PeopleTagload = false;
  selectedPeople;
  hasChanged = false;
  clearItem: boolean = false;
 

  HIDE_SAVE:boolean=false;
  selectPeopleTypeAhead = new Subject<string>();


  public taggedPplList: Array<any> = null;
  constructor(private _dealsService: DealsService, private cd: ChangeDetectorRef, private _toastrService: ToastrService) {
    this.selectPeopleTypeAhead.pipe(
      tap(() => { this.PeopleTagload = true; this.typeaheadPeopleList = []; }),
      debounceTime(200),
      switchMap(term => this._dealsService.getEmployeeByName(term,"",EXPERT_PARTNER_LEVELGRADE)),
      tap(() => this.PeopleTagload = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = element.lastName + ", " + ((element.familiarName) ? element.familiarName : element.firstName) + " (" + element.employeeCode + ")";
      });

      this.typeaheadPeopleList = items

    });
  }

  clearItems() {
    this.selectedPeople = null;
    this.typeaheadPeopleList = [];
    this.form.reset();
  }

  objectKey(obj) {
    return Object.keys(obj);
  }

  formatedCerts() {
    return this.taggedPplList.reduce((prev, now) => {
      if (!prev[now.pegRoleName]) {
        prev[now.pegRoleName] = [];
      }

      prev[now.pegRoleName].push(now);
      return prev;
    }, {});

  
  }
  ngOnInit() {

  }
 

  onPeopleAdd(value) {
    if (this.taggedPplList) {
      let isExists = this.taggedPplList.some(x => x.employeeCode == value.employeeCode);
      if (!isExists) {
        let obj = {

          firstName: value.firstName,
          familiarName: value.familiarName,
          lastName: value.lastName,
          employeeCode: value.employeeCode,
          office_name: value.officeName,
          positionTitle: value.title,
          pegRole: value.pegRole,
          pegRoleName: value.pegRoleName,
          officeAbbreviation: value.officeAbbreviation

        }
        this.taggedPplList.unshift(obj)
        this.hasChanged = true;
        //this.isDisabled = false;
      }

    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deal) {
      this.deal = changes.deal.currentValue;
    }
    this.hasChanged = false;
    this.taggedPplList = [];
    if (changes.deal && changes.deal.currentValue) {
      this._dealsService.getDealTaggedPeopleById(changes.deal.currentValue.dealId).subscribe(res => {
        this.taggedPplList = res.value;

        if (!this.SaveToDatabase) {
          if (this.deal && this.deal.dealId > 0) {
            this.taggedPplList = this.taggedPplList.filter(element => (element.dealPeopleTagId === 0))
          }
          this.existingPeople.forEach(element => {
            var isExist = this.taggedPplList.some(role => (role.employeeCode == element.employeeCode));
            if (!isExist) {
              this.taggedPplList.unshift(element);
            }
          });
        }
      })
    }
  }

  SaveTaggedPeople() {
    let arr = [];
    let NewAdditions: Array<taggedPeopleList> = [];
    this.taggedPplList.forEach(element => {
      if (element.dealId != 0) {
        arr.push(element.employeeCode);
        NewAdditions.push(element)
      }
    });
    let employeeCodeArr = arr.join(',')

    let taggedPeople: taggedPeople = { dealId: this.deal.dealId, employeeCodes: employeeCodeArr }
    if (this.SaveToDatabase) {
      this._dealsService.saveTaggedPeople(taggedPeople).subscribe(res => {
        this._toastrService.success("Access granted successfully", "Success!");
        this.closeModal();
      })
    }
    else {
      this.outTaggedPeople.emit(NewAdditions);
      this.closeModal();

    }
  }


  closeModal() {
    this.taggedPplList = [];
    this.refreshDeal.emit(null);

    this.hasChanged = false;
    this.PopupModal.nativeElement.click()
  }

  removePeople(value) {
    const index = this.taggedPplList.indexOf(value, 0);
    if (index > -1) {
      this.taggedPplList.splice(index, 1);
      this.hasChanged = true;

    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  public beforeClose(element) {
    this.closeModal()
  }


}
