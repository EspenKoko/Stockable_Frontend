import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price } from 'src/app/models/prices';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { RepairStock } from 'src/app/models/repairStock';
import { Vat } from 'src/app/models/vat';
import { PriceService } from 'src/app/services/price.service';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairStockService } from 'src/app/services/repair-stock.service';
import { GeneralServices } from 'src/app/services/general-services';
import { TechnicalServiceReport } from 'src/app/models/technicalServiceReports';
import { TechnicalServiceReportService } from 'src/app/services/technical-service-report';
import { AssignedTechnicianService } from 'src/app/services/assigned-technician.service';
import { AssignedTechnician } from 'src/app/models/assignedTechnician';

@Component({
  selector: 'app-view-technical-service-report',
  templateUrl: './view-technical-service-report.component.html',
  styleUrls: ['./view-technical-service-report.component.scss']
})
export class ViewTechnicalServiceReportComponent implements OnInit {
  data!: TechnicalServiceReport;
  repairData: any[] = [];

  PONumber: number = 0;
  VAT!: Vat;
  purchaseOrderId: number = 0;
  VATExclusiveTotal: number = 0;
  VATAmount: number = 0;
  technician: any;

  constructor(private tsrService: TechnicalServiceReportService,
    private generalService: GeneralServices,
    private repairStockService: RepairStockService,
    private priceService: PriceService,
    private assignedTechnicianService: AssignedTechnicianService,
    private router: Router,
    private route: ActivatedRoute) {
    this.initializeProperties()
  }

  async ngOnInit(): Promise<void> {
    this.tsrService.getTechnicalServiceReport(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.data = result;
    })

    this.VAT = await this.generalService.getVat()
    this.getRepairStock();
    this.getAssignedTechnician();
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
      this.repairData = result.filter(x => x.repairId == this.data.purchaseOrder.repairId)
      console.log(this.repairData)

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

  getAssignedTechnician() {
    this.assignedTechnicianService.getAssignedTechnicians().subscribe((result: AssignedTechnician[]) => {
      this.technician = result.find(x => x.errorLogId == this.data.purchaseOrder.repair.errorLogId);
    })
  }

  back() {
    return this.router.navigate(['tsr-report'])
  }
}
