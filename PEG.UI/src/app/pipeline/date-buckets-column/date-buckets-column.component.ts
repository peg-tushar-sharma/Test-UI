import { Component, ElementRef, EmbeddedViewRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import * as moment from "moment";
import { BehaviorSubject, Observable, Subject, firstValueFrom, of } from "rxjs";
import { debounceTime, filter, first, map, shareReplay, switchMap, tap } from "rxjs/operators";
import { PipelineBucket } from "../pipelineBucket";
import { CommonMethods } from "../../shared/common/common-methods";
import { PipelineService } from "../pipeline.service";
import { OpportunityStage, Pipeline } from "../pipeline";
import { GlobalService } from "../../global/global.service";
import { BucketGroup } from "../bucketGroup";
import { Opportunity_Stage } from "../../shared/enums/opportunity-stage";
import { BucketRowType } from "../../shared/enums/bucket-row-type";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { PipelineNoteComponent } from "./pipeline-note/pipeline-note.component";
import { DeleteLevel } from "../../shared/enums/delete-type";
import { CoreService } from "../../core/core.service";
import { PipelineBucketMapping } from "../pipelineBucketMapping";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { PegTostrService } from "../../core/peg-tostr.service";
import { CaseEditorPopUpComponent } from "./case-editor-pop-up/case-editor-pop-up.component";
import { Manager } from "../manager";
import { UserPreference } from "../userPreference";
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { Region } from "../../shared/enums/region";
import { dealMBStatus } from "../../shared/enums/deal-mbStatus.enum";
import { RegistrationStageEnum } from "../../shared/enums/registration-stage.enum";
import { BucketColumnPreference } from "../bucket-column-preference";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ConflictPopupComponent } from "../../shared/conflict-popup/conflict-popup.component";
import { GENERAL_CONSULTANTS_CODE, GENERAL_CONSULTANTS_LEVELGRADE } from "../../shared/common/constants";
import { FilterType } from "../../shared/enums/FilterType";
import { RoleType } from "../../shared/enums/role-type.enum";
import { OpsLikelihood } from "../../shared/interfaces/opsLikelihood";
import { OpsLikelihoodEnum } from "../../shared/enums/OpsLikelihood.enum";
import { GridColumn } from "../../shared/interfaces/grid-column.interface";
import { Client } from "../../shared/interfaces/client";
import { opportunityPosition } from "../opportunityPosition";
import { promise } from "protractor";
import { isFirstDayOfWeek } from "ngx-bootstrap/chronos";
import { RefreshPopupComponent } from "../../shared/refresh-popup/refresh-popup.component";

@Component({
  selector: "app-date-buckets-column",
  templateUrl: "./date-buckets-column.component.html",
  styleUrls: ["./date-buckets-column.component.scss"]
})
export class DateBucketsColumnComponent implements OnInit, OnChanges {
  @Input()
  weekNumber: number;
  @Input()
  weekOffset: any;
  @Input()
  bucketData: PipelineBucket[] = [];

  @Input()
  bucketWidth: number;

  @Input()
  data: any;
  @Input()
  groupData: BucketGroup[] = [];

  @Input()
  userPreference: any; // Contains boolean value of if user preferences have been updated from another component

  @Input()
  draggingBucketGroup: Boolean;

  @Input()
  addingNewGroup: Boolean;

  @Input()
  oppToBeAssigned: any;

  @Input()
  bucketNumber: number;

  @Input()
  defaultColumnValueInput: BucketColumnPreference[];

  @Input()
  isCurtainCollapsed: Boolean;

  @Input()
  opsLikelihood: OpsLikelihood[];

  @Input()
  rowData: any[];

  @Input()
  oppNameFields: GridColumn[] = [];


  @Output()
  public userPreferenceUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public outOpportunityMove: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public updateWeeklyBucketData: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public saveNotes: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public setOpsLikelihood: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public setBucketWidth: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public outSendEmail: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public redrawRows: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public bucketGroupDragUpdate: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public updateAddingNewGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public propogateGroupData: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public propogateBucketData: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public updateSelectedOpportunitesFlags: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  saveCaseCode: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  outOnMergeSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public assignOppFromGrid: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public emitStoreData: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public updatePartnerEditFlags: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public getPipelineBucket: EventEmitter<any> = new EventEmitter<any>();


  @Output()
  public deleteWeeklyBucketGroupData: EventEmitter<any> = new EventEmitter<any>();

  bucketSortModal = "date";
  bucketSortOrder = { date: true, name: false, office: false };
  bucketRowType = BucketRowType;
  details = [];
  currentWeekMonday: string = "";
  location = [];
  manager = [];
  employeeLoad = false;
  employees: any[] = [];
  employeeTypeAhead = new Subject<string>();
  isShow = false;
  buckets = [];
  bucketGroup: BucketGroup[] = [];
  bucketCount: number = 0;
  weeklyBucket: PipelineBucket[] = [];
  conflictsData: any = [];
  region: any[] = [];
  public weekStartDate: Date;
  public weekStartDateLabel: string;
  currentBucketGroupId: number = 1;
  opportunityStage: OpportunityStage[] = [];
  bsModalRef: BsModalRef;
  selectedDate: any;
  currentSortByValue = 'date';
  opsLikelihoodBucketStatus: OpsLikelihood[];
  dragDropAccess = [];
  bucketGroupDragDropAccess = [];
  mappingDragDropAccess = [];
  draggingGroupInThisBucket: boolean = false;
  regionFilter: any;
  currentPipelineBucketInputId: number = -1;
  setNumberOfColumns: number = 1;
  columnsArray: number[] = [0, 1, 2, 3];
  groupsByColumn: BucketGroup[][] = [];
  setColumnsClass: string = "";
  userPreferenceSettings: UserPreference = new UserPreference();
  dragOriginGroupId: number = 0;
  bucketGroupDragPosition: string = '';
  bucketGroupDropIndex: number = -1;
  mergeModalRef?: BsModalRef;
  staffingUrl: any;
  conflictedOffice: any;
  activeOffice: any;
  priorOffice: any;

  defaultColumnView: number;
  showLoader: any = false;
  selectedItem: any;
  columnViewOptions = [
    { label: "1 Column", value: 1 },
    { label: "2 Columns", value: 2 },
    { label: "3 Columns", value: 3 },
    { label: "4 Columns", value: 4 }
  ];

  filterByCaseStartDate: boolean = false;

  maxColumnHeight: number = 100000;
  bucketContextMenuData: any = undefined;
  @ViewChild('selectemployeeTypeahead') selectemployeeTypeahead: NgSelectComponent;

  // Levels of Impact
  levelsOfImpact: any[];
  clientId: any

  constructor(
    private pipelineService: PipelineService,
    private coreService: CoreService,
    private globalService: GlobalService,
    private modalService: BsModalService,
    private toastr: PegTostrService
  ) {
    this.employeeTypeAhead
      .pipe(
        tap(() => {
          this.employeeLoad = true;
          this.employees = [];
        }),
        debounceTime(400),
        switchMap((term) =>
          this.pipelineService.getEmployeeLocationByName(
            term,
            GENERAL_CONSULTANTS_CODE,
            GENERAL_CONSULTANTS_LEVELGRADE,
            true,
            false,
            moment(this.weekStartDate).format("DD-MMM-YYYY").toString()
          )
        ),
        tap(() => (this.employeeLoad = false))
      )
      .subscribe((items) => {
        items.sort(function (x, y) {
          return x.groupOrder - y.groupOrder;
        });
        this.employees = items;
      });
    this.pipelineService.regionFilterChange.subscribe(
      (data) => {
        this.regionFilter = data;
      },
      () => { },
      () => {
        this.pipelineService.regionFilterChange.unsubscribe();
      }
    );

    for (let i = 0; i < this.columnsArray.length; i++) {
      this.groupsByColumn.push([]);
    }

  }
  openContextMenu(event: MouseEvent, contextData: any): void {
    event.preventDefault();
    this.bucketContextMenuData = undefined;
    if (contextData.pipeline && contextData.pipeline.oppName?.trim() != "") {
      this.bucketContextMenuData = contextData;
    } else {

    }
  }
  groupDragStarted() {
    this.bucketGroupDragUpdate.emit(true);
  }

  groupDragEnded() {
    this.bucketGroupDragUpdate.emit(false);
  }

  groupDrop(event: CdkDragDrop<string[]>) {

    let bucket: BucketGroup = this.groupData.find(g => g.bucketGroupId == event.item.data.bucketGroupId);
    let group = JSON.parse(JSON.stringify(bucket));
    let columnPosition = parseInt(event.container.element.nativeElement.getAttribute("columnNumber"));

    if (event.container != event.previousContainer) {
      // event.previousIndex is inaccurate, obtain index by matching event data
      let previousIndex = event.previousContainer.data.findIndex(x => x == event.item.data);
      group.sortOrder = event.currentIndex;
      group.columnPosition = columnPosition;
      group.weekStartDate = event.container.element.nativeElement.getAttribute("weekStartDate");

      transferArrayItem(event.previousContainer.data, event.container.data, previousIndex, event.currentIndex);

      // Upsert bucket values
      this.pipelineService
        .upsertPipelineGroup(group, this.weekOffset, this.mapRegionToIds())
        .subscribe((response) => {
          if (response.bucketGroups) {
            this.emitStoreData.emit({ bucketGroup: group, eventname: "draGroup" });
            this.bucketGroup.forEach((element) => {
              if (element?.isEditable) {
                element.isEditable = false;
              }
            });

            this.propogateGroupData.emit(response.bucketGroups);
          }

          if (response.pipelineBuckets) {
            this.propogateBucketData.emit(response.pipelineBuckets);
          }

          this.groupData = response.bucketGroups;
          this.mapPipelineBucketDataForDisplay();
          this.updateBucketGroupSortOrder(group.columnPosition);
        });
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.emitStoreData.emit({ bucketGroup: group, eventname: "draGroup" });
      this.updateBucketGroupSortOrder(columnPosition);
    }
  }

  onGroupHeaderDoubleClick(event, bucket) {
    if (event?.target?.type == "text" || event?.target?.type == "submit" || event?.target?.type == "button") {
      return false;
    }


    let group: any = this.groupData.filter((a) => { a.bucketGroupId == bucket.bucketGroupId });
    group.isSelectedForMerge = !group.isSelectedForMerge;
    bucket.isSelectedForMerge = group.isSelectedForMerge;
  }

