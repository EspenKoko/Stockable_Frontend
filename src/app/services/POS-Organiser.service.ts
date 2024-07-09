import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { CartStock } from "../viewModels/cartVM.model";
import { Vat } from "../models/vat";
import { GeneralServices } from "./general-services";
import { Markup } from "../models/markup";
import { VatService } from "./vat.service";
import { MarkupService } from "./markup.service";

@Injectable({
    providedIn: 'root'
})
export class POSOrganiserService {
    static tmpOrdersCartName: string = "ls-cart-orders";
    public cartProductsNumberDS = new Subject<number>();
    private cartItemsOrderName: string = "Subs Order @ ";
    private markup!: Markup;
    private VAT!: Vat;

    constructor(private generalService: GeneralServices,
        private vatService: VatService,
        private markupService: MarkupService) {
        this.initializeProperties();
        this.getMarkup();
        this.getVat();
    }

    private getVat() {
        this.vatService.getVats().subscribe((result: Vat[]) => {
            //gets the most recent vat amount
            if (result.length > 0) {
                const mostRecentVat = result[result.length - 1];
                this.VAT = mostRecentVat;
            }
        })
    }

    private getMarkup() {
        this.markupService.getMarkups().subscribe((result: Markup[]) => {
            //gets the most recent markup amount
            if (result.length > 0) {
                const mostRecentMarkup = result[result.length - 1];
                this.markup = mostRecentMarkup;
            }
        })
    }

    private async initializeProperties() {
        try {
            this.VAT = await this.generalService.getVat();
            this.markup = await this.generalService.getMarkup();
        } catch (error) {
            console.error("Error initializing properties:", error);
        }
    }

    private notifyOnNewItemInCart() {
        this.cartProductsNumberDS.next(this.getNumberOfItemsInCart());
    }

    private getLocalStorageOrders(): any[] {
        let storedSubString = localStorage.getItem(POSOrganiserService.tmpOrdersCartName)
        let cartOrders = [];
        if (storedSubString) {
            cartOrders = JSON.parse(storedSubString)
        }
        return cartOrders;
    }

    getNumberOfItemsInCart(): number {
        return this.getLocalStorageOrders().length
    }

    getOrdersInCart(): CartStock[] {
        let localStorageOrders = this.getLocalStorageOrders();
        let cartOrders: CartStock[] = [];

        let subCounts = new Map<Number, Number>(); //temporary storage
        localStorageOrders.forEach(sub => {
            if (!subCounts.has(sub.stockId)) {
                let count = localStorageOrders.filter(currSub => currSub.stockId == sub.stockId).length;
                subCounts.set(sub.stockId, count)
                let price = sub.price.price; // Retrieve the price from the object
                let cartSub = new CartStock(sub, count, price); //, this.VAT, this.markup); 
                cartOrders.push(cartSub);
            }
        });
        return cartOrders;
    }

    getTotalCostOfOrdersInCart(): number {
        let totalCost = 0;

        let cartOrders = this.getOrdersInCart();
        cartOrders.forEach(cartOrders => {
            totalCost += (cartOrders.price * cartOrders.quantity) +
                (cartOrders.price * cartOrders.quantity * this.markup?.markupPercent) +
                (cartOrders.price * cartOrders.quantity * this.VAT?.vatPercent);
        });

        return totalCost;
    }

    getCartOrderName() {
        return this.cartItemsOrderName + Date.now();
    }

    private addOrderToCart(product: any) {
        let storedSubString = localStorage.getItem(POSOrganiserService.tmpOrdersCartName)

        let cartOrders = [];
        if (storedSubString) {
            cartOrders = JSON.parse(storedSubString)
        }
        cartOrders.push(product);
        localStorage.setItem(POSOrganiserService.tmpOrdersCartName, JSON.stringify(cartOrders))

        this.notifyOnNewItemInCart();
    }

    addProdFromCart(subscr: any) {
        this.addOrderToCart(subscr);
        this.notifyOnNewItemInCart();
    }

    removeProdFromCart(subscr: any) {
        let storedSubString = localStorage.getItem(POSOrganiserService.tmpOrdersCartName)

        let cartSubscriptions = [];
        if (storedSubString) {
            cartSubscriptions = JSON.parse(storedSubString)
        }
        for (var idx = 0; idx < cartSubscriptions.length; idx++) {
            if (cartSubscriptions[idx].stockId == subscr.stockId) {
                //console.log(idx, cartSubscriptions.length) // code breaks from this point on when reducing. intermittent problem
                cartSubscriptions.splice(idx, 1);
                break;
            }
        }

        localStorage.setItem(POSOrganiserService.tmpOrdersCartName, JSON.stringify(cartSubscriptions))

        this.notifyOnNewItemInCart();
    }

    clearCart() {
        localStorage.removeItem(POSOrganiserService.tmpOrdersCartName);
        this.notifyOnNewItemInCart();
    }
}