export class AuditLog {
    id: number;
    registrationId: number;
    targetName:string;
    fieldName: string;
    oldValue: string;
    newValue: string;
    submittedBy: string;
    submittedByName: string;
    submissionDate: Date;
    isMasked:boolean;
    auditSource:string;
    logType:string;
}
