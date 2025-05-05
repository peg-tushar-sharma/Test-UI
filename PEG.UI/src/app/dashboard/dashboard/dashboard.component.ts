import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../services/dashboard.service";
import { Dashboard } from "./dashboard";
import { RegistrationService } from "../../../app/registrations/registrations/registration.service";
import { AuditLogService } from "../../shared/AuditLog/auditLog.service";
import { CoreService } from "../../core/core.service";
import { Router } from "@angular/router";
import { GlobalService } from '../../global/global.service';
import { Observable } from 'rxjs';
import { RegistrationStage } from '../../shared/interfaces/RegistrationStage';
import { RegistrationStatus } from '../../shared/interfaces/registrationStatus';
import { DealsService } from '../../deals/deals.service';
import { User } from '../../security/app-user-auth';
import { map } from 'rxjs/operators';
import { CommonMethods } from "../../shared/common/common-methods";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
    public showFullTagName: boolean = false;
    public possibleMBmatches: any = [];
    public openMB: boolean = false;
    public selectedRegistration: any;
    public showLoader: boolean = true;
    public menuButtons = [

        {
            label: "Conflict ID",
            icon: null,
            image: "cid.png",
            action: "click",
            link: "https://conflictid.bain.com",
            height: "22"
        },
        {
            label: "Agiloft",
            icon: null,
            image: "agiloft.jfif",
            action: "click",
            link: "https://bainandco.agiloft.com/logins/bainandco-login.htm",
            height: "25"
        },
        {
            label: "D&B",
            icon: null,
            image: "dnb.jpg",
            action: "click",
            link: "https://myapps.microsoft.com/signin/DB%20Hoovers%20SSO/b37e1061-fa77-4a5c-8bf0-15324dc61ac9?tenantId=eb120e12-65f1-477a-be8c-fe4f65926724",
            height: "25"
        },
        {
            label: "Iris",
            icon: null,
            image: "iris.png",
            action: "click",
            link: "https://iris.bain.com",
            height: "25"
        }
    ];


    constructor(
        private route: Router,
        private dashboardService: DashboardService,
    ) {
        this.dashboardService.getUsersByRole(1).subscribe((employees) => {
            employees = CommonMethods.assignSearchableName(employees);
            this.dashboardService.LegalUsers = employees;

        });
    }

    ngOnInit() {

    }

    updateConflictInfo(conflict: Dashboard) {
        // TODO: Implement updating when Backend is ready.
    }

    // formatPendingIcon(fieldName, registration) {
    //     if (registration.conflictApprovalTracker) {
    //         let currentField = registration.conflictApprovalTracker.find((x) => x.fieldName == fieldName);
    //         if (currentField && !currentField.hasApproved) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         return false;
    //     }
    // }
    openLink(item) {
        window.open(item.link, '_blank')
    }

    // resendEmail(regId: any) {
    //     var resendReg = this.dashboardData.filter((a) => a.registrationId == regId);
    //     if (resendReg != undefined && resendReg !== null) {
    //         resendReg[0].isResend = true;
    //         let updatedRowIndex = this.dashboardData.findIndex((i) => i.registrationId == regId);
    //         this.dashboardData[updatedRowIndex] = resendReg[0];
    //     }

    //     this.auditLogService.addAuditLog("Email", null, this.coreService.loggedInUser.firstName);

    //     this.auditLogService.saveAuditLog(null, regId);
    //     this.registrationService.resendEmail(regId).subscribe((res) => {
    //         this.getdashboardData();
    //     });
    // }



    // openPopUp(reg, index) {
    //     this.showLoader = true;
    //     this.possibleMBmatches = [];
    //     this.dashboardData.forEach((element) => {
    //         element.isPopUp = false;
    //     });
    //     reg.isPopUp = true;
    //     this.openMB = true;

    //     this.selectedRegistration = reg.registrationId;
    //     this.registrationService.getFilteredRegistration(reg.registrationId).subscribe((responses: any) => {
    //         if (responses) {
    //             this.possibleMBmatches = responses;
    //         }
    //         this.showLoader = false;
    //     });
    // }

    // closePopup() {
    //     this.dashboardData.forEach((element) => {
    //         element.isPopUp = false;
    //     });
    // }

    // checkCondition() {
    //     if (this.openMB) {
    //         this.closePopup();
    //     }
    // }

    viewSelected() {
        this.route.navigate(["search/" + this.selectedRegistration]);
    }
}
