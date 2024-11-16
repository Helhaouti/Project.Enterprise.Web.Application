import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../authentication/auth.service";
import {User} from "../../domain/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AdminRoleAuthGuardService implements CanActivate {
  private adminDomainAccessibilityState: boolean = false;

  public constructor(private authService: AuthService,
                     private router: Router) {
    this.authService.getCurrentUser().subscribe(this.setState);
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.adminDomainAccessibilityState)
      this.router.navigate(["/login"]);

    return this.adminDomainAccessibilityState;
  }

  private setState = (user: User | null) => {
    user
      ? this.adminDomainAccessibilityState = user.determineAdminPrivilege
      : this.adminDomainAccessibilityState = false;
  }
}
