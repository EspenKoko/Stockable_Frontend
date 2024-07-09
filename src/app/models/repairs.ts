import { RepairStatus } from "./RepairStatus";
import { Employee } from "./employees";
import { ErrorLog } from "./errorLogs";

export interface Repair {
  repairId: number;

  //fk
  errorLogId: number;
  errorLog: ErrorLog;

  //fk
  repairStatusId: number;
  repairStatus: RepairStatus;

  //fk
  employeeId: number;
  employee: Employee;
}
