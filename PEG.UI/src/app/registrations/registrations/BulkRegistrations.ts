export class BulkRegistrations{
    RegistrationId: number[];
    Fields: RegistrationFields[];
    SubmittedBy:string;
}

export class RegistrationFields{
    FieldName:string;
    FieldType:string;
    NewValue:string;
    AuditNewValue:string;
    AuditOldValue:string;
    AuditRegistrationid:number;
}