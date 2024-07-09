import { StockTake } from "./stockTake";
import { Stock } from "./stocks";

export interface StockTakeStock {
    qty: number; 

    //pk fk
    stockTakeId: number;
    stockTake: StockTake;

    //pk fk
    stockId: number;
    stock: Stock;
}