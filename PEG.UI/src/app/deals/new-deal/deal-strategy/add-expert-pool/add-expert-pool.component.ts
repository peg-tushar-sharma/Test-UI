import { Component, Input, Output, OnInit, ViewChild, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';

// interfaces | constants
import { DealExpertsList, deals } from '../../../deal';
import { expertGroup } from '../../deal-experts/expertGroup';
import { DealTracker } from '../../../../deals/dealTracker';
import { ExpertPoolTab } from '../../../../shared/enums/expert-pool-popup-tab.enum';
import { Employee } from '../../../../shared/interfaces/Employee';
import { EXPERT_PARTNER_LEVELGRADE } from '../../../../shared/common/constants';

// services
import { DealsService } from '../../../../deals/deals.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CoreService } from '../../../../core/core.service';
import { PegTostrService } from '../../../../core/peg-tostr.service';
import { GlobalService } from '../../../../global/global.service';

@Component({
  selector: 'app-add-expert-pool',
  templateUrl: './add-expert-pool.component.html',
  styleUrls: ['./add-expert-pool.component.scss']
})
export class AddExpertPoolComponent implements OnInit, OnChanges {

  @ViewChild('form', { static: true })
  private form: NgForm;

  // inputs
  @Input() deal: deals;
  @Input() dealTracker: DealTracker;
  @Input() expertGroups: any;
  @Input() dealId: any;
  @Input() enableImport: boolean = false;
  @Input() updateGroup: boolean = false;

  // outputs
  @Output()
  public closeExpertPool: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public saveExpertGroup: EventEmitter<any> = new EventEmitter<any>();

  selectedImportDeal: DealExpertsList;
  selectedImportExpertGroup: expertGroup;
  selectedImportExpertPool: any;
  currentEditGroupIndex: number = 0;
  selectedImportNotes: any
  selectedImportExpertPoolcolor: any;
  selectedGroupExperts: any[] = [];

  dealTypeAhead = new Subject<string>();
  dealList: any[] = [];
  dealload = false;

  poolTypeAhead = new Subject<string>();
  poolList: any[] = [];
  poolLoad: boolean = false;

  selectEmployeeTypeAhead = new Subject<string>();
  typeaheadEmployeeList: Employee[];
  peopleTagLoad: boolean = false;
  isIncludeExternalEmployee: boolean = true;
  includeAllEmployee: boolean = true;
  levelCode: string = '';
  selectedExpert;
  nonCategoryExpertSortOrder: number = 5;

  expertGroup: expertGroup = new expertGroup();
  expertGroupId: number = 0;
  disableImportPool: boolean = false;
  errorMessage: string;
  isDuplicateName: boolean = false;

  lstColors: any[] = [];
  lstExpertGroupCategory: any[] = [];

  poolEdit: string = 'Add';
  activeTab: ExpertPoolTab;

  currentExpertGroupId: number;
  updateExpertGroupId: number;
  selectedExpertGroupName: any;
  selectedexpertGroupCategory: any;
  selectedExpertGroupNote: any;
  selectedExpertPoolcolor: any;

  constructor(private dealService: DealsService, private modalService: BsModalService, private tostreService: PegTostrService, private globalService: GlobalService, public core: CoreService) {
    // deals typeahead
    this.dealTypeAhead.pipe(
      tap(() => { this.dealload = true; this.dealList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getDealsToImportExperts(term)),
      tap(() => { this.dealload = false }
      )
    ).subscribe(items => {

      this.dealList = items;
      this.dealList = this.dealList.map(obj => ({ ...obj, disabled: obj.appSessionId ? true : false }))
    });

    // employee typeahead
    this.selectEmployeeTypeAhead
      .pipe(
        tap(() => {
          this.peopleTagLoad = true;
        }),
        debounceTime(200),
        switchMap((term) =>
          this.dealService.getEmployeeByName(
            term == undefined || term == null ? "" : term.toString().trim(),
            this.levelCode,
            EXPERT_PARTNER_LEVELGRADE,
            this.includeAllEmployee,
            this.isIncludeExternalEmployee
          )
        ),
        tap(() => (this.peopleTagLoad = false))
      )
      .subscribe((items) => {
        items.forEach((element) => {
          element.searchableName =
            (element.lastName ? element.lastName + ", " : "") +
            (element.familiarName ? element.familiarName : element.firstName) +
            (element.employeeStatusCode == "EX" ? "" : " (" + element.officeAbbreviation + ")");
          element.searchableName += element.statusCode == "L" ? " (Leave)" : "";
        });

        this.typeaheadEmployeeList = items;
      });
  }

  ngOnInit(): void {
    this.globalService.getExpertPoolColors().subscribe(colors => {
      this.lstColors = colors;
    });

    this.globalService.getExpertGroupCategory().subscribe(category => {
      this.lstExpertGroupCategory = category;
    });

    this.activeTab = this.enableImport === true ? ExpertPoolTab.Import : ExpertPoolTab.New;

    if (this.updateGroup) {
      this.setGroupDataToUpdate();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.expertGroups && changes.expertGroups.currentValue) {
      this.expertGroup = changes.expertGroups.currentValue;
      this.selectedExpertGroupName = changes.expertGroups.currentValue?.expertGroupName;
      this.selectedExpertPoolcolor = changes.expertGroups.currentValue?.expertPoolColor;
      this.selectedexpertGroupCategory = changes.expertGroups.currentValue?.expertGroupCategory;
      this.selectedExpertGroupNote = changes.expertGroups.currentValue?.expertGroupNote;

      this.poolEdit = 'Update';
    }
  }

  // When user presses enter, start a new line
  onEnterKeyPress(event) {
    event.stopPropagation();
  }

  setGroupDataToUpdate() {
    this.expertGroup = this.expertGroups;
    this.selectedExpertGroupName = this.expertGroups?.expertGroupName || null;
    this.selectedExpertPoolcolor = this.expertGroups?.expertPoolColor || null;
    this.selectedexpertGroupCategory = this.expertGroups?.expertGroupCategory || null;
    this.selectedExpertGroupNote = this.expertGroups?.expertGroupNote || null;

    this.selectedExpert = this.expertGroups?.experts || [];

    this.selectedExpert.forEach((exp) => {
      exp['searchableName'] = exp.expertName;
    });

    this.poolEdit = 'Update';
  }

  toggleTab(tab: string) {
    if (tab === ExpertPoolTab.Import) {
      this.activeTab = ExpertPoolTab.Import;
      this.disableImportPool = false;
      this.clearNewPoolData();
    } else {
      this.activeTab = ExpertPoolTab.New;
      this.disableImportPool = true;
      this.clearImportPoolData();

    }
  }
clearImportPoolData(){
  this.selectedImportDeal = null;
  this.selectedImportExpertGroup = null;
  this.selectedImportExpertPoolcolor = null;
  this.selectedImportNotes = null;
  this.selectedGroupExperts = null;
  this.isDuplicateName = false;
}
clearNewPoolData(){
  this.selectedExpertGroupName = null;
  this.selectedExpertPoolcolor = null;
  this.selectedexpertGroupCategory = null;
  this.selectedExpertGroupNote = null;
  this.selectedExpert = null;
  this.isDuplicateName = false;
}
  onTrackerSelectionChanged(event) {
    this.selectedImportExpertGroup = undefined;
    this.selectedImportExpertPoolcolor = undefined;
    this.selectedImportNotes = "";
    this.selectedGroupExperts = undefined;
    if (this.selectedImportDeal) {


      this.settingNotesValue();
      if (this.selectedImportDeal.expertGroups.length > 0) {
        let selectedExpertPool: expertGroup = this.selectedImportDeal.expertGroups.find(x => x.expertGroupId == this.selectedImportDeal.expertGroupId);
        this.selectedImportExpertGroup = selectedExpertPool;
        if (selectedExpertPool) {
          this.expertGroupChange(selectedExpertPool);
        }
      }
    } else {
      // clicking cross icon on expert pool search
      this.selectedImportExpertGroup = undefined;
      this.selectedGroupExperts = undefined;
      this.isDuplicateName = false;
    }

  }

  clearItems() {
    this.dealList = [];
  }

  isDuplicateExpert(employee) {
    let len = this.selectedExpert?.experts?.filter((ele) => ele.employeeCode == employee.employeeCode && ele.employeeCode != null).length;

    if (len > 0) {
      return true;
    } else {
      return false;
    }
  }

  onSelectionChange(employee: Employee[]) {
    if (this.isDuplicateExpert(employee[this.selectedExpert.length - 1])) {
      this.isDuplicateName = true;
      this.errorMessage = 'This expert has already been added.'
    } else {
      this.isDuplicateName = false;
      this.errorMessage = '';
      this.selectedExpert = employee;
    }
  }

  settingNotesValue() {
    // Setting pretext in expert notes
    if (this.selectedImportDeal && this.selectedImportDeal.expertGroups) {
      this.selectedImportDeal.expertGroups.forEach(grp => {
        let groupName = "";
        groupName = grp.expertGroupNote == null ? grp.expertGroupNote = '' : grp.expertGroupNote
        grp.expertGroupNote = "(Imported, Tracker ID - " + this.selectedImportDeal.dealId + ") " + groupName;

      });
    }
  }

  expertGroupChange(event: expertGroup) {
    let expGrp = this.dealTracker.expertGroup.filter(e => e?.expertGroupName == event?.expertGroupName + "-" + this.selectedImportDeal.dealId);
    if (expGrp && expGrp.length == 0) {
      this.selectedImportExpertPoolcolor = (event) ? event.expertPoolColor : null;
      this.selectedImportNotes = (event) ? event.expertGroupNote : '';
      this.errorMessage = "";
      this.isDuplicateName = false;
      this.selectedGroupExperts = event.experts && event.experts.length ? event.experts?.map((expert) => expert?.expertName) : [];
    } else {
      this.isDuplicateName = true;
      this.errorMessage = "* This expert pool name already exists."
    }
  }

  onImportPoolColorChange(event) {
    this.selectedImportExpertPoolcolor = event;
  }

  expertGroupNameChange(event) {
    if (this.poolEdit == 'Update') {
      if (this.updateExpertGroupId) {
        let expertGroup = this.dealTracker.expertGroup.filter(x => x.expertGroupId != this.updateExpertGroupId)
        if (expertGroup.findIndex(x => String(x.expertGroupName).replace(/\s/g, "").toLowerCase().trim() == event.replace(/\s/g, "").toLowerCase().trim()) > -1) {
          this.errorMessage = "* This expert pool name already exists."
          this.isDuplicateName = true;
        }
        else {
          this.errorMessage = "";
          this.isDuplicateName = false;
        }
      }
    }
    else {
      if (this.dealTracker.expertGroup.findIndex(x => String(x.expertGroupName).replace(/\s/g, "").toLowerCase().trim() == event.replace(/\s/g, "").toLowerCase().trim()) > -1) {
        this.errorMessage = "* This expert pool name already exists."
        this.isDuplicateName = true;
      }
      else {
        this.errorMessage = "";
        this.isDuplicateName = false;
      }
    }
  }

  import() {
    if (this.poolEdit == 'Add') {
      if (this.isDuplicateName === false) {
        this.expertGroup.lastUpdated = new Date();
        this.expertGroup.expertGroupId = 0;
        this.expertGroup.dealId = this.dealId;

        if (this.selectedImportExpertGroup?.experts.length > 0) {
          this.selectedImportExpertGroup?.experts.forEach(ex => {
            ex.expertId = 0
          });
        }

        this.expertGroup.expertGroupName = this.selectedImportExpertGroup.expertGroupName + "-" + this.selectedImportDeal.dealId;
        this.expertGroup.experts = this.selectedImportExpertGroup.experts;
        this.expertGroup.expertPoolColor = this.selectedImportExpertPoolcolor;
        this.expertGroup.expertGroupCategory = this.selectedImportExpertGroup.expertGroupCategory;
        this.expertGroup.expertGroupNote = this.selectedImportNotes;
        this.expertGroup.lastUpdatedExpert = this.selectedImportExpertGroup.lastUpdatedExpert;
      }
    }

    this.updateExpertGroupId = undefined;
    this.selectedImportDeal = null;
    this.selectedImportExpertGroup = null;
    this.selectedImportExpertPoolcolor = null;
    this.selectedImportNotes = null;

    this.saveExpertGroup.emit({ expertGroup: this.expertGroup, poolEdit: this.poolEdit });
    this.expertGroup = new expertGroup();
  }

  save() {
    if (this.poolEdit == 'Add') {
      if (this.isDuplicateName === false) {
        this.expertGroup.expertGroupName = this.selectedExpertGroupName;
        this.expertGroup.expertPoolColor = this.selectedExpertPoolcolor;
        this.expertGroup.expertGroupCategory = this.selectedexpertGroupCategory;
        this.expertGroup.expertGroupNote = this.selectedExpertGroupNote;
        this.expertGroup.expertGroupId = 0;
        this.expertGroup.dealId = this.dealId;
        this.expertGroup.experts = this.selectedExpert;
        this.expertGroup.lastUpdated = new Date();
      }
    } else {
      this.expertGroup.expertGroupName = this.selectedExpertGroupName;
      this.expertGroup.expertPoolColor = this.selectedExpertPoolcolor;
      this.expertGroup.expertGroupCategory = this.selectedexpertGroupCategory;
      this.expertGroup.expertGroupNote = this.selectedExpertGroupNote;
      this.expertGroup.experts = this.selectedExpert;
    }

    this.saveExpertGroup.emit({ expertGroup: this.expertGroup, poolEdit: this.poolEdit });
    this.expertGroup = new expertGroup();
  }

  cancel() {
    this.closeExpertPool.emit();
  }

  getInfoText(infoText: any) {
    if (infoText?.lastUpdatedExpert) {
      let info = [];

      if (infoText.lastUpdatedExpert != "0001-01-01T00:00:00Z") {
        info.push('Last Updated: ' + moment(infoText.lastUpdatedExpert).format('DD-MMM-YYYY')) + '\n';
      } else {
        info.push(infoText.expertGroupNote);
      }

      return info;
    } else if (infoText) {
      return infoText?.expertGroupNote ? [infoText.expertGroupNote] : [infoText];
    }
  }
}
