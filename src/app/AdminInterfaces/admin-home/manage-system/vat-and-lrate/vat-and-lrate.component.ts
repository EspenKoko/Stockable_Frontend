import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vat-and-lrate',
  templateUrl: './vat-and-lrate.component.html',
  styleUrls: ['./vat-and-lrate.component.scss']
})
export class VatAndLrateComponent {

  constructor(private router:Router){

  }

  back() {
    return this.router.navigate(['/manage-systems'])
  }
}
