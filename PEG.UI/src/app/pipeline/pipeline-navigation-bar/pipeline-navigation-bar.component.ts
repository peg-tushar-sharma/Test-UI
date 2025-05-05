import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChanges,
  OnDestroy,
  HostListener} from "@angular/core";
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { PipelineService } from '../pipeline.service';
import { PegTostrService } from '../../core/peg-tostr.service';
import { RegistrationService } from '../../registrations/registrations/registration.service';
import { CommonMethods } from '../../shared/common/common-methods';
import { UserFilter } from '../userFilter';
import { OpportunityStage } from '../pipeline';
import { GlobalService } from '../../global/global.service';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { CoreService } from '../../core/core.service';
import { SaveFilterModalComponent } from '../pipeline-grid/save-filter-modal/save-filter-modal.component';
import { ShareViewModalComponent } from '../pipeline-grid/share-view-modal/share-view-modal.component';
import { RegistrationStageEnum } from '../../../app/shared/enums/registration-stage.enum';
import { CurtainState } from '../../shared/enums/curtain-state.enum';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { opportunityType } from '../../shared/enums/opportunityType.enum';
import { TreeNode } from "../../shared/tree/tree.component";

@Component({
  selector: 'app-pipelineNavigationBar',
  templateUrl: './pipeline-navigation-bar.component.html',
  styleUrls: ['./pipeline-navigation-bar.component.scss'],
})

export class PipelineNavigationBarComponent implements OnInit, OnDestroy {
  // viewChilds
  @ViewChild('regSearchSpace') regSearchSpace: ElementRef;
  @ViewChild('dp') datepicker: BsDaterangepickerDirective;
  @ViewChild("filterOptionsDropdown") filterOptionsDropdown: ElementRef;

  @Input() estimatedStartDate: any;
  @Input() savedFilters: UserFilter[];
  @Input() selectedFilter;
  @Input() userColumnList;
  @Input() defaultSort;
  @Input() gridApi: GridApi;
  @Input() gridColumnApi: ColumnApi;
  @Input() toggleSearchableDiv: boolean = false;
  @Input() curtainState: CurtainState = CurtainState.Split;

  // outputs
  @Output() onSavedFilterChange = new EventEmitter<any>();
  @Output() getUserFilter = new EventEmitter<any>();
  @Output() onRefreshGrid = new EventEmitter<any>();
  @Output() onRegistrationSelect = new EventEmitter<any>();
  @Output() onGroupToggle = new EventEmitter<any>();
  @Output() onFilterChange = new EventEmitter<any>();
  @Output() onCurtainChange = new EventEmitter<any>();
  @Output() showRegistrationInGrid = new EventEmitter<any>();
  @Output() openFlyoutEmitter = new EventEmitter<any>();
  @Output() setSelectedFilter = new EventEmitter<any>();
  // local variables
  selectedPage = "Active Pipeline";
  isGroupExpand: boolean = true;
  isFilterDropdownOpen = false;
  filterDropdownText: string = "select a option";
  private searchGlobalFilterSubject = new Subject<string>();


  showSearchableDiv: boolean = false;
  registrationMatches: any = []
  archivedRegistrations: any = []
  activeregistration: any = []
  wonregistration: any = []
  opportunityStage: OpportunityStage[] = [];
  bsModalRef: BsModalRef;

  // curtainState: CurtainState = CurtainState.Split;
  isCurtainCollapsed: boolean = false;
  isCurtainExpanded: boolean = false;

  public searchRegValue: string;
  public showArchiveRegistrations = false;
  public selectedOppStage: number[];
  public startDateValue: any = '';

  filterOptions = [
    {
      text: "Active - Upcoming/New Opportunities",
      value: 4,
      checked: true
    },
    {
      text: "Active Pipeline",
      value: 1,
      checked: false
    },
    {
      text: "Won Opportunites",
      value: 2,
      checked: false
    },
    {
      text: "Closed Opportunites",
      value: 3,
      checked: false
    }
  ];
  defaultSelectedOptions = [this.filterOptions[0]];
  selectedFilterOptions = [];

