import { formatNumber } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
        
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
        
        if (response.status === "SUCCESSFUL") {
          this.localStorage.remove('token_validation');
          this.errorMessage = "Inscription Réussie"
          setTimeout(() => {
            this.router.navigate(['connexion'])
          }, 3000 )
        }
        if (response.status === "FAILED") {
          this.errorMessage = response.message
        }

        
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
