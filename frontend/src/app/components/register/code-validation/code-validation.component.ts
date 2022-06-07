import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/parameters/auth.service';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-code-validation',
  templateUrl: './code-validation.component.html',
  styleUrls: ['./code-validation.component.scss']
})
export class CodeValidationComponent implements OnInit {

  errorMessage!: string;

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
    const data = this.valide.value;
    this.valide.value.token = this.localStorage.get('token_validation');
    data.code = Number.parseInt(data.code);
    console.log(typeof(data.code));
    console.log(data.code);
    
    console.log(this.valide.value);
    
    this.authService.validAccount(data.code, data.token).subscribe(
      response => {
        console.log(response);
        
        if (response.status === "SUCCESSFUL") {
          this.localStorage.remove('token');
          this.router.navigate(['connexion'])
        }
        if (response.status === "FAILED") {
          this.errorMessage = response.message
        }

        
      },
      error => {
        this.errorMessage = "Erreur Serveur"
      }
    )

  }


  

}
