import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { interval } from 'rxjs';
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
      quantityFixe: new FormControl('', Validators.pattern('^[0-9]*[.]?[0-9]+?$')),
      quantityMin: new FormControl('', Validators.pattern('^[0-9]*[.]?[0-9]+?$')),
      quantityMax: new FormControl('', Validators.pattern('^[0-9]*[.]?[0-9]+?$')),
      amountFixe: new FormControl(''),
      amountMin: new FormControl(''),
      amountMax: new FormControl(''),
      phone: new FormControl('')
  })
  hidden!: boolean;

  paymentForm = new FormGroup({
    token: new FormControl('', [Validators.required]),
    signature: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^(77|78|75|70|76)[0-9]{7}$')]),
  })
  errorMessage: any;
  pseudo: any;
  devise: any;
  dataPaymentMethods: any;
  dataUser: any;
  dataPaymentMethod: any;
  updateSubscription: any;
  prixBtc: any;
  prixfixe: any;
  prixMax: any;
  prixMin: any;
  token: any;
  signature: any;

  constructor(
    private customerService : CustomerService,
    private localStorage : LocalStorageService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.localStorage.get('token').subscribe(
      data => {
        this.token = data
      }
    );
    this.localStorage.get('signature').subscribe(
      data => {
        this.signature = data
      }
    );

    this.fixeHidden = true;

    this.localStorage.get('paymentMethods').subscribe(
      data => {
        this.dataPaymentMethod = JSON.parse(data)


      }
    );
      console.log(this.dataPaymentMethod.length);


    if (this.dataPaymentMethod.length > 0) {
      this.datas = this.dataPaymentMethod
      this.fieldActive = true
    }
    if(this.dataPaymentMethod.length == 0) {

      this.fieldActive = false
    }

    this.localStorage.get('data').subscribe(
      data => {
        this.dataUser = JSON.parse(data);
      }
    )
    this.pseudo = this.dataUser.user.pseudo

    const cfa = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 2
    });

    this.customerService.getRateBitcoin().subscribe(
      response => {
        this.prixBtc = response.data.rate

        this.rate = cfa.format(response.data.rate)
        console.log(this.rate);
      }
    )
    this.primengConfig.ripple = true;

  }
inputCalcule(val: string) {

  if (this.announceForm.value.quantityFixe) {
    var quantity = Number(this.announceForm.value.quantityFixe)
    this.prixfixe = this.prixBtc * quantity

  }
  if (this.announceForm.value.quantityMin || this.announceForm.value.quantityMax) {
    var quantiteMin = Number(this.announceForm.value.quantityMin);
    var quantiteMax = Number(this.announceForm.value.quantityMax);
    this.prixMin = this.prixBtc * quantiteMin
    this.prixMax = this.prixBtc * quantiteMax



  }

}
  hideInputQuantityAmount(){
    if (this.announceForm.value.quantityType === "R") {

      this.rangeHidden = !this.rangeHidden
      this.fixeHidden = false
    }
    if (this.announceForm.value.quantityType === "F") {

      this.fixeHidden = true
      this.rangeHidden = false
    }

  }

  get formControls() {

    return this.paymentForm.controls;
  }
  get formControlsAnnounce() {

    return this.announceForm.controls;
  }


  addAnnounce(){
    const dataForm = this.announceForm.value;
    dataForm.token = this.token;
    dataForm.signature = this.signature;

    if (dataForm.quantityType === "R") {
      dataForm.amountType = "R"
      dataForm.amountMin = String(this.prixMin)
      dataForm.amountMax = String(this.prixMax)
      delete dataForm.amountFixe
      delete dataForm.quantityFixe
    }
    if (dataForm.quantityType === "F") {
      dataForm.amountType = "F"
      dataForm.amountFixe = String(this.prixfixe)
      delete dataForm.amountMin
      delete dataForm.amountMax
      delete dataForm.quantityMin
      delete dataForm.quantityMax
    }

    if (this.datas.length > 0) {
      this.datas.forEach((element: any) => {
        if (element.id = dataForm.provider) {
          dataForm.provider = element.name;
          dataForm.phone = element.phone
        }

      });
    }


    console.log(dataForm);

    this.customerService.addAds(dataForm).subscribe(
      response => {
        console.log(response);
        if (response.status === "SUCCESSFUL") {
          this.messageService.add({key: 'bottomright', severity:'success', summary: 'Successully', detail:'Annonce publiée avec succés!'});
          setTimeout(() => {
            this.router.navigate(['user/offre'])
          }, 1500)

        }
        if (response.status === "FAILED") {
          this.messageService.add({key: 'bottomright', severity:'error', summary: 'Erreur', detail:'Création annonce échoué'});
          this.errorMessage = response.message;
        }

      },
      error => {
        console.log(error);
        this.messageService.add({key: 'bottomright', severity:'error', summary: 'Erreur', detail:'Création annonce échoué'});

      }
    )

  }

  setPaymentMethod() {


    const dataForm = this.paymentForm.value;
    dataForm.token = this.dataUser.token;
    dataForm.signature = this.dataUser.signature;
    this.customerService.addPaymentMethod(dataForm).subscribe(
      response => {
        console.log(dataForm);
        console.log(response);
        const status = response.status
        if (status === "SUCCESSFUL") {
          this.localStorage.set('paymentMethods', JSON.stringify([response.paymentMethod]));
          this.hidden = false
          this.messageService.add({key: 'bottomright', severity:'success', summary: 'Successully', detail:'Succés!'});
          window.location.reload()
        }
        // {status: 'FAILED', message: 'Payment Method already exists!'}
        if (status === 'FAILED' && response.message === 'Payment Method already exists!') {
          this.errorMessage = response.message
          this.messageService.add({key: 'bottomright', severity:'error', summary: 'Erreur', detail:'Cet moyen de paiement exiiste déjà'});

        }

      }
    )

  }
  toggleModal() {
    this.hidden = true;
  }
  // showMessage() {
  //   this.messageService.add({key: 'bottomright', severity:'success', summary: 'Successully', detail:'Annonce publiée avec succés!'});
  // }
}
