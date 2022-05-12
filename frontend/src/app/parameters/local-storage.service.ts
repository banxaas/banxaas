import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // tslint:disable-next-line: typedef
  set(key: string, value: any){
    localStorage.setItem(key, value);
  }

  // tslint:disable-next-line: typedef
  get(key: string){
    return localStorage.getItem(key);
  }

  // tslint:disable-next-line: typedef
  remove(key: string){
    localStorage.removeItem(key);
  }
}