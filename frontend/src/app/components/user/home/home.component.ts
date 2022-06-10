import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pseudo!: string | null;
  rate: any

  constructor(
    private localStorage: LocalStorageService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    
    // this.pseudo = this.localStorage.get('user');
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
    console.log('test');
    const cfa = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 2
    });
    
    this.customerService.getRateBitcoin().subscribe(
      response => {
        this.rate = cfa.format(response.data.rate)
        console.log(this.rate);
      }
    )
  }

}
