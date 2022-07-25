import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-announce',
  templateUrl: './announce.component.html',
  styleUrls: ['./announce.component.scss']
})
export class AnnounceComponent implements OnInit {

  rangeHidden!:any;
  fixeHidden!:any;
  rate!:any;
  datas: any;
  
  fieldActive!: boolean;

  announceForm = new FormGroup({
      token: new FormControl(''),
      signature: new FormControl(''),
      sens: new FormControl(''),
      quantityType: new FormControl(''),
      amountType: new FormControl(''),
      marge: new FormControl(''),
      provider: new FormControl(''),
      quantityFixe: new FormControl(''),
      quantityMin: new FormControl(''),
      quantityMax: new FormControl(''),
      amountFixe: new FormControl(''),
      amountMin: new FormControl(''),
      amountMax: new FormControl('')
  })
  errorMessage: any;
  pseudo: any;
  devise!: string | null;

  constructor(
    private customerService : CustomerService,
    private localStorage : LocalStorageService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) { }

  ngOnInit(): void {

            
    const dataPaymentMethods: any = this.localStorage.get('paymentMethods');
    let data = JSON.parse(dataPaymentMethods);
    
    const datauser: any = this.localStorage.get('data');
    let username = JSON.parse(datauser);
    this.pseudo = username.user.pseudo
    
    
    const curr = this.localStorage.get('currency')
    this.devise = curr

    if (data.length == 0) {
      console.log("test");

      this.fieldActive = false
    }
    if (data.length > 0) {
      this.datas = data
      this.fieldActive = true
    }
    
    const cfa = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 2
    });
    
    this.customerService.getRateBitcoin().subscribe(
      response => {
        this.rate = cfa.format(response.data.rate)
        console.log(this.rate);
      }
    )
    this.primengConfig.ripple = true;

  }

  hideInputQuantityAmount(){
    if (this.announceForm.value.quantityType === "R") {
      
      this.rangeHidden = !this.rangeHidden
      this.fixeHidden = false
    }
    if (this.announceForm.value.quantityType === "F") {
      
      this.fixeHidden = !this.fixeHidden
      this.rangeHidden = false
    }
    
  }

  addAnnounce(){
    const datauser: any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    const dataForm = this.announceForm.value;
    dataForm.token = data.token;
    dataForm.signature = data.signature;
    if (dataForm.quantityType === "R") {
      dataForm.amountType = "R"
      delete dataForm.amountFixe
      delete dataForm.quantityFixe
    }
    if (dataForm.quantityType === "F") {
      dataForm.amountType = "F"
      delete dataForm.amountMin
      delete dataForm.amountMax
      delete dataForm.quantityMin
      delete dataForm.quantityMax
    }
    console.log(dataForm);
    
    this.customerService.addAds(dataForm).subscribe(
      response => {
        console.log(response);
        if (response.status === "SUCCESSFUL") {
          this.router.navigate(['user/offre'])
        }
        if (response.status === "FAILED") {
          this.errorMessage = response.message;
        }
        
      },
      error => {
        console.log(error);
        
      }
    )

  }
  showMessage() {
    this.messageService.add({severity:'success', summary: 'Successully', detail:'Annonce publiée avec succés!'});
  }
}
