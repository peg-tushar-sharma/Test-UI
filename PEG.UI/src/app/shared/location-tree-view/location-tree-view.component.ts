import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
    forwardRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, Validators } from "@angular/forms";
import { StaffingService } from "../../staffing/staffing.service";
import { User } from "../../security/app-user-auth";
import { GlobalService } from "../../global/global.service";
import { Office } from "../interfaces/office";
import { TreeComponent, TreeNode } from "../tree/tree.component";
import { Region } from "../enums/region";
import { OfficeHierarchy } from "../interfaces/officeHierarchy";

@Component({
    selector: "app-location-tree-view",
    templateUrl: "./location-tree-view.component.html",
    styleUrls: ["./location-tree-view.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LocationTreeViewComponent),
            multi: true
        }
    ]
})
export class LocationTreeViewComponent implements OnInit, ControlValueAccessor {
    @Output() updateOfficeSelection: EventEmitter<Office[]> = new EventEmitter<Office[]>();
    @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

    @Input() disabled: boolean = false;
    @Input() officesToBeStaffed: Office[] = [];
    @Input() isStaffing: boolean = false;
    @Input() saveOnlyOnBlur: boolean = false;
    @Input() parentFormGroup: FormGroup;
    @Input() formSubmitted: boolean;
    @Input() user: User = new User();
    @Input() dropdownTextItemsLimit: number = 5;

    @ViewChild(TreeComponent) treeComponent: TreeComponent;
    @ViewChild("dropdown") dropdown: ElementRef;

    treeData: TreeNode[] = [];
    selectedOfficeItems: Office[] = [];
    dropdownTextLabelItems: string[] = [];
    officeHierarchyData: OfficeHierarchy;
    defaultSelectedNodes: TreeNode[] = [];

    onload = true;
    isOpen = false;
    isDataLoaded = false;
    isDropdownOpen = false;
    selectedOfficesText = "Select an office";

    private _onChange: (value: Office[]) => void = () => {};
    private _onTouched: () => void = () => {};

    constructor(private globalService: GlobalService, private staffingService: StaffingService) {}

    ngOnInit(): void {
        if (this.parentFormGroup) {
            const officeControl = this.parentFormGroup.controls["officeToBeStaffed"];
            const validators = [Validators.required, Validators.minLength(1)];

            if (this.user.employeeRegionId === Region.Americas) {
                officeControl.removeValidators(validators);
            } else {
                officeControl.addValidators(validators);
            }

            if (this.officesToBeStaffed) {
                officeControl.patchValue(this.officesToBeStaffed);
            }
        }
        this.loadOffices();
    }

    loadOffices(): void {
        const officeHierarchy$ = this.isStaffing
            ? this.staffingService.getOfficeHierarchy()
            : this.globalService.getOfficeHierarchy();

        officeHierarchy$.subscribe(
            (officeHierarchy) => {
                this.officeHierarchyData = officeHierarchy;
                this.treeData = officeHierarchy.children;
                this.isDataLoaded = true;
                this.loadTree();
            },
            (error) => {
                const errMsg = this.isStaffing
                    ? "Error loading offices for staffing:"
                    : "Error loading offices for PEG:";
                console.error(errMsg, error);
            }
        );
    }

    loadTree(): void {
        this.updateDefaultSelectedNodes();
        this.onload = false;
    }

    updateDefaultSelectedNodes(): void {
        this.selectedOfficeItems = this.officesToBeStaffed;
        this.defaultSelectedNodes = this.officesToBeStaffed.map((office) => ({
            text: office.officeName,
            value: office.officeCode.toString()
        }));
        this.dropdownTextLabelItems = this.selectedOfficeItems.map((s) => s.officeName);
        setTimeout(() => {
            this.updateSelectedOfficesText();
        });
    }

    toggleDropdown() {
        const wasOpen = this.isDropdownOpen;
        this.isDropdownOpen = !this.isDropdownOpen;
        if (wasOpen && !this.isDropdownOpen && this.saveOnlyOnBlur) {
            this._onTouched();
            this._onChange(this.selectedOfficeItems);
            this.updateOfficeSelection.emit(this.selectedOfficeItems);
            this.blurEvent.emit();
        }
    }

    updateSelectedOfficesText() {
        const textLimit = this.dropdownTextItemsLimit ?? 5;
        const selectedCount = this.dropdownTextLabelItems.length;

        if (selectedCount === 0) {
            this.selectedOfficesText = "Select an office";
        } else if (selectedCount === 1) {
            this.selectedOfficesText = this.dropdownTextLabelItems[0];
        } else if (selectedCount <= textLimit) {
            this.selectedOfficesText = this.dropdownTextLabelItems.join(", ");
        } else {
            const limitedList = this.dropdownTextLabelItems.slice(0, textLimit);
            const remainder = selectedCount - textLimit;
            this.selectedOfficesText = limitedList.join(", ") + ` + ${remainder} `;
        }
    }

