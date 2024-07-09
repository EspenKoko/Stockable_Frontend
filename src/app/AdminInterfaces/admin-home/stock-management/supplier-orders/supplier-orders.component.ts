import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SupplierOrder } from 'src/app/models/supplierOrders';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';

@Component({
  selector: 'app-supplier-orders',
  templateUrl: './supplier-orders.component.html',
  styleUrls: ['./supplier-orders.component.scss']
})
export class SupplierOrdersComponent implements OnInit {
  data: SupplierOrder[] = [];
  searchTerm: string = '';

  constructor(private supplierOrderService: SupplierOrderService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders() {
    this.supplierOrderService.getSupplierOrders().subscribe((result: SupplierOrder[]) => {
      this.data = result.filter(x => x.supplierOrderStatusId == 2);
    })
  }

  // getOrder() {
  //   if(this.searchTerm.length > 0 && this.searchTerm !==''){
  //     this.supplierOrderService.getSupplierOrders().subscribe((result: SupplierOrder[]) => {
  //       this.data = result.filter(x => x.orderInvoice.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()));
  //     })
  //   }
  //   else{
  //     this.getOrders();
  //   }
  // }

  sendOrder(SupplierOrder: SupplierOrder) {
    SupplierOrder.supplierOrderStatusId = 2;

    this.supplierOrderService.editSupplierOrder(SupplierOrder.supplierOrderId, SupplierOrder).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.getOrders()
          this.snackBar.open("Order has been recived", 'X', { duration: 5000 })
        }
      }
    })
  }

  back() {
    return this.router.navigate(['stock-management'])
  }
}
