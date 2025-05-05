import { Component, AfterViewInit } from "@angular/core";
import { ICellEditorParams } from "ag-grid-community";

@Component({
    selector: "app-stage-cell-editor",
    templateUrl: "./stage-cell-editor.component.html",
    styleUrls: ["./stage-cell-editor.component.scss"]
})
export class StageCellEditorComponent implements AfterViewInit {
    public params: any;
    public value: any;
    public widthToUse: string;

    // Dropdown Options
    public dropdownOptions = [
        {
            label: "Interest",
            active: false
        },
        {
            label: "Commitment",
            active: false
        },
        {
            label: "Work Started",
            active: false
        },
        {
            label: "Work Completed",
            active: false
        },
        {
            label: "Terminated",
            active: false
        }
    ];

    constructor() {}

    ngAfterViewInit(): void {}

    agInit(params: ICellEditorParams): void {
        this.params = params;
        this.widthToUse = params.column.getActualWidth() + "px";
        this.getActiveSelection(params.value);
    }

    // Set Stage to display
    getActiveSelection(option) {
        this.dropdownOptions.forEach((item) => {
            if (item.label === option) {
                this.value = item.label;
                item.active = true;
            } else {
                item.active = false;
            }
        });
    }

    handleStageSelection(optionSelected: any) {
        this.getActiveSelection(optionSelected.label);
        this.params.stopEditing();
    }

    getValue() {
        return this.value;
    }

    isPopup(): boolean {
        return true;
    }

    refresh(): boolean {
        return false;
    }
}
