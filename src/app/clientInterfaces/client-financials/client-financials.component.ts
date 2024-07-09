import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-financials',
  templateUrl: './client-financials.component.html',
  styleUrls: ['./client-financials.component.scss']
})
export class ClientFinancialsComponent {

  constructor(private router:Router){

  }

  back(){
    this.router.navigate(["/client-dashboard"])
  }
}
