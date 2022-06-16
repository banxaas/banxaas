import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionComponent implements OnInit {

  
items!: MenuItem[];
style:any
activeIndex: number = 0;
  constructor() { }

  ngOnInit(): void {

    this.items = [{
      label: 'Personal',
      command: (event: any) => {
          this.activeIndex = 0;
      }
  },
  {
      label: 'Seat',
      command: (event: any) => {
          this.activeIndex = 1;
      }
  },
  {
      label: 'Payment',
      command: (event: any) => {
          this.activeIndex = 2;
      }
  },
  {
      label: 'Confirmation',
      command: (event: any) => {
          this.activeIndex = 3;
      }
  }
];
}

}
