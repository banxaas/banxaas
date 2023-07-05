import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from 'app/parameters/customerservice';
import { LocalStorageService } from 'app/parameters/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  host: {
    'class': 'sticky top-0 w-full z-20'
  }
})
export class NavbarComponent implements OnInit, OnDestroy {

  token: any


  currencyForm = new FormGroup({
    token: new FormControl(),
    signature: new FormControl(),
    currency: new FormControl(),
  })

  profilForm = new FormGroup({
    profil: new FormControl()
  })

  pseudo!: string | null;
  devise: any;
  val!: string

  isListProfil: any;
  isListDevise: any;
  datatauser: any
  private unsubscription$ = new Subject<void>();

  constructor(
    private localStorage: LocalStorageService,
    private customerService: CustomerService,
    private router: Router
  ) {

    this.localStorage.get('data').subscribe(
      data => {
        this.datatauser = JSON.parse(data);
        if (this.datatauser) {
          this.pseudo = this.datatauser.user.pseudo;
          this.devise = this.datatauser.user.currency;
          this.token = this.datatauser.token
        }
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
  urlProfil(val: string) {

      this.router.navigate(['user/'+val]);
      console.log("tester");


  }
  logout(){
    console.log("logout")
  }

  ngOnDestroy(): void {
    if (this.unsubscription$) {
      this.unsubscription$.next();
      this.unsubscription$.unsubscribe();
    }
  }
}


