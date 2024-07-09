import { ClientOrderStock } from "../models/clientOrderStock";
import { Price } from "../models/prices"

export class clientStockOrderVM {
    cosData: ClientOrderStock
    price: Price
    
    constructor(cos: ClientOrderStock, price: Price) {
        this.cosData = cos;
        this.price = price;
    }
}