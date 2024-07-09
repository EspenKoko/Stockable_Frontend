import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CityService } from 'src/app/services/city.service';
import { ProvinceService } from 'src/app/services/province.service';
import { Province } from 'src/app/models/provinces';
import { City } from 'src/app/models/cities';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-update-city',
  templateUrl: './update-city.component.html',
  styleUrls: ['./update-city.component.scss']
})
export class UpdateCityComponent {
  title = "City";
  City: any;

  //populate province selectlist
  data: Province[] = [];

  editForm: FormGroup = new FormGroup({
    cityName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters, Validators.pattern(/^[^0-9]*$/)]),
    provinceId: new FormControl(0, [Validators.required])
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: CityService,
    private provinceService: ProvinceService,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    //populate province selectlist
    this.GetProvinces()

    this.service.getCity(+this.route.snapshot.params['id']).subscribe(result => {
      this.City = result;
      this.editForm.patchValue({
        cityName: this.City.cityName,
        provinceId: this.City.provinceId,
      });
    })
  }

  GetProvinces() {
    this.provinceService.getProvinces().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  edit() {
    this.service.editCity(this.City.cityId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, this.title, "city",  `${this.City.cityName} -> ${this.editForm.get('cityName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-city'])
  }
}
