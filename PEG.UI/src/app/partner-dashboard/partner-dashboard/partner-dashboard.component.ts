import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { CellEditingStartedEvent, ColDef, GridApi, GridOptions, ICellRendererParams } from "ag-grid-community";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonMethods } from "../../shared/common/common-methods";
import * as _ from "lodash";

// interfaces
import { AuditLog } from "../../shared/AuditLog/AuditLog";
import { GridColumn } from "../../shared/interfaces/grid-column.interface";
import { PagesTypes } from "../../shared/enums/page-type.enum";
import { PartnerDashboard } from "./partner-dashboard";
import { RegistrationClosedInfo } from "../../registrations/registrationClosedInfo";
import { RegistrationStage } from "../../shared/interfaces/RegistrationStage";
import { RegistrationStageEnum } from "../../shared/enums/registration-stage.enum";

// components
import { CreateOppSlideoutComponent } from "../create-opp-slideout/create-opp-slideout.component";
import { StageCellRendererComponent } from "../stage-cell-renderer/stage-cell-renderer.component";
import { SharingModalComponent } from "../sharing-modal/sharing-modal.component";
import { UpdateStageModalComponent } from "../../shared/update-stage-modal/update-stage-modal.component";
import { RequestCaseCodeComponent } from "../request-case-code/request-case-code.component";

// services
import { CoreService } from "../../core/core.service";
import { PipelineService } from "../../pipeline/pipeline.service";
import { PartnerDashboardGridColumnService } from "../../shared/grid-generator/partner-dashboard-grid-column.service";
import { PartnerDashboardService } from "./partner-dashboard.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { RegistrationService } from "../../registrations/registrations/registration.service";
import { PegTostrService } from "../../core/peg-tostr.service";
import { OppType } from "../../shared/enums/opp-type";

// create debounce to run resize functions only once
export function debounce(delay: number = 500): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const original = descriptor.value;
        const key = `__timeout__${propertyKey}`;

        descriptor.value = function (...args) {
            clearTimeout(this[key]);
            this[key] = setTimeout(() => original.apply(this, args), delay);
        };

        return descriptor;
    }
}

@Component({
    selector: "app-partner-dashboard",
    templateUrl: "./partner-dashboard.component.html",
    styleUrls: ["./partner-dashboard.component.scss"]
})

export class PartnerDashboardComponent implements OnInit {
    @ViewChild(CreateOppSlideoutComponent) createOppSlideout: CreateOppSlideoutComponent;
    displayCount: number = 0;
    isActiveRegistration: boolean = false;
    public dashboardData: PartnerDashboard[] = [];
    quickFilterText: string = "";
    oldCellValue: any = [];
    queryParamRegistrationId: number;
    // Left Side Menu Buttons
    public menuButtons = [

        {
            label: "PEXC",
            icon: null,
            image: "pexc.png",
            action: "click",
            link: "http://pexc.bain.com/",
            height: "22"
        },
        {
            label: "Iris",
            icon: null,
            image: "iris.png",
            action: "click",
            link: "https://iris.bain.com/",
            height: "25"
        },
        {
            label: "Compass",
            icon: null,
            image: "compass.png",
            action: "click",
            link: "https://compass.bain.com/",
            height: "25"
        },
        {
            label: "Cortex",
            icon: null,
            image: "cortex.png",
            action: "click",
            link: "https://cortex.bain.com/",
            height: "25"
        },
        {
            label: "Workday",
            icon: null,
            image: "workday.png",
            action: "click",
            link: "https://wd5.myworkday.com/bain/login.flex",
            height: "25"
        }
    ];

    // AG Grid
    public rowData: PartnerDashboard[] = [];
    public columnDefs: ColDef[];
    public gridApi: GridApi;
    public gridColumnApi;
    public gridOptions: GridOptions = {
        context: {
            componentParent: this
        },

        stopEditingWhenCellsLoseFocus: true,
        singleClickEdit: false,
        suppressAggFuncInHeader: true,
        cacheQuickFilter: true,
        suppressContextMenu: true,
        frameworkComponents: {
            StageCellRendererComponent: StageCellRendererComponent,
        },
        components: {
            clientTargetCellRenderer: this.clientTargetCellRenderer,

        },
        onFirstDataRendered: this.onFirstDataRendered.bind(this),
        onCellClicked: this.onCellClicked.bind(this),
        onCellEditingStopped: this.onCellValueChanged.bind(this),
        onCellEditingStarted: this.onCellEditingStarted.bind(this),
        suppressMenuHide: true,
        rowClassRules: {
            "cortexHighlight": params => this.externalQueryParams && this.externalQueryParams.source == "cortex"
                && this.externalQueryParams?.accountId?.toLowerCase() == params?.node?.data?.client?.accountId?.toLowerCase()
        }
    };


