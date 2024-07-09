import { StockType } from "./stockTypes"

export interface Stock {
    stockId: number;
    stockName: string;
    stockDescription: string;
    qtyOnHand: number;
    minStockThreshold: number;
    maxStockThreshold: number;

    //fk
    stockTypeId: number;
    stockType: StockType;
}