
import { AfterViewInit, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ClipboardService } from 'ngx-clipboard';
import { interval } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements AfterViewInit {



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
  copy: boolean = false

  formAdresseBtc = new FormGroup({
    adresse: new FormControl('bc1qn0r06gtwlamffet49fph9jnm9u2e2ylx5ns7qc')
  })
  constructor(
    private clipboardApi: ClipboardService
  ) { }
  copyText() {
    this.clipboardApi.copyFromContent(this.formAdresseBtc.value.adresse);
    this.copy = true
    console.log('test');
    
  }
  ngAfterViewInit() {
    this.myTimer();
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

}
