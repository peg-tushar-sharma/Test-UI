import { Component, OnInit, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { Duration } from '../../interfaces/duration';
import { GlobalService } from '../../../global/global.service';
import { industry } from '../../interfaces/industry';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
    selector: 'app-industry-sector-editor',
    templateUrl: './industry-sector-editor.component.html',
    styleUrls: ['./industry-sector-editor.component.scss']
})
export class IndustrySectorEditorComponent implements AgEditorComponent {
    @ViewChild('sectors') ela: NgSelectComponent

    industrySectors: any;
    industries: any[];
    sectorsSubSector: any[];
    sectorsList: any[];
    subSectorsList: any[];
    selectedSectors: any[] = [];
    selectedSubSectors: any[] = [];
    constructor(public globalService: GlobalService) { }

    params: any;

    agInit(params): void {
        this.params = params;

        this.globalService.getAllIndustrySectorsSubSectors().subscribe(ind => {
            this.industrySectors = ind;
            this.sectorsList = ind.sectors.filter(e => e.industryId == this.params.data.industries[0].industryId);
            if (params.data.sector && params.data.sector.length > 0 && this.sectorsList && this.sectorsList.length > 0) {
                let tempSectors = [];
                params.data.sector.forEach(eachSector => {
                    if (this.sectorsList.find(w => w.sectorId == eachSector.industryId))
                        tempSectors.push(this.sectorsList.find(w => w.sectorId == eachSector.industryId));

                });
                this.selectedSectors = tempSectors;
            }
            this.renderIndustryList()
            if (params.data.subSector && params.data.subSector.length > 0 && this.subSectorsList && this.sectorsList.length > 0) {
                let tempSubSectors = [];
                params.data.subSector.forEach(eachSector => {
                    if (this.subSectorsList.find(w => w.subSectorId == eachSector.industryId))
                        tempSubSectors.push(this.subSectorsList.find(w => w.subSectorId == eachSector.industryId));
                });
                this.selectedSubSectors = tempSubSectors;
            }
        });
        // setTimeout(() => {
        //     if (this.ela != undefined) {
        //         this.ela.searchInput.nativeElement.focus()
        //     }

        // }, 100);
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            if (this.ela != undefined) {
                this.ela.searchInput.nativeElement.focus()
            }
        });
    }
    returnNextIndustry(hierarchyRight) {
        let tp = this.industrySectors.find(is => is.hierarchyLeft > hierarchyRight);
        return tp
    }
    renderIndustryList() {
        if (this.params.data.industries != undefined && this.params.data.industries.length > 0) {

        }

        if (this.selectedSectors && this.selectedSectors.length > 0) {
            this.subSectorsList = []
            this.selectedSectors?.forEach(currInd => {
                let tp = this.industrySectors.subSectors.filter(is => is.sectorId == currInd.sectorId);
                if (tp != undefined)
                    this.subSectorsList = this.subSectorsList.concat(tp);
            })
        }
    }

    onSectorChange(event) {

        this.renderIndustryList();
    }
    getValue(): any {

        this.params.data.subSector = [];

        this.selectedSubSectors.forEach(eachSubSector => {
            this.params.data.subSector.push({ industryId: eachSubSector.subSectorId, industryName: eachSubSector.subSectorName })
        });
        this.params.data.sector = [];
        this.selectedSectors.forEach(eachSector => {
            this.params.data.sector.push({ industryId: eachSector.sectorId, industryName: eachSector.sectorName })
        });
        if (this.params.colDef.field == 'sector') {

            return this.params.data.sector;
        }
        if (this.params.colDef.field == 'subSector') {

            return this.params.data.subSector;
        }

    }
    onSectorClear(event) {
        if (this.selectedSectors && this.selectedSectors.length == 0) {
            this.selectedSubSectors = [];
        }
        else if (this.selectedSectors && this.selectedSectors.length > 0) {
            let selectedList = [];
            this.selectedSectors.forEach(eachSector => {
                selectedList.push(...this.selectedSubSectors.filter(w => w.sectorId == eachSector.sectorId));
            });
            this.selectedSubSectors = selectedList;
        }
    }
    onSectorRemove(event) {
        if (this.selectedSectors && this.selectedSectors.length == 0) {
            this.selectedSubSectors = [];
        }
        else if (this.selectedSectors && this.selectedSectors.length > 0) {
            let selectedList = [];
            this.selectedSectors.forEach(eachSector => {
                selectedList.push(...this.selectedSubSectors.filter(w => w.sectorId == eachSector.sectorId));
            });
            this.selectedSubSectors = selectedList;
        }
    }

    isPopup(): boolean {
        return true;
    }
    getPopupPosition(): string {
        return "under";
    }

}
