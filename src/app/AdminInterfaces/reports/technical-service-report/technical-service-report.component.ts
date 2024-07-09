import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Price } from 'src/app/models/prices';
import { RepairStock } from 'src/app/models/repairStock';
import { TechnicalServiceReport } from 'src/app/models/technicalServiceReports';
import { Vat } from 'src/app/models/vat';
import { GeneralServices } from 'src/app/services/general-services';
import { PriceService } from 'src/app/services/price.service';
import { RepairStockService } from 'src/app/services/repair-stock.service';
import { TechnicalServiceReportService } from 'src/app/services/technical-service-report';

@Component({
  selector: 'app-technical-service-report',
  templateUrl: './technical-service-report.component.html',
  styleUrls: ['./technical-service-report.component.scss']
})
export class TechnicalServiceReportingComponent implements OnInit {
  title = "TSR";

  data: TechnicalServiceReport[] = []
  repairData: any[] = [];
  searchTerm!: string;
  searchError!: string;

  PONumber: number = 0;
  VAT!: Vat;
  purchaseOrderId: number = 0;
  VATExclusiveTotal: number = 0;
  VATAmount: number = 0;

  constructor(private router: Router,
    private tsrService: TechnicalServiceReportService,
    private generalService: GeneralServices,
    private repairStockService: RepairStockService,
    private priceService: PriceService) {
    this.initializeProperties()
    this.getTSRs();
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

  getTSRs() {
    this.tsrService.getTechnicalServiceReports().subscribe((result: any) => {
      this.data = result;
    })
  }

  getTSR() {
    this.tsrService.getTechnicalServiceReports().subscribe((result: TechnicalServiceReport[]) => {
      this.data = result.filter(x => x.purchaseOrder.purchaseOrderNumber.toString() == this.searchTerm);
    })
  }

  moreInfo(data: TechnicalServiceReport) {
    this.repairStockService.getRepairStocks().subscribe((result: RepairStock[]) => {
      this.repairData = result.filter(x => x.purchaseOrderId == data.purchaseOrderId)

      this.repairData.forEach((stock: any) => {
        this.priceService.getPrices().subscribe((result: any) => {
          let stockPrices: any[] = result;

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
    return this.router.navigate(['view-reports'])
  }
}