  constructor(private pipelineService: PipelineService, private registrationService: RegistrationService, private modalService: BsModalService,
              private toastr: PegTostrService, private renderer: Renderer2, private globalService: GlobalService, private _coreService: CoreService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.regSearchSpace?.nativeElement.contains(e.target) && e.target['id'] != 'addToPipeline') {
        this.onClearAllFilters()
      }
    });
    this.searchGlobalFilterSubject
      .pipe(
        debounceTime(300), // Wait for 300ms of silence before firing
        switchMap((searchText) => this.registrationService.getRegistrationInfo(searchText))
      )
      .subscribe((reg) => {

        console.log("regInfo", reg)
        this.registrationMatches = [];
        this.archivedRegistrations = [];
        this.activeregistration = [];
        this.wonregistration = [];


        reg.forEach(element => {
          element.submittedBy.searchableName = CommonMethods.getEmployeeName(element.submittedBy)
          if (element.opportunityType == opportunityType.Tracker) {  // unregistered opportunity
            if (element.registrationStage.registrationStageId == RegistrationStageEnum.Interest || element.registrationStage.registrationStageId == RegistrationStageEnum.Commitment) {
              this.activeregistration.push(element);
            } else if (element.registrationStage.registrationStageId == RegistrationStageEnum.WorkStarted || element.registrationStage.registrationStageId == RegistrationStageEnum.WorkCompleted) {
              this.wonregistration.push(element)
            } else if (
              element.registrationStage.registrationStageId == RegistrationStageEnum.Terminated ||
              element.registrationStage.registrationStageId == RegistrationStageEnum.ClosedLost ||
              element.registrationStage.registrationStageId == RegistrationStageEnum.ClosedDropped ||
              element.registrationStage.registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown
            ) {
              this.archivedRegistrations.push(element);
            }
          } else {
            if (element.registrationStage.registrationStageId == RegistrationStageEnum.Interest || element.registrationStage.registrationStageId == RegistrationStageEnum.Commitment) {
              this.activeregistration.push(element);
            }
            else if (element.registrationStage.registrationStageId == RegistrationStageEnum.WorkStarted || element.registrationStage.registrationStageId == RegistrationStageEnum.WorkCompleted) {
              this.wonregistration.push(element)
            }
            else if (CommonMethods.isRegistrationArchived(element.registrationStage.registrationStageId, element.registrationStatus?.registrationStatusId, element.statusUpdateDate)) {
              {
                this.archivedRegistrations.push(element);
              }
            }
          }

        });
        if (this.activeregistration && this.activeregistration.length > 0) {
          this.activeregistration = this.sortOrder(this.activeregistration);
        }
        if (this.wonregistration && this.wonregistration.length > 0) {
          this.wonregistration = this.sortOrder(this.wonregistration);
        }
        if (this.archivedRegistrations && this.archivedRegistrations.length > 0) {
          this.archivedRegistrations = this.sortOrder(this.archivedRegistrations);
        }

      })

  }


ngOnChanges(changes: SimpleChanges): void {
  if (changes.estimatedStartDate) {
  if (changes.estimatedStartDate?.currentValue != changes.estimatedStartDate?.previousValue) {
    this.startDateValue = moment(changes.estimatedStartDate?.currentValue).format('DD-MMM-YYYY');
  }
  if (changes.estimatedStartDate?.currentValue == '') {
    this.startDateValue = '';
  }
}
if (changes.toggleSearchableDiv) {
  this.showSearchableDiv = false
}
if (changes.curtainState && changes.curtainState.currentValue) {
  let state = changes.curtainState.currentValue;

  switch (state) {
    case CurtainState.Expanded:
      this.isCurtainExpanded = true;
      this.isCurtainCollapsed = false;
      break;
    case CurtainState.Collapsed:
      this.isCurtainExpanded = false;
      this.isCurtainCollapsed = true;
      break;
    case CurtainState.Split:
      this.isCurtainExpanded = false;
      this.isCurtainCollapsed = false;
      break;
    default:
      this.isCurtainExpanded = false;
      this.isCurtainCollapsed = false;
  }
}
}

