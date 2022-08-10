import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
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
      // this.messages = <Subject<Message>>this.wsService
      // .connect(this.webSocketUrl)
      // .pipe(
      //   map((response: MessageEvent): Message => {
      //     let data = JSON.parse(response.data);
      //     return data
      //   })
      // )

    }

  /** PATCH Set data Account*/
  setUserAccount(data: any): Observable<any> {
    return this.http.patch<any>(this.setUserUrl, data);
  }
  /** ADD Payment Method Account*/
  addPaymentMethod(data: any): Observable<any> {
    return this.http.post<any>(this.paymentUrl, data);
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
  getAds(data: any, id: any): Observable<any> {
    return this.http.post<any>(this.getAdsUrl + id + '/', data);
  }

  // Prix actuel d'un Bitcoin
  getRateBitcoin() {
    return this.http.get<any>(this.urlBitcoin, this.httpOptions);
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
}
