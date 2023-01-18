import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { AlertService } from 'app/parameters/alert/alert.service';
import { AuthService } from 'app/parameters/auth.service';
import { CustomerService } from 'app/parameters/customerservice';
import { LocalStorageService } from 'app/parameters/local-storage.service';
import { CustomValidators } from 'app/providers/confirmed.valiadtor';

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
  datauser: any;
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
    
    this.localStorage.get('data').subscribe(
      data => {
        this.datauser = JSON.parse(data)

      }
    );
   
      const dataFormPassword = this.passwordForm.value;
      dataFormPassword.token = this.datauser.token;
      dataFormPassword.signature = this.datauser.signature;
      delete dataFormPassword.confirmPassword;
      console.log(dataFormPassword);
      this.customerService.setUserAccount(dataFormPassword).subscribe(
        response => {
            console.log(response);
            const status = response.status
            if(status === "SUCCESSFUL"){
                this.router.navigate(['connexion']);
            }
            if (status === "FAILED") {
              this.errorMessage = response.message;
              console.log(this.errorMessage);
              
            }
            
        }
      )
          
  }

}
