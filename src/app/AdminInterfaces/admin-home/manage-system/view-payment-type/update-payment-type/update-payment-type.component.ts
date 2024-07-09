import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { PaymentTypeService } from 'src/app/services/payment-method.service';

@Component({
  selector: 'app-update-payment-type',
  templateUrl: './update-payment-type.component.html',
  styleUrls: ['./update-payment-type.component.scss']
})
export class UpdatePaymentTypeComponent {
  title = "Payment Type";

  PaymentType: any;

  editForm: FormGroup = new FormGroup({
    paymentTypeName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: PaymentTypeService,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.service.getPaymentType(+this.route.snapshot.params['id']).subscribe(result => {
      this.PaymentType = result;
      this.editForm.patchValue({
        paymentTypeName: this.PaymentType.paymentTypeName,
      });
    })
  }

  edit() {
    this.service.editPaymentType(this.PaymentType.paymentTypeId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, "payment-type", "payment type", `${this.PaymentType.paymentTypeName} -> ${this.editForm.get('paymentTypeName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-payment-type'])
  }
}
