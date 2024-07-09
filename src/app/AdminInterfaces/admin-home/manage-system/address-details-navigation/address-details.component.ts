import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent {

  error!:string

  constructor(private router: Router) {

  }
  navigate(province: HTMLInputElement, city: HTMLInputElement //, branch:HTMLInputElement
    ): void { 
    if (province.checked) {
      this.router.navigate(["/view-province"]);
    }
    else if (city.checked) {
      this.router.navigate(["/view-city"]);
    }
    // else if (branch.checked) {
    //   this.router.navigate(["/view-branch"]);
    // }
    else {
      this.error = "Please make a selection";
    }

  }

  back() {
    return this.router.navigate(['/manage-systems']);
  }
}
