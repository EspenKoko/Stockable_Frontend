import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockCategoryService } from 'src/app/services/stock-category.service';
import { StockCategory } from 'src/app/models/stockCategories';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-update-stock-category',
  templateUrl: './update-stock-category.component.html',
  styleUrls: ['./update-stock-category.component.scss']
})
export class UpdateStockCategoryComponent {
  title = "Stock Category";

  StockCategory: any;

  editForm: FormGroup = new FormGroup({
    stockCategoryName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
  })

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: StockCategoryService,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.service.getStockCategory(+this.route.snapshot.params['id']).subscribe(result => {
      this.StockCategory = result;
      this.editForm.patchValue({
        stockCategoryName: this.StockCategory.stockCategoryName,
      });
    })
  }

  edit() {
    this.service.editStockCategory(this.StockCategory.stockCategoryId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, "stock-category", "stock category", `${this.StockCategory.stockCategoryName} -> ${this.editForm.get('stockCategoryName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-stock-category']);
  }
}
