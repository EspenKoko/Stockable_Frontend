import { PurchaseOrder } from "./purchaseOrder";
import { Repair } from "./repairs";
import { Stock } from "./stocks";

export interface RepairStock {
    //pk fk
    stockId: number;
    stock: Stock;

    //pk fk
    repairId: number;
    repair: Repair;

    //pk fk
    purchaseOrderId: number;
    purchaseOrder: PurchaseOrder;

    qty: number;
}
