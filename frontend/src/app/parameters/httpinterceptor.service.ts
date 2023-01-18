import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpEventType,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JWTTokenService } from './jwt-helper.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HTTPInterceptorService implements HttpInterceptor {
  token: any;
  signature: any;
  constructor(
    private jwtService: JWTTokenService,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.localStorage.get('token').subscribe((data) => {
      this.token = data;
    });
    this.localStorage.get('signature').subscribe((data) => {
      this.signature = data;
    });
    if (this.token != null) {
      if (this.jwtService.tokenExpired(this.token)) {
        this.router.navigateByUrl('connexion');
      }
      if (request.url != "https://bitpay.com/rates/BTC/XOF") {
        request = request.clone({
          headers: request.headers
            .set('Authorization', 'Bearer ' + this.token)
            .set('Signature', '' + this.signature),
        });
      }
    }
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }

        return event;
      })
    );
  }
}