searchGlobalFilter() {
  this.registrationMatches = [];
  this.archivedRegistrations = [];
  this.activeregistration = [];
  this.wonregistration = [];
  this.showArchiveRegistrations = false;

  if (this.searchRegValue && this.searchRegValue.length > 2) {
    this.showSearchableDiv = true;
    this.searchGlobalFilterSubject.next(this.searchRegValue); // Push the input value to the Subject
  }
  else {
    this.showSearchableDiv = false;
  }
}
sortOrder(oppArrayList) {
  let withExpectedDate = oppArrayList.filter(x => x.expectedStartDate != null);
  let withoutExpectedDate = oppArrayList.filter(x => x.expectedStartDate == null);
  let item = [];
  withExpectedDate = withExpectedDate.sort(function (a, b) {
    var a1 = new Date(a.expectedStartDate);
    var b1 = new Date(b.expectedStartDate);
    return b1 < a1 ? -1 : b1 > a1 ? 1 : 0;

  })
  withoutExpectedDate = withoutExpectedDate.sort(function (a, b) {
    var s1 = new Date(a.submissionDate);
    var s2 = new Date(b.submissionDate);
    return s2 < s1 ? -1 : s2 > s1 ? 1 : 0;

  })
  item.push(...withExpectedDate)
  item.push(...withoutExpectedDate)

  return item;

}
addToPipeline(item) {
  item.isPipeline = 1;
  this.onRegistrationSelect.emit(item.registrationId);
}
showRegistration(item) {
  this.showRegistrationInGrid.emit(item?.registrationId)
}

addToPipelineArchive(item) {
  item.isPipeline = 1;
  this.onRegistrationSelect.emit(item.registrationId);
}

  ngOnInit() {
    this.getOpportunityStageMasterData();
    this.toogleDefaultPipelineFilter(this.defaultSelectedOptions);
  }

toggleGroups() {
  this.isGroupExpand = !this.isGroupExpand;
  this.onGroupToggle.emit({ isExpand: this.isGroupExpand })
}

toggleFilterDropdown() {
  this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
}

toogleDefaultPipelineFilter(defaultFilterOptions):void{
  this.onFilterChanged(defaultFilterOptions)
}

onClearAllFilters() {
  this.searchRegValue = undefined;
  this.searchGlobalFilter();
}

// Returns true if the currently selected filter differs from the current filter model
hasUnsavedFilterChanges() {
  if (this.selectedFilter == undefined) {
    return false;
  }

  if (
    this.userColumnList.length > 0 &&
    JSON.stringify(this.userColumnList) != JSON.stringify(this.selectedFilter.roleColumn)
  ) {
    return true;
  }
  if (
    this.selectedFilter.filterTemplateValue != JSON.stringify(this.gridApi.getFilterModel()) ||
    this.selectedFilter.sortTemplateValue != JSON.stringify(this.gridColumnApi.getColumnState()) ||
    this.selectedFilter.groupingTemplateValue != this.getGroupedRowsAsJSON()
  ) {
    return true;
  } else {
    return false;
  }
}

saveChanges(filter) {
  if (filter) {
    this.updateFilters(filter.filterTemplateName, filter.filterTemplateId, filter.isDefault, '');
  }
}

