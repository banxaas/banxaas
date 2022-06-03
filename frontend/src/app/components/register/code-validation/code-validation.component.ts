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
    private localStorgae: LocalStorageService,
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
    this.valide.value.token = this.localStorgae.get('token');
    this.authService.validAccount(data.code, data.token).subscribe(
      response => {
        if (response.status === "SUCCESSFUL") {
          this.localStorgae.remove('token');
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
