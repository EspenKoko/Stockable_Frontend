import { Stock } from "./stocks";

export interface Price {
    priceId: number;
    price: number;
    priceDate: Date;

    //fk
    stockId: number;
    stock: Stock;
}