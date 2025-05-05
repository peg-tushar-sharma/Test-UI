import { PipelineQuantifier } from "./pipelineQuantifier";

export interface ExpectedStart {
    expectedStartDate:Date;
    expectedEndtDate?:Date;
    qualifier?:PipelineQuantifier;
}