import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LocalStorageService } from './parameters/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  timeoutId: any;
  userInactive: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
    ) {
 
    this.checkTimeOut();
    // this.userInactive.subscribe((message) => {
 
    //   alert(message);
    // }
    // );
  }
 
  checkTimeOut() {
 
    this.timeoutId = setTimeout(
 
      () => this.router.navigate(['connexion']), 900000
    );
 
 
  }


  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
 
    clearTimeout(this.timeoutId);
    
    this.checkTimeOut();
  }


}
