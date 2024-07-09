import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceService } from 'src/app/services/price.service';
import { Price } from 'src/app/models/prices';
import { StockService } from 'src/app/services/stock.service';
import { Stock } from 'src/app/models/stocks';

@Component({
  selector: 'app-update-price',
  templateUrl: './update-price.component.html',
  styleUrls: ['./update-price.component.scss']
})
export class UpdatePriceComponent {
  title = "Price"
  Price: any;

  data: Stock[] = [];

  editForm: FormGroup = new FormGroup({
    price: new FormControl('', Validators.required),
    priceDate: new FormControl(new Date(), Validators.required),
    stockId: new FormControl(0, Validators.required)
  })

  constructor(private route: ActivatedRoute, private router: Router, private service: PriceService,
    private stockService: StockService, private snackBar: MatSnackBar) {
    this.GetStocks();
  }

  GetStocks() {
    this.stockService.getStocks().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  ngOnInit(): void {
    this.service.getPrice(+this.route.snapshot.params['id']).subscribe(result => {
      this.Price = result;
      this.editForm.patchValue({
        price: this.Price.price,
        priceDate: this.Price.priceDate,
        stockId: this.Price.stockId
      });
    })
  }

  edit() {
    this.editForm.get('priceDate')?.setValue(new Date());
    this.service.editPrice(this.Price.priceId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Price Successfully Updated`, 'X', { duration: 5000 });
            }
          })
        }
         if (response.status == 400 || response.status == 404 || response.status == 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['/pricing'])
  }
}
