import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'app/parameters/customerservice';
import { Ticket } from 'app/parameters/ticket';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  profil: any;
  password: any;
  trade: any;
  hidden!: boolean
  hiddenTicket!: boolean

  ticket!: Ticket[]
  constructor(
    private customerService : CustomerService
  ) { }

  ngOnInit(): void {

    this.customerService.getTicketsLarge().then(data => this.ticket = data);
  }

  toggleModal(){
    this.hidden  = true;
  }
  toggleModalTicket(){
    this.hiddenTicket  = true;
  }

}