    // Source to identify application of origin
    externalQueryParams: any = { source: "c2c", accountId: "" };

    defaultColDef = this.partnerDashboardGridColumnService.getDefaultColumnDefinition;
    constructor(private dashboardService: PartnerDashboardService, private pipelineService: PipelineService,
        private partnerDashboardGridColumnService: PartnerDashboardGridColumnService, private route: Router,
        private coreService: CoreService,
        private modalService: BsModalService,
        private registrationService: RegistrationService,
        private toastr: PegTostrService,
        private activeRoute: ActivatedRoute) {
        // Load AG Grid Configuration

        if (this.route != undefined && this.activeRoute.params != undefined) {
            this.activeRoute.params.subscribe(data => {
                if (data != undefined && data.hasOwnProperty('registrationId') && data.registrationId != "") {
                    let decodedRegistrationId = CommonMethods.decodeData(data.registrationId);
                    this.queryParamRegistrationId = parseInt(decodedRegistrationId)
                } else {
                    // route it back to partner dashboard
                    this.route.navigate(['/partner-dashboard']);
                }
            });
        }
    }

    openLink(item) {
        window.open(item.link, '_blank')
    }

    ngOnInit() {
        this.getColumnData();

        this.activeRoute.queryParams.subscribe(params => {
            if (params != undefined && params != null && params.hasOwnProperty('source')) {

                if (params.hasOwnProperty('source')) {
                    this.externalQueryParams.source = params.source;
                }

                if (params.hasOwnProperty('accountid')) {
                    this.externalQueryParams.accountId = params.accountid;
                }

                if (params.hasOwnProperty('accountId')) {
                    this.externalQueryParams.accountId = params.accountId;
                }
            }
        });
    }

    @HostListener('window:resize', ['$event'])
    @debounce()
    resizeGrid() {
        this.pipelineService.getUserColumns(PagesTypes.PartnerDashboard).subscribe((columns: GridColumn[] | any) => {

          this.columnDefs = this.partnerDashboardGridColumnService.getColumnDefinitions(columns);
        });

        // this.gridApi.sizeColumnsToFit();
    }

    getColumnData() {
        this.pipelineService.getUserColumns(PagesTypes.PartnerDashboard).subscribe((columns: GridColumn[] | any) => {

           this.columnDefs = this.partnerDashboardGridColumnService.getColumnDefinitions(columns);

            if (!CommonMethods.isAuthorizedOffice(this.coreService)) {
                this.getFilteredColumns();
            }
            //calling grid data once column is rendered.
            this.getdashboardData();  //Getting active registrations
        });
    }

    onFirstDataRendered() {
        if (this.gridApi && this.columnDefs && this.columnDefs.length) {
            // this.gridApi.sizeColumnsToFit();
            this.resetDisplayCount();
        }
    }

    resetDisplayCount() {
        if (this.gridApi) {
            this.displayCount = this.rowData.length;
        }
    }

    // AG Grid Ready
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    onRegistrationTypeclick(isActiveRegistration) {
        this.displayCount = 0;
        this.isActiveRegistration = isActiveRegistration;
        this.getdashboardData()
    }

