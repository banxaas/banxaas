import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { WebsocketService } from 'src/app/parameters/websocket.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-achateur',
  templateUrl: './achateur.component.html',
  styleUrls: ['./achateur.component.scss']
})
export class AchateurComponent implements OnInit, AfterViewInit {



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
    adresse: new FormControl(''),
    transactionId: new FormControl(''),
    buyerWalletAdress: new FormControl('')
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

  constructor(
    private localStorage : LocalStorageService,
    private wsService: WebsocketService,
    private router: Router
  ) { }
  ngOnInit(): void {
    // R2CUPERATION DES DONNEES POUR LES AFFICHER DANS LA VUE
    const currentTrade:any = this.localStorage.get('data')
    const dataCurrentTrade = JSON.parse(currentTrade)
    this.pseudoVendeur = dataCurrentTrade.user.currentTrade[0].ad.user.pseudo
    this.pseudoAcheteur = dataCurrentTrade.user.pseudo
    if (dataCurrentTrade.user.currentTrade[0].ad.amountType === 'F') {
      this.montant = dataCurrentTrade.user.currentTrade[0].ad.amountFixe    
    }else{
      this.montant = dataCurrentTrade.user.currentTrade[0].ad.amountMin +' - '+dataCurrentTrade.user.currentTrade[0].ad.amountMax
    }
    if (dataCurrentTrade.user.currentTrade[0].ad.quantityType === 'F') {
      this.quantityBtc = dataCurrentTrade.user.currentTrade[0].ad.quantityFixe    
    }else{
      this.quantityBtc = dataCurrentTrade.user.currentTrade[0].ad.quantityMin +' - '+dataCurrentTrade.user.currentTrade[0].ad.quantityMax
    }
    this.paymentMethod = dataCurrentTrade.user.currentTrade[0].ad.provider
    this.phone = dataCurrentTrade.user.currentTrade[0].ad.phone
    this.currency = dataCurrentTrade.user.currency


    this.timeLeft = new Date(dataCurrentTrade.user.currentTrade[0].startingDate)
    console.log(this.timeLeft);
    this.timeLeft = Math.floor(this.timeLeft.getTime());
    this.timeExp = this.timeLeft + 86400000
    this.time = new Date()
    this.time = Math.floor(this.time.getTime());

    if (this.timeExp > this.time) {
      this.timer = this.timeExp - this.time
    }
    console.log(this.timer);


    // this.tradeHash = this.localStorage.get('tradeHash')
    // this.tradeId = this.localStorage.get('tradeId')
    this.token = this.localStorage.get('token')
    this.signature = this.localStorage.get('signature')
    // this.tradeHash = this.localStorage.get('tradeHash')
    // this.step = this.localStorage.get('step')



    // DONNEES UTILES POUR DECLENCHER LA CONNEXION WEBSOCKET
    this.tradeHash = dataCurrentTrade.user.currentTrade[0].tradeHash
    this.tradeId = dataCurrentTrade.user.currentTrade[0].id
    this.localStorage.set('tradeId', this.tradeId)
    // console.log(this.tradeId);
    // this.tradeId = dataCurrentTrade.user.currentTrade[0].
    this.token = this.localStorage.get('token')
    this.signature = this.localStorage.get('signature')
    // this.step = this.localStorage.get('step')
    const webSocketUrl = environment.webSocketUrl + 'transaction/'+ this.tradeHash + '/';
    let dataSocket= {
      'token': this.token,
      'signature': this.signature,
      'tradeId': this.tradeId
  }
    this.wsSubscription = this.wsService.createObservableSocket(webSocketUrl).subscribe(
      data => {
        console.log(data);
        const step2:any  = this.localStorage.get('dataSocket')
        this.etape = JSON.parse(step2)
        // console.log(this.etape);
        
        if (this.etape.type === "trade") {
          this.stepss = this.etape.step
        } 
        if(this.etape.type === "verification") {          
          this.stepss = this.etape.trade.steps
        }
        console.log(this.stepss);

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
          this.showClose()
        }
        
      }
    )



    // APRES RECONNXION REDIRIGER VERS L'ETAPE ACTUELLE 
    if (dataCurrentTrade.user.currentTrade.length > 0) {
      
      this.tradeHash = dataCurrentTrade.user.currentTrade[0].tradeHash
      this.tradeId = dataCurrentTrade.user.currentTrade[0].id
      this.localStorage.set('tradeId', this.tradeId)
      console.log(dataCurrentTrade.user.currentTrade[0].steps);
                
      if (dataCurrentTrade.user.currentTrade[0].steps === '1') {
        this.showNotification()

      }
      if (dataCurrentTrade.user.currentTrade[0].steps === '2') {
        this.showEnvoiFonds()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 2}))
      }
      
      if (dataCurrentTrade.user.currentTrade[0].steps === '3') {
        this.showEnvoiFonds()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 3}))
      }
      if (dataCurrentTrade.user.currentTrade[0].steps === '4') {
        this.showAdresseBtc()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 4}))

      }
      if (dataCurrentTrade.user.currentTrade[0].steps === '5') {
        this.showClose()
        this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 5}))

      }
    }
    
    // const dataWebSocket:any = this.localStorage.get('dataSocket');
    // const donnee = JSON.parse(dataWebSocket)
    // this.pseudoVendeur = donnee.trade.ad.user.pseudo
    // console.log(donnee.trade.trader.pseudo);
    // console.log(this.localStorage.get('dataSocket'));
    

    this.notif = true;
    this.myTimer()
    
  }

  ngAfterViewInit() {


  }

  /* Fonction Minuterie */
  myTimer(){
    this.updateSubscription = interval(1000).subscribe(
      (val) => {
        // console.log(this.timer);
        
        this.seconds = Math.floor(this.timer / 1000);
        this.minutes = Math.floor(this.seconds / 60);
        this.hours = Math.floor(this.minutes / 60);
        // console.log(this.hours);
        
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
      'token': this.token,
      'signature': this.signature,
      'step' : 3,
      'tradeId': this.tradeId,
      'transactionId': this.formAdresseBtc.value.transactionId
    })
    this.showEnvoiFonds()
    this.spinner = true
  }

  step5(){
    this.wsService.sendMessage({
      'token': this.token,
      'signature': this.signature,
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
  closeSocket(){
    if (this.stepss == 5) {
      this.wsSubscription.unsubscribe
      console.log('Socket is closed!');
    }
  }
  ngOnDestroy(): void {
    this.closeSocket();
  }
}
