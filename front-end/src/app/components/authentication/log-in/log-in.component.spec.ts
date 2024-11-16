import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LogInComponent} from "./log-in.component";
import {AuthService} from "../../../services/authentication/auth.service";
import {User} from "../../../domain/models/user.model";
import {UserRole} from "../../../domain/models/role.model";
import {HttpHeaders} from "@angular/common/http";
import {MyProfileComponent} from "../../profile/my-profile/my-profile.component";
import {Location} from "@angular/common";

describe('LoginComponent', () => {
  let httpMock: HttpTestingController;

  let fixture: ComponentFixture<LogInComponent>;
  let component: LogInComponent;
  let componentHtml: HTMLElement;

  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [
            {path: 'login', component: LogInComponent},
            {path: 'profile', component: MyProfileComponent}
          ]
        ),
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      declarations: []
    });

    httpMock = TestBed.inject(HttpTestingController);
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    componentHtml = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should redirect to profile page upon successful login', fakeAsync(() => {
    // Arrange
    const userNameInput: HTMLInputElement = componentHtml.querySelector('#nickNameInputField');
    const passwordInput: HTMLInputElement = componentHtml.querySelector('#passwordInputField');
    const submitButton: HTMLButtonElement = componentHtml.querySelector('#submitInputButton');

    const usernameCredential: string = "jksnckjd";
    const passwordCredential: string = "ciascnkl";

    const DUMMY_USER = new User(
      1,
      new Date(),
      new Date(),
      "test",
      "test",
      [
        new UserRole(
          1,
          "player"
        )
      ],
      "fname",
      "lname",
      "NL"
    );
    const DUMMY_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaW"
      + "F0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    {
      // Act
      userNameInput.value = usernameCredential;
      userNameInput.dispatchEvent(new Event('input'));
      passwordInput.value = passwordCredential;
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      submitButton.click();
    }

    // Assert
    const req = httpMock.expectOne(
      `${(AuthService.AUTH_SERVER_ROUTE)}/login`,
    );
    const loginRequestBody = req.request.body;

    expect(usernameCredential).toEqual(loginRequestBody.username);
    expect(passwordCredential).toEqual(loginRequestBody.password);

    req.flush(
      DUMMY_USER,
      {
        headers: new HttpHeaders(
          {"Authorization": `Bearer ${DUMMY_JWT}`}
        ),
        status: 200,
        statusText: 'Ok'
      }
    );

    tick();
    expect(location.path()).toBe('/profile');

  }));

});
