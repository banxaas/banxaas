import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/parameters/alert/alert.service';
import { AuthService } from 'src/app/parameters/auth.service';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnInit, OnDestroy {
  fieldTextType: boolean = false;
  changeText: boolean = false;
  progress!: boolean;

  private unsubscription$ = new Subject<void>();

  failed_message!: string;

  tokenCcreation = new EventEmitter<RegisterComponent>();
  signin = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.localStorage.clear()
  }
  get formControls() {
    return this.signin.controls;
  }

  connected() {
    const dataFormSignin = this.signin.value;
    this.authService
      .login(dataFormSignin.login, dataFormSignin.password)
      .pipe(takeUntil(this.unsubscription$))
        .subscribe(
          (data) => {

            const status = data.status;

            if (status === 'SUCCESSFUL') {
              this.localStorage.set('token', data.token);
              this.localStorage.set('signature', data.signature);
              this.localStorage.set('currency', data.user.currency);
              this.localStorage.set('declencheur', false);
              this.localStorage.set(
                'paymentMethods',
                JSON.stringify(data.user.paymentMethods)
              );
              this.localStorage.set('data', JSON.stringify(data));
                setTimeout(() => {
                  if (data.user.currentTrade.length>0) {
                    

                    if (data.user.pseudo == data.user.currentTrade[0].ad.user.pseudo && data.user.currentTrade[0].ad.sens == 'V') {

                      this.router.navigate(['user/transaction/vendeur']);

                    }

                    if (data.user.pseudo == data.user.currentTrade[0].trader.pseudo && data.user.currentTrade[0].ad.sens == 'V') {

                      this.router.navigate(['user/transaction/acheteur']);

                    }
                    
                    if (data.user.pseudo == data.user.currentTrade[0].trader.pseudo && data.user.currentTrade[0].ad.sens == 'A') {

                      this.router.navigate(['user/transaction/vendeur']);

                    }
                    
                    if (data.user.pseudo == data.user.currentTrade[0].ad.user.pseudo && data.user.currentTrade[0].ad.sens == 'A') {

                      this.router.navigate(['user/transaction/acheteur']);

                    }
                  }
                  else {
                    this.router.navigate(['user']);
                  }
                  
                }, 1500)
            }

            if (status === 'INACTIVATED') {
              this.failed_message = data.message;
            }
            if (status === 'FAILED') {
              this.failed_message = data.message;
            }
          }
      );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  progressSpinner(){
    this.progress = true
  }

  ngOnDestroy(): void {
    if (this.unsubscription$) {
      this.unsubscription$.next();
      this.unsubscription$.unsubscribe();
    }
  }
}
