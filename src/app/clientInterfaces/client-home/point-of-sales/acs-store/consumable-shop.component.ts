import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { POSOrganiserService } from 'src/app/services/POS-Organiser.service';
import { Price } from 'src/app/models/prices';
import { StockService } from 'src/app/services/stock.service';
import { PriceService } from 'src/app/services/price.service';
import { Stock } from 'src/app/models/stocks';
import { forkJoin, map } from 'rxjs';
import { Markup } from 'src/app/models/markup';
import { GeneralServices } from 'src/app/services/general-services';
import { Vat } from 'src/app/models/vat';
declare var $: any;

@Component({
  selector: 'app-consumable-shop',
  templateUrl: './consumable-shop.component.html',
  styleUrls: ['./consumable-shop.component.scss']
})
export class ConsumableShopComponent implements OnInit {
  consumableStock: any[] = [];
  cartItems: number = 0;
  searchTerm!: string;
  isLoading: boolean = false;

  stock: any[] = [];
  stockList: any[] = [];
  markup!: Markup;
  VAT!: Vat;

  base64String: string = "data:image/webp;base64,"; //used to help display image

  constructor(private POSService: POSOrganiserService,
    private router: Router,
    private stockService: StockService,
    private priceService: PriceService,
    private generalService: GeneralServices,
    private snackBar: MatSnackBar) {
    this.initializeProperties()
    this.GetStocks();

    this.cartItems = POSService.getNumberOfItemsInCart();

    POSService.cartProductsNumberDS.subscribe(num => {
      this.cartItems = num;
    });
  }
  
  async ngOnInit(): Promise<void> {
    this.VAT = await this.generalService.getVat()
    this.markup = await this.generalService.getMarkup()
  }

  // for if ngOninit doesnt work
  private async initializeProperties() {
    try {
      this.isLoading = true;
      this.VAT = await this.generalService.getVat();
      this.markup = await this.generalService.getMarkup();
    } catch (error) {
      console.error("Error initializing properties:", error);
    }
  }

  addToCart(item: Stock) {
    this.POSService.addProdFromCart(item);
    this.showSnackbar('Item added to cart successfully!');
  }

  showSnackbar(message: string) {
    const snackBarRef = this.snackBar.open(message, 'View Cart', {
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'] // Optional custom CSS class for styling
    });

    snackBarRef.onAction().subscribe(() => {
      this.navigateToCart();
    });

    snackBarRef.afterDismissed().subscribe(() => {
      // Optional code to run after the snackbar is dismissed
    });
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  GetStocks() {
    this.stock = [];
    this.stockList = [];

    this.stockService.getStocks().subscribe((result: Stock[]) => {
      //check qty before displaying in store
      for (const stock of result) {
        if (stock.qtyOnHand > 0) {
          this.stockList.push(stock)
        }
      }

      // Shuffle the Stock array using the Fisher-Yates algorithm
      for (let i = this.stockList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.stockList[i], this.stockList[j]] = [this.stockList[j], this.stockList[i]];
      }

      this.stockList.forEach((stock: any) => {
        this.priceService.getPrices().subscribe((result: any) => {
          let stockPrices: any[] = result;

          //set image attribute
          // stock.image = this.base64String + stock.image;

          // Retrieve the prices with the same stock ID as the current stock
          const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          //set price in stock table
          stock.price = mostRecentPrice;
          if (stock.price) {
            this.stock.push(stock)
          }
        })
      })
      this.isLoading = false;
    })
  }

  getStock() {
    // this.isLoading = true;
    if (this.searchTerm === "") {
      this.stock = []; // Clear the stock array
      this.GetStocks();
      return; // Exit the function early when the searchTerm is empty
    }

    this.stockService.getStockByName(this.searchTerm).subscribe((result: any[]) => {
      this.stock = []; // Clear the stock array
      this.stockList = []; // Clear the stock array

      for (const stock of result) {
        if (stock.qtyOnHand > 0) {
          this.stock.push(stock);
        }
      }

      const observables = this.stock.map((stock: any) => {
        return this.priceService.getPrices().pipe(
          map((result: any) => {
            let stockPrices: any[] = result;
            // Retrieve the prices with the same stock ID as the current stock
            const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
            return filteredPrices[filteredPrices.length - 1];
          })
        );
      });

      forkJoin(observables).subscribe((prices: Price[]) => {
        for (let i = 0; i < prices.length; i++) {
          this.stock[i].price = prices[i];
        }
        // this.isLoading = false;
      });
    });
  }

  openNav() {
    const mySidenav = document.getElementById("mySidenav") as HTMLElement;
    const body = document.getElementById("stockItemContainer") as HTMLElement;

    mySidenav.style.width = "250px";
    body.style.marginLeft = "250px";
  }

  closeNav() {
    const mySidenav = document.getElementById("mySidenav") as HTMLElement;
    const body = document.getElementById("stockItemContainer") as HTMLElement;

    mySidenav.style.width = "0";
    body.style.marginLeft = "0";
  }

  filterNav(event: Event) {
    event.preventDefault();
    this.router.navigate(['filter'])
  }

  sortNav() {
    this.router.navigate(['sort'])
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
    return this.router.navigate(['client-dashboard']);
  }
}


@Component({
  selector: 'app-filter',
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss']
})
export class FilterComponent {

}


@Component({
  selector: 'app-sort',
  templateUrl: './sort.html',
  styleUrls: ['./sort.scss']
})
export class SortComponent {

}
