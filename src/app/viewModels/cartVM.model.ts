import { Markup } from "../models/markup";
import { Stock } from "../models/stocks";
import { Vat } from "../models/vat";

export class CartStock {
    stock: Stock;
    quantity: number = 1;
    price: number = 0;
    totalCost: number = 0;

    constructor(item: Stock, quant: number, price: number) { //, vat: Vat, markup:Markup) {
        this.stock = item;
        this.quantity = quant;
        this.price = price
        // + (price * vat?.vatPercent)
        // + (price * markup.markupPercent);
        this.totalCost = quant * price
        // + (quant * price * vat?.vatPercent)
        // + (quant * price * markup?.markupPercent);
    }
    
    increment() {
        this.quantity +=1
    }
}