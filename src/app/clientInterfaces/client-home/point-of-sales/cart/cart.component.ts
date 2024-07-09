import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { POSOrganiserService } from 'src/app/services/POS-Organiser.service';
import { CartStock } from 'src/app/viewModels/cartVM.model';
import { Stock } from 'src/app/models/stocks';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralServices } from 'src/app/services/general-services';
import { Vat } from 'src/app/models/vat';
import { Markup } from 'src/app/models/markup';
declare var $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  ordersInCart: CartStock[] = [];
  totalCostOfOrdersInCart: number = 0;
  VAT!: Vat;
  markup!: Markup;

  constructor(public cartManager: POSOrganiserService,
    private generalService: GeneralServices,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.initializeProperties();
    this.loadSubscriptions();

    cartManager.cartProductsNumberDS.subscribe(num => {
      this.loadSubscriptions();
    });
  }

  async ngOnInit(): Promise<void> {
    this.VAT = await this.generalService.getVat();
    this.markup = await this.generalService.getMarkup();
  }

  // for if ngOninit doesnt work
  private async initializeProperties() {
    try {
      this.VAT = await this.generalService.getVat();
      this.markup = await this.generalService.getMarkup();
    } catch (error) {
      console.error("Error initializing properties:", error);
    }
  }

  loadSubscriptions() {
    this.ordersInCart = this.cartManager.getOrdersInCart();
    this.totalCostOfOrdersInCart = this.cartManager.getTotalCostOfOrdersInCart();
  }

  increaseProdCount(order: any) {
    for (var idx = 0; idx < this.ordersInCart.length; idx++) {
      if (this.ordersInCart[idx].stock.stockId == order.stockId) {
        this.cartManager.addProdFromCart(this.ordersInCart[idx].stock);
      }
    }
  }

  reduceProdCount(order: any) {
    for (var idx = 0; idx < this.ordersInCart.length; idx++) {
      if (this.ordersInCart[idx].stock.stockId == order.stockId) {
        this.cartManager.removeProdFromCart(this.ordersInCart[idx].stock);
      }
    }
  }

  // Function to be called when clicking the "Checkout" button
  navigateToCheckout() {
    let check: any[] = [];
    let stock: Stock[] = [];

    if (this.ordersInCart && this.ordersInCart.length != 0) {
      for (const order of this.ordersInCart) {
        if (order.quantity > order.stock.qtyOnHand) {
          check.push(false);
          stock.push(order.stock)
          break
        }
        else {
          check.push(true);
        }
      }

      // Check if all boolean attributes in the form are true based on all cart items having sufficiant quantity to be purchased
      const allTrue = check.every(value => value === true);

      if (allTrue) {
        this.router.navigate(['checkout'])
      } else {
        this.snackBar.open("Not enough stock on hand for item " + stock[0].stockName + ". Current stock on hand is: " + stock[0].qtyOnHand, 'X', { duration: 10000 });
      }
    } else {
      this.snackBar.open("Please add items to cart before checking out", 'X', { duration: 5000 });
    }
  }

  @ViewChild('toolTip') tooltip!: ElementRef;

  openTooltip() {
    if (this.tooltip && this.tooltip.nativeElement) {
      const tooltipElement = this.tooltip.nativeElement;
      if (tooltipElement) {
        $(tooltipElement).tooltip('show');
        setTimeout(() => {
          $(tooltipElement).tooltip('hide');
        }, 3000); // Close the tooltip after 3 seconds
      }
    }
  }

  back() {
    this.router.navigate(['acs-store']);
  }
}
