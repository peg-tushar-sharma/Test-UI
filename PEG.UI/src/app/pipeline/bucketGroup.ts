import { PipelineBucket } from "./pipelineBucket";

export class BucketGroup {
    bucketGroupId: number;
    bucketGroupName: string;
    bucketGroupCount: number;
    employeeCode: string;
    lastUpdated: any;
    lastUpdatedBy: string;
    isEditable: boolean;
    weekStartDate:string;
    regionId:number;
    isNew:boolean = false;
    sortOrder:number;
    columnPosition:number;
    isSelectedForMerge:false;
    bucketMapping: PipelineBucket[];
}
export class PipelineBucketGroupInfo{
    pipelineBuckets:PipelineBucket[];
    bucketGroups:BucketGroup[];
    
}
