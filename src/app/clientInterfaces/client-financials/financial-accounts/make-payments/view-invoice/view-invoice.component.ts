import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LabourRate } from 'src/app/models/labourRate';
import { Markup } from 'src/app/models/markup';
import { Price } from 'src/app/models/prices';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { Vat } from 'src/app/models/vat';
import { GeneralServices } from 'src/app/services/general-services';
import { PriceService } from 'src/app/services/price.service';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairStockService } from 'src/app/services/repair-stock.service';
import { RepairService } from 'src/app/services/repair.service';
import { MakePaymentsComponent } from '../make-payments.component';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent {
  data!: PurchaseOrder;
  repairStock: any[] = [];

  purchaseOrderId!: number;
  VATAmount: number = 0;
  TotalExVat: number = 0;

  VAT!: Vat;
  markup!: Markup;
  labourRate!: LabourRate;

  constructor(private purchaseOrderService: PurchaseOrderService,
    private repairStockService: RepairStockService,
    private repairService: RepairService,
    private generalService: GeneralServices,
    // public makePaymentService: MakePaymentsComponent,
    private priceService: PriceService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.initializeProperties()
    this.getPurchaseOrders()
  }

  async ngOnInit(): Promise<void> {
    this.VAT = await this.generalService.getVat()
    this.markup = await this.generalService.getMarkup()
    this.labourRate = await this.generalService.getLabourRate()
  }

  // for if ngOninit doesnt work
  private async initializeProperties() {
    try {
      this.labourRate = await this.generalService.getLabourRate()
      this.VAT = await this.generalService.getVat();
      this.markup = await this.generalService.getMarkup();
    } catch (error) {
      console.error("Error initializing properties:", error);
    }
  }

  getPurchaseOrders() {
    this.purchaseOrderService.getPurchaseOrder(+this.route.snapshot.params['id']).subscribe((pOrder: any) => {
      let PO_Data = pOrder;

      this.repairStockService.getRepairStocks().subscribe((result: any[]) => {

        //of type repair stock
        this.repairStock = result.filter(x => x.purchaseOrderId == pOrder.purchaseOrderId)

        let totExVat: number = 0;
        let vatAmount: number = 0;

        this.repairStock.forEach(repairs => {
          this.priceService.getPrices().subscribe((result: any) => {
            let stockPrices: any[] = result

            // Retrieve the prices with the same stock ID as the current stock
            const filteredPrices = stockPrices.filter(price => price.stockId === repairs.stockId);
            const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

            totExVat += (mostRecentPrice.price * repairs.qty) + ((mostRecentPrice.price * repairs.qty) * this.markup.markupPercent);
            vatAmount += totExVat * this.VAT.vatPercent;

            repairs.price = mostRecentPrice;
            this.TotalExVat = totExVat + (this.labourRate?.labourRate * pOrder.repairTime);
            this.VATAmount = vatAmount;
          })
        })
      });
      this.data = PO_Data;
    })
  }

  // makePayment() {
  //   this.data.repair.repairStatusId = 8;
  //   this.repairService.editRepair(this.data.repairId, this.data.repair).subscribe({
  //     next: (result: any) => { },
  //     error: (response: HttpErrorResponse) => {
  //       if (response.status == 200) {
  //         this.back().then((navigated: boolean) => {
  //           if (navigated) {
  //             this.snackBar.open(`Payment Successfully`, 'X', { duration: 5000 });
  //           }
  //         })
  //       }
  //       else {
  //         this.snackBar.open(response.error + " Please check connection", 'X', { duration: 5000 });
  //       }
  //     }
  //   })
  // }

  back() {
    return this.router.navigate(['make-payment']);
  }
}
