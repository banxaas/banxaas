import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  toggleModal(){
    this.hidden  = true;
  }

}