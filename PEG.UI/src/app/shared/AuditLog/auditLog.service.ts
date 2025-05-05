import { AuditLogRepositoryService } from './audit-log-repository.service';
import { AuditLog } from './AuditLog';
import { RegistrationRequestService } from '../../registrations/registrations/registration-request-service';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridValues } from '../grid-generator/grid-constants';
import { formatDate } from '@angular/common';
import { CommonMethods } from '../common/common-methods';
import { audit } from 'rxjs/operators';

@Injectable()
export class AuditLogService {

    public auditLog: AuditLog = new AuditLog();

    public refreshAuditLogs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     *
     */
    constructor(private auditLogRepositoryService: AuditLogRepositoryService, private _regReqService: RegistrationRequestService, @Inject(LOCALE_ID) private locale: string) {
    }

    private getLabelFromArray(typeOfArray, selectedValue: number) {
        if (!selectedValue) {
            return '';
        }
        switch (typeOfArray) {
            case 'workType':
                return this._regReqService.workTypes.find(e => e.workTypeId == selectedValue).workTypeName;
            case 'stage':
                return this._regReqService.registrationStage.find(e => e.registrationStageId == selectedValue).stageTypeName;
            case 'status':
                return this._regReqService.registrationStatus.find(e => e.registrationStatusId == selectedValue).statusTypeName;
            case 'workToStart':
                return this._regReqService.workToStart.find(w => w.workToStartId == selectedValue).workToStartName;
            case 'bainOffice':
                return this._regReqService.bainOffice.find(b => b.officeCode == selectedValue).officeName;
            case 'caseOffice':
                return this._regReqService.bainOffice.find(b => b.officeCode == selectedValue).officeName;
        }
        return '';
    }

    private getPreviousValueAndNewValue(updatedField: string, fieldName: string, latestValue: any, oldValue?: any): { previousValue: string, newValue: string } {
        let previousValue: string = '';
        let newValue: string = '';
        switch (updatedField) {
            case "Open Market Purchase":
                previousValue = this._regReqService.registration.iomp ? 'Yes' : 'No';
                newValue = latestValue ? 'Yes' : 'No';
                break;
            case "Publicly Traded Equity":
                previousValue = this._regReqService.registration.pte ? 'Yes' : 'No';
                newValue = latestValue ? 'Yes' : 'No';
                break;
            case "Risk Target":
                previousValue = this._regReqService.registration.isREN ? 'No' : 'Yes';
                newValue = latestValue ? 'No' : 'Yes';
                break;
            case "Risk Product":
                previousValue = this._regReqService.registration.isProductREN ? 'No' : 'Yes';
                newValue = latestValue ? 'No' : 'Yes';
                break;
            case "Publicly Traded Debt":
                previousValue = this._regReqService.registration.ptd ? 'Yes' : 'No';
                newValue = latestValue ? 'Yes' : 'No';
                break;
            case "Carve Out":
                previousValue = this._regReqService.registration.co ? 'Yes' : 'No';
                newValue = latestValue ? 'Yes' : 'No';
                break;
            case "Client is a Hedge Fund":
                previousValue = this._regReqService.registration.hfc ? 'Yes' : 'No';
                newValue = latestValue ? 'Yes' : 'No';
                break;
            case "Staffing Restriction":
                previousValue = this._regReqService.registration.sr == null ? null : this._regReqService.registration.sr ? 'Yes' : 'No';
                newValue = latestValue ? 'Yes' : 'No';
                break;

            case "Commit date":
                previousValue = this._regReqService.registration.cd ? this._regReqService.registration.cd : '';
                newValue = latestValue ? latestValue : '';
                break;

            case "Completed date":
                previousValue = this._regReqService.registration.ceD ? this._regReqService.registration.ceD : '';
                newValue = latestValue ? latestValue : '';
                break;
            case "Status":
                previousValue = this.getLabelFromArray('status', this._regReqService.registration.stn?.registrationStatusId);
                newValue = this.getLabelFromArray('status', latestValue);
                break;

            case "Stage":
                previousValue = this.getLabelFromArray('stage', this._regReqService.registration.sgTI);
                newValue = this.getLabelFromArray('stage', latestValue);
                break;
            case "Industry":
                previousValue = this._regReqService.registration.in ? this._regReqService.registration.in.industryName : '';
                newValue = latestValue ? latestValue : '';
                break;

            case "Type of Work":
                previousValue = this.getLabelFromArray('workType', this._regReqService.registration.wti);
                newValue = this.getLabelFromArray('workType', latestValue);
                break;
            case "Work To Start":
                previousValue = this.getLabelFromArray('workToStart', this._regReqService.registration.wts);
                newValue = this.getLabelFromArray('workToStart', latestValue);
                break;
            case "Bain Office":
                previousValue = this.getLabelFromArray('bainOffice', this._regReqService.registration.boc);
                newValue = this.getLabelFromArray('bainOffice', latestValue);
                break;
            case "Email":
                previousValue = '';
                newValue = latestValue;
                break;
            case "SPAC":
                previousValue = this._regReqService.registration.spac ? 'Yes' : 'No';
                newValue = latestValue ? 'Yes' : 'No';
                break;
            case "Client Heads":
            case "Others Involved":
            case "Client Sector Leads":
                previousValue = CommonMethods.getEmployeeNames(this._regReqService.registration[fieldName], ';');
                newValue = latestValue;
                break;
            case "Client":
                previousValue = this._regReqService.registration[fieldName].hasOwnProperty('clientName') ? this._regReqService.registration[fieldName].clientName : this._regReqService.registration[fieldName];
                newValue = latestValue;
                break;
            case "Case Code":
                previousValue = this._regReqService.registration.case?.caseCode ? this._regReqService.registration.case.caseCode : '';
                newValue = latestValue;
                break;
            case "Case Name":
                previousValue = this._regReqService.registration.case?.caseName ? this._regReqService.registration.case.caseName : '';
                newValue = latestValue;
                break;
            case "Case Start date":
                previousValue = this._regReqService.registration.case?.caseStartDate ? this._regReqService.registration.case.caseStartDate : '';
                newValue = latestValue;
                break;
            case "Case End date":
                previousValue = this._regReqService.registration.case?.caseEndDate ? this._regReqService.registration.case.caseEndDate : '';
                newValue = latestValue;
                break;
            case "Case Office":
                previousValue = this._regReqService.registration.case?.caseOfficeName;
                newValue = this.getLabelFromArray('caseOffice', latestValue);
                break;
            case "Sector":
                previousValue = this._regReqService.registration?.sectors?.length>0 ?
                this._regReqService.registration?.sectors.map((sector)=>sector.sectorName).join(", ") :"";
                newValue=latestValue
                break;
            default:
                previousValue = this._regReqService.registration[fieldName];
                newValue = latestValue;
                break;
        }

        return {
            previousValue: previousValue,
            newValue: newValue
        };
    }


