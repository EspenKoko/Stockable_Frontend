import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { Repair } from 'src/app/models/repairs';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairService } from 'src/app/services/repair.service';


@Component({
  selector: 'app-client-purchase-order',
  templateUrl: './client-purchase-order.component.html',
  styleUrls: ['./client-purchase-order.component.scss']
})
export class ClientPurchaseOrderComponent {
  data: PurchaseOrder[] = [];
  searchTerm!: string;
  Token: any;

  // purchaseOrderId: number = 0;
  // VATExclusiveTotal: number = 0;
  // VATAmount: number = 0;
  // VAT: number = 0;
  // repairStockData: any[] = [];

  constructor(private service: PurchaseOrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private repairService: RepairService,
    // private repairStockService: RepairStockService,
    // private priceService: PriceService,
    // private vatService: VatService,
    private errorlogService: ErrorLogService,
    private printerService: AssignedPrinterService) {

    this.GetPurchaseOrder()

    if (localStorage.getItem("Token")) {
      this.Token = JSON.parse(localStorage.getItem("Token")!)
    }
  }

  GetPurchaseOrder() {
    this.service.getPurchaseOrders().subscribe((result: PurchaseOrder[]) => {
      this.data = result.filter(x => x.repair.errorLog.clientUser.userId == this.Token.id)
    })
  }

  //get repair whith the relevent errorlog we are currently working on
  getRepair(purchaseOrder: PurchaseOrder): Observable<Repair> {
    return this.repairService.getRepairs().pipe(
      map((result: Repair[]) => {
        let repairs = result.filter(x => x.errorLogId === purchaseOrder.repair.errorLogId);
        return repairs[0];
      })
    );
  }

  async acceptPurchaseOrder(purchaseOrder: PurchaseOrder) {
    const repair = await firstValueFrom(this.getRepair(purchaseOrder))

    purchaseOrder.purchaseOrderStatusId = 2;
    this.service.editPurchaseOrder(purchaseOrder.purchaseOrderId, purchaseOrder).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {

          //update repair status
          repair.repairStatusId = 5;
          this.repairService.editRepair(repair.repairId, repair).subscribe({
            next: (result) => { },
            error: (response: HttpErrorResponse) => {
              if (response.status == 200) {
                // Find the index of the updated purchase order in the data array
                const index = this.data.findIndex(item => item.purchaseOrderId === purchaseOrder.purchaseOrderId);
                if (index !== -1) {
                  // Update the data array with the modified purchase order
                  this.data[index] = purchaseOrder;
                }
                this.GetPurchaseOrder();
                this.snackBar.open("Purchase Order Accepted", 'X', { duration: 5000 });
              }
              else {
                this.snackBar.open(`Diagnostic Submition, check connection`, 'X', { duration: 5000 });
              }
            }
          })
        }
        else {
          this.snackBar.open("Failed the process action, please check connection", 'X', { duration: 5000 });
        }
      }
    });
  }

  async declinePurchaseOrder(purchaseOrder: PurchaseOrder) {
    const repair = await firstValueFrom(this.getRepair(purchaseOrder))

    purchaseOrder.purchaseOrderStatusId = 3;
    this.service.editPurchaseOrder(purchaseOrder.purchaseOrderId, purchaseOrder).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {

          //update repair status to UTR
          repair.repairStatusId = 4;
          this.repairService.editRepair(repair.repairId, repair).subscribe({
            next: (result) => { },
            error: (response: HttpErrorResponse) => {

              //update error log status to UTR
              repair.errorLog.errorLogStatusId = 7
              this.errorlogService.editErrorLog(repair.errorLogId, repair.errorLog).subscribe({
                next: (result) => { },
                error: (response: HttpErrorResponse) => {

                  //update assigned printer status status to UTR
                  repair.errorLog.assignedPrinter.printerStatusId = 5
                  this.printerService.editAssignedPrinter(repair.errorLog.assignedPrinterId, repair.errorLog.assignedPrinter).subscribe({
                    next: (result) => { },
                    error: (response: HttpErrorResponse) => {

                      if (response.status == 200) {
                        // Find the index of the updated purchase order in the data array
                        const index = this.data.findIndex(item => item.purchaseOrderId === purchaseOrder.purchaseOrderId);
                        if (index !== -1) {
                          // Update the data array with the modified purchase order
                          this.data[index] = purchaseOrder;
                        }
                        this.GetPurchaseOrder();
                        this.snackBar.open("Purchase Order Declined", 'X', { duration: 5000 });
                      }
                      else {
                        this.snackBar.open(`Diagnostic Submittion, check connection`, 'X', { duration: 5000 });
                      }
                    }
                  })
                }
              })
            }
          })
        }
        else {
          this.snackBar.open("Failed the process action, please check connection", 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['client-financials'])
  }
}
