import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AlertService } from 'src/app/parameters/alert/alert.service';
import { AuthService } from 'src/app/parameters/auth.service';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

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
 
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;

    if (data.user.phone == null) {
      this.fieldEmail = true
      this.fieldPhone = false
    }
    if (data.user.email == null) {
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
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    console.log(data);
    
    const dataForm = this.formCompte.value;
    dataForm.token = data.token;
    dataForm.signature = data.signature;
    
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
 