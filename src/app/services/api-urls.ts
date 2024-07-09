import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { AuditTrail } from '../models/auditTrail';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router) {

  }

  //for testing purposes with assignment 3 code in acs store and initial authenticaiton service
  // apiUrl = 'http://localhost:5240/api/'

  //less secure port
  // apiUrl = 'https://localhost:7285/api/';
  // apiUrl = 'http://stockablebackend-dev.eba-cpqfkb7g.af-south-1.elasticbeanstalk.com/api/';

  //more secure port
  apiUrl = 'https://localhost:44378/api/';

  //handle based on status code for delete api calls
  handleApiDeleteReponse(response: HttpErrorResponse, object?: any, id?: number, componentName?: string, secondaryName?: string) {
    if (response.status == 200) {
      // save audit trail
      this.trackActivity(`Deleted ${componentName}: ${secondaryName}`);

      if (object == null && id == null) {
        window.location.reload();
      }
      else {
        // object = object.filter((item: any | undefined) => item.id !== id);
      }
    }
    else if (response.status == 400) {
      this.snackBar.open(response.error.text, 'X', { duration: 5000 });
    }
    else if (response.status == 404) {
      this.snackBar.open(response.error.text, 'X', { duration: 5000 });
    }
    else if (response.status == 500) {
      this.snackBar.open(response.error.text, 'X', { duration: 5000 });
    }
    else {
      this.snackBar.open(response.error.text, 'X', { duration: 5000 });
    }
  }

  //handle based on status code for delete api calls
  handleApiPutReponse(response: HttpErrorResponse, returnUrl: string, name: string, item: string) {
    console.log(response)
    if (response.status == 200) {
      // save audit trail
      this.trackActivity(`Updated ${name.toLowerCase()}: ${item}`);

      let urlName: string = returnUrl.toLowerCase();
      this.router.navigate([`/view-${urlName}`]).then((navigated: boolean) => {
        if (navigated) {
          let successName: string = name.charAt(0).toUpperCase() + name.slice(1, name.length)
          this.snackBar.open(`${successName} Successfully Updated`, 'X', { duration: 5000 });
        }
      })
    }
    else {
      this.snackBar.open(this.extractErrorMessage(response), 'X', { duration: 5000 });
    }
  }

  //handle based on status code for delete api calls
  handleApiPostReponse(response: HttpErrorResponse, returnUrl: string, name: string, item: string) {
    console.log(response)
    if (response.status == 200) {
      // save audit trail
      this.trackActivity(`Created ${name.toLowerCase()}: ${item}`);

      let urlName: string = returnUrl.toLowerCase();
      this.router.navigate([`/view-${urlName}`]).then((navigated: boolean) => {
        if (navigated) {
          let successName: string = name.charAt(0).toUpperCase() + name.slice(1, name.length)
          this.snackBar.open(`${successName} Successfully Added`, 'X', { duration: 5000 });
        }
      })
    }
    else {
      this.snackBar.open(this.extractErrorMessage(response), 'X', { duration: 5000 });
    }
  }

  private extractErrorMessage(response: HttpErrorResponse): string {
    if (typeof response.error === 'string') {
      return response.error;
    } else if (response.error && response.error.error) {
      return `Error: ${response.error.errors}`;
    }
    return 'An unknown error occurred.';
  }

  trackActivity(action: string) {
    const Token: any = JSON.parse(localStorage.getItem("Token") || '{}');

    let auditTrail: AuditTrail = {
      auditTrailId: 0,
      date: new Date(),
      userId: Token.id,
      userName: Token.firstName + " " + Token.lastName,
      userAction: action
    }

    this.httpClient.post(`${this.apiUrl}AuditTrail/AddAuditTrail`, auditTrail, this.httpOptions).subscribe({
      next: (value: any) => { },
      error: (err: HttpErrorResponse) => {
        if (err.status == 200) {
          console.log("success");
        }
        else {
          console.error(err);
        }
      },
    })
  }
}