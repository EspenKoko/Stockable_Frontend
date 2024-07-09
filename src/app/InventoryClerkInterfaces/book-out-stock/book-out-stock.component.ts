import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-book-out-stock',
  templateUrl: './book-out-stock.component.html',
  styleUrls: ['./book-out-stock.component.scss']
})
export class BookOutStockComponent {
  stockData: any[] = [];
  stockId: number = 0;

  stockForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private stockService: StockService,
    private snackBar: MatSnackBar,
    private ATService:AuditTrailService
  ) {

    this.getStockItems();

    this.stockForm = this.fb.group({
      stockId: [null, Validators.required],
      qtyOnHand: [null, Validators.required]
    })
  }

  getStockItems() {
    this.stockService.getStocks().subscribe((result: any[]) => {
      this.stockData = result;
    });
  }

  submitBooking() {
    const selectedStockId = this.stockForm.get('stockId')?.value;
    const qtyOnHand = this.stockForm.get('qtyOnHand')?.value;

    if (selectedStockId && qtyOnHand !== null && !isNaN(qtyOnHand)) {
      const idAsNumber = parseInt(selectedStockId);
      const selectedStockItem = this.stockData.find((stock) => stock.stockId === idAsNumber);

      if (selectedStockItem) {

        if (selectedStockItem.qtyOnHand - qtyOnHand < 0) {
          this.snackBar.open(`Not enough stock! Please order more stock. Only ` + selectedStockItem.qtyOnHand + ` left`, 'X', { duration: 5000 });
          return; // Stop further processing
        }

        // Update the quantity on hand property
        selectedStockItem.qtyOnHand = selectedStockItem.qtyOnHand - qtyOnHand;

        this.stockService.editStock(selectedStockItem.stockId, selectedStockItem).subscribe({
          next: (result) => {
            // Handle success
          },
          error: (response: HttpErrorResponse) => {
            if (response.status == 200) {
              // save audit trail
              this.ATService.trackActivity(`Stock booked out`);
              this.getStockItems();
              this.stockForm.reset();
              this.snackBar.open(`Stock Booked Out`, 'X', { duration: 5000 });
            } else {
              // save audit trail
              this.ATService.trackActivity(`Stock book out failed`);

              this.snackBar.open(`Failed to book out stock`, 'X', { duration: 5000 });
            }
          }
        })
      }
    } else {
      this.snackBar.open(`Please fill in all the fields`, 'X', { duration: 5000 });
      console.error('Invalid input for stockId or qtyOnHand');
    }
  }



  back() {
    return this.router.navigate(['inventory-clerk-dashboard']);
  }
}
