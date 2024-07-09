import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StockCategoryService } from 'src/app/services/stock-category.service';
import { StockTypeService } from 'src/app/services/stock-type.service';
import { StockCategory } from 'src/app/models/stockCategories';
import { StockType } from 'src/app/models/stockTypes';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-update-stock-type',
  templateUrl: './update-stock-type.component.html',
  styleUrls: ['./update-stock-type.component.scss']
})
export class UpdateStockTypeComponent {
  title = "Stock Type";

  StockType: any;

  editForm: FormGroup = new FormGroup({
    stockTypeName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    stockCategoryId: new FormControl(0, Validators.required)
  })

  data: StockCategory[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: StockTypeService,
    private stockCategoryService: StockCategoryService,
    private apiService: ApiService) {

    //populate Stock Category selectlist
    this.GetStockCategories()
  }

  GetStockCategories() {
    this.stockCategoryService.getStockCategories().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  ngOnInit(): void {
    this.service.getStockType(+this.route.snapshot.params['id']).subscribe(result => {
      this.StockType = result;
      this.editForm.patchValue({
        stockTypeName: this.StockType.stockTypeName,
        stockCategoryId: this.StockType.stockCategoryId,
      });
    })
  }

  edit() {
    this.service.editStockType(this.StockType.stockTypeId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, "stock-type", "stock type",  `${this.StockType.stockTypeName} -> ${this.editForm.get('stockTypeName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-stock-type']);
  }
}
