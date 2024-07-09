import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StockCategoryService } from 'src/app/services/stock-category.service';
import { StockCategory } from 'src/app/models/stockCategories';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-create-stock-category',
  templateUrl: './create-stock-category.component.html',
  styleUrls: ['./create-stock-category.component.scss']
})
export class CreateStockCategoryComponent {
  title = "Stock Category";

  data: StockCategory[] = [];

  addForm: FormGroup;

  constructor(private router: Router,
    private service: StockCategoryService,
    private fb: FormBuilder,
    private apiService: ApiService) {

    this.addForm = this.fb.group({
      stockCategoryName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    })
  }

  Add() {
    this.service.addStockCategory(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, "stock-category", "stock category", this.addForm.get('stockCategoryName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-stock-category']);
  }
}
