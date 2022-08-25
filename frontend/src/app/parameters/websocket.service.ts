import { Injectable } from '@angular/core';
import {Observable, Subscriber, TeardownLogic } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class WebsocketService {
  datauser: any;
  tradeId: any;
  trade: any;


  constructor(
    private localStorage: LocalStorageService
  ) {
      this.localStorage.get('data').subscribe(
        data => {
          this.datauser = JSON.parse(data)
          this.trade = this.datauser.user.currentTrade[0]
        }
      )
      this.localStorage.get('currentTrade').subscribe(
        data => {
          if (data != null) {
            this.trade = JSON.parse(data)
            this.trade = data.currentTrade
          }
        }
      )
  }
  declare ws: WebSocket;
  valeur: any[] = [];



  createObservableSocket(url: string): Observable<any> {
    console.log(this.datauser);
    
    return new Observable(
      (subscriber: Subscriber<WebSocket>): TeardownLogic => {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
          subscriber.next(this.ws);
          // subscriber.complete();
          this.ws.send(JSON.stringify(
            {
              'token': this.datauser.token,
              'signature': this.datauser.signature,
              'tradeId': this.trade.id
            }
          ))
        };
        this.ws.onmessage = (event) => {
          subscriber.next.bind(event.data)
          this.localStorage.set('dataSocket', event.data)

        }
        this.ws.onerror = (err) => {
          console.error("Websocket errored while trying to this.wsect", err);
          subscriber.error(err);
        };
        this.ws.onclose = (ev) => {
          console.log("Websocket closed before having emitted any message");
          subscriber.complete();
          // this.localStorage.remove('dataSocket')
        };
      }
    );
  }
  sendMessage(message: any): any {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log(this.ws.readyState);
      
        this.ws.send(JSON.stringify(
          message
         ));
       
       return `Sent to server `;
    } else {
      return 'Message was not sent - the socket is closed';
     }
  }

  closeSocket(){  
    console.log('testeuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuur');
    
    this.ws.close = e => {console.log(e)}
  }


}