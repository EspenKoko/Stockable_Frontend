import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StockCategoryService } from 'src/app/services/stock-category.service';
import { StockTypeService } from 'src/app/services/stock-type.service';
import { StockCategory } from 'src/app/models/stockCategories';
import { StockType } from 'src/app/models/stockTypes';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-create-stock-type',
  templateUrl: './create-stock-type.component.html',
  styleUrls: ['./create-stock-type.component.scss']
})
export class CreateStockTypeComponent implements OnInit {
  title = "Stock Type";
  returnUrl: string = '/view-stock-type';
  secondaryUrl: string = 'stock-type';

  addForm: FormGroup;
  data: StockCategory[] = [];

  constructor(private router: Router,
    private service: StockTypeService,
    private stockCategoryService: StockCategoryService,
    private fb: FormBuilder,
    private apiService: ApiService) {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromCreateStockComponent']) {
      // Navigated from the createStockComponent
      console.log('Navigated from createStockComponent');
      this.returnUrl = "/create-stock";
      this.secondaryUrl = "stock";
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
    }

    this.addForm = this.fb.group({
      stockTypeName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      stockCategoryId: [0, Validators.required]
    })
  }

  ngOnInit(): void {
    //populate Stock Category selectlist
    this.GetStockCategories()
  }

  GetStockCategories() {
    this.stockCategoryService.getStockCategories().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  Add() {
    this.service.addStockType(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, this.secondaryUrl, "stock type", this.addForm.get('stockTypeName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate([this.returnUrl]);
  }
}