    // Load Dashboard Data
    getdashboardData() {
        //API call to get filtered dashboard data
        this.dashboardService.getPartnerDashboardData(this.isActiveRegistration).subscribe((res) => {
            this.rowData = res;

            // for testing submitted case code request state
            // remove when caseCode column is added to database
            if (this.rowData.length && this.rowData.length > 2) {
                this.rowData[1]["isCaseCodeRequested"] = true;
            }

            this.resetDisplayCount();

            // if query param has registration Id, open the stage popup;
            if (this.rowData && this.rowData.length > 0 && this.queryParamRegistrationId > 0) {
                this.registrationService.getRegistrationShareDeatails(this.queryParamRegistrationId).subscribe((registrationResult) => {
                    if (registrationResult) {
                        registrationResult.stage = registrationResult.registrationStage;
                        registrationResult.target = registrationResult.registrationTarget;
                        let loggedInUserEmployeeCode = this.coreService.loggedInUser.employeeCode;
                        if (
                            registrationResult.clientSectorLeads.some((item) => item.employeeCode == loggedInUserEmployeeCode) ||
                            registrationResult.othersInvolved.some((item) => item.employeeCode == loggedInUserEmployeeCode) ||
                            registrationResult.clientHead.some((item) => item.employeeCode == loggedInUserEmployeeCode) ||
                            registrationResult.submittedBy.employeeCode == loggedInUserEmployeeCode
                        ) {
                            // user has access
                            let selectedRegistrationData = registrationResult;
                            if (selectedRegistrationData && (selectedRegistrationData.registrationStage.registrationStageId != RegistrationStageEnum.WorkStarted && selectedRegistrationData.registrationStage.registrationStageId != RegistrationStageEnum.WorkCompleted)) {
                                this.openStageModal(selectedRegistrationData);
                            } else {
                                this.route.navigate(['/partner-dashboard']);
                            }

                        } else {
                            this.route.navigate(['/invalidaccesscomponent']);
                        }
                    } else {
                        this.route.navigate(['/invalidaccesscomponent']);
                    }
                });
            }else{
                //Query param registration Id is not present or in proper format send it back to default grid
                this.route.navigate(['/partner-dashboard']);
            }
        });
    }

    onResetFilter($event) {
        this.gridApi.setFilterModel(null);
        this.gridApi.setQuickFilter(null);
        this.quickFilterText = "";

    }
    setOldValueByField(data, field) {

        switch (field) {
            case "registrationStage":
                this.oldCellValue = data.stage;
                break;
            default:
                this.oldCellValue = JSON.parse(JSON.stringify(data[field.charAt(0).toLowerCase() + field.substr(1)]));
                break;
        }
    }
    onCellEditingStarted(event: CellEditingStartedEvent) {
        this.setOldValueByField(event.data, event.colDef.field);
    }

    onCellValueChanged(event) {
        this.oldCellValue = this.oldCellValue == null ? undefined : this.oldCellValue;
        event.newValue = event.newValue == null ? undefined : event.newValue;
    }

    saveDashboardData(dashboardData, fieldName) {
        let isArchive = false;
        if (fieldName = 'registrationStage') {
            if (RegistrationStageEnum.ClosedLost == dashboardData.stage.registrationStageId || RegistrationStageEnum.ClosedDropped == dashboardData.stage.registrationStageId
                || RegistrationStageEnum.ClosedBainTurnedDown == dashboardData.stage.registrationStageId || RegistrationStageEnum.Terminated == dashboardData.stage.registrationStageId)
                isArchive = true;
        }
        console.log(dashboardData)

        this.dashboardService.updateDashboard(dashboardData, fieldName, isArchive).subscribe(
            (res) => {
                if (res) {
                    let index = this.rowData.findIndex((i) => i.registrationId == dashboardData.registrationId);
                    this.rowData[index] = res;
                    this.gridApi.setRowData(this.rowData);

                    if (this.isActiveRegistration != isArchive) {
                        this.rowData = this.rowData.filter(e => e.registrationId != res.registrationId);
                        this.gridApi.setRowData(this.rowData);
                    }
                    this.resetDisplayCount();
                    this.createAuditLog(fieldName, dashboardData);
                    this.toastr.showSuccess("Dashboard data saved successfully", "Success");

                }
            },
            (error) => {
                console.error(error);
                this.toastr.showError("Unable to update dasboard", "Error");
            }
        );
    }


    createAuditLog(fieldName, dashboardData) {
        let auditLog: AuditLog = new AuditLog();
        auditLog.auditSource = "Dashboard";
        let updatedValue: any;

        switch (fieldName) {
            case "registrationStage":
                auditLog.fieldName = "Stage";
                auditLog.oldValue = this.oldCellValue ? this.oldCellValue.stageTypeName : "";
                auditLog.newValue = dashboardData.stage ? dashboardData.stage.stageTypeName : "";
                auditLog.registrationId = dashboardData.registrationId;
                auditLog.submissionDate = undefined;
                auditLog.submittedBy = this.coreService.loggedInUser.employeeCode;
                updatedValue = dashboardData.stage ? dashboardData.stage.stageTypeName : "";
                break;
        }
        this.registrationService.saveAuditLogWithSource(auditLog).subscribe((response) => { });
    }
    // Client & Target Cell Renderer
    clientTargetCellRenderer(params: ICellRendererParams) {
        const componentInstance = params.context.componentParent;

        const element = document.createElement("button");
        element.innerHTML = params.value;
        element.className = "btn-class";
        element.style.fontWeight = "400";

        element.onmouseenter = () => {
            element.style.textDecoration = "underline";
        };

        element.onmouseleave = () => {
            element.style.textDecoration = "none";
        };

        element.onclick = () => {
            componentInstance.toggleRegistrationSlideout(params);
        };

        return element;
    }

