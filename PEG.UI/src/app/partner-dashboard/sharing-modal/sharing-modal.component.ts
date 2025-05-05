import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CommonMethods } from "../../shared/common/common-methods";

// interfaces
import { Registrations } from "../../registrations/registrations/registrations";
import { Employee } from "../../shared/interfaces/Employee";
import { industry } from "../../shared/interfaces/industry";

// services
import { RegistrationService } from "../../registrations/registrations/registration.service";
import { RegistrationRequestService } from "../../registrations/registrations/registration-request-service";
import { CoreService } from "../../core/core.service";
import { PegTostrService } from "../../core/peg-tostr.service";

import { AuditLog } from "../../../app/shared/AuditLog/AuditLog";
import { PartnerDashboardService } from "../partner-dashboard/partner-dashboard.service";
import * as _ from "lodash";
import { PartnerType } from "../../shared/enums/partner-type.enum";


@Component({
    selector: "app-sharing-modal",
    templateUrl: "./sharing-modal.component.html",
    styleUrls: ["./sharing-modal.component.scss"]
})
export class SharingModalComponent implements OnInit {
    registrationId: number;

    registration: any;
    targetData: string;
    employeeList: Employee[];
    topLevelIndustries: industry[] = [];
    responseSeqtest = [];

    // reg details
    submittedBy: string;
    isToggleChecked: boolean = false;
    isSaveValid: boolean = true;
    copy: any;
    auditLogList = [];
    employeeStatusCode: string = 'N,A,L';
    levelStatusCode: string = 'V,M';
    targetName: string;

    constructor(
        private modalRef: BsModalRef,
        private registrationService: RegistrationService,
        public _regReqService: RegistrationRequestService,
        private coreService: CoreService,
        private toastr: PegTostrService,
        private dashboardService: PartnerDashboardService,
    ) { }

    ngOnInit(): void {
        if (this.registrationId > 0) {
            this.getRegistrationShareDeatails();
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

    // get reg info from regID
    getRegistrationShareDeatails() {
        this.registrationService.getRegistrationShareDeatails(this.registrationId).subscribe((res) => {
            this.registration = res;
            this.copy = JSON.parse(JSON.stringify(res)) as typeof res;
            this.isToggleChecked = this.registration.hasSubmitterAccess;

            this.submittedBy = res.submittedBy ? res.submittedBy.firstName + " " + res.submittedBy.lastName : "...";
            this.targetName = res.targetName ? res.targetName : this.targetData;

            this.getRegistrationPartners();
        });
    }

    // get peg info from regID
    getRegistrationPartners() {
        this.registrationService.getPartnerByRegistrationId(this.registrationId).subscribe((res) => {
            if(res){
                this.registration.svp = res.filter((e) => e.typeId == PartnerType.SVP);
                this.registration.operatingPartner = res.filter((e) => e.typeId == PartnerType.OperatingPartner);
                this.registration.sellingPartner = res.filter((e) => e.typeId == PartnerType.SellingPartner);

                this.copy = JSON.parse(JSON.stringify(this.registration)) as typeof this.registration;
            } else{
                this.registration.svp = [];
                this.registration.operatingPartner = [];
                this.registration.sellingPartner = [];
            }
        });
    }
    

    // toggle submitter access
    toggleSubmitterAccess() {
        const toUpdateData = this.isToggleChecked ? 'Enable' : 'Disable'
        const oldData = this.copy.hasSubmitterAccess ? 'Enable' : 'Disable';
        const updatedField = "Submitter Access";
        this.addAuditLogDashboard(updatedField, oldData, toUpdateData);
    }

    // update CSLs
    updateClientSectorLeads(value) {

        this.registration.clientSectorLeads = value;
        const toUpdateData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.registration.clientSectorLeads, ";");
        const oldData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.copy.clientSectorLeads, ";");
        const updatedField = "Client Sector Leads";
        this.addAuditLogDashboard(updatedField, oldData, toUpdateData);

    }

