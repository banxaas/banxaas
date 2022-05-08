import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/parameters/auth.service';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  fieldTextType: boolean = false;
  changeText: boolean = false;

  failed_message!: string;

  tokenCcreation = new EventEmitter<RegisterComponent>();
  signin = new FormGroup({
    username: new FormControl('mass', [Validators.required]),
    password: new FormControl('passer', [Validators.required]),
  })

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router
  ) { }



  ngOnInit(): void {

  }
  get formControls(){
    return this.  signin.controls;
  }

  connected(){

    const value = this.signin.value;


    this.authService.login(value.username, value.password).subscribe(
      response => {
        console.log(response);
        const token = response.tokenId;
        this.localStorage.set('token', token);
        const status = response.status;
        if (status === "SUCCESSFUL") {
          this.router.navigate(['home']);
        }
        if (status === "INACTIVATED") {
          this.failed_message = response.message
        }
        if (status === "FAILED") {
          this.failed_message = response.message
        }
      })

  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
