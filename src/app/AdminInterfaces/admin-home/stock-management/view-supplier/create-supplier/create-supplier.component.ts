import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/services/supplier.service';
import { Supplier } from 'src/app/models/suppliers';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})
export class CreateSupplierComponent {
  title = "Supplier";
  data: Supplier[] = [];

  addForm: FormGroup;

  constructor(private router: Router,
    private service: SupplierService,
    private fb: FormBuilder,
    private apiService: ApiService) {
    this.addForm = this.fb.group({
      supplierName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      supplierAddress: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      supplierContactNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      supplierEmail: ['', [Validators.email, Validators.required]],
    })
  }

  Add() {
    this.service.addSupplier(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, "supplier", "supplier", this.addForm.get('supplierName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-supplier'])
  }
}
