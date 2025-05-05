import * as moment from "moment";
import { AdditionalServices } from "../../../shared/interfaces/additionalServices";
import { CaseInfo } from "../../../shared/interfaces/caseInfo";
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { CommonMethods } from "../../../shared/common/common-methods";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { debounceTime, switchMap, tap } from "rxjs/operators";
import { dealMBStatus } from "../../../shared/enums/deal-mbStatus.enum";
import { DealsService } from "../../../deals/deals.service";
import { Employee, RegistrationStage } from "../../../shared/interfaces/models";
import { EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from "../../../shared/common/constants";
import { Field } from "../../../shared/enums/Fields";
import { FormatTimeZone } from "../../../shared/formatTimeZone.pipe";
import { GlobalService } from "../../../global/global.service";
import { industry } from "../../../shared/interfaces/industry";
import { Likelihood, Pipeline } from "../../pipeline";
import { Office } from "../../../shared/interfaces/office";
import { Partner } from "../../../shared/interfaces/partner";
import { PipelineService } from "../../pipeline.service";
import { Priority } from "../../../shared/interfaces/priority";
import { forkJoin, Subject } from "rxjs";
import { TeamSize } from "../../../shared/interfaces/teamSize";
import { PipelineBucketMapping } from "../../pipelineBucketMapping";
import { PipelineLocation } from "../../../shared/interfaces/pipelineLocation";
import * as _ from 'lodash';
import { Client } from "../../../shared/interfaces/client";
import { NewOpportunityService } from "../../../opportunity/new-opportunity/new-opportunity.service";
import { PegTostrService } from "../../../core/peg-tostr.service";
import { NgSelectComponent } from "@ng-select/ng-select";
import { PartnersDetails } from "../../../shared/interfaces/partnersDetails";
import { OpsLikelihood } from "../../../shared/interfaces/opsLikelihood";
import { UpdateStageModalComponent } from "../../../shared/update-stage-modal/update-stage-modal.component";
import { RegistrationClosedInfo } from "../../../registrations/registrationClosedInfo";
import { BsModalService } from "ngx-bootstrap/modal";
import { RegistrationService } from "../../../registrations/registrations/registration.service";
import { Router } from "@angular/router";
import { OpsLikelihoodEnum } from "../../../shared/enums/OpsLikelihood.enum";
import { AddPlaceholderToDealComponent } from "./add-placeholder-to-deal/add-placeholder-to-deal.component";
import { Region } from "../../../shared/enums/region";
import { OpportunityTypeDetail } from "../../../shared/interfaces/opportunityTypeDetail";

@Component({
    selector: "app-opp-edit",
    templateUrl: "./opp-edit.component.html",
    styleUrls: ["./opp-edit.component.scss"]
})
export class OppEditComponent implements OnInit {
    /* Opportunity is a private variable with a getter and setter to handle when the opportunity changes */

    @Input() opportunity: any;
    @Input() oppNameFields: any;
    @Input() isConflicted: boolean;
    @Input() weeklyBucket: any;
    @Input() showPanel: boolean = false;

    @Output() emitPipelineValue = new EventEmitter();
    @Output() emitAddRowinGrid = new EventEmitter();

    @ViewChild("calendar_expectedStart") public calendar_expectedStart: ElementRef<HTMLElement>;
    @ViewChild("calendar_latestStart") public calendar_latestStart: ElementRef<HTMLElement>;
    @ViewChild("client_selector") public client_selector: NgSelectComponent;

    _formatTimeZone: FormatTimeZone;
    public opportunityValue: any;
    pipelineInfo: any;
    industries: industry[] = [];
    selectedIndustries = [];
    industrySectors: any;
    sectorsList: any[];
    subSectorsList: any[];
    selectedSectors: any[] = [];
    selectedSubSectors: any[] = [];
    priorities: Priority[] = [];
    selectedPriorities: Priority[] = [];
    services: AdditionalServices[] = [];
    additionalServices: any[] = [];
    clientCommitments: any;
    selectedclientCommitments;
    caseComplexity: any[] = [];
    selectedCaseComplexity = [];
    fieldName: string;
    newValue: any;
    duration: any;
    startDateComments: string;
    ovpComments: string = "";
    svpComments: string = "";
    targetDescription: string;
    opportunityTypeDetails:OpportunityTypeDetail
    teamComments: string;
    discount:string;
    mbStatus: string = "";
    isShow: boolean = false;
    panelWidth: number = 1250;
    pipelineValues: Pipeline;
    startDate: any;
    startDateDisplay: any;
    statusList: any[] = [];
    selectedLikelihood: Likelihood[] = [];
    oppLikelihoods: OpsLikelihood[];
    selectedOpsLikelihood: OpsLikelihood;
    oldOpsLikelihood: any
    teams: TeamSize[] = [];
    teamSize: any[] = [];
    latestStartDate: any;
    latestStartDateDisplay: any;
    selectedOffice = [];
    levelCode = LEVEL_STATUS_CODE;
    selectEmployeeTypeAhead = new Subject<string>();
    PeopleTagload = false;
    typeaheadEmployeeList: Employee[];
    selectedExpert;
    selectedOther;
    selectedSVP;
    selectedOperating;
    selectedSelling;
    selectedClientHead;
    requestedSM;
    isIncludeExternalEmployee: boolean = false;
    includeAllEmployee = true;
    target;
    notes;
    locationName;
    selectedlanguages: any[];
    languages: any;
    oppName = "";
    manager;
    employeeList: any;
    params: any;
    displayStyle = "block";
    workType;
    processInfo;
    retainerNotes: string;
    isSPAC = false;
    isPubliclyTradedEquity = false;
    isPubliclyTradedDebt = false;
    isCarveOut = false;
    isOpenMarketPurchase = false;
    readonly ConstatntField = Field;
    answers: any = [];
    selectedIsRetainer: any;
    selectedIsMBPartner: any;
    isOVPHelp = false;
    isSVPHelp = false;
    expandConflicts: boolean = false;
    // AG Grid for Conflicts Section
    rowData = [];
    columnDefs: ColDef[];
    gridApi: GridApi;
    gridColumnApi;
    gridOptions: GridOptions;
    defaultColDef: ColDef;
    selectedAllocatedOffice: any;
    selectedConflictedOffice: any;
    defaultCellStyle = {
        color: "#121212",
        "font-family": "Graphik",
        "font-size": "12px"
    };
    caseInfo: CaseInfo;
    public offices: Office[];
    isTreeVisible = false;
    isCaseCodeComponentEdit = false;
    clientLoad: boolean = false;
    clients: Client[] = [];
    client: Client;
    clientTypeAhead = new Subject<string>();
    isSelectingClient: boolean = true;
    isDisable: boolean = false;
    isRetainerValues = CommonMethods.getAnswerObject();

    constructor(
        private globalService: GlobalService,
        private pipelineService: PipelineService,
        private _dealService: DealsService,
        private newOpportunityService: NewOpportunityService,
        private toastr: PegTostrService,
        private modalService: BsModalService,
        private registrationService: RegistrationService,
        private route: Router

    ) {
        this.oppName = "";

        // Load AG Grid Configuration
        this.loadGridConfiguration();
        this.getEmployees(this.params);
        this.getClients();


    }
    officesToeBeStaffed: Office[] = [];
    openDealTracker(pipelineInfo) {
        const url = this.route.serializeUrl(
            this.route.createUrlTree([`/deals/deal/${pipelineInfo.dealId.toString()}`])
        );
        window.open(url, '_blank')

    }
    ngOnInit() {


        forkJoin([
            this.globalService.getIndustrySectors(),
            this.globalService.getAllIndustrySectorsSubSectors(),
            this.globalService.getPriority(),
            this.globalService.getPipelineStatus(),
            this.globalService.getTeamSize(),
            this.globalService.getAdditionalServices(),
            this.globalService.getClientCommitment(),
            this.globalService.getCaseComplexity(),
            this.globalService.getLanguages(),
            this.globalService.getOffice(),
            this.globalService.getOpsLikelihood(),
            this.globalService.getAllOffice()
        ]).subscribe(([industry, resIndSector, resPriorities, resLikelihood, resTeamSize, resAdditionalServices, resClientCommitments, resCaseComplexity, resLanguages, resOffice, resOpsLikelihood, allOffice]) => {

            this.industries = industry.filter((x) => x.isTopIndustry == true);
            this.industrySectors = resIndSector;
            this.priorities = resPriorities;
            this.statusList = resLikelihood;
            this.teamSize = resTeamSize;
            this.additionalServices = resAdditionalServices;
            this.clientCommitments = resClientCommitments;
            this.caseComplexity = resCaseComplexity;
            this.languages = resLanguages;
            this.offices = resOffice.filter(x=>x.regionId!=Region.Global);
            this.oppLikelihoods = resOpsLikelihood;
            this.answers = CommonMethods.getAnswerObject();

            if (this.opportunity && this.opportunity.registrationId) {
                this.expandConflicts = false;
                this.isCaseCodeComponentEdit = false;
                this.caseInfo = { caseCode: "", caseEndDate: "", caseId: 0, caseName: "", caseOffice: 0, caseOfficeName: "", caseStartDate: "", officeCluster: "" };
                this.getPipelineById(this.opportunity.registrationId);
            } else if (!this.weeklyBucket) {
                this.resetModal();
                if (this.pipelineInfo) {
                    this.pipelineInfo.client = {};
                }
                this.pipelineInfo = undefined;
            }

            if (this.showPanel == false) {
                this.isTreeVisible = false;
            }

            // Open client select when editing a new opportunity for the first time
            if (this.opportunity && this.opportunity?.client?.length == 0) {
                this.focusClientSelector();

                // Disable all fields except for client
                this.isSelectingClient = true;
            } else {
                this.isSelectingClient = false;
            }

        });
    }
    onConflictsClick() {
        this.expandConflicts = !this.expandConflicts;
        this.rowData = [];

        if (this.expandConflicts) {
            this.pipelineService.getRelatedTrackerClientsByRegistrationId(this.pipelineInfo.registrationId).subscribe(res => {
                this.rowData = res;
                this.rowData = this.rowData.sort((a, b) => { return CommonMethods.sortConflicts(a?.registrationStageId ?? 0, a, b) })
            })
        }
    }

    onCaseChange(event) {
        if (event && event.caseCode && event.caseCode?.trim() != '') {
            this.caseInfo = event;
            this.newValue = this.caseInfo;
        } else {
            this.caseInfo.caseCode = "";
            this.caseInfo.caseName = "";
            this.caseInfo.caseStartDate = "";
            this.caseInfo.caseEndDate = "";
            this.caseInfo.caseOffice = 0;
            this.caseInfo.caseOfficeName = "";
            this.caseInfo.officeCluster = "";
        }
        this.pipelineInfo.case = this.caseInfo;
        // Implement stage automation, update stage based on case end date 
        let updatedStage = CommonMethods.getStageBasedOnCase(this.caseInfo);
        if (updatedStage) {
            this.pipelineInfo.registrationStage = updatedStage;
        }
        this.fieldName = Field.caseInfo;
        this.updatePipeline();
    }



    focusClientSelector() {
        let selectorInterval = setInterval(() => {
            if (this.client_selector) {
                this.client_selector.open();
                clearInterval(selectorInterval);
            }
        }, 1000);
    }
    duplicateOpportunity() {
        this.isDisable = true;
        let registrationId = this.pipelineInfo.registrationId;
        this.pipelineInfo = undefined;
        this.opportunity = undefined;
        this.pipelineService.clonePipelineOpportunity(registrationId).subscribe((res) => {
            this.isDisable = false;
            if (res && !res.isRemoveRecordFromGrid) {
                this.opportunity = JSON.parse(JSON.stringify(res));
                this.pipelineInfo = JSON.parse(JSON.stringify(res));
                this.caseInfo = this.pipelineInfo.case;
                this.isCaseCodeComponentEdit = true;


                if (this.pipelineInfo && !this.pipelineInfo.target) {
                    this.pipelineInfo.target = [];
                }

                this.mapSelectedValue();
                this.getOppName();

                this.emitAddRowinGrid.emit(res);
            }
        });
    }
    onGridReady(params) {
        params.api.sizeColumnsToFit();

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    loadGridConfiguration() {
        this.gridOptions = <GridOptions>{
            context: {
                componentParent: this
            },
            stopEditingWhenCellsLoseFocus: true,
            singleClickEdit: false,
            suppressAggFuncInHeader: true,
            headerHeight: 40,

        };

        this.defaultColDef = {
            filter: false,
            flex: 1,
            suppressMenu: true
        };

        this.columnDefs = [
            { field: "clientName", cellStyle: this.defaultCellStyle },
            {
                field: "stageTypeName",
                headerName: "Stage",
                maxWidth: 190,
                cellStyle: this.defaultCellStyle,
                sortable: true
            },
            {
                field: "caseCode",
                maxWidth: 140,
                cellStyle: this.defaultCellStyle
            },
            {
                field: "caseStartDate",
                headerName: "Case Start Date",
                cellRenderer: (data) => {
                    // Format date
                    if (data.value) {
                        return moment(data.value).format("DD-MMM-YYYY");
                    }
                },
                maxWidth: 170,
                cellStyle: this.defaultCellStyle
            },
            {
                field: "caseEndDate",
                headerName: "Case End Date",
                cellRenderer: (data) => {
                    // Format date
                    if (data.value) {
                        return moment(data.value).format("DD-MMM-YYYY");

                    }
                },
                maxWidth: 170,
                cellStyle: this.defaultCellStyle
            },
            { field: "officeName", headerName: "Managing Office", maxWidth: 210, cellStyle: this.defaultCellStyle }
        ];


    }



    openConflictsModal(caseCodeData) {
        // console.log("Case Code", caseCodeData);
    }

    getConflictIconColor() {

        if (this.pipelineInfo.mbStatus?.mbStatusId == dealMBStatus.ActiveMB) {
            return "red-color";
        } else if (this.pipelineInfo.mbStatus?.mbStatusId == dealMBStatus.PotentialMB) {
            return "blue-color";
        }
        else {
            return "gray-color";
        }

    }

    getEmployees(params) {
        this.params = params;
        this.selectEmployeeTypeAhead
            .pipe(
                tap(() => {
                    this.PeopleTagload = true;
                }),
                debounceTime(200),
                switchMap((term) =>
                    this._dealService.getEmployeeByName(
                        term == undefined || term == null ? "" : term.toString().trim(),
                        this.levelCode,
                        EXPERT_PARTNER_LEVELGRADE,
                        this.includeAllEmployee,
                        this.isIncludeExternalEmployee
                    )
                ),
                tap(() => (this.PeopleTagload = false))
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
                this.employeeList = items;
            });
    }






    getTeamSize() {
        this.globalService.getTeamSize().subscribe((r) => {
            this.teamSize = r;
        });
    }


    getClients() {
        this.clientTypeAhead.pipe(
            tap(() => { this.clientLoad = true; this.clients = []; }),
            debounceTime(200),
            switchMap(term => this.newOpportunityService.getClientsByName(term == undefined || term == null ? '' : term.toString().trim())),
            tap(() => this.clientLoad = false)
        ).subscribe(items => {
            this.clients = items;
        });
    }



    getPipelineById(registrationId) {
        this.pipelineService.getPipelineById(registrationId).subscribe((res) => {
            if (res) {
                this.pipelineInfo = res;
                this.caseInfo = this.pipelineInfo.case;

                //Case code info - Assign values on new opportunity details load
                this.isCaseCodeComponentEdit = true;


                if (this.pipelineInfo && !this.pipelineInfo.target) {
                    this.pipelineInfo.target = [];
                }

                this.mapSelectedValue();
                this.getOppName();
            }
        });
    }

    AddNewTeamSizeItem(element) {
        let IdArr: number[] = JSON.parse(JSON.stringify(this.teamSize.map(x => x.teamSizeId)))
        let max = Math.max(...IdArr);
        element.teamSizeId = max + 1;

        let currentItem: TeamSize = { sortOrder: 0, teamSize: "", teamSizeId: 0 };
        currentItem.teamSizeId = max + 1;
        currentItem.sortOrder = element.sortOrder;
        currentItem.teamSize = element.teamSize;
        this.teamSize = [...this.teamSize, currentItem].sort((a, b) => {
            return a.sortOrder - b.sortOrder;
        });
    }

    mapSelectedValue() {
        this.resetModal();
        if (this.pipelineInfo?.officeToBeStaffed && this.pipelineInfo?.officeToBeStaffed.length > 0) {
            this.officesToeBeStaffed = this.pipelineInfo?.officeToBeStaffed
        }
        this.isTreeVisible = true;
        if (this.pipelineInfo && this.pipelineInfo.industries && this.pipelineInfo.industries.length > 0) {
            let industries = this.pipelineInfo.industries[0];
            this.selectedIndustries = industries;
        }
        this.selectedSectors = [];
        this.selectedSubSectors = [];
        if (this.pipelineInfo.industries && this.pipelineInfo.industries.length) {
            this.sectorsList = this.industrySectors.sectors.filter(
                (e) => e.industryId == this.pipelineInfo?.industries[0]?.industryId
            );
        }
        if (
            this.pipelineInfo?.sector &&
            this.pipelineInfo?.sector.length > 0 &&
            this.sectorsList &&
            this.sectorsList.length > 0
        ) {
            var tempSectors = [];
            this.pipelineInfo.sector.forEach((eachSector) => {
                if (this.sectorsList.find((w) => w.sectorId == eachSector.industryId))
                    tempSectors.push(this.sectorsList.find((w) => w.sectorId == eachSector.industryId));
            });
            this.selectedSectors = tempSectors;
        }
        if (this.pipelineInfo.teamSize && this.pipelineInfo.teamSize.length > 0) {

            function compare(fields, a, b) {
                for (let field of fields) {
                    if (a[field] < b[field]) return -1;
                    if (a[field] > b[field]) return 1;
                }
                return 0;
            }

            const orderBy = (data, ...fields) =>
                [...data].sort(compare.bind(null, fields));

            const partitionBy = (data, ...fields) =>
                // Will not order the data before partitioning
                data.reduce((acc, row) => {
                    if (acc.length && !compare(fields, acc[acc.length - 1][0], row)) {
                        acc[acc.length - 1].push(row);
                    } else {
                        acc.push([row]);
                    }
                    return acc;
                }, []);

            const rowNumber = (data, alias = "rownumber") =>
                Array.isArray(data[0]) // partitioned ? recur for each!
                    ? data.map(row => rowNumber(row, alias))
                    : data.map((row, i) => ({ ...row, [alias]: i + 1 })); // base case

            let result = rowNumber(partitionBy(orderBy(this.pipelineInfo.teamSize, "teamSizeId"), // fields to order by
                "teamSizeId"// fields to partition by
            ),
                "count" // The alias for the additional row-number column
            ).flat(); // Finally flatten away the partitions

            this.pipelineInfo.teamSize = result;
            this.pipelineInfo.teamSize.forEach((element, i) => {
                this.AddNewTeamSizeItem(element);


            });
            this.teams = this.pipelineInfo.teamSize.map(x => x.teamSizeId);

        }
        if (this.pipelineInfo && this.pipelineInfo?.likelihood?.likelihoodId > 0) {
            this.selectedLikelihood = this.pipelineInfo.likelihood;
        }

        this.oldOpsLikelihood = JSON.parse(JSON.stringify(this.pipelineInfo?.opsLikelihood));
        if (this.pipelineInfo?.opsLikelihood && this.pipelineInfo?.opsLikelihood?.opsLikelihoodId > 0) {
            this.selectedOpsLikelihood = this.pipelineInfo.opsLikelihood;
        }
        else {
            this.selectedOpsLikelihood = null;
        }
        if (this.pipelineInfo.workType) {
            this.workType = this.pipelineInfo.workType.workTypeName;
        }
        if (this.pipelineInfo.sector != undefined && this.pipelineInfo.sector.length > 0) {
            this.subSectorsList = [];
            this.selectedSectors.forEach((currInd) => {
                let tp = this.industrySectors.subSectors.filter((is) => is.sectorId == currInd.sectorId);
                if (tp != undefined) this.subSectorsList = this.subSectorsList.concat(tp);
            });
        }
        if (
            this.pipelineInfo?.subSector &&
            this.pipelineInfo?.subSector.length > 0 &&
            this.subSectorsList &&
            this.sectorsList.length > 0
        ) {
            var tempSubSectors = [];
            this.pipelineInfo.subSector.forEach((eachSector) => {
                if (this.subSectorsList.find((w) => w.subSectorId == eachSector.industryId))
                    tempSubSectors.push(this.subSectorsList.find((w) => w.subSectorId == eachSector.industryId));
            });
            this.selectedSubSectors = tempSubSectors;
        }
        if (this.pipelineInfo?.mbStatus) {
            if (this.pipelineInfo.mbStatus.mbStatusId == dealMBStatus.SingleRegistration) {
                this.mbStatus = "N";
            } else if (
                this.pipelineInfo.mbStatus.mbStatusId == dealMBStatus.ActiveMB ||
                this.pipelineInfo.mbStatus.mbStatusId == dealMBStatus.PotentialMB
            ) {
                this.mbStatus = "Y";
            }
        }

        if (this.pipelineInfo.expectedStart?.expectedStartDate) {
            let dateVal = this.pipelineInfo.expectedStart.expectedStartDate;

            if (dateVal.split) {
                dateVal = dateVal.split("T")[0]; // Necessary to obtain raw date string without timezone
            }

            this.startDate = moment(dateVal).toDate();
            this.startDateDisplay = moment(dateVal).format("DD-MMM-YYYY");
        }
        if (this.pipelineInfo.latestStartDate) {
            let dateVal = this.pipelineInfo.latestStartDate;
            if (dateVal.split) {
                dateVal = dateVal.split("T")[0]; // Necessary to obtain raw date string without timezone
            }
            this.latestStartDate = moment(dateVal).toDate();
            this.latestStartDateDisplay = moment(dateVal).format("DD-MMM-YYYY");
        }
        if (this.pipelineInfo.othersInvolved) {
            this.selectedOther = this.pipelineInfo.othersInvolved;
            this.selectedOther.map((element) => {
                element.searchableName = CommonMethods.getEmployeeName(element);
            });
        }

        if (this.pipelineInfo.sellingPartner) {
            this.selectedSelling = this.pipelineInfo.sellingPartner;
            this.selectedSelling.map((element) => {
                element.searchableName = CommonMethods.getEmployeeName(element);
            });
        }

        if (this.pipelineInfo.operatingPartner) {
            this.ovpComments = this.pipelineInfo.operatingPartner.comments
            if (this.pipelineInfo.operatingPartner?.partners) {
                this.selectedOperating = this.pipelineInfo.operatingPartner.partners;
                this.selectedOperating.map((element) => {
                    element.searchableName = CommonMethods.getEmployeeName(element);
                });
            }
        }
        if (this.pipelineInfo.svp) {
            this.svpComments = this.pipelineInfo.svp.comments
            if (this.pipelineInfo.svp?.partners) {
                this.selectedSVP = this.pipelineInfo.svp.partners;
                this.selectedSVP.map((element) => {
                    element.searchableName = CommonMethods.getEmployeeName(element);
                });
            }
        }
        if (this.pipelineInfo.requestedSM) {
            this.requestedSM = this.pipelineInfo.requestedSM;
            this.requestedSM.map((element) => {
                element.searchableName = CommonMethods.getEmployeeName(element);
            });
        }


        if (this.pipelineInfo.manager) {
            this.manager = CommonMethods.getEmployeeName(this.pipelineInfo.manager);
        }
        if (this.pipelineInfo.clientHead) {
            let partnerList = CommonMethods.getEmployeeNameList(this.pipelineInfo.clientHead);
            this.selectedClientHead = partnerList.join(",");
        }
        if (this.pipelineInfo.targetDescription) {
            this.targetDescription = this.pipelineInfo.targetDescription;
        }
        if (this.pipelineInfo.opportunityTypeDetails) {
            this.opportunityTypeDetails = this.pipelineInfo.opportunityTypeDetails;
        }
        if (this.pipelineInfo.teamComments) {
            this.teamComments = this.pipelineInfo.teamComments;
        }
        if (this.pipelineInfo.discount) {
            this.discount = this.pipelineInfo.discount;
        }
        if (this.pipelineInfo.duration) {
            this.duration = this.pipelineInfo.duration;
        }
        if (this.pipelineInfo.customPriority && this.pipelineInfo.customPriority.length) {
            this.selectedPriorities = this.pipelineInfo.customPriority[0];
        }
        if (this.pipelineInfo.target) {
            this.target = this.pipelineInfo.target.targetName;
        }
        if (this.pipelineInfo.comments) {
            this.notes = this.pipelineInfo.comments;
        }
        if (this.pipelineInfo.expectedStart?.expectedStartDateNote) {
            this.startDateComments = this.pipelineInfo.expectedStart.expectedStartDateNote;
        }

        if (this.pipelineInfo?.locationOfDeal?.locationName) {
            this.locationName = this.pipelineInfo.locationOfDeal.locationName;
        }
        if (this.pipelineInfo?.requiredLanguage) {
            this.selectedlanguages = this.pipelineInfo.requiredLanguage;

            // Set selected langauges to an empty array if the server returns an array with a blank value
            if (this.selectedlanguages.length == 1 && this.selectedlanguages[0] == '') {
                this.selectedlanguages = [];
            }
        }
        if (this.pipelineInfo?.additionalServices && this.pipelineInfo.additionalServices.length > 0) {
            this.services = this.pipelineInfo.additionalServices;
        }
        if (this.pipelineInfo?.clientCommitment) {
            this.selectedclientCommitments = this.pipelineInfo.clientCommitment;
        }
        if (this.pipelineInfo?.caseComplexity && this.pipelineInfo.caseComplexity.length > 0) {
            this.selectedCaseComplexity = this.pipelineInfo.caseComplexity;
        }

        if (this.pipelineInfo?.targetType) {
            this.isCarveOut = this.pipelineInfo.targetType.carveOut;

            this.isPubliclyTradedEquity = this.pipelineInfo.targetType.isPubliclyTradedEquity;
            this.isPubliclyTradedDebt = this.pipelineInfo.targetType.isPubliclyTradedDebt;
            this.isOpenMarketPurchase = this.pipelineInfo.targetType.isOpenMarketPurchase;
        }
        if (this.pipelineInfo?.clientType) {
            this.isSPAC = this.pipelineInfo.clientType.isSpecialPurposeAcquisitionCompany;
        }
        if (this.pipelineInfo?.isRetainer) {
            this.selectedIsRetainer = this.isRetainerValues.find(v => v.value == this.pipelineInfo?.isRetainer);
        }
        if (this.pipelineInfo?.isMBPartner) {
            this.selectedIsMBPartner = this.pipelineInfo?.isMBPartner;
        }
        if (this.pipelineInfo?.conflictedOffice) {
            this.selectedConflictedOffice = this.pipelineInfo?.conflictedOffice.map((location) => {
                return location.office.officeCode;
            });
        }
        if (this.pipelineInfo?.allocatedOffice) {
            this.selectedAllocatedOffice = this.pipelineInfo?.allocatedOffice.map((location) => {
                return location.office.officeCode;
            });
        }
        this.isOVPHelp = this.pipelineInfo?.isOVPHelp;
        this.isSVPHelp = this.pipelineInfo?.isSVPHelp;

        if (this.pipelineInfo?.client?.length > 0) {
            this.client = this.pipelineInfo?.client[0];
        }
        this.retainerNotes = this.pipelineInfo.retainerNotes;
        this.processInfo = this.pipelineInfo?.processInfo;
    }

    onChangeText(fieldName: string, value: any) {
        this.fieldName = fieldName;
        this.newValue = value;
        switch (fieldName) {
            case this.ConstatntField.targetName:
                // If target is an empty string, insert a placeholder object
                if (this.pipelineInfo.target == "") {
                    this.pipelineInfo.target = { targetId: 0, targetName: "" };
                }
                this.pipelineInfo.target.targetName = value;

                // Assign a placeholder target ID if one doesn't exist
                if (!this.pipelineInfo?.target?.targetId) {
                    this.pipelineInfo.target.targetId = 0;
                }
                break;
            case this.ConstatntField.comments:
                this.pipelineInfo.comments = value;
                break;
            case this.ConstatntField.teamComments:
                this.pipelineInfo.teamComments = value;
                break;
            case this.ConstatntField.discount:
                this.pipelineInfo.discount = value;
                break;
            case this.ConstatntField.startDateComments:

                if (value == "") {
                    this.pipelineInfo.expectedStart.expectedStartDateNote = null;
                }
                else {
                    this.pipelineInfo.expectedStart.expectedStartDateNote = value;
                }
                break;
            case this.ConstatntField.processInfo:
                this.pipelineInfo.processInfo = value;
                break;
            case this.ConstatntField.retainerNotes:
                this.pipelineInfo.retainerNotes = value;
                break;


        }
        this.updatePipeline();
    }

    onIndustryChange(fieldName: string, event) {
        this.sectorsList = [];
        let tempSectors = [];

        if (event) {
            tempSectors = tempSectors.concat(
                this.industrySectors.sectors.filter((e) => e.industryId == event.industryId)
            );
            this.pipelineInfo.industries = [this.selectedIndustries];
        } else {
            this.pipelineInfo.industries = [];
        }
        this.mapSelectedValue();
        this.sectorsList = tempSectors;
        this.newValue = [this.selectedIndustries];

        this.fieldName = fieldName;
        this.updatePipeline();
    }

    onSectorChange(fieldName: string, event) {
        this.sectorSubSectorMap();
        if (event != undefined) {
            this.subSectorsList = [];
            event.forEach((currInd) => {
                let tp = this.industrySectors.subSectors.filter((is) => is.sectorId == currInd.sectorId);
                if (tp != undefined) this.subSectorsList = this.subSectorsList.concat(tp);
            });
            if (this.subSectorsList && this.subSectorsList.length == 0) {
                this.selectedSubSectors = [];
            } else if (
                this.pipelineInfo?.subSector &&
                this.pipelineInfo?.subSector.length > 0 &&
                this.subSectorsList &&
                this.sectorsList.length > 0
            ) {
                var tempSubSectors = [];
                this.pipelineInfo.subSector.forEach((eachSector) => {
                    if (this.subSectorsList.find((w) => w.subSectorId == eachSector.industryId))
                        tempSubSectors.push(this.subSectorsList.find((w) => w.subSectorId == eachSector.industryId));
                });
                this.selectedSubSectors = tempSubSectors;
            }
        }

        this.fieldName = fieldName;
        this.updatePipeline();
    }

    onSubSectorChange(fieldName: string) {
        this.sectorSubSectorMap();
        this.fieldName = fieldName;
        this.updatePipeline();
    }

    sectorSubSectorMap() {
        let sector = [];
        this.selectedSectors.forEach((eachSector) => {
            sector.push({ industryId: eachSector.sectorId, industryName: eachSector.sectorName });
        });

        let subSector = [];
        if (sector && sector.length > 0) {
            this.selectedSubSectors.forEach((eachSubSector) => {
                if (sector.find((w) => w.industryId == eachSubSector.sectorId))
                    subSector.push({
                        industryId: eachSubSector.subSectorId,
                        industryName: eachSubSector.subSectorName
                    });
            });
        }
        this.newValue = JSON.parse(JSON.stringify({ sector: sector, subSector: subSector }));
        this.pipelineInfo.sector = sector;
        this.pipelineInfo.subSector = subSector;
    }

    onPriorityChange(fieldName: string) {
        this.fieldName = fieldName;
        this.newValue = this.selectedPriorities;
        this.pipelineInfo.customPriority[0] = this.selectedPriorities;
        this.updatePipeline();
    }
    validateDurationKeys(event) {
        CommonMethods.ValidateKeysForDuration(event);
    }

    onDurationChange(fieldName: string, event) {
        let value = event?.target?.value;
        if (event && CommonMethods.validateDurationInfo(value)) {
            this.fieldName = fieldName;
            this.pipelineInfo.duration = value;
            this.newValue = value;
            this.updatePipeline();
        }
        else {
            this.toastr.showWarning('Invalid Duration: Only Number/Decimal allowed', 'Warning');
            this.duration = this.pipelineInfo?.duration;
        }
    }

    onAdditionalInfoChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.targetDescription = value;
        this.newValue = value;
        this.updatePipeline();
    }
    onOpportunityTypeDetailsChange(fieldName: string, value){
        this.fieldName = fieldName;
        this.pipelineInfo.opportunityTypeDetails = value;
        this.newValue = value;
        this.updatePipeline();
    }
    onLikelihoodChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.likelihood = value;
        this.newValue = value;
        this.updatePipeline();
    }


    onIsRetainerChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.isRetainer = value;
        this.newValue = value;
        this.updatePipeline();
    }

    onWorkTypeChange(fieldName: string, value) { }
    onRemoveTeamSize(fieldName: string, event) {
        this.teamSize = [...this.teamSize.filter(x => x.teamSizeId != event?.teamSizeId)]
        this.globalService.getTeamSize().subscribe(res => {
            let teamData = []
            this.teams.forEach(element => {
                let item = this.teamSize.find(x => x.teamSizeId == element)
                teamData.push(JSON.parse(JSON.stringify(item)));
            });

            teamData.forEach(element => {
                let item = res.find(x => x.teamSize == element.teamSize)
                element.teamSizeId = item.teamSizeId;
            });
            this.fieldName = fieldName;
            this.pipelineInfo.teamSize = teamData;
            this.newValue = teamData;
            this.updatePipeline();
        })
    }
    onClearAll(fieldName: string, event) {
        this.globalService.getTeamSize().subscribe(r => {
            this.teamSize = r;
            this.fieldName = fieldName;
            this.pipelineInfo.teamSize = [];
            this.newValue = [];
            this.updatePipeline();
        })


    }
    onTeamSizeChange(fieldName: string, value) {
        let item = value;
        let IdArr: number[] = JSON.parse(JSON.stringify(this.teamSize.map(x => x.teamSizeId)))
        let max = Math.max(...IdArr);
        let currentItem: TeamSize = { sortOrder: 0, teamSize: "", teamSizeId: 0 };
        currentItem.teamSizeId = max + 1;
        currentItem.sortOrder = item.sortOrder;
        currentItem.teamSize = item.teamSize;
        this.teamSize = [...this.teamSize, currentItem].sort((a, b) => {
            return a.sortOrder - b.sortOrder;
        });

        this.globalService.getTeamSize().subscribe(res => {
            let teamData = []
            this.teams.forEach(element => {
                let item = this.teamSize.find(x => x.teamSizeId == element)
                teamData.push(JSON.parse(JSON.stringify(item)));
            });

            teamData.forEach(element => {
                let item = res.find(x => x.teamSize == element.teamSize)
                element.teamSizeId = item.teamSizeId;
            });
            this.fieldName = fieldName;
            this.pipelineInfo.teamSize = teamData;
            this.newValue = teamData;
            this.updatePipeline();
        })


    }
    onAllocatedOfficeChange(fieldName: string, value) {
        let allocatedList = [];
        this.selectedAllocatedOffice.map((office) => {
            if (value) {
                this.offices.filter(x => x.officeCode == office).forEach((eachLocation) => {
                    let newLocation: PipelineLocation = {
                        locationType: 3,
                        office: eachLocation,
                        pipelineLocationId: 0,
                        pipelineId: this.pipelineInfo.pipelineId
                    }
                    allocatedList.push(_.omit(newLocation, ['pipelineLocationId']));
                });
            }
        })
        this.fieldName = fieldName;
        this.pipelineInfo.AllocatedOffice = allocatedList;
        this.newValue = allocatedList;
        this.updatePipeline();
    }
    onConflictedOfficeChange(fieldName: string, value) {
        let conflictedList = [];
        this.selectedConflictedOffice.map((office) => {
            if (value) {
                this.offices.filter(x => x.officeCode == office).forEach((eachLocation) => {
                    let newLocation: PipelineLocation = {
                        locationType: 2,
                        office: eachLocation,
                        pipelineLocationId: 0,
                        pipelineId: this.pipelineInfo.pipelineId
                    }
                    conflictedList.push(_.omit(newLocation, ['pipelineLocationId']));
                });
            }
        })
        this.fieldName = fieldName;
        this.pipelineInfo.conflictedOffice = conflictedList;
        this.newValue = conflictedList;
        this.updatePipeline();
    }
    onAdditionalServicesChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.additionalServices = value;
        this.newValue = value;
        this.updatePipeline();
    }
    onClientCommitmentChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.clientCommitment = value;
        this.newValue = value;
        this.updatePipeline();
    }
    onCaseComplexityChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.caseComplexity = value;
        this.newValue = value;
        this.updatePipeline();
    }
    onRegistrationStageChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.registrationStage = value;
        this.newValue = value;
        this.updatePipeline();
    }

    onOpsLikelihoodChange(fieldName: string, value) {
        let bucketdata: any = this.weeklyBucket.filter((x) => x.pipelineBucketId == this.opportunity.pipelineBucketId);
        let pipelineData = bucketdata[0]?.pipelineBucketMapping.find(x => x.registrationId == this.opportunity.registrationId)
        if (bucketdata?.length == 0) // opp not linked to the  bucket
        {
            if ((value?.opsLikelihoodId == OpsLikelihoodEnum.Staffed || value?.opsLikelihoodId == OpsLikelihoodEnum.Confirmed_NearlyLocked)) {


                this.toastr.showWarning("The opportunity must be placed in a bucket", "Warning");
                setTimeout(() => {

                    if (this.oldOpsLikelihood && this.oldOpsLikelihood?.opsLikelihoodId > 0) {
                        this.selectedOpsLikelihood = this.oldOpsLikelihood;
                    }
                    else {
                        this.selectedOpsLikelihood = null;
                    }

                })
            } else {
                this.fieldName = fieldName;
                this.pipelineInfo.opsLikelihood = value;
                this.newValue = value;
                this.updatePipeline();
            }
        }
        else {
            let weeklybucket: any = this.weeklyBucket.find((x) => x.pipelineBucketId == pipelineData.pipelineBucketId);
            if (pipelineData.pipeline && weeklybucket) {
                let pipelineObject = pipelineData.pipeline;
                if (
                    pipelineObject?.expectedStart?.expectedStartDate &&
                    (weeklybucket.employee || weeklybucket.office?.officeCode != "0")
                ) {
                    this.fieldName = fieldName;
                    this.pipelineInfo.opsLikelihood = value;
                    this.newValue = value;
                    this.updatePipeline();
                }
                else {

                    setTimeout(() => {

                        if (this.oldOpsLikelihood && this.oldOpsLikelihood?.opsLikelihoodId > 0) {
                            this.selectedOpsLikelihood = this.oldOpsLikelihood;

                        }
                        else {
                            this.selectedOpsLikelihood = null;

                        }

                    })
                    this.toastr.showWarning("Fields Expected start Date, Location/Manager cannot be empty", "Warning");
                }

            }
            else {
                setTimeout(() => {

                    if (this.oldOpsLikelihood && this.oldOpsLikelihood?.opsLikelihoodId > 0) {
                        this.selectedOpsLikelihood = this.oldOpsLikelihood;
                    }
                    else {
                        this.selectedOpsLikelihood = null;
                    }

                })
                this.toastr.showWarning("The opportunity must be placed in a bucket", "Warning");

            }
        }

    }
    changeCalendarPosition(fieldName: string) {
        if (fieldName == "expectedStart") {
            this.calendar_expectedStart.nativeElement.appendChild(
                document.querySelectorAll("bs-datepicker-container")[0]
            );
        } else if (fieldName == "latestStartDate") {
            this.calendar_latestStart.nativeElement.appendChild(
                document.querySelectorAll("bs-datepicker-container")[0]
            );
        }
    }
    onDateChanged(fieldName: string, event) {
             if (fieldName == "expectedStart") {
                    if (this.getDateValue(event) == this.getDateValue(moment.utc(this.pipelineInfo?.expectedStart?.expectedStartDate))) {
         
                return;
            }
        } else if ((fieldName = "latestStartDate")) {
            if (this.getDateValue(event) == this.getDateValue(this.pipelineInfo?.latestStartDate!=undefined?
                 moment.utc(this.pipelineInfo?.latestStartDate):this.pipelineInfo?.latestStartDate)) {
                return;
            }
        }

        if (event != undefined && event != null && event != "Invalid Date") {
            this.fieldName = fieldName;
            this.newValue = moment.utc(moment(event).format("YYYY-MM-DD"));
            if (fieldName == "expectedStart") {            
                // Prevents this from triggering when the date is viewed by a non UTC timezone
                if (moment(event).format("YYYY-MM-DD") == moment.utc(this.pipelineInfo.expectedStart.expectedStartDate).format("YYYY-MM-DD")) {                
                    return;
                }

                this.pipelineInfo.expectedStart.expectedStartDate = this.newValue.toDate();
            } else if (fieldName == "latestStartDate") {
                // Prevents this from triggering when the date is viewed by a non UTC timezone
                if (moment(event).format("YYYY-MM-DD") == moment.utc(this.pipelineInfo.latestStartDate).format("YYYY-MM-DD")) {
                    return;
                }

                this.pipelineInfo.latestStartDate = this.newValue.toDate();
            }
        } else {
            this.fieldName = fieldName;
            this.newValue = "";
            if (fieldName == "expectedStart" && this.pipelineInfo) {
                this.pipelineInfo.expectedStart.expectedStartDate = null;
            } else if (fieldName == "latestStartDate" && this.pipelineInfo?.latestStartDate) {
                this.pipelineInfo.latestStartDate = null;
            }
        }
        this.updatePipeline();
    }

    OnEmployeechange(event, field) {
        if (this.typeaheadEmployeeList != undefined && this.typeaheadEmployeeList.length > 0) {
            let employee = this.typeaheadEmployeeList.find(
                (x) => x.searchableName == event[event.length - 1].searchableName
            );
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
                };

                this.pipelineInfo.bainOffice = employee.officeName;
                this.pipelineInfo.employeeCode = employee.employeeCode;

                if (field == "svp" || field == "operatingPartner") {
                    if (this.pipelineInfo && this.pipelineInfo[field] && this.pipelineInfo[field].partners) {
                        this.pipelineInfo[field].partners.push(tmpPartner)
                    }
                    else {
                        this.pipelineInfo[field] = new Object as PartnersDetails
                        this.pipelineInfo[field].partners = [];
                        this.pipelineInfo[field].partners.push(tmpPartner)
                        this.pipelineInfo[field].comments = field == "svp" ? this.svpComments : this.ovpComments;
                    }
                }
                else {
                    this.pipelineInfo[field].push(tmpPartner);
                    this.newValue = [this.pipelineInfo[field]];
                }

                this.fieldName = field;
                this.updatePipeline();
            }
        } else {
            let updatedPartners = [];
            event.forEach((element) => {
                let eCode = element.employeeCode;
                let filteredData;
                filteredData = this.pipelineInfo[field].filter((a) => a.employeeCode == eCode);
                if (filteredData.length > 0) {
                    updatedPartners.push(filteredData[0]);
                }
            });

            if (field == "svp" || field == "operatingPartner") {
                this.pipelineInfo[field].partners = updatedPartners;

            } else {
                this.pipelineInfo[field] = updatedPartners;
            }

            this.newValue = [this.pipelineInfo[field]];
            this.fieldName = field;
            this.typeaheadEmployeeList=[]
            this.updatePipeline();
        }
    }
    onAnswerChange(event, field) {
        if (event) {
            switch (field) {
                case "isRetainer": {
                    this.selectedIsRetainer = event?.value;
                    break;
                }
                case "isMBPartner": {
                    this.selectedIsMBPartner = event?.value;
                    break;
                }
            }

            this.newValue = event?.value;
            this.pipelineInfo[field] = this.newValue;
            this.fieldName = field;
            this.updatePipeline();
        }
    }
    onlanguagesChange(fieldName: string, value) {
        this.fieldName = fieldName;
        this.pipelineInfo.requiredLanguage = this.selectedlanguages;
        this.newValue = this.selectedlanguages;
        this.updatePipeline();

    }
    onClientChange(fieldName: string, value) {
        this.fieldName = fieldName;

        this.pipelineInfo.client = this.client;
        this.newValue = this.client;
        this.updatePipeline();

    }
    onCheckchanged(event, field) {
        if (event) {
            switch (field) {
                case "isOVPHelp": {
                    this.isOVPHelp = event?.target?.checked;
                    break;
                }
                case "isMBPartner": {
                    this.isSVPHelp = event?.target?.checked;
                    break;
                }
            }

            this.newValue = event?.target?.checked;
            this.pipelineInfo[field] = this.newValue;
            this.fieldName = field;
            this.updatePipeline();
        }
    }
    updateOfficeSelection(value?) {

        let currentOfficeCodes = value && value.length > 0 ? value.map((o) => o.officeCode) : [];
        let previouwstOfficeCodes = this.pipelineInfo?.officeToBeStaffed && this.pipelineInfo?.officeToBeStaffed.length > 0 ?
            this.pipelineInfo?.officeToBeStaffed.map((o) => o.officeCode) : [];
        if (currentOfficeCodes?.length == previouwstOfficeCodes?.length &&
            currentOfficeCodes.every((of) => previouwstOfficeCodes.includes(of))) {
            return
        }
        this.newValue = value;
        this.fieldName = 'officeToBeStaffed';
        this.pipelineInfo[this.fieldName] = value;
        this.updatePipeline();
    }

    clearValue(fieldName: string, event) {
        switch (fieldName) {
            case "latestStartDate":
                this.latestStartDate = null;
                break;
            case "likelihood":
                this.selectedLikelihood = null;
                break;
            case "opsLikelihood":
                this.selectedOpsLikelihood = null;
                break;
            case "expectedStart":
                this.startDate = null;
                break;
            case "officeToBeStaffed":
                this.selectedOffice = null;
                break;
            case "requiredLanguage":
                this.selectedlanguages = null;
                break;
        }
    }

    resetModal() {


        this.selectedSectors = [];
        this.selectedSubSectors = [];
        this.mbStatus = "";
        this.selectedClientHead = "";
        this.selectedSVP = [];
        this.selectedSelling = "";
        this.selectedOther = "";
        this.selectedOperating = "";
        this.startDate = null;
        this.latestStartDate = null;
        this.selectedLikelihood = null;
        this.selectedOpsLikelihood = null;
        this.selectedOffice = null;
        this.teams = null;
        this.teamSize = [];
        this.selectedIndustries = [];
        this.targetDescription = "";
        this.teamComments = "";
        this.workType = "";
        this.selectedPriorities = [];
        this.duration = "";
        this.target = "";
        this.notes = "";
        this.oppName = "";
        this.manager = "";
        this.locationName = "";
        this.selectedlanguages = [];
        this.selectedCaseComplexity = [];
        this.selectedclientCommitments = "";
        this.services = [];
        this.selectedIsMBPartner = "";
        this.selectedIsRetainer = null;
        this.isOVPHelp = false;
        this.isSVPHelp = false;
        this.processInfo = "";
        this.officesToeBeStaffed = [];
        this.selectedAllocatedOffice = [];
        this.selectedConflictedOffice = [];
        this.startDateComments = "";
        this.getTeamSize();

        this.client = null;
    }

    updatePipeline() {
        this.emitPipelineValue.emit({
            opportunity: this.pipelineInfo,
            fieldName: this.fieldName,
            newValue: this.newValue
        });
        this.getOppName();
    }

    getOppName() {
        if (this.pipelineInfo) {
            this.oppName = this.pipelineInfo
                ? CommonMethods.getOpportunityName(this.pipelineInfo, this.oppNameFields)
                : "";
        }
    }
    getDateValue(value) {
        if (value === undefined || value == null) return null;
        else return moment(value).format("DD-MMM-YYYY");
    }
    partnerCommentsChange(field, value) {
        let oldValue = this.pipelineInfo && this.pipelineInfo[field] ? this.pipelineInfo[field].comments : "";
        if (value != oldValue) {
            this.fieldName = field;
            if (!(this.pipelineInfo && this.pipelineInfo[field])) {
                this.pipelineInfo[field] = new Object as PartnersDetails
            }
            this.pipelineInfo[field].comments = value
            this.newValue = value;

            this.updatePipeline();
        }
    }
    //Openstage modal
    selectStage(event) {
        event.stopPropagation();

        // for opening 'update stage modal'

        this.openStageModal(event);

    }
    linkplaceholderToDeal(event) {
        event.stopPropagation();
        this.openLinkModal(event);
    }
    UnlinkedPlaceholder(event) {
        this.pipelineInfo.dealId = 0;
        this.pipelineInfo.isPlaceholderLinkedToDeal = false;
        this.fieldName = 'linkedPlaceholder';
        this.newValue = 0;
        this.updatePipeline();
    }
    openLinkModal(event) {
        const modalRef = this.modalService.show(AddPlaceholderToDealComponent, {
            initialState: {
            },
            class: "modal-dialog-centered closed-detail-popup",
            backdrop: "static", keyboard: false
        });

        modalRef.content.SaveLinkedPlaceholderEmitter.subscribe((res) => {

            this.pipelineInfo.dealId = res;
            this.pipelineInfo.isPlaceholderLinkedToDeal = true;
            this.fieldName = 'linkedPlaceholder';
            this.newValue = res;
            this.updatePipeline();

        });
    }

    openStageModal(event) {
        let stageValue: RegistrationStage = this.pipelineInfo.registrationStage;

        const modalRef = this.modalService.show(UpdateStageModalComponent, {
            initialState: {
                modalData: stageValue,
                registrationId: this.pipelineInfo.registrationId,
                targetData: (this.pipelineInfo.target?.targetName) ? this.pipelineInfo?.target.targetName : 'No target'
            },
            class: "modal-dialog-centered closed-detail-popup",
            backdrop: "static", keyboard: false
        });

        modalRef.content.saveClosedEmitter.subscribe((res) => {

            // stage data
            this.pipelineInfo.registrationStage = res.stage;

            //this.updateDealTrackerClient(client, "registrationStage");
            this.onRegistrationStageChange(this.ConstatntField.registrationStage, res.stage)

            // closed data
            let closedDetailData: RegistrationClosedInfo = res.closedInfo;
            closedDetailData.registrationId = this.pipelineInfo.registrationId;

            this.registrationService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
                this.toastr.showSuccess("Stage information Updated", "Success");
            });
        });
    }


}



