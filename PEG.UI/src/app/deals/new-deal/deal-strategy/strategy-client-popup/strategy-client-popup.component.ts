import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import * as moment from "moment";
import { PegTostrService } from "../../../../core/peg-tostr.service";
import { CommonMethods } from "../../../../shared/common/common-methods";

@Component({
    selector: "app-strategy-client-popup",
    templateUrl: "./strategy-client-popup.component.html",
    styleUrls: ["./strategy-client-popup.component.scss"]
})
export class StrategyClientPopupComponent implements OnInit {
    clients: any[];
    rowData = [];
    columnDefs: ColDef[];
    gridApi: GridApi;
    gridColumnApi;
    gridOptions: GridOptions;
    defaultColDef: ColDef;
    defaultCellStyle = {
        color: "#121212",
        "font-family": "Graphik",
        "font-size": "12px",
        "line-height": "35px"
    };

    constructor(public modalRef: BsModalRef, private toastr: PegTostrService) {}

    ngOnInit(): void {
        if (this.clients) {
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
            enableRangeSelection: true,
            rowSelection: "multiple",
            copyHeadersToClipboard: true
        };

        this.defaultColDef = {
            sortable: false,
            filter: false,
            flex: 1,
            suppressMenu: true,
            autoHeight: true,
            resizable: true
        };

        this.columnDefs = [
            {
                field: "priority",
                cellStyle: this.defaultCellStyle,
                tooltipField: "priority",
                maxWidth: 150,
                headerName: "Priority"
            },
            {
                field: "client",
                cellStyle: this.defaultCellStyle,
                tooltipField: "client",
                maxWidth: 200,
                headerName: "Client"
            },
            {
                field: "stage",
                cellStyle: this.defaultCellStyle,
                tooltipField: "stage",
                maxWidth: 200,
                headerName: "Stage"
            },
            {
                field: "registrationSubmittedBy",
                cellStyle: this.defaultCellStyle,
                tooltipField: "registrationSubmittedBy",
                maxWidth: 250,
                headerName: "Registration Submitted By"
            },
            {
                field: "submissionDate",
                cellStyle: this.defaultCellStyle,
                cellRenderer: (data) => {
                    return data?.value ? moment(data?.value).format("DD-MMM-YYYY") : "";
                },
                tooltipField: "submissionDate",
                maxWidth: 150,
                headerName: "Submission Date"
            },
            {
                field: "statusUpdateDate",
                cellStyle: this.defaultCellStyle,
                cellRenderer: (data) => {
                    return data?.value ? moment(data?.value).format("DD-MMM-YYYY") : "";
                },
                tooltipField: "statusUpdateDate",
                maxWidth: 200,
                headerName: "Status Update Date"
            },
            { field: "status", cellStyle: this.defaultCellStyle, maxWidth: 250, headerName: "Status" },
            {
                field: "caseEndDate",
                cellStyle: this.defaultCellStyle,
                headerName: "Case End Date",
                cellRenderer: (data) => {
                    return data?.value ? moment(data?.value).format("DD-MMM-YYYY") : "";
                },
                tooltipField: "caseEndDate",
                maxWidth: 150
            },
            {
                field: "type",
                cellStyle: this.defaultCellStyle,
                headerName: "Type of Work",
                tooltipField: "type",
                maxWidth: 350
            },
            {
                field: "allocationNote",
                cellStyle: this.defaultCellStyle,
                headerName: "Notes",
                minWidth: 400,
                cellClass: "cell-wrap-text"
            }
        ];

        this.rowData = this.clients.map((item) => {
            return {
                client: item.client?.clientName,
                priority: item?.priority?.priorityName,
                stage: item.registrationStage?.stageTypeName,
                submissionDate: item.registrationSubmissionDate
                    ? moment(item.registrationSubmissionDate).format("DD-MMM-YYYY")
                    : "",
                statusUpdateDate: item.statusUpdateDate ? moment(item.statusUpdateDate).format("DD-MMM-YYYY") : "",
                status: item.registrationStatus?.statusTypeName,
                type: item?.workType?.workTypeName,
                registrationSubmittedBy: item?.registrationSubmittedBy,
                allocationNote: item?.allocationNote,
                caseEndDate: item?.caseInfo?.caseEndDate
                    ? moment(item?.caseInfo?.caseEndDate).format("DD-MMM-YYYY")
                    : ""
            };
        });
    }

    copyGridToClipboard() {
        let html = '<table style="border: 1px solid #cecece"><thead><tr>';
        this.columnDefs.forEach((col) => {
            // Conver the col.field to paragraph case
            html += `<th style="border: 1px solid #cecece; text-align:left;">${CommonMethods.toTitleCaseWithSpace(
                col?.headerName
            )}</th>`;
        });
        html += "</tr></thead><tbody>";
        this.gridApi.forEachNodeAfterFilterAndSort((node) => {
            html += "<tr>";
            this.columnDefs.forEach((col) => {
                html += `<td style="border: 1px solid #cecece">${node.data[col.field] ?? ""}</td>`;
            });
            html += "</tr>";
        });
        html += "</tbody></table>";
        // Copy the HTML to the clipboard
        // this.copyToClipboard(html);
        const handleCopy = CommonMethods.copyToClipboard("<div>" + html + "</div>");
        this.toastr.showSuccess("Client data copied to clipboard", "Success");
    }

    closeModal() {
        this.modalRef.hide();
    }
}
