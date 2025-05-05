import { DeleteLevel } from "../shared/enums/delete-type";
import { Pipeline } from "./pipeline";

export class PipelineBucketMapping {
    pipelineBucketMappingId: number;
    pipelineBucketId: number;
    registrationId: number;
    lastUpdatedBy: string;
    pipeline: Pipeline;
    sortOrder: number;
    deleteLevel:DeleteLevel;
}
