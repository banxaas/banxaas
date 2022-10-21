import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment'

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

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  /** POST Connexion*/
  login(login: string, password: string): Observable<any>{

    return this.http.post<any>(this.authUrl, {login, password}, this.httpOptions)
  }

  /** POST Create Account*/
  createAccount(data:any): Observable<any>{
    return this.http.post<any>(this.registerUrl, data, this.httpOptions)
  }

  /** POST Valid Account*/
  validAccount(code: string, token: string): Observable<any>{
    return this.http.post<any>(this.codeUrl, {code, token}, this.httpOptions)
  }

  /** POST Valid Account*/
  sendNewValidationCode(data: any): Observable<any>{
    return this.http.post<any>(this.sendNewCodeUrl, data)
  }

  /** POST */
 
}
