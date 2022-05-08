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
  private authUrl = 'http://127.0.0.1:8000/api/connexion/';
  private registerUrl = 'http://127.0.0.1:8000/api/createAccount/';
  private codeUrl = 'http://127.0.0.1:8000/api/validateCode/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' +localStorage.getItem('token') })
  }

  /** POST Connexion*/
  login(login: string, password: string): Observable<any>{

    return this.http.post<any>(this.authUrl, {login, password}, this.httpOptions)
  }

  /** POST Create Account*/
  createAccount(pseudo: string, password: string, email: string, phone: string): Observable<any>{
    return this.http.post<any>(this.registerUrl, {pseudo, password, email, phone}, this.httpOptions)
  }

    /** POST Valid Account*/
    validAccount(code: string, tokenId: string): Observable<any>{
      return this.http.post<any>(this.codeUrl, {code, tokenId}, this.httpOptions)
    }
}
