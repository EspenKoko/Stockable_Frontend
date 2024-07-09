import { Stock } from "../models/stocks";

export class StockReorder {
    stock: Stock;
    stockQuantityToBe: number = 0
    stockReoderQuantity: number = 0;
    stockReoderTotal: number = 0;
    price: number = 0

    // constructor(stock: Stock, price: number, confirmation:boolean) {
        constructor(stock: Stock, price: number) {
        this.stock = stock
        this.stockQuantityToBe = stock.maxStockThreshold
        this.stockReoderQuantity = this.stockQuantityToBe - stock.qtyOnHand;
        this.price = price
        this.stockReoderTotal = this.stockReoderQuantity * price
    }

    getTotal(): number {
        return this.stockReoderQuantity * this.price;
    }
}