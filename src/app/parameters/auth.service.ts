import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class  AuthService {

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: member-ordering
  private authUrl = 'http://localhost:9000/connexion/';
  private registerUrl = 'http://localhost:9000/createAccount/';
  private codeUrl = 'http://localhost:9000/validateCode/';
  private isDeconnectedUrl = 'http://localhost:9000/isDisconnected/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' +localStorage.getItem('token') })
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
  validAccount(code: string, tokenId: string): Observable<any>{
    return this.http.post<any>(this.codeUrl, {code, tokenId}, this.httpOptions)
  }

  /** POST */
  uniqConnexion(key: string, signature: string): Observable<any> {
    return this.http.post<any>(this.isDeconnectedUrl, { key, signature }, this.httpOptions);
  }
}
