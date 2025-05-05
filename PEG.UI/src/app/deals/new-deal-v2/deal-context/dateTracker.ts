export class dateTrack{
    dealDateTrackId:number
    dateLabel:string
    dateValue:any
    oldDateValue:any
    comment:string
    lastUpdated:Date
    lastUpdatedBy:string
    isdirty:boolean = false;
    isModified:boolean = false;
    oldDateLabel?:string
    oldComment?:string

}