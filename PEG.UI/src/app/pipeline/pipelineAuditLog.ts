export class PipelineAuditLog {
    auditLogId: number;
    pipelineId: number;
    fieldName: string;
    oldValue: string;
    newValue: string;
    submittedBy: string;
    auditSource:string;
    logType:string;
}