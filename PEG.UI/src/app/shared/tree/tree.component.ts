import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs/operators";

export interface TreeNode {
    text: string;
    value: string;
    children?: TreeNode[];
    entityTypeCode?: string;
    regionId?: number;
    expanded?: boolean;
    hidden?: boolean;
    indeterminate?: boolean;
}

export interface FlatNode {
    expandable: boolean;
    expanded: boolean;
    text: string;
    level: number;
    value: string;
    indeterminate?: boolean;
    entityTypeCode?: string;
    regionId?: number;
}

export class CustomTreeFlatDataSource<T> extends DataSource<T> {
    private _dataChange = new BehaviorSubject<T[]>([]);

    constructor(private treeFlattener: (data: TreeNode[]) => T[], initialData: TreeNode[]) {
        super();
        this.data = initialData;
    }

    set data(data: TreeNode[]) {
        this._dataChange.next(this.treeFlattener(data));
    }

    get data(): T[] {
        return this._dataChange.value;
    }

    connect(): Observable<T[]> {
        return this._dataChange.asObservable();
    }

    disconnect(): void {}
}

function flattenVisibleNodes(nodes: TreeNode[], level: number = 0): FlatNode[] {
    let flatNodes: FlatNode[] = [];
    nodes.forEach((node) => {
        // Skip any nodes flagged as hidden
        if (node.hidden) return;

        const flatNode: FlatNode = {
            expandable: !!node.children && node.children.length > 0,
            expanded: !!node.expanded,
            text: node.text,
            level: level,
            value: node.value,
            entityTypeCode: node.entityTypeCode,
            regionId: node.regionId,
            indeterminate: node.indeterminate === true
        };
        flatNodes.push(flatNode);

        if (node.expanded && node.children) {
            flatNodes = flatNodes.concat(flattenVisibleNodes(node.children, level + 1));
        }
    });
    return flatNodes;
}

@Component({
    selector: "app-tree",
    templateUrl: "./tree.component.html",
    styleUrls: ["./tree.component.scss"]
})
export class TreeComponent implements OnInit {
    @Output() selectionChanged = new EventEmitter<TreeNode[]>();
    @Input() readonly treeData: TreeNode[] = [];
    @Input() readonly searchDisabled: boolean = false;
    @Input() disabled: boolean = false;
    @Input() defaultSelectedNodes: TreeNode[] = [];

    searchControl = new FormControl("");
    placeholder = "Search";
    nodesFound: boolean = true;

    dataSource: CustomTreeFlatDataSource<FlatNode>;

    selectedNodes: Set<string> = new Set<string>();

    levelAccessor = (node: FlatNode) => node.level;

    constructor() {
        this.dataSource = new CustomTreeFlatDataSource<FlatNode>(flattenVisibleNodes, []);
    }

    ngOnInit(): void {
        // Ensuring we use an array
        const initialDataArray: TreeNode[] = Array.isArray(this.treeData) ? this.treeData : [this.treeData];
        this.dataSource.data = initialDataArray;

        this.expandAll();
        this.selectDefaultNodes();
        this.setupSearch();
    }

    hasChild = (_: number, node: FlatNode) => node.expandable;

    toggleNode(node: FlatNode, event?: Event | { stopPropagation?: () => void }): void {
        if (this.disabled) {
            return;
        }
        if (event && typeof event.stopPropagation === "function") {
            event.stopPropagation();
        }

        const originalNode = this.findNodeInTreeData(this.treeData, node.text);
        if (!originalNode) return;

        const isSelected = this.selectedNodes.has(originalNode.text);
        if (isSelected) {
            this.selectedNodes.delete(originalNode.text);
        } else {
            this.selectedNodes.add(originalNode.text);
        }
        originalNode.indeterminate = false;

        this.updateChildSelection(originalNode, !isSelected);

        const parent = this.getParentNodeInTreeData(this.treeData, originalNode);
        if (parent) {
            this.updateParentSelection(parent);
        }

        this.dataSource.data = this.treeData;
        this.emitSelectionChanged();
    }

    isSelected(node: FlatNode): boolean {
        return this.selectedNodes.has(node.text);
    }

    toggleExpansion(node: FlatNode, event?: Event): void {
        if (this.disabled) {
            return;
        }
        if (event) {
            event.stopPropagation();
        }
        this.toggleNodeExpansionInTreeData(node.text);
        this.dataSource.data = this.treeData;
    }

    private toggleNodeExpansionInTreeData(nodeText: string): void {
        function toggle(nodes: TreeNode[]): boolean {
            for (const node of nodes) {
                if (node.text === nodeText) {
                    node.expanded = !node.expanded;
                    return true;
                }
                if (node.children && toggle(node.children)) {
                    return true;
                }
            }
            return false;
        }
        toggle(this.treeData);
    }

    private unhideAllNodes(nodes: TreeNode[]): void {
        nodes.forEach((node) => {
            node.hidden = false;
            if (node.children) {
                this.unhideAllNodes(node.children);
            }
        });
    }

