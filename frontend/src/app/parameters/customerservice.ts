import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { map, tap } from 'rxjs/operators';
import { Ticket } from './ticket';
import { WebsocketService } from './websocket.service';
import { LocalStorageService } from './local-storage.service';


@Injectable()
export class CustomerService {

  private setUserUrl = environment.apiUrl + 'user/';
  private paymentUrl = environment.apiUrl + 'paymentMethod/';
  private adsUrl = environment.apiUrl + 'ad/';
  private getAdsUrl = environment.apiUrl + 'ads/';
  private tradeInitUrl = environment.apiUrl + 'trade/init/';
  private urlBitcoin = 'https://bitpay.com/rates/BTC/XOF';
  private getTransactionsUrl = environment.apiUrl + 'transactions/';
  token: any
  signature: any
  httpOptions = {
    headers: new HttpHeaders({
      'X-Accept-Version': '2.0.0',
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
    ) {
    }




  /** PATCH Set data Account*/
  setUserAccount(data: any): Observable<any> {
    return this.http.patch<any>(this.setUserUrl, data);
  }
  /** ADD Payment Method Account*/
  addPaymentMethod(data: any): Observable<any> {
    return this.http.post<any>(this.paymentUrl, data).pipe(
      tap(response => {console.log(response);
      })
    )
  }

  /** ADD Payment Method Account*/
  deletePaymentMethod(data: any): Observable<any> {
    const parametre = {
      body: data,
    };
    return this.http.delete<any>(this.paymentUrl, parametre);
  }

  /** ADD Announce*/
  addAds(data: any): Observable<any> {
    return this.http.post<any>(this.adsUrl, data);
  }

  /** LIST Announce*/
  getAds(id: any): Observable<any> {
    return this.http.get<any>(this.getAdsUrl + id + '/');
  }

  // Prix actuel d'un Bitcoin
  getRateBitcoin() {
    return this.http.get<any>(this.urlBitcoin, this.httpOptions).pipe(
      tap(response => {console.log(response)}
      )
    )
  }

// Déclencher une transaction en appuyant sur le btn accepter
  initTrade(data: any): Observable<any> {
    return this.http.post<any>(this.tradeInitUrl, data);
  }


  // Fonction de test
  getTicketsLarge() {
    return this.http.get<any>('assets/customers-large.json')
      .toPromise()
      .then(res => <Ticket[]>res.data)
      .then(data => { return data; });
  }

  // List des transactions d'un utilisateur
  getTransactions(page: any): Observable<any> {
    return this.http.get<any>(this.getTransactionsUrl + page + '/');
  }
}