    // Input Change
    onFilterTextBoxChanged(event) {
        let searchQuery = event.target.value;
        this.gridApi.setQuickFilter(searchQuery);
    }

    onCellClicked(event) {
        if (event.colDef.field != "registrationStage") {
            if (event && event.data) {
                if (event.colDef.field == "resourceRequest") {
                    let source = 'resource';
                    const url = this.route.serializeUrl(
                        this.route.createUrlTree([`/opportunity/newopportunity/${event.data.registrationId}/${source}`])
                    );
                    window.open(url, '_blank');
                }
                else if (event.colDef.field == "expertInfo" && (event.data.opportunityTypeId == OppType.Registered || event.data.opportunityTypeId == OppType.Duplicate)) {
                    let source = 'expert';
                    const url = this.route.serializeUrl(
                        this.route.createUrlTree([`/opportunity/newopportunity/${event.data.registrationId}/${source}`])
                    );
                    window.open(url, '_blank');
                }
                else if (event.colDef.field == "sharing") {
                    this.openEditSharingModal(event);
                } else if (event.colDef.field == "caseCode") {
                   if(event.data.regionId==2 || event.data.regionId==3)
                    {
                        this.openRequestCaseCodeModal(event);
                    }
                   
                }
                else {
                    this.createOppSlideout.toggleSlideOut(true, event.data.registrationId);
                }
            } else {
                this.createOppSlideout.toggleSlideOut(true, event.data.registrationId);
            }
        } else {
            let stageValue: RegistrationStage = event.data.stage;

            // only open modal if stage != "work started or completed"
            if (stageValue.registrationStageId == RegistrationStageEnum.WorkStarted || stageValue.registrationStageId == RegistrationStageEnum.WorkCompleted) {
                return;
            } else {
                this.setOldValueByField(event.data,'registrationStage')
                let regData: PartnerDashboard = event.data;
                this.openStageModal(regData);
            }
        }
    }

    getFilteredColumns() {
        this.columnDefs = this.columnDefs.filter(a => a.field != "resourceRequest" && a.field != "expertInfo");
    }

    openStageModal(value: any) {
        let stageValue: RegistrationStage = value.stage;
        const modalRef = this.modalService.show(UpdateStageModalComponent, {
            initialState: {
                modalData: stageValue,

                registrationId: value.registrationId,
                targetData: (value?.target?.targetName) ? value?.target?.targetName : 'No target',
                hideWorkOptions: true
            },
            class: "modal-dialog-centered closed-detail-popup",
            backdrop: "static", keyboard: false
        });

        modalRef.content.saveClosedEmitter.subscribe((res) => {
            value.stage = res.stage;
            this.saveDashboardData(value, "registrationStage");

            let closedDetailData: RegistrationClosedInfo = res.closedInfo;
            closedDetailData.registrationId = value.registrationId;

            this.registrationService.upsertRegistrationClosedInfo(closedDetailData).subscribe((res) => {
                this.toastr.showSuccess("Stage updated", "Success");
            });
        });
        modalRef.content.closeEmitter.subscribe((res) => {
            if (res) {
                this.route.navigate(['/partner-dashboard']);
            }
        });
    }

    openEditSharingModal(event) {
        this.modalService.show(SharingModalComponent, {
            class: "modal-dialog-centered",
            initialState: {
                registrationId: event.data.registrationId,
                targetData: event.data.target.targetName
            }
        });
    }

    openRequestCaseCodeModal(event) {        
          const modalRef = this.modalService.show(RequestCaseCodeComponent, {
            class: 'modal-dialog-centered request-case-code-modal modal-lg',
            ignoreBackdropClick: true,
        
            initialState: {
                caseData: event.data,
                isFormSubmitted: event.data?.caseRequestId > 0 ?true:false
            }
        });

        modalRef.content.requestCaseCodeEmitter.subscribe((data) => {
           event.data.isCaseCodeRequested = true;
            let index = this.rowData.findIndex((i) => i.registrationId == data.registrationId);
            this.rowData[index].caseRequestId=data.caseRequestId;
            this.gridApi.setRowData(this.rowData);

        });
    }
}
