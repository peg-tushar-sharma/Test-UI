import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
    selector: "app-stage-cell-renderer",
    templateUrl: "./stage-cell-renderer.component.html",
    styleUrls: ["./stage-cell-renderer.component.scss"]
})
export class StageCellRendererComponent implements ICellRendererAngularComp {
    public value: string;
    public isDropdownOpen: boolean = false;

    constructor() {}

    agInit(params: ICellRendererParams): void {
        this.value = params.value;
    }

    refresh(): boolean {
        return false;
    }
}
