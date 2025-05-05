export class fontIcons {
    public static get filterIcon() { return 'fa-filter' };
    public static get checkFontAwesome() { return 'fa-check' };
    public static get editFontAwesome() { return 'fa-edit' };
}
export class GridValues {
    public static get menuTabs() { return ['filterMenuTab']; }
    public static get minimunDateValue() { return '1901-Jan-01' };
    public static get dateFormat() { return 'dd-MMM-yyyy' };
    public static get dateFilterOptions() { return ['greaterThan', 'lessThan', 'inRange'] };
    public static get numberFilterOptions() { return ['greaterThan', 'lessThan', 'notEqual', 'equals', 'inRange'] };
}

export class GridFilters {
    public static get textFilterComponent() { return 'textFilterComponent' };
    public static get agSetColumnFilter() { return 'agSetColumnFilter' };
    public static get agNumberColumnFilter() { return 'agNumberColumnFilter' };
    public static get tagsFilterComponent() { return 'tagsFilterComponent' };
    public static get agDateColumnFilter() { return 'agDateColumnFilter' };
    public static get agCustomSetFilter() { return 'customSetFilterComponent' };
    public static get agTextColumnFilter() { return 'agTextColumnFilter' };
}

export class GridRenderers {
    public static get checkMarkHTML() { return `<div><i class="fa ${fontIcons.checkFontAwesome}"></i></div>` };
    public static get editHTML() { return `<i class="inline-edit-grid fa ${fontIcons.editFontAwesome}"></i>` };
    public static get tagsRendererComponent() { return 'tagsRendererComponent' };
    public static get iconRendererComponent() { return 'iconsRendererComponent' };
    public static get copyLinkIconComponent() { return 'copyLinkIconComponent' };
    public static get grantPermissionComponent() { return 'grantPermissionComponent' };
    public static get dealIconRendererComponent() { return 'dealIconRendererComponent' };
    public static get targetCellRendererComponent() { return 'targetCellRendererComponent' };
    public static get maskRendererComponent() { return 'maskRendererComponent' };
}