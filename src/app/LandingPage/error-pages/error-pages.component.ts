import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styles: []
})
export class ForbiddenComponent {

  constructor(private location: Location,
    private router: Router,
    private snackBar: MatSnackBar) {

  }

  back(event: Event) {
    event.preventDefault();

    if (localStorage.getItem("Token")) {
      this.location.back();
    }
    else {
      this.router.navigate(["sign-in"]).then((navigated: boolean) => {
        if (navigated) {
          this.snackBar.open("Please log in again", 'X', { duration: 5000 })
        }
      })
    }
  }
}

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styles: []
})
export class PageNotFoundComponent {

  constructor(private location: Location) { }

  back(event: Event) {
    event.preventDefault();
    return this.location.back();
  }
}