import {Component, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-custom-header',
     templateUrl: './custom-header.component.html',
     styleUrls: ['./custom-header.component.scss']
})
export class CustomHeaderComponent {
    public agParams: any;

    public ascSort: string;
    public descSort: string;
    public noSort: string;

  @ViewChild('menuButton', { read: ElementRef, static: false }) public menuButton;

    agInit(params): void {
        this.agParams = params;

        params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
        this.onSortChanged();
    }

    onMenuClicked() {
        this.agParams.showColumnMenu(this.menuButton.nativeElement);
    }

    onSortChanged() {
        this.ascSort = this.descSort = this.noSort = 'inactive';
        if (this.agParams.column.isSortAscending()) {
            this.ascSort = 'active';
        } else if (this.agParams.column.isSortDescending()) {
            this.descSort = 'active';
        } else {
            this.noSort = 'active';
        }
    }

    onSortRequested(order, event) {
        this.agParams.setSort(order, event.shiftKey);
    }


    onSortToggleRequested(event) {
        if (this.agParams.enableSorting) {
            this.agParams.setSort(this.agParams.column.sort === 'desc' ? 'asc' : 'desc', event.shiftKey);
        }
    }
}

