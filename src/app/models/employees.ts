import { EmployeeType } from "./employeeTypes";
import { User } from "./users";

export interface Employee {
    employeeId: number;
    empHireDate: Date;

    employeeTypeId: number
    employeeType: EmployeeType;

    userId: number;
    user: User;
}