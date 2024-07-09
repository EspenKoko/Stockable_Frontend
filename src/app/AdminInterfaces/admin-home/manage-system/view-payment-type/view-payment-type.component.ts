import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaymentType } from 'src/app/models/paymentType';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { PaymentTypeService } from 'src/app/services/payment-method.service';

@Component({
  selector: 'app-view-payment-type',
  templateUrl: './view-payment-type.component.html',
  styleUrls: ['./view-payment-type.component.scss']
})
export class ViewPaymentTypeComponent {
  title = "Payment Type";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: PaymentTypeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetPaymentTypes();
  }

  GetPaymentTypes() {
    this.service.getPaymentTypes().subscribe((result: any[]) => {
      // stores payment type data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetPaymentType() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getPaymentTypeByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetPaymentTypes();
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
    this.service.deletePaymentType(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const paymentType: PaymentType = this.data.find(item => item.paymentTypeId == id);
          this.ATService.trackActivity("Deleted payment type: " + paymentType.paymentTypeName);

          this.data = this.data.filter(item => item.paymentTypeId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Payment type is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/manage-systems'])
  }
}
