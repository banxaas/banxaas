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
          subscriber.complete();
        };
        this.ws.onmessage = (event) => {
          subscriber.next.bind(event.data)
          console.log(event.data);
          this.localStorage.set('dataSocket', event.data)
          
          const value = JSON.parse(event.data)
          this.valeur.push(value)

        }
        this.ws.onerror = (err) => {
          console.error("Websocket errored while trying to this.wsect", err);
          subscriber.error(err);
        };
        this.ws.onclose = (ev) => {
          console.log("Websocket closed before having emitted any message");
          subscriber.complete();
          this.localStorage.remove('dataSocket')
        };
      }
    );
  }
  sendMessage(message: any): any {
    if (this.ws.readyState === WebSocket.OPEN) {
       this.ws.send(JSON.stringify(message));
       return `Sent to server ${message}`;
    } else {
      return 'Message was not sent - the socket is closed';
     }
  }
  // sendMessage(socket: any) {
  //   // if the onmessage property is defined, it means that this websocket is already in use by
  //   // some component which is interested in its message stream
  //   if (socket.onmessage) {
  //     throw new Error(
  //       "Websocket has already a function set to manage the message stream"
  //     );
  //   }
  //   return new Observable(
  //     (subscriber: Subscriber<MessageEvent>): TeardownLogic => {
  //       socket.onmessage = (msg: MessageEvent) => {
  //         subscriber.next(msg);
  //       };
  //       socket.onerror = (err: any) => {
  //         console.error("Websocket errored while sgreaming messages");
  //         subscriber.error(err);
  //       };
  //       socket.onclose = () => {
  //         console.log("Websocket closed");
  //         subscriber.complete();
  //       };
  //       return () => {
  //         // clean the onmessage callback when the Observable is unsubscribed so that we can safely check
  //         // whether the onmessage callback is null or undefined at the beginning of this function
  //         socket.onmessage = null;
  //       };
  //     }
  //   );
  // }
}