import { AssignedPrinter } from "./AssignedPrinters";
import { ClientUser } from "./clientUsers";
import { ErrorCode } from "./errorCodes";
import { ErrorLogStatus } from "./errorLogStatuses";

export interface ErrorLog {
  errorLogId: number;
  errorLogDate: Date;
  errorLogDescription: string;

  //fk
  errorLogStatusId: number;
  errorLogStatus: ErrorLogStatus;

  //fk
  clientUserId: number;
  clientUser: ClientUser;

  //fk
  assignedPrinterId: number;
  assignedPrinter: AssignedPrinter;

  //fk
  errorCodeId: number;
  errorCode: ErrorCode;
}
