import {Registrations} from '../registrations/registrations'
import { Injectable } from '@angular/core';
import { Prohibition } from '../prohibitions/prohibition';
import { WorkType } from '../new-registration/workType';
import { RegistrationStage } from '../../shared/interfaces/RegistrationStage';
import { RegistrationStatus } from '../../shared/interfaces/registrationStatus';
import { Investment } from './investment';
import { WorkToStart } from '../new-registration/workToStart';
import { Office } from '../..//shared/interfaces/office';
@Injectable({ providedIn: 'any' })
export class RegistrationRequestService
{
    public registration: Registrations;
    public prohibition: Prohibition;
    public investment: Investment;
    public workTypes: WorkType[];
    public registrationStage: RegistrationStage[];
    public registrationStatus: RegistrationStatus[];
    public workToStart: WorkToStart[];
    public bainOffice: Office[];
}