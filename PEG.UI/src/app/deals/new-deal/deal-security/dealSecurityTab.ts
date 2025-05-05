import { Employee } from '../../../shared/interfaces/models';

export class DealSecurityTab {
    name: string;
    employee: Employee;
    role: string;
    accessTierId: number;
    tabs: DealTabs;
}

export class DealTabs {
    header: AccessRights;
    context: AccessRights;
    experts: AccessRights;
    clients: AccessRights;
    allocation: AccessRights;
}

export class AccessRights {
    isVisible: boolean;
    isEditable:boolean;
    isNone: boolean;
}