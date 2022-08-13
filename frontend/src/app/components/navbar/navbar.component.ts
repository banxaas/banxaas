import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  token: any


  currencyForm = new FormGroup({
    token: new FormControl(),
    signature: new FormControl(),
    currency: new FormControl(),
  })

  pseudo!: string | null;
  devise!: string | null;

  isListProfil: any;
  isListDevise: any;

  constructor(
    private localStorage: LocalStorageService,
    private customerService: CustomerService,
  ) { }
  
  ngOnInit(): void {
    this.token = this.localStorage.get('token');
    // console.log(this.token);
    const datauser: any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
    const curr = this.localStorage.get('currency')
    this.devise = curr
  }
  setCurrency() {

    const datauser: any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    // const curr = this.localStorage.get('currency')
    // this.currency = curr

    const dataCurrencyForm = this.currencyForm.value;
    dataCurrencyForm.token = data.token;
    dataCurrencyForm.signature = data.signature;
    console.log(dataCurrencyForm);
  
    this.customerService.setUserAccount(dataCurrencyForm).subscribe(
      response => {
        console.log(response);

        const status = response.status
        if (status === "SUCCESSFUL") {
          this.localStorage.set('currency', dataCurrencyForm.currency)
          const curr = this.localStorage.get('currency')
          this.devise = curr
        }
      },
      error => {
        console.log(error);

      }
    )
  
  
    }
  }


