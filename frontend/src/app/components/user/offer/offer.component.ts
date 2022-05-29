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

  loading: boolean = true;

  @ViewChild('dt') table!: Table;
  constructor(private customerService: CustomerService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.customerService.getCustomersLarge().then(customers => {
        this.customers = customers;
        this.loading = false;
    });

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
