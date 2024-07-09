import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { PaymentTypeService } from 'src/app/services/payment-method.service';

@Component({
  selector: 'app-create-payment-type',
  templateUrl: './create-payment-type.component.html',
  styleUrls: ['./create-payment-type.component.scss']
})
export class CreatePaymentTypeComponent {
  title = "Payment Type";

  addForm: FormGroup;

  constructor(private router: Router,
    private service: PaymentTypeService,
    private fb: FormBuilder,
    private apiService: ApiService) {
    this.addForm = this.fb.group({
      paymentTypeName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
    })
  }

  Add() {
    console.log(this.addForm.value)
    this.service.addPaymentType(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, "payment-type", "payment type", this.addForm.get('paymentTypeName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-payment-type']);
  }
}
