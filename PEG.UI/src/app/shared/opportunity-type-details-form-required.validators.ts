import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredFieldValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null 
      || 
      ( control.value?.additionalTeamValue.length == 0
      && control.value?.nextPhaseValue.length == 0
      && control.value?.isAdditionalTeam == false
      && control.value?.isNextPhase == false
      && control.value?.isContinuation == false
      && control.value?.isRestart == false)) {
      return { requiredField: true }; // Return error if field is empty
    }
    return null; // Return null if validation passes
  };
}