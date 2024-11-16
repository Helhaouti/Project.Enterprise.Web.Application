import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../authentication/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CredentialPageAuthGuardService implements CanActivate {
  private userIsLoggedIn: boolean = false;

  constructor(private authService: AuthService,
              private router: Router) {
    this.authService.getCurrentUser().subscribe(user => this.userIsLoggedIn = !!user);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.userIsLoggedIn)
      this.router.navigate(["/game"]);

    return !this.userIsLoggedIn;
  }
}
