import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { WebsocketService } from 'src/app/parameters/websocket.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-achat',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.scss']
})
export class AchatComponent implements OnInit, OnDestroy {



  wsSubscription!: Subscription;
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
    adresse: new FormControl('', [Validators.required, Validators.pattern('^([13]{1}[a-km-zA-HJ-NP-Z1-9]{26,33}|bc1[a-z0-9]{39,59})$')]),
    transactionId: new FormControl(''),
    buyerWalletAdress: new FormControl('', [Validators.pattern('^([13]{1}[a-km-zA-HJ-NP-Z1-9]{26,33}|bc1[a-z0-9]{39,59})$')])
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
  boolTextAttente: boolean = false;

  constructor(
    private localStorage : LocalStorageService,
    private wsService: WebsocketService,
    private router: Router
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
        )
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
      // this.tradeHash = this.localStorage.get('tradeHash')
      // this.tradeId = this.localStorage.get('tradeId')

      this.token = this.dataCurrentTrades.token
      this.signature = this.dataCurrentTrades.signature
      // this.tradeHash = this.localStorage.get('tradeHash')
      // this.step = this.localStorage.get('step')



      // DONNEES UTILES POUR DECLENCHER LA CONNEXION WEBSOCKET
      this.tradeHash = this.dataCurrentTrades.user.currentTrade[0].tradeHash
      this.tradeId = this.dataCurrentTrades.user.currentTrade[0].id
      const webSocketUrl = environment.webSocketUrl + 'transaction/'+ this.tradeHash + '/';
      this.wsSubscription = this.wsService.createObservableSocket(webSocketUrl).subscribe(
        data => {
          this.localStorage.get('dataSocket').subscribe(
            data => {
              this.etape = JSON.parse(data)
            }
          )

          if (this.etape.type === "trade") {
            this.stepss = this.etape.step
          }
          else {
            this.stepss = this.etape.trade.steps
          }

          if (this.stepss == '2') {
            this.diasbleBtnConfirmSend = true
            this.showEnvoiFonds()
          }

          if (this.stepss == '3') {
            // this.disableBtn = true
            this.showEnvoiFonds()
          }
          if (this.stepss == '4') {
            this.diasbleBtnConfirmAdress = true
            this.showAdresseBtc()
          }
          if (this.stepss == '5') {
            // this.disableBtn = true
            this.showClose()
            this.wsService.closeSocket();
          }
        }
      )

      if (this.dataCurrentTrades.user.currentTrade[0].steps === '1') {
        this.showNotification()

      }
      if (this.dataCurrentTrades.user.currentTrade[0].steps === '2') {
        this.showEnvoiFonds()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': '2'}))
      }

      if (this.dataCurrentTrades.user.currentTrade[0].steps === '3') {
        this.showEnvoiFonds()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': '3'}))
      }
      if (this.dataCurrentTrades.user.currentTrade[0].steps === '4') {
        this.showAdresseBtc()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': '4'}))

      }
      if (this.dataCurrentTrades.user.currentTrade[0].steps === '5') {
        this.showClose()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': '5'}))
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
      this.token = this.dataCurrentTrades.token
      this.signature = this.dataCurrentTrades.signature
      const webSocketUrl = environment.webSocketUrl + 'transaction/'+ this.tradeHash + '/';
      this.wsSubscription = this.wsService.createObservableSocket(webSocketUrl).subscribe(
        data => {

          if (this.etape.type === "trade") {
            this.stepss = this.etape.step
          }
          if(this.etape.type === "verification") {
            this.stepss = this.etape.trade.steps
          }
          if (this.stepss == 2) {
            this.diasbleBtnConfirmSend = true
            this.showEnvoiFonds()
          }

          if (this.stepss == 3) {
            // this.disableBtn = true
            this.showEnvoiFonds()
          }
          if (this.stepss == 4) {
            this.diasbleBtnConfirmAdress = true
            this.showAdresseBtc()
          }
          if (this.stepss == 5) {
            // this.disableBtn = true
            this.showClose();
            this.wsService.closeSocket();

          }

        }
      )
      if (this.dataCurrentTrades.steps === '1') {
        this.showNotification()

      }
      if (this.dataCurrentTrades.steps === '2') {
        this.showEnvoiFonds()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 2}))
      }

      if (this.dataCurrentTrades.steps === '3') {
        this.showEnvoiFonds()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 3}))
      }
      if (this.dataCurrentTrades.steps === '4') {
        this.showAdresseBtc()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 4}))

      }
      if (this.dataCurrentTrades.steps === '5') {
        this.showClose()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 5}))
        this.wsService.closeSocket();

      }


    }

    this.notif = true;
    this.myTimer()

    this.stop = this.localStorage.get('dataSocket').subscribe(
        data => {
          this.etape = JSON.parse(data)
          if (this.etape.type) {
            if (this.etape.type == 'trade') {
              if (this.etape.step == 2) {
                this.showEnvoiFonds()
              }
              if (this.etape.step == 3) {
                this.boolTextAttente = true
              }
              if (this.etape.step == 4) {
                this.showAdresseBtc()
              }
              if (this.etape.step == 5) {
                this.showClose()
              }

            }
            if (this.etape.type == 'verification') {
              if (this.etape.trade.steps == '2') {
                this.showEnvoiFonds()
              }
              if (this.etape.trade.steps == '3') {
                this.boolTextAttente = true
              }
              if (this.etape.trade.steps == '4') {
                this.showAdresseBtc()
              }
              if (this.etape.trade.steps == '5') {
                this.showClose()
              }

            }
          }
        }
      )
  }

  get formControls(){

    return this.formAdresseBtc.controls;
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

  step3(){
    this.wsService.sendMessage({
      'Authorization': this.token,
      'Signature': this.signature,
      'step' : 3,
      'tradeId': this.tradeId,
      'transactionId': this.formAdresseBtc.value.transactionId
    })
    this.showEnvoiFonds()
    this.spinner = true
  }

  step5(){
    this.wsService.sendMessage({
      'Authorization': this.token,
      'Signature': this.signature,
      'step' : 5,
      'tradeId': this.tradeId,
      'buyerWalletAdress': this.formAdresseBtc.value.buyerWalletAdress
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
    if (this.stop) {
      clearInterval(this.stop)
    }
  }
}
