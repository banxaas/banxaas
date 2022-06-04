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
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
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

    const dataFormSignin = this.signin.value;
    this.authService.login(dataFormSignin.login, dataFormSignin.password).subscribe(
      
      
      (data) => {
        
        this.localStorage.set('status', data.status);
        this.localStorage.set('user', data.user.pseudo);
        this.localStorage.set('key', data.key);
        this.localStorage.set('token', data.token);
        this.localStorage.set('signature', data.signature);
        this.localStorage.set('data', JSON.stringify(data));
        console.log(this.localStorage.get('user'));
        
        const status = data.status;
        
        this.authService.uniqConnexion(data.key, data.signature).subscribe(
          reponse => {
            console.log(reponse);
            if (reponse.status = true) {
              this.router.navigate(['connexion']);
            }
          });
        if (status === "SUCCESSFUL") {
          this.localStorage.set('token', data);
          this.router.navigate(['user']);
          
        } 
          
        if (status === "INACTIVATED") {
          this.failed_message = data.message
        }
        if (status === "FAILED") {
          this.failed_message = data.message
        }
      },
      erreur => {
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
    )
    
    
    // this.authService.uniqConnexion(stockdata.key, stockdata.signature).subscribe(
    //   res => {
    //     console.log(res);
        
    //   }
    // )

  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
