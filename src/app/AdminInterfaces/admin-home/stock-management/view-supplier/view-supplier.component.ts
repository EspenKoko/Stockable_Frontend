import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/models/suppliers';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent {
  title = "Supplier";
  data: any[] = [];

  searchError!: string
  searchTerm!: string;

  constructor(private router: Router,
    private service: SupplierService,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetSuppliers();
  }

  GetSuppliers() {
    this.service.getSuppliers().subscribe((result: any[]) => {
      // stores supplier data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetSupplier() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getSupplierByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetSuppliers();
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
    this.service.deleteSupplier(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const supplier: Supplier = this.data.find(item => item.supplierId == id);
          this.ATService.trackActivity("Deleted supplier: " + supplier.supplierName);

          this.data = this.data.filter(item => item.supplierId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        if (response.status == 400 || response.status == 404 || response.status == 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/stock-management'])
  }
}
