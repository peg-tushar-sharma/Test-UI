import { AfterViewInit, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { GlobalService } from "../../../global/global.service";
import { BucketRowType } from "../../../shared/enums/bucket-row-type";
import { CoreService } from "../../../core/core.service";
import { EmployeNotes, OfficeNotes } from "../../pipelineBucket";
import { PipelineService } from "../../pipeline.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "app-pipeline-note",
    templateUrl: "./pipeline-note.component.html",
    styleUrls: ["./pipeline-note.component.scss"]
})
export class PipelineNoteComponent implements OnInit, AfterViewInit {
    title: string;
    data: any;
    preference: string;
    availableDate: Date;
    employeeNote: EmployeNotes = new EmployeNotes();
    officeNote: OfficeNotes = new OfficeNotes();
    previousNote: string = "";
    bucketRowType: BucketRowType;
    outrage: string;
    managerPopup: boolean = false;
    cdWork:string;
    // For Levels of Impact
    displayImpactLevelsModal: boolean = false;
    selectedLevelOfImpact = null;
    pegColorId: number = null;
    levelsOfImpact: any;

    // for resource detail
    url: string = `${this.coreService?.appSettings?.staffingBasePath}/employee`;
    urlSafe: SafeResourceUrl;
    displayIframe: boolean = false;

    @Output()
    public event: EventEmitter<any> = new EventEmitter();

    @Output()
    public saveDate: EventEmitter<any> = new EventEmitter();

    constructor(private pipelineService: PipelineService, private globalService: GlobalService, public bsModalRef: BsModalRef, public coreService: CoreService, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.preference =this.cdWork= this.outrage = "";

        if (BucketRowType.Manager == this.data.rowType) {
            this.pipelineService.getEmployeeNote(this.data.employee.employeeCode).subscribe((response) => {
                if (response) {
                    this.outrage = response.outrage;
                    this.previousNote = response.preference;
                    this.cdWork = response.cdWork;
                    this.preference = response.preference;
                    this.pegColorId = response.pegColorId;
                }

                this.getPegColors();
                this.managerPopup = true;
            });
        } else {
            let pipelineBucketId = this.data?.pipelineBucketId ?? 0;
            this.pipelineService.getOfficeNote(this.data.office.officeCode,pipelineBucketId).subscribe((response) => {
                if (response) {
                    this.outrage = response.officeOutrage;
                    this.previousNote = response.officeNote;
                    this.cdWork = response.cdWork;
                    this.preference = response.preference;
                    this.pegColorId = response.pegColorId;
                }

                this.getPegColors();
                this.managerPopup = false;
            });
        }

        this.loadBossIframe();
    }

    ngAfterViewInit() {
        // The reason behind to put this code because whenever we try to apply the
        // styling through css all the modals are impacted and we only need to add style over the confirm modal
        let modalElement = document.getElementsByClassName("modal-backdrop");
        for (let i = 0; i < modalElement.length; i++) {
            const slide = modalElement[i] as HTMLElement;
            slide.setAttribute("style", "z-index : 99999 !important");
        }

        let modalElemen = document.getElementsByClassName("modal");
        for (let i = 0; i < modalElemen.length; i++) {
            const slide = modalElemen[i] as HTMLElement;
            slide.setAttribute("style", "z-index : 99999 !important");
        }
    }

    loadBossIframe() {
        const employeeCode = this.data?.employee?.employeeCode || "";
        const encodeURI = `${this.url}?id=${encodeURIComponent(employeeCode)}`;

        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI);
        this.displayIframe = employeeCode.length > 1 ? true : false;
    }

    getPegColors() {
        this.globalService.getResourceNoteColors().subscribe((colors) => {
            this.levelsOfImpact = colors;

            if (this.pegColorId) {
                this.selectedLevelOfImpact = this.levelsOfImpact.find((level) => {
                    return level.pegColorId == this.pegColorId;
                });
            }
        });
    }

    setLevelOfImpact(levelSelected) {
        this.selectedLevelOfImpact = levelSelected;
        this.displayImpactLevelsModal = false;
    }

    close() {
        this.preference = this.outrage = "";
        this.bsModalRef.hide();
    }

    saveNote() {
        // save Available Date
        this.saveDate.emit("saveDate");

        if (BucketRowType.Manager == this.data.rowType) {
            this.employeeNote.employeeCode = this.data.employee.employeeCode;
            this.employeeNote.outrage = this.outrage?.trim();
            this.employeeNote.preference = this.preference?.trim();
            this.employeeNote.cdWork = this.cdWork?.trim();
            this.employeeNote.pegColorId = this.selectedLevelOfImpact ? this.selectedLevelOfImpact.pegColorId : null;
            this.employeeNote.colorCode = this.selectedLevelOfImpact ? this.selectedLevelOfImpact.colorCode : null;

            this.close();
            this.event.emit("saveNote");
        } else {
            this.officeNote.officeCode = this.data.office.officeCode;
            this.officeNote.officeOutrage = this.outrage?.trim();
            this.officeNote.preference = this.preference?.trim();
            this.officeNote.cdWork = this.cdWork?.trim();
            this.officeNote.pegColorId = this.selectedLevelOfImpact ? this.selectedLevelOfImpact.pegColorId : null;
            this.officeNote.colorCode = this.selectedLevelOfImpact ? this.selectedLevelOfImpact.colorCode : null;
            this.officeNote.pipelineBucketId = this.data?.pipelineBucketId

            this.close();
            this.event.emit("saveNote");
        }
    }

    // Set a note to low impact by default if outage is selected
    onOutageUpdate() {
        if (this.outrage != "" && this.selectedLevelOfImpact == null) {
            this.selectedLevelOfImpact = this.levelsOfImpact.find((level) => {
                return level.pegColorId == 12;
            });
        } else if (this.outrage == "") {
            this.selectedLevelOfImpact = null;
        }
    }

    openStaffing() {
        const url = `${this.coreService.appSettings.staffingBasePath}/overlay?employee=${this.data?.employee?.employeeCode}`;
        window.open(url, "_blank");
    }

    onDateChanged(event) {
        if (event != undefined && event != null && event != "Invalid Date") {
            this.availableDate = event;
        }
    }
}
