import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial-accounts',
  templateUrl: './financial-accounts.component.html',
  styleUrls: ['./financial-accounts.component.scss']
})
export class FinancialAccountsComponent {
  constructor(private router:Router){

  }

  back(){
    this.router.navigate(["/client-financials"])
  }
}
