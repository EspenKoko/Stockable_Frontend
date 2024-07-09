import { Repair } from "./repairs";

export interface Diagnostics {
  diagnosticsId: number;
  diagnosticComment: string;
  rollerCheck: boolean;
  lcdScreenCheck: boolean;
  powerSupplyCheck: boolean;
  motherboardCheck: boolean;
  hopperCheck: boolean;
  beltCheck: boolean
  ethernetPortCheck: boolean;

  //fk
  repairId: number;
  repair: Repair;
}
