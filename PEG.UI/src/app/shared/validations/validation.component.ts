import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'validation',
    templateUrl: './validation.html',
    styleUrls: ['./validation.component.scss']
})
export class ValidationComponent {

    @Input()
    public control: FormControl;
}