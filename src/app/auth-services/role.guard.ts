import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as string[]; // Retrieve the required roles from route data
    const userRoles = this.authService.getUserRoles(); // Retrieve the user's roles from your authentication service
    const hasRequiredRole = userRoles.some(role => requiredRoles?.includes(role)); // Check if the user has any of the required roles

    if (hasRequiredRole) {
      return true; // User has the required role(s), allow access to the route
    } else {
      // Redirect the user to another route or show an access denied page
      return this.router.parseUrl('/unauthorized');
    }
  }
}