import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// import { ClipboardService } from 'ngx-clipboard';
import { interval, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { WebsocketService } from 'src/app/parameters/websocket.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-vendeur',
  templateUrl: './vendeur.component.html',
  styleUrls: ['./vendeur.component.scss']
})
export class VendeurComponent implements OnInit, OnDestroy {



  wsSubscription!: Subscription;
  seconds: any;
  minutes: any;
  hours: any;
  idhours: any;
  idMinutes: any;
  idSeconds: any;
  updateSubscription: any;
  progress: any;
  spinner: boolean = false ;
  update: any;
  notif: boolean = false
  fonds: boolean = false
  adrese: boolean = false
  copy: boolean = false
  
  tradeHash: any;
  tradeId: any;
  token: any;
  signature: any;
  step: any;
  pseudoAcheteur: any;
  status: any;


  formAdresseBtc = new FormGroup({
    adresse: new FormControl('bc1qn0r06gtwlamffet49fph9jnm9u2e2ylx5ns7qc'),
    txid: new FormControl('')
  })
  adresseBtc: boolean = false;
  close: boolean = false;
  pseudo: any;
  etape: any;
  disableBtn: boolean = false;
  pseudoVendeur: any;
  montant: any;
  paymentMethod: any;
  quantityBtc: any;
  currency: any;
  timeLeft: any;
  time: any;
  timer: any;
  timeExp: any;
  stepss: any;
  constructor(
    private localStorage : LocalStorageService,
    private customerService : CustomerService,
    private wsService: WebsocketService,
    private router: Router
  ) { 

  }


  ngOnInit(): void {

    // R2CUPERATION DES DONNEES POUR LES AFFICHER DANS LA VUE
    const currentTrade:any = this.localStorage.get('data')
    const dataCurrentTrade = JSON.parse(currentTrade)
    this.pseudoAcheteur = dataCurrentTrade.user.currentTrade[0].trader.pseudo
    this.pseudoVendeur = dataCurrentTrade.user.pseudo
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
    


    // DONNEES UTILES POUR DECLENCHER LA CONNEXION WEBSOCKET
    this.tradeHash = dataCurrentTrade.user.currentTrade[0].tradeHash
    this.tradeId = dataCurrentTrade.user.currentTrade[0].id
    this.localStorage.set('tradeId', this.tradeId)
    // console.log(this.tradeId);
    // this.tradeId = dataCurrentTrade.user.currentTrade[0].
    this.token = this.localStorage.get('token')
    this.signature = this.localStorage.get('signature')
    // this.step = this.localStorage.get('step')
  

    // LANCER LA CONNECTION WEBSOCKET 
    let webSocketUrl = environment.webSocketUrl + 'transaction/'+ this.tradeHash + '/';
    this.wsSubscription = this.wsService.createObservableSocket(webSocketUrl).subscribe(
      data => {
        console.log(data);
        const step3:any  = this.localStorage.get('dataSocket')
        this.etape = JSON.parse(step3)
        if (this.etape.type === "trade") {
          this.stepss = this.etape.step
        } else {
          console.log(this.etape);
          
          this.stepss = this.etape.trade.steps
        }
        console.log(this.stepss);
        
        // console.log(this.etape.trade.steps);
        
        if (this.stepss == 2) {
          this.showNotification()
          // this.disableBtn = false
        }
        if (this.stepss == 3) {
          this.disableBtn = true
          this.showEnvoiFonds()
        }
        if (this.stepss == 4) {
          this.showClose()
        }
        
      }
    )
    

    // APRES RECONNXION REDIRIGER VERS L'ETAPE ACTUELLE
    if (dataCurrentTrade.user.currentTrade[0].steps === '1') {
      this.showNotification()

    }
    if (dataCurrentTrade.user.currentTrade[0].steps === '2') {
      this.showNotification()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 2}))
    }
    
    if (dataCurrentTrade.user.currentTrade[0].steps === '3') {
      this.showEnvoiFonds()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 3}))
    }
    if (dataCurrentTrade.user.currentTrade[0].steps === '4' || dataCurrentTrade.user.currentTrade[0].steps === '5') {
      this.showClose()
      this.localStorage.set('dataSocket', JSON.stringify({'type':'trade', 'step': 4}))

    }


    this.notif = true;
    this.myTimer()
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


  // copyText() {
  //   this._clipboardService.copyFromContent(this.formAdresseBtc.value.adresse);
  //   this.copy = true
  // }

  step2(){
    this.wsService.sendMessage({
      'token': this.token,
      'signature': this.signature,
      'step' : 2,
      'tradeId': this.tradeId,
      'txId': this.formAdresseBtc.value.txid
    });
    this.showNotification()
    this.spinner = true
    // this.disableBtn = true

  }

  step4(){
    this.wsService.sendMessage({
      'token': this.token,
      'signature': this.signature,
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

  closeSocket(){
    if (this.stepss == 4) {
      this.wsSubscription.unsubscribe
      console.log('Socket is closed!');
    }
  }
  ngOnDestroy(): void {
    this.closeSocket();
  }
}
