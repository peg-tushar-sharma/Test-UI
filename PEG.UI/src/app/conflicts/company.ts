import { Employee } from "../shared/interfaces/Employee"
import { CompanyType } from "./CompanyType"

export class Company {
    companyId: number
    companyName: string
    companyType: CompanyType
    stageType: boolean
    notes: string
    dunsNumber: string
    submittedBy: Employee
    submittedDate: Date
    
}
