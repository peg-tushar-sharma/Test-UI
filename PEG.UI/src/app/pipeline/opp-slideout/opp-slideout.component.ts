import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: "app-opp-slideout",
    templateUrl: "./opp-slideout.component.html",
    styleUrls: ["./opp-slideout.component.scss"]
})
export class OppSlideoutComponent implements OnInit, OnChanges {
    /* Opportunity is a private variable with a getter and setter to handle when the opportunity changes */

    @Input() opportunity: any;
    @Input() oppNameFields: any;
    @Input() isConflicted: boolean;
    @Input() weeklyBucket:any;

    @Output() emitPipelineValue = new EventEmitter();
    @Output() closeFlyoutEmitter = new EventEmitter();
    @Output() emitAddRowinGrid = new EventEmitter();

    isShow: boolean = false;
    panelWidth: number = 1250;
    currentTab: string;

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void { }

    showPanel(show: boolean) {
        this.isShow = show;
    }

    // Check to see if the panel should be closed on click, outside of the panel area
    closeSlideoutCheck(event) {
        
        if (event.clientX > this.panelWidth) {
            this.showPanel(false);
            this.closeFlyoutEmitter.emit(this.opportunity);
        }
    }

    updatePipeline(event: Event) {
        this.emitPipelineValue.emit(event);
    }
    addRowinGrid(event: Event) {
        this.opportunity=event;
        this.emitAddRowinGrid.emit(event);
    }

    selectTab(currentTab) {
        this.currentTab = currentTab;
    }
}
