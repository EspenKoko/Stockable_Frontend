import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from 'src/app/models/stocks';
import { POSOrganiserService } from 'src/app/services/POS-Organiser.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class CancelComponent implements OnInit {
  ordersInCart: any;
  navigated: boolean = false;

  constructor(private cartManager: POSOrganiserService,
    private ATService: AuditTrailService,
    private stockService: StockService,
    private router: Router) {
    this.ordersInCart = this.cartManager.getOrdersInCart();
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromRepairPaymentComponent']) {
      // Navigated from the MakePaymentComponent
      console.log('Navigated from fromRepairPaymentComponent');

      this.navigated = true;
      this.ATService.trackActivity(`Failed repair payment`);
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      this.ATService.trackActivity(`Failed store payment`);

    }
  }

  ngOnInit(): void {
    // this.updateStockMinusQuantity()
  }

  // Function to update(increase) stock quantity in the database
  updateStockMinusQuantity() {
    let stockId: number = 0;
    let newQtyOnHand: number = 0;
    let Stock: Stock;

    for (const order of this.ordersInCart) {
      stockId = order.stock.stockId;
      newQtyOnHand = order.stock.qtyOnHand + order.quantity;
      // order.qtyOnHand = newQtyOnHand
      Stock = {
        qtyOnHand: newQtyOnHand,
        stockId: stockId,
        stockName: order.stock.stockName,
        stockDescription: order.stock.stockDescription,
        minStockThreshold: order.stock.minStockThreshold,
        maxStockThreshold: order.stock.maxStockThreshold,
        stockTypeId: order.stock.stockTypeId,
        stockType: order.stock.stockType,
      };

      this.stockService.editStock(stockId, Stock).subscribe({
        next: (result: any) => {
          console.log(result)
        },
        error: (response: HttpErrorResponse) => {
          console.log(response)
          if (response.status == 200) {
            console.log("Stock Reverted")
          }
          else {
            console.error("Stock Not Reverted")
          }
        }
      });
    }
  }

  back(){
    return this.router.navigate(['make-payment']);
  }
}
