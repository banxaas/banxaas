import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/parameters/alert/alert.service';
import { AuthService } from 'src/app/parameters/auth.service';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnInit {
  fieldTextType: boolean = false;
  changeText: boolean = false;
  progress!: boolean;

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
  // Li La yokou pour que à chaque fois nga am motif reload ça fait un self callback
  // Le reste j'ai rien touché c'est juste le formatage
  // J'espère que yakoumafi lou beuri
  // verifyConnexion(token: string, signature: string) {
  //   this.authService.uniqConnexion(token, signature).subscribe(
  //     (reponse) => {
  //     console.log(reponse);
  //     if (reponse.status == true && reponse.motif === 'New Connexion') {
  //       this.localStorage.remove('data');
  //       this.router.navigate(['connexion']);
  //     }

  //     if (reponse.status == true && reponse.motif === 'Validate Code') {
  //       this.router.navigate(['validation_code']);
  //     }
  //     if (reponse.status == true && reponse.motif === 'Reload') {
  //       this.verifyConnexion(token, signature);
  //     }
  //   });
  // }

  connected() {
    const dataFormSignin = this.signin.value;
    this.authService
      .login(dataFormSignin.login, dataFormSignin.password)
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
            // this.verifyConnexion(data.token, data.signature);
            /*
            this.authService
              .uniqConnexion(data.token, data.signature)
              .subscribe((reponse) => {
                console.log(reponse);
                if (
                  reponse.status == true &&
                  reponse.motif === 'New Connexion'
                ) {
                  this.localStorage.remove('data');
                  this.router.navigate(['connexion']);
                }

                if (
                  reponse.status == true &&
                  reponse.motif === 'Validate Code'
                ) {
                  this.router.navigate(['validation_code']);
                }
              });*/
              setTimeout(() => {
                if (data.user.currentTrade.length>0) {
                  

                  if (data.user.pseudo == data.user.currentTrade[0].ad.user.pseudo && data.user.currentTrade[0].ad.sens == 'V') {

                    this.router.navigate(['user/transaction/achat/vendeur']);

                  }

                  if (data.user.pseudo == data.user.currentTrade[0].trader.pseudo && data.user.currentTrade[0].ad.sens == 'V') {

                    this.router.navigate(['user/transaction/achat/acheteur']);

                  }
                  
                  if (data.user.pseudo == data.user.currentTrade[0].trader.pseudo && data.user.currentTrade[0].ad.sens == 'A') {

                    this.router.navigate(['user/transaction/vente/vendeur']);

                  }
                  
                  if (data.user.pseudo == data.user.currentTrade[0].ad.user.pseudo && data.user.currentTrade[0].ad.sens == 'A') {

                    this.router.navigate(['user/transaction/vente/acheteur']);

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
        },
        (erreur) => {
          console.log(erreur);
        }

        //   const token = response.tokenId;
        //   this.localStorage.set('token', token);
        //   const status = response.status;

        //   // if (status === "SUCCESSFUL") {
        //   //   // this.router.navigate(['user']);
        //   // }
        //   // if (status === "INACTIVATED") {
        //   //   this.failed_message = response.message
        //   // }
        //   // if (status === "FAILED") {
        //   //   this.failed_message = response.message
        //   // }

        // }
        // response => {
        //   console.log(response);

        //   // this.authService.uniqConnexion(res.key, res.signature).subscribe(
        //   //   resp => {
        //   //     console.log(resp);

        //   //   }
        //   // )
        // }
      );

    // this.authService.uniqConnexion(stockdata.key, stockdata.signature).subscribe(
    //   res => {
    //     console.log(res);

    //   }
    // )
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  progressSpinner(){
    this.progress = true
  }
}
