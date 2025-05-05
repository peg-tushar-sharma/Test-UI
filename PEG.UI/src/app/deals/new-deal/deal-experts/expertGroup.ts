import { Expert } from './expert';

export class expertGroup {
    dealId: number;
    expertGroupId: any;
    expertGroupName: string;
    expertGroupNote: string = '';
    expertPoolColor: any = null;
    expertGroupCategory: any = null;
    experts: Expert[];
    filterState: number;
    lastUpdatedExpert?: any;
    lastUpdated?: any;
}