import { ClientOrder } from "./clientOrders";
import { Stock } from "./stocks";

export interface ClientOrderStock {
  //pk fk
  stockId: number;
  stock: Stock;

  //pk fk
  clientOrderId: number;
  clientOrder: ClientOrder;

  qty: number;
}
