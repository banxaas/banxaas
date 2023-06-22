import { Component } from '@angular/core';
import { LocalStorageService } from 'app/parameters/local-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/parameters/auth.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
})
export class UserDropdownComponent {
  datatauser: any;
  pseudo: any;
  email: any;
  constructor(private localStorage: LocalStorageService, private router: Router, private authService: AuthService) {
    this.localStorage.get('data').subscribe((data) => {
      this.datatauser = JSON.parse(data);
      if (this.datatauser) {
        this.pseudo = this.datatauser.user.pseudo;
        this.email = this.datatauser.user.email;
      }
    });
    
  }
  private unsubscription$ = new Subject<void>();

  logout(){
    const dataFormSignin = {};
    this.authService
      .logout(dataFormSignin)
      .pipe(takeUntil(this.unsubscription$))
      .subscribe(
        (data:any) => {
          const status = data.status;
          if (status === 'SUCCESSFUL') {
            this.router.navigate(['']);
            this.localStorage.clear()
            window.location.reload()
          }
        },
        (error:any) => {
          console.log(error);
          this.router.navigate(['']);
          this.localStorage.clear()
          window.location.reload()
        }
      );
   
  }
}
