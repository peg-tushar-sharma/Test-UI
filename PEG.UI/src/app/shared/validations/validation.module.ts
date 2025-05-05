import { NgModule } from '@angular/core';
import { RequiredCustomValidator } from './validators/required.validator';
import { SelectRequiredCustomValidator } from './validators/select-required.validator';

@NgModule({
    declarations: [RequiredCustomValidator,SelectRequiredCustomValidator],
    imports: [],
    exports: [RequiredCustomValidator,SelectRequiredCustomValidator]
})
export class ValidationModule {

}