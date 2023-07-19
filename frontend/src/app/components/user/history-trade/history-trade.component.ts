import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Trade, User } from 'app/parameters/customer';
import { CustomerService } from 'app/parameters/customerservice';
import { Table } from 'primeng/table';
import { LocalStorageService } from 'app/parameters/local-storage.service';

@Component({
  selector: 'app-history-trade',
  templateUrl: './history-trade.component.html',
  styleUrls: ['./history-trade.component.scss']
})
export class HistoryTradeComponent implements OnInit {
  transactions: Trade[] = [];
  selectedTrades!: Trade[];

  statuses!: any[];
  paiementMethode!: any[];
  range_quantity: any[] = [];
  range_amount: any[] = [];
  tabSeniority: User[] = [];
  seniority:any
  pseudo: any


  messageFromServer!: WebSocket;
  wsSubscription!: Subscription;

  loading: boolean = true;
  disableButtonNext: boolean = false;
  disableButtonPrev: boolean = false;

  id: number = 1

  status: any
  datauser: any;
  progress!: boolean;

  constructor(
    private customerService: CustomerService,
    private localStorage:LocalStorageService,
    private primengConfig: PrimeNGConfig,
    ) {
      this.localStorage.get('data').subscribe(
        data => {
          this.datauser = JSON.parse(data)
        }
      );
    }

  @ViewChild('dt') table!: Table;
  ngOnInit(): void {
    this.reset();
    this.range_quantity = [];
    this.range_amount = [];
    // this.tabSeniority = [];
    this.pseudo = this.datauser.user.pseudo


    this.paiementMethode = [
      {name: "Orange", value: 'orange'},
      {name: "Wave", value: 'wave'},
      {name: "Free", value: 'free'}
    ];

    this.statuses = [
        {label: 'Vente', value: 'V'},
        {label: 'Achat', value: 'A'}
    ]
    this.loading = false;
    this.primengConfig.ripple = true;
  }


  listTransactions(id:number){

    this.customerService.getTransactions(id).subscribe(
        response => {
          console.log(response);
          let data = response.transactions
          data.forEach((element: any) => {
              if (data.length > 10) {
                  this.transactions.push(element)
              } else {
                  this.transactions = data
              }
              if (element.quantityType==="R") {
                  this.range_quantity.push([Number(element.quantityMin),Number(element.quantityMax)])
              }else {
                  this.range_quantity.push([Number(element.quantityFixe)])
              }
              if (element.amountType==="R") {
                  this.range_amount.push([Number(element.amountMin),Number(element.amountMax)])
              }else {
                  this.range_amount.push([Number(element.amountMixe)])
              }

          });
          console.log(this.transactions);

          this.loading = false;

        }
      )
    }
    reset(){
        this.id = 1;
        this.listTransactions(this.id);
    }
    next(){
        if (this.id >= 1) {
            this.id = this.id + 1
            this.listTransactions(this.id)
            this.disableButtonNext = false
            this.disableButtonPrev = false
            if (this.transactions.length != 10) {

                this.disableButtonNext = true
            }
        }
        else {
            this.disableButtonNext = true
            this.disableButtonPrev = false
        }
    }
    prev(){
        if (this.id >= 2) {
            this.disableButtonPrev = false
            this.disableButtonNext = false
            this.id = this.id - 1;
            this.listTransactions(this.id)

        }
        else {
            this.disableButtonPrev = true
            this.disableButtonNext = false
        }
    }

}
