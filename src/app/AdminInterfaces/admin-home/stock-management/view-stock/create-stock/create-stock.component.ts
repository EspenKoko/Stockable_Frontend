import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StockTypeService } from 'src/app/services/stock-type.service';
import { StockService } from 'src/app/services/stock.service';
import { StockType } from 'src/app/models/stockTypes';
import { Stock } from 'src/app/models/stocks';
import { StockCategory } from 'src/app/models/stockCategories';
import { StockCategoryService } from 'src/app/services/stock-category.service';
import { PriceService } from 'src/app/services/price.service';
import { firstValueFrom } from 'rxjs';
import { CustomValidators } from 'src/app/resources/custom-validators';

@Component({
  selector: 'app-create-stock',
  templateUrl: './create-stock.component.html',
  styleUrls: ['./create-stock.component.scss']
})
export class CreateStockComponent implements OnInit {
  title = "Stock";
  stockTypeData: StockType[] = [];
  stockCategoryData: StockCategory[] = [];
  stockTypeDataCheck: StockCategory[] = [];
  stockCategorySelection: any;

  addForm: FormGroup;
  addPriceForm: FormGroup;
  parentForm: FormGroup;

  constructor(private snackBar: MatSnackBar,
    private router: Router,
    private service: StockService,
    private stockTypeService: StockTypeService,
    private stockCategoryService: StockCategoryService,
    private priceService: PriceService,
    private fb: FormBuilder) {

    this.addForm = this.fb.group({
      stockName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      stockDescription: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      qtyOnHand: [0, [Validators.required, Validators.min(0)]],
      stockCategoryId: [0, Validators.required], // dummy value but not in the models
      stockTypeId: [0, Validators.required],
      minStockThreshold: [1, [Validators.required, Validators.min(1)]],
      maxStockThreshold: [1, [Validators.required, Validators.min(1)]],
    })

    this.addPriceForm = this.fb.group({
      price: [0, [Validators.required, Validators.min(1)]],
      priceDate: [new Date(), Validators.required],
      stockId: [0],
    })

    this.parentForm = this.fb.group({
      addStockForm: this.addForm,
      addPriceForm: this.addPriceForm
    })
  }

  ngOnInit(): void {
    this.GetStockCategories();
    this.GetStockTypes();
  }

  GetStockCategories() {
    this.stockCategoryService.getStockCategories().subscribe((result: any[]) => {
      this.stockCategoryData = result;
    })
  }

  GetStockTypes() {
    this.stockTypeService.getStockTypes().subscribe((result: any[]) => {
      this.stockTypeDataCheck = result;
    })
  }

  filterStockType() {
    let stockCategorySelection = this.addForm.get('stockCategoryId')?.value;

    this.stockTypeService.getStockTypes().subscribe((result: StockType[]) => {
      this.stockTypeData = result.filter(x => x.stockCategoryId == stockCategorySelection);
    })
  }

  Add() {
    this.service.addStock(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log("stock Created")
          //create price
          // this.getStock();
          this.addPrice();
        }
      }
    });
  }

  //must make a promise
  async getStock(): Promise<Stock> {
    const result = await firstValueFrom(this.service.getStocks())
    let stockItems = result;
    let mostRecentStock = stockItems[stockItems.length - 1]

    return mostRecentStock
  }

  async addPrice() {
    // Assign the stockId to the mostRecentStockItem formControl in addForm
    this.addPriceForm.get('stockId')?.setValue((await this.getStock()).stockId);

    this.priceService.addPrice(this.addPriceForm.value).subscribe({
      next: (result: any) => {
        console.log(result); // returns null
        this.back().then((navigated: boolean) => {
          if (navigated) {
            this.snackBar.open(`Stock Successfully Added`, 'X', { duration: 5000 });
          }
        })
      },
      error: (response: HttpErrorResponse) => {
        // doesnt work
        console.log(response);
        if (response.status == 200) {
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Stock Successfully Added`, 'X', { duration: 5000 });
            }
          })
        }
      }
    })
  }

  navigate(){
    return this.router.navigate(['/create-stock-type'],  { state: { fromCreateStockComponent: true } })
  }

  back() {
    return this.router.navigate(['/view-stock'])
  }
}
