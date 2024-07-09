import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { NavigationEnd, Router } from '@angular/router';
import { HelpService } from './services/help.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "Stockable_Client_Side";
  Token: any;
  showHelpComponent: boolean = true;
  currentComponent!: string;
  private static routeUrl: string = "routeUrl";

  public lastInteractionTimestamp: number = 0;
  loaderCounter!: number;
  loadingText!: string;
  clickHere!: string;
  showLoader: boolean = false;
  counter: number = 0;

  constructor(public service: AuthenticationService,
    private helpService: HelpService,
    private router: Router,
    public location: Location,
    private snackBar: MatSnackBar) {

    this.lastInteractionTimestamp = new Date().getTime();
  }

  ngOnInit(): void {
    this.checkAuthenticatonForRouting()
    this.inactivityChecker()
  }

  checkAuthenticatonForRouting() {
    localStorage.removeItem(AppComponent.routeUrl)

    // Subscribe to router events and console log the name of the route when navigating to a page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // this.currentComponent = this.getComponentName(event.url);

        this.currentComponent = event.url;
        localStorage.setItem(AppComponent.routeUrl, JSON.stringify(this.currentComponent))
      }
    });

    // if user is authenticated load them on the previous screen
    if (localStorage.getItem("Token")) {
      this.Token = JSON.parse(localStorage.getItem("Token")!)
      if (localStorage.getItem(AppComponent.routeUrl)) {
        let url = JSON.parse(localStorage.getItem(AppComponent.routeUrl)!);
        this.router.navigate([url])
      }
    }
  }

  // private getComponentName(url: string): string {
  // Extract the component name from the URL
  // const parts = url.split('/');
  // set the name of the component equal to currentComponent
  //   return parts[parts.length - 1];
  // }

  @HostListener('click', ['$event'])
  @HostListener('document:keydown')
  @HostListener('document:mouseenter')
  resetInactivityTimestamp(event: MouseEvent) {
    this.lastInteractionTimestamp = new Date().getTime();
  }

  inactivityChecker(): void {
    if (this.Token != null) {
      setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTimeInSeconds = Math.round((currentTime - this.lastInteractionTimestamp) / 1000);

        if (elapsedTimeInSeconds === 600) { // display 5 minute remaining alert
          this.snackBar.open("Inactivity detected. You will be logged out in " + elapsedTimeInSeconds / 120 + " minutes", 'X', { duration: 30000 });
        }
        if (elapsedTimeInSeconds === 900) {
          this.service.logout().then(() => {
            this.snackBar.open(`You have been logged out due to inactivity`, 'X', { duration: 99999999 });
          });
        }
      }, 1000);
    }
  }

  back() {
    this.location.back();
    return this.showLoader = false;
  }
}
