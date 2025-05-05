import { Field  } from '../../shared/interfaces/field';

export interface RoleFieldMapping {
    roleFieldMappingId: number,    
    securityRoleId:number,
    isVisible: boolean,
    isEditable: boolean,
    field: Field
   }