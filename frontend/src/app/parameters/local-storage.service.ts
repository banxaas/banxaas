import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storageSub= new Subject<any>();
  private behaviorSubjects: Map<string, BehaviorSubject<any>>;

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }
  constructor() {

		this.behaviorSubjects = new Map<string, BehaviorSubject<any>>();

   }

  // tslint:disable-next-line: typedef
  set(key: string, data: any){
    localStorage.setItem(key, data);
    this.getBehaviorSubject(key).next(data);
  }

  // tslint:disable-next-line: typedef
  // get(key: string){
  //   localStorage.getItem(key);
  //   this.storageSub.next({ key: key });
  // }

  // tslint:disable-next-line: typedef
  remove(key: string){
    localStorage.removeItem(key);
    this.storageSub.next({ key: key, value: null });
  }

  // tslint:disable-next-line: typedef
  clear(){
    localStorage.clear();
  }





	private getBehaviorSubject(identifier: string): BehaviorSubject<any> {
		let behaviorSubject: any = this.behaviorSubjects.get(identifier);
		if (!behaviorSubject) {
			behaviorSubject = new BehaviorSubject<any>(null);
			this.behaviorSubjects.set(identifier, behaviorSubject);
		}

		return behaviorSubject;
	}


  public get(key: string): BehaviorSubject<any> {
		const behaviorSubject = this.getBehaviorSubject(key);
		const item = localStorage.getItem(key);
		behaviorSubject.next(item);
		return behaviorSubject;
	}

}