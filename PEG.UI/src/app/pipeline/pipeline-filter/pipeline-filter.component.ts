import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GlobalService } from '../../global/global.service';
import { pipelineDataSources } from './filters';
import { BucketGroup } from '../bucketGroup';
import { NgForm } from '@angular/forms';
import { PipelineService } from '../pipeline.service';
import { CoreService } from '../../core/core.service';
import { UserPreference } from '../userPreference';
import { Region } from '../../shared/enums/region';
import { BucketColumnPreference } from '../bucket-column-preference';
import * as moment from 'moment';

@Component({
  selector: 'app-pipeline-filter',
  templateUrl: './pipeline-filter.component.html',
  styleUrls: ['./pipeline-filter.component.scss']
})
export class PipelineFilterComponent implements OnInit, OnChanges {
  @Input()
  userBucketColumnPreference: any;

  @Output() onRefreshGrid: EventEmitter<any> = new EventEmitter<any>();
  pipelineDataSources: pipelineDataSources = {
    Americas: true,
    EMEA: true,
    APAC: true
  };
  isColumnSwappedOnWeekends: boolean= false;
  bucketGroup: BucketGroup[] = [];
  titleMaxLength: number = 15;
  isShow: boolean = false;
  isInvalidForm: boolean = false;
  isBucketInvalid: boolean[] = [];
  userPreference: UserPreference = new UserPreference();
  region: any[] = [];
  regionFilter = { isAmericas: false, isEMEA: false, isAPAC: false };
  @ViewChild('form', { static: true })
  private form: NgForm;
  bucketColumnOptions = [
    { label: "Current Week Column Default", weekNumber: 0, isHide: false, columnValue: 1 },
    { label: "Column 2 Week Column Default", weekNumber: 1, isHide: true, columnValue: 1 },
    { label: "Column 3 Week Column Default", weekNumber: 2, isHide: true, columnValue: 1 },
    { label: "Column 4 Week Column Default", weekNumber: 3, isHide: true, columnValue: 1 },

  ]
  columnViewOptions = [
    { label: "1 Column", value: 1 },
    { label: "2 Columns", value: 2 },
    { label: "3 Columns", value: 3 },
    { label: "4 Columns", value: 4 }
  ];

  @Output()
  public userPreferenceUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public bucketColumnPreferenceEmitter: EventEmitter<BucketColumnPreference[]> = new EventEmitter<BucketColumnPreference[]>();

  constructor(private globalService: GlobalService, private pipelineService: PipelineService, private coreService: CoreService) {
   }

  ngOnInit() {
    this.getPipelineDataSources();
    this.getRegionData();
    this.isColumnSwappedOnWeekends=this.coreService.appSettings?.PipelineFridayDefaultColumnValue?.some(x=>x==moment().day())

  }
  mapUserBucketColumnPreference(value) {
    this.bucketColumnOptions.forEach(element => {
      let item = value.find(r => r.weekNumber == element.weekNumber);
      element.columnValue = item.columnValue;
    });

  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.userBucketColumnPreference && changes.userBucketColumnPreference.currentValue && changes.userBucketColumnPreference.currentValue.length > 0) {
      this.mapUserBucketColumnPreference(changes.userBucketColumnPreference.currentValue);

    }
  }

  getRegionData() {
    this.pipelineService.getUserPreferenceRegion().subscribe(res => {
      this.region = res;
      this.manageSelectedRegion();
    })
  }

  refreshCurPage() {
    this.onRefreshGrid.emit({ regionFilter: this.regionFilter });
  }
  getPipelineDataSources() {
    // Retrieve pipeline data sources from global service?

    /*this.globalService?.getPipelineDataSources().subscribe(data => {
      this.pipelineDataSources = data;
    })*/
  }

  showPanel(show: boolean) {
    this.isShow = show;

    if (show) {
      this.bucketGroup = [];

    }
  }

  // Validate and then save filter changes to server
  saveChanges() {
    // Allows value of 'this' to persist inside of the map function
    let self = this;
    this.manageSelectedRegion();
    // Initially set all form fields as valid
    this.isInvalidForm = false;

    for (let index in this.isBucketInvalid) {
      this.isBucketInvalid[index] = false;
    }

    let inputForm = this.form.value;

    Object.keys(this.form.value).map(function (key, index) {

      if (inputForm[key] == null || inputForm[key] == undefined || inputForm[key] == '') {
        // Map key to isBucketInvalid index

        if (key == "capacityTitle0") {
          self.isBucketInvalid[0] = true;
        }

        if (key == "capacityTitle1") {
          self.isBucketInvalid[1] = true;
        }

        if (key == "capacityTitle2") {
          self.isBucketInvalid[2] = true;
        }

        if (key == "capacityTitle3") {
          self.isBucketInvalid[3] = true;
        }

        self.isInvalidForm = true;
      }
    });

    // If form is not invalid, close panel and save changes
    if (!this.isInvalidForm) {
      this.showPanel(false);
    }


    this.userPreference.region = this.region;
    this.userPreference.bucketColumn = [];
    let tempListBucketColumnPreference: BucketColumnPreference[] = [];

    this.bucketColumnOptions.forEach(element => {
      let tempBucketColumnPreference: BucketColumnPreference = new BucketColumnPreference();
      tempBucketColumnPreference.weekNumber = element.weekNumber;
      tempBucketColumnPreference.columnValue = element.columnValue;
      tempListBucketColumnPreference.push(tempBucketColumnPreference);
    });
    this.userPreference.bucketColumn = tempListBucketColumnPreference;

    this.pipelineService.updatePageSettings(this.userPreference).subscribe(data => {
      this.userPreferenceUpdate.emit(true);
      this.bucketColumnPreferenceEmitter.emit(tempListBucketColumnPreference);

      this.showPanel(false);
    }, (error) => {
      console.error(error);
    })
  }

  manageSelectedRegion() {
    if (this.region) {
      this.region.forEach(element => {
        if (element.regionId == Region.APAC)
          this.regionFilter.isAPAC = element.isChecked;
        if (element.regionId == Region.EMEA)
          this.regionFilter.isEMEA = element.isChecked;
        if (element.regionId == Region.Americas)
          this.regionFilter.isAmericas = element.isChecked;

      });
    }
    this.pipelineService.regionFilterChange.next(this.regionFilter);
  }

  toggleColumnNumber(weekNumber, columnValue) {
    let columnSet: BucketColumnPreference = { columnValue: columnValue, weekNumber: weekNumber };
    this.bucketColumnOptions.forEach(element => {
      if (element.weekNumber === weekNumber) {
        element.columnValue = columnValue;
      }
    })
    // this.setNumberOfColumns.push(columnSet);
  }
}
