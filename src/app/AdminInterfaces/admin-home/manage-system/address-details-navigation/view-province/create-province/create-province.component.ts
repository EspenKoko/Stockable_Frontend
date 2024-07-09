import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProvinceService } from 'src/app/services/province.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Province } from 'src/app/models/provinces';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-create-province',
  templateUrl: './create-province.component.html',
  styleUrls: ['./create-province.component.scss']
})
export class CreateProvinceComponent {
  title = "Province";
  addForm: FormGroup;

  constructor(private service: ProvinceService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService) {

    this.addForm = this.fb.group({
      provinceName: [, [Validators.required, CustomValidators.checkSpecialCharacters, Validators.pattern(/^[^0-9]*$/)]]
    })
  }

  Add() {
    this.service.addProvince(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, this.title, "province", this.addForm.get('provinceName')?.value);
    }
  });
}

  back() {
    return this.router.navigate(['/view-province']);
  }
}