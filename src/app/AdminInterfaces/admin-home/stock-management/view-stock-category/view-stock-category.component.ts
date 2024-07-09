import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StockCategoryService } from 'src/app/services/stock-category.service';
import { StockCategory } from 'src/app/models/stockCategories';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-stock-category',
  templateUrl: './view-stock-category.component.html',
  styleUrls: ['./view-stock-category.component.scss']
})
export class ViewStockCategoryComponent {
  title = "Stock Category";

  data: any[] = [];

  searchTerm!: string;
  searchError!: string

  constructor(private router: Router,
    private service: StockCategoryService,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetStockCategories();
  }

  GetStockCategories() {
    this.service.getStockCategories().subscribe((result: any[]) => {
      // stores Stock Category data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetStockCategory() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getStockCategoryByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetStockCategories();
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
    this.service.deleteStockCategory(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const stockCategory: StockCategory = this.data.find(item => item.stockCategoryId == id);
          this.ATService.trackActivity("Deleted stock category: " + stockCategory.stockCategoryName);

          this.data = this.data.filter(item => item.stockCategoryId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Employee is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/stock-management'])
  }
}