    // update CHs
    updateClientHeads(value) {

        this.registration.clientHead = value;
        if (this.registration.clientHead.length > 0) {
            this.isSaveValid = true;
        }
        else {
            this.isSaveValid = false;
        }
        const toUpdateData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.registration.clientHead, ";");
        const oldData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.copy.clientHead, ";");
        const updatedField = "Client Heads";
        this.addAuditLogDashboard(updatedField, oldData, toUpdateData);
    }

    // update OVPs
    updateOVP(value) {

        this.registration.operatingPartner = value;
        const toUpdateData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.registration.operatingPartner, ";");
        const oldData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.copy.operatingPartner, ";");
        const updatedField = "OVP";
        this.addAuditLogDashboard(updatedField, oldData, toUpdateData);
    }

    // update OVPs
    updateSVP(value) {

        this.registration.svp = value;
        const toUpdateData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.registration.svp, ";");
        const oldData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.copy.svp, ";");
        const updatedField = "SVP";
        this.addAuditLogDashboard(updatedField, oldData, toUpdateData);
    }

    // update OVPs
    updateSellingPartner(value) {

        this.registration.sellingPartner = value;
        const toUpdateData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.registration.sellingPartner, ";");
        const oldData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.copy.sellingPartner, ";");
        const updatedField = "Selling Partner";
        this.addAuditLogDashboard(updatedField, oldData, toUpdateData);
    }

    // update OsI
    updateOthersInvolved(value) {

        this.registration.othersInvolved = value;
        const toUpdateData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.registration.othersInvolved, ";");
        const oldData = CommonMethods.getEmployeeNamesWithWithoutSearchName(this.copy.othersInvolved, ";");
        const updatedField = "Others Involved";
        this.addAuditLogDashboard(updatedField, oldData, toUpdateData);
    }
    public addAuditLogDashboard(updatedField: string, oldValue?: string, newValue?: string) {
        const auditLog = new AuditLog();
        auditLog.fieldName = updatedField;
        auditLog.oldValue = oldValue ? oldValue.trim() : '';
        auditLog.newValue = newValue ? newValue.trim() : '';
        auditLog.auditSource = "Partner Dashboard";
        auditLog.registrationId = this.registrationId;
        auditLog.submittedBy = this.coreService.loggedInUser.employeeCode;
        auditLog.isMasked = undefined;
        if (this.auditLogList.find(x => x.fieldName == updatedField)) {
            let index = this.auditLogList.indexOf(this.auditLogList.find(x => x.fieldName == updatedField))
            this.auditLogList.splice(index);
        }
        auditLog.newValue = newValue ? newValue.trim() : '';
        if (!_.isEqual(auditLog.oldValue, auditLog.newValue)) {
            this.auditLogList.push(auditLog);
        }
    }
    getNameAndEcode(employees) {
        let eCode = "";
        let eName = "";
        if (Array.isArray(employees)) {
            if (employees.length === 0) {
            } else if (employees.length === 1) {
                eCode = employees[0].employeeCode;
                eName = employees[0].searchableName;
            } else {
                eCode = employees.map((e) => e.employeeCode).join(",");
                eName = employees.map((e) => e.searchableName).join(";");
            }
        } else {
            eCode = employees === null ? "" : employees.employeeCode;
            eName = employees === null ? "" : employees.searchableName;
        }

        return {
            eCode,
            eName
        };
    }

    // save changes
    saveChanges() {
        this.registration.clientHead.forEach((el) => { el.typeId = PartnerType.ClientHeads });
        this.registration.clientSectorLeads.forEach((el) => { el.typeId = PartnerType.ClientSectorLeads });
        this.registration.othersInvolved.forEach((el) => { el.typeId = PartnerType.OthersInvolved });
        this.registration.operatingPartner.forEach((el) => { el.typeId = PartnerType.OperatingPartner });
        this.registration.svp.forEach((el) => { el.typeId = PartnerType.SVP });
        this.registration.sellingPartner.forEach((el) => { el.typeId = PartnerType.SellingPartner });

        this.responseSeqtest.push(...this.registration.clientHead);
        this.responseSeqtest.push(...this.registration.clientSectorLeads);
        this.responseSeqtest.push(...this.registration.othersInvolved);
        this.responseSeqtest.push(...this.registration.operatingPartner);
        this.responseSeqtest.push(...this.registration.svp);
        this.responseSeqtest.push(...this.registration.sellingPartner);

        this.responseSeqtest.forEach((el) => { el.registrationId = this.registrationId, el.lastUpdatedBy = this.coreService.loggedInUser.employeeCode; })

        this.registrationService.saveShareAccess(this.responseSeqtest, this.registrationId, this.isToggleChecked).subscribe(
            (result) => {
                this.createAuditLog();
                this.toastr.showSuccess("The registration has been updated successfully", "Success");
            },
            () => {
                this.toastr.showError("Error while updating the registration. Please try again.", "Error");
            }
        );

        this.closeModal();
    }
    createAuditLog() {
        this.dashboardService.saveAuditLogWithSource(this.auditLogList).subscribe((response) => { });
    }

    getSubmittedBy() {
        let emp: Employee = {} as Employee;
        emp.searchableName = this.registration.sb.searchableName;
        emp.employeeCode = this.coreService.loggedInUser.employeeCode;
        emp.officeName = this.registration.sb.officeName;
        return emp;
    }
}
