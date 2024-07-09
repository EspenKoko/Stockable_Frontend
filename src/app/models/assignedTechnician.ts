import { Employee } from "./employees";
import { ErrorLog } from "./errorLogs";

export interface AssignedTechnician {
  //pk fk
  errorLogId: number;
  errorLog: ErrorLog;

  //pk fk
  employeeId: number;
  employee: Employee;

  isAssigned: boolean;
}