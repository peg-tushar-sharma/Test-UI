import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AddPegOppFormBuilder } from '../addPegOppFormBuilder';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CommonMethods } from '../../shared/common/common-methods';
import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Client } from '../../shared/interfaces/client';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Employee } from '../../shared/interfaces/Employee';
import { EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../../shared/common/constants'
import { FormGroup, NgForm } from '@angular/forms';
import { industry } from '../../shared/interfaces/industry';
import { Office } from '../../shared/interfaces/office';
import { StaffingService } from '../../staffing/staffing.service';
import { StaffingCreationService } from '../staffing-creation.service';
import { Subject, combineLatest } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TeamSize } from "../../shared/interfaces/teamSize";
import { PegDetails } from '../../staffing/peg-details';
import * as _ from 'lodash';




@Component({
  selector: 'app-staffing-creation',
  templateUrl: './staffing-creation.component.html',
  styleUrls: ['./staffing-creation.component.scss']
})
export class StaffingCreationComponent implements OnInit {
  // form
  mainForm: FormGroup = this.manualFormBuilder.buildManualForm();
  addPegOppForm: FormGroup = this.mainForm.controls['addPegOppForm'] as FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;
  employeeSection: string = '';
  selectedOfficesToBeStaffed: any = [];
  isManualOpportunityPage: boolean = false;
  isSearchedOpportunityExists: boolean = false;
  // fields
  clientList: Client[] = [];
  clientTypeAhead = new Subject<string>();
  isClientLoading: boolean = false;

  sellingPartnerList: Employee[] = [];
  sellingPartnerTypeAhead = new Subject<string>();
  isSellingPartnerLoading: boolean = false;

