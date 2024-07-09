import { Employee } from "./employees"

export interface StockTake {
    stockTakeId: number;
    stockTakeDate: Date;

    //fk
    employeeId: number;
    employee: Employee;
}