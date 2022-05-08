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
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    box: new FormControl('', [Validators.required]),
  })

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.formControls['email']);
    
    
  }

  get formControls(){
    return this.register.controls;
  }

  inputHidden(){
    this.inputVisisble = !this.inputVisisble 
  }
  
  create(){
    this.submitted = true;
    // if (this.register.invalid) {
    //   return;
    // }
    const val = this.register.value ;
    console.log(val);
    
    console.log(this.register.controls);
    this.authService.createAccount(val.pseudo, val.password, val.email, val.phone).subscribe(
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
