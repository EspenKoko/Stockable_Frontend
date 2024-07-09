import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientOrderService } from 'src/app/services/client-order.service';
import { ClientOrderStockService } from 'src/app/services/client-stock-order.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-view-client-order',
  templateUrl: './view-client-order.component.html',
  styleUrls: ['./view-client-order.component.scss']
})
export class ViewClientOrderComponent {

  orderdata: any;
  clientOrder: any;
  orderstock: any;

  constructor(
    private router: Router,
    private clientOrderService : ClientOrderService,
    private clientOrderStockService : ClientOrderStockService,
    private snackBar: MatSnackBar)
  {
    this.GetClientOrders();
  }

  GetClientOrders() {
    this.clientOrderStockService.getClientOrderStocks().subscribe((result: any[]) => {     
      const uniqueOrderMap = new Map();
  
      result.forEach(order => {
        const clientOrderId = order.clientOrderId;
        if (!uniqueOrderMap.has(clientOrderId)) {
          // Create an object for the unique client order
          const uniqueOrder = { ...order, stocks: [] };
          
          // Add the current stock to the stocks array
          uniqueOrder.stocks.push(order.stock);
  
          // Store the unique client order in the map
          uniqueOrderMap.set(clientOrderId, uniqueOrder);
        } else {
          // If the client order already exists, add the current stock to its stocks array
          const existingOrder = uniqueOrderMap.get(clientOrderId);
          existingOrder.stocks.push(order.stock);
        }
      });
  
      // Convert the map values to an array
      const uniqueOrders = Array.from(uniqueOrderMap.values());
  
      // Filter unique orders with a clientOrderStatusId of 1
      this.orderdata = uniqueOrders.filter(order => order.clientOrder.clientOrderStatusId === 1);
      console.log(this.orderdata);
    });
  }

  sendOrder(clientOrderId: number) {
    this.clientOrderService.getClientOrder(clientOrderId).subscribe((result: any) => {
      this.clientOrderStockService.getClientOrderStock(clientOrderId).subscribe((orderStockResult: any) => {
        this.orderstock = orderStockResult;
        console.log(this.orderstock);
  
        // Check if any of the stock items are of the "Printer" category
        const hasPrinterStock = this.orderstock.some((stock: any) => stock.stock.stockType.stockCategory.stockCategoryName === 'Printer');
  
        this.clientOrder = result;
        this.clientOrder.clientOrderStatusId = 2;
  
        this.clientOrderService.editClientOrder(clientOrderId, this.clientOrder).subscribe({
          next: (result) => {
            // Handle successful response here, if needed
          },
          error: (response: HttpErrorResponse) => {
            if (response.status == 200) {
             if(hasPrinterStock == true){
              this.router.navigate(['/assign-printer-stock', clientOrderId])
             }
             else{
              this.snackBar.open(`Order Sent`, 'X', { duration: 5000 });
              location.reload();
             }
            } else {
              this.snackBar.open(`Failed to send Order`, 'X', { duration: 5000 });
            }
          }
        });
      });
    });
  }

   

  back() {
    return this.router.navigate(['/inventory-clerk-dashboard'])
  }
}