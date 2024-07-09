import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-supplier-order',
  templateUrl: './view-supplier-order.component.html',
  styleUrls: ['./view-supplier-order.component.scss']
})
export class ViewSupplierOrderComponent {

  orderdata: any;
  supplierOrder: any;

  constructor(
    private router: Router,
    private supplierOrderService: SupplierOrderService,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetSupplierOrders();
  }

  GetSupplierOrders() {
    this.supplierOrderService.getSupplierOrders().subscribe((result: any[]) => {

      const uniqueOrderMap = new Map();

      result.forEach(order => {
        const supplierOrderId = order.supplierOrderId;
        if (!uniqueOrderMap.has(supplierOrderId)) {
          uniqueOrderMap.set(supplierOrderId, order);
        }
      });
      const uniqueOrders = Array.from(uniqueOrderMap.values());
      this.orderdata = uniqueOrders.filter(orders => orders.supplierOrderStatusId === 2);
      console.log(this.orderdata);
    });
  }

  receiveOrder(supplierOrderId: number) {
    console.log(supplierOrderId)

    this.supplierOrderService.getSupplierOrder(supplierOrderId).subscribe((result: any) => {
      this.supplierOrder = result;

      this.supplierOrder.supplierOrderStatusId = 3

      this.supplierOrderService.editSupplierOrder(supplierOrderId, this.supplierOrder).subscribe({
        next: (result) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            // save audit trail
            this.ATService.trackActivity(`Supplier order recieved, id: ${supplierOrderId}`);

            this.snackBar.open(`Order Received`, 'X', { duration: 5000 });
            location.reload();
          } else {
            // save audit trail
            this.ATService.trackActivity(`Failed to recieved supplier order, id: ${supplierOrderId}`);

            this.snackBar.open(`Failed to receive Order`, 'X', { duration: 5000 });
          }
        }
      });
    });
  }

  back() {
    return this.router.navigate(['/inventory-clerk-dashboard'])
  }
}