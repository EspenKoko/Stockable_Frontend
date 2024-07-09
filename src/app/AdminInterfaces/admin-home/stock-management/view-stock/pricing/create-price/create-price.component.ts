import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { PriceService } from 'src/app/services/price.service';
import { Stock } from 'src/app/models/stocks';
import { Price } from 'src/app/models/prices';

@Component({
  selector: 'app-create-price',
  templateUrl: './create-price.component.html',
  styleUrls: ['./create-price.component.scss']
})
export class CreatePriceComponent implements OnInit {
  title = "Price";
  //stores url based on url navigation history
  returnUrl: string = "pricing";
  data: Stock[] = [];

  addForm: FormGroup;
  showComponent: boolean = true;
  mostRecentStock!: Stock;

  constructor(private snackBar: MatSnackBar, private router: Router, private service: PriceService,
    private stockService: StockService, private fb: FormBuilder) {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromStockComponent']) {
      // Navigated from the CreateStockComponent
      console.log('Navigated from CreateStockComponent');
      this.showComponent = false;

      this.stockService.getStocks().subscribe((result: any[]) => {
        let stockItems = result;
        this.mostRecentStock = stockItems[stockItems.length - 1]
        this.data[0] = this.mostRecentStock

        // Assign the stockId to the mostRecentStockItem formControl in addForm
        this.addForm.get('stockId')?.setValue(this.mostRecentStock.stockId);

        this.returnUrl = "view-stock";
      })
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      this.GetStocks();
    }

    this.addForm = this.fb.group({
      price: [0, [Validators.required, Validators.min(1)]],
      priceDate: [new Date(), Validators.required],
      stockId: [0, Validators.required],
    })
  }

  ngOnInit(): void {

  }

  GetStocks() {
    this.stockService.getStocks().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  Add() {
    this.service.addPrice(this.addForm.value).subscribe({
      next: (result) => {

        console.log(result) //returns null
        this.back().then((navigated: boolean) => {
          if (navigated) {
            this.snackBar.open(`Price Successfully Added`, 'X', { duration: 5000 });
          }
        })

      },
      //not working
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Price Successfully Added`, 'X', { duration: 5000 });
            }
          })
        }
      }
    });
  }

  back() {
    return this.router.navigate([this.returnUrl])
  }
}
