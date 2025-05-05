import { Employee } from "../shared/interfaces/Employee";
import { industry } from "../shared/interfaces/industry";
import { Region } from "../shared/interfaces/region";

export class SecurityUserDetails{
    employee :Employee
    lastUpdateBy: string
    securityRoleId: number;
    note:string;
    expirationDate:string;
    industries:industry[];
    regions:Region[];
  
}

