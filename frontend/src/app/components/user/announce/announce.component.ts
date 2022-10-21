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
  tel: boolean = true
  
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
      amountMax: new FormControl(''),
      phone: new FormControl('')
  })
  errorMessage: any;
  pseudo: any;
  devise: any;
  dataPaymentMethods: any;
  dataUser: any;

  constructor(
    private customerService : CustomerService,
    private localStorage : LocalStorageService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) { }

  ngOnInit(): void {

            
    this.localStorage.get('paymentMethods').subscribe(
      data => {
        this.dataPaymentMethods = JSON.parse(data)
      }
    )
    
    
    this.localStorage.get('data').subscribe(
      data => {
        this.dataUser = JSON.parse(data);
      }
    )
    this.pseudo = this.dataUser.user.pseudo
    
    
    this.devise = this.dataUser.user.currency

    if (this.dataPaymentMethods.length == 0) {
      console.log("test");

      this.fieldActive = false
    }
    if (this.dataPaymentMethods.length > 0) {
      this.datas = this.dataPaymentMethods
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
    const dataForm = this.announceForm.value;
    dataForm.token = this.dataUser.token;
    dataForm.signature = this.dataUser.signature;
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

    this.datas.forEach((element: any) => {
      if (element.id = dataForm.provider) {
        dataForm.provider = element.name;
        dataForm.phone = element.phone
      }
      
    });
    

    console.log(dataForm);
    
    this.customerService.addAds(dataForm).subscribe(
      response => {
        console.log(response);
        if (response.status === "SUCCESSFUL") {
          setTimeout(() => {
            this.router.navigate(['user/offre'])
          }, 1500)
          
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
    this.messageService.add({key: 'bottomright', severity:'success', summary: 'Successully', detail:'Annonce publiée avec succés!'});
  }
}
