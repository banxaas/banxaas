import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/parameters/auth.service';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  fieldTextType: boolean = false;
  changeText: boolean = false;  
  inputVisisble: boolean = false;
  submitted: boolean = false;

  errorMessage!: string;
  failed!: string;
  
  register = new FormGroup({
    pseudo: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$')]),
    email: new FormControl('', [Validators.required, Validators.pattern('([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9]+\\.(([A-Za-z0-9]+[.-_])*[A-Za-z0-9]){2,}')]),
    // "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
    phone: new FormControl('', [Validators.required, Validators.pattern('^(77|78|75|70|76)[0-9]{7}$')]),
    box: new FormControl('', [Validators.required]),
  })

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {  
    
  }

  get formControls(){
    
    return this.register.controls;
  }

  inputHidden(){
    this.inputVisisble = !this.inputVisisble 
  }
  
  create(){
    const val = this.register.value ;
    let username
    if (val.email != "") {
      username = val.email

    }
    if (val.phone != "") {
      username = val.phone    
    }  
    console.log(val);
    this.authService.createAccount(val.pseudo, val.password, username ).subscribe(
      response => {
        const token = response.tokenId;
        this.localStorage.set('tokenId', token);
        const status = response.status;
        console.log(status.message);
        
        if (status === 'FAILED') {
          this.failed = response.message;
        }
        if (token != null) {
          this.router.navigate(["validation_code"]);
        }

        // switch (status) {
        //   case 'FAILED_USER':
        //     this.failed_user = response.message;
        //     break;
        //   case 'FAILED_PSEUDO':
        //     this.failed_pseudo = response.message;
        //     break;
        //   case 'FAILED_MAIL':
        //     this.failed_mail = response.message;
        //     break;
        //   case 'FAILED_PHONE':
        //     this.failed_phone = response.message;
        //     break;
        //   default:
        //     this.router.navigate(["validation_code"]);
        // }
      }
    )
  }

  toggleFieldTextType() {
    
    this.fieldTextType = !this.fieldTextType;
  }

}
