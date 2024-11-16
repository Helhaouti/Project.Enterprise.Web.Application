import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from "./auth.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {User} from "../../domain/models/user.model";
import {HttpHeaders, HttpResponse} from "@angular/common/http";
import {UserRole} from "../../domain/models/role.model";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LoginRequest} from "../../domain/dto/LoginRequest";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should store the jwt token and user object', () => {
    // Arrange
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
    const DUMMY_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const DUMMY_HTTP_RESPONSE: HttpResponse<User> = new HttpResponse<User>({
      body: DUMMY_USER,
      headers: new HttpHeaders(
        {"Authorization": `Bearer ${DUMMY_JWT}`}
      ),
      status: 200
    });

    // Act
    service.setSession(DUMMY_HTTP_RESPONSE);

    // Assert
    expect(localStorage.getItem(AuthService.AUTH_TOKEN))
      .toEqual(DUMMY_JWT);

    expect(localStorage.getItem(AuthService.CURRENT_USER))
      .toEqual(JSON.stringify(DUMMY_USER.toJson()));

    expect(JSON.stringify(DUMMY_USER))
      .toEqual(JSON.stringify(service.getCurrentUserSnapshot()));
  });

  it('Should generate an exception upon login with invalid credentials', () => {
    // Arrange
    const dummyCredentials = new LoginRequest("invalid", "invalid");

    // Act
    service.login(
      dummyCredentials,
      "",
      error => expect(error).toBeTruthy()
    );

    // Assert
    const req = httpMock.expectOne(
      `${(AuthService.AUTH_SERVER_ROUTE)}/login`,
    );
    expect(req.request.method).toBe('POST');

    req.flush({
      type: 'ERROR',
      status: 400
    });
  });

});
