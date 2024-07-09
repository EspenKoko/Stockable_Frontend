import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CityService } from 'src/app/services/city.service';
import { HubService } from 'src/app/services/hub.service';
import { City } from 'src/app/models/cities';
import { Hub } from 'src/app/models/hubs';


@Component({
  selector: 'app-create-hub',
  templateUrl: './create-hub.component.html',
  styleUrls: ['./create-hub.component.scss']
})

export class CreateHubComponent {
  title = "Hub";

  addHub: Hub = {
    hubId: 0,
    hubName: '',
    qtyOnHand: 0,
    hubPrinterThreshold: 0,
    cityId: 0,
    city: {
      cityId: 0,
      cityName: '',
      provinceId: 0,
      province: {
        provinceId: 0,
        provinceName: ''
      }
    },
  }

  data: City[] = [];

  constructor(private router: Router, private service: HubService, private cityService: CityService) {

    //populate city selectlist
    this.GetCities()
  }

  GetCities() {
    this.cityService.getCities().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  //validate form
  validate(name: HTMLInputElement, printerQTY: HTMLInputElement, // printerThreshold: HTMLInputElement,
    cityName: HTMLSelectElement) {
    if (name.value.length == 0 || name.value == ''
      || cityName.value.length == 0 || cityName.value == ''
      //|| printerThreshold.value.length == 0 || printerThreshold.value == ''
      || printerQTY.value.length == 0 || printerQTY.value == '') {
      alert("Please fill in all input field(s)");
    }
    else {
      this.Add();
    }
  }

  Add() {
    this.service.addHub(this.addHub).subscribe({
      next: (Hub) => {
        this.back();
      }
    });
  }

  back() {
    return this.router.navigate(['/view-hub']);
  }
}
