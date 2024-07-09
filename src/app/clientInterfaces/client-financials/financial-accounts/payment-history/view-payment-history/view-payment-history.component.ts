import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientOrderStock } from 'src/app/models/clientOrderStock';
import { ClientOrder } from 'src/app/models/clientOrders';
import { Markup } from 'src/app/models/markup';
import { Price } from 'src/app/models/prices';
import { Vat } from 'src/app/models/vat';
import { ClientOrderService } from 'src/app/services/client-order.service';
import { ClientOrderStockService } from 'src/app/services/client-stock-order.service';
import { GeneralServices } from 'src/app/services/general-services';
import { PriceService } from 'src/app/services/price.service';

@Component({
  selector: 'app-view-payment-history',
  templateUrl: './view-payment-history.component.html',
  styleUrls: ['./view-payment-history.component.scss']
})
export class ViewPaymentHistoryComponent implements OnInit{
  clientOrder: ClientOrder | undefined;
  data: any[] = [];
  VAT!: Vat;
  markup!: Markup;
  VATAmount: any;
  TotalExVat: any;

  constructor(private clientOrderService: ClientOrderService,
    private cosService: ClientOrderStockService,
    private generalService: GeneralServices,
    private priceService: PriceService,
    private route: ActivatedRoute,
    private router: Router) {
    this.clientOrderService.getClientOrder(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.clientOrder = result;
    })

    this.initializeProperties();
  }
  async ngOnInit(): Promise<void> {
    this.markup = await this.generalService.getMarkup()
    this.VAT = await this.generalService.getVat()
    this.getClientStockOrder()
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

  getClientStockOrder() {
    this.cosService.getClientOrderStocks().subscribe((result: ClientOrderStock[]) => {
      this.data = result.filter(x => x.clientOrderId == this.clientOrder?.clientOrderId);

      let totExVat: number = 0;
      let vatAmount: number = 0;

      //of type clientStockOrder
      this.data.forEach(invoice => {
        this.priceService.getPrices().subscribe((result: any) => {
          let stockPrices: any[] = result

          // Retrieve the prices with the same stock ID as the current stock
          const filteredPrices = stockPrices.filter(price => price.stockId === invoice.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          totExVat += (mostRecentPrice.price * invoice.qty) + ((mostRecentPrice.price * invoice.qty) * this.markup.markupPercent);
          vatAmount += totExVat * this.VAT.vatPercent;

          invoice.price = mostRecentPrice;
          this.TotalExVat = totExVat
          this.VATAmount = vatAmount;
        })
      })
    })
  }

  back() {
    return this.router.navigate(['payment-history'])
  }
}
