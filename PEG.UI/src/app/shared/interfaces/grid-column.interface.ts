export interface GridColumn {
    columnId:number;
    headerName: string;
    field: string;
    filter: string;
    type: ColumnType;
    order?: number;
    sort?: SortType;
    isQuickFilter?: boolean;
    tooltipField?: string;
    maxWidth: number;
    filterParams: any;
    isEditable: boolean;
    isRowGroup: boolean;
    rowGroupIndex:number;
    isRowDrag: boolean;
    isMasked: boolean;
    splitChar: string;
    cellEditor: string;
    headerClass: string;
    cellRenderer: string;
    hasMiniFilter: boolean;
    hide: boolean;
    isDefault: boolean;
    isHide: boolean;
    sortOrder: number;
    roleSortOrder: number;
    tooltipComponent: string;
    isFilterable: boolean;
    sortType?: SortType;
    isOppName: boolean;
    oppSortOrder: number;
    isDefaultOppName: boolean;
    includeAsOppName: boolean;
    columnWidth: number;
    sortIndex?:number;
    delimiter:string ;

    //value for toggling dropdown in new opportunity name UI
    isDropdownVisible:boolean;
}

export type ColumnType = 'text' | 'date' | 'datetime' | 'check' | 'tag' | 'icon' | 'dealPermission' | 'copyLink' | 'deal' | 'stage' | 'people' | 'status' | 'lock' | 'client';
export type SortType = 'asc' | 'desc' | null;