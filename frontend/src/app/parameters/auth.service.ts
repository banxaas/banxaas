import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
export class  AuthService {

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: member-ordering
  private authUrl = environment.apiUrl + 'connexion/';
  private registerUrl = environment.apiUrl + 'createAccount/';
  private codeUrl = environment.apiUrl + 'validateCode/';
  private sendNewCodeUrl = environment.apiUrl + 'sendNewCodeValidation/';
  private logoutUrl = environment.apiUrl + 'disconnect/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }


  /** POST Connexion*/
  login(login: string, password: string): Observable<any>{

    return this.http.post<HttpResponse<Object>>(this.authUrl, {login, password})
  }

  /** POST Create Account*/
  createAccount(data:any): Observable<any>{
    return this.http.post<any>(this.registerUrl, data)
  }

  /** POST Valid Account*/
  validAccount(code: string, token: string): Observable<any>{
    return this.http.post<any>(this.codeUrl, {code, token})
  }

  /** POST Valid Account*/
  sendNewValidationCode(data: any): Observable<any>{
    return this.http.post<any>(this.sendNewCodeUrl, data)
  }
  logout(data: any): Observable<any>{
    return this.http.post<any>(this.logoutUrl, data)
  }

  /** POST */

}
