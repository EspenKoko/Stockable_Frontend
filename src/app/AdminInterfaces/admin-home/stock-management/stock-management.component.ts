import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.scss']
})
export class StockManagementComponent {

  constructor(private router:Router){

  }

  back(){
    this.router.navigate(['/admin-dashboard']);
  }
}
