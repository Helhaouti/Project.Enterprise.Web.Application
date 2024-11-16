import {Injectable, OnDestroy} from '@angular/core';

import {environment} from "../../../environments/environment";
import {LoginRequest} from "../../domain/dto/LoginRequest";
import {SnackbarService} from "../snackbar/snackbar.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../domain/models/user.model";
import {UserCreationRequest} from "../../domain/dto/UserCreationRequest";
import {BehaviorSubject, Observable} from "rxjs";

/**
 * Service responsible for the handling of authentication within the application.
 *
 * @author Hamza el Haouti
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  public static readonly AUTH_SERVER_ROUTE = `${environment.apiUrl}/authenticate`;
  public static readonly AUTH_TOKEN = "AUTH_TOKEN";
  public static readonly CURRENT_USER = "CURR_USER";

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /**
   * Instantiates this service, by retrieving the user information of the previous session from localStorage, and
   * injecting dependencies of this class.
   */
  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackbar: SnackbarService,
  ) {
    let currentUser: string | null = localStorage.getItem(AuthService.CURRENT_USER);

    if (currentUser)
      this.currentUserSubject.next(
        User.trueCopy(JSON.parse(currentUser)));
  }

  ngOnDestroy(): void {
    this.currentUserSubject.complete();
  }

  /**
   * Attempts to login the user with the provided attributes.
   *
   * Upon succes:
   * Sets the current session provided by the server (JWT token and User instance).
   * And redirects to the provided route, relative to the root of the application.
   *
   * Upon failure:
   * Displays a snackbar with the exception.
   *
   * @param credentials         An object with the attributes needed to login.
   * @param redirectToOnSucces  A route relative to the root of the application.
   * @param onError             Callback when login attempt fails.
   */
  public login(
    credentials: LoginRequest,
    redirectToOnSucces: string,
    onError: (error: any) => void
  ): void {
    this.http.post<User>(
      `${(AuthService.AUTH_SERVER_ROUTE)}/login`, credentials.toJson(), {observe: 'response'}
    ).subscribe(
      res => {
        this.setSession(res);
        this.redirectToRelativeToRoot(redirectToOnSucces);
      },
      error => {
        this.snackbar.displayErrorMessage(error);
        onError(error);
      }
    );
  }

  /**
   * Attempts to register the user with the provided attributes.
   *
   * Upon succes:
   * Sets the current session provided by the server (JWT token and User instance).
   * And redirects to the provided route, relative to the root of the application.
   *
   * Upon failure:
   * Displays a snackbar with the exception.
   *
   * @param credentials         An object with the attributes needed to register an account.
   * @param redirectToOnSucces  A route relative to the root of the application.
   */
  public register(credentials: UserCreationRequest, redirectToOnSucces: string): void {
    this.http.post<User>(
      `${(AuthService.AUTH_SERVER_ROUTE)}/register`, credentials.toJson(), {observe: 'response'}
    ).subscribe(
      res => {
        this.setSession(res);
        this.redirectToRelativeToRoot(redirectToOnSucces);
      },
      this.snackbar.displayErrorMessage
    );
  }

  /**
   * Logs out, by deleting all information stored by the application, and propagating it application-wide.
   */
  public logOut(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  /**
   * Sets the current user, by saving the provided user, and propagating it application-wide.
   */
  public setCurrentUser(user: User | null): void {
    let currentUser: User | null = user != null ? User.trueCopy(user) : null;
    this.storeUserAndPropagate(currentUser);
  }

  /**
   * Provides the currentUser Subject as an observable.
   */
  public getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * Provides a glance at the current value of the currentUser Subject.
   */
  public getCurrentUserSnapshot(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Helper method of the login/register methods, to save the provided information (JWT and User instance).
   *
   * @param res A successful http response of a Auth end-point.
   */
  public setSession(res: HttpResponse<User>): void {
    const authToken: string = res
      .headers
      .get("Authorization")!
      .replace('Bearer ', '');

    localStorage.setItem(AuthService.AUTH_TOKEN, authToken);

    let currentUser: User | null = res.body != null ? User.trueCopy(res.body) : null;
    this.storeUserAndPropagate(currentUser);
  }

  /**
   * Stores user in localStorage and updates Subject.
   */
  private storeUserAndPropagate(user: User | null) {
    localStorage.setItem(AuthService.CURRENT_USER, JSON.stringify(user?.toJson()));
    this.currentUserSubject.next(user);
  }

  private redirectToRelativeToRoot(link: string): void {
    this.router.navigate([link], {relativeTo: this.route.root});
  }

}
