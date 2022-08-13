import { Injectable } from '@angular/core';
import {Observable, Subscriber, TeardownLogic } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class WebsocketService {


  constructor(
    private localStorage: LocalStorageService
  ) {
    
  }
  declare ws: WebSocket;
  valeur: any[] = [];
  // socketIsOpen = 1;

  // createObservableSocket(url: string, message: any): Observable<any> {
  //    this.ws = new WebSocket(url);
  //   return new Observable(
  //      observer => {

  //       this.ws.onmessage = (event) => observer.next(event.data);

  //       this.ws.onerror = (event) => observer.error(event);

  //       if (this.ws.readyState === 0) {
  //         this.ws.send(JSON.stringify(message))
  //       }
  //       this.ws.onclose = (event) => observer.complete();
        
  //       return () =>
  //           this.ws.close(1000, "The user disthis.wsected");
  //      }
  //   );
  // }



  createObservableSocket(url: string): Observable<any> {
    return new Observable(
      (subscriber: Subscriber<WebSocket>): TeardownLogic => {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
          subscriber.next(this.ws);
          // subscriber.complete();
          this.ws.send(JSON.stringify(
            {
              'token': this.localStorage.get('token'),
              'tradeId': this.localStorage.get('tradeId'),
              'signature': this.localStorage.get('signature')
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


}