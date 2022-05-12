import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpEventType, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JWTTokenService } from './jwt-helper.service';


@Injectable({
  providedIn: 'root'
})
export class HTTPInterceptorService implements HttpInterceptor{

  constructor( private jwtService: JWTTokenService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    const token = this.jwtService.getToken();
    if (token !== null) {
      if (this.jwtService.isTokenExpired(token)) {
        console.log('expired token');
        this.router.navigateByUrl('/connexion');
        // return
      }
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }


    request = request.clone({ headers: request.headers.set('Accept', 'application/json')})

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event
      })
    )
  }
}
export const authInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptorService, multi: true
  }
]