import { PipelineLocation } from "./pipelineLocation";

export interface Location
{
    
    prefered:PipelineLocation[]
    allocated:PipelineLocation[]
    conflicted:PipelineLocation[]
    
}