import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AlertService } from 'app/parameters/alert/alert.service';
import { AuthService } from 'app/parameters/auth.service';
import { CustomerService } from 'app/parameters/customerservice';
import { LocalStorageService } from 'app/parameters/local-storage.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent implements OnInit {

  errorMessage!: string
  pseudo!: string
  fieldPhone!: boolean;
  fieldEmail!: boolean;

  formCompte = new FormGroup({
    token: new FormControl(),
    signature: new FormControl(),
    pseudo: new FormControl(),
    email: new FormControl(),
    phone: new FormControl()
  })
  hidden!: boolean;
  datauser: any;

  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private customeService: CustomerService,
    private alerte: AlertService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) { }

  showMessage() {
    this.messageService.add({severity:'success', summary: 'Successully', detail:'Compte modifié, veuillez-vous reconnecter'});
  }
  ngOnInit(): void {

    this.localStorage.get('data').subscribe(
      data => {
        this.datauser = JSON.parse(data)
        this.pseudo = this.datauser.user.pseudo;

      }
    );

    if (this.datauser .user.phone == null) {
      this.fieldEmail = true
      this.fieldPhone = false
    }
    if (this.datauser .user.email == null) {
      this.fieldPhone = true
      this.fieldEmail = false
    }
    this.primengConfig.ripple = true;

  }

  toggleModal() {
    this.hidden = true;
  }
  dismissModal() {
    this.hidden = false;
  }
  setUser(){
    this.localStorage.get('data').subscribe(
      data => {
        this.datauser = JSON.parse(data)
        this.pseudo = this.datauser.user.pseudo;

      }
    );

    const dataForm = this.formCompte.value;
    dataForm.token = this.datauser.token;
    dataForm.signature = this.datauser.signature;

    if (dataForm.pseudo == null) {
      delete dataForm.pseudo
    }
    if (dataForm.email == null) {
      delete dataForm.email
    }
    if (dataForm.phone == null) {
      delete dataForm.phone
    }
    console.log(dataForm);

    this.customeService.setUserAccount(dataForm).subscribe(
      response => {
        console.log(response);

        const status = response.status
        if (status === "SUCCESSFUL") {
          this.localStorage.remove('token_validation')
          this.localStorage.set('token_validation', response.token)
          if (dataForm.pseudo) {
            this.showMessage()
            this.router.navigate(['connexion']);
          }
          if (dataForm.email || dataForm.phone || (dataForm.email && dataForm.pseudo) || (dataForm.phone && dataForm.pseudo)) {
            this.router.navigate(['validation_code'])
          }
          // this.authService.uniqConnexion(dataForm.token, dataForm.signature).subscribe(
          //   reponse => {
          //     console.log(reponse);

          //     if (reponse.status == true && reponse.motif === "New Connexion") {
          //       this.alerte.onAlert('test')
          //       this.router.navigate(['connexion']);
          //     }
          //     if (reponse.status == true && reponse.motif === "Validate Code") {
          //       this.localStorage.remove('data')
          //       this.router.navigate(['validation_code']);
          //     }
          //   }
          // )

        }
        else{
          this.errorMessage = "Erreur";

        }
      }
    );
  }

}