// Delete the filter
deleteFilter(filter) {
  // Show the validation that this filter is shared and might impact other users
  const initialState = {
    data: "This action will delete the shared filters. Would you like to continue?",
    title: "Confirmation"
  };
  this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
    initialState,
    backdrop: "static",
    keyboard: false
  });
  this.bsModalRef.content.closeBtnName = "Close";
  this.bsModalRef.content.event.subscribe((a) => {
    if (a == "reset") {
      let filterDetails: UserFilter = new UserFilter();
      filterDetails.filterTemplateId = filter.filterTemplateId;
      filterDetails.filterTemplateName = "";
      filterDetails.filterTemplateValue = JSON.stringify(this.gridApi.getFilterModel());
      filterDetails.sortTemplateValue = JSON.stringify(this.gridColumnApi.getColumnState());
      filterDetails.createdBy = this._coreService.loggedInUser.employeeCode;
      filterDetails.isDelete = true;
      this.pipelineService.upsertUserFilter(filterDetails).subscribe((res) => {
        this.gridApi.setFilterModel(null);
        this.gridColumnApi.applyColumnState(JSON.parse(this.defaultSort));
        this.selectedFilter = undefined;
        this.getUserFilter.emit();
      });
    } else {
      this.getUserFilter.emit();
    }
  });
}


// Opens the share view modal window and subscribes to an event which is called when the form is submitted
openShareViewModal(event) {
  let initialState = {
    data: null
  };
  if (this.selectedFilter) {
    initialState.data = this.selectedFilter.filterTemplateId;
  }
  this.bsModalRef = this.modalService.show(ShareViewModalComponent, {
    initialState,
    backdrop: "static",
    keyboard: false
  });
  this.bsModalRef.content.event.subscribe((a) => {
    if (a.event == "share") {
      // Filter sharing setting is received here, insert service calls to write to backend
      let empCodes = "";
      if (a.selectedUser && a.selectedUser.length > 0) {
        empCodes = a.selectedUser.map((r) => r.employeeCode).join(",");
      }
      this.pipelineService
        .shareFilter(this.selectedFilter.filterTemplateId, empCodes, a.shareSetting)
        .subscribe((res) => {
          this.toastr.showSuccess("Filter shared successfully", "Success");
        });
    }
  });
}

clearSelectedFilter(event) {
  this.gridApi.setFilterModel(null);
  this.gridColumnApi.applyColumnState(JSON.parse(this.defaultSort));
  this.selectedFilter = undefined;
  this.setSelectedFilter.emit({ 'selectedFilter': this.selectedFilter });
}


// Opens the save filter modal window and subscribes to an event which is called when the form is submitted
openSaveFilterModal(event) {
  const initialState = {
    data: event?.filterTemplateName,
    id: event?.filterTemplateId,
    isDefault: event?.isDefault
  };
  this.bsModalRef = this.modalService.show(SaveFilterModalComponent, { initialState });
  this.bsModalRef.content.event.subscribe((a) => {
    if (a.event == "save") {
      // Filter name is received here, insert service calls to write to backend
      this.updateFilters(a.filterName, a.filterId, a.isDefault, a.event);
    }
  });
}

// Update the filter model data
updateFilters(filterName: string, filterId: number, isDefault: boolean, eventName: string) {

  let filterDetails: UserFilter = new UserFilter();
  filterDetails.filterTemplateId = filterId;
  filterDetails.filterTemplateName = filterName;
  filterDetails.isDefault = isDefault;
  filterDetails.filterTemplateValue = JSON.stringify(this.gridApi.getFilterModel());
  filterDetails.sortTemplateValue = JSON.stringify(this.gridColumnApi.getColumnState());
  filterDetails.groupingTemplateValue = this.getGroupedRowsAsJSON()
  filterDetails.createdBy = this._coreService.loggedInUser.employeeCode;
  filterDetails.filterUserColumn = this.userColumnList;

  this.selectedFilter = filterDetails;
  this.pipelineService.upsertUserFilter(filterDetails).subscribe((res) => {
    this.userColumnList = [];
    this.getUserFilter.emit();
    if (eventName = "save") {
      this.setSelectedFilter.emit({ 'selectedFilter': this.selectedFilter });
    }
    if (res && res > 0 && this.selectedFilter) {
      this.selectedFilter.filterTemplateId = res;
    }
    this.toastr.showSuccess("Filter " + filterName + " saved successfully", "Success");
  });
}

