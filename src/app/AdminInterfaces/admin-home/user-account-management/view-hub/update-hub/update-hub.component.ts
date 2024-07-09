import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HubService } from 'src/app/services/hub.service';
import { CityService } from 'src/app/services/city.service';
import { City } from 'src/app/models/cities';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-hub',
  templateUrl: './update-hub.component.html',
  styleUrls: ['./update-hub.component.scss']
})

export class UpdateHubComponent {
  title = "Hub";

  hub: any;

  data: City[] = [];

  editForm: FormGroup = new FormGroup({
    hubName: new FormControl('', Validators.required),
    qtyOnHand: new FormControl('', Validators.required),
    hubPrinterThreshold: new FormControl('', Validators.required),
    cityId: new FormControl(0, Validators.required)
  })

  constructor(private router: Router, private service: HubService, private cityService: CityService,
    private route: ActivatedRoute, private snackBar: MatSnackBar) {

    //populate city selectlist
    this.GetCities()
  }

  GetCities() {
    this.cityService.getCities().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  ngOnInit(): void {

    this.service.getHub(+this.route.snapshot.params['id']).subscribe(result => {
      this.hub = result;
      this.editForm.patchValue({
        hubName: this.hub.hubName,
        qtyOnHand: this.hub.qtyOnHand,
        hubPrinterThreshold: this.hub.hubPrinterThreshold,
        cityId: this.hub.city.cityId
      });
    })
  }

  //validate form
  validate(name: HTMLInputElement, qtyOnHand: HTMLInputElement, city: HTMLSelectElement) {
    if (name.value.length == 0 || name.value == ''
      || qtyOnHand.value.length == 0 || qtyOnHand.value == ''
      || city.value.length == 0 || city.value == '') {
      alert("please fill in all input fields");
    }
    else {
      this.edit();
    }
  }

  edit() {
    this.service.editHub(this.hub.hubId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.back().then((navigated: boolean) => {
          if (navigated) {
            this.snackBar.open(`Hub Successfully Updated`, 'X', { duration: 5000 });
          }
        })
         if (response.status == 400 || response.status == 404 || response.status == 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['/view-hub']);
  }
}
