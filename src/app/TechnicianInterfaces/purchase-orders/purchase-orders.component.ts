import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss']
})
export class PurchaseOrdersComponent {
  data: PurchaseOrder[] = [];
  searchTerm!: string;

  constructor(private service: PurchaseOrderService,
    private repairService: RepairService,
    private router: Router,
    private snackBar: MatSnackBar) {

    this.GetPurchaseOrder()
  }

  GetPurchaseOrder() {
    this.service.getPurchaseOrders().subscribe((result: PurchaseOrder[]) => {
      this.data = result;
    })
  }

  completeRepair(purchaseOrder: PurchaseOrder) {
    purchaseOrder.repair.repairStatusId = 7;
    this.repairService.editRepair(purchaseOrder.repairId, purchaseOrder.repair).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.router.navigate(['technical-service-report/' + purchaseOrder.purchaseOrderId]).then((navigated: boolean) => {
            // this.GetPurchaseOrder();
            this.snackBar.open("Repair Completed. Client Notified", 'X', { duration: 5000 });
          })
        }
        else {
          this.snackBar.open("Failed to process request, check connection", 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['technician-dashboard'])
  }
}
