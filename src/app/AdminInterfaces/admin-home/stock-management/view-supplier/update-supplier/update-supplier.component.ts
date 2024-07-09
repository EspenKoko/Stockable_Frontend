import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/services/supplier.service';
import { Supplier } from 'src/app/models/suppliers';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.scss']
})
export class UpdateSupplierComponent {
  title = "Supplier"
  Supplier: any;

  selectedSupplierType!: number;
  supplierType: Supplier[] = [];

  editForm: FormGroup = new FormGroup({
    supplierName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    supplierContactNumber: new FormControl('', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]),
    supplierEmail: new FormControl('', [Validators.required, Validators.email]),
    supplierAddress: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: SupplierService,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.service.getSupplier(+this.route.snapshot.params['id']).subscribe(result => {
      this.Supplier = result;
      this.editForm.patchValue({
        supplierName: this.Supplier.supplierName,
        supplierContactNumber: this.Supplier.supplierContactNumber,
        supplierEmail: this.Supplier.supplierEmail,
        supplierAddress: this.Supplier.supplierAddress,
      });
    })
  }

  edit() {
    this.service.editSupplier(this.Supplier.supplierId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, "supplier", "supplier", `${this.Supplier.supplierName} -> ${this.editForm.get('supplierName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-supplier'])
  }
}