    private setupSearch(): void {
        this.searchControl.valueChanges
            .pipe(
                startWith(""),
                map((value) => value || "")
            )
            .subscribe((filterText: string) => {
                if (!filterText) {
                    // Clear search -> unhide all
                    this.unhideAllNodes(this.treeData);
                    this.nodesFound = true;
                } else {
                    let foundAny = false;
                    const searchLower = filterText.toLowerCase();

                    const checkAndMarkHidden = (node: TreeNode): boolean => {
                        const isMatch = node.text.toLowerCase().includes(searchLower);
                        let childMatches = false;
                        if (node.children) {
                            for (const child of node.children) {
                                const matched = checkAndMarkHidden(child);
                                if (matched) {
                                    childMatches = true;
                                }
                            }
                        }
                        node.hidden = !isMatch && !childMatches;
                        if (!node.hidden) {
                            foundAny = true;
                            node.expanded = true;
                        }
                        return !node.hidden;
                    };

                    this.treeData.forEach((rootNode) => {
                        checkAndMarkHidden(rootNode);
                    });
                    this.nodesFound = foundAny;
                }
                // Refresh UI
                this.dataSource.data = this.treeData;
            });
    }

    private expandAll(): void {
        const expand = (nodes: TreeNode[]) => {
            nodes.forEach((node) => {
                if (node.children && node.children.length > 0) {
                    node.expanded = true;
                    expand(node.children);
                }
            });
        };
        expand(this.treeData);
        this.dataSource.data = this.treeData;
    }

    private selectDefaultNodes(): void {
        if (this.defaultSelectedNodes && this.defaultSelectedNodes.length > 0) {
            this.defaultSelectedNodes.forEach((defaultNode) => {
                const nodeInTree = this.findNodeInTreeData(this.treeData, defaultNode.text);
                if (nodeInTree) {
                    this.selectedNodes.add(nodeInTree.text);
                    this.updateChildSelection(nodeInTree, true);
                    const parent = this.getParentNodeInTreeData(this.treeData, nodeInTree);
                    if (parent) {
                        this.updateParentSelection(parent);
                    }
                }
            });
            this.dataSource.data = this.treeData;
        }
    }

    private emitSelectionChanged(): void {
        const selectedTreeNodes = this.getSelectedTreeNodes();
        this.selectionChanged.emit(selectedTreeNodes);
    }

    private getSelectedTreeNodes(): TreeNode[] {
        const result: TreeNode[] = [];

        const recurse = (node: TreeNode): TreeNode | null => {
            const isSelectedOrIndeterminate = this.selectedNodes.has(node.text) || node.indeterminate === true;
            let childClones: TreeNode[] = [];

            if (node.children) {
                for (const child of node.children) {
                    const c = recurse(child);
                    if (c) {
                        childClones.push(c);
                    }
                }
            }

            if (isSelectedOrIndeterminate || childClones.length > 0) {
                return {
                    ...node,
                    children: childClones
                };
            }
            return null;
        };

        this.treeData.forEach((root) => {
            const r = recurse(root);
            if (r) {
                result.push(r);
            }
        });
        return result;
    }

    private updateChildSelection(node: TreeNode, isSelected: boolean): void {
        if (!node.children) return;
        node.children.forEach((child) => {
            if (isSelected) {
                this.selectedNodes.add(child.text);
            } else {
                this.selectedNodes.delete(child.text);
            }
            child.indeterminate = false;
            this.updateChildSelection(child, isSelected);
        });
    }

    private updateParentSelection(node: TreeNode): void {
        if (!node.children || node.children.length === 0) {
            return; // leaf
        }

        let atLeastOneSelected = false;
        let allSelected = true;

        for (const child of node.children) {
            const childSelected = this.selectedNodes.has(child.text);
            const childIndeterminate = !!child.indeterminate;
            if (!childSelected && !childIndeterminate) {
                allSelected = false;
            } else {
                atLeastOneSelected = true;
            }
        }

        if (allSelected && node.children.length > 0) {
            this.selectedNodes.add(node.text);
            node.indeterminate = false;
        } else if (atLeastOneSelected) {
            this.selectedNodes.delete(node.text);
            node.indeterminate = true;
        } else {
            this.selectedNodes.delete(node.text);
            node.indeterminate = false;
        }

        const parent = this.getParentNodeInTreeData(this.treeData, node);
        if (parent) {
            this.updateParentSelection(parent);
        }
    }

    private findNodeInTreeData(nodes: TreeNode[], text: string): TreeNode | null {
        for (const node of nodes) {
            if (node.text === text) {
                return node;
            }
            if (node.children) {
                const found = this.findNodeInTreeData(node.children, text);
                if (found) return found;
            }
        }
        return null;
    }

    private getParentNodeInTreeData(
        nodes: TreeNode[],
        child: TreeNode,
        parent: TreeNode | null = null
    ): TreeNode | null {
        for (const node of nodes) {
            if (node === child) {
                return parent;
            }
            if (node.children) {
                const foundParent = this.getParentNodeInTreeData(node.children, child, node);
                if (foundParent) return foundParent;
            }
        }
        return null;
    }
}
