import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price } from 'src/app/models/prices';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { RepairStock } from 'src/app/models/repairStock';
import { Stock } from 'src/app/models/stocks';
import { Vat } from 'src/app/models/vat';
import { PriceService } from 'src/app/services/price.service';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairStockService } from 'src/app/services/repair-stock.service';

import { GeneralServices } from 'src/app/services/general-services';

@Component({
  selector: 'app-view-client-purchase-order',
  templateUrl: './view-client-purchase-order.component.html',
  styleUrls: ['./view-client-purchase-order.component.scss']
})
export class ViewClientPurchaseOrderComponent implements OnInit {
  data: any[] = [];
  PONumber: number = 0;
  VAT!: Vat;
  purchaseOrderId: number = 0;
  VATExclusiveTotal: number = 0;
  VATAmount: number = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralServices,
    private repairStockService: RepairStockService,
    private priceService: PriceService) {
    this.purchaseOrderId = +this.route.snapshot.params["id"];
    
    this.initializeProperties()
    this.getRepairStock()
  }
  async ngOnInit(): Promise<void> {
    this.VAT = await this.generalService.getVat()
  }
  // for if ngOninit doesnt work
  private async initializeProperties() {
    try {
      this.VAT = await this.generalService.getVat();
    } catch (error) {
      console.error("Error initializing properties:", error);
    }
  }

  getRepairStock() {
    this.repairStockService.getRepairStocks().subscribe((result: RepairStock[]) => {
      this.data = result.filter(x => x.purchaseOrderId == this.purchaseOrderId)

      this.data.forEach((stock: any) => {
        this.priceService.getPrices().subscribe((result: any) => {
          let stockPrices: any[] = result

          // Retrieve the prices with the same stock ID as the current stock
          const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          stock.price = mostRecentPrice;
          this.VATExclusiveTotal += mostRecentPrice?.price * stock.qty;
          this.VATAmount += mostRecentPrice?.price * stock.qty * this.VAT.vatPercent;
        })
      })
    })
  }

  back() {
    return this.router.navigate(['client-purchase-orders'])
  }
}
