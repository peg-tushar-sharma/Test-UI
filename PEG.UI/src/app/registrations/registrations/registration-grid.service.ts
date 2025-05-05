import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GridService } from '../../shared/grid-generator/grid-column.service';
import { Registrations } from './registrations';
import { GridColumn } from '../../shared/interfaces/models';
import { CommonMethods } from '../../shared/common/common-methods';
import { CoreService } from '../../core/core.service';
import { GlobalService } from '../../global/global.service';


@Injectable({ providedIn: 'any' })
export class RegistrationGridService extends GridService<Registrations> {

    /**
     *
     */
    constructor(@Inject(LOCALE_ID) locale: string, public coreService: CoreService, public globalService: GlobalService) {
        super(coreService,globalService);
    }

    public generateColumnDefinition(column: GridColumn): ColDef {
        let columnDef = super.generateColumnDefinition(column);

        // client display name -> filterParams = { suppressAndOrCondition: true } is missing

        if (column.type == 'tag') {
            //columnDef.suppressSizeToFit = true;
            // columnDef.colId = 'tags';
            columnDef.sortable = false;
        }

        if (column.field === 'tdn' || column.field === 'cdn' || column.field === 'cr' 
            || column.field === 'ln' || column.field === 'pn' ) {
            columnDef.tooltipField = column.field;
        }

        if(column.field == 'sb'){
            columnDef.tooltipValueGetter = function(params){
                return CommonMethods.getEmployeeName(params.data.sb);
            } 
        }
        
        if(column.field === 'ch' || column.field === 'csl' || column.field === 'oi'){
            columnDef.tooltipValueGetter = function(params){
                return CommonMethods.getEmployeeNames(params.data[column.field],';');
            } 
        }
        if(column.field === 'in'){
            columnDef.tooltipValueGetter = function(params){
                return params.data[column.field]? params.data[column.field].industryName:'';
            } 
        }

        if (column.type == 'check') {
            columnDef.filterParams= { cellRenderer: (params: { value: string }) => !params.value ? "Blanks" : params.value } ;
            columnDef.filterParams.suppressMiniFilter = true;
        }


        return columnDef;
    }

    getFormattedValue() {

    }
}
