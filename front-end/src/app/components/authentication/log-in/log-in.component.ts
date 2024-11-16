import {Component} from '@angular/core';
import {AuthService} from "../../../services/authentication/auth.service";
import {LoginRequest} from "../../../domain/dto/LoginRequest";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  private test: string = "test";

  constructor(
    private authService: AuthService
  ) {
  }

  onLogin(nickName: string, password: string) {
    this.authService.login(
      new LoginRequest(nickName, password),
      "/profile",
      error => {
      }
    );
  }
}
