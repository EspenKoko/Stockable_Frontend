import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/models/cities';
import { ProvinceService } from 'src/app/services/province.service';
import { Province } from 'src/app/models/provinces';
import { CityService } from 'src/app/services/city.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/services/api-urls';
import { CustomValidators } from 'src/app/resources/custom-validators';

@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss']
})
export class CreateCityComponent {
  title = "City";
  data: Province[] = [];

  addForm: FormGroup;

  constructor(private router: Router,
    private service: CityService,
    private provinceService: ProvinceService,
    private fb: FormBuilder,
    private apiService: ApiService) {
    //populate province selectlist
    this.GetProvinces()

    this.addForm = this.fb.group({
      cityName: ['', [Validators.required, CustomValidators.checkSpecialCharacters, Validators.pattern(/^[^0-9]*$/)]],
      provinceId: [, [Validators.required]]
    })
  }

  GetProvinces() {
    this.provinceService.getProvinces().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  Add() {
    this.service.addCity(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, this.title, "city", this.addForm.get('cityName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-city'])
  }
}

