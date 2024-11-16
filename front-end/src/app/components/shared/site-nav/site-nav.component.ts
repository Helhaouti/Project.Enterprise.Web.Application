import {Component} from '@angular/core';
import {AuthService} from "../../../services/authentication/auth.service";
import {User} from "../../../domain/models/user.model";

@Component({
  selector: 'site-nav',
  templateUrl: './site-nav.component.html',
  styleUrls: ['./site-nav.component.scss']
})
export class SiteNavComponent {
  public userLoginState: boolean = false;
  public playerDomainHiddenState: boolean = true;
  public adminDomainHiddenState: boolean = true;

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser().subscribe(this.updateUserState);
  }

  public logOut(): void {
    this.authService.logOut();
  }

  private updateUserState = (user: User | null): void => {
    this.userLoginState = !!user;

    if (user) {
      this.adminDomainHiddenState = !user?.determineAdminPrivilege;
      this.playerDomainHiddenState = !user?.determinePlayerPrivilege;
    } else {
      this.adminDomainHiddenState = true;
      this.playerDomainHiddenState = true;
    }
  }

}