// Triggers the events on pipeline grid on change of filters
// Update/insert the user filters based on employee
upsertUserFilter() {
  let userFilter = new UserFilter();
  userFilter.filterTemplateName = "oppStage";
  userFilter.filterTemplateValue = this.selectedOppStage.join(',');
  this.pipelineService.upsertUserFilter(userFilter).subscribe(() => {
    this.toastr.showSuccess("Filter have been saved", "Success");
  });
}

// Return a JSON format string of the array of grouped columns for filter template saving
getGroupedRowsAsJSON() {
  // Get currently grouped columns
  let cols: any[] = this.gridApi.getColumnDefs();
  let currentRowGroups = [];

  if (cols) {
    cols.filter(col => col.rowGroup == true).forEach(col => {
      currentRowGroups.push(col.colId);
    });
  }

  return JSON.stringify(currentRowGroups);
}

// Get the master data of opp stage to fill the dropdown and set predefined filters
getOpportunityStageMasterData() {
  this.globalService.getOpportunityStage().subscribe(res => {
    this.opportunityStage = res;
  })
}

// Set the filter dropdown filter values as text in the dropdown
setOppStageFiltersOnLoad() {
  let oppStageFilter: any = document.getElementById('selectedOppStage');
  let appendedOppName = '';
  this.globalService.getOpportunityStage().subscribe(res => {
    this.opportunityStage = res;
    for (let index = 0; index < oppStageFilter.length; index++) {
      this.selectedOppStage.forEach(element => {
        let oppStageName = this.opportunityStage.find(a => a.opportunityStageId == element)
        if (oppStageName) {
          if (oppStageFilter[index].innerHTML == oppStageName.opportunityStageName) {
            appendedOppName += oppStageName.opportunityStageName + ', '
          }
        }
      });
    }
    if (appendedOppName && appendedOppName != '') {
      appendedOppName = appendedOppName.replace(/,\s*$/, "");
      document.getElementsByClassName('filter-option-inner-inner')[0].innerHTML = appendedOppName;
    }
  })
}

  onFilterChanged(selectedNodes: TreeNode[]) {
    this.selectedFilterOptions = selectedNodes;
    const selectedValues = selectedNodes.map(node => node.value);
    this.onFilterChange.emit(selectedValues);
    this.updateDropdownText()
    
  }
  onCurtainExpand() {
    this.isCurtainExpanded = !this.isCurtainExpanded;
    this.isCurtainCollapsed = false;

    this.curtainState = this.isCurtainExpanded ? CurtainState.Expanded : CurtainState.Split;

    this.onCurtainChange.emit(this.curtainState);
  }

  onCurtainCollapse() {
    this.isCurtainCollapsed = true;
    this.isCurtainExpanded = false;
    this.curtainState = CurtainState.Collapsed;

    this.onCurtainChange.emit(this.curtainState);
  }

  handleOpenFlyout(event) {
    this.openFlyoutEmitter.emit(event);
  }

  updateDropdownText() {
    const selectedCount = this.selectedFilterOptions.length;

    switch (selectedCount) {
      case 0:
        this.filterDropdownText = 'Select an option';
        break;
      case 1:
        this.filterDropdownText = this.selectedFilterOptions[0].text ?? 'Select an option';
        break;
      case 2:
        this.filterDropdownText = '2 options selected';
        break;
      case 3:
        this.filterDropdownText = '3 options selected';
        break;
      case 4:
        this.filterDropdownText = 'All';
        break;
      default:
        this.filterDropdownText = 'Select an option';
    }
  }
  @HostListener("document:click", ["$event"])
  clickOutside(event: Event) {
    if (!this.filterOptionsDropdown?.nativeElement.contains(event.target)) {
        this.isFilterDropdownOpen = false;
        
    }
  }

  ngOnDestroy(): void {
  this.searchGlobalFilterSubject.unsubscribe();
  }
}
