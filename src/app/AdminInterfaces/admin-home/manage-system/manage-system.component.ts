import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-system',
  templateUrl: './manage-system.component.html',
  styleUrls: ['./manage-system.component.scss']
})
export class ManageSystemComponent {
  
  constructor(private router: Router){

  }
  
  back() {
    return this.router.navigate(['/admin-dashboard']);
  }
}
