import { PurchaseOrderStatus } from "./purchaseOrderStatuses";
import { Repair } from "./repairs";

export interface PurchaseOrder {
  purchaseOrderId: number;
  purchaseOrderNumber: number; // needs to be discussed on how to generate
  purchaseOrderDate: Date
  repairTime: number;

  // fk
  repairId: number;
  repair: Repair;

  // fk
  purchaseOrderStatusId: number;
  purchaseOrderStatus: PurchaseOrderStatus;
}
