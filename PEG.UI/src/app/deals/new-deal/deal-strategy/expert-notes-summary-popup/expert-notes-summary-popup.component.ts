import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { PegTostrService } from "../../../../core/peg-tostr.service";

@Component({
    selector: 'app-expert-notes-summary-popup',
    templateUrl: './expert-notes-summary-popup.component.html',
    styleUrls: ['./expert-notes-summary-popup.component.scss']
})
export class ExpertNotesSummaryPopupComponent implements OnInit {

    notes: any[];
    rowData = [];
    columnDefs: ColDef[];
    gridApi: GridApi;
    gridColumnApi;
    gridOptions: GridOptions;
    defaultColDef: ColDef;
    defaultCellStyle = {
        color: "#121212",
        "font-family": "Graphik",
        "font-size": "12px"
    };

    constructor(public modalRef: BsModalRef, private toastr: PegTostrService) { }

    ngOnInit(): void {
        if (this.notes) {
            // Load AG Grid Configuration
            this.loadGridConfiguration();
        }
    }

    onGridReady(params) {
        params.api.sizeColumnsToFit();
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    loadGridConfiguration() {
        this.gridOptions = <GridOptions>{
            context: {
                componentParent: this
            },
            stopEditingWhenCellsLoseFocus: true,
            singleClickEdit: false,
            suppressAggFuncInHeader: true,
            headerHeight: 40,
            enableRangeSelection: true
        };

        this.defaultColDef = {
            sortable: true,
            filter: false,
            suppressMenu: true
        };

        this.columnDefs = [
            { field: "expertPool", cellStyle: this.defaultCellStyle, tooltipField: "expertPool", maxWidth: 150 },
            { field: "expertName", cellStyle: this.defaultCellStyle, tooltipField: "expertName", maxWidth: 250 },
            { field: "category", cellStyle: this.defaultCellStyle, tooltipField: "category", maxWidth: 150 },
            { field: "title", cellStyle: this.defaultCellStyle, tooltipField: "title", maxWidth: 250 },
            { field: "note", cellStyle: this.defaultCellStyle, tooltipField: "note" }
        ];

        this.rowData = this.notes.map((item) => {
            return {
                expertName: item.expertName,
                title: item.title,
                expertPool: item.expertPool,
                category: item.category,
                note: item.note,
            };
        });
    }

    copyGridToClipboard() {
        this.gridApi.selectAll();
        this.gridApi.copySelectedRowsToClipboard({ includeHeaders: true });
        this.toastr.showSuccess("Copied to clipboard", "Success");
    
        // Deselect all after 3s
        let deselectTimeout = window.setTimeout(() => {
            this.gridApi.deselectAll();
            window.clearTimeout(deselectTimeout);
        }, 3000);
    }

    closeModal() {
        this.modalRef.hide();
    }
}
