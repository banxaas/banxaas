// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpEventType, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { Observable, Subscription } from 'rxjs';

// import { finalize, map } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { JWTTokenService } from './jwt-helper.service';
// import { LocalStorageService } from './local-storage.service';
// import { CustomerService } from './customerservice';
// @Injectable({
//   providedIn: 'root'
// })
// export class InterceptorService implements HttpInterceptor{

//   prixBtc: any;
//   rate: any;
//   constructor( private localStorage:LocalStorageService, private customerService: CustomerService) { }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

//     const cfa = new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 2
//     });

//     if (request.url==="https://bitpay.com/rates/BTC/XOF") {
//       request = request.clone({headers: request.headers.set('X-Accept-Version', '2.0.0').set('Content-Type', 'application/json')})
//     }

//     return next.handle(request).pipe(
//       map((event: HttpEvent<any>) => {
//         if (event instanceof HttpResponse) {
//           console.log(event.body);

//           return event.body
//         }

//         return event
//       })
//     )

//   }
// }
