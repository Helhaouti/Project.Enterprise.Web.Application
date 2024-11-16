import {Component} from '@angular/core';
import {User} from "../../../domain/models/user.model";
import {AuthService} from "../../../services/authentication/auth.service";

/**
 * A page where the user gets an overview of his account and has the ability to modify aspects of it.
 *
 * @author Hamza el Haouti
 */
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent {
  // @ts-ignore
  public currentUser!: User;

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser().subscribe(user => this.currentUser = user!);
  }

}