  onMergeClick(item) {
    let selectedBucketGroups = this.groupData.filter((a) => a.isSelectedForMerge && a.bucketGroupId != item.bucketGroupId);
    console.log(selectedBucketGroups);
    if (selectedBucketGroups && selectedBucketGroups.length > 0) {


      let selectedBucketGroupName = selectedBucketGroups.map(x => x.bucketGroupName).join(', ')
      const initialState = {
        data: 'This action will merge group(s) ' + selectedBucketGroupName + ' to ' + item.bucketGroupName + ', would you like to continue?',
        title: "Confirmation"
      };

      this.mergeModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState,
        class: "modal-dialog-centered",
        backdrop: "static",
        keyboard: false,
        animated: true
      });
      this.mergeModalRef.content.event.subscribe((a) => {
        if (a == "reset") {
          let sourceGroupID = selectedBucketGroups.map(x => x.bucketGroupId);
          this.pipelineService.mergeGroups(sourceGroupID, item.bucketGroupId).subscribe(res => {
            if (res) {
              this.outOnMergeSuccess.emit();
              this.bucketGroup.forEach((a) => a.isSelectedForMerge = false)
            }

          })

        } else if (a == "revert") {
          this.mergeModalRef.hide();
        }
      });
    } else {
      this.toastr.showWarning("Please select at least two groups to merge", "Select more groups")
    }
  }

  getConflictIconColor(pipeline) {
    if (pipeline?.mbStatus?.mbStatusId == dealMBStatus.ActiveMB) {
      return "red-color";
    } else if (pipeline?.mbStatus?.mbStatusId == dealMBStatus.PotentialMB) {
      return "blue-color";
    }
    else {
      return "gray-color";
    }
  }

  createDragDropAccessList() {
    //create access list   
    this.groupsByColumn.forEach((column) => {
      column.forEach((res) => {
        if (
          !this.pipelineService.dragDropAccess.some(
            (x) => x == "bucket" + this.weekNumber + "Group" + res.bucketGroupId
          )
        ) {
          this.pipelineService.dragDropAccess.push("bucket" + this.weekNumber + "Group" + res.bucketGroupId);
        }
        if (
          !this.pipelineService.dragDropAccess.some(
            (x) => x == "placeholderWeek" + this.weekNumber + "bucket" + res.bucketGroupId
          )
        ) {
          this.pipelineService.dragDropAccess.push(
            "placeholderWeek" + this.weekNumber + "bucket" + res.bucketGroupId
          );
        }
      });
    });

    for (let i = -1; i < 4; i++) {
      for (let n = -1; n < 4; n++) {
        if (!this.pipelineService.bucketGroupDragDropAccess.some((x) => x == "bucketListWeek" + i + "Column" + n)) {
          this.pipelineService.bucketGroupDragDropAccess.push("bucketListWeek" + i + "Column" + n);
        }
      }
    }

    this.bucketData.forEach((item) => {
      if (!this.pipelineService.mappingDragDropAccess.some((x) => x == "placeholderUnit" + item.pipelineBucketId)) {
        this.pipelineService.mappingDragDropAccess.push("placeholderUnit" + item.pipelineBucketId);
      }
    });

    this.dragDropAccess = this.pipelineService.dragDropAccess;
    this.bucketGroupDragDropAccess = this.pipelineService.bucketGroupDragDropAccess;
    this.mappingDragDropAccess = this.pipelineService.mappingDragDropAccess;
  }

  ngOnInit() {

    this.weekStartDate = moment().add(this.weekNumber, "week").weekday(0).toDate();
    this.weekStartDateLabel = moment(this.weekStartDate).format("DD-MMM-YYYY");
    this.currentWeekMonday = moment(this.weekStartDate).add(1, "days").format("MMM DD");
    this.mapBucketGroup();
    this.getRegionData();
    this.getOpportunityStageMasterData();
    this.staffingUrl = this.coreService?.appSettings?.staffingBasePath + '/overlay?oldCaseCode=';
  }

  onHidden(item) {
    if (this.selectedDate && item.availableDate) {
      let currentBucketRow: PipelineBucket[] = this.weeklyBucket.filter(
        (data) => data.tmpPipelineBucketId == item.tmpPipelineBucketId
      );

      if (currentBucketRow && currentBucketRow.length > 0) {
        let upsertPipelineBucket = JSON.parse(JSON.stringify(currentBucketRow[0]));
        upsertPipelineBucket.availableDate = moment(item.availableDate).format("YYYY-MM-DD");
        this.updateWeeklyBucket(upsertPipelineBucket);
      }
    }
  }

  onDateChanged(event) {
    if (event != undefined && event != null && event != "Invalid Date") {
      this.selectedDate = event;
    }
  }

  mapBucketGroup() {
    this.bucketGroup.forEach((element) => {
      let buckets = this.weeklyBucket.filter((bucket) => bucket.bucketGroupId == element.bucketGroupId);
      buckets.forEach((bucket) => {
        bucket.weekStartDate = moment(element.weekStartDate).toDate();
      });
    });

    this.createDragDropAccessList();
  }

  getRegionData() {
    this.pipelineService.getUserPreferenceRegion().subscribe((res) => {
      this.region = res;
    });
  }

  getOpportunityStageMasterData() {
    this.globalService?.getOpportunityStage().subscribe((res) => {
      this.opportunityStage = res;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.weekNumber && this.defaultColumnValueInput) {
      this.defaultColumnView = this.defaultColumnValueInput.find(e => e.weekNumber == this.weekNumber)?.columnValue;
      this.resetColumnNumber();
      this.ngOnInit();
    }

    if (changes.defaultColumnValueInput && changes.defaultColumnValueInput.currentValue && changes.defaultColumnValueInput.currentValue.length > 0) {
      let CurrentColumnValue = changes.defaultColumnValueInput.currentValue.find(e => e.weekNumber == this.weekNumber);
      this.defaultColumnView = CurrentColumnValue?.columnValue;
      this.resetColumnNumber();
    }

    if (changes.weekNumber) {

      this.bucketGroup = [];
      this.weeklyBucket = [];
      this.groupsByColumn = [[], [], [], []];
      this.mapBucketGroup();
      this.mapPipelineBucketDataForDisplay();

      if (this.weekNumber == 0) {
        this.filterByCaseStartDate = true;
      } else {
        this.filterByCaseStartDate = false;
      }
    }

    if (changes.bucketData && changes.bucketData.currentValue && changes.bucketData.currentValue.length > 0) {
      this.dragOriginGroupId = 0;

      this.weeklyBucket = changes.bucketData.currentValue;
      this.weeklyBucket.forEach((element) => {
        element.tmpPipelineBucketId = element.pipelineBucketId.toString();
      });

      this.mapPipelineBucketDataForDisplay();

    } else if (
      changes.weeklyBucket &&
      changes.weeklyBucket.currentValue &&
      changes.weeklyBucket.currentValue.length == 0
    ) {
      this.weeklyBucket = [];
    }


    if (changes?.groupData) {
      this.mapPipelineBucketDataForDisplay();
    }

    if (changes?.bucketData || changes?.groupData) {
      let self = this;
      setTimeout(function () {
        self.bucketCount = self.getBucketCount(self.weeklyBucket);
        self.createDragDropAccessList();
      }, 500);

    }

this.dropOppFromGrid(changes)
    // // This method is used to handle drag and drop
    
   
    if (changes?.userPreference?.currentValue?.preference) {
      this.mapBucketGroup();
      this.getRegionData();
    }
    this.sortWeeklyBucket(this.bucketSortModal);
  }
 async dropOppFromGrid(changes:any)
 {
  if (changes.data && changes.data.currentValue && changes.data.currentValue.weekNumber == this.weekNumber) {
    // This method runs when an opportunity or registration is droped on new row placeholder
    if (changes.data.currentValue?.newRow) {
          this.pipelineService.getOpportunityPositionSynch(changes.data.currentValue.pipelineData.registrationId).subscribe((response)=>{
   
        if (response && response.pipelineBucketId > 0 ) {
          
          this.openRefreshPopup();
          this.UpdateStage(changes)
      }

      else{
      let pipelineBucket = new PipelineBucket();
      let pipelineBucketMapping = new PipelineBucketMapping();
      pipelineBucket.pipelineBucketMapping = [];
      pipelineBucket.pipelineBucketMapping.push(pipelineBucketMapping);
      pipelineBucket.tmpPipelineBucketId = CommonMethods.getGUID();
      pipelineBucket.pipelineBucketId = 0;
      pipelineBucket.rowType = undefined;
      pipelineBucket.office = { officeAbbr: "", officeCluster: "", officeCode: undefined, officeName: "", officeClusterCode: 0 };
      pipelineBucket.bucketGroupId = changes.data.currentValue.bucketGroupId;
      pipelineBucket.weekStartDate = this.weekStartDate;
      pipelineBucket.weekStartDateLabel = this.weekStartDateLabel;
      pipelineBucket.pipelineBucketMapping[0].pipeline = changes.data.currentValue.pipelineData;
      pipelineBucket.pipelineBucketMapping[0].pipelineBucketId = pipelineBucket.tmpPipelineBucketId;

      this.updateOpportunityStage(pipelineBucket.pipelineBucketMapping[0].pipeline);
      this.updateWeeklyBucket(pipelineBucket);
      // open the dragged bucket
      let bucketHtmlId =
        "week" + changes.data.currentValue.weekNumber + "bucket" + changes.data.currentValue.bucketGroupId;
      document.getElementById(bucketHtmlId)?.classList.add("show");
      let expandBucket = document.querySelector("[data-target='#" + bucketHtmlId + "']");
      expandBucket?.setAttribute("aria-expanded", "true");
      }
      })
      
    }
    // this method runs when  opportunity or registration is droped on already created row
    else if (changes.data.currentValue?.newRow == false) {
     
      if(changes.data.currentValue?.isFromContextMenu==false)
    {
      this.pipelineService.getOpportunityPosition(changes.data.currentValue.pipelineData.registrationId)
    }

    let opportunityPosition = await firstValueFrom(
      this.pipelineService.pipelinePosition$.pipe(filter((value) => value !== null)) // Wait until value is not null
      );
    this.pipelineService.setPipelinePositionToNull();
  
  if (opportunityPosition && opportunityPosition.pipelineBucketId > 0 ) {
    this.openRefreshPopup();
    this.UpdateStage(changes)
    
}
else
{


this.weeklyBucket.forEach((element) => {

  if (element.tmpPipelineBucketId == changes.data.currentValue.rowId) {
    let isConflicted = false;
    let conflictItem = undefined;
    if (element.rowType == BucketRowType.Manager) {
      conflictItem = changes.data.currentValue.pipelineData.conflictedOffice?.find((x) => x.office.officeClusterCode.toString() == element.employee.officeClusterCode.toString())
    } else {
      conflictItem = changes.data.currentValue.pipelineData.conflictedOffice?.find((x) => x.office.officeClusterCode.toString() == element.office.officeClusterCode.toString())
    }
    isConflicted = conflictItem ? true : false;
    if (isConflicted) {
      const initialState = {
        data:
          'Warning: this could be a conflict of interest. Please check the Case Managing Office/Cluster of prior registrations',
        title: "Confirmation"
      };

      this.bsModalRef = this.modalService.show(ConflictPopupComponent, {
        initialState,
        backdrop: "static",
        keyboard: false
      });

      this.bsModalRef.content.event.subscribe((a) => {
        if (a == "proceed") {
          this.addToBucketGroup(changes, element);
        } else if (a == "discard") {
          return;
        }
      });
    }

    if (!isConflicted) {
      // check for conflicts on case managing office and bucket office/person office
      if (CommonMethods.isDateWithinLastYear(changes.data.currentValue?.pipelineData?.submissionDate) == true &&
        changes.data.currentValue?.pipelineData?.dealId != 0 && changes.data.currentValue?.pipelineData?.dealId &&
        (element?.office?.officeCode.toString() != "0" || element?.employee != null)
      ) {
        this.pipelineService.getRelatedTrackerClientsByRegistrationId(changes.data.currentValue?.pipelineData?.registrationId).subscribe(res => {
          // // Remove same client
          if (changes.data.currentValue?.pipelineData?.client?.length > 0) {
            res = res.filter(x => x.clientId !== changes.data.currentValue?.pipelineData?.client[0].clientId)
          }

          let conflictedData = res?.filter(x => (x?.officeClusterCode == element?.office?.officeClusterCode ||
            x?.officeClusterCode == element?.employee?.officeClusterCode) && x?.officeCode != "0");

          let oneYearAgo = moment().subtract(365, 'days');
          if (conflictedData && conflictedData.length > 0) {
            conflictedData = conflictedData.find(x =>
              (x.registrationStageId == RegistrationStageEnum.WorkStarted || x.registrationStageId == RegistrationStageEnum.WorkCompleted)
              &&
              (moment(x.caseEndDate).isAfter(oneYearAgo))  //diffrent client and case end date is within 1 year

            );
          } else {
            conflictedData = null;
          }
          isConflicted = conflictedData ? true : false;
          if (isConflicted) {
            const initialState = {
              data:
                'Warning: this could be a conflict of interest. Please check the Case Managing Office/Cluster of prior registrations',
              title: "Confirmation"
            };

            this.bsModalRef = this.modalService.show(ConflictPopupComponent, {
              initialState,
              backdrop: "static",
              keyboard: false
            });

            this.bsModalRef.content.event.subscribe((a) => {
              if (a == "proceed") {
                this.addToBucketGroup(changes, element);
              } else if (a == "discard") {
                return;
              }
            });
          } else {
            this.addToBucketGroup(changes, element);
          }

        })
      } else {
        this.addToBucketGroup(changes, element);
      }
    }
  }
});

}
    }
  }
 }
 UpdateStage(changes:any)
 {
  changes.data.currentValue.pipelineData.opportunityStage.opportunityStageId=Opportunity_Stage.Mobilizing;
  changes.data.currentValue.pipelineData.opportunityStage.opportunityStageName='Mobilizing';
  changes.data.currentValue.pipelineData.opportunityStage.sortOrder=Opportunity_Stage.Mobilizing;
  this.outOpportunityMove.next(changes.data.currentValue.pipelineData);
 }
  updateOpportunityStage(pipeline: Pipeline) {
    let stage = this.opportunityStage.find((x) => x.opportunityStageId == Opportunity_Stage.Mobilizing);
    pipeline.opportunityStage = stage;
    this.pipelineService.updatePipeline(pipeline, "OppStage", "1,2,3").subscribe((response) => {     
      this.outOpportunityMove.next(response[0]);
    });
  }

  listClientAccess(bucketGroupId) {
    let listaccess = [];
    this.weeklyBucket.forEach((element) => {
      listaccess.push("week" + this.weekNumber + "bucket" + bucketGroupId);
    });

    return listaccess;
  }

  weeklyBucketGroupCount(bucketGroupId) {
    let bucketList = [];
    bucketList = this.filterWeeklyBucket(bucketGroupId, false);
    bucketList = bucketList.filter(
      (x) =>
        (x.office != null && x.office.officeCode != "0") ||
        (x.employee != null && x.employee.employeeCode != "") ||
        x.pipelineBucketMapping?.some((c) => c.registrationId != 0)
    );
    return bucketList.length;
  }

  dragStarted(event, bucketGroupId) {
    this.dragOriginGroupId = bucketGroupId;

    // Reset seleced for all rows
    this.weeklyBucket.forEach((item) => {
      if (item?.pipelineBucketMapping) {
        item.pipelineBucketMapping.forEach((mapping) => {
          if (mapping?.pipeline?.isRowSelected) {
            mapping.pipeline.isRowSelected = false;
            this.redrawRows.emit(mapping.pipeline);
          }
        });
      }
    });

    const eleweekBucketRow = document.getElementsByClassName("weekBucketRow");
    for (let i = 0; i < eleweekBucketRow.length; i++) {
      eleweekBucketRow[i]?.classList.add("show");
      let bucketHtmlId = eleweekBucketRow[i].id;
      let expandBucket = document.querySelector("[data-target='#" + bucketHtmlId + "']");
      expandBucket?.setAttribute("aria-expanded", "true");
    }

    document.querySelector("#capacitySplitArea").classList.add("full-screen");

    // Fail safe to remove full screen mode if cdk drag end event doesn't fire
    document.addEventListener("mouseup", this.openPipelineCurtain, { once: true });
  }

  dragEnded(event, bucketGroupId) {

    this.dragOriginGroupId = 0;
    this.openPipelineCurtain();
  }
  dragOppStarted(event, bucket: PipelineBucket) {
    this.pipelineService.getOpportunityPosition(event.source.data.registrationId)
    let bucketData = JSON.parse(JSON.stringify(bucket));
    this.emitStoreData.emit({ bucketGroup: bucketData, eventname: "dragOpp" });
    document.querySelector("#capacitySplitArea").classList.add("full-screen");

    // Fail safe to remove full screen mode if cdk drag end event doesn't fire
    document.addEventListener("mouseup", this.openPipelineCurtain, { once: true });
  }

  dragOppEnded(event) {
    this.openPipelineCurtain();
  }

  async dropOpp(event: CdkDragDrop<string[]>, bucket: PipelineBucket) {
    let opportunityPosition = await firstValueFrom(
      this.pipelineService.pipelinePosition$.pipe(filter((value) => value !== null)) // Wait until value is not null
    );
    this.pipelineService.setPipelinePositionToNull();
    if (event.item.data.pipelineBucketId == opportunityPosition.pipelineBucketId) {

      if (bucket.employee == null && bucket.office?.officeCode == 0) {
        this.moveOppToBucket(event, bucket)
      }
      else {
        let registrationIds = [event.item?.data?.registrationId];
        let client: any = event.item?.data.pipeline.client;

        let officeClusterCode = (bucket?.employee && bucket.employee.employeeCode.trim() != "") ?
          bucket.employee.officeClusterCode : bucket?.office?.officeClusterCode;

        let conflictItem = undefined;
        let isConflicted = false;

        if (bucket.rowType == BucketRowType.Manager) {
          conflictItem = event.item.data.pipeline.conflictedOffice?.find((x) => x.office.officeClusterCode.toString() == officeClusterCode.toString())

        }
        else {
          conflictItem = event.item.data.pipeline.conflictedOffice?.find((x) => x.office.officeClusterCode.toString() == officeClusterCode.toString())
        }

        isConflicted = conflictItem ? true : false;
        if (isConflicted) {
          if (isConflicted && event.container.id != event.previousContainer.id) {
            this.conflictWarningPopup().then((approved) => {
              if (approved) {
                this.moveOppToBucket(event, bucket);
              }
              else {
                return;
              }
            });
          }
          else {
            this.moveOppToBucket(event, bucket);
          }
        }
        if (!isConflicted) {

          this.checkConflict(registrationIds, officeClusterCode, client).then((isConflicted) => {
            if (isConflicted && event.container.id != event.previousContainer.id) {
              this.conflictWarningPopup().then((approved) => {
                if (approved) {
                  this.moveOppToBucket(event, bucket);
                }
                else {
                  return;
                }
              });
            }
            else {
              this.moveOppToBucket(event, bucket);
            }
          });
        }
      }
    } else {
      if(event.item.data?.registrationId >0)
      {
        this.openRefreshPopup();
      }
     
    }
  }

  openRefreshPopup() {
    const initialState = {
    };
    this.bsModalRef = this.modalService.show(RefreshPopupComponent, {
      initialState,
      backdrop: 'static',
      keyboard: false
    });
    const refreshPopUpSubscription = this.bsModalRef.content.refreshPipelineBucketData.subscribe(() => {
      this.refreshPipelineData();
      refreshPopUpSubscription.unsubscribe();
    });
  }

  refreshPipelineData() {
    this.getPipelineBucket.emit();
  }
 
  //This method will check the conflicts if any of the registrationIds have conflict it will return true
  async checkConflict(registrationIds, officeClusterCode, client) {
    let isConflicted = false;
    let requestArray = [];
    registrationIds.forEach(registrationId => {
      requestArray.push((this.pipelineService.getRelatedTrackerClientsByRegistrationIdPromise(registrationId)));
    });
    let results = await Promise.all(requestArray)

    if (client?.length > 0) {
      const clientIdsToExclude = client.map(c => c.clientId);

      let oneYearAgo = moment().subtract(365, 'days');
      for (let res of results) {
        let conflictedData = res?.filter(x => (x?.officeClusterCode == officeClusterCode) && x?.officeCode != "0");
        if (conflictedData && conflictedData.length > 0) {
          conflictedData = conflictedData.find(x =>
            (x.registrationStageId == RegistrationStageEnum.WorkStarted || x.registrationStageId == RegistrationStageEnum.WorkCompleted)
            &&
            (!clientIdsToExclude.includes(x.clientId) && moment(x.caseEndDate).isAfter(oneYearAgo))  //diffrent client and case end date is within 1 year
          )
        } else {
          conflictedData = null;
        }
        isConflicted = conflictedData ? true : false;
        if (isConflicted) {
          break;
        }
      }
    }
    return isConflicted;
  }

  conflictWarningPopup(): Promise<boolean> {

    return new Promise((resolve) => {
      const initialState = {
        data:
          'Warning: this could be a conflict of interest. Please check the Case Managing Office/Cluster of prior registrations',
        title: "Confirmation"
      };

      this.bsModalRef = this.modalService.show(ConflictPopupComponent, {
        initialState,
        backdrop: "static",
        keyboard: false
      });

      this.bsModalRef.content.event.subscribe((a) => {
        if (a == 'proceed') {
          resolve(true);
        }
        else {
          resolve(false);
        }
      });

    });
  }

  moveOppToBucket(event, bucket: PipelineBucket) {

    if (event.previousContainer == event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // event.previousIndex is inaccurate, obtain index by matching event data
      let previousIndex = event.previousContainer.data.findIndex(x => x == event.item.data);
      transferArrayItem(event.previousContainer.data, event.container.data, previousIndex, event.currentIndex);
    }

    // Obtain bucket and mapping objects from event data
    bucket.pipelineBucketMappingId = event.item.data.pipelineBucketMappingId;
    bucket.registrationId = event.item.data.registrationId;
    bucket.pipelineBucketMappingSortOrder = event.currentIndex;

    // Remove blank placeholders from the bucket before saving
    bucket.pipelineBucketMapping = bucket.pipelineBucketMapping.filter(m => m.registrationId !== 0);
    this.sortPipelineBucketMapping(bucket);

    this.updateWeeklyBucket(bucket, true);
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dragOriginGroupId = 0;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      let bucketData = JSON.parse(JSON.stringify(event.item.data));
      bucketData.isDragged = true;
      this.emitStoreData.emit({ bucketGroup: bucketData, eventname: "dragOppRow" });

      let tempExpertData = JSON.parse(JSON.stringify(event.item.data));
      let ele = document.getElementById(event.container.element.nativeElement.id);
      let attribute = ele.getAttribute("bucketvalue");
      let attributePipelineBucketGroupId = ele.getAttribute("pipelineBucketGroupId");
      tempExpertData.bucketGroupId = Number.parseInt(attribute);
      if (attributePipelineBucketGroupId == null) {
        attributePipelineBucketGroupId = "0";
      }
      tempExpertData.weekStartDateLabel = this.weekStartDateLabel;
      tempExpertData.pipelineBucketGroupId = Number.parseInt(attributePipelineBucketGroupId);

      tempExpertData.isDragged = true;

      let bucket = this.weeklyBucket.find(b => b.pipelineBucketId == event.item.data.pipelineBucketId);

      bucket.weekStartDate = this.weekStartDate;
      bucket.bucketGroupId = Number.parseInt(attributePipelineBucketGroupId);

      this.propogateBucketData.emit(this.weeklyBucket);

      this.updateWeeklyBucket(tempExpertData);
    }
  }

  sortPipelineBucketMapping(bucket) {
    // Sort mapping objects by ops likelihood
    bucket.pipelineBucketMapping.sort((a, b) => {
      let sortOrderA = this.opsLikelihood.find(x => x.opsLikelihoodId == a.pipeline?.opsLikelihood?.opsLikelihoodId)?.sortOrder;
      let sortOrderB = this.opsLikelihood.find(x => x.opsLikelihoodId == b.pipeline?.opsLikelihood?.opsLikelihoodId)?.sortOrder;

      if (sortOrderA == undefined) {
        sortOrderA = 9999;
      }

      if (sortOrderB == undefined) {
        sortOrderB = 9999;
      }

      if (sortOrderA != sortOrderB) {
        return sortOrderA > sortOrderB ? 1 : -1;
      } else {
        return a.registrationId > b.registrationId ? 1 : -1;
      }
    });
  }

  unduBucketGroupDrop(data: any) {
    this.draggingGroupInThisBucket = true;
    this.bucketGroupDragPosition = '';
    this.bucketGroupDropIndex = -1;

    this.bucketGroupDragUpdate.emit(true);
    let groups: BucketGroup[] = this.bucketGroup;
    let bucket: BucketGroup = data;

    this.pipelineService
      .upsertPipelineGroup(bucket, this.weekOffset, this.mapRegionToIds())

      .subscribe((response) => {
        if (response.bucketGroups) {
          this.bucketGroup = response.bucketGroups;
          this.propogateGroupData.emit(this.bucketGroup);
          this.propogateBucketData.emit(response.pipelineBuckets);
          this.bucketGroup.forEach((element) => {
            element.isEditable = false;
          });


          // Adjust sort order for groups ahead of this one
          groups.filter(group => group.sortOrder >= bucket.sortOrder && group.bucketGroupId != bucket.bucketGroupId).forEach((group) => {
            group.sortOrder++;
          });

          this.updateBucketGroupSortOrder(bucket.columnPosition);

          this.createDragDropAccessList();
        }
      });
  }

  updateBucketGroupSortOrder(columnPosition) {
    let groups = this.groupsByColumn[columnPosition];

    // Update sort order for all buckets in the group
    groups.forEach((group, index) => {
      group.sortOrder = index;
      group.columnPosition = columnPosition;
      group.weekStartDate = moment(this.weekStartDate).format("YYYY-MM-DD");
    });

    this.pipelineService
      .updatePipelineGroupOrder(groups)
      .subscribe((response) => {
        if (!response) {
          this.toastr.showError("Failed to update bucket group position", "Error");
        }
      });
  }

  addBucketPlaceholder(bucket, event) {
    //opening the collapsiable div on adding new placeholder by adding a show class
    document.getElementById(event).classList.add("show");
    let pipelineBucket = new PipelineBucket();
    pipelineBucket.rowType = null;
    pipelineBucket.tmpPipelineBucketId = CommonMethods.getGUID();
    pipelineBucket.pipelineBucketId = 0;
    pipelineBucket.pipelineBucketGroupId = 0;
    pipelineBucket.bucketGroupId = bucket.bucketGroupId;
    pipelineBucket.office = { officeAbbr: "", officeCluster: "", officeCode: undefined, officeName: "", officeClusterCode: 0 };
    pipelineBucket.weekStartDate = this.weekStartDate;
    pipelineBucket.weekStartDateLabel = this.weekStartDateLabel;
    this.updateWeeklyBucket(pipelineBucket);

    //bucket.bucketMapping.unshift(pipelineBucket);

    // Expand the group when new placeholder has beed added
    let bucketHtmlId = "week" + this.weekNumber + "bucket" + bucket.bucketGroupId;
    let expandBucket = document.querySelector("[data-target='#" + bucketHtmlId + "']");
    expandBucket?.setAttribute("aria-expanded", "true");
  }

  assignOppToBucket(event, item) {
    if (!this.oppToBeAssigned) {
      return false;
    }

    this.assignOppFromGrid.emit({ event: event, item: item, weekNumber: this.weekNumber });
  }

  toggleStatus() {
    this.isShow = !this.isShow;
  }

  convertToTypeahead(item: PipelineBucket) {
    // Don't convert to typeahead while assigning an opp from the grid
    if (this.oppToBeAssigned) {
      return false;
    }

    this.employeeLoad = false;
    if (item.employee) {
      this.selectedItem = {
        label: CommonMethods.getEmployeeName(item.employee)
      };
    }
    else {
      this.selectedItem = {
        label: item.office.officeName
      };
    }

    this.toggleEditable(true, item);
    this.employees = [];

    setTimeout(() => {
      this.selectemployeeTypeahead.focus();
      this.selectemployeeTypeahead.open();

    }, 200);
  }
  focusOut() {
    let isEditable = true;
    let previousBucketRow = this.weeklyBucket.filter((data) => data.isEditable == isEditable);
    if (previousBucketRow && previousBucketRow.length > 0) {
      previousBucketRow[0].isEditable = false;
    }
  }
  convertToBucketInput(item: BucketGroup) {
    item.isEditable = true;

    this.currentPipelineBucketInputId = item.bucketGroupId;
  }

  convertToTile(item: PipelineBucket) {
    this.toggleEditable(false, item);
  }

  toggleEditable(isEditable, item) {

    let currentBucketRow = this.weeklyBucket.filter((data) => data.tmpPipelineBucketId == item.tmpPipelineBucketId);
    if (currentBucketRow && currentBucketRow.length > 0) {
      currentBucketRow[0].isEditable = isEditable;
    }
  }

  // Save changes to a bucket group name to user preferences
  saveBucketName(event, item) {
    let bucketName = event.target.value;

    // Validate input
    if (bucketName == null || bucketName == undefined || bucketName == "") {
      return false;
    }

    // If the name is unchanged, close out
    if (bucketName == item.bucketGroupName) {
      item.isEditable = false;
      this.currentPipelineBucketInputId = -1;
      return false;
    }

    // Map item value to input here so each individual input can be validated
    item.bucketGroupName = bucketName;

    // Save to user preferences
    let newGroup: BucketGroup = new BucketGroup();
    newGroup.bucketGroupName = bucketName;
    newGroup.bucketGroupId = item.bucketGroupId;
    newGroup.regionId = this.coreService.loggedInUser.employeeRegionId;
    newGroup.weekStartDate = moment(item.weekStartDate).format("YYYY-MM-DD");
    newGroup.sortOrder = item.sortOrder;
    newGroup.columnPosition = item.columnPosition;
    let regionFilterText = this.mapRegionToIds();
    this.pipelineService.upsertPipelineGroup(newGroup, this.weekOffset, regionFilterText).subscribe((response) => {
      if (response.bucketGroups) {
        this.groupData = response.bucketGroups;

        // Propogate latest data to other date columns
        this.propogateGroupData.emit(response.bucketGroups);
        this.propogateBucketData.emit(response.pipelineBuckets);

        this.bucketGroup.forEach((element) => {
          element.isEditable = false;
        });

        this.createDragDropAccessList();
      }
    });

    item.isEditable = false;
    this.currentPipelineBucketInputId = -1;
  }

  // Highlight new bucket group names on focus

  focusBucketName(event, bucket) {
    event.target.select();
  }

  getFormattedDate(val: any) {
    return moment.utc(val).format("DD-MMM-YYYY");
  }
  getAlertIconClass(status) {
    return CommonMethods.getAlertIconClass(status)
  }
  // Return whether or not a bucket's start date is in the same week of the current week monday
  isSameWeekStart(bucket) {
    if (this.getFormattedDate(bucket.weekStartDate) == this.weekStartDateLabel) {
      return true;
    } else {
      return false;
    }
  }

  // Add a new bucket group to this weekly bucket
  addBucketGroup() {
    let newGroup: BucketGroup = new BucketGroup();
    newGroup.bucketGroupName = "New Group";
    newGroup.weekStartDate = moment(this.weekStartDate).format("DD-MMM-YYYY");
    newGroup.bucketGroupId = 0;
    newGroup.regionId = this.coreService.loggedInUser.employeeRegionId;
    newGroup.sortOrder = 0;
    newGroup.columnPosition = this.setNumberOfColumns - 1;
    let regionFilterText = this.mapRegionToIds();

    // Store IDs of current bucket groups
    let currentBucketGroupIds = [];
    this.groupData.forEach((element) => {
      if (element && element?.bucketGroupId) currentBucketGroupIds.push(element.bucketGroupId);
    });

    // Preserve bucket column scrolltop
    this.updateAddingNewGroup.emit(true);

    this.pipelineService.upsertPipelineGroup(newGroup, this.weekOffset, regionFilterText).subscribe((response) => {
      if (response.bucketGroups) {
        this.groupData = response.bucketGroups;

        this.groupData.forEach((element) => {
          if (
            element &&
            element?.bucketGroupId &&
            currentBucketGroupIds.indexOf(element?.bucketGroupId) > -1
          ) {
            element.isEditable = false;
          } else {
            newGroup.bucketGroupId = element.bucketGroupId;

            element.isEditable = true;
            element.isNew = true;

            let groupData = JSON.parse(JSON.stringify(element));
            groupData.deleteLevel = DeleteLevel.PipelineGroup;
            this.emitStoreData.emit({ bucketGroup: groupData, eventname: "undoGroup" });

            // The change event triggers when the input is loaded into the DOM. This briefly protects it from running the saveBucketName() function.
            setTimeout(function () {
              element.isNew = false;
            }, 250);
          }
        });

        this.mapPipelineBucketDataForDisplay();
        this.updateBucketGroupSortOrder(newGroup.columnPosition);

        // Propogate latest data to all date columns
        this.propogateBucketData.emit(response.pipelineBuckets);
        this.propogateGroupData.emit(response.bucketGroups);

        this.updateAddingNewGroup.emit(false);
        this.createDragDropAccessList();
      }

    });
  }

  onNotesClick(item, placeholder) {
    if (item) {
      const initialState = {
        data: item,
        title: placeholder,
        levelsOfImpact: this.levelsOfImpact
      };
      this.bsModalRef = this.modalService.show(PipelineNoteComponent, {
        initialState,
        class: "model-notes modal-dialog-centered",
        backdrop: "static",
        keyboard: false
      });

      this.bsModalRef.content.closeBtnName = "Close";
      this.bsModalRef.content.event.subscribe((a) => {
        if (a == "saveNote") {
          this.saveNotes.emit(this.bsModalRef.content);
        }
      });

      this.bsModalRef.content.saveDate.subscribe((a) => {
        if (a == "saveDate") {
          this.onDateChanged(this.bsModalRef.content.availableDate);
          this.onHidden(this.bsModalRef.content.data);
        }
      })
    }
  }

  onBucketChange(data, item) {
    let filteredPipelineObject = undefined;
    if (item.registrationId > 0) {
      filteredPipelineObject = item.pipelineBucketMapping.map(x => x.pipeline?.client[0]);
    }
    let registrationIds = item?.pipelineBucketMapping?.map(x => x.registrationId);
    if (registrationIds?.length > 0) {
      let officeClusterCode = (data?.employee && data.employee.employeeCode.trim() != "") ?
        data.employee.officeClusterCode : data?.office?.officeClusterCode


      let conflictItem = undefined;
      let isConflicted = false;
      item.pipelineBucketMapping.forEach(data => {
        conflictItem = data.pipeline?.conflictedOffice?.find((x) => x.office.officeClusterCode.toString() == officeClusterCode.toString());
        if (conflictItem != undefined) {
          return; // Exit loop when value is 3
        }
      })
      isConflicted = conflictItem ? true : false;

      if (isConflicted) {
        this.conflictWarningPopup().then((approved) => {
          if (approved) {
            this.updateLocationOrManager(data, item);
          } else {
            return;
          }
        });
      }
      if (!isConflicted) {
        this.checkConflict(registrationIds, officeClusterCode, filteredPipelineObject).then((isConflicted) => {
          if (isConflicted) {
            this.conflictWarningPopup().then((approved) => {
              if (approved) {
                this.updateLocationOrManager(data, item);
              } else {
                return;
              }
            });

          }
          else {
            this.updateLocationOrManager(data, item);
          }
        });
      }
    }
    else {
      this.updateLocationOrManager(data, item);
    }
  }

  updateLocationOrManager(data, item) {
    let bucketData = JSON.parse(JSON.stringify(item));

    this.selectedItem = data;
    let currentBucketRow: PipelineBucket[] = this.weeklyBucket.filter(
      (data) => data.tmpPipelineBucketId == item.tmpPipelineBucketId
    );
    if (currentBucketRow && currentBucketRow.length > 0) {
      let upsertPipelineBucket = currentBucketRow[0];
      if (data?.employee && data.employee.employeeCode.trim() != "") {
        upsertPipelineBucket.rowType = BucketRowType.Manager;
        upsertPipelineBucket.employee = data.employee;
        upsertPipelineBucket.office = undefined;
        upsertPipelineBucket.pipelineBucketMapping.forEach((element) => {
          let manager = new Manager();
          manager.employeeCode = data?.employee?.employeeCode;
          manager.firstName = data?.employee?.firstName;
          manager.lastName = data?.employee?.lastName;
          manager.familiarName = data?.employee?.familiarName;
          manager.officeAbbreviation = data?.employee?.officeAbbreviation;
          manager.regionId = data?.employee?.regionId;
          element.pipeline = element.pipeline || new Pipeline();
          element.pipeline.manager = manager;
          element.pipeline.bucketOffice = undefined;
        });
      } else {
        upsertPipelineBucket.rowType = BucketRowType.Location;
        upsertPipelineBucket.office = data.office;
        upsertPipelineBucket.employee = undefined;
        upsertPipelineBucket.pipelineBucketMapping.forEach((element) => {
          if (element && element.pipeline && element.pipeline.manager) {
            element.pipeline.manager = undefined;
          }
          if (element && element.pipeline) {
            element.pipeline.bucketOffice = data?.office;
          }
        });
      }

      this.emitStoreData.emit({ bucketGroup: bucketData, eventname: "managerLocationChange" });
      this.updateWeeklyBucket(upsertPipelineBucket);
    }
  }

  updateWeeklyBucket(weeklyBucket, fromDrag: boolean = false) {

    let currentPlaceholder = weeklyBucket?.pipelineBucketMapping?.filter(
      (mapping) => mapping.pipelineBucketId == weeklyBucket.tmpPipelineBucketId
    );
    if (currentPlaceholder && currentPlaceholder.length > 0 && !fromDrag) {
      weeklyBucket.registrationId = currentPlaceholder[0]?.pipeline
        ? currentPlaceholder[0]?.pipeline.registrationId
        : 0;

      currentPlaceholder[0].pipelineBucketId = 0;

      // If the opp or reg is dropped on blank placeholder it will use the blank placeholder instead of adding new one
      let blankRows = weeklyBucket?.pipelineBucketMapping?.findIndex(
        (i) => i.registrationId == 0
      );

      if (blankRows != -1) {
        weeklyBucket.pipelineBucketMappingId =
          weeklyBucket.pipelineBucketMapping[blankRows].pipelineBucketMappingId;
        weeklyBucket.pipelineBucketMapping[blankRows] = currentPlaceholder[0];
        weeklyBucket.pipelineBucketMapping.pop();
      }
    }

    if (
      (weeklyBucket.employee?.employeeCode == undefined || weeklyBucket.employee?.employeeCode == "") &&
      (weeklyBucket.office == undefined ||
        weeklyBucket.office?.officeCode == "" ||
        weeklyBucket.office?.officeCode == undefined) &&
      weeklyBucket.registrationId == 0
    ) {
      this.weeklyBucket.push(weeklyBucket);
    } else {
      this.updateWeeklyBucketData.emit(weeklyBucket);
    }
    this.sortWeeklyBucket(this.bucketSortModal);
  }

  deleteEmployeeBucket(mapping, item) {
    if (item.pipelineBucketMapping?.length < 2) {
      let currentBucketRow: PipelineBucket[] = this.weeklyBucket.filter(
        (data) => data.pipelineBucketId == item.pipelineBucketId
      );
      if (currentBucketRow && currentBucketRow.length > 0) {
        let deletePipelineBucket = currentBucketRow[0];
        // If opportunity and registration exists in bucket, it will remove the opp/registration first or
        // If only opp exists, whole row will be deleted
        if (
          deletePipelineBucket &&
          deletePipelineBucket.pipelineBucketMapping[0].pipeline &&
          (deletePipelineBucket.registrationId > 0)
        ) {
          deletePipelineBucket.deleteLevel = DeleteLevel.Opportunity;

          if (
            deletePipelineBucket &&
            deletePipelineBucket.employee == null &&
            Number(deletePipelineBucket.office?.officeCode) == 0
          ) {
            deletePipelineBucket.deleteLevel = DeleteLevel.BucketRow;
          }
        } else {
          deletePipelineBucket.deleteLevel = DeleteLevel.BucketRow;
        }
        this.pipelineService.deletePipelineBucket.next(deletePipelineBucket);
      }
    } else {
      let currentBucketRow: PipelineBucket[] = this.weeklyBucket.filter(
        (data) => data.pipelineBucketId == item.pipelineBucketId
      );
      if (currentBucketRow && currentBucketRow.length > 0) {
        let deletePipelineBucket = currentBucketRow[0];
        deletePipelineBucket.pipelineBucketMappingId = mapping.pipelineBucketMappingId;
        deletePipelineBucket.deleteLevel = DeleteLevel.PipelineBucketMapping;
        this.pipelineService.deletePipelineBucket.next(deletePipelineBucket);
      }
    }
  }

  mapRegionToIds() {
    if (this.regionFilter) {
      let regArr = [];
      if (this.regionFilter.isAmericas) {
        regArr.push(Region.Americas);
      }
      if (this.regionFilter.isEMEA) {
        regArr.push(Region.EMEA);
      }
      if (this.regionFilter.isAPAC) {
        regArr.push(Region.APAC);
      }
      return regArr.join(",");
    } else {
      return "";
    }
  }

  setCurrentWeeklyData(weeklyData) {
    this.weeklyBucket = weeklyData;
    this.weeklyBucket.forEach((element) => {
      element.tmpPipelineBucketId = element.pipelineBucketId.toString();
    });
  }

  filterWeeklyBucket(bucketGroupId, allowCaseFilter = true) {
    let data = this.weeklyBucket.filter((obj) => obj.bucketGroupId == bucketGroupId);

    // filter by case start date
    if (this.filterByCaseStartDate && allowCaseFilter) {
      // filter out any buckets which have a mapped opportunity with a case start date in the past 7 days
      data = data.filter(bucket => {
        let showBucket = true;

        bucket?.pipelineBucketMapping?.forEach(mapping => {
          // If any mapped opportunity meets the criteria, hide the whole bucket
          if (mapping?.pipeline?.case) {
            showBucket = (moment(mapping.pipeline.case.caseStartDate) > moment().subtract(7, 'd'));
          }
        });

        return showBucket;
      }
      );
    }

    data.sort((a, b) => {
      return a.pipelineBucketId > b.pipelineBucketId ? -1 : 1;
    });

    return data;
  }

  openCaseCodeEditorPopUp(item: any) {
    let previouscasecode = item.pipeline.case;
    const initialState = {
      data: item
    };
    this.bsModalRef = this.modalService.show(CaseEditorPopUpComponent, {
      initialState,
      class: "model-notes",
      backdrop: "static",
      keyboard: false
    });

    this.bsModalRef.content.closeBtnName = "Close";
    this.bsModalRef.content.event.subscribe((a) => {
      if (a == "saveCaseCode") {
        this.saveCaseCode.emit({
          previouscasecode: previouscasecode,
          opportunity: this.bsModalRef.content.data.pipeline,
          fieldName: "caseCode",
          newValue: this.bsModalRef.content.caseInfo
        });

        let filteredBucket = this.weeklyBucket.filter(
          (wb) => wb.pipelineBucketId == this.bsModalRef.content.data.pipelineBucketId
        );
        if (filteredBucket && filteredBucket.length > 0) {
          // Delete other reg and opp in case of update case code
          let mappedOpp = filteredBucket[0].pipelineBucketMapping.filter(
            (pb) => pb.pipelineBucketMappingId != this.bsModalRef.content.data.pipelineBucketMappingId
          );
          // Update the status of other opp/reg to backlog and refresh the grid
          if (mappedOpp && mappedOpp.length > 0) {
            this.pipelineService.updateOppStage.next(mappedOpp);
          }
        }
      }
    });
  }
  deleteOppFromBucket(mapingItem, bucketStatus) {
    mapingItem.pipeline.opsLikelihood = bucketStatus;




    let item = this.weeklyBucket.filter((x) => x.pipelineBucketId == mapingItem.pipelineBucketId);

    this.deleteUnknownPlaceholder(mapingItem, item[0])

  }
  // Set the status of a PipelineBucket
  onPipelineBucketStatusChange(mappingData, bucketStatus) {

    if (bucketStatus.opsLikelihoodId == OpsLikelihoodEnum.Unknown) {
      this.deleteOppFromBucket(mappingData, bucketStatus)
    }
    else {

      if (mappingData && (mappingData.registrationId != 0)) {
        let filteredBucket = this.weeklyBucket.filter((wb) => wb.pipelineBucketId == mappingData.pipelineBucketId);
        this.sendDataToPipelineOpsLikelyhood(mappingData, bucketStatus);

        if (filteredBucket && filteredBucket.length > 0) {
          // Delete other reg and opp in case of sold status
          if (bucketStatus.opsLikelihoodId == OpsLikelihoodEnum.Staffed) {
            let mappedOpp = filteredBucket[0].pipelineBucketMapping.filter(
              (pb) => pb.pipelineBucketMappingId != mappingData.pipelineBucketMappingId
            );

            if (mappedOpp?.length > 0) {
              // Update the status of other opp/reg to backlog and refresh the grid
              this.pipelineService.updateOppStage.next(mappedOpp);
              this.toastr.showSuccess("Opportunity moved back to grid!", "Success");
            }
          }
        }
      } else {
        this.toastr.showWarning("Unable to set status on blank placeholder", "Empty placeholder");
      }
    }
  }

  //Ops lilkelyhood data sent to staffing
  sendDataToPipelineOpsLikelyhood(item, bucketStatus) {
    //if status is already set only emit the itema and dont send data to dashboard

    if (!item?.pipeline?.isOpportunityStaffed) {
      let weeklybucket: any = this.weeklyBucket.find((x) => x.pipelineBucketId == item.pipelineBucketId);
      if (item.pipeline && weeklybucket) {
        // Creating payload
        let pipelineObject = item.pipeline;
        if (
          pipelineObject?.expectedStart?.expectedStartDate &&
          (weeklybucket.employee || weeklybucket.office?.officeCode != "0")
        ) {
          let endDateGap: number;
          if (pipelineObject.duration && pipelineObject.duration.toString().trim() != "") {
            endDateGap = parseInt(pipelineObject.duration) || 2;
          } else {
            endDateGap = 2;
          }

          let endDate = moment.utc(pipelineObject.expectedStart.expectedStartDate).add((endDateGap * 7), "days");

          if (endDate.weekday() == 6) { // If Saturday
            endDate.subtract(1, "days");
          } else if (endDate.weekday() == 0) { // If Sunday
            endDate.subtract(2, "days");
          } else if (endDate.weekday() == 1) { // If Monday
            endDate.subtract(3, "days");
          } else {
            endDate.subtract(1, "days");
          }

          var PipelineInfoSend = {
            opportunityId: pipelineObject.poId,
            officeCodes:
              weeklybucket.employee != null && weeklybucket.employee.employeeCode.trim() != ""
                ? weeklybucket.employee.homeOfficeCode
                : pipelineObject?.officeToBeStaffed?.length > 0 ? weeklybucket.office?.officeCode + "," + pipelineObject?.officeToBeStaffed.map((x) => x.officeCode).join(",")
                  : weeklybucket.office?.officeCode,
            name:
              (pipelineObject?.client?.length > 0
                ? pipelineObject.client.map((x) => x.clientName).join(",") + " - "
                : "") +
              (pipelineObject?.industries?.length > 0
                ? pipelineObject.industries.map((x) => x.industryName).join(",")
                : "") +
              (pipelineObject?.expectedProjectName ? " - " + pipelineObject.expectedProjectName : ""),
            timestampUTC: moment.utc().format("YYYY-MM-DD HH:mm Z"),
            startDate: moment.utc(pipelineObject.expectedStart.expectedStartDate).format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            probabilityPercent: CommonMethods.getLikelihoodValue(pipelineObject.likelihood)

          };
          if (item.pipeline.bucketOffice && item.pipeline?.bucketOffice?.officeCode && parseInt(item.pipeline?.bucketOffice?.officeCode) > 0) {

            if (CommonMethods.isDateWithinLastYear(item?.pipeline?.submissionDate) == true &&
              item?.pipeline?.dealId != 0 && item?.pipeline?.dealId &&
              (weeklybucket?.office?.officeCode != "0" || weeklybucket?.employee != null)
            ) {
              this.pipelineService.getRelatedTrackerClientsByRegistrationId(item?.pipeline?.registrationId).subscribe(res => {

                let conflictedData = res?.filter(x => (x?.officeClusterCode == weeklybucket?.office?.officeClusterCode ||
                  x?.officeClusterCode == weeklybucket?.employee?.officeClusterCode) && x?.officeCode != "0");

                if (conflictedData && conflictedData.length > 0) {
                  conflictedData = conflictedData.find(x => x.registrationStageId == RegistrationStageEnum.WorkStarted ||
                    x.registrationStageId == RegistrationStageEnum.WorkCompleted);
                } else {
                  conflictedData = null;
                }
                let isConflicted = conflictedData ? true : false;

                if (isConflicted) {
                  const initialState = {
                    data:
                      'Warning: this could be a conflict of interest. Please check the Case Managing Office/Cluster of prior registrations',
                    title: "Confirmation"
                  };

                  this.bsModalRef = this.modalService.show(ConflictPopupComponent, {
                    initialState,
                    backdrop: "static",
                    keyboard: false
                  });

                  this.bsModalRef.content.event.subscribe((a) => {
                    if (a == "proceed") {
                      this.pipelineService.sendPipelineOpportunityData(PipelineInfoSend).subscribe((res) => {
                        if (res) {
                          this.toastr.showSuccess("Opportunity data sent to staffing.", "Success");
                        }

                        //setting up opportunity
                        item.pipeline.opsLikelihood = bucketStatus;
                        this.setOpsLikelihood.emit(item);
                      });
                    } else if (a == "discard") {
                      return;
                    }
                  });
                } else {
                  this.pipelineService.sendPipelineOpportunityData(PipelineInfoSend).subscribe((res) => {
                    if (res) {
                      this.toastr.showSuccess("Opportunity data sent to staffing.", "Success");
                    }

                    //setting up opportunity
                    item.pipeline.opsLikelihood = bucketStatus;
                    this.setOpsLikelihood.emit(item);
                  });
                }


              })
            } else {
              this.pipelineService.sendPipelineOpportunityData(PipelineInfoSend).subscribe((res) => {
                if (res) {
                  this.toastr.showSuccess("Opportunity data sent to staffing.", "Success");
                }

                //setting up opportunity
                item.pipeline.opsLikelihood = bucketStatus;
                this.setOpsLikelihood.emit(item);
              });
            }
          } else {
            item.pipeline.opsLikelihood = bucketStatus;
            this.setOpsLikelihood.emit(item);
          }
        } else {
          this.toastr.showWarning("Fields Expected start Date, Location/Manager cannot be empty", "Warning");
        }
      } else {
        this.toastr.showWarning("There is not opportunity linked to this bucket", "Warning");
      }
    }
    else {
      let weeklybucket: any = this.weeklyBucket.find((x) => x.pipelineBucketId == item.pipelineBucketId);
      let pipelineObject = item.pipeline;
      if (
        pipelineObject?.expectedStart?.expectedStartDate &&
        (weeklybucket.employee || weeklybucket.office?.officeCode != "0")
      ) {

        item.pipeline.opsLikelihood = bucketStatus;
        this.setOpsLikelihood.emit(item);
      }
      else {
        this.toastr.showWarning("Fields Expected start Date, Location/Manager cannot be empty", "Warning");
      }
    }
  }






  showPartnerEditFlag(pipeline: Pipeline) {
    if (pipeline?.isPartnerEditFlagged && CommonMethods.PassesPipelineFilter(FilterType.ActiveUpcomingNewOpportunities, pipeline)) {
      return true;
    } else {
      return false;
    }
  }

  selectBucketRow(item, mapping, event) {
    if (mapping?.pipeline) {
      if (mapping?.pipeline?.isRowSelected == undefined) {
        mapping.pipeline.isRowSelected = true;
      } else {
        mapping.pipeline.isRowSelected = !mapping?.pipeline?.isRowSelected;
      }
      this.redrawRows.emit(mapping.pipeline);
    }
  }

  openInOutlook(event) {
    this.outSendEmail.emit(event.value);
  }

  openPipelineCurtain() {
    if (!this.isCurtainCollapsed && this.isCurtainCollapsed != undefined) {
      document.querySelector("#capacitySplitArea").classList.remove("full-screen");
    }
  }

  toggleBucketWidth() {
    let val: number = this.bucketWidth == 1 ? 2 : 1;

    this.setBucketWidth.emit({
      index: this.weekNumber,
      value: val
    });
  }



  toggleColumnNumber(columns) {
    // Don't emit an event if the column number remains the same
    if (this.setNumberOfColumns == columns) {
      return;
    }

    this.setNumberOfColumns = columns;
    switch (columns) {
      case 1:
        this.setColumnsClass = "";
        break;
      case 2:
        this.setColumnsClass = "two-columns";
        break;
      case 3:
        this.setColumnsClass = "three-columns";
        break;
      case 4:
        this.setColumnsClass = "four-columns";
        break;
      default:
        break;
    }

    // Emit data
    let columnObj = {
      bucketNumber: this.bucketNumber,
      columnSpan: columns
    };

    this.mapPipelineBucketDataForDisplay();
    this.createDragDropAccessList();
  }

  resetColumnNumber() {
    this.setNumberOfColumns = this.defaultColumnView ? this.defaultColumnView : 1;
    switch (this.setNumberOfColumns) {
      case 1:
        this.setColumnsClass = "";
        break;
      case 2:
        this.setColumnsClass = "two-columns";
        break;
      case 3:
        this.setColumnsClass = "three-columns";
        break;
      case 4:
        this.setColumnsClass = "four-columns";
        break;
      default:
        break;
    }

    this.mapPipelineBucketDataForDisplay();
  }

  getGridIndex(columnNumber: number) {
    return (this.bucketNumber * 4) + columnNumber;
  }

  toggleSortWeeklyBucket(sortBy, enableToggle = true) {
    this.currentSortByValue = sortBy;

    if (sortBy == "date") {
      this.bucketSortOrder.date = enableToggle ? !this.bucketSortOrder.date : this.bucketSortOrder.date;
      this.bucketSortOrder.office = false;
      this.bucketSortOrder.name = false;
    } else if (sortBy == "office") {
      this.bucketSortOrder.date = false;
      this.bucketSortOrder.name = false;
      this.bucketSortOrder.office = enableToggle ? !this.bucketSortOrder.office : this.bucketSortOrder.office;
    } else if (sortBy == "name") {
      this.bucketSortOrder.date = false;
      this.bucketSortOrder.office = false;
      this.bucketSortOrder.name = enableToggle ? !this.bucketSortOrder.name : this.bucketSortOrder.name;
    }
    this.sortWeeklyBucket(sortBy);
  }
  sortWeeklyBucket(sortBy) {
    if (sortBy == "date") {
      this.bucketSortModal = "date";
      if (this.bucketSortOrder.date) {
        let allNonSortingElementList = [];
        let office_EmpList = [];
        let emptyRowList = [];
        this.groupsByColumn.forEach(columnItem => {
          columnItem.forEach(item => {
            if (item.bucketMapping.length > 0) {
              item.bucketMapping = item.bucketMapping.sort((a, b) => {
                let aDateComp;
                let bDateComp;
                if (a.availableDate) {
                  aDateComp = moment(a.availableDate).valueOf();
                } else {
                  aDateComp = 0;
                }
                if (b.availableDate) {
                  bDateComp = moment(b.availableDate).valueOf();
                } else {
                  bDateComp = 0;
                }

                if (aDateComp == 0) {
                  if (a.employee != null || a?.office?.officeName != null || a?.office?.officeName != undefined) {
                    if (!office_EmpList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                      office_EmpList.push(a);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                      emptyRowList.push(a);
                  }

                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                    allNonSortingElementList.push(a);
                }

                if (bDateComp == 0) {
                  if (b.employee != null || b?.office?.officeName != null || b?.office?.officeName != undefined) {
                    if (!office_EmpList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                      office_EmpList.push(b);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                      emptyRowList.push(b);
                  }

                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                    allNonSortingElementList.push(b);
                }

                return aDateComp - bDateComp;
              });
            }
          });

        });


        // Ensure all non-sorting elements are sorted by Id to prevent item shift
        allNonSortingElementList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
        office_EmpList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
        emptyRowList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });


      } else {
        let allNonSortingElementList = [];
        let office_EmpList = [];
        let emptyRowList = [];
        this.groupsByColumn.forEach(columnItem => {
          columnItem.forEach(item => {
            if (item.bucketMapping.length > 0) {
              item.bucketMapping = item.bucketMapping.sort((a, b) => {
                let aDateComp;
                let bDateComp;
                if (a.availableDate) {
                  aDateComp = moment(a.availableDate).valueOf();
                } else {
                  aDateComp = 0;
                }
                if (b.availableDate) {
                  bDateComp = moment(b.availableDate).valueOf();
                } else {
                  bDateComp = 0;
                }

                if (aDateComp == 0) {
                  if (a.employee != null || a?.office?.officeName != null || a?.office?.officeName != undefined) {
                    if (!office_EmpList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                      office_EmpList.push(a);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                      emptyRowList.push(a);
                  }

                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                    allNonSortingElementList.push(a);
                }

                if (bDateComp == 0) {
                  if (b.employee != null || b?.office?.officeName != null || b?.office?.officeName != undefined) {
                    if (!office_EmpList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                      office_EmpList.push(b);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                      emptyRowList.push(b);
                  }

                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                    allNonSortingElementList.push(b);
                }

                return bDateComp - aDateComp;
              });

            }
          })
        });


        // Ensure all non-sorting elements are sorted by Id to prevent item shift
        allNonSortingElementList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
        office_EmpList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
        emptyRowList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });


      }
    } else if (sortBy == "office") {
      this.bucketSortModal = "office";

      if (this.bucketSortOrder.office) {
        this.groupsByColumn.forEach(columnItem => {
          columnItem.forEach(item => {
            if (item.bucketMapping.length > 0) {
              item.bucketMapping = item.bucketMapping.sort(function (a, b) {
                let aComp;
                let bComp;
                if ((a.employee != null && a.employee.employeeCode.trim() != "") || a?.office?.officeName != null) {
                  if (a.employee != null && a.employee.employeeCode.trim() != "") {
                    aComp = a.employee.officeAbbreviation;
                  } else {
                    aComp = a.office.officeAbbr;
                  }
                } else {
                  aComp = "";
                }

                if ((b.employee != null && b.employee.employeeCode.trim() != "") || b?.office?.officeName != null) {
                  if (b.employee != null && b.employee.employeeCode.trim() != "") {
                    bComp = b.employee.officeAbbreviation;
                  } else {
                    bComp = b.office.officeAbbr;
                  }
                } else {
                  bComp = "";
                }
                if (bComp == "") {
                  bComp = "AA";
                }
                if (aComp == "") {
                  aComp = "AA";
                }

                return aComp < bComp ? -1 : aComp > bComp ? 1 : 0;
              });

            }
          });

        });

      } else {
        this.groupsByColumn.forEach(columnItem => {
          columnItem.forEach(item => {
            if (item.bucketMapping.length > 0) {
              item.bucketMapping = item.bucketMapping.sort(function (a, b) {
                let aComp;
                let bComp;
                if ((a.employee != null && a.employee.employeeCode.trim() != "") || a?.office?.officeName != null) {
                  if (a.employee != null && a.employee.employeeCode.trim() != "") {
                    aComp = a.employee.officeAbbreviation;
                  } else {
                    aComp = a.office.officeAbbr;
                  }
                } else {
                  aComp = "";
                }

                if ((b.employee != null && b.employee.employeeCode.trim() != "") || b?.office?.officeName != null) {
                  if (b.employee != null && b.employee.employeeCode.trim() != "") {
                    bComp = b.employee.officeAbbreviation;
                  } else {
                    bComp = b.office.officeAbbr;
                  }
                } else {
                  bComp = "";
                }
                if (bComp == "") {
                  bComp = "AA";
                }
                if (aComp == "") {
                  aComp = "AA";
                }

                return aComp > bComp ? -1 : aComp < bComp ? 1 : 0;
              });
            }
          });
        });


      }
    } else if (sortBy == "name") {
      this.bucketSortModal = "name";
      if (this.bucketSortOrder.name) {
        let allNonSortingElementList = [];
        let officeList = [];
        let emptyRowList = [];
        this.groupsByColumn.forEach(columnItem => {
          columnItem.forEach(item => {
            if (item.bucketMapping.length > 0) {
              item.bucketMapping = item.bucketMapping.sort((a, b) => {
                let aNameComp;
                let bNameComp;

                if (a.employee && a.employee.employeeCode.trim() != "") {
                  aNameComp = a.employee.lastName;
                } else {
                  if (a?.office?.officeName != null || a?.office?.officeName != undefined) {
                    if (!officeList.find((x) => x.pipelineBucketId == a.pipelineBucketId)) officeList.push(a);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                      emptyRowList.push(a);
                  }
                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                    allNonSortingElementList.push(a);
                }
                if (b.employee && b.employee.employeeCode.trim() != "") {
                  bNameComp = b.employee.lastName;
                } else {
                  if (b?.office?.officeName != null || b?.office?.officeName != undefined) {
                    if (!officeList.find((x) => x.pipelineBucketId == b.pipelineBucketId)) officeList.push(b);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                      emptyRowList.push(b);
                  }

                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                    allNonSortingElementList.push(b);
                }

                return aNameComp < bNameComp ? -1 : aNameComp > bNameComp ? 1 : 0;
              });

              // Ensure all non-sorting elements are sorted by Id to prevent item shift
              allNonSortingElementList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
              officeList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
              emptyRowList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
            }
          })

        });

      } else {
        let allNonSortingElementList = [];
        let officeList = [];
        let emptyRowList = [];
        this.groupsByColumn.forEach(columnItem => {
          columnItem.forEach(item => {
            if (item.bucketMapping.length > 0) {
              item.bucketMapping = item.bucketMapping.sort((a, b) => {
                let aNameComp;
                let bNameComp;
                if (a.employee && a.employee.employeeCode.trim() != "") {
                  aNameComp = a.employee.lastName;
                } else {
                  if (a?.office?.officeName != null || a?.office?.officeName != undefined) {
                    if (!officeList.find((x) => x.pipelineBucketId == a.pipelineBucketId)) officeList.push(a);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                      emptyRowList.push(a);
                  }

                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == a.pipelineBucketId))
                    allNonSortingElementList.push(a);
                }
                if (b.employee && b.employee.employeeCode.trim() != "") {
                  bNameComp = b.employee.lastName;
                } else {
                  if (b?.office?.officeName != null || b?.office?.officeName != undefined) {
                    if (!officeList.find((x) => x.pipelineBucketId == b.pipelineBucketId)) officeList.push(b);
                  } else {
                    if (!emptyRowList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                      emptyRowList.push(b);
                  }

                  if (!allNonSortingElementList.find((x) => x.pipelineBucketId == b.pipelineBucketId))
                    allNonSortingElementList.push(b);
                }

                return aNameComp > bNameComp ? -1 : aNameComp < bNameComp ? 1 : 0;
              });

              // Ensure all non-sorting elements are sorted by Id to prevent item shift
              allNonSortingElementList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
              officeList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });
              emptyRowList.sort((a, b) => { return a.pipelineBucketId - b.pipelineBucketId });

              allNonSortingElementList.forEach((element) => {
                let index = this.weeklyBucket.findIndex((x) => x.pipelineBucketId == element.pipelineBucketId);
                this.weeklyBucket.splice(index, 1);
              });

              officeList.forEach((element) => {
                this.weeklyBucket.push(element);
              });
              emptyRowList.forEach((element) => {
                this.weeklyBucket.push(element);
              });
            }
          })
        });


      }
    }
  }

  getTruncatedNote(item) {
    let tooltip: any = {
      outage: "",
      preference: "",
      cdWork: ""
    };
    let TRIMMED_VALUE = 100;
    if (item.outrage || item.preference || item.cdWork) {
      if (item?.outrage) {
        tooltip.outage = item.outrage;
        if (tooltip.outage.length > TRIMMED_VALUE) {
          tooltip.outage = item.outrage.substr(0, TRIMMED_VALUE) + "...";
        }
      }
      if (item?.preference) {
        tooltip.preference = item.preference;
        if (tooltip.preference?.length > TRIMMED_VALUE) {
          tooltip.preference = item.preference.substr(0, TRIMMED_VALUE) + "...";
        }
      }
      if (item.cdWork) {
        tooltip.cdWork = item.cdWork;
        if (tooltip.cdWork?.length > TRIMMED_VALUE) {
          tooltip.cdWork = item.cdWork.substr(0, TRIMMED_VALUE) + "...";
        }
      }
    }
    if (tooltip.outage == "" && tooltip.preference == "" && tooltip.cdWork == "") {
      return "...";
    }
    return tooltip;
  }

  getEmployeeAlertData(empAlertStatus: any) {

    let alertMessage = [];
    if (empAlertStatus && empAlertStatus?.length > 0) {
      alertMessage = CommonMethods.GenerateEmployeeAlertTooltipArray(empAlertStatus);
    }

    return alertMessage;
  }

  getConflictsTooltip(inputData) {
    this.showLoader = true;
    this.conflictsData = [];
    this.clientId = inputData.client[0]?.clientId;
    this.pipelineService.getRelatedTrackerClientsByRegistrationId(inputData.registrationId).subscribe(res => {
      let data = [];
      res.forEach(element => {
        if (element.registrationStageId != RegistrationStageEnum.ClosedBainTurnedDown && element.registrationStageId != RegistrationStageEnum.ClosedDropped && element.registrationStageId != RegistrationStageEnum.ClosedLost && element.registrationStageId != RegistrationStageEnum.Terminated) {

          if (element.isRetainer == 1) {
            element.isRetainer = "Yes";
          }
          if (element.isRetainer == 2) {
            element.isRetainer = "No";
          }
          if (element.isRetainer == 3) {
            element.isRetainer = "I Don't Know";
          }

          data.push(element)

        }
      });
      this.conflictsData = data.sort((a, b) => { return CommonMethods.sortConflicts(a?.registrationStageId ?? 0, a, b) });
      var currentDate = moment().toDate();
      var pastDate = currentDate.getDate() - 365;
      currentDate.setDate(pastDate);
      let CurrentDate = moment(currentDate).format("MM/DD/YYYY");

      let activeOffice = this.conflictsData.filter(x => x.registrationStageId == RegistrationStageEnum.WorkStarted && x.officeName != undefined
        && moment(x.caseEndDate).isAfter(CurrentDate) && x.clientId != inputData?.client[0]?.clientId);

      let priorOffice = this.conflictsData.filter(x => x.registrationStageId == RegistrationStageEnum.WorkCompleted && x.officeName != undefined
        && moment(x.caseEndDate).isAfter(CurrentDate) && x.clientId != inputData?.client[0]?.clientId);


      this.activeOffice = Array.from(new Set(activeOffice.map((office) => office.officeName))).join(", "); // Remove duplicates  

      this.priorOffice = Array.from(new Set(priorOffice.map((office) => office.officeName))).join(", "); // Remove duplicates  

      this.conflictedOffice = [];
      if (res && res.length > 0) {
        this.conflictedOffice = Array.from(new Set(res.flatMap((x) =>
          x?.conflictedOffice?.map((y) => y?.office?.officeName)
        ).filter((name) => name !== undefined))).join(", ");
      } else {
        this.conflictedOffice = [];
        this.conflictedOffice = inputData?.conflictedOffice?.map((x) => x.office.officeName).join(", "); // Remove duplicates  
      }

      this.showLoader = false;;
    })
  }
  getHighlightClass(item) {

    var currentDate = moment().toDate();
    var pastDate = currentDate.getDate() - 365;
    currentDate.setDate(pastDate);
    let CurrentDate = moment(currentDate).format("MM/DD/YYYY");

    if ((item?.registrationStageId == RegistrationStageEnum.WorkCompleted || item?.registrationStageId == RegistrationStageEnum.WorkStarted)
      && (item?.caseEndDate && moment(item?.caseEndDate).isAfter(CurrentDate))
      && item.clientId != this.clientId) {
      return "highlight";
    }
    return "";
  }

  // Return the employee or office notes if they exist on an item
  fetchNote(item) {
    if (item.employee) {
      this.pipelineService.getEmployeeNote(item.employee.employeeCode).subscribe((response) => {
        if (response) {
          item.outrage = response.outrage;
          item.preference = response.preference;
          item.cdWork = response.cdWork;
          // Manually update tooltip content
          let tooltip = document.querySelector("body > .tooltip .tooltip-inner");

          if (tooltip) {
            tooltip.innerHTML = "";
            let resourceNote = this.getTruncatedNote(item);
            if (resourceNote?.outage) {
              let splittedData = resourceNote?.outage.split("\n");
              if (splittedData && splittedData.length > 0) {
                for (let index = 0; index < splittedData.length; index++) {
                  const element = splittedData[index];
                  if (index == 0) {
                    tooltip.innerHTML = "<div><b>Outages:</b> <span>" + element + "</span></div>";
                  } else {
                    tooltip.innerHTML += "<div>" + element + "</div>";
                  }
                }
              }
            } else {
              tooltip.innerHTML = "<div>Outages: </div>";
            }
            if (resourceNote?.cdWork) {
              let splittedData = resourceNote?.cdWork.split("\n");
              if (splittedData && splittedData.length > 0) {
                for (let index = 0; index < splittedData.length; index++) {
                  const element = splittedData[index];
                  if (index == 0) {
                    tooltip.innerHTML +=
                      "<div><b>CD Work:</b> <span>" + element + "</span></div>";
                  } else {
                    tooltip.innerHTML += "<div>" + element + "</div>";
                  }
                }
              }
            } else {
              tooltip.innerHTML += "<div>CD Work: </div>";
            }
            if (resourceNote?.preference) {
              let splittedData = resourceNote?.preference.split("\n");
              if (splittedData && splittedData.length > 0) {
                for (let index = 0; index < splittedData.length; index++) {
                  const element = splittedData[index];
                  if (index == 0) {
                    tooltip.innerHTML +=
                      "<div><b>Preference:</b> <span>" + element + "</span></div>";
                  } else {
                    tooltip.innerHTML += "<div>" + element + "</div>";
                  }
                }
              }
            } else {
              tooltip.innerHTML += "<div>Preference: </div>";
            }

          }
        }
      });
    } else if (item.office) {
      let pipelineBucketId = item?.pipelineBucketId ?? 0;
      this.pipelineService.getOfficeNote(item.office.officeCode, pipelineBucketId).subscribe((response) => {
        if (response) {
          item.outrage = response.officeOutrage;
          item.cdWork = response.cdWork;
          item.preference = response.preference;
          // Manually update tooltip content
          let tooltip = document.getElementsByClassName("tooltip-inner")[0];

          if (tooltip) {
            tooltip.innerHTML = "";
            let resourceNote = this.getTruncatedNote(item);
            if (resourceNote?.outage) {
              let splittedData = resourceNote?.outage.split("\n");
              if (splittedData && splittedData.length > 0) {
                for (let index = 0; index < splittedData.length; index++) {
                  const element = splittedData[index];
                  if (index == 0) {
                    tooltip.innerHTML += "<div><b>Outages:</b> <span>" + element + "</span></div>";
                  } else {
                    tooltip.innerHTML += "<div>" + element + "</div>";
                  }
                }
              }
            } else {
              tooltip.innerHTML = "<div>Outages: </div>";
            }
            if (resourceNote?.cdWork) {
              let splittedData = resourceNote?.cdWork.split("\n");
              if (splittedData && splittedData.length > 0) {
                for (let index = 0; index < splittedData.length; index++) {
                  const element = splittedData[index];
                  if (index == 0) {
                    tooltip.innerHTML +=
                      "<div><b>CD Work:</b> <span>" + element + "</span></div>";
                  } else {
                    tooltip.innerHTML += "<div>" + element + "</div>";
                  }
                }
              }
            } else {
              tooltip.innerHTML += "<div>CD Work: </div>";
            }
            if (resourceNote?.preference) {
              let splittedData = resourceNote?.preference.split("\n");
              if (splittedData && splittedData.length > 0) {
                for (let index = 0; index < splittedData.length; index++) {
                  const element = splittedData[index];
                  if (index == 0) {
                    tooltip.innerHTML +=
                      "<div><b>Preference:</b> <span>" + element + "</span></div>";
                  } else {
                    tooltip.innerHTML += "<div>" + element + "</div>";
                  }
                }
              }
            } else {
              tooltip.innerHTML += "<div>Preference: </div>";
            }


          }
        }
      });
    }
  }
  deleteUnknownPlaceholder(mapping, item) {
    let palceholderName = mapping?.pipeline?.oppName || " ";
    const initialState = {
      data:
        'This action will delete the placeholder "' +
        palceholderName +
        '", would you like to continue?',
      title: "Confirmation"
    };

    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState,
      backdrop: "static",
      keyboard: false
    });

    this.bsModalRef.content.closeBtnName = "Close";
    this.bsModalRef.content.event.subscribe((a) => {
      // Delete palceholder
      if (a == "reset") {
        this.setOpsLikelihood.emit(mapping);
        this.deleteEmployeeBucket(mapping, item);
      }
      else {
        let bucktestus = this.opsLikelihood.filter(x => x.opsLikelihoodId == mapping?.opsLikelihoodId);
        mapping.pipeline.opsLikelihood = bucktestus[0];
        item.pipelineBucketMapping[0].pipeline.opsLikelihood = bucktestus[0];

      }
    });
  }
  clickPlaceholderDelete(mapping, item) {
    let palceholderName = mapping?.pipeline?.oppName || " ";
    const initialState = {
      data:
        'This action will delete the placeholder "' +
        palceholderName +
        '", would you like to continue?',
      title: "Confirmation"
    };

    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState,
      backdrop: "static",
      keyboard: false
    });

    this.bsModalRef.content.closeBtnName = "Close";
    this.bsModalRef.content.event.subscribe((a) => {
      // Delete palceholder
      if (a == "reset") {
        this.deleteEmployeeBucket(mapping, item);
      }
    });
  }

  // Prompt confirmation to delete pipeline bucket group
  clickGroupDelete(event, group) {
    const initialState = {
      data:
        'This action will delete the bucket group "' +
        group.bucketGroupName +
        '" and all buckets within this group. Would you like to continue?',
      title: "Confirmation"
    };

    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState,
      backdrop: "static",
      keyboard: false
    });

    console.log(this.weekStartDateLabel);

    this.bsModalRef.content.closeBtnName = "Close";
    this.bsModalRef.content.event.subscribe((a) => {
      // Delete pipeline group
      if (a == "reset") {
        // Mark bucket group for deletion
        group.deleteLevel = DeleteLevel.PipelineGroup;
        let regionFilterText = this.mapRegionToIds();

        this.deleteWeeklyBucketGroupData.emit(group);

        // Remove from UI and bucket data
        let deleteIndex = this.bucketGroup.findIndex(g => g.bucketGroupId == group.bucketGroupId);
        this.bucketGroup.splice(deleteIndex, 1);
        document.querySelector("#bucketGroup" + group.bucketGroupId).remove(); // Necessary to remove DOM element for newly added or dragged items
      }
    });
  }

  // Returns the total number of buckets in the column based on bucketGroupId
  getBucketCount(buckets) {
    let bucketList: PipelineBucket[] = buckets.filter(
      (bucket) =>
        moment(bucket.weekStartDate).startOf('week').format("DD-MMM-YYYY") == moment(this.weekStartDate).startOf('week').format("DD-MMM-YYYY")
    );

    bucketList = bucketList.filter(
      (x) =>
        (x.office != null && String(x.office.officeCode) != "0") ||
        (x.employee != null && x.employee.employeeCode != "") ||
        x.pipelineBucketMapping?.some((c) => c.registrationId != 0)
    );

    return bucketList.length;
  }

  // Returns the total number of bucket groups in the column based on start week
  getBucketGroupCount() {
    let groups = this.bucketGroup.filter((group) => this.isSameWeekStart(group));
    return groups.length;
  }

  placeholderDragOver(event, bucket: PipelineBucket) {
    let placeholderUnitId = "placeholderUnit" + bucket.pipelineBucketId;
    let isChildOrSelf = event.path?.some((element) => element.id == placeholderUnitId);

    if (isChildOrSelf && bucket.pipelineBucketMapping.some((map) => map.pipeline != undefined)) {
      this.deSelectPlaceHolder("placeholder");
      let item = document.getElementById(placeholderUnitId);
      item?.classList.add("placeholderHighlight");
    } else {
      this.deSelectPlaceHolder("placeholder");
    }
    event.preventDefault();
  }

  deSelectPlaceHolder(name: string) {
    Array.from(document.getElementsByClassName("placeholder")).forEach((element) => {
      element.classList.remove("placeholderHighlight");
    });
  }

  // Return whether or not a bucket's start date is in the same week of the current week monday
  getGroupsInWeek(groupData) {
    let bucketsToReturn = [];
    groupData.forEach((bucket) => {
      if (this.getFormattedDate(bucket.weekStartDate) == this.weekStartDateLabel) {
        bucketsToReturn.push(bucket);
      }
    });

    // filter groups that have the 'isNew' property
    let currentTime = new Date(Date.now());
    let newGroups = bucketsToReturn.filter((x) => x.hasOwnProperty('isNew') && currentTime.getTime() >= new Date(x.createdDate).getTime());

    let finalBucketsToReturn = bucketsToReturn.sort((a, b) => {
      return a.sortOrder - b.sortOrder || new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });

    // filter rest of buckets to groups that don't have the 'isNew' property, should mean they've been editied in some way (name or bucket change)
    let finalBuckets = finalBucketsToReturn.filter((x) => !x.hasOwnProperty('isNew'));

    // set the new groups first, then remaining groups after
    let returnArray = [].concat(newGroups, finalBuckets);


    // temp: hide groups for specific region
    let bucketsWithGroupFilterApplied = [];
    if (this.isApplyGroupFilter()) {
      returnArray.forEach((bucket) => {
        if (bucket.bucketGroupName && bucket.bucketGroupName.toLowerCase() != "emea") {
          bucketsWithGroupFilterApplied.push(bucket);
        }
      });
    } else {
      bucketsWithGroupFilterApplied = returnArray;
    }

    return bucketsWithGroupFilterApplied;
  }

  // Return whether or not a bucket group is in a specific column in this week
  getGroupsInColumn(data, columnIndex) {
    let returnArray = data.filter(x => this.isBucketGroupInColumn(x, columnIndex))

    return returnArray;
  }

  isBucketGroupInColumn(bucket, columnIndex) {
    let isInColumn = false;

    // Show buckets assigned to this column
    if (columnIndex == bucket.columnPosition) {
      isInColumn = true;
    }

    // Show unassigned buckets in the first column
    if (columnIndex == 0 && bucket.columnPosition == null) {
      isInColumn = true;
    }

    // Show buckets assigned to hidden columns in the final column
    if (bucket.columnPosition >= this.setNumberOfColumns && columnIndex == this.setNumberOfColumns - 1) {
      isInColumn = true;
    }

    return isInColumn;
  }

  isApplyGroupFilter() {
    let isAdmin = this.coreService.loggedInUser?.securityRoles?.some(x => x.id == RoleType.PEGAdministrator)
    if (!isAdmin && this.coreService.loggedInUser.employeeRegionId != Region.EMEA) {
      return true;
    }
    else {
      return false;
    }
  }

  updateOpportunityFlag(mapping) {
    if (mapping?.pipeline?.registrationId && mapping.pipeline.registrationId != 0) {
      this.updateSelectedOpportunitesFlags.emit(mapping.pipeline.registrationId);
    }
  }

  isResetStatus(mapping) {
    return !mapping?.pipeline?.case && mapping?.pipeline?.opsLikelihood?.opsLikelihoodId > 0
  }

  removeStatus(mappingData) {
    mappingData.pipeline.opsLikelihood = undefined;
    this.setOpsLikelihood.emit(mappingData);
  }

  checkForOfficeConflict(element, changes): Observable<number> {
    return of(element).pipe(
      switchMap((el): Observable<number> => {
        if (el === 1) {
          return this.pipelineService.getRelatedTrackerClientsByRegistrationId("").pipe(
            map((res): number => {
              // Perform any necessary operations with 'res'
              // Ensure that this block returns a number
              return 1;
            })
          );
        } else {
          return of(0);
        }
      })
    );
  }


  mapPipelineBucketDataForDisplay() {
    this.groupsByColumn = [];

    let bucketGroup = this.getGroupsInWeek(this.groupData);

    for (let i = 0; i < this.columnsArray.length; i++) {
      let groupsInColumn = this.getGroupsInColumn(bucketGroup, i);

      groupsInColumn.forEach(responseGroup => {
        responseGroup.bucketMapping = this.filterWeeklyBucket(responseGroup.bucketGroupId); // Assign buckets to group        
      });

      this.groupsByColumn.push(groupsInColumn);
    }
    this.toggleSortWeeklyBucket(this.currentSortByValue, false); // Passing false as we dont want to toggle the sort order
  }

  addToBucketGroup(changes, element) {
    // Don't add a new placeholder if the same opp and reg exists in the bucket
    let isPlaceholderExists;
    if (changes.data.currentValue.pipelineData?.registrationId != 0) {
      isPlaceholderExists = element?.pipelineBucketMapping?.filter(
        (placeHolder) =>
          placeHolder?.pipeline?.registrationId ==
          changes.data.currentValue.pipelineData?.registrationId
      );
    }
    if (isPlaceholderExists && isPlaceholderExists.length > 0) {
      return;
    }
    let pipelineBucketMapping = new PipelineBucketMapping();
    pipelineBucketMapping.pipeline = changes.data.currentValue.pipelineData;
    element.tmpPipelineBucketId = CommonMethods.getGUID();
    pipelineBucketMapping.pipelineBucketId = element.tmpPipelineBucketId;
    element.pipelineBucketMapping.push(pipelineBucketMapping);
    element.pipelineBucketMappingId = 0;
    this.updateOpportunityStage(changes?.data?.currentValue?.pipelineData);
    this.sortPipelineBucketMapping(element);
    this.updateWeeklyBucket(element);
  }


  updateSelectedOpportunitesPartnerFlags(mapping) {
    if (mapping?.pipeline?.registrationId && mapping.pipeline.registrationId != 0) {
      this.updatePartnerEditFlags.emit(mapping.pipeline.registrationId);
    }
  }

  toggleCaseStartFilter() {
    this.filterByCaseStartDate = !this.filterByCaseStartDate;
    this.mapPipelineBucketDataForDisplay();
  }

}
