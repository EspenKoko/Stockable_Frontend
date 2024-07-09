import { Price } from "../models/prices"
import { StockSupplierOrder } from "../models/stockSupplierOrder"

export class StockSupplierOrderVM {
    spOrder: StockSupplierOrder
    price: Price
    
    constructor(spo: StockSupplierOrder, price: Price) {
        this.spOrder = spo;
        this.price = price;
    }
}