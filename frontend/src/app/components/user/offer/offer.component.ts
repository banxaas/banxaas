import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Customer, User } from 'src/app/parameters/customer';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';
import { WebsocketService } from 'src/app/parameters/websocket.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  customers: Customer[] = [];

  selectedCustomers!: Customer[];

//   representatives!: Representative[];

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

  announceForm = new FormGroup({
    token: new FormControl(''),
    signature: new FormControl('')
  })

  initTradeForm = new FormGroup({
    token: new FormControl(''),
    signature: new FormControl(''),
    adId: new FormControl('')

  })

  
    status: any
    datauser: any;

  constructor(
    private customerService: CustomerService, 
    private primengConfig: PrimeNGConfig,
    private localStorage:LocalStorageService,
    private router: Router
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
    this.tabSeniority = [];
    console.log(this.datauser);
    
    this.pseudo = this.datauser.user.pseudo;
    const dataForm = this.announceForm.value;
    dataForm.token = this.datauser.token;
    dataForm.signature = this.datauser.signature;
    
    // this.customerService.getAds(dataForm, this.id).subscribe(
    //     response => {
    //         this.customers = response;
    //         response.forEach((element: any) => {
    //             this.seniority = element.user.seniority;
    //             this.tabSeniority.push(this.seniority)
    //             if (element.quantityType==="R") {
    //                 this.range_quantity.push([Number(element.quantityMin),Number(element.quantityMax)])
    //             }else {
    //                 this.range_quantity.push([Number((element.quantityFixe))])
    //             } 
    //             if (element.amountType==="R") {
    //                 this.range_amount.push([Number(element.amountMin),Number(element.amountMax)])
    //             }else {
    //                 this.range_amount.push([Number(element.amountFixe)])
    //             } 
                
    //         });
            
    //         this.loading = false;

            
    //     }
    // )
    
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
    this.listAnnonce(1)


    
  }

  filtreRangeQuantity(event: { target: any; }){

    let quantite = event.target.value;
    quantite = Number(quantite)  
      
    this.range_quantity.forEach(element => {
        
        switch (element.length) {

            case 2:
                
                if (element[0]<=quantite && quantite<=element[1]) {
                    
                    this.table.filter(quantite, 'quantityMin', 'lte');
                    this.table.filter(quantite, 'quantityMax', 'gte');
                }
                break;
        
            default:

                break;
        }

        
        
    });

  }

  filtreFixeQuantity(event: { target: any; }){

    let quantite = event.target.value;
    quantite = Number(quantite)  
      
    this.range_quantity.forEach(element => {
        
        switch (element.length) {

            case 1:
                
                if (element[0] === quantite ) {
                    
                    this.table.filter(quantite, 'quantityFixe', 'equals');
                }
                break;
        
            default:

                break;
        }

        
        
    });

  }

  
  filtreRangeAmount(event: { target: any; }){

    let amount = event.target.value;
    amount = Number(amount)  
      
    this.range_amount.forEach(element => {
        
        switch (element.length) {

            case 2:
                
                if (element[0]<=amount && amount<=element[1]) {
                    
                    this.table.filter(amount, 'amountMin', 'lte');
                    this.table.filter(amount, 'amountMax', 'gte');
                }
                break;
        
            default:

                break;
        }

        
        
    });

  }

  filtreFixeAmount(event: { target: any; }){

    let amount = event.target.value;
    amount = Number(amount)  
      
    this.range_amount.forEach(element => {
        
        switch (element.length) {

            case 1:
                
                if (element[0] === amount ) {
                    
                    this.table.filter(amount, 'amountFixe', 'equals');
                }
                break;
        
            default:

                break;
        }

        
        
    });

  }

  filtreSeniority(event: { target: any; }){
    let senior = event.target.value;
    
    this.tabSeniority.forEach(element => {
        if (senior != element) {
            
            this.table.filter(senior, 'user.seniority', 'startsWith');
            
        }
    })

  }

    listAnnonce(id:number){
        
        const dataForm = this.announceForm.value;
        dataForm.token = this.datauser.token;
        dataForm.signature = this.datauser.signature;
        this.customerService.getAds(dataForm, id).subscribe(
            response => {
                console.log(response);
                
                // this.customers = response;
                // console.log(this.customers);
                
                response.forEach((element: any) => {
                    if (element.status === 'I') {
                        this.customers.push(element)
                    }
                    // if (element.user.seniority < 86400) {
                    //     this.seniority = 'Aujourd\'hui'
                    // }
                    // else {
                    //     this.seniority = Math.trunc(element.user.seniority / 86400) + ' jour(s)'
        
                    // }
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
                console.log(this.customers);
                
                
                this.loading = false;
                
            }
        )
    }
    reset(){
        this.id = 1;
        this.listAnnonce(this.id);
    }
    next(){
        if (this.id >= 1) {
            this.id = this.id + 1
            this.listAnnonce(this.id)
            this.disableButtonNext = false
            this.disableButtonPrev = false
            if (this.customers.length != 10) {
                
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
            this.listAnnonce(this.id)

        }
        else {
            this.disableButtonPrev = true
            this.disableButtonNext = false
        }
    }

    accepter(id:number){
        const dataInitTradeForm = this.initTradeForm.value
        dataInitTradeForm.token = this.datauser.token;
        dataInitTradeForm.signature = this.datauser.signature;
        dataInitTradeForm.adId = id;
        // console.log(dataInitTradeForm);
        this.customerService.initTrade(dataInitTradeForm).subscribe(
            response => {
                // console.log(response);
                if (response.status === "SUCCESSFUL") {

                    this.localStorage.set('currentTrade', JSON.stringify(response))

                    if (response.currentTrade.ad.sens === "V") {
                        this.router.navigate(['/user/transaction/acheteur'])
                    }
                    else {
                        this.router.navigate(['/user/transaction/vendeur'])
                        
                    }
                    
                    // const webSocketUrl = environment.webSocketUrl + 'transaction/'+ response.tradeHash + '/';
                    // this.wsService.createObservableSocket(webSocketUrl).subscribe(
                    //     data => {
                    //         this.status = this.wsService.sendMessage({
                    //         'token': data.token,
                    //         'signature': data.signature,
                    //         'tradeId': response.tradeId
                    //         });
                    //         console.log(this.status);
                    //         ;
                            
                    //     } 
                    // )
                    
                        // data => {
                            
                            
                        //     // console.log(data.onmessage.message);
                            
                        //     // console.log("data");
                            
                        //     this.wsService.sendMessage(dataSocket);
                        //     console.log(data);

                        //     // console.log(this.messageFromServer.onmessage);
                            
                        // }

                    // const valueTest = this.wsService.openSocket(webSocketUrl)
                    // const test = this.wsService.envoiMessage(dataSocket)
                    // console.log(test);
                    
                    // console.log(valueTest);
                    
                    
                }
                
            }
        ) 
        
    }

}
