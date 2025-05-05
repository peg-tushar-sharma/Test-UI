import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
@Directive({
    selector: 'select[required][formControlName],select[required][formControl],select[required][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => SelectRequiredCustomValidator), multi: true }
    ]
})
export class SelectRequiredCustomValidator implements Validator {
    /**
     * @description
     * Method that performs synchronous validation against the provided control.
     *
     * @param control The control to validate against.
     *
     * @returns A map of validation errors if validation fails,
     * otherwise null.
     */
    validate(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value!=0 ) {
            return null
        }
        else {
            return { selectRequired: true };
        }
    }
}