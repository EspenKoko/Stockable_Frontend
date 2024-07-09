import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StockTypeService } from 'src/app/services/stock-type.service';
import { StockService } from 'src/app/services/stock.service';
import { StockType } from 'src/app/models/stockTypes';
import { Stock } from 'src/app/models/stocks';
import { PriceService } from 'src/app/services/price.service';
import { Price } from 'src/app/models/prices';
import { CustomValidators } from 'src/app/resources/custom-validators';

@Component({
  selector: 'app-update-stock',
  templateUrl: './update-stock.component.html',
  styleUrls: ['./update-stock.component.scss']
})
export class UpdateStockComponent {
  title = "Stock"

  //stores url based on url navigation history
  returnUrl: string = "view-stock";

  Stock: any;
  stockType: Stock[] = [];
  data: StockType[] = [];


  editForm: FormGroup;
  editPriceForm: FormGroup;
  parentForm: FormGroup;
  pricedStock!: Price;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: StockService,
    private priceService: PriceService,
    private stockTypeService: StockTypeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.editForm = this.fb.group({
      stockName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      stockTypeId: [0, Validators.required],
      stockDescription: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      qtyOnHand: [0, [Validators.required, Validators.min(0)]],
      minStockThreshold: [0, [Validators.required, Validators.min(1)]],
      maxStockThreshold: [0, [Validators.required, Validators.min(1)]],
    })

    this.editPriceForm = this.fb.group({
      price: [0, [Validators.required, Validators.min(1)]],
      priceDate: [new Date(), Validators.required],
      stockId: [0],
    })

    this.parentForm = this.fb.group({
      editStockForm: this.editForm,
      editPriceForm: this.editPriceForm
    })
  }

  GetStockTypes() {
    this.stockTypeService.getStockTypes().subscribe((result: StockType[]) => {
      this.data = result;
    })
  }

  ngOnInit(): void {
    this.service.getStock(+this.route.snapshot.params['id']).subscribe(result => {
      this.Stock = result;

      this.priceService.getPrices().subscribe((result: Price[]) => {
        let prices: Price[] = result.filter(x => x.stockId == this.Stock.stockId)
        this.pricedStock = prices[prices.length - 1]

        this.editForm.patchValue({
          stockName: this.Stock.stockName,
          stockTypeId: this.Stock.stockType.stockTypeId,
          qtyOnHand: this.Stock.qtyOnHand,
          stockDescription: this.Stock.stockDescription,
          minStockThreshold: this.Stock.minStockThreshold,
          maxStockThreshold: this.Stock.maxStockThreshold,
        });

        this.editPriceForm.patchValue({
          price: this.pricedStock.price,
          priceDate: this.pricedStock.priceDate,
          stockId: this.pricedStock.stockId,
        })
      })
    })
    this.GetStockTypes();
  }


  edit() {
    this.service.editStock(this.Stock.stockId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (stockResponse: HttpErrorResponse) => {
        if (stockResponse.status == 200) {
          // this.priceService.editPrice(this.pricedStock.priceId, this.editPriceForm.value).subscribe({
          // create a price so you have a track of the date
          this.editPriceForm.get('priceDate')?.setValue(new Date())
          this.priceService.addPrice(this.editPriceForm.value).subscribe({
            next: (result: any) => {
              //if using add price instead of edit
              this.back().then((navigated: boolean) => {
                if (navigated) {
                  this.snackBar.open(`Stock Successfully Updated`, 'X', { duration: 5000 });
                }
              })
            },
            error: (pricedStockResponse: HttpErrorResponse) => {
              if (pricedStockResponse.status == 200) {
                this.back().then((navigated: boolean) => {
                  if (navigated) {
                    this.snackBar.open(`Stock Successfully Updated`, 'X', { duration: 5000 });
                  }
                })
              }
            }
          })
        }
        else {
          this.snackBar.open(stockResponse.error, 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate([this.returnUrl])
  }
}
