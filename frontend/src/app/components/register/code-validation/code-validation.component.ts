import { formatNumber } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import  jwt_decode from 'jwt-decode'
import jwtDecode from 'jwt-decode';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/parameters/auth.service';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-code-validation',
  templateUrl: './code-validation.component.html',
  styleUrls: ['./code-validation.component.scss']
})
export class CodeValidationComponent implements OnInit, OnDestroy {

  errorMessage!: string;

  private unsubscription$ = new Subject<void>();

  valide = new FormGroup({
    code: new FormControl('', [Validators.required]),
    token: new FormControl('', [Validators.required])
  })
  resendCodeForm = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required])
  })
  status: any;
  tokenValidation: any;

  

  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private jwtService: JwtHelperService,
    private router: Router) 
  {
  
   }


  ngOnInit(): void {
      
      this.localStorage.get('token_validation').subscribe(
        data => {
          this.tokenValidation = this.jwtService.decodeToken(data)
          console.log(this.tokenValidation);
          
        }
      )
        
  }

  get formControls(){
    return this.valide.controls;
  }

  validerCompte(){
    const dataForm = this.valide.value;
    this.localStorage.get('token_validation')
    .pipe(takeUntil(this.unsubscription$))
    .subscribe(
      data => {
          dataForm.token = data
      }
    )

    dataForm.code = Number.parseInt(dataForm.code)

    
    this.authService.validAccount(dataForm.code, dataForm.token)
    .pipe(takeUntil(this.unsubscription$))
    .subscribe(
      response => {
        console.log(response);
        this.status = response.status
        
        if (response.status === "SUCCESSFUL") {
          this.localStorage.remove('token_validation');
          this.errorMessage = "Inscription Réussie"
          setTimeout(() => {
            this.router.navigate(['connexion'])
          }, 1500 )
        }
        if (response.status === "FAILED") {
          this.errorMessage = response.message
        }

        
      }
    )

  }  
  resendNewCode(){

    const data = this.resendCodeForm.value ;

    if (this.tokenValidation.userIdType == 'email') {

      data.email = this.tokenValidation.userId 
      delete data.phone  
      
    }

    if (this.tokenValidation.userIdType == 'phone') {

      data.phone = this.tokenValidation.userId 
      delete data.email  
      
    }
    console.log(data);
    
    this.authService.sendNewValidationCode(data)
    .pipe(takeUntil(this.unsubscription$))
    .subscribe(
      response => {
        
        const token = response.token;
        this.status = response.status;
        this.localStorage.set('token_validation', token);
        window.location.reload();
        console.log(response);
        
      }
    )

  }
  ngOnDestroy(): void {
    if (this.unsubscription$) {
      this.unsubscription$.next();
      this.unsubscription$.unsubscribe();
    }
  }

}
