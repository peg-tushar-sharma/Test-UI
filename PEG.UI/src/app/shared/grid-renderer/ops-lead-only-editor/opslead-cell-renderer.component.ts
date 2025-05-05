import { Component} from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

@Component({
    selector: 'app-opslead-cell-renderer',
    templateUrl: './opslead-cell-renderer.component.html',
    styleUrls: ['./opslead-cell-renderer.component.scss']
})
export class OpsLeadCellRendererComponent implements AgRendererComponent {

    isChecked: false;
    constructor() { }
    params: ICellRendererParams;
    refresh(): boolean {

        return true;
    }

    agInit(params: ICellRendererParams): void {
        this.params = params;
        if(params.data){
            this.isChecked=params.data.isOpsLead;
        }
    }
    toggleEvent(event) {
        let checked = this.isChecked;
        this.params.data.isOpsLead = checked;
        this.params.value = checked;
        let colId = this.params.column.getColId();
        this.params.node.setDataValue(colId, checked);
        this.invokeParentMethod();
    }
    public invokeParentMethod() {
        this.params.context.componentParent.onCellValueChanged(this.params);
    }
}