import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../authentication/auth.service";

/**
 * Intercepts requests, and appends the current JWT token.
 *
 * @Author Hamza el Haouti
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(AuthService.AUTH_TOKEN);

    if (!token) return next.handle(req);

    return next.handle(
      req.clone({headers: req.headers.append("Authorization", `Bearer ${token}`)})
    );
  }

}
