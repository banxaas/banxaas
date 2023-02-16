import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CustomerService } from 'app/parameters/customerservice';
import { LocalStorageService } from 'app/parameters/local-storage.service';
import { WebsocketService } from 'app/parameters/websocket.service';
import { environment } from 'environments/environment';

import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrls: ['./vente.component.scss']
})
export class VenteComponent implements OnInit, OnDestroy {



  wsSubscription!: Subscription;
  copy: any
  seconds: any;
  minutes: any;
  hours: any;
  idhours: any;
  idMinutes: any;
  idSeconds: any;
  updateSubscription: any;
  progress: any;
  spinner!: boolean;
  update: any;
  notif: boolean = false
  fonds: boolean = false
  adrese: boolean = false
  diasbleBtnConfirmSend: boolean = false
  diasbleBtnConfirmAdress: boolean = false

  formAdresseBtc = new FormGroup({
    adresse: new FormControl('bc1qn0r06gtwlamffet49fph9jnm9u2e2ylx5ns7qc', [Validators.required, Validators.pattern('^([13]{1}[a-km-zA-HJ-NP-Z1-9]{26,33}|bc1[a-z0-9]{39,59})$')]),
    txid: new FormControl('', [Validators.required, Validators.pattern('([A-Za-z0-9]){64,}')])
  })
  adresseBtc: boolean = false;
  close: boolean = false;
  pseudo: any;
  tradeHash: any;
  tradeId: any;
  token: any;
  signature: any;
  step: any;
  etape: any;
  pseudoVendeur: any;
  pseudoAcheteur: any;
  montant: any;
  quantityBtc: any;
  paymentMethod: any;
  currency: any
  timeLeft: any;
  timeExp: any;
  time: any;
  timer: any;
  phone: any;
  stepss: any;
  dataCurrentTrades: any;
  dataCurrentTrade: any;
  stop: any;
  textAttente: any;
  boolTextAttente: boolean = false;
  constructor(
    private localStorage : LocalStorageService,
    private wsService: WebsocketService,
    private router: Router,
    private _clipboardService: ClipboardService
  ) {
      this.localStorage.get('data').subscribe(
        data => {
          this.dataCurrentTrades = JSON.parse(data)

        }
      );

      this.localStorage.get('currentTrade').subscribe(
        data => {
          this.dataCurrentTrade = JSON.parse(data)

        }
      );

      this.localStorage.get('dataSocket').subscribe(
        data => {
          this.etape = JSON.parse(data)

        }
      );
   }
  ngOnInit(): void {

    // RECUPERATION DES DONNEES POUR LES AFFICHER DANS LA VUE




    if (this.dataCurrentTrades.user.currentTrade.length > 0) {
      if (this.dataCurrentTrades.user.currentTrade[0].ad.sens === 'V') {
        this.pseudoVendeur = this.dataCurrentTrades.user.currentTrade[0].ad.user.pseudo
        this.pseudoAcheteur = this.dataCurrentTrades.user.currentTrade[0].trader.pseudo
      } else {
        this.pseudoAcheteur = this.dataCurrentTrades.user.currentTrade[0].ad.user.pseudo
        this.pseudoVendeur = this.dataCurrentTrades.user.currentTrade[0].trader.pseudo
      }

      if (this.dataCurrentTrades.user.currentTrade[0].ad.amountType === 'F') {
        this.montant = this.dataCurrentTrades.user.currentTrade[0].ad.amountFixe
      }else{
        this.montant = this.dataCurrentTrades.user.currentTrade[0].ad.amountMin +' - '+this.dataCurrentTrades.user.currentTrade[0].ad.amountMax
      }
      if (this.dataCurrentTrades.user.currentTrade[0].ad.quantityType === 'F') {
        this.quantityBtc = this.dataCurrentTrades.user.currentTrade[0].ad.quantityFixe
      }else{
        this.quantityBtc = this.dataCurrentTrades.user.currentTrade[0].ad.quantityMin +' - '+this.dataCurrentTrades.user.currentTrade[0].ad.quantityMax
      }
      this.paymentMethod = this.dataCurrentTrades.user.currentTrade[0].ad.provider
      this.phone = this.dataCurrentTrades.user.currentTrade[0].ad.phone
      this.currency = this.dataCurrentTrades.user.currency


      this.timeLeft = new Date(this.dataCurrentTrades.user.currentTrade[0].startingDate)
      this.timeLeft = Math.floor(this.timeLeft.getTime());
      this.timeExp = this.timeLeft + 86400000
      this.time = new Date()
      this.time = Math.floor(this.time.getTime());

      if (this.timeExp > this.time) {
        this.timer = this.timeExp - this.time
      }



      // DONNEES UTILES POUR DECLENCHER LA CONNEXION WEBSOCKET
      this.token = this.dataCurrentTrades.token
      this.signature = this.dataCurrentTrades.signature
      this.tradeHash = this.dataCurrentTrades.user.currentTrade[0].tradeHash
      this.tradeId = this.dataCurrentTrades.user.currentTrade[0].id
      const webSocketUrl = environment.webSocketUrl + 'transaction/'+ this.tradeHash + '/';

    this.wsSubscription = this.wsService.createObservableSocket(webSocketUrl).subscribe(
      data => {

        if (this.etape.type === "trade") {
          console.log("step trade")
          this.stepss = this.etape.step
        } else {
          console.log("step no trade")

          this.stepss = this.etape.trade.steps
        }

        if (this.stepss == 2) {
          console.log("step 2")

          this.showNotification()
          // this.disableBtn = false
        }
        if (this.stepss == 3) {
          // this.disableBtn = true
          this.showEnvoiFonds()
        }
        if (this.stepss == 4) {
          this.showClose()
          this.wsService.closeSocket();
        }

      }
    )


    // APRES RECONNXION REDIRIGER VERS L'ETAPE ACTUELLE
    if (this.dataCurrentTrades.user.currentTrade[0].steps === '1') {
      this.showNotification()

    }
    if (this.dataCurrentTrades.user.currentTrade[0].steps === '2') {
      this.showNotification()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 2}))
    }

    if (this.dataCurrentTrades.user.currentTrade[0].steps === '3') {
      this.showEnvoiFonds()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 3}))
    }
    if (this.dataCurrentTrades.user.currentTrade[0].steps === '4' || this.dataCurrentTrades.user.currentTrade[0].steps === '5') {
      this.showClose()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 4}))
      this.wsService.closeSocket();

    }

    }


    if (this.dataCurrentTrades.user.currentTrade.length == 0) {

      if (this.dataCurrentTrade.currentTrade.ad.sens === 'V') {
        this.pseudoVendeur = this.dataCurrentTrade.currentTrade.ad.user.pseudo
        this.pseudoAcheteur = this.dataCurrentTrade.currentTrade.trader.pseudo
      } else {
        this.pseudoAcheteur = this.dataCurrentTrade.currentTrade.ad.user.pseudo
        this.pseudoVendeur = this.dataCurrentTrade.currentTrade.trader.pseudo
      }

      if (this.dataCurrentTrade.currentTrade.ad.amountType === 'F') {
        this.montant = this.dataCurrentTrade.currentTrade.ad.amountFixe
      }else{
        this.montant = this.dataCurrentTrade.currentTrade.ad.amountMin +' - '+this.dataCurrentTrade.currentTrade.ad.amountMax
      }
      if (this.dataCurrentTrade.currentTrade.ad.quantityType === 'F') {
        this.quantityBtc = this.dataCurrentTrade.currentTrade.ad.quantityFixe
      }else{
        this.quantityBtc = this.dataCurrentTrade.currentTrade.ad.quantityMin +' - '+this.dataCurrentTrade.currentTrade.ad.quantityMax
      }
      this.paymentMethod = this.dataCurrentTrade.currentTrade.ad.provider
      this.phone = this.dataCurrentTrade.currentTrade.ad.phone
      this.currency = this.dataCurrentTrades.user.currency


      this.timeLeft = new Date(this.dataCurrentTrade.currentTrade.startingDate)
      this.timeLeft = Math.floor(this.timeLeft.getTime());
      this.timeExp = this.timeLeft + 86400000
      this.time = new Date()
      this.time = Math.floor(this.time.getTime());

      if (this.timeExp > this.time) {
        this.timer = this.timeExp - this.time
      }

      // DONNEES UTILES POUR DECLENCHER LA CONNEXION WEBSOCKET
      this.tradeHash = this.dataCurrentTrade.tradeHash
      this.tradeId = this.dataCurrentTrade.currentTrade.id
      this.localStorage.set('tradeId', this.tradeId)
      // this.tradeId = dataCurrentTrade.user.currentTrade[0].
      this.token = this.dataCurrentTrades.token
      this.signature = this.dataCurrentTrades.signature
      // this.step = this.localStorage.get('step')
      const webSocketUrl = environment.webSocketUrl + 'transaction/'+ this.tradeHash + '/';

      this.wsSubscription = this.wsService.createObservableSocket(webSocketUrl).subscribe(
      data => {
        if (this.etape.type === "trade") {
          this.stepss = this.etape.step
        } else {

          this.stepss = this.etape.trade.steps
        }

        if (this.stepss == 2) {
          this.showNotification()
          // this.disableBtn = false
        }
        if (this.stepss == 3) {
          // this.disableBtn = true
          this.showEnvoiFonds()
        }
        if (this.stepss == 4 || this.stepss == 5) {
          this.showClose()
          this.wsService.closeSocket();
        }

      }
    )
    if (this.dataCurrentTrade.steps === '1') {
      this.showNotification()

    }
    if (this.dataCurrentTrade.steps === '2') {
      this.showNotification()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 2}))
    }

    if (this.dataCurrentTrade.steps === '3') {
      this.showEnvoiFonds()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 3}))
    }
    if (this.dataCurrentTrade.steps === '4' || this.dataCurrentTrade.steps === '5') {
      this.showClose()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 4}))
      this.wsService.closeSocket();

    }


    }

    this.notif = true;
    this.myTimer()

      this.localStorage.get('dataSocket').subscribe(
        data => {

          this.etape = JSON.parse(data)
          console.log("etape ", this.etape)
          if (this.etape.type) {
            if (this.etape.type == 'trade') {
              if (this.etape.step == 2) {
                this.boolTextAttente = true
              }
              if (this.etape.step == 3) {
                this.showEnvoiFonds()
              }
              if (this.etape.step == 4) {
                this.showClose()
              }

            }
            if (this.etape.type == 'verification') {
              if (this.etape.trade.steps == '2') {
                this.boolTextAttente = true
              }
              if (this.etape.trade.steps == '3') {
                this.showEnvoiFonds()
              }
              if (this.etape.trade.steps == '4') {
                this.showClose()
                this.wsService.closeSocket();
              }

            }
          }
        }
      )



  }


  get formControls(){

    return this.formAdresseBtc.controls;
  }

    copyText() {
      this._clipboardService.copyFromContent(this.formAdresseBtc.value.adresse);
      this.copy = true
    }


  /* Fonction Minuterie */
  myTimer(){
    this.updateSubscription = interval(1000).subscribe(
      (val) => {
        this.seconds = Math.floor(this.timer / 1000);
        this.minutes = Math.floor(this.seconds / 60);
        this.hours = Math.floor(this.minutes / 60);

        this.hours = parseInt(this.hours);
        // this.hours = 24-this.hours;
        this.minutes %= 60;
        this.seconds %= 60;

        this.idhours = this.hours < 10 ? '0' + this.hours : this.hours;
        this.idMinutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        this.idSeconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        this.progress = (this.timer*100)/86400000
        this.progress = parseInt(this.progress)
        this.progress = 100 - this.progress

        this.timer = this.timer - 1000;

      }
    )

  }

  showNotification(){
    this.notif = true;
    this.fonds = false;
    this.adresseBtc = false;
    this.close = false;
  }

  showEnvoiFonds(){
    this.fonds = true;
    this.notif = false;
    this.adresseBtc = false;
    this.close = false;


  }

  showAdresseBtc(){
    this.adresseBtc = true;
    this.fonds = false;
    this.notif = false;
    this.close = false;
  }

  showClose(){
    this.adresseBtc = false;
    this.fonds = false;
    this.notif = false;
    this.close = true;
  }


  // copyText() {
  //   this._clipboardService.copyFromContent(this.formAdresseBtc.value.adresse);
  //   this.copy = true
  // }

  step2(){
    console.log("step 2 clicked")
    console.log(this.token,this.signature, this.tradeId, this.formAdresseBtc.value.txid)
    let response = this.wsService.sendMessage({
      'Authorization': this.token,
      'Signature': this.signature,
      'step' : 2,
      'tradeId': this.tradeId,
      'txId': this.formAdresseBtc.value.txid
    });
    this.showNotification()
    this.spinner = true
    console.log("response server : ", response)
    // this.disableBtn = true

  }

  step4(){
    this.wsService.sendMessage({
      'Authorization': this.token,
      'Signature': this.signature,
      'step' : 4,
      'tradeId': this.tradeId,
    })
    this.showClose()
    setTimeout(()=>{
      this.router.navigate(['/user/offre'])
    }, 10000)
  }


  progressSpinner(){
      this.spinner = true

  }


  ngOnDestroy(): void {
    this.wsService.closeSocket();
    this.wsSubscription.unsubscribe
    if (this.stop) {
      clearInterval(this.stop)
    }
  }
}
