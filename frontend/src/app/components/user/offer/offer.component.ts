import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/parameters/customer';
import { CustomerService } from 'src/app/parameters/customerservice';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  customers!: Customer[];

  selectedCustomers!: Customer[];

//   representatives!: Representative[];

  statuses!: any[];
  paiementMethode!: any[];
  range_quantity: any[] = [];
  range_amount: any[] = [];

  loading: boolean = true;

  @ViewChild('dt') table!: Table;
  constructor(private customerService: CustomerService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.range_quantity = [];
    this.range_amount = [];

    this.customerService.getCustomersLarge().then((customers: Customer[]) => {
        this.customers = customers;
        this.customers.forEach(element => {
        if (element.quantite_type==="range") {
            this.range_quantity.push([element.quantite_min,element.quantite_max])
        }else {
            this.range_quantity.push([element.quantite_fixe])
        } 
        if (element.montant_type==="range") {
            this.range_amount.push([element.montant_min,element.montant_max])
        }else {
            this.range_amount.push([element.montant_fixe])
        } 
        
    });
        
        this.loading = false;
    });
    console.log(this.range_quantity);
    
    this.paiementMethode = [
        {name: "Orange", value: 'orange'},
        {name: "Wave", value: 'wave'},
        {name: "Free", value: 'free'}
    ];

    this.statuses = [
        {label: 'Vente', value: 'vente'},
        {label: 'Achat', value: 'achat'}
    ]
    this.primengConfig.ripple = true;
  }

  filtrequantite(event: { target: any; }){

    const quantite = event.target.value;    
    this.range_quantity.forEach(element => {

        if (element.length===2) {
            if (element[0]<=quantite && quantite<=element[1]) {
                this.table.filter(quantite, 'quantite_min', 'lte');
                this.table.filter(quantite, 'quantite_max', 'gte');
            }
        }
        else {
            if (element[0]==quantite) {
                
                this.table.filter(quantite, 'quantite_fixe', 'equals')
            }
        }

    });
  }

  filtremontant(event: { target: any; }){
      

    let amount = event.target.value;
    console.log(amount);
    
    this.range_amount.forEach(element => {
        

        if (element.length===2) {
            if (element[0]<=amount && amount<=element[1]) {
                
                console.log(amount);
                amount = parseInt(amount)
                this.table.filter(amount, 'montant_min', 'lte');
                this.table.filter(amount, 'montant_max', 'gte');
            }
        }
        if (element.length===1) {
            if (element[0]==amount) {
                amount = parseInt(amount)
                this.table.filter(amount, 'montant_fixe', 'equals')
            }
        }

    });
  }
  
  onActivityChange(event: { target: any; }) {
    const value = event.target.value;
    if (value && value.trim().length) {
        const activity = parseInt(value);
        

        if (!isNaN(activity)) {
            this.table.filter(activity, 'marge', 'gte');
        }
    }
}

onDateSelect(value: any) {
    this.table.filter(this.formatDate(value), 'date', 'equals')
}

formatDate(date: { getMonth: () => number; getDate: () => any; getFullYear: () => string; }) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = 0 + month;
    }

    if (day < 10) {
        day = 0 + day;
    }

    return date.getFullYear() + '-' + month + '-' + day;
}

onRepresentativeChange(event: { value: any; }) {
    this.table.filter(event.value, 'sens', 'in')
}

}
