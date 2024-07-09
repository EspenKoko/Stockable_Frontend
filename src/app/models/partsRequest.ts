import { PurchaseOrder } from "./purchaseOrder";
import { Stock } from "./stocks";

export interface PartsRequest {
    //pk fk
    stockId: number;
    stock: Stock;

    //pk fk
    purchaseOrderId: number;
    purchaseOrder: PurchaseOrder;

    qty: number;
}