    @HostListener("document:click", ["$event"])
    clickOutside(event: Event) {
        if (!this.dropdown.nativeElement.contains(event.target)) {
            const wasOpen = this.isDropdownOpen;
            this.isDropdownOpen = false;
            if (this.saveOnlyOnBlur && wasOpen) {
                this._onTouched();
                this._onChange(this.selectedOfficeItems);
                this.updateOfficeSelection.emit(this.selectedOfficeItems);
                this.blurEvent.emit();
            }
        }
    }

    mapOfficeToTree(officeHierarchy: any[]): TreeNode[] {
        return officeHierarchy.map((office) => ({
            text: office.officeName,
            value: office.value,
            children: office.children ? this.mapOfficeToTree(office.children) : undefined
        }));
    }
    onSelectionChanged(selectedNodes: TreeNode[]): void {
        const flatSelectedOffices = this.flattenSelectedNodes(selectedNodes);
        this.dropdownTextLabelItems = flatSelectedOffices.map((f) => f.officeName);
    
        let officeObservable;
        if (this.isStaffing) {
            officeObservable = this.staffingService.getAllOffice();
        } else {
            officeObservable = this.globalService.getAllOffice();
        }
        officeObservable.subscribe((allOffices) => {
            this.setSelectedOfficeItems(flatSelectedOffices, allOffices);
            this.postSelectionUpdates()
        });
    }

    private postSelectionUpdates(): void {
        if (!this.onload) {
            setTimeout(() => {
                this.updateSelectedOfficesText();
                if (!this.saveOnlyOnBlur) {
                    this._onTouched();
                    this._onChange(this.selectedOfficeItems);
                    this.updateOfficeSelection.emit(this.selectedOfficeItems);
                }
                this.updateParentFormValidity();
            });
        }
    }
    
    
    setSelectedOfficeItems(selectedOfficesFromTree: Office[], allOfiices: Office[]) {
        this.selectedOfficeItems = this.getSelectedOffice(selectedOfficesFromTree, allOfiices);
    }

    getSelectedOffice(selectedOfficesFromTree: Office[], allOfiices: Office[]): Office[] {
        let selectedOffices: Office[] = [];
        selectedOfficesFromTree.forEach((nodeItem) => {
            let office = allOfiices.find(
                (office) => office.officeCode.toString().toLowerCase() === nodeItem.officeCode.toString().toLowerCase()
            );
            if (office) {
                selectedOffices.push(office);
            }
        });
        return selectedOffices;
    }

    flattenSelectedNodes(nodes: TreeNode[], parent: OfficeHierarchy | null = null): Office[] {
        let offices: Office[] = [];
        for (let node of nodes) {
            const parentOfficeCode = parent ? parent.value : "";
            if (node.children && node.children.length > 0) {
                offices = offices.concat(
                    this.flattenSelectedNodes(node.children, this.findOfficeHierarchyNode(node.value))
                );
            } else {
                offices.push({
                    officeName: node.text,
                    officeCode: this.safeNumberConversion(node.value),
                    officeAbbr: null,
                    officeCluster: node.text,
                    officeClusterCode: this.safeNumberConversion(node.value),
                    regionId: node.regionId,
                    parentOfficeCode: parentOfficeCode,
                    entityTypeCode: node.entityTypeCode
                } as Office);
            }
        }
        return offices;
    }

    findOfficeHierarchyNode(value: string, node: OfficeHierarchy = this.officeHierarchyData): OfficeHierarchy | null {
        if (node.value === value) {
            return node;
        }
        if (node.children) {
            for (let child of node.children) {
                const found = this.findOfficeHierarchyNode(value, child);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    writeValue(value: Office[]): void {
    }

    registerOnChange(fn: (value: Office[]) => void): void {
    }

    registerOnTouched(fn: () => void): void {
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private safeNumberConversion(value: any): number | null {
        if (typeof value === "number") {
            return value;
        }
        if (typeof value === "string") {
            const convertedValue = Number(value);
            return isNaN(convertedValue) ? null : convertedValue;
        }
        return null;
    }

    private updateParentFormValidity(): void {
        if (this.parentFormGroup && this.parentFormGroup.get("officeToBeStaffed")) {
            const officeControl = this.parentFormGroup.get("officeToBeStaffed");
            const isEmpty = !this.dropdownTextLabelItems?.length;

            if (isEmpty) {
                officeControl.setErrors({ required: true });
            } else {
                officeControl.setErrors(null);
            }
        }
    }
}
