import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  selectedPage!: string;
  error!: string;

  constructor(private router: Router, public service: AuthenticationService) {

  }

  ngOnInit(): void {

  }

  navigateTo(page: string): void {
    this.selectedPage = page;
  }

  navigate(): void {
    if (this.selectedPage) {
      this.router.navigate([this.selectedPage]);
    }
    else {
      this.error = "Please make a selection";
    }
  }

  back() {
    return this.router.navigate(['/admin-dashboard']);
  }

}
