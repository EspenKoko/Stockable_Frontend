import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../models/users';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  userName!: string;
  image?: String;
  Token: any;
  // isNavbarExpanded = false;

  constructor(private router: Router, public service: AuthenticationService) {
    if (localStorage.getItem("Token")) {
      this.Token = JSON.parse(localStorage.getItem("Token")!)
    }

    //get logged in user data
    this.initializeUser();
  }

  initializeUser() {
    this.service.getUser(this.Token.id).subscribe({
      next: (result: User) => {
        this.userName = result.userFirstName;
        this.image = result.profilePicture;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  toggleNavbar() {
    // basic navbar functionality
    //this.isNavbarExpanded = !this.isNavbarExpanded;

    //advanced navbar functionality - does not allow for ease out transition and will not collapse if page is full screened while expanded
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar) {
      if (navbar.classList.contains('show')) {
        navbar.style.height = navbar.scrollHeight + 'px';
        setTimeout(() => {
          navbar.style.height = '0';
          navbar.classList.remove('show');
        }, 10);
      } else {
        navbar.classList.add('show');
        navbar.style.height = 'auto';
        const height = navbar.scrollHeight + 'px';
        navbar.style.height = '0';
        setTimeout(() => {
          navbar.style.height = height;
        }, 10);
      }
    }
  }

  //when clicking outside the navbar the navbar will collapse
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const navbar = document.getElementById('navbarSupportedContent');
    const target = event.target as HTMLElement;

    const isNavbarToggler = target.closest('.navbar-toggler');
    const isNavbarContent = navbar?.contains(target);

    if (!isNavbarContent && !(isNavbarToggler && navbar?.classList.contains('show'))) {
      navbar?.classList.remove('show');
      navbar?.setAttribute('style', 'height: 0');
    }
  }
}
