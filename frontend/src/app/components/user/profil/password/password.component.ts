import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { AlertService } from 'src/app/parameters/alert/alert.service';
import { AuthService } from 'src/app/parameters/auth.service';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { CustomValidators } from 'src/app/providers/confirmed.valiadtor';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {


  // registerForm = new FormGroup(
  //   {
  //   passwordActuel: new FormControl('', [Validators.required]),
  //   newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$')]),
  //   confirmPassword: new FormControl('', [Validators.required]),

  //   },
  //   {
  //     validator: 
  //   }
  // )
  errorMessage = '';
  fieldTextTypeActual: boolean = false;
  fieldTextTypeNew: boolean = false;
  fieldTextTypeConfirm: boolean = false;

  passwordForm = new FormGroup(
    {
      
      token: new FormControl(''),
      signature: new FormControl(''),
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$')]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$')])
    },

    [CustomValidators.MatchValidator("newPassword", "confirmPassword")]// insert here
  );

  submitted = false;
  hidden!: boolean;
  constructor(
    private customerService : CustomerService,
    private localStorage : LocalStorageService,
    private authService : AuthService,
    private router : Router,
    private alert : AlertService,
    private primengConfig : PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

  }

  toggleModal() {
    this.hidden = true;
  }

  toggleFieldTextTypeActual() {
    this.fieldTextTypeActual = !this.fieldTextTypeActual
  }  
  toggleFieldTextTypeNew() {
    this.fieldTextTypeNew = !this.fieldTextTypeNew
  } 
   toggleFieldTextTypeConfirm() {
    this.fieldTextTypeConfirm = !this.fieldTextTypeConfirm
  }

  get passwordMatchError() {
    return (
      this.passwordForm.getError('mismatch') &&
      this.passwordForm.get('confirmPassword')?.touched
    );
  }
  get formControls(){
    
    return this.passwordForm.controls;
  }

  setPassword(){
    
      const datauser:any = this.localStorage.get('data');
      const data = JSON.parse(datauser);
   
      const dataFormPassword = this.passwordForm.value;
      dataFormPassword.token = data.token;
      dataFormPassword.signature = data.signature;
      delete dataFormPassword.confirmPassword;
      console.log(dataFormPassword);
      this.customerService.setUserAccount(dataFormPassword).subscribe(
        response => {
            console.log(response);
            const status = response.status
            if(status === "SUCCESSFUL"){
              this.authService.uniqConnexion(data.token, data.signature).subscribe(
                reponse => {
                  console.log(reponse);
                  if (reponse.status == true && reponse.motif === "New Connexion") {
                    this.router.navigate(['connexion']);
                  }
                });
            }
            if (status === "FAILED") {
              this.errorMessage = response.message;
              console.log(this.errorMessage);
              
            }
            
        }
      )
          
  }

}
