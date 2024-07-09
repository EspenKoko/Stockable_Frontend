import { Stock } from "./stocks";
import { SupplierOrder } from "./supplierOrders";

export interface StockSupplierOrder {
    //pk fk
    stockId: number;
    stock: Stock;

    //pf fk
    supplierOrderId: number;
    supplierOrder: SupplierOrder;

    qty: number;
}
