import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { PriceService } from 'src/app/services/price.service';
import { Price } from 'src/app/models/prices';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  title = "Price";

  data: any[] = [];
  searchTerm!: string;
  searchError!: string;

  constructor(private service: PriceService, private router: Router, private route: ActivatedRoute,
    private snackBar: MatSnackBar) {
    this.GetPrices();
  }

  GetPrices() {
    this.service.getPrices().subscribe((result: any[]) => {
      // stores price data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetPrice() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getPrices().subscribe((result: Price[]) => {
        this.data = result.filter(x => x.price.toString().includes(this.searchTerm));
      });
    }
    else {
      this.GetPrices();
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
    this.service.deletePrice(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.data = this.data.filter(item => item.priceId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        if (response.status == 400 || response.status == 404 || response.status == 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/view-stock']);
  }
}
