import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvinceService } from 'src/app/services/province.service';
import { Province } from 'src/app/models/provinces';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-update-province',
  templateUrl: './update-province.component.html',
  styleUrls: ['./update-province.component.scss']
})
export class UpdateProvinceComponent implements OnInit {
  title = "Province"

  Province: any;

  editForm: FormGroup = new FormGroup({
    provinceName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters, Validators.pattern(/^[^0-9]*$/)])
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: ProvinceService,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.service.getProvince(+this.route.snapshot.params['id']).subscribe(result => {
      this.Province = result;
      this.editForm.patchValue({
        provinceName: this.Province.provinceName,
      });
    })
  }

  edit() {
    this.service.editProvince(this.Province.provinceId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, this.title, "province",  `${this.Province.provinceName} -> ${this.editForm.get('provinceName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-province'])
  }
}