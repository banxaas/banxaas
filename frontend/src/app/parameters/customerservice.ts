import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable()
export class CustomerService {


  private setUserUrl = environment.apiUrl + 'setUser/';
  private paymentUrl = environment.apiUrl + 'paymentMethod/';
  private adsUrl = environment.apiUrl + 'ad/';
  private getAdsUrl = environment.apiUrl + 'ads/';
  private urlBitcoin = 'https://bitpay.com/rates/BTC/XOF'
  httpOptions = {
    headers: new HttpHeaders({'X-Accept-Version': '2.0.0', 'Content-Type': 'application/json'})
  }
  
  constructor(private http: HttpClient) { }



  /** PATCH Set data Account*/
  setUserAccount(data: any): Observable<any> {
    return this.http.patch<any>(this.setUserUrl, data)
  }
  /** ADD Payment Method Account*/
  addPaymentMethod(data: any): Observable<any> {
    return this.http.post<any>(this.paymentUrl, data)
  }

  /** ADD Payment Method Account*/
  deletePaymentMethod(data: any): Observable<any> {
    const parametre = {
      body: data
    }
    return this.http.delete<any>(this.paymentUrl, parametre)
  }

  /** ADD Announce*/
  addAds(data: any): Observable<any> {
    return this.http.post<any>(this.adsUrl, data)
  }

  /** LIST Announce*/
  getAds(data: any, id:any): Observable<any> {
    return this.http.post<any>(this.getAdsUrl+id+'/', data)
  }

  // Prix actuel d'un Bitcoin
  getRateBitcoin(){
    return this.http.get<any>(this.urlBitcoin, this.httpOptions)
  }

  
}