import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './customer';
import { environment } from 'src/environments/environment'

@Injectable()
export class CustomerService {
    
  private setUserUrl = environment.apiUrl + 'setUser/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' +localStorage.getItem('token') })
  }
    constructor(private http: HttpClient) { }

    getCustomersLarge() {
        return this.http.get<any>('assets/customers-large.json')
            .toPromise()
            .then(res => <Customer[]>res.data)
            .then(data => { return data; });
    }

  /** PATCH Set data Account*/
  setUserAccount(data:any): Observable<any>{
    return this.http.patch<any>(this.setUserUrl, data)
  }
}