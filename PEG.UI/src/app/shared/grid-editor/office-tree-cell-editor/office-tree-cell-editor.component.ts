import { Component, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { Office } from '../../interfaces/office';
import { GlobalService } from '../../../global/global.service';
import { TreeComponent, TreeNode } from '../../tree/tree.component';
import { OfficeHierarchy } from '../../interfaces/officeHierarchy';

@Component({
  selector: 'app-office-tree-cell-editor',
  templateUrl: './office-tree-cell-editor.component.html',
  styleUrls: ['./office-tree-cell-editor.component.scss']
})
export class OfficeTreeCellEditorComponent implements AgEditorComponent {
  @ViewChild(TreeComponent) treeComponent!: TreeComponent;

  treeData: TreeNode[] = [];
  params: any;
  selectedItems: Office[] = [];
  isDisabled: boolean = false;
  defaultSelectedNodes: TreeNode[] = [];
  isLoading: boolean = true;  // Add a loading flag
  originalSelectedItems: Office[] = [];


  constructor(private globalService: GlobalService) { }

  agInit(params: any): void {
    this.params = params;
    this.selectedItems = this.params?.data?.officeToBeStaffed || [];
    this.originalSelectedItems = [...this.selectedItems]; // store the original value
    this.globalService.getOfficeHierarchy().subscribe((officeHierarchy: OfficeHierarchy) => {
      if (officeHierarchy) {
        this.treeData = this.transformToTreeNode(officeHierarchy.children);
      }
      this.isLoading = false;
      this.updateDefaultSelectedNodes();
    });
  }

 
  onSelectionChanged(selectedNodes: TreeNode[]): void {
    const newSelection = this.flattenSelectedNodes(selectedNodes);
    this.selectedItems = newSelection.length > 0 ? newSelection : this.originalSelectedItems;
    if (this.params.node && this.params.column) {
      this.params.node.setDataValue(this.params.column.colId, this.selectedItems);
    }
  }

  isPopup() {
    return true;
  }

  getValue(): any {
    return this.selectedItems;
  }

  private transformToTreeNode(offices: OfficeHierarchy[]): TreeNode[] {
    return offices.map((office: OfficeHierarchy) => ({
      text: office.text,
      value: office.value,
      expandable: !!office.children && office.children.length > 0,
      children: office.children ? this.transformToTreeNode(office.children) : []
    }));
  }

  private updateDefaultSelectedNodes(): void {
    this.defaultSelectedNodes = this.selectedItems.map(office => ({
      text: office.officeName,
      value: office.officeCode.toString(),
    }));
  }

  flattenSelectedNodes(nodes: TreeNode[], parent: OfficeHierarchy | null = null): Office[] {
    let offices: Office[] = [];
    for (let node of nodes) {
      const parentOfficeCode = parent ? parent.value : "";
      if (node.children && node.children.length > 0) {
        // If the node has children, recursively process them
        offices = offices.concat(this.flattenSelectedNodes(node.children, this.findOfficeHierarchyNode(node.value)));
      } else {
        // If the node has no children, add it to the offices list
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

  findOfficeHierarchyNode(value: string, nodes: TreeNode[] = this.treeData): OfficeHierarchy | null {
    for (let node of nodes) {
      if (node.value === value) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = this.findOfficeHierarchyNode(value, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private safeNumberConversion(value: any): number | null {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const convertedValue = Number(value);
      return isNaN(convertedValue) ? null : convertedValue;
    }
    return null;
  }
}

