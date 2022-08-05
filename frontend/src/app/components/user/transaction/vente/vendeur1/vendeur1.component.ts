import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { ClipboardService } from 'ngx-clipboard';
import { interval } from 'rxjs';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-vendeur1',
  templateUrl: './vendeur1.component.html',
  styleUrls: ['./vendeur1.component.scss']
})
export class Vendeur1Component implements OnInit, AfterViewInit {

 

  difference: number = 86400000;
  seconds: any;
  minutes: any;
  hours: any;
  idhours: any;
  idMinutes: any;
  idSeconds: any;
  updateSubscription: any;
  progress: number = 0;
  update: any;
  notif: boolean = false
  fonds: boolean = false
  adrese: boolean = false
  copy: boolean = false


  formAdresseBtc = new FormGroup({
    adresse: new FormControl('bc1qn0r06gtwlamffet49fph9jnm9u2e2ylx5ns7qc')
  })
  adresseBtc: boolean = false;
  close: boolean = false;
  pseudo: any;
  constructor(
    private localStorage : LocalStorageService,
    private customerService : CustomerService,
    // private _clipboardService: ClipboardService
  ) { }
  ngOnInit(): void {
    
    this.notif = true;
  }

  ngAfterViewInit() {
    const datauser: any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
    // this.showNotification();
    
    this.updateSubscription = interval(1000).subscribe(
      (val) => {
          
        this.seconds = Math.floor(this.difference / 1000);
        this.minutes = Math.floor(this.seconds / 60);
        this.hours = Math.floor(this.minutes / 60);
        
        this.hours %= 24;
        this.minutes %= 60;
        
        this.seconds %= 60;
        this.idhours = this.hours < 10 ? '0' + this.hours : this.hours;
        this.idMinutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        this.idSeconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        this.difference = this.difference - 1000;

      }
    )

    this.update = interval(864000).subscribe(
      (val) => {
        this.progress = this.progress + 1;
        console.log(this.progress);
        
      }
    )
  }

  /* Fonction Minuterie */
  myTimer(){
    this.updateSubscription = interval(1000).subscribe(
      (val) => {
          
        this.seconds = Math.floor(this.difference / 1000);
        this.minutes = Math.floor(this.seconds / 60);
        this.hours = Math.floor(this.minutes / 60);
        
        this.hours %= 24;
        this.minutes %= 60;
        
        this.seconds %= 60;
        this.idhours = this.hours < 10 ? '0' + this.hours : this.hours;
        this.idMinutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        this.idSeconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        this.difference = this.difference - 1000;

      }
    )

    this.update = interval(864000).subscribe(
      (val) => {
        this.progress = this.progress + 1;
        console.log(this.progress);
        
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



}
