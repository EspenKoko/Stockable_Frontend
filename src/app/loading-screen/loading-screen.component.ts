import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent {

  constructor(private location: Location,
    private service: AuthenticationService,
    private appComponent: AppComponent,
    private router:Router,
    private snackBar: MatSnackBar) {

  }

  refresh() {
    if (localStorage.getItem("Token")) {
      window.location.reload();
    }
    else {
      this.service.logout();

      setTimeout(() => {
        this.snackBar.open("An error has occured, please log in again", 'X', { duration: 5000 })
      }, 1000);
    }

    this.appComponent.showLoader = false;
  }

  back() {
    this.location.back();
    return this.appComponent.showLoader = false;
  }
}
