import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
@Directive({
    selector: 'input[required][formControlName],input[required][formControl],input[required][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => RequiredCustomValidator), multi: true }
    ]
})
export class RequiredCustomValidator implements Validator {
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
         if (typeof (control.value) == 'boolean' && control.value != null) {
            return null
        }
        else if (typeof (control.value) == 'string' && control.value && control.value.trim()) {
            return null
        }
        else {
            return { required: true };
        }
    }
}