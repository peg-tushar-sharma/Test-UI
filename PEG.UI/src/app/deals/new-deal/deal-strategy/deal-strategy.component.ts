import {
    Component,
    OnInit,
    Input,
    QueryList,
    ViewChildren,
    OnChanges,
    AfterViewChecked,
    ElementRef,
    SimpleChanges,
    ViewChild,
    HostListener,
    Output,
    EventEmitter
} from "@angular/core";
import { CdkDragDrop, moveItemInArray, CdkDrag } from "@angular/cdk/drag-drop";
import { deals } from "../../deal";
import { DealsService } from "../../deals.service";
import { expertGroup } from "../deal-experts/expertGroup";
import { PegTostrService } from "../../../core/peg-tostr.service";
import { DatePipe } from "@angular/common";
import { CommonMethods } from "../../../shared/common/common-methods";
import { DealClient } from "../deal-clients/dealClient";
import { ExpertCategories } from "../../../shared/enums//expert-category.enum";
import { ExpertCategory } from "../deal-experts/expertCategory";
import { RegistrationStatus } from "../../../shared/enums/registration-status.enum";
import { CoreService } from "../../../core/core.service";
import { RoleType } from "../../../shared/enums/role-type.enum";
import { RegistrationStageEnum } from "../../../shared/enums/registration-stage.enum";
import { DealTracker } from "../../dealTracker";
import { debounceTime, switchMap, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { Employee } from "../../../shared/interfaces/Employee";
import { EXPERT_PARTNER_LEVELGRADE } from "../../../shared/common/constants";
import { Partner } from "../../../shared/interfaces/partner";
import { RegistrationStage } from "../../../shared/interfaces/RegistrationStage";
import { GlobalService } from "../../../global/global.service";
import { DealStrategyService } from "./deal-strategy.service";
import { DealAllocationType } from "../../../shared/enums/deal-allocationType.enum";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ConfirmModalComponent } from "../../../shared/confirm-modal/confirm-modal.component";
import { Expert } from "../deal-experts/expert";
import { ExpertDetailMailService } from "../../../shared/mail/expert-detail-mail.service";
import { ClientEditorPopUpComponent } from "./client-editor-pop-up/client-editor-pop-up.component";
import { StrategyClientPopupComponent } from "./strategy-client-popup/strategy-client-popup.component";
import { ExpertNotesSummaryPopupComponent } from "./expert-notes-summary-popup/expert-notes-summary-popup.component";
import * as moment from "moment";
import { DealTrackerClient, DealTrackerClientForEmail } from "../../deal-tracker-client";
import { FormatTimeZone } from "../../../shared/formatTimeZone.pipe";
import { UpdateStageModalComponent } from "../../../shared/update-stage-modal/update-stage-modal.component";
import { RegistrationClosedInfo } from "../../../registrations/registrationClosedInfo";
import { RegistrationService } from "../../../registrations/registrations/registration.service";
import { AddExpertPoolComponent } from "./add-expert-pool/add-expert-pool.component";
import { ClientEmailPopUpComponent } from "./client-email-popup/client-email-popup.component";
import { opportunityType } from "../../../shared/enums/opportunityType.enum";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-deal-strategy",
    templateUrl: "./deal-strategy.component.html",
    styleUrls: ["./deal-strategy.component.scss"]
})
export class DealStrategyComponent implements OnInit, OnChanges, AfterViewChecked {
    @ViewChildren(CdkDrag) dragItems: QueryList<CdkDrag>;
    @Input()
    dealId: any;
    @Input()
    dealLabel: any;
    filteredDeal: DealTrackerClient[];
    @Input()
    isTabReadOnly: boolean;
    @Input()
    managedByRegion: any;
    @Input()
    targetName: string;

    @Input()
    isOpenMailPopup: boolean = false;

    _formatTimeZone: FormatTimeZone;
    dealTracker: DealTracker = new DealTracker();
    IsReadyForAllocation: boolean = false;
    hasExperts: boolean = false;
    dealExpertsGroups: expertGroup[];
    isFilterHidden: boolean = false;
    listClientAccess: string[];
    selectedRegistrationId: number;
    selectedLikelihood: any;
    selectedRetainer: any;
    selectedRetainerNotes: any;
    isEnabled: boolean = false;
    selectedExpertGroup: any;
    duplicateStatusID: number;
    conflictedStatusID: number;
    terminatedStageID: number;
    closedLostStageID: number;
    closedDroppedStageID: number;
    closedBainTurnedDownStageID: number;
    NACategoryID: number;
    caseCode: string;
    isPanelCollapsed: boolean = false;
    addPool: boolean = false;
    enableImport: boolean = false;
    expertGroups: any;
    isDraggingExpert: boolean = false;
    isCaseEditor: boolean = false;
    public openedCaseEditorClient: number = 0;
    selectedExpert;
    PeopleTagload = false;
    selectEmployeeTypeAhead = new Subject<string>();
    typeaheadEmployeeList: Employee[];
    nonCategoryExpertSortOrder: number = 5;
    isSelectStage: boolean = false;
    isSelectLikelihood: boolean = false;
    selectedIndex: number = -1;
    isSelectRetainer: boolean = false;
    isSelectRetainerNotes: boolean = false;
    retainerList: any[] = CommonMethods.getAnswerObject();
    selectedDealClient: number = 0;
    registrationStage: RegistrationStage[];
    bsModalRef: BsModalRef;
    expertTypeAhead = new Subject<string>();
    expertsLoad: boolean = false;
    expertList: Employee[] = [];
    levelCode = "";
    isIncludeExternalEmployee: boolean = true;
    includeAllEmployee = true;
    isRightClick: boolean = false;
    isDelete: boolean = false;
    isAddItem: boolean = true;
    hideDetailsColumn: boolean = false;
    dealClient: DealClient = new DealClient();
    updatedExperts: Expert[] = [];
    expertModalRef;
    isClientEmailSend = false;
    allowExpertDragging = true;
    active: boolean = false;
    categoryName: string;
    categoryGrouping: number;
    isModalOpen: boolean = false;
    wtBuySidePreSalesList = [5, 6] //this is the list of worktype based on which the color on the UI is determined 
    // Expert Category Dropdown
    expertCategories: ExpertCategory[];


    dateFormatStr: string = "DD-MMM-YYYY";
    minDate: Date = new Date();

    bsConfig: any = {
        dateInputFormat: this.dateFormatStr,
        containerClass: "theme-red",
        adaptivePosition: true
    };

    likelihoodList: any[] = [];

    canEditAnyStage: boolean = false;
    expertPipelineRow: number = -1;
    expertPipelineStatus = [];

    @Output()
    public updateMBStatus: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public updateSellSideStatus: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public updateDealTracker: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public updateAssetStatus: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public openExpertiseRequestEmail: EventEmitter<any> = new EventEmitter<any>();
    public emailClientTab: Window | null = null;

