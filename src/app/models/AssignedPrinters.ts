import { Client } from "./clients"
import { PrinterStatus } from "./printerStatuses";

export interface AssignedPrinter {
  assignedPrinterId: number;
  serialNumber: string;
  printerModel: string;

  //fk
  clientId: number;
  client: Client;

  //fk
  printerStatusId: number;
  printerStatus: PrinterStatus;
}