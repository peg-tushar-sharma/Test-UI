import { Component, Input } from '@angular/core';

@Component({
    selector: 'loading',
    templateUrl: './loading.html',
    styleUrls: ['./loader.scss']
})
export class Loader {

    @Input()
    public isLoading: boolean = true;
}