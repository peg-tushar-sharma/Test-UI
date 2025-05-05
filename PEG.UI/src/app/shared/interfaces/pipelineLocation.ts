import { Office } from "./office"; 
export interface PipelineLocation
{
    pipelineLocationId: number,
    pipelineId: number,
    office: Office,
    locationType: number
    
}