    constructor(
        private elRef: ElementRef,
        private modalService: BsModalService,
        private toastrService: PegTostrService,
        private dealService: DealsService,
        private toastr: PegTostrService,
        public datepipe: DatePipe,
        public expertDetailMailService: ExpertDetailMailService,
        public coreService: CoreService,
        private globalService: GlobalService,
        private registrationService: RegistrationService,
        private dealStrategyService: DealStrategyService,
        private router: Router
    ) {
        this.selectEmployeeTypeAhead
            .pipe(
                tap(() => {
                    this.PeopleTagload = true;
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
            });

        this.dealService.updateClientStage.subscribe((data) => {

            this.setClientStageToCloseCold(data);
        });


    }

    ngOnInit() {
        this.isEnabled = true;
        this.duplicateStatusID = RegistrationStatus.Duplicate;
        this.conflictedStatusID = RegistrationStatus.Conflicted;
        this.terminatedStageID = RegistrationStageEnum.Terminated;

        this.closedLostStageID = RegistrationStageEnum.ClosedLost;
        this.closedDroppedStageID = RegistrationStageEnum.ClosedDropped;
        this.closedBainTurnedDownStageID = RegistrationStageEnum.ClosedBainTurnedDown;

        this.NACategoryID = ExpertCategories.NotAvailable;
        this.isTabReadOnly =
            this.coreService.loggedInUserRoleId === RoleType.PracticeAreaManagerRestricted ||
                this.coreService.loggedInUserRoleId === RoleType.PAM
                ? true
                : this.isTabReadOnly;
        this.isClientEmailSend = this.coreService.loggedInUserRoleId === RoleType.PracticeAreaManagerRestricted ? false : true;
        this.canEditAnyStage = CommonMethods.isAuthorizedToEditStage(this.coreService);

        // removing blank client names
        if (this.dealTracker && this.dealTracker.clients != undefined) {
            let item = this.dealTracker.clients.filter(
                (element) =>
                    element.client != undefined &&
                    element.client.clientName != null &&
                    element.client.clientName.trim() != ""
            );
            if (item != undefined && item.length > 0) {
                this.dealService.isReadyForAllocation = true;
                this.IsReadyForAllocation = true;
            } else {
                if (this.dealService.isReadyForAllocation) {
                    this.IsReadyForAllocation = true;
                } else {
                    this.IsReadyForAllocation = false;
                    this.dealService.isReadyForAllocation = false;
                }
            }
        } else {
            if (this.dealService.isReadyForAllocation) {
                this.IsReadyForAllocation = true;
            } else {
                this.IsReadyForAllocation = false;
                this.dealService.isReadyForAllocation = false;
            }
        }

        // setting blank experts
        if (this.dealTracker && this.dealTracker.expertGroup != undefined) {
            this.dealTracker.expertGroup.forEach((element) => {
                element.experts = element.experts.filter(
                    (element) =>
                        element != null &&
                        element != undefined &&
                        element.expertName != null &&
                        element.expertName != undefined &&
                        element.expertName.trim() != ""
                );
            });
        }

        this.globalService.getRegistrationStage().subscribe((regStage) => {
            this.registrationStage = regStage;
        });

        // Expert typeahead list load
        this.expertTypeAhead
            .pipe(
                tap(() => {
                    this.expertsLoad = true;
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
                tap(() => (this.expertsLoad = false))
            )
            .subscribe((items) => {
                items.forEach((element) => {
                    element.searchableName =
                        (element.lastName ? element.lastName + ", " : "") +
                        (element.familiarName ? element.familiarName : element.firstName) +
                        (element.employeeStatusCode == "EX" ? "" : " (" + element.officeAbbreviation + ")");
                    element.searchableName += element.statusCode == "L" ? " (Leave)" : "";
                });

                this.expertList = items;
            });

        // Likelihood item list
        this.globalService.getPipelineStatus().subscribe((res) => {
            this.likelihoodList = res;
        });

        // Get categories
        this.globalService.getExpertCategories().subscribe((res) => {
            this.expertCategories = res;
        });

        let requestInterval = setInterval(() => {
            if (this.filteredDeal.length) {
                this.setExpertPipelineRequestStatus();
                clearInterval(requestInterval);
            }
        }, 100);
    }
    setClientStageToCloseCold(data) {
        if (this.dealTracker && this.dealTracker?.clients?.length > 0) {
            for (let item of this.dealTracker?.clients) {
                if (item.registrationStage?.registrationStageId == RegistrationStageEnum.Interest) {
                    this.globalService.getRegistrationStage().subscribe(stageData => {

                        item.registrationStage = stageData.find(x => x.registrationStageId == RegistrationStageEnum.Terminated)

                    });



                }
            }
        }
    }
    requestExpertInfo(status, registrationId) {
        status.expertRequested = !status.expertRequested;
        status.pipelineRequested = false;

    }
    closePipelineExpertInfo() {
        this.expertPipelineStatus.forEach((status) => {
            status.pipelineRequested = false;
            status.expertRequested = false;
        });
    }
    getAlertIconClass(status) {
        return CommonMethods.getAlertIconClass(status);
    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.dealId) {
            this.getMbStrategyById();
        }

        if (this.dealTracker && !this.dealService.isFromRegistration) {
            this.dealTracker.clients?.forEach((element) => {
                let currentReadButton: HTMLLinkElement = document.getElementById(
                    "currentAllocationNotesReadButton" + element.registrationId
                ) as HTMLLinkElement;
                if (currentReadButton && currentReadButton.innerText.trim() != "Read more") {
                    currentReadButton.innerText = "Read more";
                }
            });
        }

        if (this.isFilterHidden) {
            let item = this.dealTracker.expertGroup.filter((x) => x.expertGroupName == this.selectedExpertGroup);
            if (item && item[0]) {
                this.filterExperts(item[0]);
            }
        }
    }

    seeItem(item) {
    }

    setExpertPipelineRequestStatus() {
        if (this.uniqueClients().length) {

            this.expertPipelineStatus = this.uniqueClients().map((item) => {
                return {
                    expertRequested: false,
                    pipelineRequested: false
                }
            });

            // set expert or pipeline request data
            this.uniqueClients().forEach((item, index) => {
                this.dealService.getOpportunityExpertDetailsById(item.registrationId).subscribe((res) => {
                    this.expertPipelineStatus[index]['expertData'] = res;
                });

                this.dealService.getOpportunityPipelineDetailsById(item.registrationId).subscribe((res) => {
                    this.expertPipelineStatus[index]['pipelineData'] = res;
                });
            });
        }
    }

    getMbStrategyById() {

        this.dealService.getMBStrategyById(this.dealId).subscribe((dealTracker) => {
            if (dealTracker != null) {

                this.dealTracker.expertGroup = dealTracker.expertGroup;
                this.dealTracker.clients = dealTracker.clients;
                this.dealTracker.clientAllocations = dealTracker.clientAllocations;
                if (this.dealTracker) {
                    this.renderAllocationTab(this.dealId);
                }
                // used to temporarily store the opportunity type details to manage edit icon visibility 
                this.dealTracker.clients.map((client) => {
                    client.tempOpportunityTypeDetails = JSON.parse(JSON.stringify(client.opportunityTypeDetails));
                });


            }
            if (this.dealTracker?.clients?.length > 0 && this.isOpenMailPopup && !this.isModalOpen && this.managedByRegion) {
                this.openClientEmailPopUp();
            }

        });
        this.dealService.multipleRegToDeal.next(null);
    }

    getSelectedRetainerName(isRetainer: number) {
        return this.retainerList.find(r => r.value == isRetainer).name;
    }

    filterClose() {
        this.dealTracker.expertGroup.forEach((obj) => {
            obj.filterState = 0;
            obj.experts.forEach((element) => {
                element.filterState = 0;
            });
        });
        this.selectedExpertGroup = null;
    }

    filterExperts(item) {
        if (item != undefined) {
            this.dealTracker.expertGroup.forEach((obj) => {
                if (item.expertGroupId != obj.expertGroupId) {
                    obj.filterState = 1;
                    obj.experts.forEach((element) => {
                        element.filterState = 1;
                    });
                } else {
                    obj.filterState = 0;
                    obj.experts.forEach((element) => {
                        element.filterState = 0;
                    });
                }
            });
            this.selectedExpertGroup = item.expertGroupName;
        }
    }

    toggelFilter() {
        if (this.isFilterHidden) {
            this.filterClose();
            this.isFilterHidden = false;
        } else {
            this.isFilterHidden = true;
        }
    }

    removeItemShowConfirm(item, index) {
        var ele = document.getElementById("removeItem_comittedList_" + index + "_" + item.employeeCode);
        ele.style.display = "block";
    }

    removeItemCancelConfirm(item, index) {
        var ele = document.getElementById("removeItem_comittedList_" + index + "_" + item.employeeCode);
        if (ele) {
            ele.style.display = "none";
        }
    }

    removeItem(client, column, currentExpert, rowIndex) {
        //hide confirmation popup
        let id;
        this.removeItemCancelConfirm(currentExpert, rowIndex);
        this.dealTracker.clients.forEach((element) => {
            if (client.registrationId === element.registrationId) {
                if (column == "Committed") {
                    id = "comittedList" + rowIndex;
                    let index = element.committed.indexOf(currentExpert, 0);
                    if (index > -1) {
                        this.dealTracker.clientAllocations = this.dealTracker.clientAllocations.filter(
                            (c) =>
                                c.allocationType != 1 &&
                                c.registrationId != element.registrationId &&
                                c.employeeCode != currentExpert.employeeCode
                        );
                        let clients = this.dealTracker.clients.filter((c) => c.registrationId == element.registrationId);
                        clients.forEach((element) => {
                            element.committed = element.committed.filter(
                                (c) => c.employeeCode != currentExpert.employeeCode
                            );
                        });
                    }
                } else if (column == "HeardFrom") {
                    let index = element.heardFrom.indexOf(currentExpert, 0);
                    id = "heardFromList" + rowIndex;
                    if (index > -1) {
                        this.dealTracker.clientAllocations = this.dealTracker.clientAllocations.filter(
                            (c) =>
                                c.allocationType != 2 &&
                                c.registrationId != element.registrationId &&
                                c.employeeCode != currentExpert.employeeCode
                        );
                        let clients = this.dealTracker.clients.filter((c) => c.registrationId == element.registrationId);
                        clients.forEach((element) => {
                            element.heardFrom = element.heardFrom.filter(
                                (c) => c.employeeCode != currentExpert.employeeCode
                            );
                        });
                    }
                } else if (column == "NextCall") {
                    let index = element.nextCall.indexOf(currentExpert, 0);
                    id = "nextCallList" + rowIndex;
                    if (index != undefined && index > -1) {
                        this.dealTracker.clientAllocations = this.dealTracker.clientAllocations.filter(
                            (c) =>
                                c.allocationType != 3 &&
                                c.registrationId != element.registrationId &&
                                c.employeeCode != currentExpert.employeeCode
                        );
                        let clients = this.dealTracker.clients.filter((c) => c.registrationId == element.registrationId);
                        clients.forEach((element) => {
                            element.nextCall = element.nextCall.filter(
                                (c) => c.employeeCode != currentExpert.employeeCode
                            );
                        });
                    }
                }
                // resert active state if it was true
                if (column == "Committed" && currentExpert.isAllocationActive) {
                    this.setActiveExpertGrid(currentExpert, false);
                    this.setActiveExpert(currentExpert, false);
                }
            }
        });
        this.setValidations();
        this.isDelete = true;
        this.upsertDealClientAllocation(id, currentExpert, client);
    }
    hideAllDropHerePlaceholder() {
        const ele = document.getElementsByClassName("blankPlaceholder");
        for (let i = 0; i < ele.length; i++) {
            ele[i]?.classList.add("elementHide");
        }
    }

    drop(event: CdkDragDrop<string[]>, rowIndex: number, dealClient: DealTrackerClient) {
        if (!event.item.data["expertName"]) {
            this.toastr.showWarning(
                "The blank expert can not be moved",
                "Alert"
            );
            return false;
        }
        this.hideAllDropHerePlaceholder();
        if (
            !(event.previousContainer.id.indexOf("comittedList") > -1) &&
            event.container.id.indexOf("comittedList") > -1
        ) {
            var MovedToComittedRestricted;
            this.dealTracker.clients.forEach((element) => {
                let item = element.committed.some(
                    (obj) => obj.employeeCode === event.item.data["employeeCode"] && obj.isAllocationActive
                );
                if (item) {
                    MovedToComittedRestricted = true;
                }
            });
            if (MovedToComittedRestricted) {
                return false;
            }
        }
        //if blank expert is dropped
        if (event.item.data?.expertId == 0) {
            return false;
        }
        // var itemRow = Number(event.container.id.substr(event.container.id.length - 1));

        if (
            this.filteredDeal[rowIndex]?.registrationStatus != null &&
            this.filteredDeal[rowIndex]?.registrationStatus != undefined
        ) {
            if (
                this.filteredDeal[rowIndex]?.registrationStatus?.registrationStatusId ==
                RegistrationStatus.Conflicted ||
                this.filteredDeal[rowIndex]?.registrationStatus?.registrationStatusId == RegistrationStatus.Duplicate
            ) {
                return false;
            }
        }

        if (
            (this.filteredDeal[rowIndex]?.registrationStage != null &&
                this.filteredDeal[rowIndex]?.registrationStage != undefined) ||
            dealClient?.registrationStage != null
        ) {
            if (
                this.filteredDeal[rowIndex]?.registrationStage?.registrationStageId ==
                RegistrationStageEnum.Terminated ||
                dealClient?.registrationStage?.registrationStageId == RegistrationStageEnum.Terminated
            ) {
                return false;
            }
        }
        if (
            event.container.id.indexOf("expertGroupList") > -1 &&
            event.previousContainer.id.indexOf("expertGroupList") > -1
        ) {
            let expertGroupId = this.dealTracker.expertGroup[rowIndex].expertGroupId;

            let doExist = event.container.data.some((obj) => obj["employeeCode"] === event.item.data["employeeCode"]);
            if (doExist) {
                this.toastr.showWarning(
                    "The expert " +
                    (event.item.data != undefined ? event.item.data?.expertName : "") +
                    " already exist in this group.",
                    "Alert"
                );
                return false;
            } else {
                let currentEditGroupIndex = this.dealTracker.expertGroup.findIndex(
                    (x) => x.expertGroupId == event.item.data.expertGroupId
                );

                this.dealTracker.expertGroup
                    .find((x) => x.expertGroupId == expertGroupId)
                    .experts.push(event.item.data);
                this.dealTracker.expertGroup[currentEditGroupIndex].experts = this.dealTracker.expertGroup[
                    currentEditGroupIndex
                ].experts.filter(
                    (a) =>
                        a.employeeCode != "" &&
                        a.employeeCode != null &&
                        a.employeeCode != undefined &&
                        a.employeeCode != event.item.data.employeeCode
                );
                this.setExpertPoolColorToClient();
                this.mapGroupId(event.item.data, expertGroupId);
                this.saveExpert(event.item.data);
            }
        }
        let doExist = event.container.data.some((obj) => obj["employeeCode"] === event.item.data["employeeCode"]);
        if (doExist) {
            return false;
        } else {
            // if not moving  from pool to pool

            if (event.previousContainer === event.container) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            } else {
                let tempExpertData = JSON.parse(JSON.stringify(event.item.data));
                if (event.previousContainer.id.indexOf("expertGroupList") < 0) {
                    // if items are moved between client then drag the item
                    return false;
                } else {
                    // if items are moved  from expert to client then copy the item
                    //checking data if dragged from
                    event.item.data.expertPoolColor = this.setExpertPoolColor(event.item.data.employeeCode);
                    if (event.container.id.indexOf("comittedList") > -1) {
                        tempExpertData.isAllocationActive = true;
                        this.setActiveExpert(tempExpertData, true);
                    }
                    event.container.data.push(JSON.parse(JSON.stringify(tempExpertData)));
                    if (event.container.id.indexOf("comittedList") > -1) {
                        this.setActiveExpertGrid(tempExpertData, true);
                    }
                }
                this.dealTracker.clientAllocations = [];
                this.setValidations();
                this.upsertDealClientAllocation(event.container.id, tempExpertData, dealClient);
            }
        }
    }
    mapGroupId(expert: Expert, groupId: number) {
        let oldGroupId = expert.expertGroupId;
        expert.expertGroupId = groupId;

        this.dealTracker.clients?.forEach((currClient) => {
            currClient.committed.forEach((CurrCommitedExpert) => {
                if (CurrCommitedExpert.expertId == expert.expertId) {
                    CurrCommitedExpert.expertGroupId = groupId;
                }
            });
            currClient.heardFrom.forEach((CurrheardFromExpert) => {
                if (CurrheardFromExpert.expertId == expert.expertId) {
                    CurrheardFromExpert.expertGroupId = groupId;
                }
            });
            currClient.nextCall.forEach((CurrNextCallExpert) => {
                if (CurrNextCallExpert.expertId == expert.expertId) {
                    CurrNextCallExpert.expertGroupId = groupId;
                }
            });
        });

        this.dealTracker.expertGroup.forEach((grp) => {
            grp.experts.forEach((element) => {
                if (element.employeeCode == expert.employeeCode) {
                    element.expertPoolColor.forEach((poolColor) => {
                        if (poolColor.expertGroupId == oldGroupId) {
                            poolColor.expertGroupId = groupId;
                            element.expertPoolColor = this.setExpertPoolColor(element.employeeCode);
                        }
                    });
                }
            });
        });
    }

    dragStarted(event) {
        this.isDraggingExpert = true;

        const eleblankPlaceholder = document.getElementsByClassName("blankPlaceholder");
        for (let i = 0; i < eleblankPlaceholder.length; i++) {
            eleblankPlaceholder[i]?.classList.remove("elementHide");
        }
    }

    dragEnded(event) {
        this.isDraggingExpert = false;
    }

    sortBy(prop, group) {
        this.dealService.dealBackup?.expertGroup?.map((x) =>
            x.experts.sort((a, b) => {
                return a.sortOrder - b.sortOrder;
            })
        );

        this.sortBlankExpertRecords(prop, group);

        return prop.sort((a, b) => {
            if (a.sortOrder == b.sortOrder) {
                return a.expertName?.charCodeAt(0) - b.expertName?.charCodeAt(0);
            }
            return a.sortOrder - b.sortOrder;
        });
    }


    sortBlankExpertRecords(data: any, groupData: any) {
        let filterData = [];
        let groupindex = this.dealTracker.expertGroup.indexOf(groupData)
        for (let i = 0; i < data.length; i++) {
            if (data[i].expertName == null) {
                var removed = this.dealTracker.expertGroup[groupindex].experts.splice(data.indexOf(data[i]), 1);
                filterData.push(removed[0]);
                i--;
            }
        }
        if (filterData) {
            filterData.forEach(item => {
                data.push(item);

            })
        }
        return data;
    }



    sortByPoolColor(prop) {
        if (prop && prop.length > 0) {
            return prop.sort((a, b) => {
                if (a.expertPoolColor.length > 0 && b.expertPoolColor.length > 0) {
                    return a.expertPoolColor[0].sortOrder - b.expertPoolColor[0].sortOrder;
                }
            });
        }
    }

    renderAllocationTab(dealId: number) {
        this.dealExpertsGroups = this.dealTracker.expertGroup;
        this.dealExpertsGroups?.forEach((currGroup) => {
            currGroup.experts.forEach((currExp) => {
                currExp.expertPoolColor = this.setExpertPoolColor(currExp.employeeCode);
            });
        });

        this.dealTracker.clients = this.dealTracker.clients.sort((a, b) => {
            return a.clientOrder - b.clientOrder;
        });
        let clients = this.dealTracker.clients?.sort((a, b) => {
            return CommonMethods.sortDealCllients(
                a.registrationStage ? a.registrationStage.registrationStageId : 0,
                a,
                b
            );
        });

        this.dealTracker.clients = clients?.sort((a, b) => {
            return a.clientOrder - b.clientOrder;
        });
        let allocatedExpertList = [];
        if (this.dealTracker.clientAllocations != undefined && this.dealTracker.clientAllocations.length > 0) {
            this.dealTracker.clientAllocations.forEach((element) => {
                this.dealTracker.expertGroup.forEach((currExpertGroup) => {
                    currExpertGroup.experts.forEach((currExpert) => {
                        if (currExpert.employeeCode == element.employeeCode) {
                            allocatedExpertList.push(currExpert);
                        }
                    });
                });
            });
        }

        this.dealTracker.clients?.forEach((element) => {
            element.committed = element.committed == undefined ? [] : element.committed;
            element.heardFrom = element.heardFrom == undefined ? [] : element.heardFrom;
            element.nextCall = element.nextCall == undefined ? [] : element.nextCall;
            let showFullText = false;
            let currentReadButton: HTMLLinkElement = document.getElementById(
                "currentAllocationNotesReadButton" + element.registrationId
            ) as HTMLLinkElement;
            if (currentReadButton && currentReadButton.innerText.trim() != "Read more") {
                showFullText = true;
            }
            element.allocationNoteFormatted = this.dealService.formateAllocationNote(
                element.allocationNote,
                showFullText
            );
            let allocatedClient = this.dealTracker.clientAllocations.filter(
                (obj) => obj.registrationId === element.registrationId
            );
            if (allocatedClient != undefined && allocatedClient.length > 0) {
                allocatedClient.forEach((currExperts) => {
                    let item = new Object();
                    if (currExperts.allocationType == 1) {
                        item = allocatedExpertList.find((item) => item.employeeCode === currExperts.employeeCode);
                        if (
                            !element.committed.some((obj) => obj.employeeCode === currExperts.employeeCode) &&
                            item != undefined
                        ) {
                            element.committed.push(JSON.parse(JSON.stringify(item)));
                        }
                    } else if (currExperts.allocationType == 2) {
                        item = allocatedExpertList.find((item) => item.employeeCode === currExperts.employeeCode);
                        if (
                            !element.heardFrom.some((obj) => obj.employeeCode === currExperts.employeeCode) &&
                            item != undefined
                        ) {
                            element.heardFrom.push(JSON.parse(JSON.stringify(item)));
                        }
                    } else if (currExperts.allocationType == 3) {
                        item = allocatedExpertList.find((item) => item.employeeCode === currExperts.employeeCode);
                        if (
                            !element.nextCall.some((obj) => obj.employeeCode === currExperts.employeeCode) &&
                            item != undefined
                        ) {
                            element.nextCall.push(JSON.parse(JSON.stringify(item)));
                        }
                    }
                });
            }
            // Setting clientHeads
            element.clientHeadsName = CommonMethods.getEmployeeNameList(element.clientHeads).join(" | ");

            // Set expected start and end date
            if (element.expectedStartDate !== null) {
                element.expectedStartDate = moment(element.expectedStartDate.split("T")[0]).toDate();
            }

        });
        this.listClientAccess = [];

        for (var i = 0; i < this.dealTracker.clients?.length; i++) {
            this.listClientAccess.push("comittedList" + i);
            this.listClientAccess.push("heardFromList" + i);
            this.listClientAccess.push("nextCallList" + i);
        }
        for (var i = 0; i < this.dealTracker.expertGroup?.length; i++) {
            this.listClientAccess.push("expertGroupList" + i);
        }
        this.setExpertPoolColorToClient();
        this.setValidations();

        if (this.dealTracker.clients?.length > 0) {
            this.IsReadyForAllocation = true;
        }
    }

    setExpertPoolColorToClient() {
        this.dealTracker.clients?.forEach((currClient) => {
            currClient.committed.forEach((CurrCommitedExpert) => {
                CurrCommitedExpert.expertPoolColor = [];
                CurrCommitedExpert.expertPoolColor = this.setExpertPoolColor(CurrCommitedExpert.employeeCode);
            });
            currClient.heardFrom.forEach((CurrheardFromExpert) => {
                CurrheardFromExpert.expertPoolColor = [];
                CurrheardFromExpert.expertPoolColor = this.setExpertPoolColor(CurrheardFromExpert.employeeCode);
            });
            currClient.nextCall.forEach((CurrNextCallExpert) => {
                CurrNextCallExpert.expertPoolColor = [];
                CurrNextCallExpert.expertPoolColor = this.setExpertPoolColor(CurrNextCallExpert.employeeCode);
            });
        });
    }

    getAllocatedExpertList() {
        let AllocatedExperts: any[] = [];
        this.dealTracker.expertGroup?.forEach((objExpertGroup) => {
            objExpertGroup.experts.forEach((ObjExperts) => {
                this.dealTracker.clients.forEach((ObjClient) => {
                    let CommittedItem = ObjClient.committed.find(
                        (objClientsComitted) => objClientsComitted.employeeCode == ObjExperts.employeeCode
                    );
                    if (CommittedItem != undefined) {
                        AllocatedExperts.push({
                            allocationType: 1,
                            registrationId: ObjClient.registrationId,
                            expert: CommittedItem
                        });
                    }
                    let HeardFromItem = ObjClient.heardFrom.find(
                        (objClientsHeardFrom) => objClientsHeardFrom.employeeCode == ObjExperts.employeeCode
                    );
                    if (HeardFromItem != undefined) {
                        AllocatedExperts.push({
                            allocationType: 2,
                            registrationId: ObjClient.registrationId,
                            expert: HeardFromItem
                        });
                    }
                    let NextCallItem = ObjClient.nextCall.find(
                        (objClientNextCall) => objClientNextCall.employeeCode == ObjExperts.employeeCode
                    );
                    if (NextCallItem != undefined) {
                        AllocatedExperts.push({
                            allocationType: 3,
                            registrationId: ObjClient.registrationId,
                            expert: NextCallItem
                        });
                    }
                });
            });
        });
        return AllocatedExperts;
    }

    setValidations() {
        let AllocatedExperts = this.getAllocatedExpertList();
        //Setting the validation
        this.dealTracker.expertGroup?.forEach((objExpertGroup) => {
            objExpertGroup.experts.forEach((ObjExperts) => {
                ObjExperts.expertState = 0;
                ObjExperts.isAllocationActive = false;
                var InCommitted = AllocatedExperts.some(
                    (obj) => obj.expert.employeeCode == ObjExperts.employeeCode && obj.allocationType == 1
                );
                let isActiveExpert = AllocatedExperts.some(
                    (obj) =>
                        obj.expert.employeeCode == ObjExperts.employeeCode &&
                        obj.allocationType == 1 &&
                        obj.expert.isAllocationActive
                );
                if (ObjExperts.categoryId == ExpertCategories.NotAvailable) {
                    ObjExperts.expertState = 1;
                }
                if (InCommitted) {
                    ObjExperts.expertState = 2;
                }
                if (isActiveExpert) {
                    ObjExperts.isAllocationActive = true;
                }
            });
        });

        // reset client experts
        this.dealTracker.clients?.forEach((obj) => {
            obj.heardFrom.forEach((heardFromExpert) => {
                heardFromExpert.expertState = 0;
            });
            obj.nextCall.forEach((nextCallExpert) => {
                nextCallExpert.expertState = 0;
            });
        });

        // setting client expert
        let CommittedExperts = AllocatedExperts.filter((obj) => obj.allocationType == 1);
        if (CommittedExperts != undefined && CommittedExperts.length > 0) {
            CommittedExperts.forEach((item) => {
                this.dealTracker.clients.forEach((obj) => {
                    if (obj.registrationId != item.registrationId) {
                        obj.heardFrom.forEach((heardFromExpert) => {
                            if (
                                item.expert.employeeCode == heardFromExpert.employeeCode &&
                                item.expert.isAllocationActive
                            ) {
                                heardFromExpert.expertState = 2;
                            }
                        });
                        obj.nextCall.forEach((nextCallExpert) => {
                            if (
                                item.expert.employeeCode == nextCallExpert.employeeCode &&
                                item.expert.isAllocationActive
                            ) {
                                nextCallExpert.expertState = 2;
                            }
                        });
                    }
                });
            });
        }
    }

    allocationActiveConfirm(item, index) {
        var ele = document.getElementById("aa_comittedList_" + index + "_" + item.employeeCode);
        ele.style.display = "block";
    }

    cancelAllocationActiveConfirm(item, index) {
        var ele = document.getElementById("aa_comittedList_" + index + "_" + item.employeeCode);
        ele.style.display = "none";
    }

    selectAllocationNote(registrationId) {
        var openPopup = document.getElementById("AllocationNotes");
        openPopup.click();
        var notesPopup = document.getElementById("dealAllocationNotes");
        notesPopup.setAttribute("style", "z-index:100050 !important;display: block;");
        this.selectedRegistrationId = registrationId;
    }

    selectAllocationInformation(event) {
        var openPopup = document.getElementById("resourceAllocation");
        openPopup.click();
        this.caseCode = event?.target?.innerText?.split('|')[0].trim();
        this.dealService.updateResource.next(this.caseCode?.trim());
    }

    toggleExpertNotes(client, event) {
        var extraExpertiesNotes = document.getElementById("extraExpertiesNotes" + client.registrationId);
        var currentReadButton: HTMLLinkElement = document.getElementById(
            "currentReadButton" + client.registrationId
        ) as HTMLLinkElement;
        if (extraExpertiesNotes.getAttribute("style").replace(" ", "").trim().indexOf("display:none") > -1) {
            extraExpertiesNotes.setAttribute("style", "display:inline");
            currentReadButton.innerText = "Read less";
        } else {
            extraExpertiesNotes.setAttribute("style", "display:none");
            currentReadButton.innerText = "Read more";
        }
    }

    toggleAllocationNotes(client) {
        var currentReadButton: HTMLLinkElement = document.getElementById(
            "currentAllocationNotesReadButton" + client.registrationId
        ) as HTMLLinkElement;
        if (currentReadButton.innerText.trim() == "Read more") {
            client.allocationNoteFormatted = this.dealService.formateAllocationNote(client.allocationNote, true);
            currentReadButton.innerText = " Read less";
        } else {
            client.allocationNoteFormatted = this.dealService.formateAllocationNote(client.allocationNote, false);
            currentReadButton.innerText = " Read more";
        }
    }

    uniqueClients() {
        let dealclients = this.dealTracker.clients?.filter(
            (element) =>
                element.client != undefined &&
                element.client.clientName != null &&
                element.client.clientName.trim() != ""
        );
        dealclients = dealclients?.sort((a, b) => {
            return a?.registrationStatus?.sortOrder - b.registrationStatus?.sortOrder;
        });
        dealclients = dealclients?.sort((a, b) => {
            return a.clientOrder - b.clientOrder;
        });
        let clients = dealclients?.sort((a, b) => {
            return CommonMethods.sortDealCllients(
                a.registrationStage ? a?.registrationStage?.registrationStageId : 0,
                a,
                b
            );
        });
        dealclients = clients?.sort((a, b) => {
            return a.clientOrder - b.clientOrder;
        });
        if (dealclients) {

            dealclients = this.sortDuplicateAndConflictedRecords(dealclients, RegistrationStatus.Conflicted);// sort Conflicted

            dealclients = this.sortDuplicateAndConflictedRecords(dealclients, RegistrationStatus.Duplicate); //sortDuplicate


        }
        this.filteredDeal = dealclients;
        return dealclients;
    }

    getAllNotes() {
        let notes = [];

        this.dealTracker.expertGroup.forEach((group) => {
            group.experts.forEach((expert) => {
                let pool = [];
                expert.expertPoolColor.forEach((x) => {
                    pool.push(x.poolGroupName);
                });

                notes.push({
                    expertName: expert.expertNameWithoutAbbreviation,
                    note: expert.note,
                    title: expert.title,
                    expertPool: pool.join(", "),
                    category: expert.expertCategory.expertCategoryName
                });
            });
        });

        return notes;
    }

    sortDuplicateAndConflictedRecords(data: any, order: any) {
        let filterData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].registrationStatus != null && (data[i].registrationStatus.registrationStatusId == order)) {
                if (order == RegistrationStatus.Conflicted) {
                    if (data[i].stage?.registrationStageId != RegistrationStageEnum.Terminated) {
                        var removed = data.splice(data.indexOf(data[i]), 1);
                        filterData.push(removed[0]);
                        i--;
                    }

                }
                if (order == RegistrationStatus.Duplicate) {
                    var removed = data.splice(data.indexOf(data[i]), 1);
                    filterData.push(removed[0]);
                    i--;
                }
            }
        }
        if (filterData) {
            filterData.forEach(item => {
                data.push(item);
            })
        }
        return data;
    }

    getPriorityname(priorityname) {
        return priorityname == "" ? "" : "(" + priorityname + ")";
    }

    toggleAllocationActiveState(expert, index, dealClient: DealClient) {
        if (!this.checkActiveExpert(expert)) {
            let expectedState = !expert.isAllocationActive;
            this.dealStrategyService
                .toggleAllocationActiveState(dealClient?.registrationId, expectedState, expert?.employeeCode)
                .subscribe(
                    (res) => {
                        if (res > 0) {
                            expert.isAllocationActive = expectedState;
                            this.setActiveExpert(expert, expectedState);
                            this.setActiveExpertGrid(expert, expectedState);
                            this.setValidations();
                            this.toastr.showSuccess("Expert has been updated", "Success");
                        }
                    },
                    (error) => {
                        this.toastr.showError("Failed to update expert", "Error");
                    }
                );
        } else {
            this.toastr.showWarning("An Active record for " + expert.expertName + " already Exists", "Already Exists");
        }
        this.cancelAllocationActiveConfirm(expert, index);
    }

    setActiveExpertGrid(item, isActive) {
        // set status to active if clicked
        this.dealTracker.clients.forEach((obj) => {
            obj.heardFrom.forEach((heardFromExpert) => {
                if (item.employeeCode == heardFromExpert.employeeCode) {
                    heardFromExpert.isAllocationActive = isActive;
                }
            });
            obj.nextCall.forEach((nextCallExpert) => {
                if (item.employeeCode == nextCallExpert.employeeCode) {
                    nextCallExpert.isAllocationActive = isActive;
                }
            });
        });
    }

    checkActiveExpert(item): boolean {
        let existRecords = [];
        this.dealTracker.clients.forEach((obj) => {
            let t = obj.committed.filter(
                (committedExpert) =>
                    item.employeeCode == committedExpert.employeeCode && committedExpert.isAllocationActive
            );
            existRecords = existRecords.concat(t);
        });
        if (item.isAllocationActive) {
            existRecords = existRecords.filter(
                (e) => e.employeeCode != item.employeeCode && e.isAllocationActive != true
            );
        }
        if (existRecords != undefined && existRecords.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    setActiveExpert(RefExpert, IsActive) {
        if (this.dealTracker && this.dealTracker.expertGroup != undefined) {
            this.dealTracker.expertGroup.forEach((expertGroupElement) => {
                expertGroupElement.experts.forEach((expertElement) => {
                    if (expertElement.employeeCode == RefExpert.employeeCode) {
                        expertElement.isAllocationActive = IsActive;
                    }
                });
            });
        }
    }
    setActiveMultipleExpert(RefExpert, IsActive) {
        if (RefExpert && RefExpert.length > 0) {
            if (this.dealTracker && this.dealTracker.expertGroup != undefined) {
                this.dealTracker.expertGroup.forEach((expertGroupElement) => {
                    expertGroupElement.experts.forEach((expertElement) => {
                        RefExpert.forEach((element) => {
                            if (expertElement.employeeCode == element.employeeCode) {
                                expertElement.isAllocationActive = IsActive;
                            }
                        });
                    });
                });
            }
        }
    }

    setExpertPoolColor(currExpertCode) {
        let poolDetails = [];
        this.dealTracker.expertGroup.forEach((gp) => {
            gp.experts.forEach((expert) => {
                if (expert.employeeCode == currExpertCode) {
                    poolDetails.push({
                        expertPoolColor: gp.expertPoolColor,
                        expertGroupId: gp.expertGroupId,
                        poolExpertNotes: expert.note,
                        poolGroupName: gp.expertGroupName,
                        categoryId: expert.categoryId,
                        categoryName: expert.categoryName,
                        sortOrder: expert.sortOrder
                    });
                }
            });
        });
        return poolDetails;
    }

    setExpertPoolColorAndCategoryToClient(groupId: number, expert: any) {
        let isEmployeeMatch = false;
        this.dealTracker.clients?.forEach((currClient) => {
            for (let i = 0; i < currClient.committed?.length; i++) {
                if (currClient.committed[i].employeeCode == expert.employeeCode) {
                    expert.isAllocationActive = currClient.committed[i].isAllocationActive;
                    expert.expertState = currClient.committed[i].expertState;
                    Object.assign(currClient.committed[i], expert);
                    isEmployeeMatch = true;
                }
            }
            for (let i = 0; i < currClient.heardFrom?.length; i++) {
                if (currClient.heardFrom[i].employeeCode == expert.employeeCode) {
                    Object.assign(currClient.heardFrom[i], expert);
                    isEmployeeMatch = true;
                }
            }
            for (let i = 0; i < currClient.nextCall?.length; i++) {
                if (currClient.nextCall[i].employeeCode == expert.employeeCode) {
                    Object.assign(currClient.nextCall[i], expert);
                    isEmployeeMatch = true;
                }
            }
        });
        if (!isEmployeeMatch) {
            this.setExpertPoolColorToClient();
        }
    }

    isNoteAvailable(item) {
        let isAvailable = false;
        if (item && item.expertPoolColor) {
            item.expertPoolColor.forEach((element) => {
                if (
                    element.poolExpertNotes != null &&
                    element.poolExpertNotes != undefined &&
                    element.poolExpertNotes != ""
                ) {
                    isAvailable = true;
                    return isAvailable;
                }
            });
        }
        return isAvailable;
    }

    ngAfterViewChecked(): void {
        this.addCaseCodeEvent();
    }

    addCaseCodeEvent() {
        let element = document.getElementsByClassName("resourceAllocationCaseCode");
        for (let i = 0; i < element.length; i++) {
            const caseSpan = element[i] as HTMLElement;
            if (caseSpan.getAttribute("listener") !== "true") {
                caseSpan.addEventListener("click", this.selectAllocationInformation.bind(this));
                caseSpan.style.cursor = "pointer";
                caseSpan.setAttribute("listener", "true");
            }
        }
    }

    hasNACategory(item) {
        if (item.expertPoolColor) {
            return item.expertPoolColor.some((r) => r.categoryId == ExpertCategories.NotAvailable);
        }
    }

    // Show or hide the left side panel
    togglePanelCollapsed(event) {
        this.isPanelCollapsed = !this.isPanelCollapsed;
    }

    // Bring up the import export pool modal to add a new expert group
    setNewPool() {
        if (this.addPool == false) {
            this.addPool = true;
            this.expertGroups = null;

            if (
                this.coreService.loggedInUser.securityRoles.some(
                    (e) =>
                        e.id == RoleType.MultibidderManager ||
                        e.id == RoleType.TSGSupport ||
                        e.id == RoleType.PEGAdministrator ||
                        e.id == RoleType.PracticeAreaManagerRestricted ||
                        e.id == RoleType.PAM
                )
            ) {
                this.enableImport = true;
            }

            this.openExpertPool()
        } else {
            this.addPool = false;
        }
    }

    updateExpertGroup(val: any) {
        this.expertGroups = val;
        if (this.addPool == false) {
            this.addPool = true;
            this.enableImport = false;

            this.openExpertPool(true);
            // if (this.core.loggedInUser.securityRoles.some(e => e.id == RoleType.MultibidderManager || e.id == RoleType.TSGSupport || e.id == RoleType.PEGAdministrator || e.id == RoleType.PracticeAreaManagerRestricted || e.id == RoleType.PAM)) {
            //   this.enableImport = false;
            // }
        } else {
            this.addPool = false;
        }
    }

    // Add a new expert to the expert group
    addNewExpert(currentExpertGroup) {
        if (currentExpertGroup) {
            let newRow: any = {
                expertId: 0,
                employeeCode: "",
                expertName: "",
                categoryId: 0,
                categoryName: "-",
                sortOrder: 0,
                expertise: "",
                bainOffice: "",
                title: "",
                levelName: "",
                gradeName: "",
                expertIndustries: "",
                industry: "",
                expertClients: "",
                client: "",
                note: "",
                isMultipleEmployee: false,
                isMultipleClient: true,
                expertState: 0,
                filterState: 0,
                isExternalEmployee: false,
                employee: null,
                isEditing: false,
                isAllocationActive: false
            };

            currentExpertGroup.experts.push(newRow);
            this.AddExpert(newRow, currentExpertGroup.expertGroupId)
        }
    }

    openExpertPool(updateGroup: boolean = false) {
        this.expertModalRef = this.modalService.show(AddExpertPoolComponent, {
            class: 'expert-pool-popup modal-dialog-centered',
            ignoreBackdropClick: true,
            initialState: {
                // deal: this.deal,
                dealTracker: this.dealTracker,
                dealId: this.dealId,
                expertGroups: this.expertGroups,
                enableImport: this.enableImport,
                updateGroup: updateGroup
            }
        });

        // save expert group
        this.expertModalRef.content.saveExpertGroup.subscribe((res) => {
            this.saveExpertGroup(res);
        });

        // close pool
        this.expertModalRef.content.closeExpertPool.subscribe((res) => {
            this.closeExpertPool(res);
        });
    }

    closeExpertPool(event) {
        this.addPool = false;
        this.expertModalRef.hide();
    }

    saveExpertGroup(event) {
        event.expertGroup.experts = event.expertGroup.experts ? event.expertGroup.experts.filter(x => (x.employeeCode != "" && x.employeeCode != null)) : [];
        this.dealService.saveExpertGroups(event.expertGroup).subscribe((res) => {
            if (res) {
                if (event.poolEdit == "Add") {
                    // Map the expert group id with experts
                    if (res && res.experts && res.experts.length > 0) {
                        res.experts.forEach((expert) => {
                            expert.expertGroupId = res.expertGroupId;
                            expert.sortOrder = this.expertCategories[this.expertCategories.length - 1].sortOrder; // Default to the last sort order

                            if (event.expertGroup && event.expertGroup.expertPoolColor) {
                                let expertPoolColor: any = JSON.parse(JSON.stringify(event.expertGroup.expertPoolColor)); // Clone object to prevent change by reference
                                if (!expertPoolColor) {
                                    expertPoolColor = new Object as any;
                                }
                                expertPoolColor.expertGroupId = res.expertGroupId;
                                expertPoolColor.poolGroupName = event?.expertGroup?.expertGroupName;
                                if (expert.note) {
                                    expertPoolColor.poolExpertNotes = expert.note;
                                }
                                expert.expertPoolColor = [expertPoolColor];
                            }
                        });
                    }

                    this.dealTracker.expertGroup.push(res);
                    this.toastr.showSuccess("Expert Group has been added", "Success");
                } else {
                    this.setExpertPoolColorToClient();
                    this.toastr.showSuccess("Expert Group has been updated", "Success");
                }

            }
        });
        this.closeExpertPool(false);
    }

    openCaseEditor(event: Event, value, client) {
        this.openedCaseEditorClient = client?.registrationId;
        this.isCaseEditor = value;
        event.stopPropagation();
    }

    openInfoEmailModal(event: Event) {


        let url = this.router.serializeUrl(
            this.router.createUrlTree(["/deals/deal/" + this.dealId + "/true"])
        );
        url = url.replace("%3B", ";");
        url = url.replace("%3D", "=");
        url = url.replace("%3F", "?");
        window.open(url, '_blank');


    }
    openClientEmailPopUp() {

        let dealClientsForEmail: DealTrackerClientForEmail[] = [];
        this.dealTracker.clients.forEach(client => {
            dealClientsForEmail.push({
                ...client,
                additionalPartnersToEmail: []
            })
        });
        const initialState = {
            dealClients: dealClientsForEmail,
            targetName: this.targetName,
            managedByRegion: this.managedByRegion
        };

        this.bsModalRef = this.modalService.show(ClientEmailPopUpComponent, { class: 'modal-dialog-centered  client-email-popup', initialState, id: 2, ignoreBackdropClick: true });
        this.isModalOpen = true;
        this.bsModalRef.content.onEmailSendSubmit.subscribe((a) => {

            if (a == "reset") {
                this.routeToTracker();
            }
            else {
                this.dealStrategyService.sendClientEmail(a).subscribe((isEmailSent) => {
                    //Refershing Deal clients to get update the notes for each deal tracker./
                    if (isEmailSent) {
                    }
                    this.routeToTracker();
                });
            }
        });
    }
    routeToTracker() {
        this.isModalOpen = false;

        this.router.navigateByUrl("/deals/deal/" + this.dealId);
    }

    updateCaseData(event, label) {
        let selectedClientForCase = this.dealTracker.clients?.find(
            (element) => element.registrationId == this.openedCaseEditorClient
        );
        selectedClientForCase.caseInfo = event;
        this.updateDealTrackerClient(selectedClientForCase, "caseInfo");
        this.isCaseEditor = false;
        this.closePipelineExpertInfo();
    }
    updateOpportunityTypeDetails(event, client) {
        client.opportunityTypeDetails = event;
        client.tempOpportunityTypeDetails = JSON.parse(JSON.stringify(event));
        this.updateDealTrackerClient(client, "opportunitytypedetails");

    }
    removeCase(client) {
        client.caseInfo = null;
        this.updateDealTrackerClient(client, "caseInfo");
    }

    isDuplicateExpert(employee, group) {
        let len = group?.experts.filter((ele) => ele.employeeCode == employee.employeeCode && ele.employeeCode != null).length;
        if (len > 0) {
            return true;
        } else {
            return false;
        }
    }

    onSelectionChange(employee, item, group) {
        if (this.isDuplicateExpert(employee, group)) {
            this.toastr.showWarning(
                "The expert " + (employee != undefined ? employee.searchableName : "") + "already exist in this group.",
                "Alert"
            );
            this.selectedExpert = null;
        } else {
            let otherPools = this.dealTracker.expertGroup.filter((a) => a.expertGroupId != group.expertGroupId);
            let employeeinOtherPools: number = 0;
            otherPools.forEach((element) => {
                if (element.experts.filter((e) => e.employeeCode == item.employeeCode).length > 0) {
                    employeeinOtherPools = employeeinOtherPools + 1;
                }
            });

            if (employeeinOtherPools > 0) {
                this.AddExpert(item, group.expertGroupId);
                item.isEditing = false;
                this.typeaheadEmployeeList = [];
            } else {
                if (this.isExpertIsAllocated(this.dealTracker, item.employeeCode)) {
                    const initialState = {
                        data:
                            "This action will delete the allocation for " +
                            item.expertName +
                            ". Would you like to continue?",
                        title: "Confirmation"
                    };
                    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
                    this.bsModalRef.content.closeBtnName = "Close";

                    this.bsModalRef.content.event.subscribe((a) => {
                        if (a == "reset") {
                            this.deleteExpertsfromClientAllocations(item.employeeCode);
                            this.setExpertPoolColorToClient();
                            this.deleteClientAllocation(item.employeeCode);
                            this.AddExpert(item, group.expertGroupId);
                            item.isEditing = false;
                            this.typeaheadEmployeeList = [];
                        }
                        else {
                            item.isEditing = false;
                            this.typeaheadEmployeeList = [];
                            this.selectedExpert = null;
                        }
                    });
                } else {
                    this.AddExpert(item, group.expertGroupId);
                    item.isEditing = false;
                    this.typeaheadEmployeeList = [];
                }
            }
        }
    }

    deleteClientAllocation(employeeCode: string) {
        this.dealStrategyService.deleteClientAllocation(employeeCode, this.dealId).subscribe((res) => { });
    }
    AddExpert(item, expertGroupId) {
        let employee =
            this.typeaheadEmployeeList != undefined && this.selectedExpert
                ? this.typeaheadEmployeeList.find((x) => x.employeeCode == this.selectedExpert.employeeCode)
                : undefined;

        if (employee) {
            item.expertName = this.selectedExpert != null ? this.selectedExpert.searchableName : undefined;
            item.expertData = this.selectedExpert;
            item.bainOffice = employee.officeName;
            item.employeeCode = employee.employeeCode;
            item.title = employee.title;
            item.levelName = employee.levelName;
            item.abbreviation = employee.abbreviation;
            item.gradeName = employee.gradeName !== "0" ? employee.gradeName : "";
            item.isExternalEmployee = employee.employeeStatusCode == "EX" ? true : false;
            item.expertNameWithoutAbbreviation = this.selectedExpert
                ? CommonMethods.getEmployeeNameWithoutAbbr(this.selectedExpert)
                : undefined;
            item.officeAbbreviation = this.selectedExpert ? this.selectedExpert.officeAbbreviation : "";
            item.sortOrder = item.sortOrder ? item.sortOrder : this.nonCategoryExpertSortOrder;
            item.statusCode = employee?.statusCode;
            item.expertGroupId = expertGroupId;
            item.internetAddress = employee.internetAddress;
        } else {
            item.title = "";
            item.levelName = "";
            item.gradeName = "";
            item.bainOffice = "";
            item.abbreviation = "";
            item.expertName = this.selectedExpert != null ? this.selectedExpert.searchableName : undefined;
            item.employeeCode = CommonMethods.getGUID();// this.selectedExpert != null ? CommonMethods.getGUID() : undefined;
            item.expertNameWithoutAbbreviation = this.selectedExpert ? this.selectedExpert.searchableName : "";
            item.officeAbbreviation = "";
            item.sortOrder = item.sortOrder ? item.sortOrder : this.nonCategoryExpertSortOrder;
            item.expertGroupId = expertGroupId;
            let externalEmployee: Partner = {
                employeeCode: item.employeeCode,
                searchableName: this.selectedExpert != null ? this.selectedExpert.searchableName : undefined,
                familiarName: "",
                firstName: "",
                lastName: "",
                partnerWorkTypeName: null,
                region: null,
                officeAbbreviation: ""
            };
            item.isExternalEmployee = this.selectedExpert != null ? true : false;
            this.selectedExpert = externalEmployee;
        }
        let addingNew = item.expertId == 0;

        this.saveExpert(item, addingNew);
        this.selectedExpert = null;
    }

    mapxpertObject(expert: Expert, groupId: number) {
        this.dealTracker.expertGroup.forEach((grp) => {
            if (grp.expertGroupId == groupId) {
                for (let i = 0; i < grp.experts.length; i++) {
                    if (grp.experts[i].employeeCode == expert.employeeCode) {
                        grp.experts[i] = expert;
                    }
                }
            }
        });

        expert.expertPoolColor = this.setExpertPoolColor(expert.employeeCode);

        this.dealTracker?.expertGroup?.forEach((currGroup) => {
            currGroup.experts.forEach((currExp) => {
                if (currExp.employeeCode == expert.employeeCode) {
                    currExp.expertPoolColor = expert.expertPoolColor;
                }
            });
        });
        this.setExpertPoolColorAndCategoryToClient(groupId, expert);
        this.setValidations();
    }

    editExpert(item) {
        item.isEditing = true;
    }

    selectStage(event: Event, client) {
        this.isSelectStage = true;
        this.selectedDealClient = client.registrationId;
        event.stopPropagation();

        // for opening 'update stage modal'
        let stageValue: RegistrationStage = client.registrationStage;

        if ((stageValue.registrationStageId == RegistrationStageEnum.WorkStarted || stageValue.registrationStageId == RegistrationStageEnum.WorkCompleted)
            && !this.canEditAnyStage) {
            return;
        } else {
            this.openStageModal(event, client);
        }
    }

    openStageModal(event, client) {
        let stageValue: RegistrationStage = client.registrationStage;

        const modalRef = this.modalService.show(UpdateStageModalComponent, {
            initialState: {
                modalData: stageValue,
                registrationId: client.registrationId,
                targetData: (client?.target?.targetName) ? client?.target?.targetName : 'No target'
            },
            class: "modal-dialog-centered closed-detail-popup",
            backdrop: "static", keyboard: false
        });

        modalRef.content.saveClosedEmitter.subscribe((res) => {
            this.isSelectStage = false;
            this.selectedDealClient = 0;

            // stage data

            if (client.registrationStage.registrationStageId != res.stage.registrationStageId) {
                client.registrationStage = res.stage;
                this.updateDealTrackerClient(client, "registrationStage");
            }


            client.registrationStage = res.stage;
            // closed data
            let closedDetailData: RegistrationClosedInfo = res.closedInfo;
            closedDetailData.registrationId = client.registrationId;

            this.registrationService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
                this.closePipelineExpertInfo();
                this.toastr.showSuccess("Stage information Updated", "Success");
            });

        });
    }

    selectLikelihood(event: Event, client, index) {
        this.isSelectLikelihood = true;
        this.selectedLikelihood = client.likelihood;
        this.selectedIndex = index;
        event.stopPropagation();
    }

    selectRetainer(event: Event, client, index) {
        this.isSelectRetainer = true;
        this.selectedRetainer = this.retainerList.find(r => r.value == client.isRetainer);
        this.selectedIndex = index;
        event.stopPropagation();
    }
    selectRetainerNotes(event: Event, client, index) {
        this.isSelectRetainerNotes = true;
        this.selectedRetainerNotes = client.retainerNotes;
        this.selectedIndex = index;
        event.stopPropagation();
    }

    onStageSelectionChange(event, client) {
        this.isSelectStage = false;
        this.selectedDealClient = 0;
        client.registrationStage = event;
        this.updateDealTrackerClient(client, "registrationStage");

        // Display closed modal
        let stageValue: RegistrationStage = event;

        const modalRef = this.modalService.show(UpdateStageModalComponent, {
            initialState: {
                modalData: stageValue,
                registrationId: client.registrationId,
                targetData: client.target.targetName
            },
            class: "modal-dialog-centered closed-detail-popup",
            backdrop: "static", keyboard: false
        });

        modalRef.content.saveClosedEmitter.subscribe((res) => {
            let closedDetailData: RegistrationClosedInfo = res;
            closedDetailData.registrationId = client.registrationId;

            this.registrationService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
                this.toastr.showSuccess("Reasons for closing submitted", "Success");
            });
        });
    }

    onLikelihoodSelectionChange(event, client) {
        this.isSelectLikelihood = false;
        this.selectedLikelihood = {};
        client.likelihood = event;
        this.updateDealTrackerClient(client, "likelihood");
    }

    onRetainerSelectionChange(event, client) {
        this.isSelectRetainer = false;
        this.selectedRetainer = {};
        client.isRetainer = event.value;
        this.updateDealTrackerClient(client, "IsRetainer");
    }
    onRetainerNotesChange(event, client) {
        this.isSelectRetainerNotes = false;
        this.selectedRetainerNotes = undefined;
        client.retainerNotes = event.target.value;
        this.updateDealTrackerClient(client, "RetainerNotes");

    }
    upsertDealClientAllocation(allocationTypeId: string, expertData: Expert, dealClient: DealTrackerClient) {
        let allocationType: number;
        if (allocationTypeId.includes("comitted")) {
            allocationType = DealAllocationType.Committed;
        } else if (allocationTypeId.includes("heardFrom")) {
            allocationType = DealAllocationType.HeardFrom;
        } else if (allocationTypeId.includes("nextCall")) {
            allocationType = DealAllocationType.NextCall;
        } else {
            allocationType = 0;
        }

        this.dealStrategyService
            .saveExpertAllocation(
                expertData.employeeCode,
                this.dealId,
                allocationType,
                dealClient?.registrationId,
                expertData.isExternalEmployee,
                expertData.isAllocationActive,
                this.isDelete
            )
            .subscribe(
                (dealTracker) => {
                    if (dealTracker != null) {
                        this.dealTracker.expertGroup = dealTracker.expertGroup;
                        this.dealTracker.clients = dealTracker.clients;
                        this.dealTracker.clientAllocations = dealTracker.clientAllocations;

                        if (this.dealTracker) {
                            this.renderAllocationTab(this.dealTracker.dealId);
                        }
                        this.toastr.showSuccess("Allocation has been updated", "Success");
                    }
                    this.isDelete = false;
                },
                (error) => {
                    this.toastr.showError("Failed to update Allocations", "Error");
                }
            );
    }

    deleteExpertGroup(expertGroupId) {
        let expertGroup = this.dealTracker.expertGroup.filter((a) => a.expertGroupId == expertGroupId);
        let otherPools = this.dealTracker.expertGroup.filter((a) => a.expertGroupId != expertGroupId);
        let employeeinOtherPools: number = 0;

        //remove group if there is no expert
        if (expertGroup[0].experts.length == 0) {
            this.dealTracker.expertGroup = this.dealTracker.expertGroup.filter((a) => a.expertGroupId != expertGroupId);
            this.dealService.deleteExpertGroupById(expertGroupId, this.dealId).subscribe((res) => {
                this.setExpertPoolColorToClient();
                this.getMbStrategyById();
                this.toastr.showSuccess("ExpertGoup has been deleted", "Success");
            });
        }
        if (expertGroup && expertGroup[0].experts && expertGroup[0].experts.length > 0) {
            let allocatedExperts: number = 0;
            let expertsToBeRemoved: string = "";
            expertGroup[0].experts.forEach((element) => {
                //Fetching allocations
                let isExpertAllocated = this.isExpertIsAllocated(this.dealTracker, element.employeeCode);
                //check if exists in another pool
                if (otherPools.length > 0) {
                    let pools = otherPools.filter((x) => x.experts.some((s) => s.employeeCode == element.employeeCode));
                    if ((!pools || pools.length == 0) && isExpertAllocated) {
                        expertsToBeRemoved += element.expertName + "; ";
                        allocatedExperts = allocatedExperts + 1;
                    }
                } else if (isExpertAllocated) {
                    expertsToBeRemoved += element.expertName + "; ";
                    allocatedExperts = allocatedExperts + 1;
                }
            });
            //case1:If one or more then one is allocated
            if (allocatedExperts > 0) {
                let message =
                    expertGroup[0].experts.length != allocatedExperts
                        ? expertsToBeRemoved + "will be removed from their allocations. Would you like to continue?"
                        : "Experts associated with only this pool will be removed from their allocations. Would you like to continue?";

                const initialState = {
                    data: message,
                    title: "Confirmation"
                };
                this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
                this.bsModalRef.content.closeBtnName = "Close";

                this.bsModalRef.content.event.subscribe((a) => {
                    if (a == "reset") {
                        expertGroup[0].experts.forEach((expert) => {
                            if (otherPools.length > 0) {
                                otherPools.forEach((element) => {
                                    if (
                                        element.experts.filter(
                                            (e) => e != null && e.employeeCode == expert.employeeCode
                                        ).length == 0
                                    ) {
                                        this.deleteExpertsfromClientAllocations(expert.employeeCode);
                                    }
                                });
                            } else {
                                this.deleteExpertsfromClientAllocations(expert.employeeCode);
                            }
                        });
                        this.dealTracker.expertGroup = this.dealTracker.expertGroup.filter(
                            (a) => a.expertGroupId != expertGroupId
                        );
                        this.dealService.deleteExpertGroupById(expertGroupId, this.dealId).subscribe((res) => {
                            this.setExpertPoolColorToClient();
                            this.getMbStrategyById();
                            this.toastr.showSuccess("ExpertGoup has been deleted", "Success");
                        });
                    }
                });
            } else {
                this.dealTracker.expertGroup = this.dealTracker.expertGroup.filter(
                    (a) => a.expertGroupId != expertGroupId
                );
                this.dealService.deleteExpertGroupById(expertGroupId, this.dealId).subscribe((res) => {
                    this.setExpertPoolColorToClient();
                    this.getMbStrategyById();
                    this.toastr.showSuccess("ExpertGoup has been deleted", "Success");
                });
            }
        }
    }

    isExpertIsAllocated(dealData: DealTracker, expert): boolean {
        let allocationExists: boolean = false;
        if (expert != undefined && expert != null) {
            if (dealData.clientAllocations.findIndex((a) => a.employeeCode == expert) > -1) {
                allocationExists = true;
            }
            for (let i = 0; i < dealData.clients.length; i++) {
                let allocation = dealData.clients[i].committed.concat(
                    dealData.clients[i].heardFrom,
                    dealData.clients[i].nextCall
                );
                if (allocation[0] != undefined) {
                    let isAllocated = allocation.find((e) => e.employeeCode == expert);
                    if (isAllocated != undefined) {
                        allocationExists = true;
                    }
                }
            }
            return allocationExists;
        }
    }

    deleteExpertsfromClientAllocations(employee: string) {
        // remove from client allocation
        let employeeCount = 0;
        this.dealTracker.expertGroup.forEach((ele) => {
            if (ele.experts.find((x) => x.employeeCode == employee)) {
                employeeCount++;
            }
        });
        if (employeeCount <= 1) {
            this.dealTracker.clientAllocations = this.dealTracker.clientAllocations.filter(
                (e) => e.employeeCode != employee
            );

            //Method to delete allocation for experts
            this.dealTracker.clients.forEach((element) => {
                if (
                    element.committed &&
                    element.committed.length > 0 &&
                    element.committed.findIndex((a) => a.employeeCode == employee) > -1
                ) {
                    element.committed = element.committed.filter((a) => a.employeeCode != employee);
                }
                if (
                    element.heardFrom &&
                    element.heardFrom.length > 0 &&
                    element.heardFrom.findIndex((a) => a.employeeCode == employee) > -1
                ) {
                    element.heardFrom = element.heardFrom.filter((a) => a.employeeCode != employee);
                }
                if (
                    element.nextCall &&
                    element.nextCall.length > 0 &&
                    element.nextCall.findIndex((a) => a.employeeCode == employee) > -1
                ) {
                    element.nextCall = element.nextCall.filter((a) => a.employeeCode != employee);
                }
            });
        }
    }

    deleteExpert(expertId, ExpertGroupId) {
        let expertPool = this.dealTracker.expertGroup.filter((a) => a.expertGroupId == ExpertGroupId);
        let otherPools = this.dealTracker.expertGroup.filter((a) => a.expertGroupId != ExpertGroupId);
        let expertPoolIndex = this.dealTracker.expertGroup.indexOf(expertPool[0]);
        let expert: Expert[] = this.dealTracker.expertGroup[expertPoolIndex].experts.filter(
            (a) => a.expertId == expertId
        );
        let employeeinOtherPools: number = 0;

        if (expert[0].expertName != null) {

            otherPools.forEach((element) => {
                if (element.experts.filter((e) => e.employeeCode == expert[0].employeeCode).length > 0) {
                    employeeinOtherPools = employeeinOtherPools + 1;
                }
            });

            if (employeeinOtherPools > 0) {
                this.dealTracker.expertGroup[expertPoolIndex].experts = this.dealTracker.expertGroup[
                    expertPoolIndex
                ].experts.filter((a) => a.employeeCode != expert[0].employeeCode);
                this.dealService.deleteExpertById(expertId, this.dealId).subscribe((res) => {
                    this.setExpertPoolColorToClient();
                    this.toastr.showSuccess("Expert has been deleted", "Success");
                });
            } else {
                if (expert && expert.length > 0) {
                    if (this.isExpertIsAllocated(this.dealTracker, expert[0].employeeCode)) {
                        const initialState = {
                            data:
                                "This action will delete the allocation for " +
                                expert[0].expertName +
                                ". Would you like to continue?",
                            title: "Confirmation"
                        };
                        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
                        this.bsModalRef.content.closeBtnName = "Close";

                        this.bsModalRef.content.event.subscribe((a) => {
                            if (a == "reset") {
                                this.deleteExpertsfromClientAllocations(expert[0].employeeCode);
                                this.dealTracker.expertGroup[expertPoolIndex].experts = this.dealTracker.expertGroup[
                                    expertPoolIndex
                                ].experts.filter((a) => a.employeeCode != expert[0].employeeCode);

                                this.dealService.deleteExpertById(expertId, this.dealId).subscribe((res) => {
                                    this.setExpertPoolColorToClient();
                                    this.toastr.showSuccess("Expert has been deleted", "Success");
                                });
                            }
                        });
                    } else {
                        this.dealService.deleteExpertById(expertId, this.dealId).subscribe((res) => {
                            this.toastr.showSuccess("Expert has been deleted", "Success");
                        });
                        this.dealTracker.expertGroup[expertPoolIndex].experts = this.dealTracker.expertGroup[
                            expertPoolIndex
                        ].experts.filter((a) => a.employeeCode != expert[0].employeeCode);
                    }
                }
            }
        }
        else {

            this.dealService.deleteExpertById(expertId, this.dealId).subscribe((res) => {
                this.toastr.showSuccess("Expert has been deleted", "Success");
            });
            this.dealTracker.expertGroup[expertPoolIndex].experts = this.dealTracker.expertGroup[
                expertPoolIndex
            ].experts.filter((a) => a.expertId != expert[0].expertId);

        }
    }
    mapExpertNotes(event, item) {
        item.expertPoolColor.forEach((element) => {
            let expertPoolIndex = this.dealTracker.expertGroup.findIndex(
                (x) => x.expertGroupId == element.expertGroupId
            );
            let expert: Expert = this.dealTracker.expertGroup[expertPoolIndex].experts.find(
                (a) => a.employeeCode == item.employeeCode
            );
            let colorItem = expert.expertPoolColor.find((x) => x.expertGroupId == event.expertGroupId);
            if (colorItem != undefined) {
                colorItem.poolExpertNotes = event?.poolExpertNotes;
            } else {
                expert.expertPoolColor.push(event);
            }

            if (event.expertGroupId == element.expertGroupId) {
                expert.note = event?.poolExpertNotes;
            }
        });
    }

    // When user presses enter, start a new line
    onEnterKeyPress(event) {
        event.stopPropagation();
    }

    saveExpertNote(event, item) {
        this.mapExpertNotes(event, item);
        let expertPoolIndex = this.dealTracker.expertGroup.findIndex((x) => x.expertGroupId == event.expertGroupId);
        let expert: Expert = this.dealTracker.expertGroup[expertPoolIndex].experts.find(
            (a) => a.employeeCode == item.employeeCode
        );
        expert.note = event?.poolExpertNotes;
        this.updatedExperts.push(expert);
        this.dealService.saveExpert(expert).subscribe((res) => {
            if (res) {
                this.toastr.showSuccess("Expert has been updated", "Success");
            }
        });
    }

    saveCategory(category, expert, i) {
        // Add background color when rating has been changed
        this.categoryGrouping = i
        this.categoryName = expert.expertName;
        if (category && category != undefined) {
            expert.expertCategory = category;
        } else {
            expert.expertCategory.expertCategoryId = 0;
            expert.expertCategory.expertCategoryName = "-";
        }

        this.saveExpert(expert);
    }
    getdata(empAlertStatus: any) {

        let alertMessage = [];
        if (empAlertStatus && empAlertStatus?.length > 0) {
            alertMessage = CommonMethods.GenerateEmployeeAlertTooltipArray(empAlertStatus);
        }

        return alertMessage;
    }
    saveExpert(expert, addingNew = false) {
        this.dealService.saveExpert(expert).subscribe((res) => {
            if (res) {
                // Add background color when rating has been changed
                this.active = true;
                this.mapxpertObject(res, res.expertGroupId);
                this.toastr.showSuccess("Expert has been updated", "Success");

                // When a new expert has been added, automatically select the last expert in the group for editing
                if (addingNew) {
                    let experts = this.dealTracker.expertGroup.find((x) => x.expertGroupId == expert.expertGroupId).experts;
                    let curentEditableExpert: any = experts.find(e => e.expertId == res.expertId);
                    if (curentEditableExpert) {
                        curentEditableExpert.isEditing = true;
                    }
                }
            }
        });
    }

    onExpertPopupHide() {
        // Show any expert updated that have been made since the popup was opened
        let self = this;
        this.updatedExperts.forEach(function (expert, index) {
            self.mapxpertObject(expert, expert.expertGroupId);
        });
        this.updatedExperts = [];
    }

    openInOutlook() {
        this.isRightClick = true;
        let dealTracker = this.dealTracker as any;
        let expertGroupList: any[] = [];
        dealTracker?.expertGroup.forEach((element) => {
            if (element.hasOwnProperty("isRowSelected") && element.isRowSelected == true) {
                expertGroupList.push(element);
                delete element?.isRowSelected;
            }
        });
        if (expertGroupList && expertGroupList.length > 0) {
            this.expertDetailMailService.sendExpertDetailsMail(expertGroupList);
            this.isRightClick = false;
        } else {
            this.toastrService.showWarning(
                "Please select atleast one expert pool row",
                "Please select a expert pool row"
            );
        }
    }

    requestExpertiseEmail(expertPool: expertGroup) {
        this.openExpertiseRequestEmail.emit(expertPool);
    }

    clickOnPool(event, group) {
        if (event.ctrlKey) {
            if (group.isRowSelected == undefined) {
                group.isRowSelected = true;
            } else {
                group.isRowSelected = !group.isRowSelected;
            }
        }
    }

    // Click the add a client button and bring up the modal window
    addNewClient(event) {
        this.bsModalRef = this.modalService.show(ClientEditorPopUpComponent, {});
        this.bsModalRef.content.outPlaceHolderChange.subscribe((addedClient) => {
            this.dealClient.client = addedClient.client;
            this.dealClient.RegistrationSubmitter = addedClient.submittedBy;
            this.updateAssetStatus.emit();
            this.updateDealTrackerClient(this.dealClient, "client");

        });
    }


    // Open Expert Notes Summary
    openExpertNotesPopup() {
        let notesToSend = this.getAllNotes();

        this.bsModalRef = this.modalService.show(ExpertNotesSummaryPopupComponent, {
            initialState: {
                notes: notesToSend
            },
            class: "expert-notes-summary-popup modal-dialog-centered",
            ignoreBackdropClick: false
        })
    }

    // Open Clients popup
    openClientsPopup() {
        let clientsData = this.uniqueClients();

        this.bsModalRef = this.modalService.show(StrategyClientPopupComponent, {
            initialState: {
                clients: clientsData
            },
            class: "strategy-client-popup modal-dialog-centered",
            ignoreBackdropClick: false
        });
    }

    // Click the add a client button and bring up the modal window
    editClient(client) {
        const initialState = {
            selectedClient: client.client,
            dealclient: client,
            inputSubmittedBy: client.registrationSubmitter,
            mode: "edit"
        };
        this.bsModalRef = this.modalService.show(ClientEditorPopUpComponent, { initialState });

        // Edit API call goes here

        this.bsModalRef.content.outPlaceHolderChange.subscribe((response) => {
            initialState.dealclient.client = response.client;
            initialState.dealclient.registrationSubmitter = response.submittedBy;

            this.updateDealTrackerClient(initialState.dealclient, "client");
        });
    }

    // Confirm if a client should be deleted
    deleteClientConfirm(client) {
        const initialState = {
            data:
                client.client.clientName +
                " will be removed along with allocations associated with this client. Would you like to continue?",
            title: "Confirmation"
        };

        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
        this.bsModalRef.content.closeBtnName = "Close";

        this.bsModalRef.content.event.subscribe((a) => {
            if (a == "reset") {
                // Delete client API call goes here
                this.setActiveMultipleExpert(client.committed, false);

                this.deleteClient(client.registrationId);
            }
        });
    }
    deleteClient(registrationId) {
        this.dealStrategyService.deleteClientById(registrationId, this.dealId).subscribe((res) => {
            this.dealTracker.clients = this.dealTracker.clients.filter((a) => a.registrationId != registrationId);
            this.dealStrategyService.getSellSideStatusByDealId(this.dealId).subscribe((sellSideStatus) => {
                if (sellSideStatus && sellSideStatus != 0) {
                    this.dealTracker.sellSideStatus = sellSideStatus;
                    this.updateSellSideStatus.emit(sellSideStatus);
                }
            });

            this.toastr.showSuccess("Cleint has been deleted", "Success");
        });
    }

    // Update a client when expected start date, likelihood, etc. are changed

    updateDealTrackerClient(client, fieldName) {
        // API calls go here
        if (fieldName == 'ExpectedStartDate' && client.expectedStartDate != null) {
            client.expectedStartDate = moment(client.expectedStartDate, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ").format("DD-MMM-YYYY");
        }
        this.dealStrategyService.saveClientDetails(client, fieldName, this.dealId).subscribe((res) => {
            if (res) {

                this.dealTracker.clients.forEach((e) => {
                    if (e.registrationId == client.registrationId) {
                        res.committed = e.committed;
                        res.nextCall = e.nextCall;
                        res.heardFrom = e.heardFrom;
                        Object.assign(e, res);
                        if (e.expectedStartDate != undefined) {
                            e.expectedStartDate = moment(e.expectedStartDate.split("T")[0]).toDate();
                        }

                    }
                });
                this.mapDealClientValues(res, fieldName);
                if (this.dealTracker.clients?.length > 0) {
                    this.IsReadyForAllocation = true;
                }

                if (fieldName == "client" || fieldName == "registrationStage" || fieldName == "caseInfo") {
                    this.dealStrategyService.getMBStatusByDealId(this.dealId).subscribe((mbStatus) => {
                        if (mbStatus && mbStatus != 0) {
                            this.dealTracker.mbStatus = mbStatus;
                            this.updateMBStatus.emit(mbStatus);
                        }
                    });

                    this.dealStrategyService.getSellSideStatusByDealId(this.dealId).subscribe((sellSideStatus) => {
                        if (sellSideStatus && sellSideStatus != 0) {
                            this.dealTracker.sellSideStatus = sellSideStatus;
                            this.updateSellSideStatus.emit(sellSideStatus);
                        }
                    });
                }

                this.toastr.showSuccess(this.getFieldNameLabel(fieldName) + " has been updated", "Success");
            }
        });
    }
    getFieldNameLabel(fieldName: string) {
        switch (fieldName) {
            case "opportunitytypedetails": return "Opportunity Type Details"; break;
            default: return fieldName; break;
        }
    }
    removeExpectedStartDate(client) {
        client.expectedStartDate = null;
        this.updateDealTrackerClient(client, "ExpectedStartDate");
    }

    mapDealClientValues(clientData, fieldName) {
        if (fieldName == "client") {
            if (clientData.client?.basisClientId) {
                this.dealStrategyService
                    .getClientHeadsByClientName(clientData.client.basisClientId)
                    .subscribe((res) => {
                        let index = this.dealTracker.clients.findIndex((x) => x.registrationId == clientData.registrationId);
                        if (res["partners"] != null && res["partners"] != undefined && res["partners"].length > 0) {
                            if (index > -1) {
                                this.dealTracker.clients[index].clientHeads = res["partners"];
                                this.dealTracker.clients[index].clientHeadsName = CommonMethods.getEmployeeNameList(this.dealTracker.clients[index].clientHeads).join(
                                    " | "
                                );
                            }
                            else {
                                clientData.clientHeads = res["partners"];
                                clientData.clientHeadsName = CommonMethods.getEmployeeNameList(clientData.clientHeads).join(
                                    " | "
                                );
                            }

                        }
                        else if (index > -1) {
                            this.dealTracker.clients[index].clientHeads = null;
                            this.dealTracker.clients[index].clientHeadsName = "";
                        }
                    });
            }
            let index = this.dealTracker.clients.findIndex((x) => x.registrationId == clientData.registrationId);
            if (index > -1) {
                this.dealTracker.clients[index].priority = clientData?.priority;
            } else {
                this.dealTracker.clients.push(clientData);
            }

        }
        if (fieldName == "registrationStage") {
            this.dealTracker.clients.find(dtr => dtr.registrationId == clientData.registrationId).registrationStage = clientData.registrationStage;
            this.updateDealTracker.emit(this.dealTracker.clients);

        }

    }

    setPartners(data, currentClient) { }

    // Reposition the left panel popover to  align with the clicked item
    positionPanelPopover(event) {
        let topPosition =
            event.target.getBoundingClientRect().top -
            document.querySelector("app-deal-strategy").getBoundingClientRect().top;

        // Position the popover above the element if it doesn't fit below
        if (event.screenY + 325 > window.innerHeight) {
            topPosition -= 325;
        }

        setTimeout(function () {
            let popover: HTMLElement = document.querySelector("popover-container");
            popover.style.top = topPosition + "px";
            popover.setAttribute("popover-visible", "true");
        }, 10);
    }

    @HostListener("document:click", ["$event"])
    clickout(event) {
        // deactivate focus row on click
        this.active = false;
        if (!event.ctrlKey && !this.isRightClick) {
            let dealTracker = this.dealTracker as any;
            dealTracker?.expertGroup?.forEach((element) => {
                if (element?.hasOwnProperty("isRowSelected")) {
                    delete element?.isRowSelected;
                }
            });
        }

        if (this.isCaseEditor) {
            this.isCaseEditor = false;
        }
        if (this.isSelectStage && document.querySelectorAll(".stage-select:hover").length == 0) {
            this.isSelectStage = false;
        }
        if (this.isSelectLikelihood) {
            this.isSelectLikelihood = false;
            this.selectedIndex = -1;
        }
        if (this.isSelectRetainer) {
            this.isSelectRetainer = false;
            this.selectedIndex = -1;
        }
        if (this.isSelectRetainerNotes) {
            this.isSelectRetainerNotes = false;
            this.selectedIndex = -1;
        }
    }

    toggleAllExperts(index) {
        let toggleGroupExpertsCta = document.querySelectorAll<HTMLElement>(".expertGroup-" + index);
        let expertsToToggle = document.querySelectorAll<HTMLElement>(".expert-row-" + index);
        let groupToToggle = document.querySelector<HTMLElement>("#expertGroupList" + index);
        let groupCta = document.querySelectorAll<HTMLElement>(".expertGroup > #btnCollapse")[index];

        if (!groupToToggle.classList.contains("show")) {
            groupToToggle.classList.add("show");
            groupToToggle.classList.remove("collapsed");
            groupCta.classList.add("show");
            groupCta.classList.remove("collapsed");
        }

        if (toggleGroupExpertsCta[0].classList.contains("collapsed")) {
            // Toggle Experts
            expertsToToggle.forEach((item) => {
                if (!item.classList.contains("show")) {
                    item.classList.add("show");
                }
            });

            // Toggle CTAs
            toggleGroupExpertsCta.forEach((item) => {
                if (item.classList.contains("collapsed")) {
                    item.classList.remove("collapsed");
                }
            });
        } else {
            // Toggle Experts
            expertsToToggle.forEach((item) => {
                if (item.classList.contains("show")) {
                    item.classList.remove("show");
                }
            });

            // Toggle CTAs
            toggleGroupExpertsCta.forEach((item) => {
                if (!item.classList.contains("collapsed")) {
                    item.classList.add("collapsed");
                }
            });
        }
    }

    toggleAllGroups() {
        let toggleGroupsCta = document.querySelector<HTMLElement>("#btnToggleAll");
        let toggleExpertsCta = document.querySelectorAll<HTMLElement>("#btnToggleExperts");
        let groupCta = document.querySelectorAll<HTMLElement>("#btnCollapse");
        let groupsToToggle = document.querySelectorAll<HTMLElement>(".expertGrouping");
        let expertsToToggle = document.querySelectorAll<HTMLElement>(".expertGrouping .note-wrapper");

        if (toggleGroupsCta.classList.contains("collapsed")) {
            // Toggle Experts
            groupsToToggle.forEach((item) => {
                if (!item.classList.contains("show")) {
                    item.classList.add("show");
                }
            });

            // Toggle CTAs
            toggleGroupsCta.classList.remove("collapsed");
            toggleExpertsCta.forEach((item) => {
                if (item.classList.contains("collapsed")) {
                    item.classList.remove("collapsed");
                }
            });
            groupCta.forEach((item) => {
                if (item.classList.contains("collapsed")) {
                    item.classList.remove("collapsed");
                }
            });

            expertsToToggle.forEach((item) => {
                if (!item.classList.contains("show")) {
                    item.classList.add("show");
                }
            });
        } else {
            // Toggle Experts
            expertsToToggle.forEach((item) => {
                if (item.classList.contains("show")) {
                    item.classList.remove("show");
                }
            });

            // Toggle CTAs
            toggleGroupsCta.classList.add("collapsed");
            toggleExpertsCta.forEach((item) => {
                if (!item.classList.contains("collapsed")) {
                    item.classList.add("collapsed");
                }
            });

        }
    }

    // Returns tooltip text for expert groups
    getInfoText(infoText: any) {
        if (infoText?.lastUpdatedExpert) {
            let info = [];
            if (infoText.lastUpdatedExpert != "0001-01-01T00:00:00Z") {
                info.push('Last Updated: ' + moment(infoText.lastUpdatedExpert).format('DD-MMM-YYYY')) + '\n';
            }
            if (infoText.expertGroupNote) {
                info.push(infoText.expertGroupNote);
            }
            return info;
        } else if (infoText) {
            return infoText?.expertGroupNote ? [infoText.expertGroupNote] : [infoText];
        }
    }

    // Set case dropdown position to top for the last case element
    caseDropdownPosition(index) {
        if (this.uniqueClients().length == 1) {
            return "bottom";
        }

        if (index >= this.uniqueClients().length - 1) {
            return "top";
        } else {
            return "auto";
        }
    }
    canRequestExpertise = (expertGroup: expertGroup) => {

        let isMultiPoolSelected = this.dealTracker?.expertGroup?.length > 0 ?
            this.dealTracker?.expertGroup.filter((exg: any) => exg.isRowSelected == true)?.length > 1 : false;
        let noOfExperts = expertGroup?.experts?.length

        if (!isMultiPoolSelected && noOfExperts > 0) {
            return true;
        }
        else {
            return false;
        }
    }
}
