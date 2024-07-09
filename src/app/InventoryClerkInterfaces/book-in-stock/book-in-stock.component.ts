import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-book-in-stock',
  templateUrl: './book-in-stock.component.html',
  styleUrls: ['./book-in-stock.component.scss']
})
export class BookInStockComponent {
  stockData: any[] = [];
  stockId: number = 0;

  stockForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private stockService: StockService,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService
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
        // Update the quantity on hand property
        selectedStockItem.qtyOnHand = selectedStockItem.qtyOnHand + qtyOnHand;

        this.stockService.editStock(selectedStockItem.stockId, selectedStockItem).subscribe({
          next: (result) => {
            // Handle success
          },
          error: (response: HttpErrorResponse) => {
            if (response.status == 200) {
              // save audit trail
              this.ATService.trackActivity("Stock booked in");

              this.getStockItems();
              this.stockForm.reset();
              this.snackBar.open(`Stock Booked In`, 'X', { duration: 5000 });
            } else {
              // save audit trail
              this.ATService.trackActivity("Stock book in failed");

              this.snackBar.open(`Failed to book in stock`, 'X', { duration: 5000 });
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
