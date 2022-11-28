import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/parameters/alert/alert.service';
import { AuthService } from 'src/app/parameters/auth.service';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { WebsocketService } from 'src/app/parameters/websocket.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
  host: {
    'class': 'min-h-screen flex flex-col'
  }
})
export class ConnexionComponent implements OnInit, OnDestroy {
  fieldTextType: boolean = false;
  changeText: boolean = false;
  progress!: boolean;
  status: any;
  wsSubscription!: Subscription;


  private unsubscription$ = new Subject<void>();

  failed_message!: string;

  tokenCcreation = new EventEmitter<RegisterComponent>();
  signin = new FormGroup({
    login: new FormControl('mass', [Validators.required, Validators.pattern('^[a-zA-Z0-9-_]+$')]),
    password: new FormControl('L@coste90', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router,
    private wsService: WebsocketService
  ) {

    this.localStorage.get('dataSocketConnexion').subscribe(
      data => {
        this.status = JSON.parse(data)
      }
    )
  }

  ngOnInit(): void {


    this.localStorage.remove('data')
  }
  get formControls() {
    return this.signin.controls;
  }

  connected() {
    const dataFormSignin = this.signin.value;
    this.authService
      .login(dataFormSignin.login.trim(), dataFormSignin.password.trim())
      .pipe(takeUntil(this.unsubscription$))
        .subscribe(
          data => {
            const status = data.status;
            if (status === 'SUCCESSFUL') {
              this.progress = true;
              this.localStorage.set('token', data.token);
              this.localStorage.set('signature', data.signature);
              this.localStorage.set('declencheur', false);
              this.localStorage.set(
                'paymentMethods',
                JSON.stringify(data.user.paymentMethods)
              );
              this.localStorage.set('data', JSON.stringify(data));

              const webSocketUrl = 'ws://localhost:9000/ws/connexion/';
              this.wsSubscription = this.wsService.createObservableSocketConnexion(webSocketUrl).subscribe(
                response => {
                  console.log(response);
                  this.localStorage.get('dataSocketConnexion').subscribe(
                    response => {
                      this.status = JSON.parse(response)
                      if (this.status.message && this.status.message == "Nouvelle Connexion !") {
                        this.router.navigate(['connexion'])
                      }
                    }
                  )

                }
              )
              console.log(this.status);
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
                    console.log('user');

                  }

                }, 1500)
            }

            if (status === 'INACTIVATED') {
              this.failed_message = data.message;
              this.progress = false;
            }
            if (status === 'FAILED') {
              this.failed_message = data.message;
              this.progress = false;
            }
          },
          error => {
            this.progress = false;
            console.log(error);

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
