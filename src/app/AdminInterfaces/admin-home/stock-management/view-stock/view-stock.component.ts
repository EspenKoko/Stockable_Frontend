import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { Stock } from 'src/app/models/stocks';
import { PriceService } from 'src/app/services/price.service';
import { Price } from 'src/app/models/prices';

@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
  styleUrls: ['./view-stock.component.scss']
})
export class ViewStockComponent implements OnInit {
  title = "Stock";

  data: any[] = [];
  searchTerm!: string;
  searchError!: string;

  constructor(private service: StockService, private router: Router, private route: ActivatedRoute,
    private priceService: PriceService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.GetStocks();
  }

  getColorStyle(qty: number, minThreshold: number, maxThreshold: number) {
    if (qty < minThreshold) {
      //red
      return { 'background-color': 'rgba(255, 0, 0, 0.6)', color: 'white' };
    } else if (qty > maxThreshold) {
      //green
      return { 'background-color': 'rgba(0, 128, 0, 0.6)', color: 'white' };
    } else {
      //orange
      return { 'background-color': 'rgba(255, 165, 0, 0.6)', color: 'white' };
    }
  }

  GetStocks() {
    this.service.getStocks().subscribe((result: any[]) => {
      // stores stock data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));

      this.data.forEach((stock: any) => {
        this.priceService.getPrices().subscribe((result: any) => {
          let stockPrices: any[] = result

          // Retrieve the prices with the same stock ID as the current stock
          const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          stock.price = mostRecentPrice;
        })
      })
    })
  }

  GetStock() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getStocks().subscribe((result: any[]) => {
        this.data = result.filter(x => x.stockName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      });
    }
    else {
      this.GetStocks();
    }
  }

  //toggles the confirm and delete button on click to confirm deletion
  toggleConfirmButton(index: number, id: number) {

    //if the button property is set to false it will be a delete button and if true a confirm button.
    // when a confirm button and clicked again it will delete the table row
    if (this.data[index].confirmButton) {
      this.Delete(id)
    }
    else {
      this.data[index].confirmButton = !this.data[index].confirmButton;
    }
  }

  Delete(id: Number) {
    this.service.deleteStock(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.data = this.data.filter(item => item.stockId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Stock Item is currently used in repairs and/or store purchases", 'X', { duration: 5000 });
        }
        else{
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/stock-management']);
  }
}
