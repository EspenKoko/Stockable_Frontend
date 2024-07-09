import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StockTypeService } from 'src/app/services/stock-type.service';
import { StockType } from 'src/app/models/stockTypes';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-stock-type',
  templateUrl: './view-stock-type.component.html',
  styleUrls: ['./view-stock-type.component.scss']
})
export class ViewStockTypeComponent {
  title = "Stock Type";
  data: any[] = [];

  searchError!: string
  searchTerm!: string;

  constructor(private router: Router,
    private service: StockTypeService,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetStockTypes();
  }

  GetStockTypes() {
    this.service.getStockTypes().subscribe((result: any[]) => {
      // stores stock type data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    }
    )
  }

  GetStockType() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getStockTypeByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetStockTypes();
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
    this.service.deleteStockType(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const stockType: StockType = this.data.find(item => item.stockTypeId == id);
          this.ATService.trackActivity("Deleted stock type: " + stockType.stockTypeName);

          this.data = this.data.filter(item => item.stockTypeId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Stock type is currently associated with funtionality on the system", 'X', { duration: 5000 });
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