    public addAuditLog(updatedField: string, propertyName?: string, newValue?: any) {
        let values = this.getPreviousValueAndNewValue(updatedField, propertyName, newValue);
        const auditLog = new AuditLog();
        auditLog.fieldName = updatedField;
        auditLog.oldValue = values.previousValue ? values.previousValue.trim() : '';
        auditLog.newValue = values.newValue ? values.newValue.trim() : '';
        auditLog.isMasked = undefined;

        this.auditLog = auditLog;
    }

    public addAuditLogDashboard(updatedField: string, oldValue?: string, newValue?: any) {
        const auditLog = new AuditLog();
        auditLog.fieldName = updatedField;
        auditLog.oldValue = oldValue ? oldValue.trim() : '';
        auditLog.newValue = newValue ? newValue.trim() : '';
        auditLog.isMasked = undefined;

        this.auditLog = auditLog;
    
    }

    public addAuditLogForbidders(isSelected?: boolean, oldValue?: boolean, fieldName?: string) {
        const auditLog = new AuditLog();
        auditLog.fieldName = fieldName;
        auditLog.oldValue = oldValue ? 'Yes' : 'No';
        auditLog.newValue = isSelected ? 'Yes' : 'No';
        this.saveAuditLog(auditLog);
    }

    public saveAuditLog(auditLog?: AuditLog, registrationId?: number) {
        const auditObject = auditLog ? auditLog : this.auditLog;

        auditObject.registrationId = this._regReqService.registration == undefined ? registrationId : this._regReqService.registration.id;
        if (auditObject.oldValue !== auditObject.newValue) {
            this.auditLogRepositoryService.addAuditLog(auditObject).subscribe(returnLog => {
                if (returnLog) {
                    this.refreshAuditLogs.next(true);
                }
            }, () => {
                console.log('Insert log failed');
            }
            );
        }
    }

}