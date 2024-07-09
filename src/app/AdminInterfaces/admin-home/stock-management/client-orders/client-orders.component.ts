import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientOrder } from 'src/app/models/clientOrders';
import { ClientOrderService } from 'src/app/services/client-order.service';

@Component({
  selector: 'app-client-orders',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.scss']
})
export class ClientOrdersComponent {
  data: ClientOrder[] = [];
  searchTerm: string = '';

  constructor(private clientOrderService: ClientOrderService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.getReceipts();
  }

  getReceipts() {
    this.clientOrderService.getClientOrders().subscribe((result: ClientOrder[]) => {
      this.data = result;
    })
  }

  getReceipt() {
    if(this.searchTerm.length > 0 && this.searchTerm !==''){
      this.clientOrderService.getClientOrders().subscribe((result: ClientOrder[]) => {
        this.data = result.filter(x => x.clientInvoice.clientInvoiceNumber.toLowerCase().includes(this.searchTerm.toLowerCase()));
      })
    }
    else{
      this.getReceipts();
    }
  }

  // sendOrder(clientOrder: ClientOrder) {
  //   clientOrder.clientOrderStatusId = 2;

  //   this.clientOrderService.editClientOrder(clientOrder.clientOrderId, clientOrder).subscribe({
  //     next: (result: any) => { },
  //     error: (response: HttpErrorResponse) => {
  //       if (response.status == 200) {
  //         this.getReceipts();
  //         this.snackBar.open("Order to " + clientOrder.clientUser.client.clientName + " has been sent.", 'X', { duration: 5000 })
  //       }
  //     }
  //   })
  // }

  back() {
    return this.router.navigate(['stock-management'])
  }
}