  svpList: Employee[] = [];
  svpTypeAhead = new Subject<string>();
  isSVPLoading: boolean = false;
  searchRegValue: string = undefined;
  ovpList: Employee[] = [];
  ovpTypeAhead = new Subject<string>();
  isOVPLoading: boolean = false;
  opportunityList: any[] = [];
  officeList: Office[] = [];
  industryList: industry[] = [];
  likelihoodList: any[] = []
  TeamSizeSelectList: TeamSize[] = [];
  teamSizeList: TeamSize[] = [];
  minDate: Date = new Date();
  oldRegistrationId: number;
  teamSizeMaxSelectCount = 5;
  addMoreInTeamSizeList = true;
  oldOpportunityData:any;
  constructor(private manualFormBuilder: AddPegOppFormBuilder, private staffingService: StaffingService,
    private staffingCreationService: StaffingCreationService,
    private core: CoreService, private router: Router, private route: ActivatedRoute,
    private toastr: ToastrService) {
    if (this.route != undefined && this.route.params != undefined) {


      this.route.params.subscribe((data) => {
        if (data != undefined) {
          const state = this.router.getCurrentNavigation().extras.state;
          if (state) {
            this.oldRegistrationId = state.registrationId;
          }

        }
      });
    }
    this.clientTypeAhead.pipe(
      tap(() => { this.isClientLoading = true; this.clientList = []; }),
      debounceTime(200),
      switchMap(term => this.staffingService.getClientsByName(term)),
      tap(() => this.isClientLoading = false)
    ).subscribe(items => {
      this.clientList = items;
      this.clientList.forEach(element => {
        element.customGroup = element.accountType == 'Client Account' ? 'Active' : 'Basic';
      });

      let Active = this.clientList.filter(group => group.customGroup == 'Active');
      let Basic = this.clientList.filter(group => group.customGroup == 'Basic');
      items = [];

      let ActiveSorted = [];
      let BasicSorted = [];
      ActiveSorted = Active;
      BasicSorted = Basic;
      ActiveSorted.push(...BasicSorted);
      this.clientList = ActiveSorted;
    });


    this.sellingPartnerTypeAhead.pipe(
      tap(() => { this.isSellingPartnerLoading = true; this.sellingPartnerList = []; }),
      debounceTime(200),
      switchMap(term => this.staffingService.getEmployeeByName(term == undefined || term == null || term == '' ? 'a' : term.toString().trim(), LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, false, false,)),
      tap(() => this.isSellingPartnerLoading = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });
      this.sellingPartnerList = items;
    });

    this.svpTypeAhead.pipe(
      tap(() => { this.isSVPLoading = true; this.svpList = []; }),
      debounceTime(200),
      switchMap(term => this.staffingService.getEmployeeByName(term == undefined || term == null || term == '' ? 'a' : term.toString().trim(), LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, false, false,)),
      tap(() => this.isSVPLoading = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });
      this.svpList = items;
    });


    this.ovpTypeAhead.pipe(
      tap(() => { this.isOVPLoading = true; this.ovpList = []; }),
      debounceTime(200),
      switchMap(term => this.staffingService.getEmployeeByName(term == undefined || term == null || term == '' ? 'a' : term.toString().trim(), LEVEL_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, false, false,)),
      tap(() => this.isOVPLoading = false)
    ).subscribe(items => {
      items.forEach(element => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
        element.searchableName += element.statusCode == 'L' ? ' (Leave)' : '';
      });
      this.ovpList = items;
    });
  }


  ngOnInit(): void {
    this.bsConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-red',
      adaptivePosition: true,
      showWeekNumbers: false
    };

    this.setSelectOptions();
    //calling all offices api to cache the data
    this.staffingService.getAllOffice().subscribe(data => { });
  }

  validateDurationKeys(event) {
    CommonMethods.ValidateKeysForDuration(event);
  }
  onClose() {
    this.router.navigate(['staffing/' + this.oldRegistrationId]);
  }
  onAddManualOpportunity() {
    this.isManualOpportunityPage = true;
    this.isSearchedOpportunityExists = false;

  }
  searchOpportunity(event) {
    let searchText = event;
    if (searchText.length > 2) {
      this.staffingService.searchOpportunityStaffing(searchText).subscribe((data) => {
        this.opportunityList = data;
      });
    } else {
      this.opportunityList = [];
    }
  }
  addOpportunityToPipeline(opportunity) {
    this.opportunityList = [];
    this.searchRegValue = undefined;
    // Call api to get details and then navigate to the page
    this.staffingService.getPegDetails(opportunity.registrationId).subscribe((res: PegDetails) => {
      this.oldOpportunityData = _.cloneDeep(res);
      this.addPegOppForm.patchValue({
        industry: this.industryList.find(e => e.industryId == res.industry[0]?.industryId),
        client: res.client[0],
        projectName: res.projectName,
        expectedStartDate: res.expectedStart != null && res.expectedStart != undefined && res.expectedStart.trim() != "" ? moment(res.expectedStart).format("DD-MMM-YYYY") : undefined,
        likelihood: res.likelihood,
        teamSize: this.getTeamSizeSelectValues(res.teamSize),
        officeToBeStaffed: res.officeToBeStaffed,
        duration: res.duration,
        sellingPartner: CommonMethods.assignSearchableName(res.sellingPartner),
        svp: CommonMethods.assignSearchableName(res.svp),
        ovp: CommonMethods.assignSearchableName(res.ovp),
        registrationId: res.registrationId,
        pipelineId:res.pipelineId,
        opportunityTypeDetails:res.opportunityTypeDetails
      })
      this.selectedOfficesToBeStaffed = res.officeToBeStaffed;
      this.addPegOppForm.get('industry').disable();
      this.addPegOppForm.get('client').disable();
      this.isSearchedOpportunityExists = true;
      this.isManualOpportunityPage = true;
    });



  }
  onOpportunityTypeDetailsChange(event){
    this.addPegOppForm.get('opportunityTypeDetails').setValue(event);
  }
  goBackToSearchOpportunityPage() {
    this.opportunityList = [];
    this.searchRegValue = undefined;
    this.isManualOpportunityPage = false;
    this.isSearchedOpportunityExists = false;
    this.oldOpportunityData = undefined;
    this.addPegOppForm.get('industry').enable();
    this.addPegOppForm.get('client').enable();
    this.addPegOppForm.reset();
    this.mainForm.reset();

  }
  setSelectOptions() {


    combineLatest([
      this.staffingService.getLikelihood(),
      this.staffingService.getIndustrySectors(),
    ]).subscribe(([likelihoodList, industries]) => {
      this.likelihoodList = likelihoodList;
      this.industryList = industries.filter(e => e.isTopIndustry == true);
    });
    this.staffingService.getTeamSize().subscribe(teamSizeList => {
      this.teamSizeList = teamSizeList ?? [];
      this.TeamSizeSelectList = this.generateTeamSizeSelectLists(this.teamSizeList);
    });

  }
  updateOfficeSelection(offices: Office[]) {
    this.addPegOppForm.get('officeToBeStaffed').patchValue(offices);
  }

  onClearTeamSize() {
    this.TeamSizeSelectList = this.generateTeamSizeSelectLists(this.teamSizeList);
    this.setTeamSizeMaxFlag();

  }

  onRemoveTeamSize(event) {
    if(event){
      this.TeamSizeSelectList = this.TeamSizeSelectList.filter(x=>x.teamSizeSelectId != event.teamSizeSelectId);
      this.setTeamSizeMaxFlag();
    }
  }
  
  

  onSubmit(form: NgForm) {

    if (this.mainForm.valid) {
      this.addPegOppForm.get('expectedStartDate').patchValue(moment(this.addPegOppForm.get('expectedStartDate').value).format('YYYY-MM-DD'));
      this.addPegOppForm.get('submittedBy').patchValue(this.core.loggedInUser);
      let teamSizeValues = this.addPegOppForm.get('teamSize').value;
      let teamSizeObjList = [];
      if (teamSizeValues) {
        teamSizeValues.forEach((element )=> {
          let item = this.TeamSizeSelectList.find(x => x.teamSizeSelectId == element);
          const { teamSizeSelectId, ...newObj } = item; // Excludes team size select id
          teamSizeObjList.push(newObj);
        });
        this.addPegOppForm.get('teamSize').setValue(teamSizeObjList);
      }
      this.staffingCreationService.insertNewStaffingOpportunity(this.addPegOppForm.getRawValue(),this.oldOpportunityData).subscribe((res) => {
        this.toastr.success('Please refresh the application to see the new planning card');
        this.onClose();
      });
    }
  }
  onTeamSizeChange(event){
    if(this.addMoreInTeamSizeList){
      this.updateBackupTeamSizeList(event)
    }
  }
  generateTeamSizeSelectLists(teamSize,index = 0){
    let selectList = []
   
      teamSize.forEach((element) => {
        selectList.push(
          {
            ...element,
            teamSizeSelectId :index
          }
        )
        index++;
      });
    return selectList;
  }
  getTeamSizeSelectValues(selectedTeamSize){
    let teamSizeSelectValues = [];
    selectedTeamSize.forEach((element)=>{

      let latestTeamSize = this.TeamSizeSelectList.sort((a, b) => a.teamSizeSelectId - b.teamSizeSelectId).reverse().find((x)=>x.teamSizeId == element.teamSizeId);
      teamSizeSelectValues.push({
        teamSizeId:element.teamSizeId,
        teamSizeSelectId:latestTeamSize.teamSizeSelectId
      })    
      this.updateBackupTeamSizeList(latestTeamSize)
      
    })
    return teamSizeSelectValues.map((x)=>x.teamSizeSelectId);
  }
  updateBackupTeamSizeList(element){
    let mxaxSelectId = this.TeamSizeSelectList.reduce((prev, current) => (prev.teamSizeSelectId > current.teamSizeSelectId ? prev : current)).teamSizeSelectId;
    let currentItem = JSON.parse(JSON.stringify(element));
    currentItem.teamSizeSelectId = mxaxSelectId + 1
    this.TeamSizeSelectList = [...this.TeamSizeSelectList,currentItem] 
    this.TeamSizeSelectList.sort((a, b) => a.sortOrder - b.sortOrder);
    this.setTeamSizeMaxFlag();
    
  }
  setTeamSizeMaxFlag(){
    if(this.addPegOppForm?.get('teamSize')?.value?.length == this.teamSizeMaxSelectCount){
      this.addMoreInTeamSizeList = false;
    }
    else{
      this.addMoreInTeamSizeList = true;
    }
  }
}
