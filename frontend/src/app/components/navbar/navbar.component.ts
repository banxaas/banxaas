import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  token: any


  currencyForm = new FormGroup({
    token: new FormControl(),
    signature: new FormControl(),
    currency: new FormControl(),
  })

  pseudo!: string | null;
  devise: any;

  isListProfil: any;
  isListDevise: any;
  datatauser: any
  private unsubscription$ = new Subject<void>();

  constructor(
    private localStorage: LocalStorageService,
    private customerService: CustomerService,
  ) { 

    this.localStorage.get('data').subscribe(
      data => {
        this.datatauser = JSON.parse(data);
        this.pseudo = this.datatauser.user.pseudo;
        this.devise = this.datatauser.user.currency;
        this.token = this.datatauser.token
      }
    )

  }
  
  ngOnInit(): void {
  }

  setCurrency() {

    const dataCurrencyForm = this.currencyForm.value;
    dataCurrencyForm.token = this.datatauser.token;
    dataCurrencyForm.signature = this.datatauser.signature;
    console.log(dataCurrencyForm);

    this.customerService.setUserAccount(dataCurrencyForm)
    .pipe(takeUntil(this.unsubscription$))
    .subscribe(
      response => {
        console.log(response);

        const status = response.status
        if (status === "SUCCESSFUL") {
          this.localStorage.set('currency', dataCurrencyForm.currency)
          this.localStorage.get('currency')
          .pipe(takeUntil(this.unsubscription$))
          .subscribe(
            data => {
              this.devise = data;
            }
          )
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


